import { saveAs } from 'file-saver';
import GIF from 'gif.js';
import type { ExportSettings } from './types';

export async function exportAnimation(settings: ExportSettings): Promise<void> {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('Canvas não encontrado');
  }

  const { resolution, fps, format } = settings;
  const [width, height] = resolution;

  try {
    if (format === 'gif') {
      await exportAsGif(canvas, width, height, fps);
    } else if (format === 'mp4') {
      await exportAsMP4(canvas, width, height, fps);
    } else {
      await exportAsImage(canvas, width, height);
    }
  } catch (error) {
    console.error('Erro no export:', error);
    throw new Error('Falha ao exportar a animação. Tente novamente.');
  }
}

async function exportAsImage(canvas: HTMLCanvasElement, width: number, height: number): Promise<void> {
  // Create a temporary canvas with the desired resolution
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('Contexto do canvas não disponível');
  }

  tempCanvas.width = width;
  tempCanvas.height = height;
  
  // Draw the original canvas onto the temp canvas with scaling
  tempCtx.drawImage(canvas, 0, 0, width, height);
  
  // Convert to blob and download
  tempCanvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `geometry-animation-${Date.now()}.png`);
    }
  }, 'image/png');
}

async function exportAsGif(canvas: HTMLCanvasElement, width: number, height: number, fps: number): Promise<void> {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
  });

  const frameCount = fps * 3; // 3 seconds of animation
  const frameDelay = 1000 / fps;
  
  // Create temporary canvas for frame capture
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('Contexto do canvas não disponível');
  }
  
  tempCanvas.width = width;
  tempCanvas.height = height;

  for (let i = 0; i < frameCount; i++) {
    // Wait for next frame
    await new Promise(resolve => setTimeout(resolve, frameDelay));
    
    // Capture current frame
    tempCtx.clearRect(0, 0, width, height);
    tempCtx.drawImage(canvas, 0, 0, width, height);
    
    // Add frame to GIF
    gif.addFrame(tempCanvas, { delay: frameDelay });
  }

  return new Promise((resolve, reject) => {
    gif.on('finished', function(blob: Blob) {
      saveAs(blob, `geometry-animation-${Date.now()}.gif`);
      resolve();
    });

    gif.on('abort', function() {
      reject(new Error('Criação do GIF foi cancelada'));
    });

    gif.render();
  });
}

async function exportAsMP4(canvas: HTMLCanvasElement, _width: number, _height: number, fps: number): Promise<void> {
  // Check if MediaRecorder is supported
  if (!('MediaRecorder' in window)) {
    throw new Error('Gravação de vídeo não suportada neste navegador');
  }

  const stream = canvas.captureStream(fps);
  const chunks: Blob[] = [];

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9' // Fallback to vp8 if vp9 not supported
  });

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      saveAs(blob, `geometry-animation-${Date.now()}.webm`);
      resolve();
    };

    mediaRecorder.onerror = () => {
      reject(new Error('Erro na gravação do vídeo'));
    };

    // Record for 3 seconds
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 3000);
  });
}
