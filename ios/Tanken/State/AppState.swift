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

/// Station list sort mode, mirroring the web's two-mode sort toggle.
enum StationSort: String {
    case price
    case distance
}

struct ToastMessage: Equatable {
    let id: UUID
    let text: String
}

/// Central app state: persisted preferences (UserDefaults), the session token (Keychain), the
/// remote account/config snapshots, favourites and the toast. Injected via `.environment(_:)`.
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
        static let stationSort = "stationSort"
        static let groupByPrice = "groupByPrice"
        static let favouritesOnTop = "favouritesOnTop"
        static let historyDefaultDays = "historyDefaultDays"
    }

    var baseURLString: String {
        didSet { UserDefaults.standard.set(baseURLString, forKey: Keys.baseURL) }
    }

    var fuelType: FuelType {
        didSet {
            UserDefaults.standard.set(fuelType.rawValue, forKey: Keys.fuelType)
            scheduleSettingsSync()
        }
    }

    var appearance: AppearanceSetting {
        didSet {
            UserDefaults.standard.set(appearance.rawValue, forKey: Keys.appearance)
            scheduleSettingsSync()
        }
    }

    var language: AppLanguage {
        didSet {
            UserDefaults.standard.set(language.rawValue, forKey: Keys.language)
            scheduleSettingsSync()
        }
    }

    /// Local-only like the web (not part of the synced settings).
    var stationSort: StationSort {
        didSet { UserDefaults.standard.set(stationSort.rawValue, forKey: Keys.stationSort) }
    }

    /// "Pro Preis nur die nächste Tankstelle" — web default is ON.
    var groupByPrice: Bool {
        didSet {
            UserDefaults.standard.set(groupByPrice, forKey: Keys.groupByPrice)
            scheduleSettingsSync()
        }
    }

    var favouritesOnTop: Bool {
        didSet {
            UserDefaults.standard.set(favouritesOnTop, forKey: Keys.favouritesOnTop)
            scheduleSettingsSync()
        }
    }

    /// Default range of the per-station price chart: 1 = 24 h, 7 = 7 days.
    var historyDefaultDays: Int {
        didSet {
            UserDefaults.standard.set(historyDefaultDays, forKey: Keys.historyDefaultDays)
            scheduleSettingsSync()
        }
    }

    /// Selected history/stats scan location (nil = "Alle Standorte"); shared by both tabs like
    /// the web's synced pickers. Session-only, not persisted.
    var historyLocation: String?
    /// True once the user picked manually — stops the nearest-location auto-pick.
    var historyLocationTouched = false
    /// True while the current selection came from the auto-pick (drives the hint).
    var historyLocationAutoPicked = false

    private(set) var sessionToken: String?

    /// Latest `/api/me` snapshot (nil until fetched).
    var me: MeResponse?
    /// Latest `/api/config` snapshot (nil until fetched).
    var config: PublicConfig?
    /// Favourite station IDs — login-gated like the web (guests get a toast).
    private(set) var favourites: [String] = []
    /// Transient toast message shown above the tab bar.
    private(set) var toast: ToastMessage?

    /// Set while adopting server settings so the didSet observers don't echo them back.
    private var applyingServerSettings = false
    private var settingsSyncTask: Task<Void, Never>?
    private var toastTask: Task<Void, Never>?

    init() {
        let defaults = UserDefaults.standard
        baseURLString = defaults.string(forKey: Keys.baseURL) ?? Self.defaultBaseURL
        fuelType = FuelType(rawValue: defaults.string(forKey: Keys.fuelType) ?? "") ?? .diesel
        appearance = AppearanceSetting(rawValue: defaults.string(forKey: Keys.appearance) ?? "") ?? .auto
        language = AppLanguage(rawValue: defaults.string(forKey: Keys.language) ?? "") ?? .auto
        stationSort = StationSort(rawValue: defaults.string(forKey: Keys.stationSort) ?? "") ?? .price
        groupByPrice = defaults.object(forKey: Keys.groupByPrice) as? Bool ?? true
        favouritesOnTop = defaults.bool(forKey: Keys.favouritesOnTop)
        historyDefaultDays = defaults.object(forKey: Keys.historyDefaultDays) as? Int ?? 7
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

    // MARK: - Favourites (login-gated like the web)

    func isFavourite(_ stationId: String) -> Bool {
        favourites.contains(stationId)
    }

    func toggleFavourite(_ stationId: String) {
        guard isLoggedIn else {
            Haptics.warning()
            showToast(strings.loginRequiredFavourite)
            return
        }
        if let index = favourites.firstIndex(of: stationId) {
            favourites.remove(at: index)
            Haptics.light()
        } else {
            guard favourites.count < 50 else {
                Haptics.warning()
                showToast(strings.maxFavourites)
                return
            }
            favourites.append(stationId)
            Haptics.success()
        }
        let isFav = favourites.contains(stationId)
        let api = api
        Task {
            _ = try? await api.setFavourite(stationId: stationId, isFavourite: isFav)
        }
    }

    // MARK: - History/stats location picker

    /// Defaults the picker to the scan location closest to the user, like the web — only while
    /// the user hasn't chosen manually and nothing is selected yet.
    func autoPickHistoryLocation(from options: [LocationOption]) async {
        guard !historyLocationTouched, historyLocation == nil, !options.isEmpty else { return }
        guard let coordinate = await OneShotLocation().current() else { return }
        guard !historyLocationTouched, historyLocation == nil else { return }
        guard let nearest = LocationPickerData.nearest(in: options, to: coordinate) else { return }
        historyLocation = nearest.id
        historyLocationAutoPicked = true
    }

    // MARK: - Toast

    func showToast(_ text: String) {
        let message = ToastMessage(id: UUID(), text: text)
        withAnimation(.spring(duration: 0.3)) {
            toast = message
        }
        toastTask?.cancel()
        toastTask = Task {
            try? await Task.sleep(for: .seconds(2.5))
            guard !Task.isCancelled else { return }
            withAnimation(.spring(duration: 0.3)) {
                if toast == message {
                    toast = nil
                }
            }
        }
    }

    // MARK: - Session

    func setSessionToken(_ token: String?) {
        sessionToken = token
        Keychain.set(token, for: Keys.sessionToken)
        if token == nil {
            me = nil
            favourites = []
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
            favourites = []
            return
        }
        me = try? await api.me()
        favourites = me?.user?.favourites ?? []
        adoptServerSettings(me?.user?.settings)
    }

    func logout() async {
        await api.logout()
        setSessionToken(nil)
    }

    // MARK: - Settings sync (cloud sync like the web's sync badges)

    private func adoptServerSettings(_ settings: UserSettings?) {
        guard let settings else { return }
        applyingServerSettings = true
        defer { applyingServerSettings = false }
        if let serverFuel = settings.fuelType {
            fuelType = serverFuel
        }
        if let theme = settings.theme, let value = AppearanceSetting(rawValue: theme) {
            appearance = value
        }
        if let lang = settings.lang, let value = AppLanguage(rawValue: lang) {
            language = value
        }
        if let group = settings.groupByPrice {
            groupByPrice = group
        }
        if let favsTop = settings.favouritesOnTop {
            favouritesOnTop = favsTop
        }
        if let days = settings.historyDefaultDays, days == 1 || days == 7 {
            historyDefaultDays = days
        }
    }

    private func scheduleSettingsSync() {
        guard !applyingServerSettings, isLoggedIn else { return }
        settingsSyncTask?.cancel()
        let payload = UserSettings(
            fuelType: fuelType,
            theme: appearance.rawValue,
            lang: language == .auto ? nil : language.rawValue,
            historyDefaultDays: historyDefaultDays,
            favouritesOnTop: favouritesOnTop,
            groupByPrice: groupByPrice
        )
        let api = api
        settingsSyncTask = Task {
            try? await Task.sleep(for: .milliseconds(800))
            guard !Task.isCancelled else { return }
            try? await api.saveSettings(payload)
        }
    }
}
