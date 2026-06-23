package gg.felo.tanken

import com.russhwolf.settings.NSUserDefaultsSettings
import com.russhwolf.settings.Settings
import gg.felo.tanken.platform.Geolocation
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.platform.SecureStore
import org.koin.dsl.module
import platform.Foundation.NSURL
import platform.Foundation.NSUserDefaults
import platform.UIKit.UIApplication
import platform.UIKit.UIImpactFeedbackGenerator
import platform.UIKit.UIImpactFeedbackStyle
import platform.UIKit.UINotificationFeedbackGenerator
import platform.UIKit.UINotificationFeedbackType
import platform.UIKit.UISelectionFeedbackGenerator

/** iOS DI: UIKit haptics, NSUserDefaults-backed settings, token store, maps links. */
fun iosModule() = module {
    single<Settings> { NSUserDefaultsSettings(NSUserDefaults.standardUserDefaults) }
    single<SecureStore> { IosSecureStore() }
    single<Haptics> { IosHaptics() }
    single<Geolocation> { IosGeolocation() }
    single<MapsLink> { IosMapsLink() }
}

/**
 * On iOS the map is a native SwiftUI MapKit view that already shows the user's location and drives
 * recentering through CLLocationManager in Swift, calling `MapViewModel.searchHere(...)`. So the
 * Kotlin geolocation is a no-op here.
 */
private class IosGeolocation : Geolocation {
    override suspend fun current(): LatLng? = null
}

private class IosMapsLink : MapsLink {
    override val showAppleMaps = true

    override val hasGoogleMaps: Boolean
        get() = NSURL(string = "comgooglemaps://")?.let { UIApplication.sharedApplication.canOpenURL(it) } ?: false

    override fun openAppleMaps(lat: Double, lng: Double, label: String) {
        open("http://maps.apple.com/?daddr=$lat,$lng&dirflg=d")
    }

    override fun openGoogleMaps(lat: Double, lng: Double, label: String) {
        val app = "comgooglemaps://?daddr=$lat,$lng&directionsmode=driving"
        val canApp = NSURL(string = "comgooglemaps://")?.let { UIApplication.sharedApplication.canOpenURL(it) } ?: false
        open(if (canApp) app else "https://www.google.com/maps/dir/?api=1&destination=$lat,$lng")
    }

    private fun open(urlString: String) {
        val url = NSURL(string = urlString) ?: return
        UIApplication.sharedApplication.openURL(url, options = emptyMap<Any?, Any?>(), completionHandler = null)
    }
}

/**
 * Token store. Phase 1 uses a dedicated NSUserDefaults suite; Phase 4 (login) swaps this for a
 * real Keychain-backed implementation.
 */
private class IosSecureStore : SecureStore {
    private val defaults = NSUserDefaults(suiteName = "gg.felo.tanken.secure")
    override fun getToken(): String? = defaults.stringForKey(KEY)
    override fun setToken(value: String?) {
        if (value == null) defaults.removeObjectForKey(KEY) else defaults.setObject(value, KEY)
    }
    override fun clear() = defaults.removeObjectForKey(KEY)

    companion object { private const val KEY = "session_token" }
}

private class IosHaptics : Haptics {
    private fun impact(style: UIImpactFeedbackStyle) {
        UIImpactFeedbackGenerator(style).apply { prepare(); impactOccurred() }
    }
    private fun notify(type: UINotificationFeedbackType) {
        UINotificationFeedbackGenerator().apply { prepare(); notificationOccurred(type) }
    }
    override fun light() = impact(UIImpactFeedbackStyle.UIImpactFeedbackStyleLight)
    override fun medium() = impact(UIImpactFeedbackStyle.UIImpactFeedbackStyleMedium)
    override fun heavy() = impact(UIImpactFeedbackStyle.UIImpactFeedbackStyleHeavy)
    override fun selection() = UISelectionFeedbackGenerator().apply { prepare(); selectionChanged() }.let {}
    override fun success() = notify(UINotificationFeedbackType.UINotificationFeedbackTypeSuccess)
    override fun warning() = notify(UINotificationFeedbackType.UINotificationFeedbackTypeWarning)
    override fun error() = notify(UINotificationFeedbackType.UINotificationFeedbackTypeError)
}
