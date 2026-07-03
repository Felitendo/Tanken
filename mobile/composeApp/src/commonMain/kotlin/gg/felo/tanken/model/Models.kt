package gg.felo.tanken.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/*
 * API models, shaped 1:1 after the JSON the Tanken server returns
 * (verified against live responses; see commonTest/resources/fixtures).
 */

@Serializable
enum class FuelType(val wire: String) {
    @SerialName("diesel") Diesel("diesel"),
    @SerialName("e5") E5("e5"),
    @SerialName("e10") E10("e10");

    companion object {
        fun fromWire(value: String?): FuelType = entries.firstOrNull { it.wire == value } ?: Diesel
    }
}

enum class Country(val wire: String) { De("de"), At("at") }

/** `GET /api/stations` element. */
@Serializable
data class Station(
    val id: String,
    val lat: Double,
    val lng: Double,
    val name: String = "",
    val brand: String? = null,
    val street: String? = null,
    val houseNumber: String? = null,
    val postCode: String? = null,
    val place: String? = null,
    val dist: Double? = null,
    val distApprox: Boolean = false,
    val price: Double? = null,
    val isOpen: Boolean = true,
) {
    val address: String
        get() {
            val streetPart = listOfNotNull(
                street?.takeIf { it.isNotBlank() },
                houseNumber?.takeIf { it.isNotBlank() },
            ).joinToString(" ")
            return listOfNotNull(streetPart.takeIf { it.isNotBlank() }, place?.takeIf { it.isNotBlank() })
                .joinToString(", ")
        }
}

/** `GET /api/station/{id}`. */
@Serializable
data class StationDetail(
    val id: String,
    val name: String = "",
    val brand: String? = null,
    val street: String? = null,
    val houseNumber: String? = null,
    val postCode: String? = null,
    val place: String? = null,
    val lat: Double,
    val lng: Double,
    val isOpen: Boolean = true,
    val e5: Double? = null,
    val e10: Double? = null,
    val diesel: Double? = null,
    val openingTimes: List<OpeningTime> = emptyList(),
    val wholeDay: Boolean = false,
) {
    fun price(fuel: FuelType): Double? = when (fuel) {
        FuelType.Diesel -> diesel
        FuelType.E5 -> e5
        FuelType.E10 -> e10
    }
}

@Serializable
data class OpeningTime(
    val text: String = "",
    val start: String = "",
    val end: String = "",
)

/** `GET /api/price-band`. */
@Serializable
data class PriceBandResponse(
    val fuel: String = "",
    val band: PriceBand? = null,
    val radiusKm: Double? = null,
    val generatedAt: String? = null,
)

@Serializable
data class PriceBand(
    val p10: Double,
    val p50: Double? = null,
    val p90: Double,
    val samples: Int = 0,
)

/** `GET /api/history` (aggregated or per-station series). */
@Serializable
data class HistoryResponse(
    val entries: List<HistoryEntry> = emptyList(),
    val extremes: HistoryExtremes? = null,
)

@Serializable
data class HistoryEntry(
    val timestamp: String,
    @SerialName("min_price") val minPrice: Double? = null,
    @SerialName("avg_price") val avgPrice: Double? = null,
    @SerialName("max_price") val maxPrice: Double? = null,
    val station: String? = null,
    @SerialName("num_stations") val numStations: Int? = null,
    @SerialName("location_id") val locationId: String? = null,
)

@Serializable
data class HistoryExtremes(
    val cheapest: HistoryExtreme? = null,
    val mostExpensive: HistoryExtreme? = null,
)

@Serializable
data class HistoryExtreme(
    @SerialName("station_name") val stationName: String? = null,
    @SerialName("station_id") val stationId: String? = null,
    @SerialName("station_brand") val stationBrand: String? = null,
    val price: Double? = null,
    val timestamp: String? = null,
)

/** `GET /api/history?locations=list`. */
@Serializable
data class HistoryLocationsResponse(val locations: List<String> = emptyList())

/** `GET /api/stats`. */
@Serializable
data class HistoryStats(
    val dayAvgs: List<DayAvg> = emptyList(),
    val hourAvgs: List<HourAvg> = emptyList(),
    val stationRanking: List<RankedStation> = emptyList(),
    val overall: OverallStats? = null,
)

@Serializable
data class DayAvg(val day: Int, val name: String = "", val avg: Double, val count: Int = 0)

@Serializable
data class HourAvg(val hour: Int, val avg: Double, val count: Int = 0)

@Serializable
data class RankedStation(
    val station: String = "",
    val avg: Double = 0.0,
    val min: Double? = null,
    val count: Int = 0,
    val id: String? = null,
    val brand: String? = null,
)

@Serializable
data class OverallStats(
    @SerialName("lowest_ever") val lowestEver: Double? = null,
    @SerialName("highest_ever") val highestEver: Double? = null,
    val avg: Double? = null,
    val entries: Int = 0,
    val since: String? = null,
    val until: String? = null,
)

/** `GET /api/scan-locations`. */
@Serializable
data class ScanLocationsResponse(val locations: List<ScanLocation> = emptyList())

@Serializable
data class ScanLocation(
    val id: String,
    val name: String = "",
    val country: String = "de",
    val lat: Double,
    val lng: Double,
    val radiusKm: Double? = null,
)

/** `GET /api/config`. */
@Serializable
data class PublicConfig(
    val smtpConfigured: Boolean = false,
    @SerialName("fuel_type") val fuelType: String? = null,
    @SerialName("radius_km") val radiusKm: Double? = null,
    @SerialName("refresh_interval_minutes") val refreshIntervalMinutes: Int? = null,
    val thresholds: Thresholds? = null,
    val auth: AuthConfig? = null,
)

@Serializable
data class Thresholds(
    @SerialName("good_below_avg_cents") val goodBelowAvgCents: Double = 3.0,
    @SerialName("okay_below_avg_cents") val okayBelowAvgCents: Double = 1.0,
)

@Serializable
data class AuthConfig(
    val provider: String? = null,
    val oidcConfigured: Boolean = false,
    val issuerUrl: String? = null,
    val clientId: String? = null,
    val oidcName: String? = null,
    val browserLoginProvider: String? = null,
    val adminPanelPath: String? = null,
    val sessionCookie: String? = null,
)

/** `GET /api/me`. */
@Serializable
data class MeResponse(
    val authenticated: Boolean = false,
    val user: ApiUser? = null,
    val auth: MeAuth? = null,
)

@Serializable
data class MeAuth(
    val provider: String? = null,
    val configured: Boolean = false,
)

@Serializable
data class ApiUser(
    val id: String = "",
    val displayName: String? = null,
    val username: String? = null,
    val email: String? = null,
    val photoUrl: String? = null,
    val roles: List<String> = emptyList(),
)

/** `GET/POST /api/settings`. */
@Serializable
data class UserSettings(
    val fuelType: String? = null,
    val radiusKm: Double? = null,
    val currentTab: String? = null,
    val theme: String? = null,
    val activeLocation: String? = null,
    val lang: String? = null,
    val historyDefaultDays: Int? = null,
    val favouritesOnTop: Boolean? = null,
    val groupByPrice: Boolean? = null,
)

/** `GET/POST /api/alert` and `/api/alert/local`. */
@Serializable
data class PriceAlert(
    val threshold: Double? = null,
    val fuel: String? = null,
    val enabled: Boolean = false,
    val channel: String? = null,
    val ntfyTopic: String? = null,
    val email: String? = null,
    val lat: Double? = null,
    val lng: Double? = null,
    val radiusKm: Double? = null,
    val lastNotifiedAt: String? = null,
    val lastNotifiedPrice: Double? = null,
)

/** `POST /api/alert` result: `{ok, alert, message}`. GET returns the alert object (or null) directly. */
@Serializable
data class AlertSaveResponse(
    val ok: Boolean = false,
    val alert: PriceAlert? = null,
    val message: String? = null,
)

/** `GET /api/favourites`. */
@Serializable
data class FavouritesResponse(val favourites: List<String> = emptyList(), val loginRequired: Boolean = false)

/** `GET /api/geocode`. */
@Serializable
data class GeocodeResponse(val results: List<GeocodeResult> = emptyList())

@Serializable
data class GeocodeResult(val name: String = "", val lat: Double, val lng: Double)

/** `GET /api/manual-scans`. */
@Serializable
data class ManualScansResponse(val ttlMs: Long = 0, val scans: List<ManualScan> = emptyList())

@Serializable
data class ManualScan(
    val lat: Double? = null,
    val lng: Double? = null,
    val fuel: String? = null,
    val timestamp: String? = null,
    val stations: List<Station> = emptyList(),
)

/** `POST /api/route`. */
@Serializable
data class RouteRequest(
    val startLat: Double,
    val startLng: Double,
    val destLat: Double,
    val destLng: Double,
    val fuel: String,
    val bufferKm: Double? = null,
)

@Serializable
data class RouteResponse(
    val route: RouteGeometry? = null,
    val stations: List<Station> = emptyList(),
    val bufferKm: Double? = null,
    val scanPoints: List<ScanPoint> = emptyList(),
    val loginRequired: Boolean = false,
)

@Serializable
data class RouteGeometry(
    /** [lng, lat] coordinate pairs as delivered by ORS/GeoJSON. */
    val coordinates: List<List<Double>> = emptyList(),
    val distanceKm: Double? = null,
    val durationMin: Double? = null,
)

@Serializable
data class ScanPoint(val lat: Double, val lng: Double, val scanned: Boolean = false)

/** `GET/POST /api/location-requests`. */
@Serializable
data class LocationRequest(
    val id: String? = null,
    val name: String = "",
    val lat: Double = 0.0,
    val lng: Double = 0.0,
    val radiusKm: Double? = null,
    val note: String? = null,
    val status: String? = null,
    val adminNote: String? = null,
    val createdAt: String? = null,
)

@Serializable
data class LocationRequestsResponse(
    val requests: List<LocationRequest> = emptyList(),
    val loginRequired: Boolean = false,
)
