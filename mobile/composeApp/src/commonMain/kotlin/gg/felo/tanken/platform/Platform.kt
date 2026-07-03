package gg.felo.tanken.platform

import com.russhwolf.settings.Settings
import io.ktor.client.engine.HttpClientEngineFactory

/** Simple lat/lng pair used across the app. */
data class LatLng(val lat: Double, val lng: Double)

/** Ktor engine for this platform (Darwin on iOS, OkHttp on desktop). */
expect fun httpClientEngine(): HttpClientEngineFactory<*>

/** Key/value persistence (NSUserDefaults / Java Preferences). */
expect fun createSettings(): Settings

/** Secure storage for the session token (Keychain on iOS). */
interface SecureStore {
    fun read(key: String): String?
    fun write(key: String, value: String?)
}

expect fun createSecureStore(): SecureStore

/** One-shot device location; null when denied or unavailable. */
interface Geolocation {
    suspend fun current(): LatLng?
}

expect fun createGeolocation(): Geolocation

/** Haptic feedback; no-op outside iOS. */
interface Haptics {
    fun tap()
    fun success()
    fun error()
    fun selection()
}

expect fun createHaptics(): Haptics

/**
 * Opens the OIDC login flow (`/auth/oidc/start?mode=app&app_redirect=tanken://auth`)
 * and resolves with the signed session token from the `tanken://auth?token=` callback,
 * or null when the user cancelled.
 */
interface Authenticator {
    suspend fun login(startUrl: String): String?
}

expect fun createAuthenticator(): Authenticator

enum class MapsProvider { Google, Apple }

/** Opens Apple/Google Maps (iOS) or a browser map (desktop) for navigation. */
interface MapsLink {
    fun openNavigation(lat: Double, lng: Double, name: String, provider: MapsProvider)
}

expect fun createMapsLink(): MapsLink

/** Directory for the tile disk cache. */
expect fun cacheDir(): String?

/** BCP-47-ish language code of the system ("de", "en", ...). */
expect fun systemLanguage(): String

/** Opens an external URL in the system browser. */
expect fun openUrl(url: String)
