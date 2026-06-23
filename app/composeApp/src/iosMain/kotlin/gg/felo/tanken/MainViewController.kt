package gg.felo.tanken

import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.window.ComposeUIViewController
import gg.felo.tanken.di.initKoin
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.state.MapViewModel
import gg.felo.tanken.ui.AppTab
import gg.felo.tanken.ui.TabContent
import gg.felo.tanken.ui.screens.StationDetailContent
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Rgb
import gg.felo.tanken.ui.theme.TankenThemeRoot
import gg.felo.tanken.util.formatPrice3
import org.koin.mp.KoinPlatform
import platform.UIKit.UIViewController

/** Called once from the SwiftUI app on launch to start the DI graph. (Swift: `startKoinIos()`) */
fun startKoinIos() {
    initKoin(iosModule())
}

private inline fun <reified T> koin(): T = KoinPlatform.getKoin().get()

private fun tabController(tab: AppTab): UIViewController = ComposeUIViewController {
    TankenThemeRoot { TabContent(tab) }
}

// History/Stats/Settings tabs host shared Compose screens. The Map tab is a native SwiftUI
// MapKit view (iosApp/MapTabView.swift), driven by the shared MapViewModel below.
fun historyViewController(): UIViewController = tabController(AppTab.HISTORY)
fun statsViewController(): UIViewController = tabController(AppTab.STATS)
fun settingsViewController(): UIViewController = tabController(AppTab.SETTINGS)

/** The shared Map state — the SwiftUI map observes/feeds this singleton. */
fun mapViewModelShared(): MapViewModel = koin()

/** Compose station detail, presented in a native SwiftUI `.sheet`; reads the current selection. */
fun stationDetailController(): UIViewController = ComposeUIViewController {
    TankenThemeRoot {
        val vm = remember { mapViewModelShared() }
        val state by vm.state.collectAsState()
        val selected = state.selected
        val mapsLink = remember { koin<MapsLink>() }
        val haptics = remember { koin<Haptics>() }
        if (selected != null) {
            StationDetailContent(selected, state.band, mapsLink, haptics)
        }
    }
}

// ---- Helpers used by the native Swift map -------------------------------------------------------

/** Marker colour (0..1 RGB) for a station given the active regional band. */
fun markerColor(station: Station, band: PriceBand?): Rgb = PriceColor.rgbForPrice(station.price, band)

/** Formatted price label for a marker bubble (German style, e.g. "1,789"). */
fun stationPriceLabel(station: Station): String = formatPrice3(station.price)
