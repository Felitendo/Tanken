package gg.felo.tanken

import androidx.compose.ui.window.ComposeUIViewController
import gg.felo.tanken.di.initKoin
import gg.felo.tanken.ui.AppTab
import gg.felo.tanken.ui.TabContent
import gg.felo.tanken.ui.theme.TankenThemeRoot
import platform.UIKit.UIViewController

/** Called once from the SwiftUI app on launch to start the DI graph. (Swift: `startKoinIos()`) */
fun startKoinIos() {
    initKoin(iosModule())
}

private fun tabController(tab: AppTab): UIViewController = ComposeUIViewController {
    TankenThemeRoot { TabContent(tab) }
}

// One controller per tab — the SwiftUI TabView (Liquid Glass) hosts each via
// UIViewControllerRepresentable. Map is replaced by a native MapKit view in Phase 2.
fun mapViewController(): UIViewController = tabController(AppTab.MAP)
fun historyViewController(): UIViewController = tabController(AppTab.HISTORY)
fun statsViewController(): UIViewController = tabController(AppTab.STATS)
fun settingsViewController(): UIViewController = tabController(AppTab.SETTINGS)
