import { describe, it, expect } from 'vitest';
import { useAppStore } from '@/hooks/useAppStore';
import { renderHook, act } from '@testing-library/react';

describe('useAppStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAppStore());

    expect(result.current.selectedGeometry).toBe('cube');
    expect(result.current.primaryColor.hex).toBe('#FF6B35');
    expect(result.current.theme).toBe('light');
    expect(result.current.isAnimating).toBe(true);
  });

  it('should update geometry selection', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setGeometry('sphere');
    });

    expect(result.current.selectedGeometry).toBe('sphere');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should update motion controls', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setMotionControls({ spinSpeed: 2.5 });
    });

    expect(result.current.motionControls.spinSpeed).toBe(2.5);
  });

  it('should reset motion controls', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setMotionControls({ spinSpeed: 3, tiltSpeed: 2 });
    });

    act(() => {
      result.current.resetControls();
    });

    expect(result.current.motionControls.spinSpeed).toBe(1);
    expect(result.current.motionControls.tiltSpeed).toBe(0.5);
  });
});
