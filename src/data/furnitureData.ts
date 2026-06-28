import type { Furniture } from "../types/furniture";
import mesaConCajon from "../assets/mesa_con_cajon.glb?url";
import mesaCafe from "../assets/mesa_cafe.glb?url";
import mesaOvalo from "../assets/mesa_ovalo.glb?url";
import mesaRedonda from "../assets/mesa_redonda.glb?url";
import sillon from "../assets/sillon.glb?url";
import mesitaDeLuz from "../assets/mesita_de_luz.glb?url";
import libreria from "../assets/libreria.glb?url";
import silla1 from "../assets/silla1.png";

export const furnitureItems: Furniture[] = [
  // ── Mesas ───────────────────────────────────────────────────────────────────
  {
    id: "mesa-comedor",
    name: "Mesa de comedor",
    category: "mesa",
    description: "Mesa de comedor rectangular en madera maciza, ideal para 6 personas.",
    dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    color: "#8B4513",
    price: 220000,
    model: mesaOvalo as string,
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
