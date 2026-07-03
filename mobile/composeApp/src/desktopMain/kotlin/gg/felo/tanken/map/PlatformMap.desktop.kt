package gg.felo.tanken.map

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.LatLng

/**
 * Desktop verification map: the Compose CARTO tile renderer, kept because it
 * runs on this machine and shares layout/units with the rest of the UI. iOS
 * ships native Apple Maps instead.
 */
@Composable
actual fun PlatformMapView(
    controller: MapController,
    dark: Boolean,
    clusters: List<MapCluster>,
    band: PriceBand?,
    selectedId: String?,
    favourites: Set<String>,
    showUserLocation: Boolean,
    userLocation: LatLng?,
    onStationTap: (Station) -> Unit,
    onClusterTap: (MapCluster) -> Unit,
    modifier: Modifier,
) {
    val graph = LocalAppGraph.current
    val scope = rememberCoroutineScope()
    val camera = remember { MapCamera(controller.center.value, controller.zoom.value) }

    // Consume fly-to requests.
    val fly by controller.flyTo.collectAsState()
    LaunchedEffect(fly) {
        fly?.let { camera.animateTo(scope, it.target, it.zoom) }
    }

    // Publish live camera state back to the controller.
    LaunchedEffect(camera) {
        snapshotFlow { Triple(camera.centerX, camera.centerY, camera.zoom) }
            .collect {
                controller.center.value = camera.center
                controller.zoom.value = camera.zoom
                controller.bounds.value = camera.visibleBounds()
                if (camera.moved) controller.moved.value = true
            }
    }

    MapView(
        camera = camera,
        tiles = graph.tiles,
        style = if (dark) TileStyle.Dark else TileStyle.Light,
        modifier = modifier,
    ) {
        StationMarkers(
            clusters = clusters,
            band = band,
            selectedId = selectedId,
            favourites = favourites,
            onStationTap = onStationTap,
            onClusterTap = onClusterTap,
        )
        if (showUserLocation && userLocation != null) {
            LocationPuck(Modifier.mapAnchor(userLocation.lat, userLocation.lng, ax = 0.5f, ay = 0.5f))
        }
    }
}
