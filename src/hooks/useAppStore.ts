import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_APPEARANCE,
  DEFAULT_MOTION,
  MOTION_LIMITS,
  type Appearance,
  type GeometryType,
  type Language,
  type MotionControls,
  type Theme,
} from '@/utils/types';
interface AppStore {
  geometry: GeometryType;
  appearance: Appearance;
  motion: MotionControls;
  theme: Theme;
  language: Language;
  playing: boolean;
  resetId: number;
  setGeometry: (geometry: GeometryType) => void;
  setAppearance: (value: Partial<Appearance>) => void;
  setMotion: (value: Partial<MotionControls>) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  togglePlayback: () => void;
  pause: () => void;
  restart: () => void;
  resetMotion: () => void;
}
export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      geometry: 'cube',
      appearance: { ...DEFAULT_APPEARANCE },
      motion: { ...DEFAULT_MOTION },
      theme: 'dark',
      language:
        typeof navigator !== 'undefined' && navigator.language.startsWith('pt')
          ? 'pt-BR'
          : 'en-US',
      playing:
        typeof matchMedia !== 'undefined'
          ? !matchMedia('(prefers-reduced-motion: reduce)').matches
          : true,
      resetId: 0,
      setGeometry: geometry => set({ geometry }),
      setAppearance: value =>
        set(state => ({ appearance: { ...state.appearance, ...value } })),
      setMotion: value =>
        set(state => {
          const motion = { ...state.motion };
          for (const key of Object.keys(value) as (keyof MotionControls)[]) {
            const input = value[key];
            if (input !== undefined && Number.isFinite(input))
              motion[key] = Math.min(
                MOTION_LIMITS[key][1],
                Math.max(MOTION_LIMITS[key][0], input)
              );
          }
          return { motion };
        }),
      setLanguage: language => set({ language }),
      toggleTheme: () =>
        set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      togglePlayback: () => set(state => ({ playing: !state.playing })),
      pause: () => set({ playing: false }),
      restart: () => set(state => ({ resetId: state.resetId + 1 })),
      resetMotion: () =>
        set(state => ({
          motion: { ...DEFAULT_MOTION },
          resetId: state.resetId + 1,
        })),
    }),
    {
      name: 'geometry-motion-studio-preferences',
      partialize: state => ({ theme: state.theme, language: state.language }),
      merge: (saved, current) => {
        const data = saved as Partial<AppStore> | null;
        return {
          ...current,
          theme:
            data?.theme === 'light' || data?.theme === 'dark'
              ? data.theme
              : current.theme,
          language:
            data?.language === 'pt-BR' || data?.language === 'en-US'
              ? data.language
              : current.language,
        };
      },
    }
  )
);
