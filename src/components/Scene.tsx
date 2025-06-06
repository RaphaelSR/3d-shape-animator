import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { AnimatedGeometry } from './AnimatedGeometry';
import { CameraController } from './CameraController';
import { useAppStore } from '@/hooks/useAppStore';
import { Box } from '@mantine/core';

export function Scene() {
  const {
    selectedGeometry,
    primaryColor,
    secondaryColor,
    motionControls,
    isAnimating,
    theme,
  } = useAppStore();

  const backgroundColor = theme === 'light' ? '#ffffff' : '#1a1a1a';

  return (
    <Box
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ 
          background: backgroundColor,
          width: '100%',
          height: '100%',
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          
          <CameraController zoom={motionControls.zoom} />
          
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <AnimatedGeometry
            geometry={selectedGeometry}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            motionControls={motionControls}
            isAnimating={isAnimating}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            minDistance={2}
            maxDistance={20}
            zoomSpeed={1.2}
            rotateSpeed={0.5}
            panSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </Box>
  );
}
