package gg.felo.tanken.map

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.util.twoDecimals

/**
 * Marker clustering + rendering, visually matching the PWA's Leaflet
 * markercluster setup: clusters render as colored circles with a station
 * count and `~avg` price, single stations as brand/price pills with a tail.
 *
 * Clustering happens on a world-space grid at the *integer* zoom level, so
 * membership is stable while panning and only changes when zoom crosses a
 * level — the same feel Leaflet gives.
 */
data class MapCluster(
    val lat: Double,
    val lng: Double,
    val stations: List<Station>,
) {
    val count: Int get() = stations.size
    val avgPrice: Double? =
        stations.mapNotNull { it.price }.takeIf { it.isNotEmpty() }?.average()
    val single: Station? get() = stations.singleOrNull()
}

/** Grid cell in logical px at the given zoom (Leaflet default radius ~60-80). */
private const val CLUSTER_CELL_PX = 72.0

/** Beyond this zoom everything renders unclustered, like markercluster's maxZoom. */
private const val UNCLUSTER_ZOOM = 14

fun clusterStations(stations: List<Station>, zoom: Int): List<MapCluster> {
    if (stations.isEmpty()) return emptyList()
    if (zoom >= UNCLUSTER_ZOOM) {
        return stations.map { MapCluster(it.lat, it.lng, listOf(it)) }
    }
    val cellWorld = CLUSTER_CELL_PX / Projection.worldSize(zoom.toDouble())
    val cells = LinkedHashMap<Long, MutableList<Station>>()
    stations.forEach { station ->
        val cx = (Projection.worldX(station.lng) / cellWorld).toLong()
        val cy = (Projection.worldY(station.lat) / cellWorld).toLong()
        cells.getOrPut(cx * 1_000_003L + cy) { mutableListOf() } += station
    }
    return cells.values.map { members ->
        MapCluster(
            lat = members.sumOf { it.lat } / members.size,
            lng = members.sumOf { it.lng } / members.size,
            stations = members,
        )
    }
}

/** Renders all station markers inside a [MapView] content block. */
@Composable
fun MapScope.StationMarkers(
    clusters: List<MapCluster>,
    band: PriceBand?,
    selectedId: String? = null,
    favourites: Set<String> = emptySet(),
    onStationTap: (Station) -> Unit = {},
    onClusterTap: (MapCluster) -> Unit = {},
) {
    clusters.forEach { cluster ->
        val single = cluster.single
        if (single != null) {
            StationPill(
                station = single,
                band = band,
                selected = single.id == selectedId,
                favourite = single.id in favourites,
                modifier = Modifier.mapAnchor(single.lat, single.lng, ax = 0.5f, ay = 1.0f),
                onTap = { onStationTap(single) },
            )
        } else {
            ClusterBubble(
                cluster = cluster,
                band = band,
                modifier = Modifier.mapAnchor(cluster.lat, cluster.lng, ax = 0.5f, ay = 0.5f),
                onTap = { onClusterTap(cluster) },
            )
        }
    }
}

@Composable
private fun ClusterBubble(
    cluster: MapCluster,
    band: PriceBand?,
    modifier: Modifier,
    onTap: () -> Unit,
) {
    val color = PriceColor.forPrice(cluster.avgPrice, band?.p10, band?.p90)
    Box(
        modifier
            .size(54.dp)
            .shadow(4.dp, CircleShape)
            .clip(CircleShape)
            .background(color)
            .border(2.dp, Color.White.copy(alpha = 0.85f), CircleShape)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                "${cluster.count}",
                style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White),
            )
            cluster.avgPrice?.let {
                Text(
                    "~${twoDecimals(it)}",
                    style = TextStyle(fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = Color.White.copy(alpha = 0.92f)),
                )
            }
        }
    }
}

@Composable
private fun StationPill(
    station: Station,
    band: PriceBand?,
    selected: Boolean,
    favourite: Boolean,
    modifier: Modifier,
    onTap: () -> Unit,
) {
    val color = PriceColor.forPrice(station.price, band?.p10, band?.p90)
    Column(modifier, horizontalAlignment = Alignment.CenterHorizontally) {
        Column(
            Modifier
                .shadow(4.dp, RoundedCornerShape(9.dp))
                .clip(RoundedCornerShape(9.dp))
                .background(color)
                .then(
                    when {
                        selected -> Modifier.border(2.dp, Color.White, RoundedCornerShape(9.dp))
                        favourite -> Modifier.border(2.dp, Color(0xFFFFB800), RoundedCornerShape(9.dp))
                        else -> Modifier
                    },
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onTap,
                )
                .padding(horizontal = 8.dp, vertical = 3.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            val brand = station.brand?.takeIf { it.isNotBlank() } ?: station.name
            Text(
                brand,
                style = TextStyle(fontSize = 9.sp, fontWeight = FontWeight.Medium, color = Color.White.copy(alpha = 0.9f)),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.widthIn(max = 84.dp),
            )
            Text(
                station.price?.let { twoDecimals(it) } ?: "–",
                style = TextStyle(
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center,
                ),
            )
        }
        // Tail pointing at the exact station position.
        Canvas(Modifier.size(width = 12.dp, height = 6.dp)) {
            val path = Path().apply {
                moveTo(0f, 0f)
                lineTo(size.width, 0f)
                lineTo(size.width / 2f, size.height)
                close()
            }
            drawPath(path, color)
        }
    }
}
