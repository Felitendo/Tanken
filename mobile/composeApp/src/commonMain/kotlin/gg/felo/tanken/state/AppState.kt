package gg.felo.tanken.state

import com.russhwolf.settings.Settings
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.i18n.StringsDe
import gg.felo.tanken.i18n.StringsEn
import gg.felo.tanken.model.ApiUser
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.PublicConfig
import gg.felo.tanken.model.UserSettings
import gg.felo.tanken.net.ApiClient
import gg.felo.tanken.platform.SecureStore
import gg.felo.tanken.platform.systemLanguage
import gg.felo.tanken.ui.theme.ThemeMode
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

enum class AppLanguage(val code: String) {
    De("de"), En("en");

    companion object {
        fun fromCode(code: String?): AppLanguage = if (code == "en") En else De
    }
}

enum class StationSort { Price, Distance }

/**
 * Central app state: persisted preferences, session token, account snapshot
 * and cross-tab shared selections. Mirrors the PWA's `state` object +
 * localStorage keys, and syncs to `/api/settings` when logged in.
 */
class AppState(
    private val settings: Settings,
    private val secureStore: SecureStore,
    private val scope: CoroutineScope,
) {
    private object Keys {
        const val BASE_URL = "baseUrl"
        const val FUEL = "fuelType"
        const val THEME = "theme"
        const val LANG = "lang"
        const val SORT = "stationSort"
        const val GROUP_BY_PRICE = "groupByPrice"
        const val FAVS_ON_TOP = "favouritesOnTop"
        const val HISTORY_DAYS = "historyDefaultDays"
        const val SESSION_TOKEN = "sessionToken"
        const val FAVOURITES = "favourites"
    }

    companion object {
        const val DEFAULT_BASE_URL = "https://tanken.felo.gg"
    }

    // ---- Persisted preferences ------------------------------------------------------------

    val baseUrl = MutableStateFlow(settings.getString(Keys.BASE_URL, DEFAULT_BASE_URL))
    val fuel = MutableStateFlow(FuelType.fromWire(settings.getStringOrNull(Keys.FUEL)))
    val themeMode = MutableStateFlow(
        when (settings.getStringOrNull(Keys.THEME)) {
            "light" -> ThemeMode.Light
            "dark" -> ThemeMode.Dark
            else -> ThemeMode.Auto
        },
    )
    val language = MutableStateFlow(
        AppLanguage.fromCode(settings.getStringOrNull(Keys.LANG) ?: systemLanguage()),
    )
    val stationSort = MutableStateFlow(
        if (settings.getStringOrNull(Keys.SORT) == "distance") StationSort.Distance else StationSort.Price,
    )
    val groupByPrice = MutableStateFlow(settings.getBoolean(Keys.GROUP_BY_PRICE, false))
    val favouritesOnTop = MutableStateFlow(settings.getBoolean(Keys.FAVS_ON_TOP, false))
    val historyDefaultDays = MutableStateFlow(settings.getInt(Keys.HISTORY_DAYS, 7))

    // ---- Session / account ----------------------------------------------------------------

    private val _sessionToken = MutableStateFlow(secureStore.read(Keys.SESSION_TOKEN))
    val sessionToken: StateFlow<String?> = _sessionToken
    val user = MutableStateFlow<ApiUser?>(null)
    val favourites = MutableStateFlow<Set<String>>(
        settings.getStringOrNull(Keys.FAVOURITES)?.split('\n')?.filter { it.isNotBlank() }?.toSet() ?: emptySet(),
    )
    val config = MutableStateFlow<PublicConfig?>(null)

    /** Strings for the active language. */
    val strings: Strings get() = if (language.value == AppLanguage.En) StringsEn else StringsDe

    val stringsFlow = MutableStateFlow(strings)

    var api: ApiClient? = null

    private var syncJob: Job? = null

    // ---- Mutations (each persists + schedules server sync like the PWA) ---------------------

    fun setBaseUrl(value: String) {
        baseUrl.value = value.trim().ifBlank { DEFAULT_BASE_URL }
        settings.putString(Keys.BASE_URL, baseUrl.value)
    }

    fun setFuel(value: FuelType) {
        fuel.value = value
        settings.putString(Keys.FUEL, value.wire)
        scheduleSettingsSync()
    }

    fun setThemeMode(value: ThemeMode) {
        themeMode.value = value
        settings.putString(
            Keys.THEME,
            when (value) {
                ThemeMode.Auto -> "auto"
                ThemeMode.Light -> "light"
                ThemeMode.Dark -> "dark"
            },
        )
        scheduleSettingsSync()
    }

    fun setLanguage(value: AppLanguage) {
        language.value = value
        stringsFlow.value = strings
        settings.putString(Keys.LANG, value.code)
        scheduleSettingsSync()
    }

    fun setStationSort(value: StationSort) {
        stationSort.value = value
        settings.putString(Keys.SORT, if (value == StationSort.Distance) "distance" else "price")
    }

    fun setGroupByPrice(value: Boolean) {
        groupByPrice.value = value
        settings.putBoolean(Keys.GROUP_BY_PRICE, value)
        scheduleSettingsSync()
    }

    fun setFavouritesOnTop(value: Boolean) {
        favouritesOnTop.value = value
        settings.putBoolean(Keys.FAVS_ON_TOP, value)
        scheduleSettingsSync()
    }

    fun setHistoryDefaultDays(value: Int) {
        historyDefaultDays.value = value
        settings.putInt(Keys.HISTORY_DAYS, value)
        scheduleSettingsSync()
    }

    fun setSessionToken(token: String?) {
        _sessionToken.value = token
        secureStore.write(Keys.SESSION_TOKEN, token)
        if (token == null) {
            user.value = null
        }
    }

    fun setFavourites(ids: Set<String>) {
        favourites.value = ids
        settings.putString(Keys.FAVOURITES, ids.joinToString("\n"))
    }

    val isLoggedIn: Boolean get() = user.value != null

    // ---- Server round-trips ----------------------------------------------------------------

    /** Loads config + me (+favourites/settings when logged in); safe to call on start. */
    suspend fun refreshRemote() {
        val api = api ?: return
        runCatching { config.value = api.config() }
        if (_sessionToken.value != null) {
            val me = runCatching { api.me() }.getOrNull()
            if (me?.authenticated == true) {
                user.value = me.user
                runCatching { api.favourites() }.getOrNull()?.let { setFavourites(it.favourites.toSet()) }
                runCatching { api.settings() }.getOrNull()?.let { applyRemoteSettings(it) }
            } else if (me != null) {
                // Token no longer valid — drop it like the web app drops its cookie.
                setSessionToken(null)
            }
        }
    }

    private fun applyRemoteSettings(remote: UserSettings) {
        remote.fuelType?.let { fuel.value = FuelType.fromWire(it) }
        remote.theme?.let {
            themeMode.value = when (it) {
                "light" -> ThemeMode.Light
                "dark" -> ThemeMode.Dark
                else -> ThemeMode.Auto
            }
        }
        remote.lang?.let {
            language.value = AppLanguage.fromCode(it)
            stringsFlow.value = strings
        }
        remote.historyDefaultDays?.let { historyDefaultDays.value = it }
        remote.favouritesOnTop?.let { favouritesOnTop.value = it }
        remote.groupByPrice?.let { groupByPrice.value = it }
    }

    /** Debounced settings push, mirroring the PWA's sync badge behaviour. */
    private fun scheduleSettingsSync() {
        if (user.value == null) return
        val api = api ?: return
        syncJob?.cancel()
        syncJob = scope.launch {
            delay(800)
            runCatching {
                api.saveSettings(
                    UserSettings(
                        fuelType = fuel.value.wire,
                        theme = when (themeMode.value) {
                            ThemeMode.Auto -> "auto"
                            ThemeMode.Light -> "light"
                            ThemeMode.Dark -> "dark"
                        },
                        lang = language.value.code,
                        historyDefaultDays = historyDefaultDays.value,
                        favouritesOnTop = favouritesOnTop.value,
                        groupByPrice = groupByPrice.value,
                    ),
                )
            }
        }
    }

    suspend fun toggleFavourite(stationId: String): Boolean {
        val api = api ?: return false
        if (user.value == null) return false
        val currently = stationId in favourites.value
        return runCatching {
            val result = if (currently) api.removeFavourite(stationId) else api.addFavourite(stationId)
            setFavourites(result.favourites.toSet())
            true
        }.getOrDefault(false)
    }
}
