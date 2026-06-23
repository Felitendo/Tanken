package gg.felo.tanken.ui

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Map
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.ShowChart
import androidx.compose.ui.graphics.vector.ImageVector

/** The four tabs, matching the website (Map / History / Stats / Settings). */
enum class AppTab(val title: String, val icon: ImageVector, val route: String) {
    MAP("Karte", Icons.Outlined.Map, "/"),
    HISTORY("Verlauf", Icons.Outlined.ShowChart, "/history"),
    STATS("Statistik", Icons.Outlined.BarChart, "/stats"),
    SETTINGS("Einstellungen", Icons.Outlined.Settings, "/settings"),
}
