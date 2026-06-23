package gg.felo.tanken.platform

/**
 * Opens turn-by-turn directions in the platform's maps app. iOS offers Apple Maps (and Google Maps
 * if installed); Android opens Google Maps via a geo: intent. Provided per-platform via Koin.
 */
interface MapsLink {
    /** True on iOS → show an Apple Maps button. */
    val showAppleMaps: Boolean

    /** Whether a Google Maps app is available (Android: always true; iOS: only if installed). */
    val hasGoogleMaps: Boolean

    /** Open directions to (lat,lng) labelled [label] in Apple Maps. */
    fun openAppleMaps(lat: Double, lng: Double, label: String)

    /** Open directions to (lat,lng) in Google Maps. */
    fun openGoogleMaps(lat: Double, lng: Double, label: String)
}

object NoMapsLink : MapsLink {
    override val showAppleMaps: Boolean = false
    override val hasGoogleMaps: Boolean = false
    override fun openAppleMaps(lat: Double, lng: Double, label: String) {}
    override fun openGoogleMaps(lat: Double, lng: Double, label: String) {}
}
