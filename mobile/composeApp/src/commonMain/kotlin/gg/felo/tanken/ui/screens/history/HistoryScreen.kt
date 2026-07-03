package gg.felo.tanken.ui.screens.history

import androidx.compose.foundation.background
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.chart.ChartPoint
import gg.felo.tanken.chart.PriceLineChart
import gg.felo.tanken.chart.bucketByHour
import gg.felo.tanken.chart.rankColors
import gg.felo.tanken.i18n.fmt
import gg.felo.tanken.model.Country
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
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.formatDelta
import gg.felo.tanken.util.formatPrice
import kotlin.time.Clock

/** Verlauf tab: hero, range chips, price-colored day chart, hour drill-down, extremes. */
@Composable
fun HistoryScreen(viewModel: HistoryViewModel) {
    val graph = LocalAppGraph.current
    val c = Theme.colors
    val strings = graph.state.stringsFlow.collectAsState().value
    val country by viewModel.country.collectAsState()
    val locations by viewModel.locations.collectAsState()
    val selectedLocation by viewModel.selectedLocation.collectAsState()
    val autoPicked by viewModel.autoPicked.collectAsState()
    val entries by viewModel.entries.collectAsState()
    val extremes by viewModel.extremes.collectAsState()
    val rangeDays by viewModel.rangeDays.collectAsState()
    val drillDay by viewModel.drillDay.collectAsState()

    LaunchedEffect(Unit) { viewModel.start() }

    val nowMs = remember(entries) { Clock.System.now().toEpochMilliseconds() }
    val buckets = remember(entries, rangeDays) { viewModel.dayBuckets(entries, rangeDays, nowMs) }
    val hero = remember(entries) { viewModel.hero(entries) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        PageHeader(strings.historyTitle, strings.historyDescription)

        Column(Modifier.padding(horizontal = Sp.s4)) {
            // Country chips
            ChipRow {
                Chip(strings.countryDE, country == Country.De, { viewModel.setCountry(Country.De) }, leading = { FlagDe() })
                Chip(strings.countryAT, country == Country.At, { viewModel.setCountry(Country.At) }, leading = { FlagAt() })
            }

            // Location picker (DE only, like the PWA)
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

            SectionHeader(strings.timePeriod)
            ChipRow {
                Chip(strings.days7, rangeDays == 7, { viewModel.setRange(7) })
                Chip(strings.days14, rangeDays == 14, { viewModel.setRange(14) })
                Chip(strings.days30, rangeDays == 30, { viewModel.setRange(30) })
                Chip(strings.all, rangeDays == 0, { viewModel.setRange(0) })
            }

            // Hero card
            if (hero != null) {
                HeroCard(Modifier.padding(top = Sp.s3)) {
                    Row {
                        Column(Modifier.weight(1f)) {
                            Text(
                                strings.currentAvg.uppercase(),
                                style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.6.sp),
                            )
                            Text(
                                hero.currentAvg?.let { formatPrice(it) } ?: "–",
                                style = TextStyle(fontSize = 44.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp),
                            )
                        }
                        val trendUp = (hero.deltaWeek ?: 0.0) > 0.005
                        Box(
                            Modifier.size(44.dp).clip(RoundedCornerShape(12.dp))
                                .background((if (trendUp) c.bad else c.good).copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            AppIcon(
                                if (trendUp) AppIcons.TrendUp else AppIcons.TrendDown,
                                tint = if (trendUp) c.bad else c.good,
                                size = 20.dp,
                            )
                        }
                    }
                    Row(
                        Modifier.padding(top = Sp.s2),
                        horizontalArrangement = Arrangement.spacedBy(Sp.s2),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        val periodText = when (val period = hero.periodLabel) {
                            is HistoryViewModel.PeriodLabel.Today -> strings.periodToday
                            is HistoryViewModel.PeriodLabel.LastDays -> strings.periodLastDays.fmt("n" to "${period.days}")
                            is HistoryViewModel.PeriodLabel.Since -> strings.periodSince.fmt("date" to period.isoDate)
                        }
                        Pill(text = periodText, color = c.accent, icon = AppIcons.CalendarSmall)
                        hero.deltaWeek?.let { delta ->
                            val deltaColor = when {
                                kotlin.math.abs(delta) < 0.005 -> c.hint
                                delta < 0 -> c.good
                                else -> c.bad
                            }
                            val arrow = when {
                                kotlin.math.abs(delta) < 0.005 -> "→"
                                delta < 0 -> "↓"
                                else -> "↑"
                            }
                            Pill(text = "$arrow ${formatDelta(delta)} ${strings.vsLastWeek}", color = deltaColor)
                        }
                    }
                }
            }

            // Chart card
            AppCard(Modifier.padding(top = Sp.s3)) {
                if (buckets.isEmpty()) {
                    Box(Modifier.fillMaxWidth().height(120.dp), contentAlignment = Alignment.Center) {
                        Text(strings.noHistory, style = TextStyle(fontSize = 13.sp, color = c.hint))
                    }
                } else {
                    val colors = rankColors(buckets.map { it.minPrice })
                    val points = buckets.mapIndexed { i, day ->
                        ChartPoint(day.label, day.minPrice, colors[i])
                    }
                    Box(Modifier.fillMaxWidth().height(230.dp)) {
                        PriceLineChart(
                            points = points,
                            onPointTap = { idx ->
                                if (buckets[idx].entries.size > 1) {
                                    graph.haptics.selection()
                                    viewModel.drillDay.value = buckets[idx]
                                }
                            },
                        )
                    }
                    Text(
                        strings.tapForHours,
                        modifier = Modifier.padding(top = 6.dp).fillMaxWidth(),
                        style = TextStyle(
                            fontSize = 11.sp,
                            color = c.hint,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        ),
                    )
                }
            }

            // Hour drill-down
            drillDay?.let { day ->
                SectionHeader("${strings.historyHourTitle} · ${day.label}")
                AppCard {
                    val hours = remember(day) { bucketByHour(day.entries) }
                    if (hours.isEmpty()) {
                        Box(Modifier.fillMaxWidth().height(80.dp), contentAlignment = Alignment.Center) {
                            Text(strings.noRecent24h, style = TextStyle(fontSize = 13.sp, color = c.hint))
                        }
                    } else {
                        val hourColors = rankColors(hours.map { it.price })
                        val hourPoints = hours.mapIndexed { i, hour ->
                            ChartPoint("${hour.hour}", hour.price, hourColors[i])
                        }
                        Box(Modifier.fillMaxWidth().height(180.dp)) {
                            PriceLineChart(points = hourPoints, emphasizeLast = false)
                        }
                    }
                }
            }

            // Extremes (ZUSAMMENFASSUNG)
            SectionHeader(strings.summary)
            Row(
                Modifier.padding(bottom = Sp.s6),
                horizontalArrangement = Arrangement.spacedBy(Sp.s2),
            ) {
                ExtremeCard(
                    label = strings.lowestPrice,
                    price = extremes?.cheapest?.price,
                    station = extremes?.cheapest?.stationName,
                    accent = c.good,
                    icon = AppIcons.TrendDown,
                    modifier = Modifier.weight(1f),
                )
                ExtremeCard(
                    label = strings.highestPrice,
                    price = extremes?.mostExpensive?.price,
                    station = extremes?.mostExpensive?.stationName,
                    accent = c.bad,
                    icon = AppIcons.TrendUp,
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}

@Composable
private fun Pill(text: String, color: androidx.compose.ui.graphics.Color, icon: androidx.compose.ui.graphics.vector.ImageVector? = null) {
    Row(
        Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(color.copy(alpha = 0.15f))
            .padding(horizontal = 10.dp, vertical = 5.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp),
    ) {
        if (icon != null) AppIcon(icon, tint = color, size = 13.dp)
        Text(text, style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = color), maxLines = 1)
    }
}

/** `.history-extreme-card`: icon chip + label + value + station name. */
@Composable
private fun ExtremeCard(
    label: String,
    price: Double?,
    station: String?,
    accent: androidx.compose.ui.graphics.Color,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
) {
    val c = Theme.colors
    AppCard(modifier) {
        Box(
            Modifier.size(32.dp).clip(RoundedCornerShape(9.dp)).background(accent.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center,
        ) {
            AppIcon(icon, tint = accent, size = 16.dp)
        }
        Text(
            label,
            modifier = Modifier.padding(top = Sp.s2),
            style = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.4.sp),
            maxLines = 1,
        )
        Text(
            price?.let { formatPrice(it) } ?: "–",
            style = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.Bold, color = accent),
        )
        Text(
            station ?: "–",
            style = TextStyle(fontSize = 12.sp, color = c.hint),
            maxLines = 1,
        )
    }
}
