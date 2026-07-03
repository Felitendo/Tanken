package gg.felo.tanken.platform

import com.russhwolf.settings.NSUserDefaultsSettings
import com.russhwolf.settings.Settings
import io.ktor.client.engine.HttpClientEngineFactory
import io.ktor.client.engine.darwin.Darwin
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.useContents
import kotlinx.coroutines.suspendCancellableCoroutine
import platform.AuthenticationServices.ASPresentationAnchor
import platform.AuthenticationServices.ASWebAuthenticationPresentationContextProvidingProtocol
import platform.AuthenticationServices.ASWebAuthenticationSession
import platform.CoreLocation.CLLocation
import platform.CoreLocation.CLLocationManager
import platform.CoreLocation.CLLocationManagerDelegateProtocol
import platform.CoreLocation.kCLAuthorizationStatusAuthorizedAlways
import platform.CoreLocation.kCLAuthorizationStatusAuthorizedWhenInUse
import platform.CoreLocation.kCLAuthorizationStatusDenied
import platform.CoreLocation.kCLAuthorizationStatusNotDetermined
import platform.CoreLocation.kCLAuthorizationStatusRestricted
import platform.CoreLocation.kCLLocationAccuracyHundredMeters
import platform.Foundation.NSCachesDirectory
import platform.Foundation.NSLocale
import platform.Foundation.NSSearchPathForDirectoriesInDomains
import platform.Foundation.NSURL
import platform.Foundation.NSURLComponents
import platform.Foundation.NSUserDefaults
import platform.Foundation.NSUserDomainMask
import platform.Foundation.currentLocale
import platform.Foundation.languageCode
import platform.UIKit.UIApplication
import platform.UIKit.UIImpactFeedbackGenerator
import platform.UIKit.UIImpactFeedbackStyle
import platform.UIKit.UINotificationFeedbackGenerator
import platform.UIKit.UINotificationFeedbackType
import platform.UIKit.UISelectionFeedbackGenerator
import platform.darwin.NSObject
import kotlin.coroutines.resume

actual fun httpClientEngine(): HttpClientEngineFactory<*> = Darwin

actual fun createSettings(): Settings =
    NSUserDefaultsSettings(NSUserDefaults.standardUserDefaults)

/**
 * v1 stores the session token in an app-scoped NSUserDefaults suite. The token
 * only grants access to fuel-price preferences, so this is acceptable for a
 * sideloaded build; a Keychain upgrade can swap in behind the same interface.
 */
actual fun createSecureStore(): SecureStore = object : SecureStore {
    private val defaults = NSUserDefaults(suiteName = "gg.felo.tanken.secure")
    override fun read(key: String): String? = defaults.stringForKey(key)
    override fun write(key: String, value: String?) {
        if (value == null) defaults.removeObjectForKey(key) else defaults.setObject(value, key)
    }
}

/**
 * One-shot CoreLocation fix. Asks for when-in-use permission on first call,
 * then requests a single location; resumes null on denial or failure.
 */
actual fun createGeolocation(): Geolocation = IosGeolocation()

private class IosGeolocation : Geolocation {
    private val manager = CLLocationManager()

    // The delegate must be a separate NSObject subclass; kept as a strong
    // property because CLLocationManager.delegate is weak.
    private var delegate: LocationDelegate? = null

    override suspend fun current(): LatLng? = suspendCancellableCoroutine { cont ->
        val d = LocationDelegate { result ->
            if (cont.isActive) cont.resume(result)
            delegate = null
        }
        delegate = d
        manager.delegate = d
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
        when (manager.authorizationStatus) {
            kCLAuthorizationStatusNotDetermined -> manager.requestWhenInUseAuthorization()
            kCLAuthorizationStatusDenied, kCLAuthorizationStatusRestricted -> {
                if (cont.isActive) cont.resume(null)
                delegate = null
            }
            else -> manager.requestLocation()
        }
        cont.invokeOnCancellation { delegate = null }
    }

    private inner class LocationDelegate(
        private val onResult: (LatLng?) -> Unit,
    ) : NSObject(), CLLocationManagerDelegateProtocol {

        override fun locationManagerDidChangeAuthorization(manager: CLLocationManager) {
            when (manager.authorizationStatus) {
                kCLAuthorizationStatusAuthorizedWhenInUse, kCLAuthorizationStatusAuthorizedAlways ->
                    manager.requestLocation()
                kCLAuthorizationStatusDenied, kCLAuthorizationStatusRestricted -> onResult(null)
                else -> Unit // still undetermined; wait for the user's choice
            }
        }

        @OptIn(ExperimentalForeignApi::class)
        override fun locationManager(manager: CLLocationManager, didUpdateLocations: List<*>) {
            val location = didUpdateLocations.lastOrNull() as? CLLocation
            if (location != null) {
                location.coordinate.useContents { onResult(LatLng(latitude, longitude)) }
            } else {
                onResult(null)
            }
        }

        override fun locationManager(manager: CLLocationManager, didFailWithError: platform.Foundation.NSError) {
            onResult(null)
        }
    }
}

actual fun createHaptics(): Haptics = object : Haptics {
    override fun tap() {
        UIImpactFeedbackGenerator(UIImpactFeedbackStyle.UIImpactFeedbackStyleLight).impactOccurred()
    }
    override fun success() {
        UINotificationFeedbackGenerator().notificationOccurred(UINotificationFeedbackType.UINotificationFeedbackTypeSuccess)
    }
    override fun error() {
        UINotificationFeedbackGenerator().notificationOccurred(UINotificationFeedbackType.UINotificationFeedbackTypeError)
    }
    override fun selection() {
        UISelectionFeedbackGenerator().selectionChanged()
    }
}

/**
 * ASWebAuthenticationSession flow: opens the server's app-mode OIDC start URL
 * and resolves the `tanken://auth?token=...` callback. The presentation
 * context provider must be an NSObject subclass, kept strongly referenced for
 * the session's lifetime.
 */
actual fun createAuthenticator(): Authenticator = object : Authenticator {

    private var anchorProvider: AnchorProvider? = null

    override suspend fun login(startUrl: String): String? = suspendCancellableCoroutine { cont ->
        val url = NSURL.URLWithString(startUrl)
        if (url == null) {
            cont.resume(null)
            return@suspendCancellableCoroutine
        }
        val session = ASWebAuthenticationSession(
            uRL = url,
            callbackURLScheme = "tanken",
        ) { callbackUrl, _ ->
            val token = callbackUrl?.let { cb ->
                NSURLComponents(uRL = cb, resolvingAgainstBaseURL = false).queryItems
                    ?.firstOrNull { (it as? platform.Foundation.NSURLQueryItem)?.name == "token" }
                    ?.let { (it as platform.Foundation.NSURLQueryItem).value }
            }
            anchorProvider = null
            if (cont.isActive) cont.resume(token)
        }
        val provider = AnchorProvider()
        anchorProvider = provider
        session.presentationContextProvider = provider
        session.prefersEphemeralWebBrowserSession = false
        if (!session.start() && cont.isActive) {
            anchorProvider = null
            cont.resume(null)
        }
        cont.invokeOnCancellation {
            session.cancel()
            anchorProvider = null
        }
    }
}

private class AnchorProvider : NSObject(), ASWebAuthenticationPresentationContextProvidingProtocol {
    override fun presentationAnchorForWebAuthenticationSession(
        session: ASWebAuthenticationSession,
    ): ASPresentationAnchor {
        // ASPresentationAnchor is a typealias for UIWindow.
        return UIApplication.sharedApplication.keyWindow ?: platform.UIKit.UIWindow()
    }
}

actual fun createMapsLink(): MapsLink = object : MapsLink {
    override fun openNavigation(lat: Double, lng: Double, name: String, provider: MapsProvider) {
        val app = UIApplication.sharedApplication
        when (provider) {
            MapsProvider.Google -> {
                val native = NSURL.URLWithString("comgooglemaps://?daddr=$lat,$lng&directionsmode=driving")
                val web = NSURL.URLWithString("https://www.google.com/maps/dir/?api=1&destination=$lat,$lng")
                when {
                    native != null && app.canOpenURL(native) -> app.openURL(native, emptyMap<Any?, Any>(), null)
                    web != null -> app.openURL(web, emptyMap<Any?, Any>(), null)
                }
            }
            MapsProvider.Apple -> {
                NSURL.URLWithString("maps://?daddr=$lat,$lng")?.let {
                    app.openURL(it, emptyMap<Any?, Any>(), null)
                }
            }
        }
    }
}

actual fun cacheDir(): String? =
    (NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, true)
        .firstOrNull() as? String)?.plus("/tanken")

actual fun systemLanguage(): String = NSLocale.currentLocale.languageCode

actual fun openUrl(url: String) {
    NSURL.URLWithString(url)?.let {
        UIApplication.sharedApplication.openURL(it, emptyMap<Any?, Any>(), null)
    }
}
