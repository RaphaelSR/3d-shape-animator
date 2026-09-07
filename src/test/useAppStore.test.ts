import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '@/hooks/useAppStore';
import { DEFAULT_MOTION } from '@/utils/types';
const initial = useAppStore.getInitialState();
beforeEach(() => {
  localStorage.clear();
  useAppStore.setState(initial, true);
});
describe('editor state', () => {
  it('keeps controls within the same limits for sliders and shortcuts', () => {
    useAppStore
      .getState()
      .setMotion({ spinSpeed: 500, tiltSpeed: -10, orbitRadius: NaN });
    expect(useAppStore.getState().motion).toEqual({
      ...DEFAULT_MOTION,
      spinSpeed: 3,
      tiltSpeed: 0,
    });
  });
  it('pauses independently of motion settings and restarts without changing playback', () => {
    useAppStore.getState().pause();
    useAppStore.getState().restart();
    expect(useAppStore.getState().playing).toBe(false);
    expect(useAppStore.getState().resetId).toBe(1);
    expect(useAppStore.getState().motion).toEqual(DEFAULT_MOTION);
  });
  it('stores the gradient toggle centrally', () => {
    useAppStore.getState().setAppearance({ gradient: false });
    expect(useAppStore.getState().appearance.gradient).toBe(false);
  });
  it('persists only validated language and theme, retaining old preferences', async () => {
    localStorage.setItem(
      'geometry-motion-studio-preferences',
      JSON.stringify({
        state: { theme: 'light', language: 'pt-BR', geometry: 'invalid' },
        version: 0,
      })
    );
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().theme).toBe('light');
    expect(useAppStore.getState().language).toBe('pt-BR');
    expect(useAppStore.getState().geometry).toBe('cube');
    localStorage.setItem(
      'geometry-motion-studio-preferences',
      JSON.stringify({
        state: { theme: 'invalid', language: 'invalid' },
        version: 0,
      })
    );
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().language).toBe('pt-BR');
  });
});
