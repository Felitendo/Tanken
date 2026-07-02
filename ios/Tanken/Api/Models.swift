import Foundation

/// Mirrors the web app's `FuelType` (src/types.ts). Raw values are the API wire values.
enum FuelType: String, Codable, CaseIterable, Identifiable, Hashable {
    case diesel
    case e5
    case e10

    var id: String { rawValue }

    /// Human label shown in the UI (not localized — same on the website in both languages).
    var label: String {
        switch self {
        case .diesel: return "Diesel"
        case .e5: return "Super E5"
        case .e10: return "Super E10"
        }
    }
}

/// History/stats country scope, mirroring the web app's country chips.
enum Country: String, Codable, CaseIterable, Identifiable, Hashable {
    case de
    case at

    var id: String { rawValue }
    var flag: String { self == .de ? "🇩🇪" : "🇦🇹" }
}

/// A fuel station + price, as returned by `GET /api/stations` (lib/station-cache.ts CachedStation).
/// Everything the server might omit is optional so decoding never fails on sparse rows.
struct Station: Codable, Identifiable, Hashable {
    let id: String
    var name: String?
    var brand: String?
    var street: String?
    var houseNumber: String?
    var postCode: String?
    var place: String?
    var lat: Double
    var lng: Double
    var dist: Double?
    var distApprox: Bool?
    var price: Double?
    var isOpen: Bool?
    /// Distance from the planned route polyline in km (only present on `/api/route` corridor results).
    var routeDistKm: Double?

    /// Brand if present, else the station name (matches the web list rendering).
    var displayBrand: String {
        if let brand, !brand.isEmpty { return brand }
        return name ?? ""
    }

    var addressLine: String {
        var line = street ?? ""
        if let houseNumber, !houseNumber.isEmpty { line += " \(houseNumber)" }
        return line.trimmingCharacters(in: .whitespaces)
    }

    var cityLine: String {
        [postCode, place].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " ")
    }
}

/// Regional price band used to color stations (`GET /api/price-band`).
struct PriceBand: Codable, Hashable {
    var p10: Double
    var p50: Double
    var p90: Double
    var samples: Int?
}

struct PriceBandResponse: Codable {
    var fuel: String?
    var band: PriceBand?
    var radiusKm: Double?
    var generatedAt: String?
}

/// Station detail (`GET /api/station/:id`) — all three fuel prices + opening times.
struct StationDetail: Codable {
    var id: String?
    var name: String?
    var brand: String?
    var street: String?
    var houseNumber: String?
    var postCode: String?
    var place: String?
    var lat: Double?
    var lng: Double?
    var e5: Double?
    var e10: Double?
    var diesel: Double?
    var isOpen: Bool?
    var openingTimes: [OpeningTime]?
    var wholeDay: Bool?

    func price(for fuel: FuelType) -> Double? {
        switch fuel {
        case .diesel: return diesel
        case .e5: return e5
        case .e10: return e10
        }
    }
}

struct OpeningTime: Codable, Hashable {
    var text: String?
    var start: String?
    var end: String?
}

/// A history aggregate point (`GET /api/history`).
struct HistoryEntry: Codable, Hashable {
    var timestamp: String
    var minPrice: Double
    var avgPrice: Double
    var maxPrice: Double
    var station: String?
    var numStations: Int?
    var locationId: String?

    enum CodingKeys: String, CodingKey {
        case timestamp
        case minPrice = "min_price"
        case avgPrice = "avg_price"
        case maxPrice = "max_price"
        case station
        case numStations = "num_stations"
        case locationId = "location_id"
    }
}

struct PriceExtreme: Codable, Hashable {
    var stationName: String?
    var stationId: String?
    var stationBrand: String?
    var price: Double
    var timestamp: String?

    enum CodingKeys: String, CodingKey {
        case stationName = "station_name"
        case stationId = "station_id"
        case stationBrand = "station_brand"
        case price
        case timestamp
    }
}

struct HistoryExtremes: Codable {
    var cheapest: PriceExtreme?
    var mostExpensive: PriceExtreme?
}

struct HistoryResponse: Codable {
    var entries: [HistoryEntry]?
    var extremes: HistoryExtremes?
}

struct HistoryLocationsResponse: Codable {
    var locations: [String]?
}

/// Aggregate statistics (`GET /api/stats`) — 30-day window.
struct HistoryStats: Codable {
    var dayAvgs: [DayAvg]?
    var hourAvgs: [HourAvg]?
    var stationRanking: [StationRank]?
    var overall: StatsOverall?
}

struct DayAvg: Codable, Hashable {
    var day: Int
    var name: String?
    var avg: Double
    var count: Int?
}

struct HourAvg: Codable, Hashable {
    var hour: Int
    var avg: Double
    var count: Int?
}

struct StationRank: Codable, Hashable {
    var station: String?
    var avg: Double
    var min: Double?
    var count: Int?
    var id: String?
    var brand: String?
}

struct StatsOverall: Codable {
    var lowestEver: Double?
    var highestEver: Double?
    var avg: Double?
    var entries: Int?
    var since: String?
    var until: String?

    enum CodingKeys: String, CodingKey {
        case lowestEver = "lowest_ever"
        case highestEver = "highest_ever"
        case avg
        case entries
        case since
        case until
    }
}

/// Admin-curated scan location (`GET /api/scan-locations`).
struct ScanLocation: Codable, Identifiable, Hashable {
    let id: String
    var name: String?
    var country: String?
    var lat: Double
    var lng: Double
    var radiusKm: Double?
    var fuelType: FuelType?
}

struct ScanLocationsResponse: Codable {
    var locations: [ScanLocation]?
}

/// Price alert (`/api/alert`), mirrors src/types.ts PriceAlert.
struct PriceAlert: Codable {
    var threshold: Double
    var fuel: FuelType
    var enabled: Bool
    var channel: String
    var ntfyTopic: String? = nil
    var email: String? = nil
    var lat: Double? = nil
    var lng: Double? = nil
    var radiusKm: Double? = nil
    var lastNotifiedAt: String? = nil
    var lastNotifiedPrice: Double? = nil
    var created: String? = nil
    var updated: String? = nil
}

struct AlertResponse: Codable {
    var ok: Bool?
    var alert: PriceAlert?
    var message: String?
}

/// User settings, mirrors src/types.ts UserSettings (subset the app touches).
struct UserSettings: Codable {
    var fuelType: FuelType?
    var theme: String?
    var lang: String?
    var historyDefaultDays: Int?
    var favouritesOnTop: Bool?
    var groupByPrice: Bool?
}

/// Sanitized user (`GET /api/me`).
struct SanitizedUser: Codable {
    var id: String?
    var displayName: String?
    var username: String?
    var email: String?
    var photoUrl: String?
    var settings: UserSettings?
    var favourites: [String]?
    /// "oidc" for SSO accounts — location requests are limited to those (like the web).
    var authProvider: String?
}

struct AuthInfo: Codable {
    var provider: String?
    var configured: Bool?
}

struct MeResponse: Codable {
    var authenticated: Bool?
    var user: SanitizedUser?
    var auth: AuthInfo?
}

struct FavouritesResponse: Codable {
    var favourites: [String]?
}

/// Public configuration (`GET /api/config`).
struct PublicConfig: Codable {
    var smtpConfigured: Bool?
    var fuelType: FuelType?
    var radiusKm: Double?
    var thresholds: Thresholds?
    var auth: PublicAuthConfig?

    enum CodingKeys: String, CodingKey {
        case smtpConfigured
        case fuelType = "fuel_type"
        case radiusKm = "radius_km"
        case thresholds
        case auth
    }
}

struct Thresholds: Codable {
    var goodBelowAvgCents: Double?
    var okayBelowAvgCents: Double?

    enum CodingKeys: String, CodingKey {
        case goodBelowAvgCents = "good_below_avg_cents"
        case okayBelowAvgCents = "okay_below_avg_cents"
    }
}

struct PublicAuthConfig: Codable {
    var provider: String?
    var oidcConfigured: Bool?
    var issuerUrl: String?
    var oidcName: String?
    var sessionCookie: String?
}

/// Geocode result row (`GET /api/geocode`, auth required).
struct GeocodeResult: Codable, Hashable {
    var name: String?
    var lat: Double
    var lng: Double
}

struct GeocodeResponse: Codable {
    var results: [GeocodeResult]?
}

// MARK: - Route planner (`POST /api/route`, auth required)

/// Driving route polyline as returned by the ORS proxy.
/// `coordinates` are `[lng, lat]` pairs (ORS/GeoJSON order) — swap when mapping to CoreLocation.
struct RoutePolyline: Codable, Hashable {
    var coordinates: [[Double]]
    var distanceKm: Double
    var durationMin: Double
}

/// A coverage-gap point along the route the client should scan via `/api/route/scan-point`.
struct RouteScanPoint: Codable, Hashable {
    var lat: Double
    var lng: Double
}

struct RouteResponse: Codable {
    var route: RoutePolyline?
    var stations: [Station]?
    var bufferKm: Double?
    var scanPoints: [RouteScanPoint]?
}

/// Result of a single corridor scan (`POST /api/route/scan-point`).
/// A 429 is mapped to `rateLimited` by the client instead of throwing.
struct RouteScanResult: Codable {
    var ok: Bool?
    var stationsFound: Int?
    var rateLimited: Bool?
    var error: String?
}

// MARK: - Location requests (`/api/location-requests`, auth required)

/// A user-submitted request for a new scan location (src/types.ts LocationRequest).
struct LocationRequest: Codable, Identifiable, Hashable {
    let id: String
    var name: String?
    var lat: Double
    var lng: Double
    var radiusKm: Double?
    var note: String?
    var status: String?
    var adminNote: String?
    var createdAt: String?
}

struct LocationRequestsResponse: Codable {
    var requests: [LocationRequest]?
}

struct LocationRequestCreateResponse: Codable {
    var request: LocationRequest?
}
