import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Furniture } from "../types/furniture";

interface Props {
  item: Furniture;
  scale: number;
  onExit: () => void;
}

function Box({ item, scale }: { item: Furniture; scale: number }) {
  return (
    <mesh>
      <boxGeometry
        args={[
          item.dimensions.width * scale,
          item.dimensions.height * scale,
          item.dimensions.depth * scale,
        ]}
      />
      <meshStandardMaterial color={item.color} />
    </mesh>
  );
}

export function ARScene({ item, scale, onExit }: Props) {
  return (
    <div className="w-full h-full relative">
      
      {/* EXIT */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded"
      >
        Exit
      </button>

      {/* 3D SCENE */}
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1} />

        <Box item={item} scale={scale} />

        {/* 👇 esto ya te da drag/zoom/rotate básico */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}