import SwiftUI

/// In-app language setting, mirroring the web app's Sprache picker (Auto → device language).
enum AppLanguage: String, CaseIterable, Identifiable {
    case auto
    case de
    case en

    var id: String { rawValue }
}

/// UI string catalogue. The app ships German + English; the active catalogue follows the in-app
/// Settings choice. Views read it via `@Environment(\.strings)`. No default values on purpose —
/// the memberwise initializer forces both catalogues to define every key.
struct Strings {
    // Tabs
    let tabMap: String
    let tabHistory: String
    let tabStats: String
    let tabSettings: String
    // Map
    let mapSearchPlaceholder: String
    let searchHere: String
    let myLocation: String
    let loadingStations: String
    let noStations: String
    let stationsCountFormat: String
    // Station detail
    let open: String
    let closed: String
    let wholeDay: String
    let openingTimes: String
    let prices: String
    let address: String
    let appleMaps: String
    let googleMaps: String
    // History
    let historyTitle: String
    let historyDescription: String
    let countryDe: String
    let countryAt: String
    let noHistory: String
    let currentAverage: String
    let periodLabel: String
    let days7: String
    let days14: String
    let days30: String
    let allRange: String
    let extremes: String
    let cheapest: String
    let mostExpensive: String
    let spanMinMax: String
    let averageLabel: String
    let pointsLabel: String
    // Stats
    let statsTitle: String
    let statsDescription: String
    let noStats: String
    let average30d: String
    let lowest: String
    let highest: String
    let weekdays: String
    let cheapestTime: String
    let clockSuffix: String
    let cheapestStations: String
    // Settings
    let settingsTitle: String
    let settingsDescription: String
    let feloId: String
    let notLoggedIn: String
    let loginHint: String
    let loginButton: String
    let logout: String
    let server: String
    let apiAddress: String
    let defaultLabel: String
    let reset: String
    let fuel: String
    let appearance: String
    let themeAuto: String
    let themeLight: String
    let themeDark: String
    let language: String
    let langAuto: String
    let about: String
    let version: String
    let viewOnGithub: String
    let madeWithLove: String
    // Common
    let cancel: String
    let apply: String
    let retry: String
    let errorGeneric: String
}

extension Strings {
    static let de = Strings(
        tabMap: "Karte",
        tabHistory: "Verlauf",
        tabStats: "Stats",
        tabSettings: "Einstellungen",
        mapSearchPlaceholder: "Tankstelle oder Ort suchen…",
        searchHere: "Hier suchen",
        myLocation: "Mein Standort",
        loadingStations: "Tankstellen laden…",
        noStations: "Keine Tankstellen gefunden.",
        stationsCountFormat: "%d Tankstellen",
        open: "Geöffnet",
        closed: "Geschlossen",
        wholeDay: "Durchgehend geöffnet",
        openingTimes: "Öffnungszeiten",
        prices: "Preise",
        address: "Adresse",
        appleMaps: "Apple Maps",
        googleMaps: "Google Maps",
        historyTitle: "Preisverlauf",
        historyDescription: "Wie sich die Preise zuletzt entwickelt haben.",
        countryDe: "Deutschland",
        countryAt: "Österreich",
        noHistory: "Keine Verlaufsdaten verfügbar.",
        currentAverage: "Aktueller Durchschnitt",
        periodLabel: "ZEITRAUM",
        days7: "7 Tage",
        days14: "14 Tage",
        days30: "30 Tage",
        allRange: "Alles",
        extremes: "Extremwerte",
        cheapest: "Günstigste",
        mostExpensive: "Teuerste",
        spanMinMax: "Spanne (Min–Max)",
        averageLabel: "Durchschnitt",
        pointsLabel: "Punkte",
        statsTitle: "Statistiken",
        statsDescription: "Wann und wo Tanken am günstigsten ist.",
        noStats: "Keine Statistik verfügbar.",
        average30d: "Durchschnitt (30 Tage)",
        lowest: "Tiefstwert",
        highest: "Höchstwert",
        weekdays: "Wochentage",
        cheapestTime: "Günstigste Tageszeit",
        clockSuffix: " Uhr",
        cheapestStations: "Günstigste Tankstellen (Ø)",
        settingsTitle: "Einstellungen",
        settingsDescription: "Deine App-Einstellungen und dein Konto.",
        feloId: "FELO ID",
        notLoggedIn: "Nicht eingeloggt",
        loginHint: "Melde dich mit deiner Felo-ID an, um Favoriten und Einstellungen zu synchronisieren.",
        loginButton: "Mit Felo-ID anmelden",
        logout: "Abmelden",
        server: "SERVER",
        apiAddress: "API-Adresse",
        defaultLabel: "Standard",
        reset: "Zurücksetzen",
        fuel: "KRAFTSTOFF",
        appearance: "DARSTELLUNG",
        themeAuto: "Auto",
        themeLight: "Hell",
        themeDark: "Dunkel",
        language: "SPRACHE",
        langAuto: "Automatisch",
        about: "ÜBER",
        version: "Version",
        viewOnGithub: "Auf GitHub ansehen",
        madeWithLove: "Gemacht mit ❤️ in Deutschland",
        cancel: "Abbrechen",
        apply: "Übernehmen",
        retry: "Erneut versuchen",
        errorGeneric: "Etwas ist schiefgelaufen."
    )

    static let en = Strings(
        tabMap: "Map",
        tabHistory: "History",
        tabStats: "Stats",
        tabSettings: "Settings",
        mapSearchPlaceholder: "Search station or place…",
        searchHere: "Search here",
        myLocation: "My location",
        loadingStations: "Loading stations…",
        noStations: "No stations found.",
        stationsCountFormat: "%d stations",
        open: "Open",
        closed: "Closed",
        wholeDay: "Open 24 hours",
        openingTimes: "Opening times",
        prices: "Prices",
        address: "Address",
        appleMaps: "Apple Maps",
        googleMaps: "Google Maps",
        historyTitle: "Price history",
        historyDescription: "How prices have developed recently.",
        countryDe: "Germany",
        countryAt: "Austria",
        noHistory: "No history data available.",
        currentAverage: "Current average",
        periodLabel: "RANGE",
        days7: "7 days",
        days14: "14 days",
        days30: "30 days",
        allRange: "All",
        extremes: "Extremes",
        cheapest: "Cheapest",
        mostExpensive: "Priciest",
        spanMinMax: "Range (min–max)",
        averageLabel: "Average",
        pointsLabel: "points",
        statsTitle: "Statistics",
        statsDescription: "When and where refuelling is cheapest.",
        noStats: "No statistics available.",
        average30d: "Average (30 days)",
        lowest: "Lowest",
        highest: "Highest",
        weekdays: "Weekdays",
        cheapestTime: "Cheapest time of day",
        clockSuffix: "",
        cheapestStations: "Cheapest stations (avg)",
        settingsTitle: "Settings",
        settingsDescription: "Your app settings and your account.",
        feloId: "FELO ID",
        notLoggedIn: "Not signed in",
        loginHint: "Sign in with your Felo ID to sync favourites and settings.",
        loginButton: "Sign in with Felo ID",
        logout: "Sign out",
        server: "SERVER",
        apiAddress: "API address",
        defaultLabel: "Default",
        reset: "Reset",
        fuel: "FUEL",
        appearance: "APPEARANCE",
        themeAuto: "Auto",
        themeLight: "Light",
        themeDark: "Dark",
        language: "LANGUAGE",
        langAuto: "Automatic",
        about: "ABOUT",
        version: "Version",
        viewOnGithub: "View on GitHub",
        madeWithLove: "Made with ❤️ in Germany",
        cancel: "Cancel",
        apply: "Apply",
        retry: "Retry",
        errorGeneric: "Something went wrong."
    )

    /// Resolves the catalogue from the persisted setting and the device language.
    static func resolve(_ setting: AppLanguage) -> Strings {
        switch setting {
        case .de: return .de
        case .en: return .en
        case .auto:
            let device = Locale.preferredLanguages.first?.lowercased() ?? "de"
            return device.hasPrefix("en") ? .en : .de
        }
    }
}

private struct StringsKey: EnvironmentKey {
    static let defaultValue: Strings = .resolve(.auto)
}

extension EnvironmentValues {
    var strings: Strings {
        get { self[StringsKey.self] }
        set { self[StringsKey.self] = newValue }
    }
}
