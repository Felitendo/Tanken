package gg.felo.tanken.ui.screens.map

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
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
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.map.LocationPuck
import gg.felo.tanken.map.MapCamera
import gg.felo.tanken.map.MapView
import gg.felo.tanken.map.StationMarkers
import gg.felo.tanken.map.TileStyle
import gg.felo.tanken.map.clusterStations
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.state.StationSort
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.BottomSheet
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.Theme
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/**
 * Karte tab: 55% map / 45% station list (the PWA's mobile layout), search bar
 * with suggestions, "Hier suchen" pill, GPS FAB and the station detail sheet.
 */
@Composable
fun MapScreen(viewModel: MapViewModel) {
    val graph = LocalAppGraph.current
    val scope = rememberCoroutineScope()
    val c = Theme.colors
    val strings = graph.state.stringsFlow.collectAsState().value
    val stations by viewModel.stations.collectAsState()
    val band by viewModel.band.collectAsState()
    val query by viewModel.searchQuery.collectAsState()
    val suggestions by viewModel.suggestions.collectAsState()
    val selected by viewModel.selected.collectAsState()
    val selectedDetail by viewModel.selectedDetail.collectAsState()
    val sort by graph.state.stationSort.collectAsState()
    val groupByPrice by graph.state.groupByPrice.collectAsState()
    val favouritesOnTop by graph.state.favouritesOnTop.collectAsState()
    val favourites by graph.state.favourites.collectAsState()
    val user by graph.state.user.collectAsState()
    val fuel by graph.state.fuel.collectAsState()

    LaunchedEffect(Unit) { viewModel.start(scope) }
    LaunchedEffect(fuel) { viewModel.refreshOnFuelChange() }

    Box(Modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize()) {
            // `#map-container`: 55% of the tab height
            Box(Modifier.fillMaxWidth().weight(0.55f)) {
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
                        selectedId = selected?.id,
                        favourites = if (user != null) favourites else emptySet(),
                        onStationTap = { viewModel.select(it) },
                        onClusterTap = { cluster ->
                            viewModel.camera.animateTo(
                                scope,
                                LatLng(cluster.lat, cluster.lng),
                                (viewModel.camera.zoom + 2).coerceAtMost(MapCamera.MAX_ZOOM),
                            )
                        },
                    )
                    viewModel.userLocation.collectAsState().value?.let { location ->
                        LocationPuck(Modifier.mapAnchor(location.lat, location.lng, ax = 0.5f, ay = 0.5f))
                    }
                }

                // Search + pill + suggestions overlay
                MapSearchBar(
                    query = query,
                    onQueryChange = viewModel::onSearchInput,
                    suggestions = suggestions,
                    band = band,
                    showSearchHere = viewModel.camera.moved,
                    strings = strings,
                    onSuggestionTap = { viewModel.onSuggestionTap(it, scope) },
                    onSearchHere = {
                        graph.haptics.tap()
                        scope.launch { viewModel.loadViewport() }
                    },
                    onRouteTap = null, // route planner lands in a follow-up phase
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .windowInsetsPadding(WindowInsets.statusBars)
                        .padding(top = 8.dp),
                )

                // GPS FAB
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

            // Station list panel (45%)
            StationListPanel(
                stations = stations,
                band = band,
                sort = sort,
                groupByPrice = groupByPrice,
                favouritesOnTop = favouritesOnTop,
                favourites = favourites,
                loggedIn = user != null,
                strings = strings,
                onToggleSort = {
                    graph.haptics.selection()
                    graph.state.setStationSort(
                        if (sort == StationSort.Price) StationSort.Distance else StationSort.Price,
                    )
                },
                onToggleGroup = {
                    graph.haptics.selection()
                    graph.state.setGroupByPrice(!groupByPrice)
                },
                onToggleFavsOnTop = {
                    graph.haptics.selection()
                    graph.state.setFavouritesOnTop(!favouritesOnTop)
                },
                onStationTap = { viewModel.select(it) },
                modifier = Modifier.fillMaxWidth().weight(0.45f),
            )
        }

        // Station detail sheet
        BottomSheet(visible = selected != null, onDismiss = { viewModel.closeDetail() }) {
            selected?.let { station ->
                val history by viewModel.selectedHistory.collectAsState()
                StationDetailContent(
                    station = station,
                    detail = selectedDetail,
                    fuelPrice = selectedDetail?.price(fuel) ?: station.price,
                    band = band,
                    favourite = station.id in favourites,
                    loggedIn = user != null,
                    strings = strings,
                    onToggleFavourite = { scope.launch { viewModel.toggleFavourite(station.id) } },
                    onNavigate = { provider ->
                        graph.mapsLink.openNavigation(station.lat, station.lng, station.name, provider)
                    },
                    chart = { StationSheetChart(history, strings) },
                )
            }
        }
    }
}
