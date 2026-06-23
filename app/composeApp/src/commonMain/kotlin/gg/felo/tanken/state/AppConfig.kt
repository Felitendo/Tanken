package gg.felo.tanken.state

import com.russhwolf.settings.Settings
import com.russhwolf.settings.get
import com.russhwolf.settings.set
import gg.felo.tanken.model.FuelType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * App-wide, persisted configuration. The base URL points the whole API client at a
 * Tanken backend; it defaults to the public instance and is user-editable in Settings.
 */
class AppConfig(private val settings: Settings) {

    private val _baseUrl = MutableStateFlow(normalizeBaseUrl(settings[KEY_BASE_URL, DEFAULT_BASE_URL]))
    val baseUrl: StateFlow<String> = _baseUrl.asStateFlow()

    private val _fuelType = MutableStateFlow(FuelType.fromWire(settings[KEY_FUEL, FuelType.DIESEL.wire]))
    val fuelType: StateFlow<FuelType> = _fuelType.asStateFlow()

    private val _themeMode = MutableStateFlow(settings[KEY_THEME, ThemeMode.AUTO.name])
    val themeMode: StateFlow<String> = _themeMode.asStateFlow()

    fun setBaseUrl(raw: String) {
        val normalized = normalizeBaseUrl(raw)
        settings[KEY_BASE_URL] = normalized
        _baseUrl.value = normalized
    }

    fun resetBaseUrl() = setBaseUrl(DEFAULT_BASE_URL)

    fun setFuelType(fuel: FuelType) {
        settings[KEY_FUEL] = fuel.wire
        _fuelType.value = fuel
    }

    fun setThemeMode(mode: ThemeMode) {
        settings[KEY_THEME] = mode.name
        _themeMode.value = mode.name
    }

    companion object {
        const val DEFAULT_BASE_URL = "https://tanken.felo.gg"
        private const val KEY_BASE_URL = "base_url"
        private const val KEY_FUEL = "fuel_type"
        private const val KEY_THEME = "theme_mode"

        /** Trim trailing slashes and whitespace; tolerate a missing scheme. */
        fun normalizeBaseUrl(input: String): String {
            var v = input.trim()
            if (v.isEmpty()) return DEFAULT_BASE_URL
            if (!v.startsWith("http://") && !v.startsWith("https://")) v = "https://$v"
            while (v.endsWith("/")) v = v.dropLast(1)
            return v
        }
    }
}

enum class ThemeMode { AUTO, LIGHT, DARK }
