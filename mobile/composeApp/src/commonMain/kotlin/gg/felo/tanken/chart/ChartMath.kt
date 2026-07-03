package gg.felo.tanken.chart

import gg.felo.tanken.model.HistoryEntry
import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.isoDayNumber
import kotlinx.datetime.toLocalDateTime

/** One aggregated day of history (the PWA's `daily` buckets). */
data class DayBucket(
    val key: String,
    val label: String,
    val dayOfWeek: Int, // 0=Sunday like JS getDay()
    val minPrice: Double,
    val avgPrice: Double,
    val maxPrice: Double,
    val entries: List<HistoryEntry>,
)

/** One hour bucket for the drill-down / 24h chart. */
data class HourBucket(
    val hour: Int,
    val label: String,
    val price: Double,
)

private val zone = TimeZone.of("Europe/Berlin")

fun parseInstant(timestamp: String): Instant? = runCatching { Instant.parse(timestamp) }.getOrNull()

/** Groups entries per Berlin-local day, min/avg/max like the PWA's `dayMap`. */
fun bucketByDay(entries: List<HistoryEntry>): List<DayBucket> {
    val map = LinkedHashMap<String, MutableList<Pair<HistoryEntry, kotlinx.datetime.LocalDateTime>>>()
    entries.forEach { entry ->
        val instant = parseInstant(entry.timestamp) ?: return@forEach
        val local = instant.toLocalDateTime(zone)
        val key = "${local.year}-${local.monthNumber.toString().padStart(2, '0')}-${local.dayOfMonth.toString().padStart(2, '0')}"
        map.getOrPut(key) { mutableListOf() } += entry to local
    }
    return map.entries
        .sortedBy { it.key }
        .map { (key, list) ->
            val locals = list.first().second
            val mins = list.mapNotNull { it.first.minPrice }
            val avgs = list.mapNotNull { it.first.avgPrice }
            val maxs = list.mapNotNull { it.first.maxPrice }
            DayBucket(
                key = key,
                label = "${locals.dayOfMonth}.${locals.monthNumber}",
                dayOfWeek = locals.dayOfWeek.isoDayNumber % 7,
                minPrice = mins.minOrNull() ?: 0.0,
                avgPrice = if (avgs.isEmpty()) 0.0 else avgs.average(),
                maxPrice = maxs.maxOrNull() ?: 0.0,
                entries = list.map { it.first },
            )
        }
}

/** Hour buckets within one day's entries (min price per hour). */
fun bucketByHour(entries: List<HistoryEntry>): List<HourBucket> {
    val map = sortedMapOf<Int, MutableList<Double>>()
    entries.forEach { entry ->
        val instant = parseInstant(entry.timestamp) ?: return@forEach
        val local = instant.toLocalDateTime(zone)
        entry.minPrice?.let { map.getOrPut(local.hour) { mutableListOf() } += it }
    }
    return map.map { (hour, prices) ->
        HourBucket(hour, "$hour", prices.min())
    }
}

/** Cutoff filter: keep entries within the last [days] (0 = everything). */
fun filterDays(entries: List<HistoryEntry>, days: Int, nowMs: Long): List<HistoryEntry> {
    if (days <= 0) return entries
    val cutoff = nowMs - days.toLong() * 86_400_000L
    return entries.filter { (parseInstant(it.timestamp)?.toEpochMilliseconds() ?: 0) >= cutoff }
}

/** Average of avg_price over a trailing window [endDaysAgo, startDaysAgo). */
fun avgInRange(entries: List<HistoryEntry>, startDaysAgo: Int, endDaysAgo: Int, nowMs: Long): Double? {
    val startTs = nowMs - endDaysAgo.toLong() * 86_400_000L
    val endTs = nowMs - startDaysAgo.toLong() * 86_400_000L
    val vals = entries.mapNotNull { entry ->
        val ts = parseInstant(entry.timestamp)?.toEpochMilliseconds() ?: return@mapNotNull null
        if (ts in startTs until endTs) entry.avgPrice else null
    }
    return if (vals.isEmpty()) null else vals.average()
}

/** ~4 nice y-axis tick values covering [lo, hi]. */
fun niceTicks(lo: Double, hi: Double, count: Int = 4): List<Double> {
    if (hi <= lo) return listOf(lo)
    val rawStep = (hi - lo) / count
    val magnitude = kotlin.math.exp(kotlin.math.ln(10.0) * kotlin.math.floor(kotlin.math.log10(rawStep)))
    val candidates = listOf(1.0, 2.0, 2.5, 5.0, 10.0).map { it * magnitude }
    val step = candidates.first { it >= rawStep }
    val start = kotlin.math.ceil(lo / step) * step
    return generateSequence(start) { it + step }.takeWhile { it <= hi + 1e-9 }.toList()
}
