package gg.felo.tanken.state

import gg.felo.tanken.data.StationRepository
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.Geolocation
import gg.felo.tanken.platform.LatLng
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/** A cancellable subscription handle, callable from Swift (manual Flow→callback bridge). */
class Cancellable(private val job: Job) {
    fun cancel() = job.cancel()
}

/**
 * Single source of truth for the Map tab, shared by the Android Compose map and the iOS native
 * MapKit view. It loads stations + the regional price band, tracks the selected station and the
 * user's location, and re-loads when the fuel type changes. Registered as a Koin singleton so the
 * native map and the (Compose) detail sheet observe the exact same state.
 */
class MapViewModel(
    private val repo: StationRepository,
    private val config: AppConfig,
    private val geo: Geolocation,
) {
    data class UiState(
        val stations: List<Station> = emptyList(),
        val band: PriceBand? = null,
        val selected: Station? = null,
        val loading: Boolean = false,
        val center: LatLng = GERMANY_CENTER,
        val userLocation: LatLng? = null,
        val fuel: FuelType = FuelType.DIESEL,
    )

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state.asStateFlow()

    private var loadJob: Job? = null
    private var started = false

    /** Kick off the first load (user location if available, else Germany centre). Idempotent. */
    fun start() {
        if (started) return
        started = true
        _state.update { it.copy(fuel = config.fuelType.value) }
        scope.launch {
            val here = runCatching { geo.current() }.getOrNull()
            if (here != null) {
                _state.update { it.copy(userLocation = here, center = here) }
                load(here.lat, here.lng)
            } else {
                load(GERMANY_CENTER.lat, GERMANY_CENTER.lng)
            }
        }
        // Reload whenever the fuel type changes elsewhere (Settings).
        scope.launch {
            config.fuelType.drop(1).collect { fuel ->
                _state.update { it.copy(fuel = fuel) }
                val c = _state.value.center
                load(c.lat, c.lng)
            }
        }
    }

    /** "Search here": load stations + price band around the given map centre. */
    fun searchHere(lat: Double, lng: Double) {
        _state.update { it.copy(center = LatLng(lat, lng)) }
        load(lat, lng)
    }

    private fun load(lat: Double, lng: Double) {
        loadJob?.cancel()
        loadJob = scope.launch {
            _state.update { it.copy(loading = true) }
            val fuel = config.fuelType.value
            val stations = runCatching { repo.nearby(lat, lng, fuel) }.getOrDefault(emptyList())
            val band = runCatching { repo.priceBand(fuel, lat, lng) }.getOrNull()
            _state.update { it.copy(stations = stations, band = band, loading = false) }
        }
    }

    fun select(station: Station?) {
        _state.update { it.copy(selected = station) }
    }

    fun selectById(id: String) {
        _state.update { st -> st.copy(selected = st.stations.firstOrNull { it.id == id }) }
    }

    /** Locate the user and recentre + reload there. Returns the location (or null). */
    fun locateUser(onResult: (LatLng?) -> Unit = {}) {
        scope.launch {
            val here = runCatching { geo.current() }.getOrNull()
            if (here != null) {
                _state.update { it.copy(userLocation = here, center = here) }
                load(here.lat, here.lng)
            }
            onResult(here)
        }
    }

    /** Manual Flow→callback bridge for SwiftUI. Emits the current state immediately, then updates. */
    fun observe(onState: (UiState) -> Unit): Cancellable {
        val job = scope.launch {
            state.collect { onState(it) }
        }
        return Cancellable(job)
    }

    companion object {
        val GERMANY_CENTER = LatLng(51.1657, 10.4515)
    }
}
