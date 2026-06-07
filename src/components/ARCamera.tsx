import { useEffect, useRef, useState } from "react";
import type { Furniture } from "../types/furniture";

interface Props {
  item: Furniture;
  scale: number;
  onExit: () => void;
}

export function ARCamera({ item, scale, onExit }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // =====================
  // STATE INTERACTION
  // =====================
  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number | null>(null);

  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  // =====================
  // CAMERA
  // =====================
  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
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

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // =====================
  // TOUCH START
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
      dragging.current = false; // 👈 evita conflicto drag vs pinch
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  // =====================
  // TOUCH MOVE
  // =====================
  const onTouchMove = (e: React.TouchEvent) => {
    // =====================
    // PINCH ZOOM
    // =====================
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (lastDist.current !== null) {
        const diff = dist - lastDist.current;

        setZoom((z) =>
          Math.max(0.5, Math.min(3, z + diff * 0.005))
        );
      }

      lastDist.current = dist;
      return;
    }

    // =====================
    // DRAG + ROTATION (IKEA STYLE)
    // =====================
    if (!dragging.current || !lastPointer.current) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const dx = x - lastPointer.current.x;
    const dy = y - lastPointer.current.y;

    lastPointer.current = { x, y };

    // IKEA FEEL:
    setRotation((r) => r + dx * 0.01);
    setPosition(([px, py]) => [
      px + dx * 0.002,
      py - dy * 0.002,
    ]);
  };

  const onTouchEnd = () => {
    dragging.current = false;
    lastPointer.current = null;
    lastDist.current = null;
  };

  return (
    <div className="absolute inset-0 w-full h-full">

      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      {/* OBJECT */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            width: item.dimensions.width * 100 * scale,
            height: item.dimensions.height * 100 * scale,
            backgroundColor: item.color,
            transform: `
              translate(${position[0]}px, ${position[1]}px)
              rotateY(${rotation}rad)
              scale(${zoom})
            `,
            boxShadow:
              "inset -10px -10px 30px rgba(0,0,0,0.5), -20px 20px 50px rgba(0,0,0,0.6)",
          }}
          className="rounded-lg"
        />
      </div>

      {/* EXIT */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Exit AR
      </button>
    </div>
  );
}