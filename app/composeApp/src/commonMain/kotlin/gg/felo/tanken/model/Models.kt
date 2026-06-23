package gg.felo.tanken.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/** Mirrors the web app's `FuelType` (src/types.ts). */
@Serializable
enum class FuelType {
    @SerialName("diesel") DIESEL,
    @SerialName("e5") E5,
    @SerialName("e10") E10;

    /** Wire value used in API query params (`diesel`/`e5`/`e10`). */
    val wire: String
        get() = when (this) {
            DIESEL -> "diesel"
            E5 -> "e5"
            E10 -> "e10"
        }

    /** Human label shown in the UI. */
    val label: String
        get() = when (this) {
            DIESEL -> "Diesel"
            E5 -> "Super E5"
            E10 -> "Super E10"
        }

    companion object {
        fun fromWire(value: String?): FuelType = when (value) {
            "e5" -> E5
            "e10" -> E10
            else -> DIESEL
        }
    }
}

/** A fuel station + price, as returned by `GET /api/stations` (CachedStation). */
@Serializable
data class Station(
    val id: String,
    val name: String = "",
    val brand: String = "",
    val street: String = "",
    val houseNumber: String = "",
    val postCode: String = "",
    val place: String = "",
    val lat: Double,
    val lng: Double,
    val dist: Double = 0.0,
    val distApprox: Boolean = false,
    val price: Double? = null,
    val isOpen: Boolean = false,
) {
    val displayBrand: String get() = brand.ifBlank { name }
    val addressLine: String
        get() = buildString {
            append(street)
            if (houseNumber.isNotBlank()) append(" ").append(houseNumber)
        }.trim()
    val cityLine: String
        get() = listOf(postCode, place).filter { it.isNotBlank() }.joinToString(" ")
}

/** Regional price band used to colour stations (`GET /api/price-band`). */
@Serializable
data class PriceBand(
    val p10: Double,
    val p50: Double,
    val p90: Double,
    val samples: Int = 0,
)

@Serializable
data class PriceBandResponse(
    val fuel: String,
    val band: PriceBand? = null,
    val radiusKm: Double? = null,
    val generatedAt: String? = null,
)

/** A single station-detail response (`GET /api/station/{id}`). */
@Serializable
data class StationDetail(
    val id: String? = null,
    val name: String = "",
    val brand: String = "",
    val street: String = "",
    val houseNumber: String = "",
    val postCode: String = "",
    val place: String = "",
    val lat: Double? = null,
    val lng: Double? = null,
    val price: Double? = null,
    val isOpen: Boolean? = null,
    val openingTimes: List<OpeningTime> = emptyList(),
    val updatedAt: String? = null,
)

@Serializable
data class OpeningTime(
    val text: String = "",
    val start: String = "",
    val end: String = "",
)

/** Geocode result row (`GET /api/geocode`). */
@Serializable
data class GeocodeResult(
    val name: String,
    val lat: Double,
    val lng: Double,
)

@Serializable
data class GeocodeResponse(
    val results: List<GeocodeResult> = emptyList(),
)

/** A history aggregate point (`GET /api/history`). */
@Serializable
data class HistoryEntry(
    val timestamp: String,
    @SerialName("min_price") val minPrice: Double,
    @SerialName("avg_price") val avgPrice: Double,
    @SerialName("max_price") val maxPrice: Double,
    val station: String = "",
    @SerialName("num_stations") val numStations: Int = 0,
    @SerialName("location_id") val locationId: String? = null,
)

@Serializable
data class HistoryExtreme(
    val station: String = "",
    val price: Double = 0.0,
    val id: String? = null,
)

@Serializable
data class HistoryResponse(
    val entries: List<HistoryEntry> = emptyList(),
    val extremes: HistoryExtremes? = null,
)

@Serializable
data class HistoryExtremes(
    val cheapest: HistoryExtreme? = null,
    val expensive: HistoryExtreme? = null,
)

/** Admin-curated scan location (`GET /api/scan-locations`). */
@Serializable
data class ScanLocation(
    val id: String,
    val name: String,
    val country: String = "de",
    val lat: Double,
    val lng: Double,
    val radiusKm: Double = 25.0,
)

@Serializable
data class ScanLocationsResponse(
    val locations: List<ScanLocation> = emptyList(),
)

/** Price alert (`/api/alert`). Mirrors src/types.ts PriceAlert. */
@Serializable
data class PriceAlert(
    val threshold: Double,
    val fuel: FuelType = FuelType.DIESEL,
    val enabled: Boolean = true,
    val channel: String = "ntfy",
    val ntfyTopic: String? = null,
    val email: String? = null,
    val lat: Double? = null,
    val lng: Double? = null,
    val radiusKm: Double? = null,
    val lastNotifiedAt: String? = null,
    val lastNotifiedPrice: Double? = null,
    val created: String? = null,
    val updated: String? = null,
)

@Serializable
data class AlertResponse(
    val ok: Boolean = false,
    val alert: PriceAlert? = null,
    val message: String? = null,
)

/** User settings, mirrors src/types.ts UserSettings (subset the app touches). */
@Serializable
data class UserSettings(
    val fuelType: FuelType = FuelType.DIESEL,
    val radiusKm: Double = 25.0,
    val theme: String? = null,
    val activeLocation: String? = null,
    val lang: String? = null,
    val favouritesOnTop: Boolean? = null,
    val groupByPrice: Boolean? = null,
)

/** Sanitised user (`GET /api/me`). */
@Serializable
data class SanitizedUser(
    val id: String,
    val displayName: String? = null,
    val username: String = "",
    val email: String = "",
    val photoUrl: String = "",
    val settings: UserSettings = UserSettings(),
    val favourites: List<String> = emptyList(),
)

@Serializable
data class AuthInfo(
    val provider: String = "oidc",
    val configured: Boolean = false,
    val adminPanelPath: String = "/admin",
)

@Serializable
data class MeResponse(
    val authenticated: Boolean = false,
    val user: SanitizedUser? = null,
    val auth: AuthInfo = AuthInfo(),
)

/** Public configuration (`GET /api/config`). */
@Serializable
data class PublicConfig(
    val smtpConfigured: Boolean = false,
    @SerialName("fuel_type") val fuelType: FuelType = FuelType.DIESEL,
    @SerialName("radius_km") val radiusKm: Double = 25.0,
    val auth: PublicAuthConfig = PublicAuthConfig(),
)

@Serializable
data class PublicAuthConfig(
    val provider: String = "oidc",
    val oidcConfigured: Boolean = false,
    val issuerUrl: String = "",
    val oidcName: String = "",
    val sessionCookie: String = "tank_session",
)
