import { useEffect } from 'react';
import { useAppStore } from './useAppStore';
import { GEOMETRY_CONFIGS } from '@/utils/types';

export function useKeyboardShortcuts() {
  const {
    selectedGeometry,
    setGeometry,
    isAnimating,
    toggleAnimation,
    toggleTheme,
    motionControls,
    setMotionControls,
  } = useAppStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      
      // Space: Toggle animation
      if (key === ' ') {
        event.preventDefault();
        toggleAnimation();
        return;
      }

      // T: Toggle theme
      if (key === 't') {
        event.preventDefault();
        toggleTheme();
        return;
      }

      // Number keys 1-9, 0, -, =: Select geometry (supports all 12 geometries)
      if (key >= '1' && key <= '9') {
        event.preventDefault();
        const geometryIndex = parseInt(key) - 1;
        if (geometryIndex < GEOMETRY_CONFIGS.length) {
          setGeometry(GEOMETRY_CONFIGS[geometryIndex].type);
        }
        return;
      }

      // Key 0: Select 10th geometry
      if (key === '0') {
        event.preventDefault();
        if (GEOMETRY_CONFIGS.length >= 10) {
          setGeometry(GEOMETRY_CONFIGS[9].type);
        }
        return;
      }

      // Key -: Select 11th geometry
      if (key === '-') {
        event.preventDefault();
        if (GEOMETRY_CONFIGS.length >= 11) {
          setGeometry(GEOMETRY_CONFIGS[10].type);
        }
        return;
      }

      // Key =: Select 12th geometry
      if (key === '=') {
        event.preventDefault();
        if (GEOMETRY_CONFIGS.length >= 12) {
          setGeometry(GEOMETRY_CONFIGS[11].type);
        }
        return;
      }

      // Arrow keys: Adjust spin speed
      if (key === 'arrowup' || key === 'arrowdown') {
        event.preventDefault();
        const increment = key === 'arrowup' ? 0.2 : -0.2;
        const newSpinSpeed = Math.max(0, Math.min(5, motionControls.spinSpeed + increment));
        setMotionControls({ ...motionControls, spinSpeed: newSpinSpeed });
        return;
      }

      // Left/Right arrows: Adjust tilt speed
      if (key === 'arrowleft' || key === 'arrowright') {
        event.preventDefault();
        const increment = key === 'arrowright' ? 0.2 : -0.2;
        const newTiltSpeed = Math.max(0, Math.min(3, motionControls.tiltSpeed + increment));
        setMotionControls({ ...motionControls, tiltSpeed: newTiltSpeed });
        return;
      }

      // Z/X: Adjust zoom
      if (key === 'z' || key === 'x') {
        event.preventDefault();
        const increment = key === 'x' ? 0.5 : -0.5;
        const newZoom = Math.max(2, Math.min(15, motionControls.zoom + increment));
        setMotionControls({ ...motionControls, zoom: newZoom });
        return;
      }

      // B: Adjust bounce amplitude
      if (key === 'b') {
        event.preventDefault();
        const newBounce = motionControls.bounceAmplitude > 0 ? 0 : 0.5;
        setMotionControls({ ...motionControls, bounceAmplitude: newBounce });
        return;
      }

      // O: Adjust orbit radius
      if (key === 'o') {
        event.preventDefault();
        const newOrbit = motionControls.orbitRadius > 0 ? 0 : 2;
        setMotionControls({ ...motionControls, orbitRadius: newOrbit });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    selectedGeometry,
    setGeometry,
    isAnimating,
    toggleAnimation,
    toggleTheme,
    motionControls,
    setMotionControls,
  ]);
}
