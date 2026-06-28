import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Bounds, useBounds } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";

function GLBModel({ model, onLoad }: { model: string; onLoad?: () => void }) {
  const { scene } = useGLTF(model);
  const cloned = useRef(scene.clone());
  const bounds = useBounds();
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.current.position.set(-center.x, -box.min.y, -center.z);
    bounds.refresh().fit();
    onLoadRef.current?.();
  }, [bounds]);

  return <primitive object={cloned.current} />;
}

function FallbackFurniture({ furniture }: { furniture: Furniture }) {
  return (
    <mesh position={[0, furniture.dimensions.height / 2, 0]}>
      <boxGeometry args={[furniture.dimensions.width, furniture.dimensions.height, furniture.dimensions.depth]} />
      <meshStandardMaterial color={furniture.color} />
    </mesh>
  );
}

function Spinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "#1a0c06" }}>
      <div
        style={{
          width: 48,
          height: 48,
          border: "4px solid #5c3317",
          borderTopColor: "#d97706",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "#a06840", fontSize: 13 }}>Cargando modelo...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

interface FurnitureViewerProps {
  furniture: Furniture;
  onBack: () => void;
  onEnterAR: () => void;
}

export function FurnitureViewer({ furniture, onBack, onEnterAR }: FurnitureViewerProps) {
  const [loading, setLoading] = useState(true);
  const handleLoad = useCallback(() => setLoading(false), []);

  // Reset spinner when furniture changes
  useEffect(() => { setLoading(true); }, [furniture.id]);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#1c0f07" }}>
      {/* 3D Canvas */}
      <div className="relative h-[60vh]" style={{ background: "#1a0c06" }}>
        <Canvas style={{ height: "100%" }} camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.4}>
              {furniture.model ? (
                <GLBModel model={furniture.model} onLoad={handleLoad} />
              ) : (
                <FallbackFurniture furniture={furniture} />
              )}
            </Bounds>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.05} minDistance={0.5} maxDistance={10} />
        </Canvas>

        {loading && furniture.model && <Spinner />}

        {/* Back button overlaid on canvas */}
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(18,8,6,0.8)",
            border: "1px solid #5c3317",
            color: "#f5e6d3",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14,
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          ← Volver
        </button>
      </div>

      {/* Info panel */}
      <div style={{ background: "#120806", borderTop: "2px solid #5c3317" }} className="p-6 flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 style={{ color: "#f5e6d3", fontFamily: "Georgia, serif" }} className="text-2xl font-bold">
                {furniture.name}
              </h2>
              {furniture.model && (
                <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: "#92400e", color: "#fbbf24" }}>
                  3D
                </span>
              )}
            </div>
            <p style={{ color: "#a06840" }} className="text-sm leading-relaxed">
              {furniture.description}
            </p>
            <p style={{ color: "#d97706" }} className="text-2xl font-bold mt-2">
              {furniture.price.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="flex gap-6 mb-5 text-sm" style={{ color: "#7a5230" }}>
          <span>Ancho: <strong style={{ color: "#c4956a" }}>{furniture.dimensions.width * 100}cm</strong></span>
          <span>Alto: <strong style={{ color: "#c4956a" }}>{furniture.dimensions.height * 100}cm</strong></span>
          <span>Prof: <strong style={{ color: "#c4956a" }}>{furniture.dimensions.depth * 100}cm</strong></span>
        </div>

        <button
          onClick={onEnterAR}
          className="w-full py-4 rounded-lg font-bold text-base transition-all duration-200 hover:brightness-110"
          style={{ background: "#d97706", color: "#120806" }}
        >
          🔍 Ver en mi espacio (AR)
        </button>
      </div>
    </div>
  );
}
