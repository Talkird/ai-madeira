export interface Furniture {
  id: string;
  name: string;
  category: "mesa" | "sillon" | "mesita" | "libreria" | "cama";
  description: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
  price: number;
  model?: string;
  img?: string;
}

export type ARViewMode = "gallery" | "viewer" | "ar";
