package gg.felo.tanken

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.browser.customtabs.CustomTabsIntent
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.russhwolf.settings.Settings
import com.russhwolf.settings.SharedPreferencesSettings
import gg.felo.tanken.platform.Authenticator
import gg.felo.tanken.platform.Geolocation
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.platform.SecureStore
import kotlinx.coroutines.suspendCancellableCoroutine
import org.koin.dsl.module
import kotlin.coroutines.resume

/** Android DI: supplies the Context-bound singletons the common graph needs. */
fun androidModule(context: Context) = module {
    single<Settings> {
        SharedPreferencesSettings(context.getSharedPreferences("tanken_prefs", Context.MODE_PRIVATE))
    }
    single<SecureStore> { AndroidSecureStore(context) }
    single<Haptics> { AndroidHaptics(context) }
    single<Geolocation> { AndroidGeolocation(context) }
    single<MapsLink> { AndroidMapsLink(context) }
    single<Authenticator> { AndroidAuthenticator(context) }
}

/** Launches OIDC login in a Chrome Custom Tab; the token returns via the tanken://auth deep link. */
private class AndroidAuthenticator(context: Context) : Authenticator {
    private val appContext = context.applicationContext
    override fun login(startUrl: String) {
        val uri = Uri.parse(startUrl)
        runCatching {
            val tabs = CustomTabsIntent.Builder().setShowTitle(true).build()
            tabs.intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            tabs.launchUrl(appContext, uri)
        }.onFailure {
            appContext.startActivity(Intent(Intent.ACTION_VIEW, uri).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) })
        }
    }
}

private class AndroidGeolocation(context: Context) : Geolocation {
    private val appContext = context.applicationContext
    private val client = LocationServices.getFusedLocationProviderClient(appContext)

    private fun hasPermission(): Boolean =
        ContextCompat.checkSelfPermission(appContext, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(appContext, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED

    @Suppress("MissingPermission")
    override suspend fun current(): LatLng? {
        if (!hasPermission()) return null
        val cts = CancellationTokenSource()
        return suspendCancellableCoroutine { cont ->
            client.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, cts.token)
                .addOnSuccessListener { loc -> cont.resume(loc?.let { LatLng(it.latitude, it.longitude) }) }
                .addOnFailureListener { cont.resume(null) }
            cont.invokeOnCancellation { cts.cancel() }
        }
    }
}

private class AndroidMapsLink(context: Context) : MapsLink {
    private val appContext = context.applicationContext
    override val showAppleMaps = false
    override val hasGoogleMaps = true

    override fun openAppleMaps(lat: Double, lng: Double, label: String) = openGoogleMaps(lat, lng, label)

    override fun openGoogleMaps(lat: Double, lng: Double, label: String) {
        val uri = Uri.parse("https://www.google.com/maps/dir/?api=1&destination=$lat,$lng")
        val intent = Intent(Intent.ACTION_VIEW, uri).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            setPackage("com.google.android.apps.maps")
        }
        runCatching { appContext.startActivity(intent) }.onFailure {
            appContext.startActivity(Intent(Intent.ACTION_VIEW, uri).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) })
        }
    }
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
