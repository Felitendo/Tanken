package gg.felo.tanken.platform

/**
 * Launches the OIDC login flow in an in-app browser. iOS uses ASWebAuthenticationSession (it returns
 * the `tanken://auth?token=…` callback directly); Android uses Chrome Custom Tabs and the token
 * arrives via the `tanken://auth` deep link handled by MainActivity. Both then call
 * [gg.felo.tanken.state.UserViewModel.completeLogin]. Provided per-platform via Koin.
 */
interface Authenticator {
    fun login(startUrl: String)
}

object NoAuthenticator : Authenticator {
    override fun login(startUrl: String) {}
}
