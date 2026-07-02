import SwiftUI
import Observation

enum AppearanceSetting: String, CaseIterable, Identifiable {
    case auto
    case light
    case dark

    var id: String { rawValue }

    var colorScheme: ColorScheme? {
        switch self {
        case .auto: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}

/// Central app state: persisted preferences (UserDefaults), the session token (Keychain) and the
/// remote account/config snapshots. Injected via `.environment(_:)` from the app root.
@MainActor
@Observable
final class AppState {
    static let defaultBaseURL = "https://tanken.felo.gg"

    private enum Keys {
        static let baseURL = "baseURL"
        static let fuelType = "fuelType"
        static let appearance = "appearance"
        static let language = "language"
        static let sessionToken = "sessionToken"
    }

    var baseURLString: String {
        didSet { UserDefaults.standard.set(baseURLString, forKey: Keys.baseURL) }
    }

    var fuelType: FuelType {
        didSet { UserDefaults.standard.set(fuelType.rawValue, forKey: Keys.fuelType) }
    }

    var appearance: AppearanceSetting {
        didSet { UserDefaults.standard.set(appearance.rawValue, forKey: Keys.appearance) }
    }

    var language: AppLanguage {
        didSet { UserDefaults.standard.set(language.rawValue, forKey: Keys.language) }
    }

    private(set) var sessionToken: String?

    /// Latest `/api/me` snapshot (nil until fetched).
    var me: MeResponse?
    /// Latest `/api/config` snapshot (nil until fetched).
    var config: PublicConfig?

    init() {
        let defaults = UserDefaults.standard
        baseURLString = defaults.string(forKey: Keys.baseURL) ?? Self.defaultBaseURL
        fuelType = FuelType(rawValue: defaults.string(forKey: Keys.fuelType) ?? "") ?? .diesel
        appearance = AppearanceSetting(rawValue: defaults.string(forKey: Keys.appearance) ?? "") ?? .auto
        language = AppLanguage(rawValue: defaults.string(forKey: Keys.language) ?? "") ?? .auto
        sessionToken = Keychain.string(for: Keys.sessionToken)
    }

    // MARK: - Derived

    var baseURL: URL {
        let trimmed = baseURLString.trimmingCharacters(in: .whitespacesAndNewlines)
        return URL(string: trimmed) ?? URL(string: Self.defaultBaseURL)!
    }

    var api: ApiClient {
        ApiClient(baseURL: baseURL, sessionToken: sessionToken)
    }

    var strings: Strings {
        .resolve(language)
    }

    var isLoggedIn: Bool {
        me?.authenticated == true
    }

    // MARK: - Session

    func setSessionToken(_ token: String?) {
        sessionToken = token
        Keychain.set(token, for: Keys.sessionToken)
        if token == nil {
            me = nil
        }
    }

    /// Handles the `tanken://auth?token=…` deep link from the OIDC app-login flow.
    func handleURL(_ url: URL) {
        guard url.scheme == "tanken", url.host == "auth" else { return }
        let token = URLComponents(url: url, resolvingAgainstBaseURL: false)?
            .queryItems?
            .first(where: { $0.name == "token" })?
            .value
        guard let token, !token.isEmpty else { return }
        setSessionToken(token)
        Haptics.success()
        Task { await refreshUser() }
    }

    // MARK: - Remote snapshots

    func refreshConfig() async {
        config = try? await api.config()
    }

    func refreshUser() async {
        guard sessionToken != nil else {
            me = nil
            return
        }
        me = try? await api.me()
        if let serverFuel = me?.user?.settings?.fuelType {
            fuelType = serverFuel
        }
    }

    func logout() async {
        await api.logout()
        setSessionToken(nil)
    }
}
