package gg.felo.tanken.ui

import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.state.AppConfig
import gg.felo.tanken.state.ThemeMode
import gg.felo.tanken.ui.screens.HistoryScreen
import gg.felo.tanken.ui.screens.MapScreen
import gg.felo.tanken.ui.screens.SettingsScreen
import gg.felo.tanken.ui.screens.StatsScreen
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.ui.theme.TankenThemeRoot
import org.koin.compose.koinInject

/**
 * Android root: the 4 tabs in a Material3 [Scaffold] with a bottom [NavigationBar] styled to match
 * the website. iOS does NOT use this — its SwiftUI shell hosts each [TabContent] via a per-tab
 * ComposeUIViewController to get the native Liquid Glass navigator.
 */
@Composable
fun App() {
    TankenThemeRoot {
        val haptics = koinInject<Haptics>()
        var current by remember { mutableStateOf(AppTab.MAP) }
        val colors = TankenTheme.colors

        Scaffold(
            containerColor = colors.bgPrimary,
            bottomBar = {
                NavigationBar(containerColor = colors.bgElevated) {
                    AppTab.entries.forEach { tab ->
                        val selected = tab == current
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                if (tab != current) {
                                    haptics.selection()
                                    current = tab
                                }
                            },
                            icon = { Icon(tab.icon, contentDescription = tab.title) },
                            label = { Text(tab.title) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = colors.accent,
                                selectedTextColor = colors.accent,
                                indicatorColor = colors.accent.copy(alpha = 0.12f),
                                unselectedIconColor = colors.textHint,
                                unselectedTextColor = colors.textHint,
                            ),
                        )
                    }
                }
            },
        ) { inner ->
            Box(Modifier.fillMaxSize().padding(inner).background(colors.bgPrimary)) {
                Crossfade(targetState = current, animationSpec = tween(220), label = "tab") { tab ->
                    TabContent(tab)
                }
            }
        }
    }
}

/** Renders the screen for a single tab. Shared by Android ([App]) and the iOS per-tab controllers. */
@Composable
fun TabContent(tab: AppTab) {
    when (tab) {
        AppTab.MAP -> MapScreen()
        AppTab.HISTORY -> HistoryScreen()
        AppTab.STATS -> StatsScreen()
        AppTab.SETTINGS -> SettingsScreen()
    }
}
