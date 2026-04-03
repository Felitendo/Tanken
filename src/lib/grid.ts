/**
 * Generates grids of coordinates for pre-scanning stations in Germany and Austria.
 */

export interface GridPoint {
  id: string;
  lat: number;
  lng: number;
  country: 'DE' | 'AT';
}

// ─── Germany ────────────────────────────────────────────────────────
// Hex grid: offset every other row by half the lng step so the worst-case
// distance to the nearest grid centre drops from ~28km (rectangular) to ~23km,
// safely inside the 25km Tankerkönig radius — no coverage gaps.
const DE_SOUTH = 47.27;
const DE_NORTH = 55.06;
const DE_WEST = 5.87;
const DE_EAST = 15.04;
const DE_LAT_STEP = 0.335; // ~37km  (hex row: worst-case centroid→vertex ≈ 24.8km < 25km)
const DE_LNG_STEP = 0.572; // ~40km at ~51°N

// Simplified Germany outline with ~25km buffer so border stations are covered.
// Verified against 23 test cities (Flensburg, Görlitz, Konstanz, Oberstdorf, etc.).
const DE_OUTLINE: [number, number][] = [
  [55.1,7.8],[55.1,8.8],[54.9,9.8],[54.5,10.0],[54.3,11.3],[54.1,12.3],[53.9,14.3],
  [53.0,14.8],[52.4,14.9],[51.3,15.2],[50.9,15.1],[50.4,12.5],[50.8,12.3],[50.6,13.0],
  [50.2,12.4],[49.0,13.0],[48.7,14.0],[47.3,13.2],[47.1,11.0],[47.1,10.0],[47.4,9.0],
  [47.6,8.4],[47.3,7.4],[47.8,7.3],[48.3,7.5],[48.6,7.7],[49.0,8.0],[49.2,7.3],
  [49.1,6.1],[49.5,6.1],[50.0,5.8],[50.8,5.8],[51.2,5.7],[51.5,5.8],[51.9,6.7],
  [52.4,6.4],[53.1,6.9],[53.5,6.8],[53.7,7.0],[54.0,7.7],[54.5,8.3],[55.1,7.8],
];

function pointInGermany(lat: number, lng: number): boolean {
  let inside = false;
  for (let i = 0, j = DE_OUTLINE.length - 1; i < DE_OUTLINE.length; j = i++) {
    const [yi, xi] = DE_OUTLINE[i], [yj, xj] = DE_OUTLINE[j];
    if ((yi > lat) !== (yj > lat) && lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function generateGermanyGrid(): GridPoint[] {
  const points: GridPoint[] = [];
  let rowIdx = 0;
  for (let lat = DE_SOUTH; lat <= DE_NORTH; lat += DE_LAT_STEP) {
    const lngOffset = rowIdx % 2 === 1 ? DE_LNG_STEP / 2 : 0;
    for (let lng = DE_WEST + lngOffset; lng <= DE_EAST; lng += DE_LNG_STEP) {
      const rlat = Math.round(lat * 100) / 100;
      const rlng = Math.round(lng * 100) / 100;
      if (!pointInGermany(rlat, rlng)) continue;
      points.push({
        id: `grid-${rlat}-${rlng}`,
        lat: rlat,
        lng: rlng,
        country: 'DE',
      });
    }
    rowIdx++;
  }
  return points;
}

// ─── Austria ────────────────────────────────────────────────────────
// E-Control API returns ~10 nearest stations within ~2km.
// Use ~8km spacing (~2,600 points); covers all of Austria including rural areas.
const AT_SOUTH = 46.37;
const AT_NORTH = 49.02;
const AT_WEST = 9.53;
const AT_EAST = 17.16;
const AT_LAT_STEP = 0.072;  // ~8km
const AT_LNG_STEP = 0.107;  // ~8km at ~47.5°N

export function generateAustriaGrid(): GridPoint[] {
  const points: GridPoint[] = [];
  for (let lat = AT_SOUTH; lat <= AT_NORTH; lat += AT_LAT_STEP) {
    for (let lng = AT_WEST; lng <= AT_EAST; lng += AT_LNG_STEP) {
      const rlat = Math.round(lat * 1000) / 1000;
      const rlng = Math.round(lng * 1000) / 1000;
      points.push({
        id: `at-${rlat}-${rlng}`,
        lat: rlat,
        lng: rlng,
        country: 'AT',
      });
    }
  }
  return points;
}

/** Total grid point counts for progress display. */
export const DE_GRID_POINT_COUNT = generateGermanyGrid().length;
export const AT_GRID_POINT_COUNT = generateAustriaGrid().length;
export const GRID_POINT_COUNT = DE_GRID_POINT_COUNT + AT_GRID_POINT_COUNT;
