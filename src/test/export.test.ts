import { afterEach, expect, it, vi } from 'vitest';
import {
  availableFormats,
  exportAnimation,
  supportedVideoType,
} from '@/utils/exportUtils';
import { EXPORT_PRESETS, type SceneHandle } from '@/utils/types';
afterEach(() => vi.unstubAllGlobals());
const settings = {
  format: 'png' as const,
  quality: 'medium' as const,
  duration: 3,
  ...EXPORT_PRESETS.medium,
};
it('offers only supported video types and falls back from VP9 to VP8', () => {
  vi.stubGlobal('MediaRecorder', {
    isTypeSupported: (type: string) => type === 'video/webm;codecs=vp8',
  });
  expect(supportedVideoType('webm')).toBe('video/webm;codecs=vp8');
  expect(availableFormats()).toEqual(['png', 'gif', 'webm']);
  vi.stubGlobal('MediaRecorder', undefined);
  expect(availableFormats()).toEqual(['png', 'gif']);
});
it('releases render resources on image encoder failure', async () => {
  const dispose = vi.fn(),
    render = vi.fn();
  const source = {
    createExport: () => ({
      canvas: {
        toBlob: (cb: (blob: Blob | null) => void) => cb(null),
      } as HTMLCanvasElement,
      render,
      dispose,
    }),
  } as unknown as SceneHandle;
  await expect(
    exportAnimation(source, settings, new AbortController().signal, vi.fn())
  ).rejects.toThrow();
  expect(dispose).toHaveBeenCalledOnce();
});
it('aborts before allocating a renderer and validates memory bounds', async () => {
  const source = { createExport: vi.fn() } as unknown as SceneHandle;
  const controller = new AbortController();
  controller.abort();
  await expect(
    exportAnimation(source, settings, controller.signal, vi.fn())
  ).rejects.toMatchObject({ name: 'AbortError' });
  await expect(
    exportAnimation(
      source,
      { ...settings, duration: 1000 },
      new AbortController().signal,
      vi.fn()
    )
  ).rejects.toThrow('Invalid');
  expect(source.createExport).not.toHaveBeenCalled();
});
