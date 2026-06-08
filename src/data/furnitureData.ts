import type { Furniture } from "../types/furniture";
import mesa from "../assets/mesa.glb?url";
import silla from "../assets/silla.glb?url";

export const furnitureItems: Furniture[] = [
  {
    id: "chair-1",
    name: "Silla de barra",
    category: "silla",
    description:
      "Silla de barra con diseño moderno, perfecta para cocinas y bares.",
    dimensions: { width: 0.65, height: 1.05, depth: 0.65 },
    color: "#2D3748",
    price: 150000,
    model: silla as string,
  },
  {
    id: "table-1",
    name: "Silla alta de madera",
    category: "silla",
    description: "  Silla alta de madera, ideal para barras y cocinas.",
    dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    color: "#8B4513",
    price: 100000,
    model: mesa as string,
  },
];
