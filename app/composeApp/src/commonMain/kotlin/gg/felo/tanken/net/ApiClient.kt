package gg.felo.tanken.net

import gg.felo.tanken.model.AlertResponse
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.GeocodeResponse
import gg.felo.tanken.model.HistoryResponse
import gg.felo.tanken.model.MeResponse
import gg.felo.tanken.model.PriceAlert
import gg.felo.tanken.model.PriceBandResponse
import gg.felo.tanken.model.PublicConfig
import gg.felo.tanken.model.ScanLocationsResponse
import gg.felo.tanken.model.Station
import gg.felo.tanken.model.StationDetail
import gg.felo.tanken.state.AppConfig
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/**
 * Single entry point for all backend communication. The base URL is read from [AppConfig] on every
 * request so changing it in Settings re-points the whole app immediately. Ktor selects the platform
 * engine automatically (OkHttp on Android, Darwin on iOS).
 */
class ApiClient(
    private val config: AppConfig,
    private val tokens: TokenProvider,
) {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        encodeDefaults = true
        explicitNulls = false
    }

    private val client = HttpClient {
        expectSuccess = false
        install(ContentNegotiation) { json(json) }
    }

    private fun url(path: String): String = config.baseUrl.value + path

    private fun io.ktor.client.request.HttpRequestBuilder.auth() {
        tokens.token.value?.let { header("Cookie", "tank_session=$it") }
    }

    // ---- Public, unauthenticated endpoints -------------------------------------------------

    suspend fun stations(lat: Double, lng: Double, fuel: FuelType, location: String? = null): List<Station> =
        client.get(url("/api/stations")) {
            parameter("lat", lat)
            parameter("lng", lng)
            parameter("fuel", fuel.wire)
            location?.let { parameter("location", it) }
            auth()
        }.bodyOrThrow()

    suspend fun stationsInBounds(south: Double, west: Double, north: Double, east: Double, fuel: FuelType): List<Station> =
        client.get(url("/api/stations")) {
            parameter("bounds", "$south,$west,$north,$east")
            parameter("fuel", fuel.wire)
            auth()
        }.bodyOrThrow()

    suspend fun priceBand(fuel: FuelType, lat: Double, lng: Double, radiusKm: Double? = null): PriceBandResponse =
        client.get(url("/api/price-band")) {
            parameter("fuel", fuel.wire)
            parameter("lat", lat)
            parameter("lng", lng)
            radiusKm?.let { parameter("radius", it) }
        }.bodyOrThrow()

    suspend fun stationDetail(id: String): StationDetail =
        client.get(url("/api/station/$id")) { auth() }.bodyOrThrow()

    suspend fun geocode(query: String, lang: String = "de"): GeocodeResponse =
        client.get(url("/api/geocode")) {
            parameter("q", query)
            parameter("lang", lang)
        }.bodyOrThrow()

    suspend fun history(location: String? = null, country: String = "de"): HistoryResponse =
        client.get(url("/api/history")) {
            location?.let { parameter("location", it) }
            parameter("country", country)
        }.bodyOrThrow()

    suspend fun scanLocations(): ScanLocationsResponse =
        client.get(url("/api/scan-locations")).bodyOrThrow()

    suspend fun config(): PublicConfig =
        client.get(url("/api/config")).bodyOrThrow()

    // ---- Authenticated endpoints -----------------------------------------------------------

    suspend fun me(): MeResponse =
        client.get(url("/api/me")) { auth() }.bodyOrThrow()

    suspend fun getAlert(): PriceAlert? =
        runCatching { client.get(url("/api/alert")) { auth() }.bodyOrThrow<PriceAlert>() }.getOrNull()

    suspend fun saveAlert(alert: PriceAlert): AlertResponse =
        client.post(url("/api/alert")) {
            contentType(ContentType.Application.Json)
            setBody(alert)
            auth()
        }.bodyOrThrow()

    suspend fun deleteAlert(): Boolean =
        client.delete(url("/api/alert")) { auth() }.status.isSuccess()

    suspend fun favourites(): List<String> =
        runCatching {
            client.get(url("/api/favourites")) { auth() }.bodyOrThrow<FavouritesResponse>().favourites
        }.getOrDefault(emptyList())

    suspend fun setFavourite(stationId: String, favourite: Boolean): Boolean {
        val resp = if (favourite) {
            client.post(url("/api/favourites")) {
                contentType(ContentType.Application.Json)
                setBody(FavouriteBody(stationId))
                auth()
            }
        } else {
            client.delete(url("/api/favourites")) {
                parameter("id", stationId)
                auth()
            }
        }
        return resp.status.isSuccess()
    }

    private suspend inline fun <reified T> io.ktor.client.statement.HttpResponse.bodyOrThrow(): T {
        if (!status.isSuccess()) {
            throw ApiException(status.value, bodyAsText())
        }
        return body()
    }
}

@kotlinx.serialization.Serializable
private data class FavouritesResponse(val favourites: List<String> = emptyList())

@kotlinx.serialization.Serializable
private data class FavouriteBody(val id: String)

class ApiException(val code: Int, val bodyText: String) :
    Exception("API error $code: ${bodyText.take(200)}")
