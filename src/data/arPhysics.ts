import type { Furniture } from "../types/furniture";

export type PlacedItem = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
};

export function intersects(a: PlacedItem, b: PlacedItem) {
  return (
    Math.abs(a.position[0] - b.position[0]) < (a.size[0] + b.size[0]) / 2 &&
    Math.abs(a.position[2] - b.position[2]) < (a.size[2] + b.size[2]) / 2
  );
}

export function resolveCollision(
  item: PlacedItem,
  others: PlacedItem[]
): [number, number, number] {
  for (const other of others) {
    if (other.id === item.id) continue;

    if (intersects(item, other)) {
      const dx = item.position[0] - other.position[0];
      const dz = item.position[2] - other.position[2];

      const len = Math.sqrt(dx * dx + dz * dz) || 1;

      const push = 0.1;

      return [
        item.position[0] + (dx / len) * push,
        0,
        item.position[2] + (dz / len) * push,
      ];
    }
  }

  return item.position;
}

export function snapToGround(pos: [number, number, number]) {
  return [pos[0], 0, pos[2]] as [number, number, number];
}