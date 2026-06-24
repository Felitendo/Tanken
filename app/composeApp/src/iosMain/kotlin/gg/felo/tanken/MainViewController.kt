package gg.felo.tanken

import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.window.ComposeUIViewController
import gg.felo.tanken.di.initKoin
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.i18n.stringsFor
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.platformLanguageCode
import gg.felo.tanken.state.AppConfig
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.state.MapViewModel
import gg.felo.tanken.ui.AppTab
import gg.felo.tanken.ui.TabContent
import gg.felo.tanken.ui.screens.StationDetailContent
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Rgb
import gg.felo.tanken.ui.theme.TankenThemeRoot
import gg.felo.tanken.util.formatPrice
import org.koin.compose.KoinContext
import org.koin.mp.KoinPlatform
import platform.Foundation.NSUserDefaults
import platform.UIKit.UIViewController
import kotlin.native.setUnhandledExceptionHook

/** Called once from the SwiftUI app on launch to start the DI graph. (Swift: `startKoinIos()`) */
fun startKoinIos() {
    installCrashLogging()
    initKoin(iosModule())
}

private const val CRASH_KEY = "tanken_last_crash"

/**
 * Capture otherwise-invisible Kotlin/Native crashes. An uncaught exception (e.g. on a background
 * Compose/coroutine queue) aborts the process, and the iOS `.ips` only records raw, unsymbolicated
 * addresses for our statically-linked framework — so the exception type/message are lost. The hook
 * persists them so [lastCrashReport] can show the real cause in-app on the next launch.
 */
@OptIn(kotlin.experimental.ExperimentalNativeApi::class)
private fun installCrashLogging() {
    setUnhandledExceptionHook { throwable ->
        // `toString()` yields "ClassName: message"; stackTraceToString() adds the Kotlin frames.
        val report = throwable.toString() + "\n\n" + throwable.stackTraceToString()
        println("TANKEN_CRASH\n$report")
        NSUserDefaults.standardUserDefaults.apply {
            setObject(report, CRASH_KEY)
            synchronize()
        }
    }
}

/** The last captured crash report (type + message + Kotlin stack), or null. (Swift: `lastCrashReport()`) */
fun lastCrashReport(): String? = NSUserDefaults.standardUserDefaults.stringForKey(CRASH_KEY)

/** Clear the stored crash report once it has been shown. (Swift: `clearLastCrashReport()`) */
fun clearLastCrashReport() = NSUserDefaults.standardUserDefaults.removeObjectForKey(CRASH_KEY)

private inline fun <reified T> koin(): T = KoinPlatform.getKoin().get()

private fun tabController(tab: AppTab): UIViewController = ComposeUIViewController {
    // KoinContext binds the global Koin into the composition so koinInject() resolves on iOS
    // (the native map tab never exercises this, which is why only the Compose tabs crashed).
    KoinContext { TankenThemeRoot { TabContent(tab) } }
}

// History/Stats/Settings tabs host shared Compose screens. The Map tab is a native SwiftUI
// MapKit view (iosApp/MapTabView.swift), driven by the shared MapViewModel below.
fun historyViewController(): UIViewController = tabController(AppTab.HISTORY)
fun statsViewController(): UIViewController = tabController(AppTab.STATS)
fun settingsViewController(): UIViewController = tabController(AppTab.SETTINGS)

/** The shared Map state — the SwiftUI map observes/feeds this singleton. */
fun mapViewModelShared(): MapViewModel = koin()

/** Localised strings for the native SwiftUI chrome (tab titles, map search). Reads the in-app
 *  language setting; native labels refresh on next launch after a language change. */
fun currentStrings(): Strings {
    val config = koin<AppConfig>()
    return stringsFor(config.language.value, platformLanguageCode())
}

/** Compose station detail, presented in a native SwiftUI `.sheet`; reads the current selection. */
fun stationDetailController(): UIViewController = ComposeUIViewController {
    KoinContext {
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
}

// ---- Helpers used by the native Swift map -------------------------------------------------------

/** Marker colour (0..1 RGB) for a station given the active regional band. */
fun markerColor(station: Station, band: PriceBand?): Rgb = PriceColor.rgbForPrice(station.price, band)

/** Formatted price label for a marker bubble (German style, e.g. "1,789"). */
fun stationPriceLabel(station: Station): String = formatPrice(station.price)
