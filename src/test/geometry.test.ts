import { describe, expect, it } from 'vitest';
import { Color, PerspectiveCamera, Vector3 } from 'three';
import {
  colorGeometry,
  createGeometry,
  fitExportCamera,
  zoomCamera,
} from '@/utils/geometry';
import { DEFAULT_APPEARANCE, GEOMETRIES } from '@/utils/types';
describe('geometry and camera', () => {
  it.each(GEOMETRIES)('builds and colors %s without invalid vertices', type => {
    const geometry = createGeometry(type);
    colorGeometry(geometry, DEFAULT_APPEARANCE);
    const position = geometry.getAttribute('position'),
      colors = geometry.getAttribute('color');
    expect(position.count).toBeGreaterThan(0);
    expect(colors.count).toBe(position.count);
    expect(Array.from(colors.array).every(Number.isFinite)).toBe(true);
    geometry.dispose();
  });
  it('switches between a spatial gradient and a single color', () => {
    const geometry = createGeometry('sphere');
    colorGeometry(geometry, DEFAULT_APPEARANCE);
    const colors = geometry.getAttribute('color');
    expect(new Set(Array.from(colors.array)).size).toBeGreaterThan(3);
    colorGeometry(geometry, { ...DEFAULT_APPEARANCE, gradient: false });
    const solid = geometry.getAttribute('color'),
      color = new Color(DEFAULT_APPEARANCE.primary);
    for (let i = 0; i < solid.count; i++) {
      expect(solid.getX(i)).toBeCloseTo(color.r);
      expect(solid.getY(i)).toBeCloseTo(color.g);
      expect(solid.getZ(i)).toBeCloseTo(color.b);
    }
    geometry.dispose();
  });
  it('keeps camera direction and pan target when zooming', () => {
    const camera = new PerspectiveCamera(),
      target = new Vector3(2, 1, -1);
    camera.position.set(6, 4, 7);
    const direction = camera.position.clone().sub(target).normalize();
    zoomCamera(camera, target, 0.5);
    expect(
      camera.position.clone().sub(target).normalize().distanceTo(direction)
    ).toBeLessThan(1e-8);
    expect(target.toArray()).toEqual([2, 1, -1]);
  });
  it('widens vertical field of view for narrower exports without mutating preview', () => {
    const preview = new PerspectiveCamera(42, 2),
      exported = preview.clone();
    fitExportCamera(exported, 16 / 9);
    expect(exported.fov).toBeGreaterThan(preview.fov);
    expect(preview.aspect).toBe(2);
    expect(exported.aspect).toBe(16 / 9);
  });
});
