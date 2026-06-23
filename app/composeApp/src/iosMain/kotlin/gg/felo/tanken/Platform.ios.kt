package gg.felo.tanken

import com.russhwolf.settings.NSUserDefaultsSettings
import com.russhwolf.settings.Settings
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.SecureStore
import org.koin.dsl.module
import platform.Foundation.NSUserDefaults
import platform.UIKit.UIImpactFeedbackGenerator
import platform.UIKit.UIImpactFeedbackStyle
import platform.UIKit.UINotificationFeedbackGenerator
import platform.UIKit.UINotificationFeedbackType
import platform.UIKit.UISelectionFeedbackGenerator

/** iOS DI: UIKit haptics, NSUserDefaults-backed settings, token store. */
fun iosModule() = module {
    single<Settings> { NSUserDefaultsSettings(NSUserDefaults.standardUserDefaults) }
    single<SecureStore> { IosSecureStore() }
    single<Haptics> { IosHaptics() }
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
