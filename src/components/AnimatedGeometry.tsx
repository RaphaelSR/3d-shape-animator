import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color as ThreeColor } from 'three';
import type { GeometryType, MotionControls, Color } from '@/utils/types';

interface AnimatedGeometryProps {
  geometry: GeometryType;
  primaryColor: Color;
  secondaryColor: Color;
  motionControls: MotionControls;
  isAnimating: boolean;
}

export function AnimatedGeometry({
  geometry,
  primaryColor,
  secondaryColor,
  motionControls,
  isAnimating,
}: AnimatedGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current || !isAnimating) return;

    timeRef.current += delta;

    const { spinSpeed, tiltSpeed, bounceAmplitude, orbitRadius } = motionControls;

    meshRef.current.rotation.y += spinSpeed * delta;
    meshRef.current.rotation.x += tiltSpeed * delta * 0.5;

    meshRef.current.position.y = Math.sin(timeRef.current * 2) * bounceAmplitude;

    if (orbitRadius > 0) {
      meshRef.current.position.x = Math.cos(timeRef.current) * orbitRadius;
      meshRef.current.position.z = Math.sin(timeRef.current) * orbitRadius;
    }

    // Animate gradient transition between primary and secondary colors
    if (meshRef.current.material && 'color' in meshRef.current.material) {
      const time = timeRef.current * 0.8; // Slower color transition
      const primary = new ThreeColor(primaryColor.hex);
      const secondary = new ThreeColor(secondaryColor.hex);
      
      // Create smooth oscillation between 0 and 1
      const mixFactor = (Math.sin(time) + 1) * 0.5;
      
      // Interpolate between primary and secondary colors
      const animatedColor = primary.clone().lerp(secondary, mixFactor);
      meshRef.current.material.color = animatedColor;
    }
  });

  const renderGeometry = () => {
    const props = {
      ref: meshRef,
      position: [0, 0, 0] as [number, number, number],
    };

    switch (geometry) {
      case 'cube':
        return (
          <mesh {...props}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
              color={primaryColor.hex}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        );

      case 'sphere':
        return (
          <mesh {...props}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshStandardMaterial
              color={primaryColor.hex}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        );

      case 'pyramid':
        return (
          <mesh {...props}>
            <coneGeometry args={[1.5, 2.5, 4]} />
            <meshStandardMaterial
              color={primaryColor.hex}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        );

      case 'cylinder':
        return (
          <mesh {...props}>
            <cylinderGeometry args={[1, 1, 2.5, 32]} />
            <meshStandardMaterial
              color={primaryColor.hex}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        );

      case 'cone':
        return (
          <mesh {...props}>
            <coneGeometry args={[1.2, 2.5, 32]} />
            <meshStandardMaterial
              color={primaryColor.hex}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        );

      case 'torus':
        return (
          <mesh {...props}>
            <torusGeometry args={[1.2, 0.4, 16, 100]} />
            <meshStandardMaterial
              color={primaryColor.hex}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        );

      default:
        return null;
    }
  };

  return <>{renderGeometry()}</>;
}
