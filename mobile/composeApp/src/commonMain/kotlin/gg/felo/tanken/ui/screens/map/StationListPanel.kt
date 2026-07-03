package gg.felo.tanken.ui.screens.map

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.state.StationSort
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.formatKm
import gg.felo.tanken.util.twoDecimals

/**
 * Sorting/grouping pipeline ported from the PWA's `renderStationList`:
 * open+priced only, optional price-dedupe keeping the closest, price or
 * distance sort, favourites pinned, capped at 50.
 */
fun curateStations(
    stations: List<Station>,
    sort: StationSort,
    groupByPrice: Boolean,
    favouritesOnTop: Boolean,
    favourites: Set<String>,
): List<Station> {
    var open = stations.filter { it.isOpen && it.price != null }
    if (groupByPrice) {
        val seen = mutableSetOf<String>()
        open = open
            .sortedWith(compareBy({ it.price }, { it.dist ?: 999.0 }))
            .filter { seen.add(it.price!!.toString().take(6)) }
    }
    open = when (sort) {
        StationSort.Distance -> open.sortedBy { it.dist ?: 999.0 }
        StationSort.Price -> open.sortedWith(compareBy({ it.price }, { it.dist ?: 999.0 }))
    }
    if (favouritesOnTop) {
        open = open.sortedBy { if (it.id in favourites) 0 else 1 }
    }
    return open.take(50)
}

/** `.desktop-station-panel`: sort bar + station rows below the map. */
@Composable
fun StationListPanel(
    stations: List<Station>,
    band: PriceBand?,
    sort: StationSort,
    groupByPrice: Boolean,
    favouritesOnTop: Boolean,
    favourites: Set<String>,
    loggedIn: Boolean,
    strings: Strings,
    onToggleSort: () -> Unit,
    onToggleGroup: () -> Unit,
    onToggleFavsOnTop: () -> Unit,
    onStationTap: (Station) -> Unit,
    modifier: Modifier = Modifier,
) {
    val c = Theme.colors
    val curated = remember(stations, sort, groupByPrice, favouritesOnTop, favourites) {
        curateStations(stations, sort, groupByPrice, favouritesOnTop, favourites)
    }

    Column(modifier.fillMaxSize().background(c.bg)) {
        // `.station-sort-bar`
        Row(
            Modifier.fillMaxWidth().padding(start = Sp.s4, end = Sp.s4, top = Sp.s4, bottom = Sp.s2),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            SortBarIcon(AppIcons.Star, active = favouritesOnTop, onTap = onToggleFavsOnTop)
            Box(Modifier.size(8.dp))
            SortBarIcon(AppIcons.Layers, active = groupByPrice, onTap = onToggleGroup)
            Text(
                "${curated.size} ${strings.stationsFound}".uppercase(),
                modifier = Modifier.weight(1f),
                style = TextStyle(
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = c.hint,
                    letterSpacing = 0.8.sp,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                ),
                maxLines = 1,
            )
            // `.station-sort-btn`
            Row(
                Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(c.bgSecondary)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onToggleSort,
                    )
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                AppIcon(AppIcons.Sort, tint = c.accent, size = 14.dp)
                Text(
                    if (sort == StationSort.Price) strings.sortPrice else strings.sortDistance,
                    style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.SemiBold),
                )
            }
        }

        if (curated.isEmpty()) {
            Box(Modifier.fillMaxWidth().padding(Sp.s6), contentAlignment = Alignment.Center) {
                Text(strings.noStationsYet, style = TextStyle(fontSize = 14.sp, color = c.hint))
            }
        } else {
            // `.station-list` card
            LazyColumn(
                Modifier
                    .fillMaxSize()
                    .padding(horizontal = Sp.s4)
                    .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                    .background(c.bgSecondary),
            ) {
                items(curated, key = { it.id }) { station ->
                    StationRow(
                        station = station,
                        rank = curated.indexOf(station) + 1,
                        band = band,
                        favourite = loggedIn && station.id in favourites,
                        onTap = { onStationTap(station) },
                    )
                    Box(Modifier.fillMaxWidth().height(0.5.dp).background(c.separator))
                }
            }
        }
    }
}

@Composable
private fun SortBarIcon(icon: androidx.compose.ui.graphics.vector.ImageVector, active: Boolean, onTap: () -> Unit) {
    val c = Theme.colors
    Box(
        Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (active) c.accent else c.bgSecondary)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            )
            .padding(7.dp),
        contentAlignment = Alignment.Center,
    ) {
        AppIcon(icon, tint = if (active) c.accentText else c.hint, size = 18.dp)
    }
}

/** `.station-row`: rank badge, name/address, price + distance. */
@Composable
fun StationRow(
    station: Station,
    rank: Int,
    band: PriceBand?,
    favourite: Boolean,
    onTap: () -> Unit,
) {
    val c = Theme.colors
    val color = PriceColor.forPrice(station.price, band?.p10, band?.p90)
    Row(
        Modifier
            .fillMaxWidth()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            )
            .padding(horizontal = Sp.s4, vertical = Sp.s3),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(Sp.s3),
    ) {
        Box(
            Modifier.size(28.dp).clip(RoundedCornerShape(8.dp)).background(color),
            contentAlignment = Alignment.Center,
        ) {
            Text("$rank", style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color.White))
        }
        Column(Modifier.weight(1f)) {
            Text(
                station.name.ifBlank { station.brand ?: "" },
                style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Medium),
                maxLines = 1,
            )
            Text(
                station.address,
                style = TextStyle(fontSize = 13.sp, color = c.hint),
                maxLines = 1,
            )
        }
        if (favourite) {
            AppIcon(AppIcons.Star, tint = c.favorite, size = 20.dp)
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(
                twoDecimals(station.price ?: 0.0),
                style = TextStyle(fontSize = 20.sp, fontWeight = FontWeight.Bold, color = color),
            )
            station.dist?.let {
                Text(
                    formatKm(it, station.distApprox),
                    style = TextStyle(fontSize = 12.sp, color = c.hint),
                )
            }
        }
    }
}
