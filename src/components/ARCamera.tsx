import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";
import type { PlacedItem } from "../data/arPhysics";

// ===================== MODEL =====================
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();

    box.getCenter(center);

    cloned.position.x -= center.x;
    cloned.position.z -= center.z;
    cloned.position.y -= box.min.y;
  }, [cloned]);

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
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
  placedItems,
  setPlacedItems,
}: {
  item: Furniture & { model?: string };
  scale: number;
  onExit: () => void;
  placedItems: PlacedItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  // 🟢 posición estable
  const posRef = useRef<[number, number, number]>([0, 0, -2]);
  const [position, setPosition] = useState<[number, number, number]>([
    0, 0, -2,
  ]);

  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

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
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || !lastPointer.current) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const dx = x - lastPointer.current.x;
    const dy = y - lastPointer.current.y;

    lastPointer.current = { x, y };

    // rotación horizontal
    setRotationY((r) => r + dx * 0.01);

    // rotación vertical limitada
    setRotationX((r) =>
      Math.max(-1.2, Math.min(1.2, r + dy * 0.01))
    );

    // movimiento estable sin drift
    posRef.current[0] += dx * 0.002;
    posRef.current[2] += dy * 0.002;
    posRef.current[1] = 0;

    setPosition([...posRef.current]);
  };

  const onTouchEnd = () => {
    dragging.current = false;
    lastPointer.current = null;
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
            scale={scale}
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