package gg.felo.tanken.state

import gg.felo.tanken.model.HistoryEntry
import gg.felo.tanken.model.HistoryExtremes
import gg.felo.tanken.model.HistoryStats
import gg.felo.tanken.net.ApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Backs both the History and Statistics tabs (they share the same country/location selection).
 * Loads `/api/history` (entries + extremes) and `/api/stats` together so switching country or
 * location refreshes both screens at once. Registered as a Koin singleton.
 */
class HistoryViewModel(private val api: ApiClient) {

    data class UiState(
        val country: String = "de",
        val location: String? = null,
        val locations: List<String> = emptyList(),
        val entries: List<HistoryEntry> = emptyList(),
        val extremes: HistoryExtremes? = null,
        val stats: HistoryStats? = null,
        val loading: Boolean = false,
        val error: Boolean = false,
    )

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state.asStateFlow()

    private var started = false
    private var loadJob: Job? = null

    fun start() {
        if (started) return
        started = true
        reloadLocations()
        load()
    }

    fun setCountry(country: String) {
        if (country == _state.value.country) return
        _state.update { it.copy(country = country, location = null) }
        reloadLocations()
        load()
    }

    fun setLocation(location: String?) {
        if (location == _state.value.location) return
        _state.update { it.copy(location = location) }
        load()
    }

    fun refresh() = load()

    private fun reloadLocations() {
        scope.launch {
            val country = _state.value.country
            val locs = runCatching { api.historyLocations(country).locations }.getOrDefault(emptyList())
            _state.update { it.copy(locations = locs) }
        }
    }

    private fun load() {
        loadJob?.cancel()
        loadJob = scope.launch {
            _state.update { it.copy(loading = true, error = false) }
            val country = _state.value.country
            val location = _state.value.location
            val history = runCatching { api.history(location, country) }.getOrNull()
            val stats = runCatching { api.stats(location, country) }.getOrNull()
            _state.update {
                it.copy(
                    entries = history?.entries ?: emptyList(),
                    extremes = history?.extremes,
                    stats = stats,
                    loading = false,
                    error = history == null && stats == null,
                )
            }
        }
    }
}
