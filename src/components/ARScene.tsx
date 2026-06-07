import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
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

function InteractiveBox({
  item,
  onExit,
}: {
  item: Furniture;
  onExit: () => void;
}) {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const dragging = useRef(false);
  const mode = useRef<"rotate" | "move">("rotate");

  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number | null>(null);

  // =====================
  // START TOUCH
  // =====================
  const onPointerDown = (e: any) => {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    // 👇 decide modo:
    // si es más horizontal → rotate
    // si es más vertical → move
    mode.current = "rotate";
  };

  const onPointerMove = (e: any) => {
    if (!dragging.current || !lastPointer.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    lastPointer.current = { x: e.clientX, y: e.clientY };

    // =====================
    // ROTACIÓN IKEA (suave)
    // =====================
    if (mode.current === "rotate") {
      setRotation((r) => r + dx * 0.008);
    }

    // =====================
    // MOVIMIENTO
    // =====================
    setPosition(([x, y, z]) => [
      x,
      y - dy * 0.01,
      z,
    ]);
  };

  const onPointerUp = () => {
    dragging.current = false;
    lastPointer.current = null;
  };

  // =====================
  // PINCH ZOOM (mobile)
  // =====================
  const onTouchMove = (e: any) => {
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
    }
  };

  return (
    <div className="w-full h-full relative">

      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded"
      >
        Exit
      </button>

      <Canvas
        camera={{ position: [2, 2, 2] }}
        onPointerUp={onPointerUp}
        onTouchMove={onTouchMove}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1} />

        <group
          position={position}
          rotation={[0, rotation, 0]}
          scale={zoom}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          <Box item={item} />
        </group>

      </Canvas>
    </div>
  );
}

export function ARScene(props: Props) {
  return (
    <InteractiveBox
      item={props.item}
      onExit={props.onExit}
    />
  );
}