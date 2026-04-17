'use client';

import { useEffect, useRef } from 'react';

interface LeafletBounds {
  getSouthWest: () => { lat: number; lng: number };
  getNorthEast: () => { lat: number; lng: number };
}
interface PreviewLeafletMap {
  setView: (latlng: [number, number], zoom: number) => PreviewLeafletMap;
  fitBounds: (bounds: [[number, number], [number, number]], opts?: Record<string, unknown>) => PreviewLeafletMap;
  invalidateSize: () => void;
  remove: () => void;
}
interface PreviewLeafletLayer { addTo: (map: PreviewLeafletMap) => PreviewLeafletLayer }
interface PreviewLeafletMarker { addTo: (map: PreviewLeafletMap) => PreviewLeafletMarker }
interface PreviewLeafletCircle {
  addTo: (map: PreviewLeafletMap) => PreviewLeafletCircle;
  getBounds: () => LeafletBounds;
}
interface PreviewLeafletGlobal {
  map: (el: HTMLElement, opts?: Record<string, unknown>) => PreviewLeafletMap;
  tileLayer: (url: string, opts?: Record<string, unknown>) => PreviewLeafletLayer;
  marker: (latlng: [number, number], opts?: Record<string, unknown>) => PreviewLeafletMarker;
  circle: (latlng: [number, number], opts: Record<string, unknown>) => PreviewLeafletCircle;
}

interface Props {
  lat: number;
  lng: number;
  radiusKm: number;
  heightClass?: string;
  ariaLabel?: string;
}

function approxZoomForRadius(radiusKm: number): number {
  if (radiusKm <= 5) return 11;
  if (radiusKm <= 15) return 10;
  if (radiusKm <= 30) return 9;
  if (radiusKm <= 60) return 8;
  return 7;
}

export function RequestMapPreview({
  lat,
  lng,
  radiusKm,
  heightClass = 'h-48',
  ariaLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let map: PreviewLeafletMap | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;

    const tryFitBounds = (m: PreviewLeafletMap, circle: PreviewLeafletCircle) => {
      try {
        const bounds = circle.getBounds();
        m.fitBounds(
          [
            [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
            [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
          ],
          { padding: [12, 12] },
        );
      } catch { /* keep the initial setView if fitBounds can't run yet */ }
    };

    const init = () => {
      if (disposed) return;
      const L = (window as unknown as { L?: PreviewLeafletGlobal }).L;
      if (!L) {
        retry = setTimeout(init, 150);
        return;
      }

      let m: PreviewLeafletMap;
      try {
        m = L.map(el, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          touchZoom: false,
          tap: false,
        });
        // Initial view first — without this, later operations that project
        // coordinates (fitBounds, layer renders) throw "layerPointToLatLng".
        m.setView([lat, lng], approxZoomForRadius(radiusKm));
      } catch {
        return;
      }

      try {
        L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: 'abc',
        }).addTo(m);

        L.marker([lat, lng]).addTo(m);
        const circle = L.circle([lat, lng], {
          radius: radiusKm * 1000,
          color: '#007aff',
          fillColor: '#007aff',
          fillOpacity: 0.12,
          weight: 2,
        }).addTo(m);

        rafId = requestAnimationFrame(() => {
          if (disposed) return;
          try { m.invalidateSize(); } catch { /* noop */ }
          tryFitBounds(m, circle);
        });
      } catch { /* leave the map at the setView fallback */ }

      map = m;
    };

    init();

    return () => {
      disposed = true;
      if (retry) clearTimeout(retry);
      if (rafId) cancelAnimationFrame(rafId);
      if (map) {
        try { map.remove(); } catch { /* noop */ }
      }
      map = null;
    };
  }, [lat, lng, radiusKm]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel ?? `Kartenvorschau: ${lat.toFixed(4)}, ${lng.toFixed(4)} · Radius ${radiusKm} km`}
      className={`${heightClass} w-full rounded-md border border-border overflow-hidden bg-muted/40`}
    />
  );
}
