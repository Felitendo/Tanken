'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type LeafletGlobal = {
  map: (el: HTMLElement, opts?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts?: Record<string, unknown>) => LeafletLayer;
  marker: (latlng: [number, number], opts?: Record<string, unknown>) => LeafletMarker;
  circle: (latlng: [number, number], opts: Record<string, unknown>) => LeafletCircle;
};
type LeafletMap = {
  setView: (latlng: [number, number], zoom?: number) => LeafletMap;
  panTo: (latlng: [number, number]) => LeafletMap;
  on: (event: string, handler: (e: { latlng: { lat: number; lng: number } }) => void) => void;
  remove: () => void;
};
type LeafletLayer = { addTo: (map: LeafletMap) => LeafletLayer };
type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  setLatLng: (latlng: [number, number] | { lat: number; lng: number }) => LeafletMarker;
  getLatLng: () => { lat: number; lng: number };
  on: (event: string, handler: () => void) => void;
};
type LeafletCircle = {
  addTo: (map: LeafletMap) => LeafletCircle;
  setLatLng: (latlng: [number, number] | { lat: number; lng: number }) => LeafletCircle;
  setRadius: (meters: number) => LeafletCircle;
  getRadius: () => number;
};

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

export interface LocationPickerValue {
  lat: number;
  lng: number;
  radiusKm: number;
}

interface Props {
  value: LocationPickerValue;
  onChange: (v: LocationPickerValue) => void;
  heightClass?: string;
  showSearch?: boolean;
}

const FIXED_RADIUS_KM = 25;

interface GeocodeResult {
  name: string;
  lat: number;
  lng: number;
}

export function LocationPicker({
  value,
  onChange,
  heightClass = 'h-64',
  showSearch = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const circleRef = useRef<LeafletCircle | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const updatePosition = useCallback((lat: number, lng: number) => {
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    if (circleRef.current) circleRef.current.setLatLng([lat, lng]);
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([value.lat, value.lng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    const marker = L.marker([value.lat, value.lng], { draggable: true }).addTo(map);
    const circle = L.circle([value.lat, value.lng], {
      radius: FIXED_RADIUS_KM * 1000,
      color: '#007aff',
      fillColor: '#007aff',
      fillOpacity: 0.12,
      weight: 2,
    }).addTo(map);

    marker.on('dragend', () => {
      const p = marker.getLatLng();
      circle.setLatLng(p);
      onChangeRef.current({ lat: p.lat, lng: p.lng, radiusKm: FIXED_RADIUS_KM });
    });

    map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
      onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng, radiusKm: FIXED_RADIUS_KM });
    });

    mapRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current) return;
    const m = markerRef.current.getLatLng();
    if (Math.abs(m.lat - value.lat) > 1e-6 || Math.abs(m.lng - value.lng) > 1e-6) {
      updatePosition(value.lat, value.lng);
      mapRef.current.panTo([value.lat, value.lng]);
    }
    if (Math.abs(circleRef.current.getRadius() - FIXED_RADIUS_KM * 1000) > 1) {
      circleRef.current.setRadius(FIXED_RADIUS_KM * 1000);
    }
  }, [value.lat, value.lng, updatePosition]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=de`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Suche fehlgeschlagen (${res.status})`);
        const data = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
        const mapped: GeocodeResult[] = data
          .map((r) => ({ name: r.display_name, lat: Number(r.lat), lng: Number(r.lon) }))
          .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
        setResults(mapped);
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        setSearchError(err instanceof Error ? err.message : String(err));
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  function pickResult(r: GeocodeResult) {
    onChange({ lat: r.lat, lng: r.lng, radiusKm: FIXED_RADIUS_KM });
    if (mapRef.current) mapRef.current.setView([r.lat, r.lng], 12);
    setResults([]);
    setQuery(r.name);
  }

  return (
    <div className="space-y-3">
      {showSearch && (
        <div className="relative">
          <div className="relative">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              placeholder="Adresse oder Ort suchen…"
              aria-label="Adresse oder Ort suchen"
              aria-autocomplete="list"
              aria-controls="location-picker-results"
              className="w-full rounded-md border border-border bg-background pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {searching && (
              <span
                role="status"
                aria-label="Suche läuft"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin"
              />
            )}
            {!searching && query && (
              <button
                type="button"
                aria-label="Suche löschen"
                onClick={() => { setQuery(''); setResults([]); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                ×
              </button>
            )}
          </div>
          {searchError && <p role="alert" className="mt-1 text-xs text-destructive">{searchError}</p>}
          {results.length > 0 && (
            <ul
              id="location-picker-results"
              role="listbox"
              aria-label="Suchergebnisse"
              className="absolute left-0 right-0 top-full z-[2000] mt-1 max-h-60 overflow-auto rounded-md border border-border bg-background text-sm shadow-lg"
            >
              {results.map((r, i) => (
                <li key={i} role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    className="flex w-full items-center gap-2 truncate px-3 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" className="text-muted-foreground shrink-0">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="truncate">{r.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        role="application"
        aria-label="Kartenauswahl — Marker ziehen oder Karte anklicken"
        className={`${heightClass} w-full rounded-md border border-border overflow-hidden`}
      />
      <div className="text-xs text-muted-foreground font-mono tabular-nums" aria-live="polite">
        {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
      </div>
    </div>
  );
}
