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

export function generateGermanyGrid(): GridPoint[] {
  const points: GridPoint[] = [];
  let rowIdx = 0;
  for (let lat = DE_SOUTH; lat <= DE_NORTH; lat += DE_LAT_STEP) {
    const lngOffset = rowIdx % 2 === 1 ? DE_LNG_STEP / 2 : 0;
    for (let lng = DE_WEST + lngOffset; lng <= DE_EAST; lng += DE_LNG_STEP) {
      const rlat = Math.round(lat * 100) / 100;
      const rlng = Math.round(lng * 100) / 100;
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
