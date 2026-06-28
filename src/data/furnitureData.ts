import type { Furniture } from "../types/furniture";
import mesaConCajonGlb from "../assets/mesa_con_cajon.glb?url";
import mesaCafeGlb from "../assets/mesa_cafe.glb?url";
import mesaOvaloGlb from "../assets/mesa_ovalo.glb?url";
import mesaRedondaGlb from "../assets/mesa_redonda.glb?url";
import sillonGlb from "../assets/sillon.glb?url";
import mesitaDeLuzGlb from "../assets/mesita_de_luz.glb?url";
import imgMesaCajon from "../assets/mesa_con_cajon.png";
import imgMesaCafe from "../assets/mesa_cafe.png";
import imgMesaOvalo from "../assets/mesa_ovalo.png";
import imgMesaRedonda from "../assets/mesa_redonda.png";
import imgSillon from "../assets/sillon.png";
import imgMesitaDeLuz from "../assets/mesita_de_luz.png";

export const furnitureItems: Furniture[] = [
  // ── Mesas ───────────────────────────────────────────────────────────────────
  {
    id: "mesa-ovalo",
    name: "Mesa ovalada",
    category: "mesa",
    description: "Mesa de comedor ovalada en madera maciza, elegante y funcional.",
    dimensions: { width: 1.6, height: 0.75, depth: 0.95 },
    color: "#BCAAA4",
    price: 240000,
    model: mesaOvaloGlb as string,
    img: imgMesaOvalo,
  },
  {
    id: "mesa-cajon",
    name: "Mesa con cajón",
    category: "mesa",
    description: "Mesa de trabajo con cajón integrado, perfecta para el hogar o estudio.",
    dimensions: { width: 1.4, height: 0.75, depth: 0.7 },
    color: "#6D4C41",
    price: 195000,
    model: mesaConCajonGlb as string,
    img: imgMesaCajon,
  },
  {
    id: "mesa-cafe",
    name: "Mesa de café",
    category: "mesa",
    description: "Mesa ratona de madera, ideal para sala de estar.",
    dimensions: { width: 1.1, height: 0.45, depth: 0.6 },
    color: "#5D4037",
    price: 130000,
    model: mesaCafeGlb as string,
    img: imgMesaCafe,
  },
  {
    id: "mesa-redonda",
    name: "Mesa redonda",
    category: "mesa",
    description: "Mesa redonda compacta, ideal para espacios pequeños.",
    dimensions: { width: 0.9, height: 0.75, depth: 0.9 },
    color: "#8D6E63",
    price: 175000,
    model: mesaRedondaGlb as string,
    img: imgMesaRedonda,
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
    model: sillonGlb as string,
    img: imgSillon,
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
    model: mesitaDeLuzGlb as string,
    img: imgMesitaDeLuz,
  },
];
