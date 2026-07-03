package gg.felo.tanken.ui.screens.map

import gg.felo.tanken.AppGraph
import gg.felo.tanken.map.MapCamera
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.ui.theme.PriceColor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

/**
 * Map tab state: camera, stations for the active area, regional price band
 * (snap-cell cached like the PWA) and the user's location.
 */
class MapViewModel(private val graph: AppGraph) {

    val camera = MapCamera(LatLng(52.52, 13.405), 11.0)
    val stations = MutableStateFlow<List<Station>>(emptyList())
    val band = MutableStateFlow<PriceBand?>(null)
    val userLocation = MutableStateFlow<LatLng?>(null)
    val loading = MutableStateFlow(false)

    private var bandKey: String? = null
    private var started = false

    /** [uiScope] must be a composition scope — camera animations need its frame clock. */
    suspend fun start(uiScope: kotlinx.coroutines.CoroutineScope) {
        if (started) return
        started = true
        val located = graph.geolocation.current()
        if (located != null) {
            userLocation.value = located
            camera.animateTo(uiScope, located, 12.0)
        }
        val anchor = located ?: camera.center
        loadAround(anchor)
    }

    suspend fun jumpToUser(uiScope: kotlinx.coroutines.CoroutineScope) {
        val located = graph.geolocation.current() ?: return
        userLocation.value = located
        camera.animateTo(uiScope, located, 12.0)
        loadAround(located)
        graph.haptics.tap()
    }

    suspend fun loadAround(point: LatLng) {
        loading.value = true
        try {
            val fuel = graph.state.fuel.value
            runCatching { graph.api.stations(point.lat, point.lng, fuel) }
                .onSuccess { stations.value = it }
            loadBand(point)
        } finally {
            loading.value = false
        }
    }

    /** "Hier suchen": loads stations for the visible viewport. */
    suspend fun loadViewport() {
        loading.value = true
        try {
            val bounds = camera.visibleBounds()
            val fuel = graph.state.fuel.value
            runCatching {
                graph.api.stationsInBounds(bounds.south, bounds.west, bounds.north, bounds.east, fuel)
            }.onSuccess {
                stations.value = it
                camera.moved = false
            }
            loadBand(camera.center)
        } finally {
            loading.value = false
        }
    }

    /**
     * Regional band anchored to a 0.5-degree snap cell (PWA `priceBandKey`) so
     * small pans never refetch or recolor.
     */
    private suspend fun loadBand(point: LatLng) {
        val fuel = graph.state.fuel.value
        val snapLat = (point.lat / PriceColor.BAND_SNAP_DEG).roundToInt() * PriceColor.BAND_SNAP_DEG
        val snapLng = (point.lng / PriceColor.BAND_SNAP_DEG).roundToInt() * PriceColor.BAND_SNAP_DEG
        val key = "${fuel.wire}:$snapLat:$snapLng"
        if (key == bandKey && band.value != null) return
        runCatching { graph.api.priceBand(fuel, point.lat, point.lng, PriceColor.BAND_RADIUS_KM) }
            .onSuccess {
                band.value = it.band
                bandKey = key
            }
    }

    fun refreshOnFuelChange() {
        bandKey = null
        graph.mainScope.launch { loadAround(camera.center) }
    }
}
