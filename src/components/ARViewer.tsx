import { useState } from "react";
import { Furniture } from "../types/furniture";

interface ARViewerProps {
  furniture: Furniture;
  onClose: () => void;
  isARMode?: boolean;
}

export function ARViewer({
  furniture,
  onClose,
  isARMode = false,
}: ARViewerProps) {
  const [scale, setScale] = useState(1);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Simple 3D Viewer (Placeholder) */}
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div
          className="rounded-lg shadow-2xl p-8"
          style={{
            width: furniture.dimensions.width * 100,
            height: furniture.dimensions.height * 100,
            backgroundColor: furniture.color,
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease",
          }}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {furniture.name}
              </h2>
              <p className="text-gray-300 text-sm">{furniture.description}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-auto">
          <div className="max-w-md mx-auto">
            {/* Size Control */}
            <div className="mb-4">
              <label className="text-white text-sm font-semibold block mb-2">
                Size: {scale.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Specifications */}
            <div className="bg-gray-800/70 rounded-lg p-4 mb-4">
              <h3 className="text-white font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-300">
                <div>
                  <span className="text-gray-400">Width</span>
                  <p className="text-white font-semibold">
                    {furniture.dimensions.width.toFixed(1)}m
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Height</span>
                  <p className="text-white font-semibold">
                    {furniture.dimensions.height.toFixed(1)}m
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Depth</span>
                  <p className="text-white font-semibold">
                    {furniture.dimensions.depth.toFixed(1)}m
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 rounded-lg transition-all">
              {isARMode
                ? "📱 View in AR"
                : "🛒 Add to Cart - $" + furniture.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
