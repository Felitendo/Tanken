package gg.felo.tanken.ui.screens.map

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.map.LocationPuck
import gg.felo.tanken.map.MapCamera
import gg.felo.tanken.map.MapView
import gg.felo.tanken.map.StationMarkers
import gg.felo.tanken.map.TileStyle
import gg.felo.tanken.map.clusterStations
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.twoDecimals
import kotlinx.coroutines.launch

/**
 * Karte tab. Phase-3 scope: live tiles, price bubbles colored by the regional
 * band, user puck, GPS FAB. Drawer/search/detail arrive with Phase 4.
 */
@Composable
fun MapScreen(viewModel: MapViewModel) {
    val graph = LocalAppGraph.current
    val scope = rememberCoroutineScope()
    val c = Theme.colors
    val stations by viewModel.stations.collectAsState()
    val band by viewModel.band.collectAsState()

    LaunchedEffect(Unit) { viewModel.start(scope) }

    Box(Modifier.fillMaxSize()) {
        val tileZoom = viewModel.camera.zoom.toInt()
        val clusters = remember(stations, tileZoom) { clusterStations(stations, tileZoom) }
        MapView(
            camera = viewModel.camera,
            tiles = graph.tiles,
            style = if (c.isDark) TileStyle.Dark else TileStyle.Light,
            modifier = Modifier.fillMaxSize(),
        ) {
            StationMarkers(
                clusters = clusters,
                band = band,
                onClusterTap = { cluster ->
                    viewModel.camera.animateTo(
                        scope,
                        LatLng(cluster.lat, cluster.lng),
                        (viewModel.camera.zoom + 2).coerceAtMost(MapCamera.MAX_ZOOM),
                    )
                },
            )
            viewModel.userLocation.collectAsState().value?.let { user ->
                LocationPuck(Modifier.mapAnchor(user.lat, user.lng, ax = 0.5f, ay = 0.5f))
            }
        }

        // GPS FAB (`.map-fab`)
        Box(
            Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp)
                .shadow(6.dp, RoundedCornerShape(14.dp))
                .clip(RoundedCornerShape(14.dp))
                .background(if (c.isDark) Color(0xE61C1C1E) else Color(0xF2FFFFFF))
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                ) { scope.launch { viewModel.jumpToUser(scope) } }
                .size(48.dp),
            contentAlignment = Alignment.Center,
        ) {
            AppIcon(AppIcons.MyLocation, tint = c.accent, size = 22.dp)
        }
    }
}
