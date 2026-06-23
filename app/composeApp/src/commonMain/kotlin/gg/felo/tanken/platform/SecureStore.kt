package gg.felo.tanken.platform

/**
 * Secure persistence for the OIDC session token. iOS → Keychain, Android → EncryptedSharedPreferences.
 * Phase 4 (login) reads/writes the token here; [gg.felo.tanken.net.TokenProvider] mirrors it in memory.
 */
interface SecureStore {
    fun getToken(): String?
    fun setToken(value: String?)
    fun clear()
}

/** In-memory fallback for previews / tests. */
class InMemorySecureStore : SecureStore {
    private var token: String? = null
    override fun getToken(): String? = token
    override fun setToken(value: String?) { token = value }
    override fun clear() { token = null }
}
