import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  zoom: number;
}

export function CameraController({ zoom }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(zoom, zoom, zoom));
  
  useFrame(() => {
    targetPosition.current.set(zoom, zoom, zoom);
    camera.position.lerp(targetPosition.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
