import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ACESFilmicToneMapping,
  DoubleSide,
  Mesh,
  PCFShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useAppStore } from '@/hooks/useAppStore';
import {
  advancePhase,
  evaluatePose,
  hasMotion,
  initialPhase,
} from '@/utils/motion';
import {
  applyPose,
  colorGeometry,
  createGeometry,
  fitExportCamera,
  zoomCamera,
} from '@/utils/geometry';
import type { SceneHandle } from '@/utils/types';
import { useTranslations } from '@/hooks/useTranslations';

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function World({
  busy,
  onReady,
  onFailure,
}: {
  busy: boolean;
  onReady: (handle: SceneHandle | null) => void;
  onFailure: () => void;
}) {
  const { gl, scene, camera, invalidate } = useThree();
  const geometryType = useAppStore(state => state.geometry);
  const appearance = useAppStore(state => state.appearance);
  const motion = useAppStore(state => state.motion);
  const playing = useAppStore(state => state.playing);
  const resetId = useAppStore(state => state.resetId);
  const theme = useAppStore(state => state.theme);
  const mesh = useRef<Mesh>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const phase = useRef(initialPhase());
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    const handle = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handle);
    return () => document.removeEventListener('visibilitychange', handle);
  }, []);
  useEffect(() => {
    const contextLost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener('webglcontextlost', contextLost);
    return () =>
      gl.domElement.removeEventListener('webglcontextlost', contextLost);
  }, [gl, onFailure]);
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.65;
    generator.dispose();
    room.dispose();
    invalidate();
    return () => {
      scene.environment = null;
      environment.dispose();
    };
  }, [gl, scene, invalidate]);
  useEffect(() => {
    if (!mesh.current) return;
    const geometry = createGeometry(geometryType);
    mesh.current.geometry = geometry;
    colorGeometry(geometry, useAppStore.getState().appearance);
    invalidate();
    return () => geometry.dispose();
  }, [geometryType, invalidate]);
  useEffect(() => {
    if (mesh.current) colorGeometry(mesh.current.geometry, appearance);
    invalidate();
  }, [appearance, geometryType, invalidate]);
  useEffect(() => {
    phase.current = initialPhase();
    invalidate();
  }, [resetId, invalidate]);
  useEffect(() => {
    invalidate();
  }, [motion, playing, busy, visible, invalidate]);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (playing && !busy && visible && hasMotion(motion)) {
      phase.current = advancePhase(
        phase.current,
        motion,
        Math.min(delta, 0.05)
      );
      invalidate();
    }
    applyPose(mesh.current, evaluatePose(phase.current, motion));
  });
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const handle: SceneHandle = {
      reframe: () => {
        camera.position.set(4.6, 3.2, 6.2);
        controls.current?.target.set(0, 0, 0);
        controls.current?.update();
        invalidate();
      },
      zoom: factor => {
        zoomCamera(camera, controls.current?.target ?? new Vector3(), factor);
        controls.current?.update();
        invalidate();
      },
      createExport: settings => {
        const snapshot = scene.clone(true);
        const subject = snapshot.getObjectByName('subject') as Mesh;
        if (!subject) throw new Error('Scene not ready');
        const exportCamera = camera.clone();
        fitExportCamera(
          exportCamera,
          settings.resolution[0] / settings.resolution[1]
        );
        const start = { ...phase.current };
        const exportMotion = { ...useAppStore.getState().motion };
        const renderer = new WebGLRenderer({
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
        });
        renderer.setPixelRatio(1);
        renderer.setSize(...settings.resolution);
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = gl.toneMappingExposure;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFShadowMap;
        return {
          canvas: renderer.domElement,
          render: seconds => {
            applyPose(
              subject,
              evaluatePose(
                advancePhase(start, exportMotion, seconds),
                exportMotion
              )
            );
            renderer.render(snapshot, exportCamera);
          },
          dispose: () => {
            snapshot.traverse(object => {
              if ('shadow' in object)
                (
                  object as unknown as { shadow: { dispose: () => void } }
                ).shadow?.dispose();
            });
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.width = 0;
            renderer.domElement.height = 0;
          },
        };
      },
    };
    onReady(handle);
    return () => onReady(null);
  }, [camera, scene, gl, invalidate, onReady]);
  return (
    <>
      <color
        attach="background"
        args={[theme === 'dark' ? '#131720' : '#edf0f5']}
      />
      <hemisphereLight args={['#c9deff', '#39445e', 0.45]} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={2}
        castShadow
        shadow-radius={5}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <directionalLight position={[-5, 2, -3]} color="#8abaff" intensity={1} />
      <mesh ref={mesh} name="subject" castShadow>
        <meshPhysicalMaterial
          vertexColors
          metalness={appearance.metalness}
          roughness={appearance.roughness}
          clearcoat={0.35}
          clearcoatRoughness={0.2}
          side={geometryType === 'ring' ? DoubleSide : undefined}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.8, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={theme === 'dark' ? 0.3 : 0.16} />
      </mesh>
      <OrbitControls
        ref={controls}
        makeDefault
        enabled={!busy}
        enableDamping
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI * 0.86}
      />
    </>
  );
}
export function Scene({
  busy,
  onReady,
}: {
  busy: boolean;
  onReady: (handle: SceneHandle | null) => void;
}) {
  const t = useTranslations();
  const [failed, setFailed] = useState(false);
  const fallback = (
    <div className="scene-message" role="alert">
      <strong>{t.graphicsError}</strong>
      <p>{t.graphicsHelp}</p>
      <button className="button" onClick={() => location.reload()}>
        {t.retry}
      </button>
    </div>
  );
  return (
    <SceneBoundary fallback={fallback}>
      {failed ? (
        fallback
      ) : (
        <Canvas
          shadows={{ type: PCFShadowMap }}
          dpr={[1, 1.75]}
          frameloop="demand"
          camera={{ position: [4.6, 3.2, 6.2], fov: 42, near: 0.1, far: 100 }}
          gl={defaults => {
            try {
              return new WebGLRenderer({
                ...defaults,
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
              });
            } catch (error) {
              setFailed(true);
              onReady(null);
              throw error;
            }
          }}
          fallback={fallback}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 0.95;
            gl.domElement.setAttribute('aria-hidden', 'true');
          }}
        >
          <World
            busy={busy}
            onReady={onReady}
            onFailure={() => {
              setFailed(true);
              onReady(null);
            }}
          />
        </Canvas>
      )}
    </SceneBoundary>
  );
}
