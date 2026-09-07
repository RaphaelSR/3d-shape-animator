import type {
  ExportFormat,
  ExportSession,
  ExportSettings,
  SceneHandle,
} from './types';
import workerUrl from 'gif.js/dist/gif.worker.js?url';
export const VIDEO_TYPES = {
  mp4: ['video/mp4;codecs=avc1.42001E', 'video/mp4'],
  webm: ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'],
};
export function supportedVideoType(format: 'mp4' | 'webm'): string | undefined {
  return typeof MediaRecorder !== 'undefined'
    ? VIDEO_TYPES[format].find(type => MediaRecorder.isTypeSupported(type))
    : undefined;
}
export function availableFormats(): ExportFormat[] {
  return [
    'png',
    'gif',
    ...(['mp4', 'webm'] as const).filter(format => supportedVideoType(format)),
  ];
}
function checkAbort(signal: AbortSignal): void {
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
}
function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    checkAbort(signal);
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    };
    const timer = setTimeout(
      () => {
        signal.removeEventListener('abort', abort);
        resolve();
      },
      Math.max(0, ms)
    );
    signal.addEventListener('abort', abort, { once: true });
  });
}
async function encodeGif(
  session: ExportSession,
  settings: ExportSettings,
  signal: AbortSignal,
  progress: (value: number) => void
): Promise<Blob> {
  const { default: GIF } = await import('gif.js');
  checkAbort(signal);
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: settings.resolution[0],
    height: settings.resolution[1],
    workerScript: workerUrl,
  });
  const copy = document.createElement('canvas');
  [copy.width, copy.height] = settings.resolution;
  const ctx = copy.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const frames = Math.round(settings.fps * settings.duration);
  for (let frame = 0; frame < frames; frame++) {
    checkAbort(signal);
    session.render(frame / settings.fps);
    ctx.drawImage(session.canvas, 0, 0);
    gif.addFrame(ctx, {
      copy: true,
      delay:
        (Math.round(((frame + 1) * 100) / settings.fps) -
          Math.round((frame * 100) / settings.fps)) *
        10,
    });
    progress(((frame + 1) / frames) * 0.5);
    await wait(0, signal);
  }
  // gif.js does not terminate idle workers after completion.
  const internal = gif as unknown as {
    freeWorkers?: Worker[];
    activeWorkers?: Worker[];
  };
  const workers = new Set<Worker>();
  const terminate = () => {
    [
      ...(internal.freeWorkers ?? []),
      ...(internal.activeWorkers ?? []),
    ].forEach(worker => workers.add(worker));
    workers.forEach(worker => worker.terminate());
  };
  try {
    return await new Promise<Blob>((resolve, reject) => {
      let done = false;
      const finish = (error?: Error, blob?: Blob) => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        signal.removeEventListener('abort', abort);
        if (error) reject(error);
        else if (blob) resolve(blob);
      };
      const abort = () => {
        finish(new DOMException('Cancelled', 'AbortError'));
        gif.abort();
      };
      const timeout = setTimeout(() => {
        finish(new Error('GIF encoding timed out'));
        gif.abort();
      }, 60000);
      signal.addEventListener('abort', abort, { once: true });
      gif.on('finished', blob => finish(undefined, blob));
      gif.on('abort', () =>
        finish(new DOMException('Cancelled', 'AbortError'))
      );
      gif.on('progress', value => progress(0.5 + value * 0.5));
      gif.render();
      [
        ...(internal.freeWorkers ?? []),
        ...(internal.activeWorkers ?? []),
      ].forEach(worker => {
        workers.add(worker);
        worker.addEventListener(
          'error',
          () => {
            finish(new Error('GIF worker failed'));
            gif.abort();
          },
          { once: true }
        );
      });
    });
  } finally {
    terminate();
    copy.width = 0;
    copy.height = 0;
  }
}
async function encodeVideo(
  session: ExportSession,
  settings: ExportSettings,
  signal: AbortSignal,
  progress: (value: number) => void
): Promise<Blob> {
  const format = settings.format as 'mp4' | 'webm';
  const mimeType = supportedVideoType(format);
  if (!mimeType || !session.canvas.captureStream)
    throw new Error('Video format unavailable');
  session.render(0);
  const stream = session.canvas.captureStream(settings.fps);
  let recorder: MediaRecorder | undefined;
  try {
    recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: settings.quality === 'high' ? 12_000_000 : 6_000_000,
    });
    const activeRecorder = recorder;
    const chunks: Blob[] = [];
    let recorderError: Error | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const stopped = new Promise<Blob>((resolve, reject) => {
      activeRecorder.ondataavailable = event => {
        if (event.data.size) chunks.push(event.data);
      };
      activeRecorder.onstop = () =>
        resolve(new Blob(chunks, { type: activeRecorder.mimeType }));
      activeRecorder.onerror = () => {
        recorderError = new Error('Video recording failed');
        reject(recorderError);
      };
      timeout = setTimeout(
        () => reject(new Error('Video recording timed out')),
        settings.duration * 1000 + 15000
      );
    });
    void stopped.catch(() => undefined);
    try {
      activeRecorder.start();
      const start = performance.now();
      const durationMs = settings.duration * 1000;
      while (performance.now() - start < durationMs) {
        checkAbort(signal);
        if (recorderError) throw recorderError;
        const elapsed = performance.now() - start;
        session.render(elapsed / 1000);
        progress(Math.min(elapsed / durationMs, 1));
        // Skip missed frames instead of extending the clip on slower GPUs.
        const nextFrame =
          ((Math.floor(((performance.now() - start) * settings.fps) / 1000) +
            1) *
            1000) /
          settings.fps;
        await wait(
          start + Math.min(nextFrame, durationMs) - performance.now(),
          signal
        );
      }
      progress(1);
      activeRecorder.stop();
      const blob = await stopped;
      checkAbort(signal);
      if (!blob.size) throw new Error('Empty recording');
      return blob;
    } finally {
      clearTimeout(timeout);
    }
  } finally {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }
}
export async function exportAnimation(
  source: SceneHandle,
  settings: ExportSettings,
  signal: AbortSignal,
  progress: (value: number) => void
): Promise<Blob> {
  checkAbort(signal);
  if (
    settings.resolution.some(
      value => !Number.isInteger(value) || value < 1 || value > 1920
    ) ||
    !Number.isFinite(settings.duration) ||
    settings.duration < 1 ||
    settings.duration > 10 ||
    ![15, 30, 60].includes(settings.fps)
  )
    throw new Error('Invalid export settings');
  let session: ExportSession | undefined;
  try {
    session = source.createExport(settings);
    session.render(0);
    if (settings.format === 'png') {
      const canvas = session.canvas;
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          value =>
            value ? resolve(value) : reject(new Error('Image export failed')),
          'image/png'
        )
      );
      checkAbort(signal);
      progress(1);
      return blob;
    }
    if (settings.format === 'gif')
      return await encodeGif(session, settings, signal, progress);
    return await encodeVideo(session, settings, signal, progress);
  } finally {
    session?.dispose();
  }
}
export function downloadBlob(blob: Blob, format: ExportFormat): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `geometry-motion-${Date.now()}.${format}`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
