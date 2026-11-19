import { WORLD_DOT_ROWS } from "./world-dots";

/** Map frame shared by the dot grid, arcs and markers. scripts/generate-world-dots.ts imports these too. */
export const LON0 = -168;
export const LON1 = 180;
export const LAT_TOP = 80;
export const LAT_BOTTOM = -56;
/** Spacing between land dots, in map units. */
export const STEP = 6;
export const MAP_WIDTH = 1000;

const K = MAP_WIDTH / (((LON1 - LON0) * Math.PI) / 180);
export const miller = (lat: number) =>
  1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * ((lat * Math.PI) / 180)));
export const MAP_SCALE = K;
const TOP = miller(LAT_TOP);
export const MAP_HEIGHT = +((TOP - miller(LAT_BOTTOM)) * K).toFixed(2);

export type Point = { x: number; y: number };

/** Latitude/longitude → map units (Miller projection, cropped). */
export function project(lat: number, lon: number): Point {
  return {
    x: +(((lon - LON0) / (LON1 - LON0)) * MAP_WIDTH).toFixed(2),
    y: +((TOP - miller(lat)) * K).toFixed(2),
  };
}

/** One SVG path of zero-length round-capped segments: a single element for ~4.9k land dots. */
export function buildDotPath(encoded: string = WORLD_DOT_ROWS): string {
  const rowH = (STEP * Math.sqrt(3)) / 2;
  let d = "";
  for (const row of encoded.split(";")) {
    const [rowIndex, runs = ""] = row.split(":");
    const r = Number(rowIndex);
    const y = +(rowH / 2 + r * rowH).toFixed(2);
    const offset = r % 2 ? STEP / 2 : 0;
    for (const run of runs.split(",")) {
      const [start, end] = run.split("-").map(Number);
      if (start === undefined || Number.isNaN(start)) continue;
      const last = end ?? start;
      d += `M${offset + STEP / 2 + start * STEP} ${y}h0`;
      for (let c = start; c < last; c++) d += `m${STEP} 0h0`;
    }
  }
  return d;
}

/** Quadratic curve between two points, bowed perpendicular by `bend` × distance. */
export function arcPath(p: Point, q: Point, bend: number): string {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (p.x + q.x) / 2 + (dy / len) * len * bend;
  const cy = (p.y + q.y) / 2 + (-dx / len) * len * bend;
  return `M${p.x} ${p.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${q.x} ${q.y}`;
}
