export type GeometryType = 
  | 'cube' 
  | 'sphere' 
  | 'pyramid' 
  | 'cylinder' 
  | 'cone' 
  | 'torus'
  | 'octahedron'
  | 'dodecahedron'
  | 'icosahedron'
  | 'tetrahedron'
  | 'capsule'
  | 'ring';

export type Theme = 'light' | 'dark';

export type ExportQuality = 'high' | 'medium' | 'low';

export interface Color {
  hex: string;
  name?: string;
}

export interface MotionControls {
  spinSpeed: number;
  tiltSpeed: number;
  bounceAmplitude: number;
  orbitRadius: number;
  zoom: number;
}

export interface ExportSettings {
  quality: ExportQuality;
  format: 'mp4' | 'gif';
  fps: number;
  resolution: [number, number];
}

export interface AppState {
  selectedGeometry: GeometryType;
  primaryColor: Color;
  secondaryColor: Color;
  motionControls: MotionControls;
  theme: Theme;
  isAnimating: boolean;
}

export interface GeometryConfig {
  type: GeometryType;
  label: string;
  icon: string;
}

export const GEOMETRY_CONFIGS: GeometryConfig[] = [
  { type: 'cube', label: 'Cube', icon: '🟧' },
  { type: 'sphere', label: 'Sphere', icon: '🔴' },
  { type: 'pyramid', label: 'Pyramid', icon: '🔺' },
  { type: 'cylinder', label: 'Cylinder', icon: '🟫' },
  { type: 'cone', label: 'Cone', icon: '🔶' },
  { type: 'torus', label: 'Torus', icon: '🟤' },
  { type: 'octahedron', label: 'Octahedron', icon: '💎' },
  { type: 'dodecahedron', label: 'Dodecahedron', icon: '🎲' },
  { type: 'icosahedron', label: 'Icosahedron', icon: '⚽' },
  { type: 'tetrahedron', label: 'Tetrahedron', icon: '🔻' },
  { type: 'capsule', label: 'Capsule', icon: '💊' },
  { type: 'ring', label: 'Ring', icon: '💍' },
];

export const DEFAULT_COLORS: Color[] = [
  { hex: '#FF6B35', name: 'Orange' },
  { hex: '#F7931E', name: 'Light Orange' },
  { hex: '#FFD23F', name: 'Yellow' },
  { hex: '#06FFA5', name: 'Mint' },
  { hex: '#4ECDC4', name: 'Teal' },
  { hex: '#45B7D1', name: 'Blue' },
  { hex: '#96CEB4', name: 'Light Green' },
  { hex: '#FFEAA7', name: 'Light Yellow' },
  { hex: '#DDA0DD', name: 'Plum' },
  { hex: '#98D8C8', name: 'Aqua' },
  { hex: '#F7DC6F', name: 'Gold' },
  { hex: '#BB8FCE', name: 'Lavender' },
];

export const EXPORT_PRESETS: Record<ExportQuality, ExportSettings> = {
  high: {
    quality: 'high',
    format: 'mp4',
    fps: 60,
    resolution: [1920, 1080],
  },
  medium: {
    quality: 'medium',
    format: 'mp4',
    fps: 30,
    resolution: [1280, 720],
  },
  low: {
    quality: 'low',
    format: 'gif',
    fps: 15,
    resolution: [854, 480],
  },
};
