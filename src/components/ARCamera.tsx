import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";

// ===================== MODEL =====================
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();

    box.getCenter(center);

    // centrar en XZ
    scene.position.x -= center.x;
    scene.position.z -= center.z;

    // 🔥 ANCLA AL SUELO
    scene.position.y -= box.min.y;
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// ===================== BOX =====================
function Box({ item }: { item: Furniture }) {
  return (
    <mesh position={[0, item.dimensions.height / 2, 0]}>
      <boxGeometry
        args={[
          item.dimensions.width,
          item.dimensions.height,
          item.dimensions.depth,
        ]}
      />
      <meshStandardMaterial color={item.color} />
    </mesh>
  );
}

// ===================== CAMERA =====================
export function ARCamera({
  item,
  scale,
  onExit,
}: {
  item: Furniture & { model?: string };
  scale: number;
  onExit: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const [zoom, setZoom] = useState(1);

  // 🟢 PISO FIJO (clave IKEA)
  const [position, setPosition] = useState<[number, number, number]>([
    0,
    0,
    -2,
  ]);

  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number | null>(null);

  // =====================
  // CAMERA
  // =====================
  useEffect(() => {
    let stream: MediaStream;

    const start = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    };

    start();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // =====================
  // TOUCH
  // =====================
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      lastPointer.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }

    if (e.touches.length === 2) {
      dragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // pinch zoom
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (lastDist.current !== null) {
        const diff = dist - lastDist.current;
        setZoom((z) => Math.max(0.5, Math.min(3, z + diff * 0.005)));
      }

      lastDist.current = dist;
      return;
    }

    if (!dragging.current || !lastPointer.current) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const dx = x - lastPointer.current.x;
    const dy = y - lastPointer.current.y;

    lastPointer.current = { x, y };

    // horizontal rotation
    setRotationY((r) => r + dx * 0.01);

    // vertical rotation (limitado estilo IKEA)
    setRotationX((r) =>
      Math.max(-1.2, Math.min(1.2, r + dy * 0.01))
    );

    // 🟢 IMPORTANTE: eliminamos “flotación libre”
    // solo leve ajuste horizontal
    setPosition(([px, pz]) => [
      px + dx * 0.002,
      0, // 🔥 SIEMPRE EN EL PISO
      pz,
    ]);
  };

  const onTouchEnd = () => {
    dragging.current = false;
    lastPointer.current = null;
    lastDist.current = null;
  };

  const hasModel = !!item.model;

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      <div
        className="absolute inset-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Canvas camera={{ position: [0, 1.5, 3], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 5, 2]} intensity={1} />

          <group
            position={position}
            rotation={[rotationX, rotationY, 0]}
            scale={zoom * scale}
          >
            {hasModel ? (
              <Model url={item.model!} />
            ) : (
              <Box item={item} />
            )}
          </group>
        </Canvas>
      </div>

      <button
        onClick={onExit}
        className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Exit AR
      </button>
    </div>
  );
}