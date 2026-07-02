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
    let noResults: String
    let stationsCountFormat: String
    // Station list
    let noOpenStations: String
    let sortPrice: String
    let sortDistance: String
    let loginRequiredFavourite: String
    let maxFavourites: String
    // Station detail
    let open: String
    let closed: String
    let wholeDay: String
    let openingTimes: String
    let prices: String
    let address: String
    let appleMaps: String
    let googleMaps: String
    let priceHistory: String
    let range24h: String
    let noChartData: String
    let lastUpdatedFormat: String
    let justNow: String
    let minutesAgoFormat: String
    let hoursAgoFormat: String
    let distanceAwayFormat: String
    // History default setting
    let historyDefaultLabel: String
    let historyDefault24h: String
    let historyDefault7d: String
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
    let hourlyTitle: String
    // Location picker (history + stats)
    let allLocations: String
    let locationAutoPicked: String
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
    // Price alert
    let priceAlert: String
    let notification: String
    let alertBackgroundHint: String
    let threshold: String
    let notificationChannel: String
    let ntfyTopicPlaceholder: String
    let ntfyHint: String
    let emailPlaceholder: String
    let emailHint: String
    let saveAlarm: String
    let sendTestNotification: String
    let alertStatusInactive: String
    let alertStatusActive: String
    let alertLoginRequired: String
    let alertSaved: String
    let testSent: String
    let alertCheapestFormat: String
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
    // History hero + summary (web keys: currentAvg, vsLastWeek, vsLastMonth, summary, …)
    let currentAvg: String
    let vsLastWeek: String
    let vsLastMonth: String
    let summary: String
    let lowestPrice: String
    let highestPrice: String
    let periodToday: String
    let periodLastDaysFormat: String
    let periodSinceFormat: String
    // Stats parity (web keys: avgPrice, priceSpread, measurements, bestTimes, …)
    let avgPrice: String
    let priceSpread: String
    let measurements: String
    let bestTimes: String
    let cheapestDay: String
    let cheapestHourLabel: String
    let vsWorst: String
    let hourRanking: String
    let stationRanking: String
    let dayAbbr: [String]
    let dayNames: [String]
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
        noResults: "Keine Ergebnisse",
        stationsCountFormat: "%d Tankstellen",
        noOpenStations: "Keine offenen Tankstellen gefunden",
        sortPrice: "Preis",
        sortDistance: "Entfernung",
        loginRequiredFavourite: "Zum Speichern von Favoriten bitte anmelden.",
        maxFavourites: "Maximal 50 Favoriten erlaubt",
        open: "Geöffnet",
        closed: "Geschlossen",
        wholeDay: "Rund um die Uhr",
        openingTimes: "Öffnungszeiten",
        prices: "Preise",
        address: "Adresse",
        appleMaps: "Apple Maps",
        googleMaps: "Google Maps",
        priceHistory: "PREISVERLAUF",
        range24h: "24h",
        noChartData: "Keine Verlaufsdaten",
        lastUpdatedFormat: "Zuletzt aktualisiert: %@",
        justNow: "Gerade eben",
        minutesAgoFormat: "vor %d Min.",
        hoursAgoFormat: "vor %d Std.",
        distanceAwayFormat: "%@ entfernt",
        historyDefaultLabel: "Standard-Ansicht",
        historyDefault24h: "24 Stunden",
        historyDefault7d: "7 Tage",
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
        hourlyTitle: "PREIS NACH UHRZEIT",
        allLocations: "Alle Standorte",
        locationAutoPicked: "Automatisch · nächster Standort",
        statsTitle: "Statistiken",
        statsDescription: "Wann und wo Tanken am günstigsten ist.",
        noStats: "Keine Statistik verfügbar.",
        average30d: "Ø 30 Tage",
        lowest: "Tiefstwert",
        highest: "Höchstwert",
        weekdays: "Wochentage",
        cheapestTime: "Günstigste Tageszeit",
        clockSuffix: " Uhr",
        cheapestStations: "Günstigste Tankstellen (Ø)",
        priceAlert: "PREISALARM",
        notification: "Benachrichtigung",
        alertBackgroundHint: "Läuft im Hintergrund, auch wenn die App geschlossen ist.",
        threshold: "Schwellenwert",
        notificationChannel: "Benachrichtigungskanal",
        ntfyTopicPlaceholder: "ntfy Topic (z.B. mein-tankalarm)",
        ntfyHint: "Installiere die ntfy App und abonniere dein Topic.",
        emailPlaceholder: "E-Mail-Adresse",
        emailHint: "Preisalarme werden an diese Adresse gesendet.",
        saveAlarm: "Alarm speichern",
        sendTestNotification: "Test-Benachrichtigung senden",
        alertStatusInactive: "Noch nicht aktiv",
        alertStatusActive: "Aktiv",
        alertLoginRequired: "Melde dich an, um Preisalarme einzurichten.",
        alertSaved: "Alarm gespeichert",
        testSent: "Test gesendet",
        alertCheapestFormat: "Aktuell günstigster Preis: %@",
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
        errorGeneric: "Etwas ist schiefgelaufen.",
        currentAvg: "Aktuell Ø",
        vsLastWeek: "vs. letzte Woche",
        vsLastMonth: "vs. letzter Monat",
        summary: "ZUSAMMENFASSUNG",
        lowestPrice: "Niedrigster Preis",
        highestPrice: "Höchster Preis",
        periodToday: "Heute",
        periodLastDaysFormat: "Letzte %d Tage",
        periodSinceFormat: "Seit %@",
        avgPrice: "Durchschnittspreis",
        priceSpread: "PREISSPANNE",
        measurements: "Messungen",
        bestTimes: "BESTE TANKZEITEN",
        cheapestDay: "Günstigster Wochentag",
        cheapestHourLabel: "Günstigste Uhrzeit",
        vsWorst: "gespart",
        hourRanking: "UHRZEITEN",
        stationRanking: "TANKSTELLEN RANKING",
        dayAbbr: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
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
        noResults: "No results",
        stationsCountFormat: "%d stations",
        noOpenStations: "No open stations found",
        sortPrice: "Price",
        sortDistance: "Distance",
        loginRequiredFavourite: "Sign in to save favourites.",
        maxFavourites: "Maximum of 50 favourites",
        open: "Open",
        closed: "Closed",
        wholeDay: "Open 24 hours",
        openingTimes: "Opening times",
        prices: "Prices",
        address: "Address",
        appleMaps: "Apple Maps",
        googleMaps: "Google Maps",
        priceHistory: "PRICE HISTORY",
        range24h: "24h",
        noChartData: "No history data",
        lastUpdatedFormat: "Last updated: %@",
        justNow: "Just now",
        minutesAgoFormat: "%d min ago",
        hoursAgoFormat: "%d hrs ago",
        distanceAwayFormat: "%@ away",
        historyDefaultLabel: "Default view",
        historyDefault24h: "24 hours",
        historyDefault7d: "7 days",
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
        hourlyTitle: "PRICE BY TIME OF DAY",
        allLocations: "All locations",
        locationAutoPicked: "Auto · nearest location",
        statsTitle: "Statistics",
        statsDescription: "When and where refuelling is cheapest.",
        noStats: "No statistics available.",
        average30d: "Avg (30 days)",
        lowest: "Lowest",
        highest: "Highest",
        weekdays: "Weekdays",
        cheapestTime: "Cheapest time of day",
        clockSuffix: "",
        cheapestStations: "Cheapest stations (avg)",
        priceAlert: "PRICE ALERT",
        notification: "Notification",
        alertBackgroundHint: "Runs in the background, even when the app is closed.",
        threshold: "Threshold",
        notificationChannel: "Notification channel",
        ntfyTopicPlaceholder: "ntfy topic (e.g. my-fuel-alert)",
        ntfyHint: "Install the ntfy app and subscribe to your topic.",
        emailPlaceholder: "Email address",
        emailHint: "Price alerts are sent to this address.",
        saveAlarm: "Save alert",
        sendTestNotification: "Send test notification",
        alertStatusInactive: "Not active yet",
        alertStatusActive: "Active",
        alertLoginRequired: "Sign in to set up price alerts.",
        alertSaved: "Alert saved",
        testSent: "Test sent",
        alertCheapestFormat: "Currently cheapest price: %@",
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
        errorGeneric: "Something went wrong.",
        currentAvg: "Current Avg",
        vsLastWeek: "vs. last week",
        vsLastMonth: "vs. last month",
        summary: "SUMMARY",
        lowestPrice: "Lowest Price",
        highestPrice: "Highest Price",
        periodToday: "Today",
        periodLastDaysFormat: "Last %d days",
        periodSinceFormat: "Since %@",
        avgPrice: "Average Price",
        priceSpread: "PRICE SPREAD",
        measurements: "Measurements",
        bestTimes: "BEST REFUELING TIMES",
        cheapestDay: "Cheapest Day",
        cheapestHourLabel: "Cheapest Hour",
        vsWorst: "saved",
        hourRanking: "HOURS",
        stationRanking: "STATION RANKING",
        dayAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
