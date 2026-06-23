package gg.felo.tanken.ui

import androidx.compose.ui.graphics.vector.ImageVector
import gg.felo.tanken.ui.icons.AppIcons

/** The four tabs, matching the website (Map / History / Stats / Settings). */
enum class AppTab(val title: String, val icon: ImageVector, val route: String) {
    MAP("Karte", AppIcons.Map, "/"),
    HISTORY("Verlauf", AppIcons.History, "/history"),
    STATS("Statistik", AppIcons.Stats, "/stats"),
    SETTINGS("Einstellungen", AppIcons.Settings, "/settings"),
}
