import type { MotionControls, MotionPhase, Pose } from './types';
export const initialPhase = (): MotionPhase => ({ time: 0, x: 0, y: 0 });
export function advancePhase(
  phase: MotionPhase,
  motion: MotionControls,
  delta: number
): MotionPhase {
  return {
    time: phase.time + delta,
    x: phase.x + delta * motion.tiltSpeed * 0.5,
    y: phase.y + delta * motion.spinSpeed,
  };
}
export function evaluatePose(phase: MotionPhase, motion: MotionControls): Pose {
  return {
    x: Math.cos(phase.time) * motion.orbitRadius,
    y: Math.sin(phase.time * 2) * motion.bounceAmplitude,
    z: Math.sin(phase.time) * motion.orbitRadius,
    rotationX: 0.25 + phase.x,
    rotationY: -0.35 + phase.y,
  };
}
export function hasMotion(motion: MotionControls): boolean {
  return Object.values(motion).some(value => value > 0);
}
