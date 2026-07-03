package gg.felo.tanken

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import gg.felo.tanken.ui.GalleryScreen
import gg.felo.tanken.ui.SmokeScreen
import gg.felo.tanken.ui.components.PageHeader
import gg.felo.tanken.ui.components.TabBar
import gg.felo.tanken.ui.components.TabSpec
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.ui.theme.ThemeMode

enum class AppTab { Map, History, Stats, Settings }

/**
 * App root. [initialState] is used by the screenshot harness to open a
 * deterministic screen; [themeOverride] pins the theme for screenshots.
 */
@Composable
fun App(graph: AppGraph, initialState: String? = null, themeOverride: ThemeMode? = null) {
    androidx.compose.runtime.CompositionLocalProvider(LocalAppGraph provides graph) {
        val stateTheme by graph.state.themeMode.collectAsState()
        val strings by graph.state.stringsFlow.collectAsState()

        LaunchedEffect(Unit) { graph.state.refreshRemote() }

        TankenTheme(mode = themeOverride ?: stateTheme) {
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

            Column(Modifier.fillMaxSize().background(Theme.colors.bg)) {
                Box(Modifier.weight(1f).fillMaxWidth()) {
                    val mapViewModel = remember {
                        gg.felo.tanken.ui.screens.map.MapViewModel(graph).apply {
                            autoSelectFirst = initialState == "detail"
                        }
                    }
                    when (initialState) {
                        "gallery" -> GalleryScreen()
                        "smoke" -> SmokeScreen()
                        else -> when (tab) {
                            AppTab.Map -> gg.felo.tanken.ui.screens.map.MapScreen(mapViewModel)
                            AppTab.History -> PlaceholderScreen(strings.historyTitle, strings.historyDescription)
                            AppTab.Stats -> PlaceholderScreen(strings.statsTitle, strings.statsDescription)
                            AppTab.Settings -> PlaceholderScreen(strings.settingsTitle, strings.settingsDescription)
                        }
                    }
                }
                if (initialState != "gallery" && initialState != "smoke") {
                    TabBar(
                        tabs = listOf(
                            TabSpec(AppIcons.TabMap, strings.tabMap),
                            TabSpec(AppIcons.TabHistory, strings.tabHistory),
                            TabSpec(AppIcons.TabStats, "Stats"),
                            TabSpec(AppIcons.TabSettings, strings.tabSettings),
                        ),
                        selected = tab.ordinal,
                        onSelect = { tab = AppTab.entries[it] },
                    )
                }
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
