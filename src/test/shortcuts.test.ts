import { fireEvent, renderHook } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import {
  isShortcutTarget,
  useKeyboardShortcuts,
} from '@/hooks/useKeyboardShortcuts';
import { useAppStore } from '@/hooks/useAppStore';
beforeEach(() => useAppStore.setState(useAppStore.getInitialState(), true));
it.each(['input', 'textarea', 'select', 'button', 'a'])(
  'does not hijack %s',
  tag => {
    expect(isShortcutTarget(document.createElement(tag))).toBe(true);
  }
);
it('ignores descendants of editable elements and sliders', () => {
  const parent = document.createElement('div');
  parent.contentEditable = 'true';
  parent.setAttribute('contenteditable', 'true');
  const span = document.createElement('span');
  parent.append(span);
  expect(isShortcutTarget(span)).toBe(true);
  parent.setAttribute('role', 'slider');
  expect(isShortcutTarget(span)).toBe(true);
});
it('implements documented actions and ignores browser shortcuts and dialogs', () => {
  const callbacks = {
    onExport: vi.fn(),
    onHelp: vi.fn(),
    onFrame: vi.fn(),
    onZoom: vi.fn(),
  };
  const { rerender } = renderHook(
    ({ disabled }) => useKeyboardShortcuts({ disabled, ...callbacks }),
    { initialProps: { disabled: false } }
  );
  fireEvent.keyDown(window, { key: '2' });
  expect(useAppStore.getState().geometry).toBe('sphere');
  fireEvent.keyDown(window, { key: 'f' });
  expect(callbacks.onFrame).toHaveBeenCalledOnce();
  fireEvent.keyDown(window, { key: 'e', metaKey: true });
  expect(callbacks.onExport).not.toHaveBeenCalled();
  rerender({ disabled: true });
  fireEvent.keyDown(window, { key: 'e' });
  expect(callbacks.onExport).not.toHaveBeenCalled();
});
