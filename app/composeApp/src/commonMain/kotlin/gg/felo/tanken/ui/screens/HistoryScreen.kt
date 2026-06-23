package gg.felo.tanken.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.LocalStrings
import gg.felo.tanken.model.PriceExtreme
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.state.HistoryViewModel
import gg.felo.tanken.ui.components.Card
import gg.felo.tanken.ui.components.LineChart
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.util.formatPrice
import org.koin.compose.koinInject

/** Preisverlauf: country selector, current-average hero, trend line, and price extremes. */
@Composable
fun HistoryScreen() {
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
        Text(s.historyTitle, color = colors.textPrimary, style = MaterialTheme.typography.headlineLarge)

        SegmentedControl(
            options = listOf(s.countryDe, s.countryAt),
            selectedIndex = if (state.country == "at") 1 else 0,
            onSelect = {
                haptics.selection()
                vm.setCountry(if (it == 1) "at" else "de")
            },
        )

        val entries = state.entries
        when {
            state.loading && entries.isEmpty() -> LoadingBox()
            entries.isEmpty() -> Card { Text(s.noHistory, color = colors.textHint) }
            else -> {
                val avgNow = entries.last().avgPrice
                val periodMin = entries.minOf { it.minPrice }
                val periodMax = entries.maxOf { it.maxPrice }

                // Hero: current average
                Card {
                    Column(verticalArrangement = Arrangement.spacedBy(Spacing.xs)) {
                        Text(s.currentAverage, color = colors.textHint, fontSize = 13.sp)
                        Row(verticalAlignment = Alignment.Top) {
                            Text(
                                formatPrice(avgNow),
                                color = colors.textPrimary,
                                fontSize = 40.sp,
                                fontWeight = FontWeight.ExtraBold,
                            )
                            Text(
                                " €/L",
                                color = colors.textHint,
                                fontSize = 14.sp,
                                modifier = Modifier.padding(top = 12.dp),
                            )
                        }
                        Text(
                            "${s.periodLabel}: ${formatPrice(periodMin)} – ${formatPrice(periodMax)} €",
                            color = colors.textHint,
                            fontSize = 13.sp,
                        )
                    }
                }

                // Trend chart
                Column {
                    SectionHeader(s.trendAverage)
                    Card {
                        LineChart(values = entries.map { it.avgPrice })
                        Row(
                            Modifier.fillMaxWidth().padding(top = Spacing.s),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Text("${formatPrice(periodMin)} €", color = colors.good, fontSize = 12.sp)
                            Text("${entries.size} ${s.pointsLabel}", color = colors.textHint, fontSize = 12.sp)
                            Text("${formatPrice(periodMax)} €", color = colors.bad, fontSize = 12.sp)
                        }
                    }
                }

                // Extremes
                val ex = state.extremes
                if (ex?.cheapest != null || ex?.mostExpensive != null) {
                    Column {
                        SectionHeader(s.extremes)
                        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.m)) {
                            ex?.cheapest?.let { ExtremeCard(s.cheapest, it, colors.good, Modifier.weight(1f)) }
                            ex?.mostExpensive?.let { ExtremeCard(s.mostExpensive, it, colors.bad, Modifier.weight(1f)) }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ExtremeCard(label: String, extreme: PriceExtreme, accent: androidx.compose.ui.graphics.Color, modifier: Modifier = Modifier) {
    val colors = TankenTheme.colors
    Card(modifier) {
        Column(verticalArrangement = Arrangement.spacedBy(Spacing.xs)) {
            Text(label.uppercase(), color = colors.textHint, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
            Text(formatPrice(extreme.price) + " €", color = accent, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Text(
                extreme.stationBrand?.takeIf { it.isNotBlank() } ?: extreme.stationName,
                color = colors.textPrimary,
                fontSize = 13.sp,
                maxLines = 2,
            )
        }
    }
}

@Composable
private fun LoadingBox() {
    Box(Modifier.fillMaxWidth().padding(Spacing.huge), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(color = TankenTheme.colors.accent)
    }
}
