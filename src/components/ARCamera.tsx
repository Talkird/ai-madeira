import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  XR,
  createXRStore,
  useXRHitTest,
  useXR,
  XRDomOverlay,
  IfInSessionMode,
  useXRSessionModeSupported,
} from "@react-three/xr";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";

const xrStore = createXRStore();
const matrixHelper = new THREE.Matrix4();

interface PlacedARItem {
  id: string;
  position: [number, number, number];
  rotation: number;
  scale: number;
}

const iconBtnStyle: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(4px)",
  color: "white",
  border: "none",
  fontSize: 20,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// ─── MODEL MESH ──────────────────────────────────────────────────────────────
function ModelMesh({ url, transparent }: { url: string; transparent?: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useRef(scene.clone(true));

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.current.position.set(-center.x, -box.min.y, -center.z);

    if (transparent) {
      cloned.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mesh.material = mats.map((m) => {
          const c = (m as THREE.Material).clone() as THREE.MeshStandardMaterial;
          c.transparent = true;
          c.opacity = 0.5;
          return c;
        }) as unknown as THREE.Material;
      });
    }
  }, [transparent]);

  return <primitive object={cloned.current} />;
}

function FurnitureContent({ item, transparent }: { item: Furniture; transparent?: boolean }) {
  if (item.model) {
    return (
      <Suspense fallback={null}>
        <ModelMesh url={item.model} transparent={transparent} />
      </Suspense>
    );
  }
  return (
    <mesh position={[0, item.dimensions.height / 2, 0]}>
      <boxGeometry
        args={[item.dimensions.width, item.dimensions.height, item.dimensions.depth]}
      />
      <meshStandardMaterial
        color={item.color}
        transparent={transparent}
        opacity={transparent ? 0.5 : 1}
      />
    </mesh>
  );
}

// ─── HIT TEST + RETICLE + GHOST ──────────────────────────────────────────────
function HitTestScene({
  item,
  hitPositionRef,
  pendingRef,
  onFirstHit,
  placedItems,
}: {
  item: Furniture;
  hitPositionRef: React.MutableRefObject<THREE.Vector3>;
  pendingRef: React.MutableRefObject<{ rotation: number; scale: number }>;
  onFirstHit: () => void;
  placedItems: PlacedARItem[];
}) {
  const reticleRef = useRef<THREE.Mesh>(null);
  const ghostRef = useRef<THREE.Group>(null);
  const firstHitRef = useRef(false);

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) {
        if (reticleRef.current) reticleRef.current.visible = false;
        return;
      }

      getWorldMatrix(matrixHelper, results[0]);
      hitPositionRef.current.setFromMatrixPosition(matrixHelper);

      if (reticleRef.current) {
        reticleRef.current.visible = true;
        reticleRef.current.position.copy(hitPositionRef.current);
      }

      if (!firstHitRef.current) {
        firstHitRef.current = true;
        onFirstHit();
      }
    },
    "viewer",
  );

  useFrame(() => {
    if (!ghostRef.current) return;
    const reticleVisible = reticleRef.current?.visible ?? false;
    if (!reticleVisible) {
      ghostRef.current.visible = false;
      return;
    }
    ghostRef.current.visible = true;
    ghostRef.current.position.copy(hitPositionRef.current);
    ghostRef.current.rotation.y = pendingRef.current.rotation;
    ghostRef.current.scale.setScalar(pendingRef.current.scale);
  });

  return (
    <>
      <mesh ref={reticleRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.1, 32]} />
        <meshStandardMaterial
          color="white"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>

      <group ref={ghostRef} visible={false}>
        <FurnitureContent item={item} transparent />
      </group>

      {placedItems.map((placed) => (
        <group
          key={placed.id}
          position={placed.position}
          rotation={[0, placed.rotation, 0]}
          scale={placed.scale}
        >
          <FurnitureContent item={item} />
        </group>
      ))}
    </>
  );
}

// ─── SESSION STATE BRIDGE ─────────────────────────────────────────────────────
function SessionStateBridge({
  onSessionChange,
}: {
  onSessionChange: (active: boolean) => void;
}) {
  const session = useXR((s) => s.session);
  useEffect(() => {
    onSessionChange(session !== null);
  }, [session, onSessionChange]);
  return null;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function ARCamera({ item, onExit }: { item: Furniture; onExit: () => void }) {
  const arSupported = useXRSessionModeSupported("immersive-ar");
  const [isInAR, setIsInAR] = useState(false);
  const [hasFoundSurface, setHasFoundSurface] = useState(false);
  const [placedItems, setPlacedItems] = useState<PlacedARItem[]>([]);
  const [pendingRotation, setPendingRotation] = useState(0);
  const [pendingScale, setPendingScale] = useState(1);

  const hitPositionRef = useRef(new THREE.Vector3());
  const pendingRef = useRef({ rotation: 0, scale: 1 });
  pendingRef.current = { rotation: pendingRotation, scale: pendingScale };

  const handleSessionChange = useCallback((active: boolean) => {
    setIsInAR(active);
    if (!active) setHasFoundSurface(false);
  }, []);

  const placeItem = useCallback(() => {
    const pos = hitPositionRef.current;
    if (pos.lengthSq() < 0.001) return;
    setPlacedItems((prev) => [
      ...prev,
      {
        id: `placed-${Date.now()}`,
        position: pos.toArray() as [number, number, number],
        rotation: pendingRef.current.rotation,
        scale: pendingRef.current.scale,
      },
    ]);
  }, []);

  const clearAll = useCallback(() => setPlacedItems([]), []);

  if (arSupported === false) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-6xl">📱</div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AR no disponible</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Tu dispositivo o navegador no soporta WebXR AR. Usá Chrome en Android
            para la experiencia completa.
          </p>
        </div>
        <button
          onClick={onExit}
          className="bg-amber-500 text-black font-bold px-8 py-3 rounded-full"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      <Canvas gl={{ alpha: true, antialias: true }}>
        <XR store={xrStore}>
          <SessionStateBridge onSessionChange={handleSessionChange} />

          <IfInSessionMode allow="immersive-ar">
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 5, 2]} intensity={1} />

            <HitTestScene
              item={item}
              hitPositionRef={hitPositionRef}
              pendingRef={pendingRef}
              onFirstHit={() => setHasFoundSurface(true)}
              placedItems={placedItems}
            />

            <XRDomOverlay>
              {/* Exit */}
              <button
                onClick={onExit}
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "rgba(0,0,0,0.65)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                ← Salir
              </button>

              {/* Item label */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(0,0,0,0.65)",
                  color: "white",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                }}
              >
                {item.name}
              </div>

              {/* Surface hint */}
              {!hasFoundSurface && (
                <div
                  style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  Apuntá al suelo para detectar superficies
                </div>
              )}

              {/* Bottom controls */}
              <div
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => setPendingRotation((r) => r - Math.PI / 8)}
                    style={iconBtnStyle}
                  >
                    ↺
                  </button>
                  <button
                    onClick={() => setPendingScale((s) => Math.max(s * 0.8, 0.1))}
                    style={{ ...iconBtnStyle, fontSize: 26, fontWeight: 700 }}
                  >
                    −
                  </button>
                  <button
                    onClick={placeItem}
                    style={{
                      background: "#F59E0B",
                      color: "#000",
                      border: "none",
                      borderRadius: 999,
                      padding: "14px 28px",
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    Colocar
                  </button>
                  <button
                    onClick={() => setPendingScale((s) => Math.min(s * 1.25, 5))}
                    style={{ ...iconBtnStyle, fontSize: 26, fontWeight: 700 }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setPendingRotation((r) => r + Math.PI / 8)}
                    style={iconBtnStyle}
                  >
                    ↻
                  </button>
                </div>

                {placedItems.length > 0 && (
                  <button
                    onClick={clearAll}
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      background: "none",
                      border: "none",
                      fontSize: 12,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar todo ({placedItems.length})
                  </button>
                )}
              </div>
            </XRDomOverlay>
          </IfInSessionMode>
        </XR>
      </Canvas>

      {/* Pre-AR screen */}
      {!isInAR && (
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <button
            onClick={onExit}
            className="absolute top-4 left-4 bg-gray-800/80 text-white px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
          >
            ← Salir
          </button>

          <div className="flex-1 flex items-center justify-center">
            {arSupported === undefined ? (
              <div className="text-white/50 text-sm animate-pulse">
                Verificando soporte AR...
              </div>
            ) : (
              <div className="text-white/40 text-sm text-center px-8">
                Chrome en Android con soporte WebXR requerido
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 p-6 pointer-events-auto">
            <p className="text-white/70 text-sm font-medium">{item.name}</p>
            {arSupported && (
              <button
                onClick={() => xrStore.enterAR()}
                className="bg-amber-500 text-black font-bold px-10 py-4 rounded-full text-lg shadow-xl w-full max-w-xs"
              >
                Iniciar AR
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
