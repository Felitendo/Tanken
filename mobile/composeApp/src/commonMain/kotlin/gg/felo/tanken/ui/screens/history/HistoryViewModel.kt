package gg.felo.tanken.ui.screens.history

import gg.felo.tanken.AppGraph
import gg.felo.tanken.chart.DayBucket
import gg.felo.tanken.chart.avgInRange
import gg.felo.tanken.chart.bucketByDay
import gg.felo.tanken.chart.parseInstant
import gg.felo.tanken.map.Projection
import gg.felo.tanken.model.Country
import gg.felo.tanken.model.HistoryEntry
import gg.felo.tanken.model.HistoryExtremes
import gg.felo.tanken.model.ScanLocation
import gg.felo.tanken.platform.LatLng
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlin.time.Clock

/**
 * Shared state for Verlauf + Stats: country, scan-location picker with
 * auto-nearest, raw history entries and the derived hero/summary numbers.
 * The location selection is shared between both tabs like the PWA's synced
 * pickers.
 */
class HistoryViewModel(private val graph: AppGraph) {

    val country = MutableStateFlow(Country.De)
    val locations = MutableStateFlow<List<ScanLocation>>(emptyList())
    val selectedLocation = MutableStateFlow<ScanLocation?>(null)
    val autoPicked = MutableStateFlow(false)
    val entries = MutableStateFlow<List<HistoryEntry>>(emptyList())
    val extremes = MutableStateFlow<HistoryExtremes?>(null)
    val rangeDays = MutableStateFlow(graph.state.historyDefaultDays.value)
    val loading = MutableStateFlow(false)
    val drillDay = MutableStateFlow<DayBucket?>(null)

    private var started = false

    suspend fun start() {
        if (!started) {
            started = true
            rangeDays.value = graph.state.historyDefaultDays.value
            loadLocations()
        }
        if (entries.value.isEmpty()) reload()
    }

    private suspend fun loadLocations() {
        val withHistory = runCatching { graph.api.historyLocations() }.getOrNull()?.locations.orEmpty().toSet()
        val scanLocations = runCatching { graph.api.scanLocations() }.getOrNull()?.locations.orEmpty()
        val available = scanLocations.filter { it.id in withHistory }
        locations.value = available
        // Auto-pick the nearest location like the PWA's CoreLocation pick.
        if (selectedLocation.value == null && available.isNotEmpty()) {
            val user = graph.geolocation.current()
            if (user != null) {
                val nearest = available.minByOrNull { Projection.distanceKm(user, LatLng(it.lat, it.lng)) }
                if (nearest != null) {
                    selectedLocation.value = nearest
                    autoPicked.value = true
                }
            }
        }
    }

    suspend fun reload() {
        loading.value = true
        try {
            val location = if (country.value == Country.De) selectedLocation.value?.id else null
            runCatching { graph.api.history(country.value, location) }
                .onSuccess {
                    entries.value = it.entries
                    extremes.value = it.extremes
                }
        } finally {
            loading.value = false
        }
    }

    fun setCountry(value: Country) {
        if (country.value == value) return
        country.value = value
        drillDay.value = null
        graph.haptics.selection()
        graph.mainScope.launch { reload() }
    }

    fun setLocation(location: ScanLocation?) {
        selectedLocation.value = location
        autoPicked.value = false
        drillDay.value = null
        graph.haptics.selection()
        graph.mainScope.launch { reload() }
    }

    fun setRange(days: Int) {
        rangeDays.value = days
        drillDay.value = null
        graph.haptics.selection()
    }

    // ---- Derived hero numbers (PWA renderHistoryStats) ---------------------------------

    data class Hero(
        val currentAvg: Double?,
        val periodLabel: PeriodLabel,
        val deltaWeek: Double?,
        val deltaMonth: Double?,
    )

    sealed interface PeriodLabel {
        data object Today : PeriodLabel
        data class LastDays(val days: Int) : PeriodLabel
        data class Since(val isoDate: String) : PeriodLabel
    }

    fun hero(data: List<HistoryEntry>): Hero? {
        if (data.isEmpty()) return null
        val nowMs = Clock.System.now().toEpochMilliseconds()
        val sorted = data.sortedByDescending { parseInstant(it.timestamp)?.toEpochMilliseconds() ?: 0 }
        val currentAvg = sorted.firstOrNull()?.avgPrice
        val week = avgInRange(data, 0, 7, nowMs)
        val prevWeek = avgInRange(data, 7, 14, nowMs)
        val month = avgInRange(data, 0, 30, nowMs)
        val prevMonth = avgInRange(data, 30, 60, nowMs)
        val tsList = data.mapNotNull { parseInstant(it.timestamp)?.toEpochMilliseconds() }
        val since = tsList.minOrNull() ?: nowMs
        val days = kotlin.math.max(1, ((nowMs - since) / 86_400_000L).toInt() + 1)
        val period = when {
            days < 2 -> PeriodLabel.Today
            days < 90 -> PeriodLabel.LastDays(days)
            else -> PeriodLabel.Since(sorted.lastOrNull()?.timestamp?.take(10) ?: "")
        }
        return Hero(
            currentAvg = currentAvg,
            periodLabel = period,
            deltaWeek = if (week != null && prevWeek != null) week - prevWeek else null,
            deltaMonth = if (month != null && prevMonth != null) month - prevMonth else null,
        )
    }

    fun dayBuckets(data: List<HistoryEntry>, days: Int, nowMs: Long): List<DayBucket> =
        bucketByDay(gg.felo.tanken.chart.filterDays(data, days, nowMs))
}
