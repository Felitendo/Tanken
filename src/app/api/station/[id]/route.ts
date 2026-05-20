import { NextResponse } from 'next/server';
import { runtimeConfig } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';
import { findCachedStationById, getAllUniqueStationsForFuel } from '@/lib/station-cache';

export const runtime = 'nodejs';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Austrian stations carry an `at-…` id that Tankerkönig's detail.php
    // does not understand. Resolve them from the scan cache instead so the
    // Stats/Verlauf detail popup gets the same shape it gets for DE.
    if (id.startsWith('at-')) {
      const cached = findCachedStationById(id);
      if (!cached) {
        return NextResponse.json({ error: 'Station not in cache' }, { status: 404 });
      }
      const { station } = cached;
      const priceFor = (fuel: string): number | null => {
        if (cached.fuelType === fuel && typeof station.price === 'number' && station.price > 0) {
          return station.price;
        }
        const others = getAllUniqueStationsForFuel(fuel);
        const hit = others.find((s) => s.id === id);
        return hit && typeof hit.price === 'number' && hit.price > 0 ? hit.price : null;
      };
      return NextResponse.json({
        id: station.id,
        name: station.name,
        brand: station.brand,
        street: station.street,
        houseNumber: station.houseNumber,
        postCode: station.postCode,
        place: station.place,
        lat: station.lat,
        lng: station.lng,
        isOpen: station.isOpen,
        e5: priceFor('e5'),
        e10: priceFor('e10'),
        diesel: priceFor('diesel'),
        openingTimes: null,
        wholeDay: false,
      });
    }

    const url = `https://creativecommons.tankerkoenig.de/json/detail.php?id=${id}&apikey=${runtimeConfig.apiKey}`;
    const { data } = await fetchJson<{ ok?: boolean; message?: string; station?: unknown }>(url);

    if (!data.ok) {
      return NextResponse.json({ error: data.message || 'API error' }, { status: 500 });
    }

    return NextResponse.json(data.station);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
