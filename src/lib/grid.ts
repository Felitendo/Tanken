/**
 * Generates a grid of coordinates for pre-scanning stations in Austria.
 * Germany uses Tankerkönig prices.php batch API (no grid needed).
 */

export interface GridPoint {
  id: string;
  lat: number;
  lng: number;
  country: 'AT';
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
