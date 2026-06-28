import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

// ─── SHARED ──────────────────────────────────────────────────────────────────

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
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
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

function FurnitureContent({
  item,
  transparent,
}: {
  item: Furniture;
  transparent?: boolean;
}) {
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
        args={[
          item.dimensions.width,
          item.dimensions.height,
          item.dimensions.depth,
        ]}
      />
      <meshStandardMaterial
        color={item.color}
        transparent={transparent}
        opacity={transparent ? 0.5 : 1}
      />
    </mesh>
  );
}

function PlacedItems({ item, placed }: { item: Furniture; placed: PlacedARItem[] }) {
  return (
    <>
      {placed.map((p) => (
        <group key={p.id} position={p.position} rotation={[0, p.rotation, 0]} scale={p.scale}>
          <FurnitureContent item={item} />
        </group>
      ))}
    </>
  );
}

// ─── CONTROLS OVERLAY (shared UI) ────────────────────────────────────────────

function ControlsOverlay({
  hasHit,
  placedCount,
  itemName,
  onExit,
  onPlace,
  onRotateLeft,
  onRotateRight,
  onScaleDown,
  onScaleUp,
  onClearAll,
  hint,
}: {
  hasHit: boolean;
  placedCount: number;
  itemName: string;
  onExit: () => void;
  onPlace: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onScaleDown: () => void;
  onScaleUp: () => void;
  onClearAll: () => void;
  hint?: string;
}) {
  return (
    <>
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
        {itemName}
      </div>

      {hint && !hasHit && (
        <div
          style={{
            position: "absolute",
            top: "38%",
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
          {hint}
        </div>
      )}

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
          <button onClick={onRotateLeft} style={iconBtnStyle}>↺</button>
          <button onClick={onScaleDown} style={{ ...iconBtnStyle, fontSize: 26, fontWeight: 700 }}>−</button>
          <button
            onClick={onPlace}
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
          <button onClick={onScaleUp} style={{ ...iconBtnStyle, fontSize: 26, fontWeight: 700 }}>+</button>
          <button onClick={onRotateRight} style={iconBtnStyle}>↻</button>
        </div>

        {placedCount > 0 && (
          <button
            onClick={onClearAll}
            style={{
              color: "rgba(255,255,255,0.7)",
              background: "none",
              border: "none",
              fontSize: 12,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Eliminar todo ({placedCount})
          </button>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBXR PATH
// ═══════════════════════════════════════════════════════════════════════════════

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

  useXRHitTest((results, getWorldMatrix) => {
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
  }, "viewer");

  useFrame(() => {
    if (!ghostRef.current) return;
    const visible = reticleRef.current?.visible ?? false;
    if (!visible) { ghostRef.current.visible = false; return; }
    ghostRef.current.visible = true;
    ghostRef.current.position.copy(hitPositionRef.current);
    ghostRef.current.rotation.y = pendingRef.current.rotation;
    ghostRef.current.scale.setScalar(pendingRef.current.scale);
  });

  return (
    <>
      <mesh ref={reticleRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.1, 32]} />
        <meshStandardMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      <group ref={ghostRef} visible={false}>
        <FurnitureContent item={item} transparent />
      </group>
      <PlacedItems item={item} placed={placedItems} />
    </>
  );
}

function SessionStateBridge({ onSessionChange }: { onSessionChange: (active: boolean) => void }) {
  const session = useXR((s) => s.session);
  useEffect(() => { onSessionChange(session !== null); }, [session, onSessionChange]);
  return null;
}

function AutoEnterAR({ store }: { store: ReturnType<typeof createXRStore> }) {
  useEffect(() => {
    store.enterAR();
  }, [store]);
  return null;
}

function ARCameraWebXR({ item, onExit }: { item: Furniture; onExit: () => void }) {
  const [xrStore] = useState(() => createXRStore());
  const [arStarted, setArStarted] = useState(false);
  const [isInAR, setIsInAR] = useState(false);
  const [hasFoundSurface, setHasFoundSurface] = useState(false);
  const [placedItems, setPlacedItems] = useState<PlacedARItem[]>([]);
  const [pendingRotation, setPendingRotation] = useState(0);
  const [pendingScale, setPendingScale] = useState(1);

  const hitPositionRef = useRef(new THREE.Vector3());
  const pendingRef = useRef({ rotation: 0, scale: 1 });
  pendingRef.current = { rotation: pendingRotation, scale: pendingScale };

  // Camera preview before AR session starts
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        previewStreamRef.current = stream;
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => { /* camera unavailable — stays black */ });
    return () => {
      cancelled = true;
      previewStreamRef.current?.getTracks().forEach((t) => t.stop());
      previewStreamRef.current = null;
    };
  }, []);

  // Stop the preview stream as soon as WebXR takes over
  useEffect(() => {
    if (arStarted) {
      previewStreamRef.current?.getTracks().forEach((t) => t.stop());
      previewStreamRef.current = null;
    }
  }, [arStarted]);

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

  const handleStartAR = useCallback(() => {
    setArStarted(true);
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {/* Live camera preview shown only before AR session begins */}
      {!arStarted && (
        <video
          ref={previewVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      )}

      {arStarted && (
        <Canvas gl={{ alpha: true, antialias: true }}>
          <XR store={xrStore}>
            <SessionStateBridge onSessionChange={handleSessionChange} />
            <AutoEnterAR store={xrStore} />
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
                <ControlsOverlay
                  hasHit={hasFoundSurface}
                  placedCount={placedItems.length}
                  itemName={item.name}
                  onExit={onExit}
                  onPlace={placeItem}
                  onRotateLeft={() => setPendingRotation((r) => r - Math.PI / 8)}
                  onRotateRight={() => setPendingRotation((r) => r + Math.PI / 8)}
                  onScaleDown={() => setPendingScale((s) => Math.max(s * 0.8, 0.1))}
                  onScaleUp={() => setPendingScale((s) => Math.min(s * 1.25, 5))}
                  onClearAll={() => setPlacedItems([])}
                  hint="Apuntá al suelo para detectar superficies"
                />
              </XRDomOverlay>
            </IfInSessionMode>
          </XR>
        </Canvas>
      )}

      {!isInAR && (
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <button
            onClick={onExit}
            className="absolute top-4 left-4 bg-gray-800/80 text-white px-4 py-2 rounded-lg text-sm font-medium pointer-events-auto"
          >
            ← Salir
          </button>
          <div className="flex-1 flex items-center justify-center">
            {arStarted && (
              <p className="text-white/50 text-sm animate-pulse">Iniciando AR...</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-3 p-6 pointer-events-auto">
            <p className="text-white/70 text-sm font-medium">{item.name}</p>
            {!arStarted && (
              <button
                onClick={handleStartAR}
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

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE ORIENTATION FALLBACK (iOS / any non-WebXR browser)
// ═══════════════════════════════════════════════════════════════════════════════

// Canonical device-orientation → camera quaternion (from Three.js DeviceOrientationControls)
const _euler = new THREE.Euler();
const _q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const _q0 = new THREE.Quaternion();
const _zee = new THREE.Vector3(0, 0, 1);
const DEG2RAD = Math.PI / 180;
const CAMERA_HEIGHT = 1.5; // metres

function DeviceOrientationCamera({
  orientRef,
}: {
  orientRef: React.MutableRefObject<{ alpha: number; beta: number; gamma: number }>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, CAMERA_HEIGHT, 0);
  }, [camera]);

  useFrame(() => {
    const { alpha, beta, gamma } = orientRef.current;
    _euler.set(beta * DEG2RAD, alpha * DEG2RAD, -gamma * DEG2RAD, "YXZ");
    camera.quaternion.setFromEuler(_euler);
    camera.quaternion.multiply(_q1);
    camera.quaternion.multiply(_q0.setFromAxisAngle(_zee, 0)); // portrait = 0
  });

  return null;
}

// Calculates where the camera look-ray hits the floor (y = 0)
function FloorScene({
  item,
  hitPositionRef,
  pendingRef,
  placedItems,
  onFirstHit,
}: {
  item: Furniture;
  hitPositionRef: React.MutableRefObject<THREE.Vector3>;
  pendingRef: React.MutableRefObject<{ rotation: number; scale: number }>;
  placedItems: PlacedARItem[];
  onFirstHit: () => void;
}) {
  const { camera } = useThree();
  const reticleRef = useRef<THREE.Mesh>(null);
  const ghostRef = useRef<THREE.Group>(null);
  const firstHitRef = useRef(false);
  const rayDir = useRef(new THREE.Vector3());

  useFrame(() => {
    rayDir.current.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();

    // Ray from eye height down to floor plane (y = 0)
    if (rayDir.current.y < -0.05) {
      const t = -CAMERA_HEIGHT / rayDir.current.y;
      const x = rayDir.current.x * t;
      const z = rayDir.current.z * t;

      hitPositionRef.current.set(x, 0, z);

      if (reticleRef.current) {
        reticleRef.current.visible = true;
        reticleRef.current.position.set(x, 0, z);
      }
      if (ghostRef.current) {
        ghostRef.current.visible = true;
        ghostRef.current.position.set(x, 0, z);
        ghostRef.current.rotation.y = pendingRef.current.rotation;
        ghostRef.current.scale.setScalar(pendingRef.current.scale);
      }

      if (!firstHitRef.current) {
        firstHitRef.current = true;
        onFirstHit();
      }
    } else {
      if (reticleRef.current) reticleRef.current.visible = false;
      if (ghostRef.current) ghostRef.current.visible = false;
    }
  });

  return (
    <>
      <mesh ref={reticleRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.1, 32]} />
        <meshStandardMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
      <group ref={ghostRef} visible={false}>
        <FurnitureContent item={item} transparent />
      </group>
      <PlacedItems item={item} placed={placedItems} />
    </>
  );
}

function ARCameraFallback({ item, onExit }: { item: Furniture; onExit: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<"prompt" | "active" | "error">("prompt");
  const [errorMsg, setErrorMsg] = useState("");
  const [hasFloorHit, setHasFloorHit] = useState(false);
  const [placedItems, setPlacedItems] = useState<PlacedARItem[]>([]);
  const [pendingRotation, setPendingRotation] = useState(0);
  const [pendingScale, setPendingScale] = useState(1);

  const orientRef = useRef({ alpha: 0, beta: 90, gamma: 0 });
  const hitPositionRef = useRef(new THREE.Vector3());
  const pendingRef = useRef({ rotation: 0, scale: 1 });
  pendingRef.current = { rotation: pendingRotation, scale: pendingScale };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startSession = useCallback(async () => {
    // iOS 13+ requires explicit DeviceOrientation permission from a user gesture
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          .requestPermission === "function"
      ) {
        const perm = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (perm !== "granted") throw new Error("Permiso de giroscopio denegado.");
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error de permiso.");
      setStage("error");
      return;
    }

    // Camera stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setErrorMsg("No se pudo acceder a la cámara.");
      setStage("error");
      return;
    }

    // Start listening to orientation
    const handler = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) orientRef.current.alpha = e.alpha;
      if (e.beta !== null) orientRef.current.beta = e.beta;
      if (e.gamma !== null) orientRef.current.gamma = e.gamma;
    };
    window.addEventListener("deviceorientation", handler);
    // Store cleanup on the ref so we can call it later
    (orientRef as React.MutableRefObject<{ alpha: number; beta: number; gamma: number } & { _cleanup?: () => void }>)
      .current._cleanup = () => window.removeEventListener("deviceorientation", handler);

    setStage("active");
  }, []);

  // Orientation listener cleanup
  useEffect(() => {
    return () => {
      const ref = orientRef.current as { alpha: number; beta: number; gamma: number; _cleanup?: () => void };
      ref._cleanup?.();
    };
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

  if (stage === "prompt" || stage === "error") {
    return (
      <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-5xl">{stage === "error" ? "⚠️" : "📷"}</div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            {stage === "error" ? "Error de acceso" : "Modo cámara + giroscopio"}
          </h2>
          <p className="text-gray-400 text-sm max-w-xs">
            {stage === "error"
              ? errorMsg
              : "WebXR no está disponible. Se usará el giroscopio del dispositivo y la cámara trasera para visualizar el mueble en tu espacio."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onExit}
            className="bg-gray-700 text-white px-5 py-3 rounded-full text-sm font-medium"
          >
            Volver
          </button>
          {stage !== "error" && (
            <button
              onClick={startSession}
              className="bg-amber-500 text-black font-bold px-5 py-3 rounded-full text-sm"
            >
              Permitir acceso
            </button>
          )}
          {stage === "error" && (
            <button
              onClick={() => setStage("prompt")}
              className="bg-amber-500 text-black font-bold px-5 py-3 rounded-full text-sm"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Three.js overlay */}
      <Canvas
        className="absolute inset-0"
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, CAMERA_HEIGHT, 0], fov: 60 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0); // transparent — lets the video show through
          scene.background = null;
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <DeviceOrientationCamera orientRef={orientRef} />
        <FloorScene
          item={item}
          hitPositionRef={hitPositionRef}
          pendingRef={pendingRef}
          placedItems={placedItems}
          onFirstHit={() => setHasFloorHit(true)}
        />
      </Canvas>

      {/* HTML controls */}
      <div className="absolute inset-0 pointer-events-none">
        <ControlsOverlay
          hasHit={hasFloorHit}
          placedCount={placedItems.length}
          itemName={item.name}
          onExit={onExit}
          onPlace={placeItem}
          onRotateLeft={() => setPendingRotation((r) => r - Math.PI / 8)}
          onRotateRight={() => setPendingRotation((r) => r + Math.PI / 8)}
          onScaleDown={() => setPendingScale((s) => Math.max(s * 0.8, 0.1))}
          onScaleUp={() => setPendingScale((s) => Math.min(s * 1.25, 5))}
          onClearAll={() => setPlacedItems([])}
          hint="Apuntá hacia el suelo para ver el mueble"
        />
        {/* make controls interactive */}
        <style>{`.absolute.inset-0.pointer-events-none button { pointer-events: auto; }`}</style>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTER — picks the right mode based on device capability
// ═══════════════════════════════════════════════════════════════════════════════

export function ARCamera({ item, onExit }: { item: Furniture; onExit: () => void }) {
  const webxrSupported = useXRSessionModeSupported("immersive-ar");

  // Still checking...
  if (webxrSupported === undefined) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <p className="text-white/50 text-sm animate-pulse">Iniciando...</p>
      </div>
    );
  }

  return webxrSupported ? (
    <ARCameraWebXR item={item} onExit={onExit} />
  ) : (
    <ARCameraFallback item={item} onExit={onExit} />
  );
}
