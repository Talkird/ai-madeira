import type { Furniture } from "../types/furniture";
import type { PlacedItem } from "../data/arPhysics";

export type ARMode = "gallery" | "viewer" | "ar";

export type ARSessionState = {
  mode: ARMode;
  selectedItem: Furniture | null;
  placedItems: PlacedItem[];
};

export const initialARSession: ARSessionState = {
  mode: "gallery",
  selectedItem: null,
  placedItems: [],
};