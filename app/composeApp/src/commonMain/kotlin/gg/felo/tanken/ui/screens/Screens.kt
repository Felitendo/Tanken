package gg.felo.tanken.ui.screens

import androidx.compose.runtime.Composable
import gg.felo.tanken.ui.components.PlaceholderScreen

// Phase 1 stubs. MapScreen → native maps in Phase 2; History/Stats fleshed out in Phase 3.

@Composable
fun MapScreen() = PlaceholderScreen(
    title = "Karte",
    subtitle = "Native Karte (Apple Maps / Google Maps) folgt in Phase 2.",
)

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
