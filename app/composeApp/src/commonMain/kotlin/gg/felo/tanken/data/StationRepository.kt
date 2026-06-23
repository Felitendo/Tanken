package gg.felo.tanken.data

import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.net.ApiClient

/** Thin repository over [ApiClient] for station + price-band data used by the Map tab. */
class StationRepository(private val api: ApiClient) {

    suspend fun nearby(lat: Double, lng: Double, fuel: FuelType, location: String? = null): List<Station> =
        api.stations(lat, lng, fuel, location)

    suspend fun inBounds(south: Double, west: Double, north: Double, east: Double, fuel: FuelType): List<Station> =
        api.stationsInBounds(south, west, north, east, fuel)

    suspend fun priceBand(fuel: FuelType, lat: Double, lng: Double): PriceBand? =
        runCatching { api.priceBand(fuel, lat, lng).band }.getOrNull()
}
