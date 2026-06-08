import type { Furniture } from "../types/furniture";
import mesa from "../assets/mesa.glb?url";
import silla from "../assets/silla.glb?url";


export const furnitureItems: Furniture[] = [
  {
    id: "sofa-1",
    name: "Modern Sofa",
    category: "sofa",
    description: "Contemporary 3-seater sofa with clean lines",
    dimensions: { width: 2.2, height: 0.85, depth: 0.95 },
    color: "#4A5568",
    price: 1200,
  },
  {
    id: "chair-1",
    name: "Executive Chair",
    category: "chair",
    description: "Comfortable office chair",
    dimensions: { width: 0.65, height: 1.05, depth: 0.65 },
    color: "#2D3748",
    price: 450,
    model: silla,   // 👈 SOLO ESTE TIENE 3D
  },
  {
    id: "table-1",
    name: "Dining Table",
    category: "table",
    description: "Solid wood dining table",
    dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    color: "#8B4513",
    price: 800,
    model: mesa,    // 👈 SOLO ESTE TIENE 3D
  },
  {
    id: "table-2",
    name: "Coffee Table",
    category: "table",
    description: "Minimalist coffee table for living room",
    dimensions: { width: 1.2, height: 0.45, depth: 0.6 },
    color: "#A0826D",
    price: 300,
  },
  {
    id: "shelf-1",
    name: "Wall Shelf",
    category: "shelf",
    description: "Floating wooden shelf for storage and display",
    dimensions: { width: 1.5, height: 0.25, depth: 0.3 },
    color: "#CD853F",
    price: 150,
  },
  {
    id: "bed-1",
    name: "Queen Bed",
    category: "bed",
    description: "Comfortable queen-size bed with modern frame",
    dimensions: { width: 1.6, height: 0.8, depth: 2.0 },
    color: "#3E4449",
    price: 1500,
  },
];
