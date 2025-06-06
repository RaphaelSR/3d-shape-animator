export interface Translations {
  app: {
    title: string;
    subtitle: string;
  };
  geometry: {
    title: string;
    cube: string;
    sphere: string;
    cylinder: string;
    cone: string;
    torus: string;
    pyramid: string;
    octahedron: string;
    dodecahedron: string;
    icosahedron: string;
    tetrahedron: string;
    capsule: string;
    ring: string;
  };
  colors: {
    title: string;
    primaryColor: string;
    secondaryColor: string;
    enableGradient: string;
  };
  motion: {
    title: string;
    rotationSpeed: string;
    tiltSpeed: string;
    bounceAmplitude: string;
    orbitRadius: string;
    position: string;
    x: string;
    y: string;
    z: string;
    scale: string;
  };
  export: {
    title: string;
    format: string;
    duration: string;
    quality: string;
    fps: string;
    exportVideo: string;
    exportGif: string;
    exporting: string;
    exportComplete: string;
    exportError: string;
  };
  help: {
    title: string;
    keyboardShortcuts: string;
    controls: {
      geometry: string;
      colors: string;
      motion: string;
      camera: string;
      export: string;
      theme: string;
      help: string;
    };
  };
  settings: {
    language: string;
    theme: string;
    light: string;
    dark: string;
  };
  footer: {
    madeWith: string;
    by: string;
    openSource: string;
  };
}

export type SupportedLanguage = 'pt-BR' | 'en-US';
