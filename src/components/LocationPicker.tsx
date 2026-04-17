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
  radiusMin?: number;
  radiusMax?: number;
  showRadiusControl?: boolean;
  heightClass?: string;
  showSearch?: boolean;
}

interface GeocodeResult {
  name: string;
  lat: number;
  lng: number;
}

export function LocationPicker({
  value,
  onChange,
  radiusMin = 1,
  radiusMax = 25,
  showRadiusControl = true,
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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const marker = L.marker([value.lat, value.lng], { draggable: true }).addTo(map);
    const circle = L.circle([value.lat, value.lng], {
      radius: value.radiusKm * 1000,
      color: '#007aff',
      fillColor: '#007aff',
      fillOpacity: 0.12,
      weight: 2,
    }).addTo(map);

    marker.on('dragend', () => {
      const p = marker.getLatLng();
      circle.setLatLng(p);
      onChangeRef.current({ lat: p.lat, lng: p.lng, radiusKm: circle.getRadius() / 1000 });
    });

    map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
      onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng, radiusKm: circle.getRadius() / 1000 });
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
    if (Math.abs(circleRef.current.getRadius() - value.radiusKm * 1000) > 1) {
      circleRef.current.setRadius(value.radiusKm * 1000);
    }
  }, [value.lat, value.lng, value.radiusKm, updatePosition]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error(`Suche fehlgeschlagen (${res.status})`);
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : String(err));
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function pickResult(r: GeocodeResult) {
    onChange({ lat: r.lat, lng: r.lng, radiusKm: value.radiusKm });
    if (mapRef.current) mapRef.current.setView([r.lat, r.lng], 12);
    setResults([]);
    setQuery(r.name);
  }

  return (
    <div className="space-y-3">
      {showSearch && (
        <div className="relative">
          <div className="relative">
            <svg viewBox="0 0 24 24" width="16" height="16" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              placeholder="Adresse oder Ort suchen…"
              className="w-full rounded-md border border-border bg-background pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {searching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
            )}
            {!searching && query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                ×
              </button>
            )}
          </div>
          {searchError && <p className="mt-1 text-xs text-destructive">{searchError}</p>}
          {results.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-background text-sm shadow-lg">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    className="flex w-full items-center gap-2 truncate px-3 py-2 text-left hover:bg-muted"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-muted-foreground shrink-0">
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
      <div ref={containerRef} className={`${heightClass} w-full rounded-md border border-border overflow-hidden`} />
      {showRadiusControl && (
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Radius</span>
            <span className="font-mono font-medium text-foreground">{value.radiusKm.toFixed(1)} km</span>
          </div>
          <input
            type="range"
            min={radiusMin}
            max={radiusMax}
            step={0.5}
            value={value.radiusKm}
            onChange={(e) => onChange({ ...value, radiusKm: Number(e.target.value) })}
            className="admin-range w-full"
          />
        </div>
      )}
      <div className="text-xs text-muted-foreground font-mono">
        {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
      </div>
    </div>
  );
}
