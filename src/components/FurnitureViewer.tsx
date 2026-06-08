import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";

function GLBModel({
  model,
  scale,
}: {
  model: string;
  scale: number;
}) {
  const { scene } = useGLTF(model);

  const cloned = useRef(scene.clone());

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(
      cloned.current
    );

    const center = new THREE.Vector3();

    box.getCenter(center);

    cloned.current.position.set(
      -center.x,
      -box.min.y,
      -center.z
    );
  }, []);

  return (
    <primitive
      object={cloned.current}
      scale={scale}
    />
  );
}

function FallbackFurniture({
  furniture,
  scale,
}: {
  furniture: Furniture;
  scale: number;
}) {
  return (
    <mesh
      scale={scale}
      position={[0, furniture.dimensions.height / 2, 0]}
    >
      <boxGeometry
        args={[
          furniture.dimensions.width,
          furniture.dimensions.height,
          furniture.dimensions.depth,
        ]}
      />

      <meshStandardMaterial
        color={furniture.color}
      />
    </mesh>
  );
}

interface FurnitureViewerProps {
  furniture: Furniture;
  scale: number;
  onScaleChange: (value: number) => void;
  onBack: () => void;
  onEnterAR: () => void;
}

export function FurnitureViewer({
  furniture,
  scale,
  onScaleChange,
  onBack,
  onEnterAR,
}: FurnitureViewerProps) {
  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex-1 bg-gray-950">

        <Canvas
          camera={{
            position: [2, 2, 3],
            fov: 50,
          }}
        >
          <ambientLight intensity={1} />

          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
          />

          <Suspense fallback={null}>

            {furniture.model ? (
              <GLBModel
                model={furniture.model}
                scale={scale}
              />
            ) : (
              <FallbackFurniture
                furniture={furniture}
                scale={scale}
              />
            )}

            <Environment preset="city" />

          </Suspense>

          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={8}
          />
        </Canvas>

      </div>

      <div className="bg-gray-900 p-6 border-t border-gray-700">

        <div className="flex justify-between mb-4">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-2xl text-white font-bold">
                {furniture.name}
              </h2>

              {furniture.model && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  3D Model
                </span>
              )}

            </div>

            <p className="text-gray-400">
              {furniture.description}
            </p>

            <p className="text-amber-400 text-xl">
              {furniture.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>

          </div>

          <button
            onClick={onBack}
            className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
          >
            Back
          </button>

        </div>

        <div className="mb-4">

          <p className="text-gray-400 mb-2">
            Scale ({scale.toFixed(1)}x)
          </p>

          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) =>
              onScaleChange(Number(e.target.value))
            }
            className="w-full"
          />

        </div>

        <div className="text-sm text-gray-500 mb-4">

          <p>
            Width: {furniture.dimensions.width}m
          </p>

          <p>
            Height: {furniture.dimensions.height}m
          </p>

          <p>
            Depth: {furniture.dimensions.depth}m
          </p>

        </div>

        <button
          onClick={onEnterAR}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Enter AR
        </button>

      </div>

    </div>
  );
}