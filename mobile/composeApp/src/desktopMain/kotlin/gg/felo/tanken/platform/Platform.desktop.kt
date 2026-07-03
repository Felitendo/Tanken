package gg.felo.tanken.platform

import com.russhwolf.settings.PreferencesSettings
import com.russhwolf.settings.Settings
import io.ktor.client.engine.HttpClientEngineFactory
import io.ktor.client.engine.okhttp.OkHttp
import java.awt.Desktop
import java.net.URI
import java.util.prefs.Preferences

actual fun httpClientEngine(): HttpClientEngineFactory<*> = OkHttp

actual fun createSettings(): Settings =
    PreferencesSettings(Preferences.userRoot().node("gg.felo.tanken"))

/** Desktop is a dev/verification tool — plain preferences are fine here. */
actual fun createSecureStore(): SecureStore = object : SecureStore {
    private val prefs = Preferences.userRoot().node("gg.felo.tanken.secure")
    override fun read(key: String): String? = prefs.get(key, null)
    override fun write(key: String, value: String?) {
        if (value == null) prefs.remove(key) else prefs.put(key, value)
    }
}

/**
 * Fixed location for deterministic screenshots; override with
 * TANKEN_FAKE_LAT/TANKEN_FAKE_LNG or -Dtanken.lat/-Dtanken.lng.
 */
actual fun createGeolocation(): Geolocation = object : Geolocation {
    override suspend fun current(): LatLng {
        val lat = System.getProperty("tanken.lat")?.toDoubleOrNull()
            ?: System.getenv("TANKEN_FAKE_LAT")?.toDoubleOrNull() ?: 52.52
        val lng = System.getProperty("tanken.lng")?.toDoubleOrNull()
            ?: System.getenv("TANKEN_FAKE_LNG")?.toDoubleOrNull() ?: 13.405
        return LatLng(lat, lng)
    }
}

actual fun createHaptics(): Haptics = object : Haptics {
    override fun tap() {}
    override fun success() {}
    override fun error() {}
    override fun selection() {}
}

/**
 * Desktop login: opens the browser on the start URL (without app_redirect) and
 * lets the developer paste a session token via the TANKEN_SESSION_TOKEN env
 * var — enough to verify logged-in flows locally.
 */
actual fun createAuthenticator(): Authenticator = object : Authenticator {
    override suspend fun login(startUrl: String): String? {
        System.getenv("TANKEN_SESSION_TOKEN")?.takeIf { it.isNotBlank() }?.let { return it }
        runCatching { Desktop.getDesktop().browse(URI(startUrl.substringBefore("?mode=app"))) }
        return null
    }
}

actual fun createMapsLink(): MapsLink = object : MapsLink {
    override fun openNavigation(lat: Double, lng: Double, name: String) {
        runCatching { Desktop.getDesktop().browse(URI("https://www.google.com/maps/dir/?api=1&destination=$lat,$lng")) }
    }
}

actual fun cacheDir(): String? =
    (System.getenv("XDG_CACHE_HOME") ?: (System.getProperty("user.home") + "/.cache")) + "/tanken"

actual fun systemLanguage(): String = java.util.Locale.getDefault().language ?: "de"

actual fun openUrl(url: String) {
    runCatching { Desktop.getDesktop().browse(URI(url)) }
}
