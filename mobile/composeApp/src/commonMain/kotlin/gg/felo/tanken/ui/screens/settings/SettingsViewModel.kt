package gg.felo.tanken.ui.screens.settings

import gg.felo.tanken.AppGraph
import gg.felo.tanken.model.LocationRequest
import gg.felo.tanken.model.PriceAlert
import gg.felo.tanken.model.ScanLocation
import gg.felo.tanken.net.ApiException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

/** Settings tab state: account, price alert, scan locations and requests. */
class SettingsViewModel(private val graph: AppGraph) {

    val alert = MutableStateFlow<PriceAlert?>(null)
    val alertLoading = MutableStateFlow(false)
    val scanLocations = MutableStateFlow<List<ScanLocation>>(emptyList())
    val myRequests = MutableStateFlow<List<LocationRequest>>(emptyList())
    val toast = MutableStateFlow<String?>(null)
    val band = MutableStateFlow<gg.felo.tanken.model.PriceBand?>(null)
    val userLocation = MutableStateFlow<gg.felo.tanken.platform.LatLng?>(null)

    private var started = false

    suspend fun start() {
        if (started) return
        started = true
        reloadAlert()
        runCatching { graph.api.scanLocations() }.onSuccess { scanLocations.value = it.locations }
        reloadRequests()
        val user = graph.geolocation.current()
        userLocation.value = user
        if (user != null) {
            runCatching { graph.api.priceBand(graph.state.fuel.value, user.lat, user.lng) }
                .onSuccess { band.value = it.band }
        }
    }

    private val useLocalAlert: Boolean get() = !graph.state.isLoggedIn

    suspend fun reloadAlert() {
        runCatching { graph.api.alert(local = useLocalAlert) }
            .onSuccess { alert.value = it }
    }

    suspend fun reloadRequests() {
        if (!graph.state.isLoggedIn) {
            myRequests.value = emptyList()
            return
        }
        runCatching { graph.api.locationRequests() }.onSuccess { myRequests.value = it.requests }
    }

    fun showToast(text: String) {
        toast.value = text
        graph.mainScope.launch {
            kotlinx.coroutines.delay(2600)
            if (toast.value == text) toast.value = null
        }
    }

    suspend fun saveAlert(next: PriceAlert): Boolean {
        alertLoading.value = true
        return try {
            val saved = graph.api.saveAlert(next, local = useLocalAlert)
            alert.value = saved.alert ?: next
            graph.haptics.success()
            true
        } catch (e: Exception) {
            graph.haptics.error()
            showToast(graph.state.strings.alertFailed)
            false
        } finally {
            alertLoading.value = false
        }
    }

    suspend fun deleteAlert() {
        runCatching { graph.api.deleteAlert(local = useLocalAlert) }
        alert.value = null
    }

    suspend fun sendTest(channel: String, target: String) {
        val strings = graph.state.strings
        try {
            if (channel == "email") {
                graph.api.sendTestEmail(target, "Tanken", "Test-Benachrichtigung von Tanken")
                showToast(strings.testSentEmail)
            } else {
                graph.api.sendTestNotification(target, "Tanken", "Test-Benachrichtigung von Tanken")
                showToast(strings.testSentNtfy)
            }
            graph.haptics.success()
        } catch (e: Exception) {
            graph.haptics.error()
            showToast(strings.alertFailed)
        }
    }

    suspend fun login(): Boolean {
        val base = graph.state.baseUrl.value.trimEnd('/')
        val token = graph.authenticator.login("$base/auth/oidc/start?mode=app&app_redirect=tanken%3A%2F%2Fauth")
        if (token.isNullOrBlank()) return false
        graph.state.setSessionToken(token)
        graph.state.refreshRemote()
        reloadAlert()
        reloadRequests()
        graph.haptics.success()
        return graph.state.isLoggedIn
    }

    suspend fun logout() {
        runCatching { graph.api.logout() }
        graph.state.setSessionToken(null)
        reloadAlert()
        myRequests.value = emptyList()
    }

    suspend fun submitRequest(name: String, lat: Double, lng: Double, radiusKm: Double, note: String?): Boolean {
        return try {
            graph.api.createLocationRequest(name, lat, lng, radiusKm, note)
            reloadRequests()
            graph.haptics.success()
            showToast(graph.state.strings.requestSent)
            true
        } catch (e: ApiException) {
            graph.haptics.error()
            showToast(if (e.loginRequired) graph.state.strings.requestsLoginHint else graph.state.strings.alertFailed)
            false
        } catch (e: Exception) {
            graph.haptics.error()
            false
        }
    }
}
