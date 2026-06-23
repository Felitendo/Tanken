package gg.felo.tanken.ui.screens

import androidx.compose.runtime.Composable
import gg.felo.tanken.ui.components.PlaceholderScreen

/** Not used at runtime — the iOS map tab is a native SwiftUI MapKit view (see iosApp/MapTabView.swift). */
@Composable
actual fun MapScreen() = PlaceholderScreen(
    title = "Karte",
    subtitle = "Native Karte",
)
