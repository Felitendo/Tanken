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

    /** Screenshot harness: open the cheapest station's sheet once loaded. */
    var autoSelectFirst = false

    /** [uiScope] must be a composition scope — camera animations need its frame clock. */
    suspend fun start(uiScope: kotlinx.coroutines.CoroutineScope) {
        if (started) return
        started = true
        // Stale-while-revalidate: show the last known stations instantly.
        if (stations.value.isEmpty()) {
            stations.value = graph.state.readCachedStations()
        }
        val located = graph.geolocation.current()
        if (located != null) {
            userLocation.value = located
            camera.animateTo(uiScope, located, 12.0)
        }
        val anchor = located ?: camera.center
        loadAround(anchor)
        if (autoSelectFirst) {
            stations.value
                .filter { it.isOpen && it.price != null }
                .minByOrNull { it.price!! }
                ?.let { select(it) }
        }
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
                .onSuccess {
                    stations.value = it
                    graph.state.writeCachedStations(it)
                }
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

    // ---- Search -----------------------------------------------------------------------

    val searchQuery = MutableStateFlow("")
    val suggestions = MutableStateFlow<List<SearchSuggestion>>(emptyList())
    private var searchJob: kotlinx.coroutines.Job? = null

    fun onSearchInput(text: String) {
        searchQuery.value = text
        searchJob?.cancel()
        if (text.trim().length < 2) {
            suggestions.value = emptyList()
            return
        }
        searchJob = graph.mainScope.launch {
            kotlinx.coroutines.delay(250)
            val fuel = graph.state.fuel.value
            val user = userLocation.value
            val stationHits = runCatching {
                graph.api.searchStations(text.trim(), fuel, user?.lat, user?.lng)
            }.getOrDefault(emptyList()).map { station ->
                SearchSuggestion(
                    title = station.name.ifBlank { station.brand ?: "" },
                    subtitle = station.address.takeIf { it.isNotBlank() },
                    lat = station.lat,
                    lng = station.lng,
                    price = station.price,
                    isPlace = false,
                    station = station,
                )
            }
            // Geocode is login-gated server-side; ignore failures silently.
            val placeHits = if (graph.state.isLoggedIn) {
                runCatching {
                    graph.api.geocode(text.trim(), graph.state.language.value.code)
                }.getOrNull()?.results.orEmpty().map {
                    SearchSuggestion(it.name, null, it.lat, it.lng, null, isPlace = true)
                }
            } else {
                emptyList()
            }
            suggestions.value = (stationHits + placeHits).take(8)
        }
    }

    fun onSuggestionTap(suggestion: SearchSuggestion, uiScope: kotlinx.coroutines.CoroutineScope) {
        searchQuery.value = ""
        suggestions.value = emptyList()
        camera.animateTo(uiScope, LatLng(suggestion.lat, suggestion.lng), 13.0)
        graph.mainScope.launch {
            loadAround(LatLng(suggestion.lat, suggestion.lng))
            suggestion.station?.let { select(it) }
        }
        graph.haptics.tap()
    }

    // ---- Station selection / detail sheet -----------------------------------------------

    val selected = MutableStateFlow<Station?>(null)
    val selectedDetail = MutableStateFlow<gg.felo.tanken.model.StationDetail?>(null)
    val selectedHistory = MutableStateFlow<List<gg.felo.tanken.model.HistoryEntry>>(emptyList())

    fun select(station: Station) {
        selected.value = station
        selectedDetail.value = null
        selectedHistory.value = emptyList()
        graph.haptics.selection()
        graph.mainScope.launch {
            runCatching { graph.api.stationDetail(station.id) }
                .onSuccess { if (selected.value?.id == station.id) selectedDetail.value = it }
        }
        graph.mainScope.launch {
            val country = if (station.id.startsWith("at-")) gg.felo.tanken.model.Country.At else gg.felo.tanken.model.Country.De
            runCatching { graph.api.stationHistory(station.id, graph.state.fuel.value, country) }
                .onSuccess { if (selected.value?.id == station.id) selectedHistory.value = it.entries }
        }
    }

    fun closeDetail() {
        selected.value = null
        selectedDetail.value = null
        selectedHistory.value = emptyList()
    }

    suspend fun toggleFavourite(stationId: String) {
        if (graph.state.toggleFavourite(stationId)) graph.haptics.success()
    }
}

data class SearchSuggestion(
    val title: String,
    val subtitle: String?,
    val lat: Double,
    val lng: Double,
    val price: Double?,
    val isPlace: Boolean,
    val station: Station? = null,
)
