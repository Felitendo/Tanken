package gg.felo.tanken.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.model.Country
import gg.felo.tanken.ui.components.AppCard
import gg.felo.tanken.ui.components.PageHeader
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme

/** Debug screen: exercises every public endpoint against the live server. */
@Composable
fun SmokeScreen() {
    val graph = LocalAppGraph.current
    var lines by remember { mutableStateOf(listOf("Running API smoke against ${graph.state.baseUrl.value} ...")) }

    LaunchedEffect(Unit) {
        val api = graph.api
        val fuel = graph.state.fuel.value
        val results = mutableListOf<String>()
        suspend fun check(name: String, block: suspend () -> String) {
            results += runCatching { "OK  $name: ${block()}" }
                .getOrElse { "ERR $name: ${it.message?.take(80)}" }
            lines = results.toList()
        }
        check("config") { "smtp=${api.config().smtpConfigured}" }
        check("stations") { "${api.stations(52.52, 13.405, fuel).size} stations" }
        check("bounds") { "${api.stationsInBounds(52.3, 13.1, 52.7, 13.7, fuel).size} in viewport" }
        check("price-band") { api.priceBand(fuel, 52.52, 13.405).band?.let { "p10=${it.p10} p90=${it.p90} n=${it.samples}" } ?: "no band" }
        check("search") { "${api.searchStations("shell", fuel).size} hits" }
        check("history de") { "${api.history(Country.De).entries.size} entries" }
        check("history locations") { "${api.historyLocations().locations.size} ids" }
        check("stats de") { "${api.stats(Country.De).dayAvgs.size} day avgs" }
        check("scan-locations") { "${api.scanLocations().locations.size} locations" }
        check("manual-scans") { "${api.manualScans(fuel).scans.size} scans" }
        check("me") { "auth=${api.me().authenticated}" }
        check("station detail") {
            val first = api.stations(52.52, 13.405, fuel).firstOrNull() ?: return@check "no station"
            val d = api.stationDetail(first.id)
            "diesel=${d.diesel} open=${d.isOpen}"
        }
        results += "DONE"
        lines = results.toList()
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        PageHeader("API Smoke", graph.state.baseUrl.value)
        Column(Modifier.padding(horizontal = Sp.s4)) {
            AppCard {
                lines.forEach { line ->
                    Text(
                        line,
                        style = TextStyle(
                            fontSize = 12.sp,
                            color = when {
                                line.startsWith("ERR") -> Theme.colors.bad
                                line.startsWith("OK") -> Theme.colors.good
                                else -> Theme.colors.text
                            },
                        ),
                        maxLines = 2,
                    )
                }
            }
        }
    }
}
