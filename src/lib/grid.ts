/**
 * Generates grids of coordinates for pre-scanning stations.
 * - Austria: E-Control API (no key, ~10 stations per point, 8km spacing)
 * - Germany: Tankerkönig list.php (API key, up to 25km radius, 20km spacing)
 */

export interface GridPoint {
  id: string;
  lat: number;
  lng: number;
  country: 'AT' | 'DE';
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

/** Total grid point count for progress display. */
export const AT_GRID_POINT_COUNT = generateAustriaGrid().length;

// ─── Germany ───────────────────────────────────────────────────────
// Tankerkönig list.php returns stations within a given radius (max 25km).
// 20km spacing with 25km search radius ensures complete coverage with overlap.
const DE_SOUTH = 47.27;
const DE_NORTH = 55.06;
const DE_WEST = 5.87;
const DE_EAST = 15.04;
const DE_LAT_STEP = 0.18;   // ~20km
const DE_LNG_STEP = 0.29;   // ~20km at ~51°N

export function generateGermanyGrid(): GridPoint[] {
  const points: GridPoint[] = [];
  for (let lat = DE_SOUTH; lat <= DE_NORTH; lat += DE_LAT_STEP) {
    for (let lng = DE_WEST; lng <= DE_EAST; lng += DE_LNG_STEP) {
      const rlat = Math.round(lat * 1000) / 1000;
      const rlng = Math.round(lng * 1000) / 1000;
      points.push({
        id: `de-${rlat}-${rlng}`,
        lat: rlat,
        lng: rlng,
        country: 'DE',
      });
    }
  }
  return points;
}

/** Total DE grid point count for progress display. */
export const DE_GRID_POINT_COUNT = generateGermanyGrid().length;
