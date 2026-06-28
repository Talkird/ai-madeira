import type { Furniture } from "../types/furniture";
import mesa from "../assets/mesa.glb?url";
import silla from "../assets/silla.glb?url";
import silla1 from "../assets/silla1.png";
import silla2 from "../assets/silla2.png";
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
    img: silla2,
  },
  {
    id: "table-1",
    name: "Mesa de comedor",
    category: "mesa",
    description: "Mesa de comedor rectangular en madera maciza, ideal para 6 personas.",
    dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    color: "#8B4513",
    price: 220000,
    model: mesa as string,
    img: silla1,
  },
];
