package gg.felo.tanken.state

import gg.felo.tanken.model.SanitizedUser
import gg.felo.tanken.net.ApiClient
import gg.felo.tanken.net.TokenProvider
import gg.felo.tanken.platform.Authenticator
import gg.felo.tanken.platform.SecureStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Authentication state. Triggers the OIDC login flow, persists the returned session token, and
 * exposes the signed-in user (for the Settings account card + to gate alerts/favourites).
 * Registered as a Koin singleton so the deep-link handler and Settings screen share one instance.
 */
class UserViewModel(
    private val api: ApiClient,
    private val tokens: TokenProvider,
    private val secure: SecureStore,
    private val config: AppConfig,
    private val authenticator: Authenticator,
) {
    data class UiState(
        val user: SanitizedUser? = null,
        val loggedIn: Boolean = false,
        val loading: Boolean = false,
    )

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state.asStateFlow()

    private var started = false

    fun start() {
        if (started) return
        started = true
        if (tokens.isLoggedIn) refresh()
    }

    fun login() {
        val url = config.baseUrl.value + "/auth/oidc/start?mode=app&app_redirect=$APP_REDIRECT_ENCODED"
        authenticator.login(url)
    }

    /** Called by the platform login flow (iOS session completion / Android deep link). */
    fun completeLogin(token: String) {
        if (token.isBlank()) return
        secure.setToken(token)
        tokens.set(token)
        refresh()
    }

    fun logout() {
        scope.launch {
            runCatching { api.logout() }
            secure.clear()
            tokens.clear()
            _state.value = UiState()
        }
    }

    private fun refresh() {
        scope.launch {
            _state.update { it.copy(loading = true) }
            val me = runCatching { api.me() }.getOrNull()
            _state.update {
                it.copy(
                    user = me?.user,
                    loggedIn = me?.authenticated == true && me.user != null,
                    loading = false,
                )
            }
        }
    }

    companion object {
        // tanken://auth
        private const val APP_REDIRECT_ENCODED = "tanken%3A%2F%2Fauth"
    }
}
