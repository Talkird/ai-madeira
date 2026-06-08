import { useEffect, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";
import type { PlacedItem } from "../data/arPhysics";
import { updatePhysics } from "../data/arPhysics";

// ===================== MODEL =====================
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const cloned = useMemo(() => {
    const c = scene.clone();

    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();

    box.getCenter(center);

    c.position.set(
      c.position.x - center.x,
      c.position.y - box.min.y,
      c.position.z - center.z
    );

    return c;
  }, [scene]);

  return <primitive object={cloned} />;
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
  setPlacedItems,
}: {
  item: Furniture & { model?: string };
  scale: number;
  onExit: () => void;
  placedItems: PlacedItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rotation = useRef({ x: 0, y: 0 });
  const position = useRef<[number, number, number]>([0, 0, -2]);

  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  // =====================
  // CAMERA
  // =====================
  useEffect(() => {
    let stream: MediaStream;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    start();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // =====================
  // PHYSICS LOOP (NUEVO)
  // =====================
  useEffect(() => {
    const interval = setInterval(() => {
      setPlacedItems((prev) => updatePhysics(prev));
    }, 16);

    return () => clearInterval(interval);
  }, [setPlacedItems]);

  // =====================
  // TOUCH
  // =====================
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;

    dragging.current = true;
    lastPointer.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || !lastPointer.current || !groupRef.current)
      return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const dx = x - lastPointer.current.x;
    const dy = y - lastPointer.current.y;

    lastPointer.current = { x, y };

    // ROTATION
    rotation.current.y += dx * 0.01;
    rotation.current.x += dy * 0.01;

    rotation.current.x = Math.max(-1.2, Math.min(1.2, rotation.current.x));

    // POSITION (AR SPACE ARTIFICIAL)
    position.current[0] += dx * 0.002;
    position.current[2] += dy * 0.002;

    position.current[0] = Math.max(-3, Math.min(3, position.current[0]));
    position.current[2] = Math.max(-6, Math.min(-1, position.current[2]));
    position.current[1] = 0;

    groupRef.current.position.set(...position.current);
    groupRef.current.rotation.set(
      rotation.current.x,
      rotation.current.y,
      0
    );
  };

  const onTouchEnd = () => {
    dragging.current = false;
    lastPointer.current = null;
  };

  const hasModel = !!item.model;
  const baseScale = scale;

  // =====================
  // ADD ITEM (NUEVO - base multi objeto)
  // =====================
  const addItem = () => {
    const newItem: PlacedItem = {
      id: Date.now().toString(),
      furnitureId: item.id,
      position: [0, 0, -2],
      size: [
        item.dimensions.width,
        item.dimensions.height,
        item.dimensions.depth,
      ],
    };

    setPlacedItems((prev) => [...prev, newItem]);
  };

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

          {/* OBJETO ACTUAL */}
          <group ref={groupRef} scale={baseScale}>
            {hasModel ? (
              <Model url={item.model!} />
            ) : (
              <Box item={item} />
            )}
          </group>
        </Canvas>
      </div>

      {/* UI */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Exit AR
      </button>

      <button
        onClick={addItem}
        className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Place item
      </button>
    </div>
  );
}