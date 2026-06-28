import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Bounds, useBounds } from "@react-three/drei";
import * as THREE from "three";
import type { Furniture } from "../types/furniture";

function GLBModel({ model }: { model: string }) {
  const { scene } = useGLTF(model);
  const cloned = useRef(scene.clone());
  const bounds = useBounds();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.current.position.set(-center.x, -box.min.y, -center.z);
    bounds.refresh().fit();
  }, [bounds]);

  return <primitive object={cloned.current} />;
}

function FallbackFurniture({
  furniture,
}: {
  furniture: Furniture;
}) {
  return (
    <mesh position={[0, furniture.dimensions.height / 2, 0]}>
      <boxGeometry
        args={[
          furniture.dimensions.width,
          furniture.dimensions.height,
          furniture.dimensions.depth,
        ]}
      />

      <meshStandardMaterial color={furniture.color} />
    </mesh>
  );
}

interface FurnitureViewerProps {
  furniture: Furniture;
  onBack: () => void;
  onEnterAR: () => void;
}

export function FurnitureViewer({
  furniture,
  onBack,
  onEnterAR,
}: FurnitureViewerProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gray-950">
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.4}>
              {furniture.model ? (
                <GLBModel model={furniture.model} />
              ) : (
                <FallbackFurniture furniture={furniture} />
              )}
            </Bounds>
            <Environment preset="city" />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
            minDistance={0.5}
            maxDistance={10}
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
                  Model 3D
                </span>
              )}
            </div>

            <p className="text-gray-400">{furniture.description}</p>

            <p className="text-amber-400 text-xl">
              {furniture.price.toLocaleString("en-US", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>

          <button
            onClick={onBack}
            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 cursor-pointer transition duration-300 font-medium"
          >
            Atras
          </button>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p>Ancho: {furniture.dimensions.width * 100}cm</p>

          <p>Alto: {furniture.dimensions.height * 100}cm</p>

          <p>Profundidad: {furniture.dimensions.depth * 100}cm</p>
        </div>

        <button
          onClick={onEnterAR}
          className="w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700 transition-all duration-300 font-medium"
        >
          Entrar en AR
        </button>
      </div>
    </div>
  );
}
