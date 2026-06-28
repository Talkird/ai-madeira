import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Bounds, useBounds } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";

const woodGrainBg = (base: string): React.CSSProperties => ({
  backgroundColor: base,
  backgroundImage: [
    "repeating-linear-gradient(91deg, transparent 0px, transparent 3px, rgba(255,200,100,0.018) 3px, rgba(255,200,100,0.018) 4px, transparent 4px, transparent 11px, rgba(0,0,0,0.05) 11px, rgba(0,0,0,0.05) 12px)",
    "repeating-linear-gradient(88deg, transparent 0px, transparent 7px, rgba(200,130,50,0.015) 7px, rgba(200,130,50,0.015) 8px, transparent 8px, transparent 23px, rgba(0,0,0,0.03) 23px, rgba(0,0,0,0.03) 24px)",
  ].join(", "),
});

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
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#0e0603", zIndex: 10 }}>
      <div style={{
        width: 52, height: 52,
        border: "4px solid #3d1e0a",
        borderTopColor: "#d97706",
        borderRadius: "50%",
        animation: "spin 0.75s linear infinite",
      }} />
      <p style={{ color: "#a06840", fontSize: 13, letterSpacing: "0.08em" }}>Cargando modelo 3D…</p>
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
  useEffect(() => { setLoading(true); }, [furniture.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", ...woodGrainBg("#1a0d06") }}>

      {/* ── 3D CANVAS ───────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: "60vh", background: "#0e0603", flexShrink: 0 }}>
        <Canvas style={{ height: "100%" }} camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={2.2} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.4}>
              {furniture.model ? (
                <GLBModel model={furniture.model} onLoad={handleLoad} />
              ) : (
                <FallbackFurniture furniture={furniture} />
              )}
            </Bounds>
            <Environment preset="warehouse" />
          </Suspense>
          <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.05} minDistance={0.5} maxDistance={10} />
        </Canvas>

        {loading && furniture.model && <Spinner />}

        {/* Floating back button */}
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 16, left: 16,
            background: "rgba(10,4,2,0.75)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(92,51,23,0.7)", color: "#c4956a",
            borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d97706")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(92,51,23,0.7)")}
        >
          ← Volver
        </button>

        {/* Hint */}
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", background: "rgba(10,4,2,0.6)", backdropFilter: "blur(4px)", borderRadius: 999, padding: "5px 14px" }}>
          <span style={{ color: "#7a5230", fontSize: 11, letterSpacing: "0.06em" }}>Arrastrá para rotar · Pellizcá para hacer zoom</span>
        </div>
      </div>

      {/* ── INFO PANEL ─────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          borderTop: "2px solid #5c3317",
          padding: "28px 24px 32px",
          ...woodGrainBg("#120806"),
        }}
      >
        {/* Name + badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#f5e6d3", fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {furniture.name}
          </h2>
          {furniture.model && (
            <span style={{ background: "rgba(146,64,14,0.9)", color: "#fbbf24", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(251,191,36,0.3)", whiteSpace: "nowrap", marginTop: 4 }}>
              Modelo 3D
            </span>
          )}
        </div>

        <p style={{ color: "#a06840", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
          {furniture.description}
        </p>

        {/* Dimensions */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Ancho", val: furniture.dimensions.width },
            { label: "Alto", val: furniture.dimensions.height },
            { label: "Prof.", val: furniture.dimensions.depth },
          ].map(({ label, val }) => (
            <div key={label} style={{ background: "rgba(92,51,23,0.25)", border: "1px solid rgba(92,51,23,0.5)", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ color: "#7a5230", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</div>
              <div style={{ color: "#c4956a", fontSize: 15, fontWeight: 700 }}>{Math.round(val * 100)}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2 }}>cm</span></div>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ borderTop: "1px solid rgba(92,51,23,0.4)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#7a5230", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Precio</div>
            <div style={{ color: "#d97706", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
              {furniture.price.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
            </div>
          </div>

          <button
            onClick={onEnterAR}
            style={{
              background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              color: "#fff8f0",
              border: "none",
              borderRadius: 10,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(180,83,9,0.45)",
              transition: "filter 0.15s, transform 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Ver en mi espacio →
          </button>
        </div>
      </div>
    </div>
  );
}
