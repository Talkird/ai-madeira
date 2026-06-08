export type PlacedItem = {
  id: string;
  furnitureId: string;
  position: [number, number, number];
  size: [number, number, number];
};

// ================= COLLISION =================
export function intersects(a: PlacedItem, b: PlacedItem): boolean {
  return (
    Math.abs(a.position[0] - b.position[0]) <
      (a.size[0] + b.size[0]) / 2 &&
    Math.abs(a.position[2] - b.position[2]) <
      (a.size[2] + b.size[2]) / 2
  );
}

// ================= RESOLVE =================
function resolve(a: PlacedItem, b: PlacedItem): PlacedItem {
  const dx = a.position[0] - b.position[0];
  const dz = a.position[2] - b.position[2];

  const dist = Math.sqrt(dx * dx + dz * dz) || 0.0001;

  const minDist = (a.size[0] + b.size[0]) / 2;
  const overlap = minDist - dist;

  if (overlap <= 0) return a;

  const push = overlap * 0.5;

  return {
    ...a,
    position: [
      a.position[0] + (dx / dist) * push,
      0,
      a.position[2] + (dz / dist) * push,
    ],
  };
}

// ================= UPDATE =================
export function updatePhysics(items: PlacedItem[]): PlacedItem[] {
  const next = [...items];

  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      if (intersects(next[i], next[j])) {
        next[i] = resolve(next[i], next[j]);
      }
    }
  }

  return next;
}