package gg.felo.tanken.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.LocalStrings
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.state.HistoryViewModel
import gg.felo.tanken.ui.components.BarFill
import gg.felo.tanken.ui.components.Card
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.util.formatPrice3
import org.koin.compose.koinInject

/** Statistik: overall hero, weekday averages, cheapest hour and the station ranking. */
@Composable
fun StatsScreen() {
    val vm = koinInject<HistoryViewModel>()
    val haptics = koinInject<Haptics>()
    val state by vm.state.collectAsState()
    val colors = TankenTheme.colors
    val s = LocalStrings.current

    LaunchedEffect(Unit) { vm.start() }

    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(Spacing.l),
        verticalArrangement = Arrangement.spacedBy(Spacing.l),
    ) {
        Text(s.statsTitle, color = colors.textPrimary, style = MaterialTheme.typography.headlineLarge)

        SegmentedControl(
            options = listOf(s.countryDe, s.countryAt),
            selectedIndex = if (state.country == "at") 1 else 0,
            onSelect = {
                haptics.selection()
                vm.setCountry(if (it == 1) "at" else "de")
            },
        )

        val stats = state.stats
        when {
            state.loading && stats == null -> LoadingBox()
            stats == null || stats.overall.entries == 0 -> Card { Text(s.noStats, color = colors.textHint) }
            else -> {
                // Overall hero
                Card {
                    Column(verticalArrangement = Arrangement.spacedBy(Spacing.s)) {
                        Text(s.average30d, color = colors.textHint, fontSize = 13.sp)
                        Row(verticalAlignment = Alignment.Top) {
                            Text(formatPrice3(stats.overall.avg), color = colors.textPrimary, fontSize = 40.sp, fontWeight = FontWeight.ExtraBold)
                            Text(" €/L", color = colors.textHint, fontSize = 14.sp, modifier = Modifier.padding(top = 12.dp))
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.l)) {
                            MiniStat(s.lowest, stats.overall.lowestEver, colors.good)
                            MiniStat(s.highest, stats.overall.highestEver, colors.bad)
                        }
                    }
                }

                // Weekday averages (Mon → Sun)
                if (stats.dayAvgs.isNotEmpty()) {
                    val byDay = stats.dayAvgs.associateBy { it.day }
                    val order = listOf(1, 2, 3, 4, 5, 6, 0)
                    val days = order.mapNotNull { byDay[it] }.filter { it.count > 0 }
                    if (days.isNotEmpty()) {
                        val minAvg = days.minOf { it.avg }
                        val maxAvg = days.maxOf { it.avg }
                        val span = (maxAvg - minAvg).takeIf { it > 1e-6 } ?: 1.0
                        Column {
                            SectionHeader(s.weekdays)
                            Card {
                                Column(verticalArrangement = Arrangement.spacedBy(Spacing.s)) {
                                    days.forEach { d ->
                                        val cheapFraction = ((maxAvg - d.avg) / span).toFloat() // cheaper = fuller
                                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Spacing.m)) {
                                            Text(d.name.take(2), color = colors.textPrimary, fontSize = 13.sp, modifier = Modifier.width(28.dp))
                                            Box(Modifier.weight(1f)) {
                                                BarFill(fraction = 0.15f + 0.85f * cheapFraction, color = colors.good)
                                            }
                                            Text("${formatPrice3(d.avg)} €", color = colors.textHint, fontSize = 12.sp, modifier = Modifier.width(64.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Cheapest hour
                stats.hourAvgs.filter { it.count > 0 }.minByOrNull { it.avg }?.let { best ->
                    Card {
                        Column(verticalArrangement = Arrangement.spacedBy(Spacing.xs)) {
                            Text(s.cheapestTime, color = colors.textHint, fontSize = 13.sp)
                            Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(Spacing.s)) {
                                Text("${best.hour}:00${s.clockSuffix}", color = colors.accent, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                                Text("Ø ${formatPrice3(best.avg)} €", color = colors.textHint, fontSize = 13.sp, modifier = Modifier.padding(bottom = 3.dp))
                            }
                        }
                    }
                }

                // Station ranking
                val ranking = stats.stationRanking.filter { it.count > 0 }.sortedBy { it.avg }.take(10)
                if (ranking.isNotEmpty()) {
                    Column {
                        SectionHeader(s.cheapestStations)
                        Card {
                            Column(verticalArrangement = Arrangement.spacedBy(Spacing.m)) {
                                ranking.forEachIndexed { index, s ->
                                    val frac = if (ranking.size <= 1) 0.0 else index.toDouble() / (ranking.size - 1)
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Spacing.m)) {
                                        Box(
                                            Modifier.size(24.dp).clip(CircleShape).background(PriceColor.ofRatio(frac)),
                                            contentAlignment = Alignment.Center,
                                        ) { Text("${index + 1}", color = androidx.compose.ui.graphics.Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                                        Column(Modifier.weight(1f)) {
                                            Text(s.station, color = colors.textPrimary, fontSize = 14.sp, maxLines = 1)
                                            if (!s.brand.isNullOrBlank()) Text(s.brand!!, color = colors.textHint, fontSize = 11.sp)
                                        }
                                        Text("${formatPrice3(s.avg)} €", color = colors.textPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MiniStat(label: String, value: Double, accent: androidx.compose.ui.graphics.Color) {
    val colors = TankenTheme.colors
    Column {
        Text(label, color = colors.textHint, fontSize = 11.sp)
        Text("${formatPrice3(value)} €", color = accent, fontSize = 17.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun LoadingBox() {
    Box(Modifier.fillMaxWidth().padding(Spacing.huge), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(color = TankenTheme.colors.accent)
    }
}
