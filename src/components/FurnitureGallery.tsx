import { useMemo } from "react";
import type { Furniture } from "../types/furniture";
import { furnitureItems } from "../data/furnitureData";

interface FurnitureGalleryProps {
  onSelectFurniture: (furniture: Furniture) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  mesa: "Mesas",
  sillon: "Sillones",
  mesita: "Mesitas de Luz",
  libreria: "Librerías",
  cama: "Camas",
};

export function FurnitureGallery({ onSelectFurniture }: FurnitureGalleryProps) {
  const categories = useMemo(
    () => [...new Set(furnitureItems.map((item) => item.category))],
    [],
  );

  const formatPrice = (price: number) =>
    `$ ${price.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen" style={{ background: "#1c0f07" }}>
      {/* HEADER */}
      <header style={{ background: "#120806", borderBottom: "2px solid #5c3317" }} className="py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: "#d97706", fontSize: 32 }}>🪵</span>
            <h1 style={{ color: "#f5e6d3", fontFamily: "Georgia, serif" }} className="text-5xl font-bold tracking-tight">
              Madeira
            </h1>
            <span style={{ color: "#d97706", fontSize: 32 }}>🪵</span>
          </div>
          <p style={{ color: "#c4956a" }} className="text-base font-medium tracking-widest uppercase">
            Carpintería &amp; Muebles Artesanales
          </p>
          <p style={{ color: "#a06840" }} className="text-sm mt-1">
            Visualizá nuestros muebles en tu espacio con Realidad Aumentada
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const categoryItems = furnitureItems.filter((item) => item.category === category);
          return (
            <section key={category} className="mb-12">
              {/* Category heading */}
              <div className="flex items-center gap-4 mb-6">
                <div style={{ height: 2, flex: "0 0 24px", background: "#d97706" }} />
                <h2 style={{ color: "#f5e6d3", fontFamily: "Georgia, serif" }} className="text-2xl font-bold">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <div style={{ height: 2, flex: 1, background: "linear-gradient(to right, #5c3317, transparent)" }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((furniture) => (
                  <button
                    key={furniture.id}
                    onClick={() => onSelectFurniture(furniture)}
                    className="group text-left cursor-pointer transition-all duration-200 hover:scale-[102%]"
                    style={{
                      background: "#2a1509",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid #5c3317",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#5c3317")}
                  >
                    {/* PREVIEW */}
                    <div className="aspect-square flex items-center justify-center relative overflow-hidden" style={{ background: "#1a0c06" }}>
                      {furniture.img ? (
                        <img src={furniture.img} alt={furniture.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 opacity-60">
                          <div className="w-16 h-16 rounded-lg" style={{ background: furniture.color }} />
                          <span style={{ color: "#a06840", fontSize: 11 }}>Sin imagen</span>
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(to top, rgba(18,8,6,0.7), transparent)" }} />
                      {furniture.model && (
                        <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded" style={{ background: "#92400e", color: "#fbbf24" }}>
                          3D
                        </span>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="p-4">
                      <h3 style={{ color: "#f5e6d3", fontFamily: "Georgia, serif" }} className="text-lg font-semibold">
                        {furniture.name}
                      </h3>
                      <p style={{ color: "#a06840" }} className="text-sm mt-1 line-clamp-2">
                        {furniture.description}
                      </p>

                      <div className="mt-3 text-xs" style={{ color: "#7a5230" }}>
                        {furniture.dimensions.width * 100}cm × {furniture.dimensions.height * 100}cm × {furniture.dimensions.depth * 100}cm
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span style={{ color: "#d97706" }} className="text-lg font-bold">
                          {formatPrice(furniture.price)}
                        </span>
                        <span style={{ color: "#d97706" }} className="text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
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
      <footer style={{ background: "#120806", borderTop: "1px solid #5c3317" }} className="p-6 mt-4">
        <p style={{ color: "#7a5230" }} className="text-center text-sm">
          Usá el modo AR en Chrome para Android para ver los muebles en tu espacio real.
        </p>
      </footer>
    </div>
  );
}
