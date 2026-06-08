export type PlacedItem = {
  id: string;
  furnitureId: string;
  position: [number, number, number];
  size: [number, number, number];
  velocity?: [number, number, number];
};

// =====================
// COLLISION DETECTION
// =====================
export function intersects(a: PlacedItem, b: PlacedItem): boolean {
  return (
    Math.abs(a.position[0] - b.position[0]) <
      (a.size[0] + b.size[0]) / 2 &&
    Math.abs(a.position[2] - b.position[2]) <
      (a.size[2] + b.size[2]) / 2
  );
}

// =====================
// RESOLVE SINGLE COLLISION
// =====================
function resolvePair(a: PlacedItem, b: PlacedItem): PlacedItem {
  const dx = a.position[0] - b.position[0];
  const dz = a.position[2] - b.position[2];

  const dist = Math.sqrt(dx * dx + dz * dz) || 1;

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

// =====================
// PHYSICS STEP
// =====================
export function updatePhysics(items: PlacedItem[]): PlacedItem[] {
  let result = [...items];

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (i === j) continue;

      if (intersects(result[i], result[j])) {
        result[i] = resolvePair(result[i], result[j]);
      }
    }
  }

  return result;
}

// =====================
// SNAP TO GROUND
// =====================
export function snapToGround(
  pos: [number, number, number]
): [number, number, number] {
  return [pos[0], 0, pos[2]];
}