package gg.felo.tanken.ui.screens.map

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.chart.ChartPoint
import gg.felo.tanken.chart.PriceLineChart
import gg.felo.tanken.chart.bucketByDay
import gg.felo.tanken.chart.filterDays
import gg.felo.tanken.chart.parseInstant
import gg.felo.tanken.chart.rankColors
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.model.HistoryEntry
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.theme.Theme
import kotlin.time.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/** `.sheet-chart-section`: price history mini chart with a 24h/7d toggle. */
@Composable
fun StationSheetChart(history: List<HistoryEntry>, strings: Strings) {
    val c = Theme.colors
    var range by remember { mutableStateOf(7) }

    Column(Modifier.fillMaxWidth().padding(top = 4.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                strings.priceHistory,
                modifier = Modifier.weight(1f),
                style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold),
            )
            Row(
                Modifier.clip(RoundedCornerShape(8.dp)).background(c.bgSecondary).padding(2.dp),
            ) {
                SheetToggle(strings.sheet24h, range == 1) { range = 1 }
                SheetToggle(strings.sheet7d, range == 7) { range = 7 }
            }
        }

        val nowMs = remember(history) { Clock.System.now().toEpochMilliseconds() }
        val points = remember(history, range) {
            if (range == 7) {
                val buckets = bucketByDay(filterDays(history, 7, nowMs))
                val colors = rankColors(buckets.map { it.minPrice })
                buckets.mapIndexed { i, day -> ChartPoint(day.label, day.minPrice, colors[i]) }
            } else {
                val zone = TimeZone.of("Europe/Berlin")
                val recent = filterDays(history, 1, nowMs).mapNotNull { entry ->
                    val price = entry.minPrice ?: return@mapNotNull null
                    val instant = parseInstant(entry.timestamp) ?: return@mapNotNull null
                    val local = instant.toLocalDateTime(zone)
                    Triple(instant.toEpochMilliseconds(), "${local.hour}", price)
                }.sortedBy { it.first }
                val colors = rankColors(recent.map { it.third })
                recent.mapIndexed { i, (_, label, price) -> ChartPoint(label, price, colors[i]) }
            }
        }

        Box(Modifier.fillMaxWidth().height(150.dp).padding(top = 6.dp), contentAlignment = Alignment.Center) {
            if (points.isEmpty()) {
                Text(
                    if (range == 1) strings.noRecent24h else strings.noHistory,
                    style = TextStyle(fontSize = 12.sp, color = c.hint),
                )
            } else {
                val graph = gg.felo.tanken.LocalAppGraph.current
                PriceLineChart(
                    points = points,
                    emphasizeLast = false,
                    onScrubTick = { graph.haptics.selection() },
                )
            }
        }
    }
}

@Composable
private fun SheetToggle(label: String, active: Boolean, onTap: () -> Unit) {
    val c = Theme.colors
    Box(
        Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(if (active) c.accent else androidx.compose.ui.graphics.Color.Transparent)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            )
            .padding(horizontal = 10.dp, vertical = 4.dp),
    ) {
        Text(
            label,
            style = TextStyle(
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (active) c.accentText else c.hint,
            ),
        )
    }
}
