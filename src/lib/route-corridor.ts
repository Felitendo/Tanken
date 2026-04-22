/**
 * Utilities for filtering stations to a corridor around a driving route.
 *
 * Distance math uses an equirectangular approximation anchored at the
 * segment's mean latitude — fine for the sub-km precision we need here
 * and far cheaper than per-segment haversine on long polylines.
 */

import type { CachedStation } from '@/lib/station-cache';

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
 * Walk a polyline and emit evenly-spaced points at ~spacingKm intervals of
 * actual path distance (not vertex count). Always includes the first and
 * last polyline point so short routes still yield something useful.
 *
 * Used by the route-search gap-fill to decide where we need live scans.
 */
export function samplePolylineByDistance(
  polyline: [number, number][],
  spacingKm: number,
): [number, number][] {
  if (polyline.length === 0) return [];
  if (polyline.length === 1) return [[...polyline[0]] as [number, number]];

  const out: [number, number][] = [[...polyline[0]] as [number, number]];
  let accumulated = 0;
  let nextThreshold = spacingKm;

  for (let i = 1; i < polyline.length; i++) {
    const [prevLng, prevLat] = polyline[i - 1];
    const [lng, lat] = polyline[i];
    const segKm = haversineKm(prevLat, prevLng, lat, lng);
    while (segKm > 0 && nextThreshold <= accumulated + segKm) {
      const t = (nextThreshold - accumulated) / segKm;
      out.push([prevLng + t * (lng - prevLng), prevLat + t * (lat - prevLat)]);
      nextThreshold += spacingKm;
    }
    accumulated += segKm;
  }

  // Only append the endpoint if it's meaningfully farther than the last sample.
  const last = out[out.length - 1];
  const [endLng, endLat] = polyline[polyline.length - 1];
  if (haversineKm(last[1], last[0], endLat, endLng) > spacingKm / 4) {
    out.push([endLng, endLat]);
  }
  return out;
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
