package gg.felo.tanken.net

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Holds the OIDC session token (the value of the `tank_session` cookie) once the user logs in.
 * The token is persisted via [gg.felo.tanken.platform.SecureStore] and replayed as a Cookie header
 * on every API call by [ApiClient]. Phase 4 wires the login flow that populates it.
 */
class TokenProvider(initial: String? = null) {
    private val _token = MutableStateFlow(initial)
    val token: StateFlow<String?> = _token.asStateFlow()

    val isLoggedIn: Boolean get() = !_token.value.isNullOrBlank()

    fun set(value: String?) {
        _token.value = value?.takeIf { it.isNotBlank() }
    }

    fun clear() {
        _token.value = null
    }
}
