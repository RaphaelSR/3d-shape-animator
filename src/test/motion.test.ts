import { describe, expect, it } from 'vitest';
import {
  advancePhase,
  evaluatePose,
  hasMotion,
  initialPhase,
} from '@/utils/motion';
import { DEFAULT_MOTION } from '@/utils/types';
describe('motion clock', () => {
  it('is independent of frame rate', () => {
    let phase = initialPhase();
    for (let i = 0; i < 60; i++)
      phase = advancePhase(phase, DEFAULT_MOTION, 1 / 60);
    const single = advancePhase(initialPhase(), DEFAULT_MOTION, 1);
    expect(phase.time).toBeCloseTo(single.time);
    expect(phase.x).toBeCloseTo(single.x);
    expect(phase.y).toBeCloseTo(single.y);
  });
  it('does not mutate a frozen playback snapshot during export', () => {
    const phase = Object.freeze({ time: 3, x: 2, y: 1 });
    const first = evaluatePose(phase, DEFAULT_MOTION);
    advancePhase(phase, DEFAULT_MOTION, 10);
    expect(evaluatePose(phase, DEFAULT_MOTION)).toEqual(first);
    expect(evaluatePose(initialPhase(), DEFAULT_MOTION)).not.toEqual(first);
  });
  it('clears orbit position when its radius becomes zero', () => {
    const phase = advancePhase(initialPhase(), DEFAULT_MOTION, 4);
    expect(
      evaluatePose(phase, { ...DEFAULT_MOTION, orbitRadius: 2 }).x
    ).not.toBe(0);
    const pose = evaluatePose(phase, { ...DEFAULT_MOTION, orbitRadius: 0 });
    expect(Math.abs(pose.x)).toBe(0);
    expect(Math.abs(pose.z)).toBe(0);
  });
  it('does not jump rotations when speed changes', () => {
    const phase = advancePhase(initialPhase(), DEFAULT_MOTION, 2);
    const next = advancePhase(phase, { ...DEFAULT_MOTION, spinSpeed: 3 }, 0);
    expect(next).toEqual(phase);
  });
  it('detects still scenes without involving camera zoom', () => {
    expect(
      hasMotion({
        spinSpeed: 0,
        tiltSpeed: 0,
        bounceAmplitude: 0,
        orbitRadius: 0,
      })
    ).toBe(false);
    expect(hasMotion(DEFAULT_MOTION)).toBe(true);
  });
});
