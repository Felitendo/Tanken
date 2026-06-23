package gg.felo.tanken.state

import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.PriceAlert
import gg.felo.tanken.net.ApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Price-alert editor backing the Settings alert card. Loads the user's current alert (`/api/alert`),
 * lets them edit threshold / fuel / channel, and saves or deletes it. Requires login.
 */
class AlertViewModel(
    private val api: ApiClient,
    private val config: AppConfig,
) {
    data class UiState(
        val loaded: Boolean = false,
        val exists: Boolean = false,
        val enabled: Boolean = true,
        val threshold: Double = 1.70,
        val fuel: FuelType = FuelType.DIESEL,
        val channel: String = "ntfy",
        val ntfyTopic: String = "",
        val email: String = "",
        val saving: Boolean = false,
        val message: String? = null,
    )

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val _state = MutableStateFlow(UiState(fuel = config.fuelType.value))
    val state: StateFlow<UiState> = _state.asStateFlow()

    fun load() {
        scope.launch {
            val alert = api.getAlert()
            _state.update {
                if (alert != null) {
                    it.copy(
                        loaded = true,
                        exists = true,
                        enabled = alert.enabled,
                        threshold = alert.threshold,
                        fuel = alert.fuel,
                        channel = alert.channel,
                        ntfyTopic = alert.ntfyTopic ?: "",
                        email = alert.email ?: "",
                        message = null,
                    )
                } else {
                    it.copy(loaded = true, exists = false, fuel = config.fuelType.value)
                }
            }
        }
    }

    fun setEnabled(v: Boolean) = _state.update { it.copy(enabled = v) }
    fun setThreshold(v: Double) = _state.update { it.copy(threshold = (v * 1000).toLong() / 1000.0) }
    fun setFuel(f: FuelType) = _state.update { it.copy(fuel = f) }
    fun setChannel(c: String) = _state.update { it.copy(channel = c) }
    fun setNtfyTopic(t: String) = _state.update { it.copy(ntfyTopic = t) }
    fun setEmail(e: String) = _state.update { it.copy(email = e) }

    fun save(onResult: (Boolean) -> Unit) {
        val s = _state.value
        scope.launch {
            _state.update { it.copy(saving = true, message = null) }
            val alert = PriceAlert(
                threshold = s.threshold,
                fuel = s.fuel,
                enabled = s.enabled,
                channel = s.channel,
                ntfyTopic = s.ntfyTopic.takeIf { it.isNotBlank() },
                email = s.email.takeIf { it.isNotBlank() },
            )
            val resp = runCatching { api.saveAlert(alert) }.getOrNull()
            val ok = resp?.ok == true
            _state.update { it.copy(saving = false, exists = ok || it.exists, message = resp?.message) }
            onResult(ok)
        }
    }

    fun delete(onResult: (Boolean) -> Unit) {
        scope.launch {
            val ok = runCatching { api.deleteAlert() }.getOrDefault(false)
            if (ok) _state.update { UiState(loaded = true, exists = false, fuel = config.fuelType.value) }
            onResult(ok)
        }
    }
}
