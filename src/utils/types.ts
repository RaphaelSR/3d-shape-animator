export const GEOMETRIES = [
  'cube',
  'sphere',
  'pyramid',
  'cylinder',
  'cone',
  'torus',
  'octahedron',
  'dodecahedron',
  'icosahedron',
  'tetrahedron',
  'capsule',
  'ring',
] as const;
export type GeometryType = (typeof GEOMETRIES)[number];
export type Theme = 'light' | 'dark';
export type Language = 'pt-BR' | 'en-US';
export interface MotionControls {
  spinSpeed: number;
  tiltSpeed: number;
  bounceAmplitude: number;
  orbitRadius: number;
}
export interface Appearance {
  primary: string;
  secondary: string;
  gradient: boolean;
  metalness: number;
  roughness: number;
}
export interface MotionPhase {
  time: number;
  x: number;
  y: number;
}
export interface Pose {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
}
export const DEFAULT_MOTION: MotionControls = {
  spinSpeed: 1,
  tiltSpeed: 0.5,
  bounceAmplitude: 0.2,
  orbitRadius: 0,
};
export const MOTION_LIMITS: Record<
  keyof MotionControls,
  [number, number, number]
> = {
  spinSpeed: [0, 3, 0.1],
  tiltSpeed: [0, 2, 0.1],
  bounceAmplitude: [0, 1, 0.1],
  orbitRadius: [0, 3, 0.1],
};
export const DEFAULT_APPEARANCE: Appearance = {
  primary: '#387BFF',
  secondary: '#86E8E1',
  gradient: true,
  metalness: 0.35,
  roughness: 0.26,
};
export const PALETTES = [
  ['#387BFF', '#86E8E1'],
  ['#F0693E', '#FFD17D'],
  ['#AD6DF5', '#F7A2D7'],
  ['#138A6A', '#BDF6C6'],
  ['#DBDFE8', '#737E94'],
  ['#E14973', '#F9B48A'],
];
export type ExportFormat = 'png' | 'gif' | 'webm' | 'mp4';
export type ExportQuality = 'high' | 'medium' | 'low';
export interface ExportSettings {
  format: ExportFormat;
  quality: ExportQuality;
  fps: number;
  resolution: [number, number];
  duration: number;
}
export const EXPORT_PRESETS = {
  high: { fps: 60, resolution: [1920, 1080] as [number, number] },
  medium: { fps: 30, resolution: [1280, 720] as [number, number] },
  low: { fps: 15, resolution: [854, 480] as [number, number] },
};
export interface ExportSession {
  canvas: HTMLCanvasElement;
  render: (seconds: number) => void;
  dispose: () => void;
}
export interface SceneHandle {
  createExport: (settings: ExportSettings) => ExportSession;
  reframe: () => void;
  zoom: (factor: number) => void;
}
