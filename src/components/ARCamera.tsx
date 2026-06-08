import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";
import type { PlacedItem } from "../data/arPhysics";
import { updatePhysics } from "../data/arPhysics";

// ================= MODEL =================
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const cloned = useRef(scene.clone());

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned.current);
    const center = new THREE.Vector3();

    box.getCenter(center);

    cloned.current.position.set(-center.x, -box.min.y, -center.z);
  }, []);

  return <primitive object={cloned.current} />;
}

// ================= BOX =================
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

// ================= AR CAMERA =================
export function ARCamera({
  item,
  onExit,
  placedItems,
  setPlacedItems,
}: {
  item: Furniture & { model?: string };
  onExit: () => void;
  placedItems: PlacedItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rotation = useRef({ x: 0, y: 0 });
  const position = useRef<[number, number, number]>([0, 0, -2]);

  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // CAMERA
  useEffect(() => {
    let stream: MediaStream;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error(e);
      }
    };

    start();

    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  // PHYSICS
  useEffect(() => {
    if (!placedItems.length) return;

    const id = setInterval(() => {
      setPlacedItems((prev) => updatePhysics(prev));
    }, 80);

    return () => clearInterval(id);
  }, [placedItems.length, setPlacedItems]);

  // TOUCH
  const onStart = (e: React.TouchEvent) => {
    dragging.current = true;

    last.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onMove = (e: React.TouchEvent) => {
    if (!dragging.current || !groupRef.current || !last.current) return;

    const dx = e.touches[0].clientX - last.current.x;
    const dy = e.touches[0].clientY - last.current.y;

    last.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    rotation.current.y += dx * 0.01;
    rotation.current.x += dy * 0.01;

    rotation.current.x = Math.max(-1.2, Math.min(1.2, rotation.current.x));

    position.current[0] += dx * 0.002;
    position.current[2] += dy * 0.002;

    groupRef.current.position.set(...position.current);

    groupRef.current.rotation.set(rotation.current.x, rotation.current.y, 0);
  };

  const onEnd = () => {
    dragging.current = false;
    last.current = null;
  };

  const hasModel = !!item.model;

  return (
    <div className="absolute inset-0">
      {/* CAMERA */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* RETICLE */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          pointer-events-none
          z-20
        "
      >
        <div className="relative w-12 h-12">
          <div
            className="
              absolute
              left-1/2
              top-0
              bottom-0
              w-[2px]
              bg-white/80
              -translate-x-1/2
            "
          />

          <div
            className="
              absolute
              top-1/2
              left-0
              right-0
              h-[2px]
              bg-white/80
              -translate-y-1/2
            "
          />

          <div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-white/50
            "
          />
        </div>
      </div>

      {/* THREE SCENE */}
      <div
        className="absolute inset-0"
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        <Canvas camera={{ position: [0, 1.5, 3], fov: 60 }}>
          <ambientLight intensity={0.8} />

          <directionalLight position={[2, 5, 2]} />

          <group ref={groupRef}>
            {hasModel ? <Model url={item.model!} /> : <Box item={item} />}
          </group>
        </Canvas>
      </div>

      {/* EXIT */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded z-30"
      >
        Exit
      </button>

      {/* PLACE */}
    </div>
  );
}
