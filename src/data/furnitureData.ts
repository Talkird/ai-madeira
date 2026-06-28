import type { Furniture } from "../types/furniture";
import mesa from "../assets/mesa.glb?url";
import silla from "../assets/silla.glb?url";
import sillaBarMarron from "../assets/silla_de_bar_marron.glb?url";
import sillaBarCircular from "../assets/silla_de_bar_circular.glb?url";
import mesaConCajon from "../assets/mesa_con_cajon.glb?url";
import mesaCafe from "../assets/mesa_cafe.glb?url";
import mesaOvalo from "../assets/mesa_ovalo.glb?url";
import mesaRedonda from "../assets/mesa_redonda.glb?url";
import sillon from "../assets/sillon.glb?url";
import mesitaDeLuz from "../assets/mesita_de_luz.glb?url";
import libreria from "../assets/libreria.glb?url";
import silla1 from "../assets/silla1.png";
import silla2 from "../assets/silla2.png";

export const furnitureItems: Furniture[] = [
  // ── Sillas ──────────────────────────────────────────────────────────────────
  {
    id: "silla-bar-1",
    name: "Silla de barra",
    category: "silla",
    description: "Silla de barra con diseño moderno, perfecta para cocinas y bares.",
    dimensions: { width: 0.65, height: 1.05, depth: 0.65 },
    color: "#2D3748",
    price: 150000,
    model: silla as string,
    img: silla2,
  },
  {
    id: "silla-bar-marron",
    name: "Silla de barra marrón",
    category: "silla",
    description: "Silla de barra tapizada en cuero marrón con patas metálicas.",
    dimensions: { width: 0.55, height: 1.0, depth: 0.55 },
    color: "#795548",
    price: 165000,
    model: sillaBarMarron as string,
  },
  {
    id: "silla-bar-circular",
    name: "Silla de barra circular",
    category: "silla",
    description: "Silla giratoria de asiento circular, ideal para barras de cocina.",
    dimensions: { width: 0.45, height: 1.05, depth: 0.45 },
    color: "#37474F",
    price: 145000,
    model: sillaBarCircular as string,
  },

  // ── Mesas ───────────────────────────────────────────────────────────────────
  {
    id: "mesa-comedor",
    name: "Mesa de comedor",
    category: "mesa",
    description: "Mesa de comedor rectangular en madera maciza, ideal para 6 personas.",
    dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    color: "#8B4513",
    price: 220000,
    model: mesa as string,
    img: silla1,
  },
  {
    id: "mesa-cajon",
    name: "Mesa con cajón",
    category: "mesa",
    description: "Mesa de trabajo con cajón integrado, perfecta para el hogar o estudio.",
    dimensions: { width: 1.4, height: 0.75, depth: 0.7 },
    color: "#6D4C41",
    price: 195000,
    model: mesaConCajon as string,
  },
  {
    id: "mesa-cafe",
    name: "Mesa de café",
    category: "mesa",
    description: "Mesa ratona de madera, ideal para sala de estar.",
    dimensions: { width: 1.1, height: 0.45, depth: 0.6 },
    color: "#5D4037",
    price: 130000,
    model: mesaCafe as string,
  },
  {
    id: "mesa-ovalo",
    name: "Mesa ovalada",
    category: "mesa",
    description: "Mesa de comedor ovalada en madera clara, elegante y funcional.",
    dimensions: { width: 1.6, height: 0.75, depth: 0.95 },
    color: "#BCAAA4",
    price: 240000,
    model: mesaOvalo as string,
  },
  {
    id: "mesa-redonda",
    name: "Mesa redonda",
    category: "mesa",
    description: "Mesa redonda compacta, ideal para espacios pequeños.",
    dimensions: { width: 0.9, height: 0.75, depth: 0.9 },
    color: "#8D6E63",
    price: 175000,
    model: mesaRedonda as string,
  },

  // ── Sillones ────────────────────────────────────────────────────────────────
  {
    id: "sillon-1",
    name: "Sillón",
    category: "sillon",
    description: "Sillón tapizado de una plaza, cómodo y con diseño contemporáneo.",
    dimensions: { width: 0.85, height: 0.9, depth: 0.85 },
    color: "#546E7A",
    price: 280000,
    model: sillon as string,
  },

  // ── Mesitas ─────────────────────────────────────────────────────────────────
  {
    id: "mesita-luz-1",
    name: "Mesita de luz",
    category: "mesita",
    description: "Mesita de luz con cajón, perfecta para el dormitorio.",
    dimensions: { width: 0.5, height: 0.55, depth: 0.4 },
    color: "#A1887F",
    price: 95000,
    model: mesitaDeLuz as string,
  },

  // ── Librerías ────────────────────────────────────────────────────────────────
  {
    id: "libreria-1",
    name: "Librería",
    category: "libreria",
    description: "Librería de madera con múltiples estantes, ideal para organizar libros y objetos decorativos.",
    dimensions: { width: 0.9, height: 1.8, depth: 0.35 },
    color: "#4E342E",
    price: 320000,
    model: libreria as string,
  },
];
