import { useMemo } from "react";
import type { Furniture } from "../types/furniture";
import { furnitureItems } from "../data/furnitureData";

interface FurnitureGalleryProps {
  onSelectFurniture: (furniture: Furniture) => void;
}

export function FurnitureGallery({ onSelectFurniture }: FurnitureGalleryProps) {
  const categories = useMemo(
    () => [...new Set(furnitureItems.map((item) => item.category))],
    [],
  );

  const formatPrice = (price: number) =>
    `$ ${price.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen  bg-gray-900">
      {/* HEADER */}
      <header className="bg-gray-800 py-8 px-4">
        <h1 className="text-4xl font-bold text-white text-center">
          Madeira <br />
          <span className="text-lg md:text-2xl">
            Visualizador de Muebles en AR
          </span>
        </h1>

        <p className="text-amber-300 font-medium text-center mt-2">
          Selecciona muebles y prévisualízalos en tu espacio
        </p>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const categoryItems = furnitureItems.filter(
            (item) => item.category === category,
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
                      hover:scale-[102%]
                      transition-all
                      duration-200
                      hover:opacity-75
                      text-left
                      cursor-pointer
                    "
                  >
                    {/* PREVIEW */}
                    <div className="aspect-square bg-gray-800 flex items-center justify-center relative overflow-hidden">
                      {furniture.img ? (
                        <img
                          src={furniture.img}
                          alt={furniture.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-20 h-20 rounded-md opacity-80"
                          style={{ backgroundColor: furniture.color }}
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    {/* INFO */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white  transition-colors">
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
                        <span>Ancho: {furniture.dimensions.width * 100}cm</span>
                        {" • "}
                        <span>Alto: {furniture.dimensions.height * 100}cm</span>
                        {" • "}
                        <span>
                          Profundidad: {furniture.dimensions.depth * 100}cm
                        </span>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-amber-400 font-bold">
                          {formatPrice(furniture.price)}
                        </span>

                        <span className="text-amber-500  font-semibold text-sm">
                          Ver →
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
          Usa el modo AR en un dispositivo móvil con cámara para visualizar los
          muebles en tu entorno real.
        </p>
      </footer>
    </div>
  );
}
