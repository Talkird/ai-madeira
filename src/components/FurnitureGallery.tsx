import { useMemo } from "react";
import type { Furniture } from "../types/furniture";
import { furnitureItems } from "../data/furnitureData";
import heroPng from "../assets/hero.png";

interface FurnitureGalleryProps {
  onSelectFurniture: (furniture: Furniture) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  mesa: "Mesas",
  sillon: "Sillones",
  mesita: "Mesitas de Luz",
  cama: "Camas",
};

// CSS wood-grain built from layered repeating-linear-gradients
const woodGrainBg = (base: string) => ({
  backgroundColor: base,
  backgroundImage: [
    "repeating-linear-gradient(91deg, transparent 0px, transparent 3px, rgba(255,200,100,0.018) 3px, rgba(255,200,100,0.018) 4px, transparent 4px, transparent 11px, rgba(0,0,0,0.05) 11px, rgba(0,0,0,0.05) 12px)",
    "repeating-linear-gradient(88deg, transparent 0px, transparent 7px, rgba(200,130,50,0.015) 7px, rgba(200,130,50,0.015) 8px, transparent 8px, transparent 23px, rgba(0,0,0,0.03) 23px, rgba(0,0,0,0.03) 24px)",
  ].join(", "),
});

export function FurnitureGallery({ onSelectFurniture }: FurnitureGalleryProps) {
  const categories = useMemo(
    () => [...new Set(furnitureItems.map((item) => item.category))],
    [],
  );

  const formatPrice = (price: number) =>
    `$ ${price.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

  return (
    <div style={{ minHeight: "100vh", ...woodGrainBg("#1a0d06") }}>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "3px solid #8B5E2A",
        }}
      >
        {/* Background photo */}
        <img
          src={heroPng}
          alt=""
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Dark + warm gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(12,5,2,0.78) 0%, rgba(40,18,6,0.60) 60%, rgba(12,5,2,0.85) 100%)" }} />
        {/* Grain overlay */}
        <div style={{ position: "absolute", inset: 0, ...woodGrainBg("transparent"), opacity: 0.6 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "72px 24px 56px", textAlign: "center" }}>
          <p style={{ color: "#d97706", fontSize: 12, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>
            — Artesanía en madera —
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(44px,7vw,80px)", fontWeight: 700, color: "#f5e6d3", lineHeight: 1.05, marginBottom: 16, textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}>
            Madeira
          </h1>
          <p style={{ color: "#c4956a", fontSize: 18, maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Muebles artesanales de alta calidad. Visualizalos en tu espacio con Realidad Aumentada.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.35)", borderRadius: 999, padding: "8px 20px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
            <span style={{ color: "#e0a84a", fontSize: 13, fontWeight: 500 }}>AR disponible en Chrome para Android</span>
          </div>
        </div>
      </header>

      {/* ── CATALOG ─────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px 64px" }}>
        {categories.map((category) => {
          const items = furnitureItems.filter((i) => i.category === category);
          return (
            <section key={category} style={{ marginBottom: 56 }}>

              {/* Category heading */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: "linear-gradient(to bottom, #d97706, #92400e)" }} />
                <h2 style={{ fontFamily: "Georgia, serif", color: "#f5e6d3", fontSize: 26, fontWeight: 700, margin: 0 }}>
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(139,94,42,0.6), transparent)" }} />
                <span style={{ color: "#7a5230", fontSize: 13 }}>{items.length} {items.length === 1 ? "producto" : "productos"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                {items.map((furniture) => (
                  <FurnitureCard
                    key={furniture.id}
                    furniture={furniture}
                    formatPrice={formatPrice}
                    onClick={() => onSelectFurniture(furniture)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid #5c3317",
          padding: "32px 24px",
          textAlign: "center",
          ...woodGrainBg("#100804"),
        }}
      >
        <p style={{ fontFamily: "Georgia, serif", color: "#d97706", fontSize: 18, marginBottom: 6 }}>Madeira</p>
        <p style={{ color: "#7a5230", fontSize: 13 }}>Carpintería artesanal · Muebles de autor</p>
      </footer>
    </div>
  );
}

// ── CARD ──────────────────────────────────────────────────────────────────────

function FurnitureCard({
  furniture,
  formatPrice,
  onClick,
}: {
  furniture: Furniture;
  formatPrice: (n: number) => string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #5c3317",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
        width: "100%",
        ...woodGrainBg("#271205"),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.55)";
        e.currentTarget.style.borderColor = "#d97706";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.45)";
        e.currentTarget.style.borderColor = "#5c3317";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#100804" }}>
        {furniture.img ? (
          <img
            src={furniture.img}
            alt={furniture.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, background: furniture.color, opacity: 0.7 }} />
          </div>
        )}
        {/* Bottom fade */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,4,2,0.65) 0%, transparent 50%)" }} />
        {/* Badges */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
          {furniture.model && (
            <span style={{ background: "rgba(146,64,14,0.92)", color: "#fbbf24", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, backdropFilter: "blur(4px)", border: "1px solid rgba(251,191,36,0.25)" }}>
              3D
            </span>
          )}
        </div>
        {/* Name overlay at bottom of image */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px" }}>
          <h3 style={{ fontFamily: "Georgia, serif", color: "#f5e6d3", fontSize: 18, fontWeight: 700, margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
            {furniture.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ color: "#a06840", fontSize: 13, lineHeight: 1.55, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {furniture.description}
        </p>

        <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#7a5230", flexWrap: "wrap" }}>
          <span>{furniture.dimensions.width * 100}cm×{furniture.dimensions.height * 100}cm×{furniture.dimensions.depth * 100}cm</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(92,51,23,0.5)" }}>
          <span style={{ color: "#d97706", fontSize: 20, fontWeight: 700 }}>
            {formatPrice(furniture.price)}
          </span>
          <span style={{ color: "#d97706", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            Ver modelo →
          </span>
        </div>
      </div>
    </button>
  );
}
