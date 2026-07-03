package gg.felo.tanken

import androidx.compose.runtime.staticCompositionLocalOf
import gg.felo.tanken.net.ApiClient
import gg.felo.tanken.platform.Authenticator
import gg.felo.tanken.platform.Geolocation
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.platform.createAuthenticator
import gg.felo.tanken.platform.createGeolocation
import gg.felo.tanken.platform.createHaptics
import gg.felo.tanken.platform.createMapsLink
import gg.felo.tanken.platform.createSecureStore
import gg.felo.tanken.platform.createSettings
import gg.felo.tanken.platform.httpClientEngine
import gg.felo.tanken.state.AppState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/**
 * Manual dependency graph — one instance per process, wired in each platform
 * entry point and handed to composition via [LocalAppGraph].
 */
class AppGraph(
    val geolocation: Geolocation = createGeolocation(),
    val haptics: Haptics = createHaptics(),
    val authenticator: Authenticator = createAuthenticator(),
    val mapsLink: MapsLink = createMapsLink(),
) {
    val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    /** UI-confined scope: TileProvider mutations must happen on the main thread. */
    val mainScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    val state = AppState(createSettings(), createSecureStore(), scope)
    val api = ApiClient(
        baseUrl = { state.baseUrl.value },
        sessionToken = { state.sessionToken.value },
        engine = httpClientEngine(),
    )
    val tiles = gg.felo.tanken.map.TileProvider(httpClientEngine(), mainScope)

    init {
        state.api = api
    }
}

val LocalAppGraph = staticCompositionLocalOf<AppGraph> { error("AppGraph not provided") }
