package gg.felo.tanken.ui.screens

import androidx.compose.runtime.Composable
import gg.felo.tanken.ui.components.PlaceholderScreen

// MapScreen is platform-specific (expect/actual): Android renders Google Maps; on iOS the map tab
// is a native SwiftUI MapKit view, so the actual there is just a fallback. History/Stats: Phase 3.

@Composable
fun HistoryScreen() = PlaceholderScreen(
    title = "Preisverlauf",
    subtitle = "Verlaufsdiagramme folgen in Phase 3.",
)

@Composable
fun StatsScreen() = PlaceholderScreen(
    title = "Statistik",
    subtitle = "Regionale Statistiken folgen in Phase 3.",
)
