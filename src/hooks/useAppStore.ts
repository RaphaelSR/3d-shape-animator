import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, GeometryType, Color, MotionControls } from '@/utils/types';

interface AppStore extends AppState {
  setGeometry: (geometry: GeometryType) => void;
  setPrimaryColor: (color: Color) => void;
  setSecondaryColor: (color: Color) => void;
  setMotionControls: (controls: Partial<MotionControls>) => void;
  toggleTheme: () => void;
  toggleAnimation: () => void;
  resetControls: () => void;
}

const DEFAULT_MOTION_CONTROLS: MotionControls = {
  spinSpeed: 1,
  tiltSpeed: 0.5,
  bounceAmplitude: 0.2,
  orbitRadius: 0,
  zoom: 5,
};

export const useAppStore = create<AppStore>()(
  devtools(
    set => ({
      selectedGeometry: 'cube',
      primaryColor: { hex: '#FF6B35', name: 'Orange' },
      secondaryColor: { hex: '#F7931E', name: 'Light Orange' },
      motionControls: DEFAULT_MOTION_CONTROLS,
      theme: 'light',
      isAnimating: true,

      setGeometry: geometry =>
        set({ selectedGeometry: geometry }, false, 'setGeometry'),

      setPrimaryColor: color =>
        set({ primaryColor: color }, false, 'setPrimaryColor'),

      setSecondaryColor: color =>
        set({ secondaryColor: color }, false, 'setSecondaryColor'),

      setMotionControls: controls =>
        set(
          state => ({
            motionControls: { ...state.motionControls, ...controls },
          }),
          false,
          'setMotionControls'
        ),

      toggleTheme: () =>
        set(
          state => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
          false,
          'toggleTheme'
        ),

      toggleAnimation: () =>
        set(state => ({ isAnimating: !state.isAnimating }), false, 'toggleAnimation'),

      resetControls: () =>
        set(
          { motionControls: DEFAULT_MOTION_CONTROLS },
          false,
          'resetControls'
        ),
    }),
    { name: 'geometry-motion-studio' }
  )
);
