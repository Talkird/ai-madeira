import type { Furniture } from "../types/furniture";
import { furnitureItems } from "../data/furnitureData";

interface FurnitureGalleryProps {
  onSelectFurniture: (furniture: Furniture) => void;
}

export function FurnitureGallery({ onSelectFurniture }: FurnitureGalleryProps) {
  const categories = Array.from(new Set(furnitureItems.map((f) => f.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-8 px-4">
        <h1 className="text-4xl font-bold text-white text-center">
          AR Furniture Viewer
        </h1>
        <p className="text-amber-100 text-center mt-2">
          Select furniture and view it in your space
        </p>
      </div>

      {/* Furniture Grid */}
      <div className="p-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4 capitalize">
              {category}s
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {furnitureItems
                .filter((item) => item.category === category)
                .map((furniture) => (
                  <button
                    key={furniture.id}
                    onClick={() => onSelectFurniture(furniture)}
                    className="group relative bg-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    {/* Furniture Preview Box */}
                    <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div
                        className="w-20 h-20 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: furniture.color }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {furniture.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {furniture.description}
                      </p>

                      {/* Dimensions */}
                      <div className="mt-3 text-xs text-gray-500">
                        <span>W: {furniture.dimensions.width.toFixed(1)}m</span>
                        {" • "}
                        <span>
                          H: {furniture.dimensions.height.toFixed(1)}m
                        </span>
                        {" • "}
                        <span>D: {furniture.dimensions.depth.toFixed(1)}m</span>
                      </div>

                      {/* Price and Button */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-amber-400 font-bold">
                          ${furniture.price}
                        </span>
                        <span className="text-amber-500 group-hover:text-amber-400 font-semibold text-sm">
                          View in AR →
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800 border-t border-gray-700 p-6 mt-10">
        <p className="text-gray-400 text-center text-sm">
          💡 Tip: Use AR mode on a mobile device with a camera to see furniture
          in your real space
        </p>
      </div>
    </div>
  );
}
