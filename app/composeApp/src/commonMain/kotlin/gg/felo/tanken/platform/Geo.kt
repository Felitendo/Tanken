package gg.felo.tanken.platform

/** Plain lat/lng pair shared across platforms (avoids leaking MapKit / Google Maps types). */
data class LatLng(val lat: Double, val lng: Double)

/** Geographic viewport (map bounds). */
data class GeoBounds(
    val south: Double,
    val west: Double,
    val north: Double,
    val east: Double,
)

/**
 * One-shot device location. iOS → CLLocationManager, Android → FusedLocationProviderClient.
 * Returns null when permission is denied or no fix is available. Provided per-platform via Koin.
 */
interface Geolocation {
    suspend fun current(): LatLng?
}

/** No-op for previews/tests. */
object NoGeolocation : Geolocation {
    override suspend fun current(): LatLng? = null
}
