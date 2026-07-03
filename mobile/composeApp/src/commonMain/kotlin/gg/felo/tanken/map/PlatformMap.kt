package gg.felo.tanken.map

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.LatLng
import kotlinx.coroutines.flow.MutableStateFlow

/** One-shot camera command consumed by the platform map. */
data class FlyTo(val target: LatLng, val zoom: Double, val seq: Long)

/**
 * Bridge between common UI/view-models and the platform map implementation
 * (Apple Maps on iOS, the Compose tile map on desktop). The map pushes its
 * live region into [center]/[zoom]/[bounds]; the app requests camera moves
 * via [requestFlyTo].
 */
class MapController(initialCenter: LatLng = LatLng(52.52, 13.405), initialZoom: Double = 11.0) {
    val center = MutableStateFlow(initialCenter)
    val zoom = MutableStateFlow(initialZoom)
    val bounds = MutableStateFlow<GeoBounds?>(null)

    /** True once the user panned/zoomed — drives the "Hier suchen" pill. */
    val moved = MutableStateFlow(false)

    val flyTo = MutableStateFlow<FlyTo?>(null)
    private var flySeq = 0L

    fun requestFlyTo(target: LatLng, zoom: Double) {
        flySeq += 1
        flyTo.value = FlyTo(target, zoom, flySeq)
    }
}

/**
 * The map surface. iOS renders native Apple Maps (MKMapView); the desktop
 * verification build renders the Compose CARTO tile map. Overlay chrome
 * (search bar, FAB, drawers) stays in common Compose on top.
 */
@Composable
expect fun PlatformMapView(
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
    modifier: Modifier = Modifier,
)
