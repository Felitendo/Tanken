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

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
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
  }

  function pickResult(r: GeocodeResult) {
    onChange({ lat: r.lat, lng: r.lng, radiusKm: value.radiusKm });
    if (mapRef.current) mapRef.current.setView([r.lat, r.lng], 12);
    setResults([]);
    setQuery(r.name);
  }

  return (
    <div className="space-y-3">
      {showSearch && (
        <div>
          <form onSubmit={runSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Adresse oder Ort suchen…"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={searching || query.trim().length < 2}
              className="rounded-md border border-border bg-muted px-3 py-2 text-sm disabled:opacity-50"
            >
              {searching ? 'Suche…' : 'Suchen'}
            </button>
          </form>
          {searchError && <p className="mt-1 text-xs text-destructive">{searchError}</p>}
          {results.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border border-border bg-background text-sm">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    className="block w-full truncate px-3 py-2 text-left hover:bg-muted"
                  >
                    {r.name}
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
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Radius</span>
            <span className="font-mono">{value.radiusKm.toFixed(1)} km</span>
          </div>
          <input
            type="range"
            min={radiusMin}
            max={radiusMax}
            step={0.5}
            value={value.radiusKm}
            onChange={(e) => onChange({ ...value, radiusKm: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      )}
      <div className="text-xs text-muted-foreground font-mono">
        {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
      </div>
    </div>
  );
}
