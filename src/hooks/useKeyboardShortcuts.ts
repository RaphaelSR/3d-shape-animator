import { useEffect } from 'react';
import { useAppStore } from './useAppStore';
import { GEOMETRIES } from '@/utils/types';
export function isShortcutTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    !!target.closest(
      'input, textarea, select, button, a, [contenteditable="true"], [role="slider"], [role="dialog"], [role="combobox"], [role="switch"]'
    )
  );
}
export function useKeyboardShortcuts({
  disabled,
  onExport,
  onHelp,
  onFrame,
  onZoom,
}: {
  disabled: boolean;
  onExport: () => void;
  onHelp: () => void;
  onFrame: () => void;
  onZoom: (factor: number) => void;
}) {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (
        disabled ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.repeat ||
        isShortcutTarget(event.target)
      )
        return;
      const state = useAppStore.getState();
      const key = event.key.toLowerCase();
      const index = '1234567890-='.indexOf(key);
      if (key.length === 1 && index >= 0) {
        event.preventDefault();
        state.setGeometry(GEOMETRIES[index]);
        return;
      }
      const actions: Record<string, () => void> = {
        ' ': state.togglePlayback,
        t: state.toggleTheme,
        r: state.restart,
        f: onFrame,
        e: onExport,
        h: onHelp,
        z: () => onZoom(1.1),
        x: () => onZoom(1 / 1.1),
        b: () =>
          state.setMotion({
            bounceAmplitude: state.motion.bounceAmplitude ? 0 : 0.5,
          }),
        o: () =>
          state.setMotion({ orbitRadius: state.motion.orbitRadius ? 0 : 2 }),
        arrowup: () =>
          state.setMotion({ spinSpeed: state.motion.spinSpeed + 0.1 }),
        arrowdown: () =>
          state.setMotion({ spinSpeed: state.motion.spinSpeed - 0.1 }),
        arrowright: () =>
          state.setMotion({ tiltSpeed: state.motion.tiltSpeed + 0.1 }),
        arrowleft: () =>
          state.setMotion({ tiltSpeed: state.motion.tiltSpeed - 0.1 }),
      };
      if (actions[key]) {
        event.preventDefault();
        actions[key]();
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [disabled, onExport, onHelp, onFrame, onZoom]);
}
