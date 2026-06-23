package gg.felo.tanken

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import com.russhwolf.settings.Settings
import com.russhwolf.settings.SharedPreferencesSettings
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.SecureStore
import org.koin.dsl.module

/** Android DI: supplies the Context-bound singletons the common graph needs. */
fun androidModule(context: Context) = module {
    single<Settings> {
        SharedPreferencesSettings(context.getSharedPreferences("tanken_prefs", Context.MODE_PRIVATE))
    }
    single<SecureStore> { AndroidSecureStore(context) }
    single<Haptics> { AndroidHaptics(context) }
}

/**
 * SharedPreferences-backed token store. Phase 4 upgrades this to EncryptedSharedPreferences
 * (androidx.security.crypto) once the login flow lands.
 */
private class AndroidSecureStore(context: Context) : SecureStore {
    private val prefs = context.getSharedPreferences("tanken_secure", Context.MODE_PRIVATE)
    override fun getToken(): String? = prefs.getString(KEY, null)
    override fun setToken(value: String?) {
        prefs.edit().apply { if (value == null) remove(KEY) else putString(KEY, value) }.apply()
    }
    override fun clear() = prefs.edit().remove(KEY).apply()

    companion object { private const val KEY = "session_token" }
}

private class AndroidHaptics(context: Context) : Haptics {
    private val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        (context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager)?.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

    private fun buzz(durationMs: Long, amplitude: Int) {
        val v = vibrator ?: return
        if (!v.hasVibrator()) return
        v.vibrate(VibrationEffect.createOneShot(durationMs, amplitude))
    }

    override fun light() = buzz(10, 60)
    override fun medium() = buzz(18, 130)
    override fun heavy() = buzz(28, 255)
    override fun selection() = buzz(8, 40)
    override fun success() = buzz(24, 180)
    override fun warning() = buzz(30, 200)
    override fun error() = buzz(40, 255)
}
