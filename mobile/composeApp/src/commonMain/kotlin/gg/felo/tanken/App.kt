package gg.felo.tanken

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import gg.felo.tanken.ui.GalleryScreen
import gg.felo.tanken.ui.components.PageHeader
import gg.felo.tanken.ui.components.TabBar
import gg.felo.tanken.ui.components.TabSpec
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.ui.theme.ThemeMode

enum class AppTab(val label: String) {
    Map("Karte"),
    History("Verlauf"),
    Stats("Stats"),
    Settings("Einstellungen"),
}

/**
 * App root. [initialState] is used by the screenshot harness to open a
 * deterministic screen ("map", "history", "stats", "settings", "gallery").
 */
@Composable
fun App(initialState: String? = null, themeMode: ThemeMode = ThemeMode.Auto) {
    TankenTheme(mode = themeMode) {
        var tab by remember {
            mutableStateOf(
                when (initialState) {
                    "history" -> AppTab.History
                    "stats" -> AppTab.Stats
                    "settings" -> AppTab.Settings
                    else -> AppTab.Map
                },
            )
        }
        val gallery = initialState == "gallery"

        Column(Modifier.fillMaxSize().background(Theme.colors.bg)) {
            Box(Modifier.weight(1f).fillMaxWidth()) {
                if (gallery) {
                    GalleryScreen()
                } else {
                    when (tab) {
                        AppTab.Map -> PlaceholderScreen("Karte", "Tankstellen in deiner Nähe.")
                        AppTab.History -> PlaceholderScreen("Preisverlauf", "Wie sich die Preise zuletzt entwickelt haben.")
                        AppTab.Stats -> PlaceholderScreen("Statistiken", "Wann und wo Tanken am günstigsten ist.")
                        AppTab.Settings -> PlaceholderScreen("Einstellungen", "Deine App-Einstellungen und dein Konto.")
                    }
                }
            }
            if (!gallery) {
                TabBar(
                    tabs = listOf(
                        TabSpec(AppIcons.TabMap, AppTab.Map.label),
                        TabSpec(AppIcons.TabHistory, AppTab.History.label),
                        TabSpec(AppIcons.TabStats, AppTab.Stats.label),
                        TabSpec(AppIcons.TabSettings, AppTab.Settings.label),
                    ),
                    selected = tab.ordinal,
                    onSelect = { tab = AppTab.entries[it] },
                )
            }
        }
    }
}

@Composable
private fun PlaceholderScreen(title: String, description: String) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        PageHeader(title, description)
    }
}
