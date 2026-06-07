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
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number | null>(null);

  // =====================
  // DRAG (mover objeto)
  // =====================
  const onPointerDown = (e: any) => {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: any) => {
    if (!dragging.current || !lastPointer.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    lastPointer.current = { x: e.clientX, y: e.clientY };

    setPosition(([x, y, z]) => [
      x + dx * 0.01,
      y - dy * 0.01,
      z,
    ]);
  };

  const onPointerUp = () => {
    dragging.current = false;
    lastPointer.current = null;
  };

  // =====================
  // ROTACIÓN (wheel desktop)
  // =====================
  const onWheel = (e: any) => {
    setRotation((r) => r + e.deltaY * 0.001);
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
        setZoom((z) => Math.max(0.5, Math.min(3, z + diff * 0.005)));
      }

      lastDist.current = dist;
    }
  };

  return (
    <div className="w-full h-full relative">

      {/* EXIT BUTTON */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded"
      >
        Exit
      </button>

      <Canvas
        camera={{ position: [2, 2, 2] }}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        onTouchMove={onTouchMove}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1} />

        {/* OBJECT */}
        <mesh
          position={position}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {/* rotation + zoom aplicados al grupo */}
          <group rotation={[0, rotation, 0]} scale={zoom}>
            <Box item={item} />
          </group>
        </mesh>

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