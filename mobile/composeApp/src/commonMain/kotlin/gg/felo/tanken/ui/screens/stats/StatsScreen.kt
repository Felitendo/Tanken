package gg.felo.tanken.ui.screens.stats

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.chart.ChartPoint
import gg.felo.tanken.chart.PriceLineChart
import gg.felo.tanken.chart.rankColors
import gg.felo.tanken.i18n.fmt
import gg.felo.tanken.model.Country
import gg.felo.tanken.model.HistoryStats
import gg.felo.tanken.ui.components.AppCard
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Chip
import gg.felo.tanken.ui.components.ChipRow
import gg.felo.tanken.ui.components.FlagAt
import gg.felo.tanken.ui.components.FlagDe
import gg.felo.tanken.ui.components.HeroCard
import gg.felo.tanken.ui.components.LocationPickerRow
import gg.felo.tanken.ui.components.PageHeader
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.screens.history.HistoryViewModel
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.formatPrice
import gg.felo.tanken.chart.parseInstant
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.roundToInt
import kotlin.time.Clock

/** Stats tab: hero with price-span bar, fact cards, best times, weekday tiles, hour chart, ranking. */
@Composable
fun StatsScreen(viewModel: HistoryViewModel) {
    val graph = LocalAppGraph.current
    val c = Theme.colors
    val strings = graph.state.stringsFlow.collectAsState().value
    val country by viewModel.country.collectAsState()
    val locations by viewModel.locations.collectAsState()
    val selectedLocation by viewModel.selectedLocation.collectAsState()
    val autoPicked by viewModel.autoPicked.collectAsState()
    val stats by viewModel.stats.collectAsState()

    LaunchedEffect(Unit) { viewModel.start() }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        PageHeader(strings.statsTitle, strings.statsDescription)

        Column(Modifier.padding(horizontal = Sp.s4)) {
            ChipRow {
                Chip(strings.countryDE, country == Country.De, { viewModel.setCountry(Country.De) }, leading = { FlagDe() })
                Chip(strings.countryAT, country == Country.At, { viewModel.setCountry(Country.At) }, leading = { FlagAt() })
            }
            if (country == Country.De) {
                Box(Modifier.padding(top = Sp.s2)) {
                    LocationPickerRow(
                        locations = locations,
                        selected = selectedLocation,
                        autoPicked = autoPicked,
                        strings = strings,
                        onSelect = { viewModel.setLocation(it) },
                    )
                }
            }

            val data = stats
            if (data?.overall == null) {
                Box(Modifier.fillMaxWidth().padding(Sp.s6), contentAlignment = Alignment.Center) {
                    Text(strings.noStats, style = TextStyle(fontSize = 14.sp, color = c.hint))
                }
            } else {
                StatsContent(data, strings)
            }
            Box(Modifier.size(Sp.s6))
        }
    }
}

@Composable
private fun StatsContent(stats: HistoryStats, strings: gg.felo.tanken.i18n.Strings) {
    val c = Theme.colors
    val overall = stats.overall!!
    val lo = overall.lowestEver ?: 0.0
    val hi = overall.highestEver ?: 0.0
    val avg = overall.avg ?: 0.0
    val avgFraction = ((avg - lo) / max(hi - lo, 0.0001)).coerceIn(0.0, 1.0)

    // Hero with price-span bar
    HeroCard(Modifier.padding(top = Sp.s3)) {
        Row {
            Column(Modifier.weight(1f)) {
                Text(
                    strings.avgPrice.uppercase(),
                    style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.6.sp),
                )
                Text(
                    formatPrice(avg),
                    style = TextStyle(fontSize = 44.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp),
                )
            }
            Box(
                Modifier.size(44.dp).clip(RoundedCornerShape(12.dp)).background(c.accent.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center,
            ) {
                AppIcon(AppIcons.Tag, tint = c.accent, size = 20.dp)
            }
        }
        // Period pill
        val periodText = remember(overall) {
            val nowMs = Clock.System.now().toEpochMilliseconds()
            val sinceMs = overall.since?.let { parseInstant(it)?.toEpochMilliseconds() }
            val untilMs = overall.until?.let { parseInstant(it)?.toEpochMilliseconds() } ?: nowMs
            if (sinceMs == null) {
                null
            } else {
                val days = max(1, ((untilMs - sinceMs) / 86_400_000L).toInt() + 1)
                when {
                    days < 2 -> strings.periodToday
                    days < 90 -> strings.periodLastDays.fmt("n" to "$days")
                    else -> strings.periodSince.fmt("date" to (overall.since?.take(10) ?: ""))
                }
            }
        }
        periodText?.let {
            Row(
                Modifier
                    .padding(top = Sp.s2)
                    .clip(RoundedCornerShape(999.dp))
                    .background(c.accent.copy(alpha = 0.15f))
                    .padding(horizontal = 10.dp, vertical = 5.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(5.dp),
            ) {
                AppIcon(AppIcons.CalendarSmall, tint = c.accent, size = 13.dp)
                Text(it, style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.accent))
            }
        }
        // Spread bar: green -> red gradient with a white marker at the average.
        if (hi > lo) {
            Box(Modifier.padding(top = Sp.s4).fillMaxWidth().height(6.dp)) {
                Box(
                    Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(999.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(Color(0xFF34C759), Color(0xFFB8B140), Color(0xFFFF9500), Color(0xFFFF3B30)),
                            ),
                        ),
                )
                androidx.compose.ui.layout.Layout(
                    content = {
                        Box(
                            Modifier
                                .size(16.dp)
                                .border(1.dp, Color.Black.copy(alpha = 0.15f), CircleShape)
                                .background(Color.White, CircleShape),
                        )
                    },
                ) { measurables, constraints ->
                    val placeable = measurables.first().measure(androidx.compose.ui.unit.Constraints())
                    layout(constraints.maxWidth, placeable.height) {
                        val x = ((constraints.maxWidth - placeable.width) * avgFraction).roundToInt()
                        placeable.place(x, -(placeable.height - 6.dp.roundToPx()) / 2)
                    }
                }
            }
            Row(Modifier.padding(top = Sp.s2).fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Text(formatPrice(lo), style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = c.good))
                Text(
                    strings.priceSpread,
                    modifier = Modifier.weight(1f),
                    style = TextStyle(
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = c.hint,
                        letterSpacing = 0.6.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    ),
                )
                Text(formatPrice(hi), style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = c.bad))
            }
        }
    }

    // Fact cards row
    Row(
        Modifier.padding(top = Sp.s2),
        horizontalArrangement = Arrangement.spacedBy(Sp.s2),
    ) {
        FactCard(strings.lowest, formatPrice(lo), c.good, AppIcons.TrendDown, Modifier.weight(1f))
        FactCard(strings.highest, formatPrice(hi), c.bad, AppIcons.TrendUp, Modifier.weight(1f))
        FactCard(strings.measurements, "${overall.entries}", c.accent, AppIcons.TabStats, Modifier.weight(1f))
    }

    // Best times
    val bestDay = stats.dayAvgs.firstOrNull()
    val worstDay = stats.dayAvgs.lastOrNull()
    val bestHour = stats.hourAvgs.firstOrNull()
    val worstHour = stats.hourAvgs.lastOrNull()
    SectionHeader(strings.bestTimes)
    Column(verticalArrangement = Arrangement.spacedBy(Sp.s2)) {
        BestTimeCard(
            icon = AppIcons.Calendar,
            label = strings.cheapestDay,
            value = bestDay?.let { strings.dayNames.getOrNull(it.day) ?: it.name } ?: "–",
            price = bestDay?.let { formatPrice(it.avg) } ?: "–",
            savings = if (bestDay != null && worstDay != null && worstDay.avg > bestDay.avg + 0.005) {
                "−${gg.felo.tanken.util.twoDecimals(worstDay.avg - bestDay.avg)}€ ${strings.vsWorst}"
            } else {
                null
            },
        )
        BestTimeCard(
            icon = AppIcons.Clock,
            label = strings.cheapestHour,
            value = bestHour?.let { "${it.hour}:00 ${strings.oclock}" } ?: "–",
            price = bestHour?.let { formatPrice(it.avg) } ?: "–",
            savings = if (bestHour != null && worstHour != null && worstHour.avg > bestHour.avg + 0.005) {
                "−${gg.felo.tanken.util.twoDecimals(worstHour.avg - bestHour.avg)}€ ${strings.vsWorst}"
            } else {
                null
            },
        )
    }

    // Weekday tiles Mon..Sun, colored by displayed price
    if (stats.dayAvgs.isNotEmpty()) {
        SectionHeader(strings.weekdays)
        val displayed = stats.dayAvgs.associateBy { it.day }
        val displayValues = stats.dayAvgs.map { (it.avg * 100).roundToInt() / 100.0 }
        val dayMin = displayValues.min()
        val dayMax = displayValues.max()
        val dayRange = max(dayMax - dayMin, 0.0001)
        val bestDayNum = stats.dayAvgs.firstOrNull()?.day
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            listOf(1, 2, 3, 4, 5, 6, 0).forEach { dayNum ->
                val day = displayed[dayNum]
                val abbr = strings.dayAbbr.getOrNull(dayNum) ?: ""
                if (day == null) {
                    WeekdayTile(abbr, "–", null, 0.0, false, Modifier.weight(1f))
                } else {
                    val displayValue = (day.avg * 100).roundToInt() / 100.0
                    val ratio = (displayValue - dayMin) / dayRange
                    WeekdayTile(
                        abbr = abbr,
                        price = gg.felo.tanken.util.twoDecimals(day.avg),
                        color = PriceColor.rank(ratio),
                        barFraction = ratio,
                        best = dayNum == bestDayNum,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
    }

    // Hour chart 0..23
    if (stats.hourAvgs.isNotEmpty()) {
        val graph = gg.felo.tanken.LocalAppGraph.current
        SectionHeader(strings.hourRanking)
        AppCard {
            val byHour = stats.hourAvgs.sortedBy { it.hour }
            val colors = rankColors(byHour.map { it.avg })
            val points = byHour.mapIndexed { i, hour ->
                ChartPoint("${hour.hour}:00", hour.avg, colors[i])
            }
            Box(Modifier.fillMaxWidth().height(180.dp)) {
                PriceLineChart(
                    points = points,
                    emphasizeLast = false,
                    onScrubTick = { graph.haptics.selection() },
                )
            }
        }
    }

    // Station ranking with medals
    if (stats.stationRanking.isNotEmpty()) {
        SectionHeader(strings.stationRanking)
        AppCard(padding = androidx.compose.foundation.layout.PaddingValues(vertical = 4.dp)) {
            val ranked = stats.stationRanking.take(10)
            val loRank = ranked.minOf { it.avg }
            val hiRank = ranked.maxOf { it.avg }
            val range = max(hiRank - loRank, 0.0001)
            ranked.forEachIndexed { i, station ->
                val color = PriceColor.rank((station.avg - loRank) / range)
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = Sp.s3, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        when (i) {
                            0 -> "🥇"
                            1 -> "🥈"
                            2 -> "🥉"
                            else -> "${i + 1}"
                        },
                        style = TextStyle(fontSize = if (i < 3) 16.sp else 13.sp, fontWeight = FontWeight.Bold, color = c.hint),
                        modifier = Modifier.size(width = 28.dp, height = 22.dp),
                    )
                    Text(
                        station.station,
                        modifier = Modifier.weight(1f).padding(end = Sp.s2),
                        style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Medium),
                        maxLines = 1,
                    )
                    Text(
                        "Ø ${formatPrice(station.avg)}",
                        style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Bold, color = color),
                    )
                }
                if (i != ranked.lastIndex) {
                    Box(Modifier.fillMaxWidth().height(0.5.dp).background(c.separator))
                }
            }
        }
    }
}

@Composable
private fun FactCard(label: String, value: String, color: Color, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier = Modifier) {
    val c = Theme.colors
    AppCard(modifier) {
        Box(
            Modifier.size(30.dp).clip(RoundedCornerShape(8.dp)).background(color.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center,
        ) {
            AppIcon(icon, tint = color, size = 15.dp)
        }
        Text(
            label.uppercase(),
            modifier = Modifier.padding(top = 6.dp),
            style = TextStyle(fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.4.sp),
            maxLines = 1,
        )
        Text(value, style = TextStyle(fontSize = 17.sp, fontWeight = FontWeight.Bold, color = color), maxLines = 1)
    }
}

@Composable
private fun BestTimeCard(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String, price: String, savings: String?) {
    val c = Theme.colors
    AppCard {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(
                Modifier.size(30.dp).clip(RoundedCornerShape(8.dp)).background(c.accent.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center,
            ) {
                AppIcon(icon, tint = c.accent, size = 15.dp)
            }
            Text(
                label.uppercase(),
                style = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.5.sp),
                maxLines = 1,
            )
        }
        Text(value, modifier = Modifier.padding(top = Sp.s2), style = TextStyle(fontSize = 24.sp, fontWeight = FontWeight.Bold))
        Text(price, style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = c.good))
        savings?.let {
            Box(
                Modifier
                    .padding(top = Sp.s2)
                    .clip(RoundedCornerShape(999.dp))
                    .background(c.good.copy(alpha = 0.15f))
                    .padding(horizontal = 10.dp, vertical = 5.dp),
            ) {
                Text("↓ $it", style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.good))
            }
        }
    }
}

@Composable
private fun WeekdayTile(
    abbr: String,
    price: String,
    color: Color?,
    barFraction: Double,
    best: Boolean,
    modifier: Modifier = Modifier,
) {
    val c = Theme.colors
    Column(
        modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (best && color != null) color.copy(alpha = 0.12f) else c.bgSecondary)
            .then(
                if (best && color != null) Modifier.border(1.dp, color.copy(alpha = 0.5f), RoundedCornerShape(10.dp)) else Modifier,
            )
            .padding(vertical = 8.dp, horizontal = 2.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(abbr, style = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = c.hint))
        Text(
            price,
            style = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.Bold, color = color ?: c.hint),
            maxLines = 1,
        )
        Box(
            Modifier
                .padding(top = 5.dp)
                .fillMaxWidth(0.8f)
                .height(3.dp)
                .clip(RoundedCornerShape(999.dp))
                .background(c.separator),
        ) {
            if (color != null) {
                Box(
                    Modifier
                        .fillMaxWidth(barFraction.toFloat().coerceIn(0.02f, 1f))
                        .height(3.dp)
                        .clip(RoundedCornerShape(999.dp))
                        .background(color),
                )
            }
        }
    }
}
