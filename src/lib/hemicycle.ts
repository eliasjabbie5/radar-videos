export interface Seat {
  x: number;
  y: number;
  /** angle: π = far left, 0 = far right */
  a: number;
}

/** 349 seats on 9 concentric arcs, sorted right → left. */
export const buildHemicycle = (total: number, rows = 9, r0 = 190, r1 = 420): Seat[] => {
  const radii = Array.from({length: rows}, (_, i) => r0 + ((r1 - r0) * i) / (rows - 1));
  const sum = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.round((total * r) / sum));
  counts[rows - 1] += total - counts.reduce((a, b) => a + b, 0);
  const seats: Seat[] = [];
  radii.forEach((r, ri) => {
    const n = counts[ri];
    for (let j = 0; j < n; j++) {
      const a = Math.PI - (j * Math.PI) / (n - 1);
      seats.push({x: Math.cos(a) * r, y: -Math.sin(a) * r, a});
    }
  });
  return seats.sort((p, q) => p.a - q.a);
};
