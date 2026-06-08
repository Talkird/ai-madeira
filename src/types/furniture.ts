export interface Furniture {
  id: string;
  name: string;
  category: "sofa" | "chair" | "table" | "bed" | "shelf";
  description: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
  price: number;
  model?: string;
}

export type ARViewMode = "gallery" | "viewer" | "ar";
