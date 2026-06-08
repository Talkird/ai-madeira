import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Furniture } from "../types/furniture";

interface Props {
  item: Furniture;
  scale: number;
  onExit: () => void;
}

function Box({ item }: { item: Furniture }) {
  return (
    <mesh>
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

export function ARCamera({ item, scale, onExit }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [position, setPosition] = useState<[number, number, number]>([0, 0, -2]);

  // ✅ NEW
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const [zoom, setZoom] = useState(1);

  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number | null>(null);

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
    // PINCH
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

    // DRAG + ROTATE (IKEA)
    if (!dragging.current || !lastPointer.current) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const dx = x - lastPointer.current.x;
    const dy = y - lastPointer.current.y;

    lastPointer.current = { x, y };

    // ✔ horizontal = Y rotation
    setRotationY((r) => r + dx * 0.01);

    // ✔ vertical = X rotation
    setRotationX((r) =>
      Math.max(-1.2, Math.min(1.2, r + dy * 0.01))
    );

    setPosition(([px, py, pz]) => [
      px + dx * 0.002,
      py - dy * 0.002,
      pz,
    ]);
  };

  const onTouchEnd = () => {
    dragging.current = false;
    lastPointer.current = null;
    lastDist.current = null;
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
        <Canvas
          className="w-full h-full"
          gl={{ alpha: true }}
          camera={{
            position: [0, 0, 3],
            fov: 60,
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 5, 2]} intensity={1} />

          <group
            position={position}
            rotation={[rotationX, rotationY, 0]}
            scale={zoom * scale}
          >
            <Box item={item} />
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