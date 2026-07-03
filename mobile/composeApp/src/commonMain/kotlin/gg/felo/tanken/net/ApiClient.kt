package gg.felo.tanken.net

import gg.felo.tanken.model.AlertSaveResponse
import gg.felo.tanken.model.Country
import gg.felo.tanken.model.FavouritesResponse
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.GeocodeResponse
import gg.felo.tanken.model.HistoryLocationsResponse
import gg.felo.tanken.model.HistoryResponse
import gg.felo.tanken.model.HistoryStats
import gg.felo.tanken.model.LocationRequest
import gg.felo.tanken.model.LocationRequestsResponse
import gg.felo.tanken.model.ManualScansResponse
import gg.felo.tanken.model.MeResponse
import gg.felo.tanken.model.PriceAlert
import gg.felo.tanken.model.PriceBandResponse
import gg.felo.tanken.model.PublicConfig
import gg.felo.tanken.model.RouteRequest
import gg.felo.tanken.model.RouteResponse
import gg.felo.tanken.model.ScanLocationsResponse
import gg.felo.tanken.model.Station
import gg.felo.tanken.model.StationDetail
import gg.felo.tanken.model.UserSettings
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.serialization.json.Json

class ApiException(val status: Int, val bodyText: String, val loginRequired: Boolean = false) :
    Exception("API error $status: ${bodyText.take(200)}")

/**
 * Single entry point for all backend communication. Authenticated endpoints
 * replay the signed session token as the `tank_session` cookie header — the
 * same session mechanism the website uses. [inFlight] counts live requests so
 * the screenshot harness knows when the UI has settled.
 */
class ApiClient(
    private val baseUrl: () -> String,
    private val sessionToken: () -> String?,
    engine: io.ktor.client.engine.HttpClientEngineFactory<*>,
) {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        explicitNulls = false
        encodeDefaults = false
    }

    private val client = HttpClient(engine) {
        expectSuccess = false
        install(ContentNegotiation) { json(json) }
        install(HttpTimeout) {
            requestTimeoutMillis = 25_000
            connectTimeoutMillis = 15_000
        }
    }

    private val _inFlight = MutableStateFlow(0)
    val inFlight: StateFlow<Int> = _inFlight

    private fun url(path: String): String = baseUrl().trimEnd('/') + path

    private fun HttpRequestBuilder.auth() {
        sessionToken()?.let { header("Cookie", "tank_session=$it") }
    }

    private suspend inline fun <reified T> HttpResponse.bodyOrThrow(): T {
        if (!status.isSuccess()) {
            val text = bodyAsText()
            throw ApiException(status.value, text, loginRequired = text.contains("loginRequired"))
        }
        return body()
    }

    private suspend inline fun <T> tracked(block: () -> T): T {
        _inFlight.value += 1
        try {
            return block()
        } finally {
            _inFlight.value -= 1
        }
    }

    // ---- Public endpoints ---------------------------------------------------------------

    suspend fun stations(lat: Double, lng: Double, fuel: FuelType, location: String? = null): List<Station> = tracked {
        client.get(url("/api/stations")) {
            parameter("lat", lat)
            parameter("lng", lng)
            parameter("fuel", fuel.wire)
            location?.let { parameter("location", it) }
        }.bodyOrThrow()
    }

    suspend fun stationsInBounds(south: Double, west: Double, north: Double, east: Double, fuel: FuelType): List<Station> = tracked {
        client.get(url("/api/stations")) {
            parameter("bounds", "$south,$west,$north,$east")
            parameter("fuel", fuel.wire)
        }.bodyOrThrow()
    }

    suspend fun stationDetail(id: String): StationDetail = tracked {
        client.get(url("/api/station/$id")).bodyOrThrow()
    }

    suspend fun searchStations(query: String, fuel: FuelType, lat: Double? = null, lng: Double? = null): List<Station> = tracked {
        client.get(url("/api/stations/search")) {
            parameter("q", query)
            parameter("fuel", fuel.wire)
            lat?.let { parameter("lat", it) }
            lng?.let { parameter("lng", it) }
        }.bodyOrThrow()
    }

    suspend fun priceBand(fuel: FuelType, lat: Double, lng: Double, radiusKm: Double = 100.0): PriceBandResponse = tracked {
        client.get(url("/api/price-band")) {
            parameter("fuel", fuel.wire)
            parameter("lat", lat)
            parameter("lng", lng)
            parameter("radius", radiusKm)
        }.bodyOrThrow()
    }

    suspend fun history(country: Country, location: String? = null): HistoryResponse = tracked {
        client.get(url("/api/history")) {
            parameter("country", country.wire)
            location?.let { parameter("location", it) }
        }.bodyOrThrow()
    }

    suspend fun stationHistory(stationId: String, fuel: FuelType, country: Country): HistoryResponse = tracked {
        client.get(url("/api/history")) {
            parameter("country", country.wire)
            parameter("station", 1)
            parameter("id", stationId)
            parameter("fuel", fuel.wire)
        }.bodyOrThrow()
    }

    suspend fun historyLocations(): HistoryLocationsResponse = tracked {
        client.get(url("/api/history")) { parameter("locations", "list") }.bodyOrThrow()
    }

    suspend fun stats(country: Country, location: String? = null): HistoryStats = tracked {
        client.get(url("/api/stats")) {
            parameter("country", country.wire)
            location?.let { parameter("location", it) }
        }.bodyOrThrow()
    }

    suspend fun scanLocations(): ScanLocationsResponse = tracked {
        client.get(url("/api/scan-locations")).bodyOrThrow()
    }

    suspend fun manualScans(fuel: FuelType? = null): ManualScansResponse = tracked {
        client.get(url("/api/manual-scans")) {
            fuel?.let { parameter("fuel", it.wire) }
        }.bodyOrThrow()
    }

    suspend fun config(): PublicConfig = tracked {
        client.get(url("/api/config")).bodyOrThrow()
    }

    suspend fun me(): MeResponse = tracked {
        client.get(url("/api/me")) { auth() }.bodyOrThrow()
    }

    // ---- Session-authenticated endpoints --------------------------------------------------

    suspend fun logout() = tracked {
        client.post(url("/api/logout")) { auth() }
        Unit
    }

    suspend fun settings(): UserSettings = tracked {
        client.get(url("/api/settings")) { auth() }.bodyOrThrow()
    }

    suspend fun saveSettings(settings: UserSettings): UserSettings = tracked {
        client.post(url("/api/settings")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(settings)
        }.bodyOrThrow()
    }

    suspend fun favourites(): FavouritesResponse = tracked {
        client.get(url("/api/favourites")) { auth() }.bodyOrThrow()
    }

    suspend fun addFavourite(stationId: String): FavouritesResponse = tracked {
        client.post(url("/api/favourites")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(mapOf("stationId" to stationId))
        }.bodyOrThrow()
    }

    suspend fun removeFavourite(stationId: String): FavouritesResponse = tracked {
        client.delete(url("/api/favourites")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(mapOf("stationId" to stationId))
        }.bodyOrThrow()
    }

    /** GET returns the alert object directly, or JSON null when none is set. */
    suspend fun alert(local: Boolean): PriceAlert? = tracked {
        val response = client.get(url(if (local) "/api/alert/local" else "/api/alert")) { auth() }
        if (!response.status.isSuccess()) {
            val text = response.bodyAsText()
            throw ApiException(response.status.value, text, text.contains("loginRequired"))
        }
        val text = response.bodyAsText()
        if (text.isBlank() || text == "null") null else json.decodeFromString<PriceAlert?>(text)
    }

    suspend fun saveAlert(alert: PriceAlert, local: Boolean): AlertSaveResponse = tracked {
        client.post(url(if (local) "/api/alert/local" else "/api/alert")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(alert)
        }.bodyOrThrow()
    }

    suspend fun deleteAlert(local: Boolean) = tracked {
        client.delete(url(if (local) "/api/alert/local" else "/api/alert")) { auth() }
        Unit
    }

    suspend fun sendTestNotification(topic: String, title: String, message: String) = tracked {
        client.post(url("/api/alert/notify")) {
            contentType(ContentType.Application.Json)
            setBody(mapOf("topic" to topic, "title" to title, "message" to message))
        }.bodyOrThrow<Map<String, Boolean>>()
        Unit
    }

    suspend fun sendTestEmail(to: String, subject: String, body: String) = tracked {
        client.post(url("/api/alert/email")) {
            contentType(ContentType.Application.Json)
            setBody(mapOf("to" to to, "subject" to subject, "body" to body))
        }.bodyOrThrow<Map<String, Boolean>>()
        Unit
    }

    suspend fun geocode(query: String, lang: String): GeocodeResponse = tracked {
        client.get(url("/api/geocode")) {
            auth()
            parameter("q", query)
            parameter("lang", lang)
        }.bodyOrThrow()
    }

    suspend fun route(request: RouteRequest): RouteResponse = tracked {
        client.post(url("/api/route")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(request)
        }.bodyOrThrow()
    }

    suspend fun routeScanPoint(lat: Double, lng: Double, fuel: FuelType): List<Station> = tracked {
        client.post(url("/api/route/scan-point")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(ScanPointBody(lat, lng, fuel.wire))
        }.bodyOrThrow()
    }

    @kotlinx.serialization.Serializable
    private data class ScanPointBody(val lat: Double, val lng: Double, val fuel: String)

    suspend fun locationRequests(): LocationRequestsResponse = tracked {
        client.get(url("/api/location-requests")) { auth() }.bodyOrThrow()
    }

    suspend fun createLocationRequest(name: String, lat: Double, lng: Double, radiusKm: Double?, note: String?): LocationRequest = tracked {
        val response = client.post(url("/api/location-requests")) {
            auth()
            contentType(ContentType.Application.Json)
            setBody(LocationRequestBody(name, lat, lng, radiusKm, note?.takeIf { it.isNotBlank() }))
        }
        if (!response.status.isSuccess()) {
            val text = response.bodyAsText()
            throw ApiException(response.status.value, text, response.status.value == 401 || response.status.value == 403)
        }
        val text = response.bodyAsText()
        json.decodeFromString<CreatedRequestEnvelope>(text).request ?: LocationRequest(name = name, lat = lat, lng = lng)
    }

    @kotlinx.serialization.Serializable
    private data class CreatedRequestEnvelope(val request: LocationRequest? = null)

    @kotlinx.serialization.Serializable
    private data class LocationRequestBody(
        val name: String,
        val lat: Double,
        val lng: Double,
        val radiusKm: Double? = null,
        val note: String? = null,
    )
}
