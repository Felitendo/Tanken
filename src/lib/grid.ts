/**
 * Generates a grid of coordinates covering Germany for pre-scanning stations.
 * Uses ~40km spacing between points with 25km radius circles for full coverage.
 */

export interface GridPoint {
  id: string;
  lat: number;
  lng: number;
}

// Germany bounding box (approximate)
const SOUTH = 47.27;
const NORTH = 55.06;
const WEST = 5.87;
const EAST = 15.04;

// ~40km spacing ensures overlap with 25km radius circles
const LAT_STEP = 0.36;  // ~40km
const LNG_STEP = 0.572; // ~40km at ~51°N

export function generateGermanyGrid(): GridPoint[] {
  const points: GridPoint[] = [];
  for (let lat = SOUTH; lat <= NORTH; lat += LAT_STEP) {
    for (let lng = WEST; lng <= EAST; lng += LNG_STEP) {
      const rlat = Math.round(lat * 100) / 100;
      const rlng = Math.round(lng * 100) / 100;
      points.push({
        id: `grid-${rlat}-${rlng}`,
        lat: rlat,
        lng: rlng,
      });
    }
  }
  return points;
}

/** Total number of grid points (for progress display). */
export const GRID_POINT_COUNT = generateGermanyGrid().length;
