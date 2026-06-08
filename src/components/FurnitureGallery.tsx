import { useMemo } from "react";
import type { Furniture } from "../types/furniture";
import { furnitureItems } from "../data/furnitureData";

interface FurnitureGalleryProps {
  onSelectFurniture: (furniture: Furniture) => void;
}

export function FurnitureGallery({
  onSelectFurniture,
}: FurnitureGalleryProps) {
  const categories = useMemo(
    () => [...new Set(furnitureItems.map((item) => item.category))],
    []
  );

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 py-8 px-4">
        <h1 className="text-4xl font-bold text-white text-center">
          AR Furniture Viewer
        </h1>

        <p className="text-amber-100 text-center mt-2">
          Select furniture and preview it in your space
        </p>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const categoryItems = furnitureItems.filter(
            (item) => item.category === category
          );

          return (
            <section key={category} className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 capitalize">
                {category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((furniture) => (
                  <button
                    key={furniture.id}
                    onClick={() => onSelectFurniture(furniture)}
                    className="
                      group
                      bg-gray-700
                      rounded-lg
                      overflow-hidden
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:shadow-2xl
                      text-left
                    "
                  >
                    {/* PREVIEW */}
                    <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div
                        className="w-20 h-20 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{
                          backgroundColor: furniture.color,
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* INFO */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">

                        <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {furniture.name}
                        </h3>

                        {furniture.model && (
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            3D
                          </span>
                        )}

                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {furniture.description}
                      </p>

                      {/* DIMENSIONS */}
                      <div className="mt-3 text-xs text-gray-500">
                        <span>
                          W: {furniture.dimensions.width.toFixed(1)}m
                        </span>
                        {" • "}
                        <span>
                          H: {furniture.dimensions.height.toFixed(1)}m
                        </span>
                        {" • "}
                        <span>
                          D: {furniture.dimensions.depth.toFixed(1)}m
                        </span>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-amber-400 font-bold">
                          {formatPrice(furniture.price)}
                        </span>

                        <span className="text-amber-500 group-hover:text-amber-400 font-semibold text-sm">
                          View →
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 border-t border-gray-700 p-6 mt-10">
        <p className="text-gray-400 text-center text-sm">
          Use AR mode on a mobile device with a camera to visualize furniture in
          your real environment.
        </p>
      </footer>
    </div>
  );
}