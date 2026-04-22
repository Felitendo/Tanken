/**
 * Utilities for filtering stations to a corridor around a driving route.
 *
 * Distance math uses an equirectangular approximation anchored at the
 * segment's mean latitude — fine for the sub-km precision we need here
 * and far cheaper than per-segment haversine on long polylines.
 */

import type { CachedStation } from '@/lib/station-cache';
import { MAJOR_CITIES } from '@/lib/major-cities';

/** Station augmented with its minimum distance to the route polyline. */
export interface StationOnRoute extends CachedStation {
  /** Km from the station to the nearest point on the polyline. */
  routeDistKm: number;
}

const EARTH_KM_PER_DEG_LAT = 111.32;

/**
 * Return only stations whose shortest distance to the polyline is ≤ bufferKm.
 * Polyline is a list of [lng, lat] pairs (GeoJSON order, as returned by ORS).
 * Stations are augmented with a routeDistKm field and sorted by ascending
 * distance to the route as a tiebreaker when prices are identical.
 */
export function filterStationsAlongRoute(
  stations: CachedStation[],
  polyline: [number, number][],
  bufferKm: number,
): StationOnRoute[] {
  if (!stations.length || polyline.length < 2) return [];

  // Route bounding box + buffer for a cheap first-pass reject.
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const [lng, lat] of polyline) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  const midLat = (minLat + maxLat) / 2;
  const kmPerDegLng = EARTH_KM_PER_DEG_LAT * Math.cos((midLat * Math.PI) / 180);
  const latBuffer = bufferKm / EARTH_KM_PER_DEG_LAT;
  const lngBuffer = bufferKm / Math.max(kmPerDegLng, 0.0001);

  const bboxMinLat = minLat - latBuffer;
  const bboxMaxLat = maxLat + latBuffer;
  const bboxMinLng = minLng - lngBuffer;
  const bboxMaxLng = maxLng + lngBuffer;

  const out: StationOnRoute[] = [];
  for (const s of stations) {
    if (s.lat < bboxMinLat || s.lat > bboxMaxLat || s.lng < bboxMinLng || s.lng > bboxMaxLng) continue;
    const d = minDistanceKmToPolyline(s.lat, s.lng, polyline);
    if (d <= bufferKm) out.push({ ...s, routeDistKm: d });
  }

  out.sort((a, b) => a.routeDistKm - b.routeDistKm);
  return out;
}

/** Great-circle-free shortest km distance from a point to a polyline. */
function minDistanceKmToPolyline(
  lat: number,
  lng: number,
  polyline: [number, number][],
): number {
  let best = Infinity;
  for (let i = 1; i < polyline.length; i++) {
    const [aLng, aLat] = polyline[i - 1];
    const [bLng, bLat] = polyline[i];
    const d = distanceKmPointToSegment(lat, lng, aLat, aLng, bLat, bLng);
    if (d < best) best = d;
  }
  return best;
}

/**
 * Pick scan points along the route based on total distance:
 *   < 25 km → 0 points (use cache only)
 *   25–49 km → 1 point  (destination)
 *   50–74 km → 2 points (one mid-route + destination)
 *   ≥ 75 km → 3 points  (two mid-route + destination)
 *
 * The last scan is always anchored on the destination: that's where the
 * user will actually fill up, so guaranteeing fresh prices there is worth
 * one of the three slots. A 25 km scan centred on the destination already
 * pulls in any big city within reach, so we don't additionally snap the
 * destination to MAJOR_CITIES — that would move the ripple away from
 * where the user is really headed.
 *
 * Earlier slots snap to the largest MAJOR_CITIES entry inside their
 * progress window (so a 25 km scan lands on a dense urban cluster instead
 * of empty farmland). When no city qualifies we fall back to the slot's
 * geometric midpoint.
 *
 * Final pass drops any earlier pick whose 25 km circle overlaps a later
 * pick along the route — two scans inside one radius of each other burn
 * the cooldown twice without surfacing distinct stations. The destination
 * is locked in first, so conflicts resolve by dropping the earlier point.
 */
const CITY_PROJECTION_MAX_DIST_KM = 10;
const MIN_SCAN_SPACING_KM = 25;

export function computeRouteScanPoints(
  polyline: [number, number][],
  distanceKm: number,
): Array<{ lat: number; lng: number }> {
  let count: number;
  if (distanceKm < 25) count = 0;
  else if (distanceKm < 50) count = 1;
  else if (distanceKm < 75) count = 2;
  else count = 3;
  if (count === 0 || polyline.length < 2) return [];

  // Reserve the destination as the last scan point.
  const last = polyline[polyline.length - 1];
  const destPoint = { lat: last[1], lng: last[0] };

  // Evenly space the remaining (count - 1) slots between start and dest:
  //   count = 1 → no earlier slots (dest only).
  //   count = 2 → one earlier slot at 50 %.
  //   count = 3 → two earlier slots at 33 % and 66 %.
  const earlierCount = count - 1;
  const halfWindow = 0.5 / count;
  const cityCandidates = earlierCount > 0 ? projectCitiesOnRoute(polyline, distanceKm) : [];
  const usedCityIdx = new Set<number>();

  const earlier: Array<{ lat: number; lng: number }> = [];
  for (let i = 1; i <= earlierCount; i++) {
    const frac = i / count;
    const windowMin = frac - halfWindow;
    const windowMax = frac + halfWindow;

    let bestIdx = -1;
    let bestPop = -1;
    for (let j = 0; j < cityCandidates.length; j++) {
      if (usedCityIdx.has(j)) continue;
      const c = cityCandidates[j];
      if (c.progress < windowMin || c.progress > windowMax) continue;
      if (c.pop > bestPop) {
        bestPop = c.pop;
        bestIdx = j;
      }
    }

    if (bestIdx >= 0) {
      const c = cityCandidates[bestIdx];
      usedCityIdx.add(bestIdx);
      earlier.push({ lat: c.lat, lng: c.lng });
    } else {
      earlier.push(interpolateAlongPolyline(polyline, distanceKm * frac));
    }
  }

  // Merge earlier + destination. Walk end → start so the destination is
  // locked in first, then earlier picks are kept only if they're at least
  // MIN_SCAN_SPACING_KM away from every already-kept point.
  const all = [...earlier, destPoint];
  const kept: Array<{ lat: number; lng: number }> = [];
  for (let i = all.length - 1; i >= 0; i--) {
    const p = all[i];
    let tooClose = false;
    for (const k of kept) {
      if (haversineKm(p.lat, p.lng, k.lat, k.lng) < MIN_SCAN_SPACING_KM) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) kept.push(p);
  }
  kept.reverse();
  return kept;
}

/**
 * For each MAJOR_CITIES entry within CITY_PROJECTION_MAX_DIST_KM of the
 * route, return its population plus where it sits along the route as a
 * fraction in [0, 1] (0 = start, 1 = destination).
 */
function projectCitiesOnRoute(
  polyline: [number, number][],
  distanceKm: number,
): Array<{ progress: number; pop: number; lat: number; lng: number }> {
  if (distanceKm <= 0) return [];

  // Bounding-box reject — vast majority of cities are thrown out cheaply.
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const [lng, lat] of polyline) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  const midLat = (minLat + maxLat) / 2;
  const kmPerDegLng = EARTH_KM_PER_DEG_LAT * Math.cos((midLat * Math.PI) / 180);
  const latBuf = CITY_PROJECTION_MAX_DIST_KM / EARTH_KM_PER_DEG_LAT;
  const lngBuf = CITY_PROJECTION_MAX_DIST_KM / Math.max(kmPerDegLng, 0.0001);

  const out: Array<{ progress: number; pop: number; lat: number; lng: number }> = [];
  for (const city of MAJOR_CITIES) {
    if (city.lat < minLat - latBuf || city.lat > maxLat + latBuf) continue;
    if (city.lng < minLng - lngBuf || city.lng > maxLng + lngBuf) continue;
    const proj = projectPointOnPolyline(city.lat, city.lng, polyline);
    if (proj.distKm > CITY_PROJECTION_MAX_DIST_KM) continue;
    out.push({
      progress: Math.min(1, Math.max(0, proj.progressKm / distanceKm)),
      pop: city.pop,
      lat: city.lat,
      lng: city.lng,
    });
  }
  return out;
}

/**
 * Closest point on the polyline to (pLat, pLng): returns both the km
 * distance and how far along the polyline that closest point sits.
 * Uses the same equirectangular-in-km trick as distanceKmPointToSegment.
 */
function projectPointOnPolyline(
  pLat: number, pLng: number,
  polyline: [number, number][],
): { distKm: number; progressKm: number } {
  let bestDist = Infinity;
  let bestProgress = 0;
  let accumulated = 0;
  for (let i = 1; i < polyline.length; i++) {
    const [aLng, aLat] = polyline[i - 1];
    const [bLng, bLat] = polyline[i];
    const segKm = haversineKm(aLat, aLng, bLat, bLng);
    const proj = projectPointOnSegment(pLat, pLng, aLat, aLng, bLat, bLng);
    if (proj.distKm < bestDist) {
      bestDist = proj.distKm;
      bestProgress = accumulated + proj.t * segKm;
    }
    accumulated += segKm;
  }
  return { distKm: bestDist, progressKm: bestProgress };
}

function projectPointOnSegment(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number,
): { distKm: number; t: number } {
  const midLat = (aLat + bLat) / 2;
  const kmPerDegLng = EARTH_KM_PER_DEG_LAT * Math.cos((midLat * Math.PI) / 180);
  const toXY = (lat: number, lng: number): [number, number] => [
    lng * kmPerDegLng,
    lat * EARTH_KM_PER_DEG_LAT,
  ];
  const [ax, ay] = toXY(aLat, aLng);
  const [bx, by] = toXY(bLat, bLng);
  const [px, py] = toXY(pLat, pLng);
  const dx = bx - ax;
  const dy = by - ay;
  const segLenSq = dx * dx + dy * dy;
  if (segLenSq === 0) {
    const ex = px - ax;
    const ey = py - ay;
    return { distKm: Math.sqrt(ex * ex + ey * ey), t: 0 };
  }
  let t = ((px - ax) * dx + (py - ay) * dy) / segLenSq;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const ex = px - cx;
  const ey = py - cy;
  return { distKm: Math.sqrt(ex * ex + ey * ey), t };
}

function interpolateAlongPolyline(
  polyline: [number, number][],
  targetKm: number,
): { lat: number; lng: number } {
  let accumulated = 0;
  for (let i = 1; i < polyline.length; i++) {
    const [prevLng, prevLat] = polyline[i - 1];
    const [lng, lat] = polyline[i];
    const segKm = haversineKm(prevLat, prevLng, lat, lng);
    if (accumulated + segKm >= targetKm) {
      const t = segKm > 0 ? (targetKm - accumulated) / segKm : 0;
      return {
        lat: prevLat + t * (lat - prevLat),
        lng: prevLng + t * (lng - prevLng),
      };
    }
    accumulated += segKm;
  }
  const [lng, lat] = polyline[polyline.length - 1];
  return { lat, lng };
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distanceKmPointToSegment(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number,
): number {
  // Project to equirectangular km plane anchored at segment midpoint.
  const midLat = (aLat + bLat) / 2;
  const kmPerDegLng = EARTH_KM_PER_DEG_LAT * Math.cos((midLat * Math.PI) / 180);
  const toXY = (lat: number, lng: number): [number, number] => [
    lng * kmPerDegLng,
    lat * EARTH_KM_PER_DEG_LAT,
  ];
  const [ax, ay] = toXY(aLat, aLng);
  const [bx, by] = toXY(bLat, bLng);
  const [px, py] = toXY(pLat, pLng);
  const dx = bx - ax;
  const dy = by - ay;
  const segLenSq = dx * dx + dy * dy;
  if (segLenSq === 0) {
    const ex = px - ax;
    const ey = py - ay;
    return Math.sqrt(ex * ex + ey * ey);
  }
  let t = ((px - ax) * dx + (py - ay) * dy) / segLenSq;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const ex = px - cx;
  const ey = py - cy;
  return Math.sqrt(ex * ex + ey * ey);
}
