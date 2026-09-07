import {
  Box3,
  CapsuleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Float32BufferAttribute,
  IcosahedronGeometry,
  OctahedronGeometry,
  RingGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
  type Mesh,
  type PerspectiveCamera,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Appearance, GeometryType, Pose } from './types';
export function createGeometry(type: GeometryType): BufferGeometry {
  switch (type) {
    case 'cube':
      return new RoundedBoxGeometry(2, 2, 2, 4, 0.12);
    case 'sphere':
      return new SphereGeometry(1.3, 64, 32);
    case 'pyramid':
      return new ConeGeometry(1.6, 2.5, 4);
    case 'cylinder':
      return new CylinderGeometry(1, 1, 2.5, 64);
    case 'cone':
      return new ConeGeometry(1.3, 2.5, 64);
    case 'torus':
      return new TorusGeometry(1.1, 0.42, 32, 96);
    case 'octahedron':
      return new OctahedronGeometry(1.6);
    case 'dodecahedron':
      return new DodecahedronGeometry(1.5);
    case 'icosahedron':
      return new IcosahedronGeometry(1.5);
    case 'tetrahedron':
      return new TetrahedronGeometry(1.7);
    case 'capsule':
      return new CapsuleGeometry(0.8, 1.3, 12, 32);
    case 'ring':
      return new RingGeometry(0.7, 1.6, 64);
  }
}
export function colorGeometry(
  geometry: BufferGeometry,
  appearance: Appearance
): void {
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox as Box3;
  const position = geometry.getAttribute('position');
  const primary = new Color(appearance.primary),
    secondary = new Color(appearance.secondary),
    color = new Color();
  const colors = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i++) {
    const amount = appearance.gradient
      ? (position.getY(i) - bounds.min.y) /
        Math.max(bounds.max.y - bounds.min.y, 0.001)
      : 0;
    color
      .copy(primary)
      .lerp(secondary, amount)
      .toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
}
export function applyPose(mesh: Mesh, pose: Pose): void {
  mesh.position.set(pose.x, pose.y, pose.z);
  mesh.rotation.set(pose.rotationX, pose.rotationY, 0);
}
export function zoomCamera(
  camera: PerspectiveCamera,
  target: Vector3,
  factor: number
): void {
  const offset = camera.position.clone().sub(target);
  offset.setLength(Math.min(20, Math.max(3, offset.length() * factor)));
  camera.position.copy(target).add(offset);
  camera.updateMatrixWorld();
}
export function fitExportCamera(
  camera: PerspectiveCamera,
  aspect: number
): void {
  const originalAspect = camera.aspect;
  if (aspect < originalAspect)
    camera.fov =
      (2 *
        Math.atan(
          (Math.tan((camera.fov * Math.PI) / 360) * originalAspect) / aspect
        ) *
        180) /
      Math.PI;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
