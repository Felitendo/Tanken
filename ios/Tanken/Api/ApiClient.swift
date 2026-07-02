import Foundation

struct ApiError: Error, LocalizedError {
    let status: Int
    let body: String

    var errorDescription: String? { "API error \(status): \(body.prefix(200))" }
}

/// Single entry point for all backend communication. A fresh value is created per call site from
/// `AppState.api`, so changing the base URL or session token re-points everything immediately.
/// Authenticated endpoints replay the signed session token as the `tank_session` cookie header —
/// the same session mechanism the website uses.
struct ApiClient {
    var baseURL: URL
    var sessionToken: String?

    private static let decoder = JSONDecoder()
    private static let encoder = JSONEncoder()

    private static let session: URLSession = {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = 20
        config.httpShouldSetCookies = false
        config.httpCookieAcceptPolicy = .never
        return URLSession(configuration: config)
    }()

    // MARK: - Public, unauthenticated endpoints

    func stations(lat: Double, lng: Double, fuel: FuelType, location: String? = nil) async throws -> [Station] {
        var query = [
            URLQueryItem(name: "lat", value: String(lat)),
            URLQueryItem(name: "lng", value: String(lng)),
            URLQueryItem(name: "fuel", value: fuel.rawValue),
        ]
        if let location {
            query.append(URLQueryItem(name: "location", value: location))
        }
        return try await get("/api/stations", query: query)
    }

    func stationsInBounds(south: Double, west: Double, north: Double, east: Double, fuel: FuelType) async throws -> [Station] {
        try await get("/api/stations", query: [
            URLQueryItem(name: "bounds", value: "\(south),\(west),\(north),\(east)"),
            URLQueryItem(name: "fuel", value: fuel.rawValue),
        ])
    }

    /// Name/brand/place search across all cached stations (max 8 results).
    func searchStations(query: String, fuel: FuelType, lat: Double? = nil, lng: Double? = nil) async throws -> [Station] {
        var items = [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "fuel", value: fuel.rawValue),
        ]
        if let lat, let lng {
            items.append(URLQueryItem(name: "lat", value: String(lat)))
            items.append(URLQueryItem(name: "lng", value: String(lng)))
        }
        return try await get("/api/stations/search", query: items)
    }

    func priceBand(fuel: FuelType, lat: Double, lng: Double, radiusKm: Double? = nil) async throws -> PriceBandResponse {
        var query = [
            URLQueryItem(name: "fuel", value: fuel.rawValue),
            URLQueryItem(name: "lat", value: String(lat)),
            URLQueryItem(name: "lng", value: String(lng)),
        ]
        if let radiusKm {
            query.append(URLQueryItem(name: "radius", value: String(radiusKm)))
        }
        return try await get("/api/price-band", query: query)
    }

    func stationDetail(id: String) async throws -> StationDetail {
        try await get("/api/station/\(id)")
    }

    func history(location: String? = nil, country: Country) async throws -> HistoryResponse {
        var query = [URLQueryItem(name: "country", value: country.rawValue)]
        if let location {
            query.append(URLQueryItem(name: "location", value: location))
        }
        return try await get("/api/history", query: query)
    }

    /// Per-station history for the detail chart. With ≥2 points the server returns a raw array;
    /// otherwise it falls back to the aggregate `{entries, extremes}` object.
    func stationHistory(name: String, id: String?, fuel: FuelType) async throws -> [HistoryEntry] {
        var query = [
            URLQueryItem(name: "station", value: name),
            URLQueryItem(name: "fuel", value: fuel.rawValue),
        ]
        if let id {
            query.append(URLQueryItem(name: "id", value: id))
        }
        let (data, response) = try await Self.session.data(for: request("/api/history", query: query))
        try Self.check(response, data: data)
        if let entries = try? Self.decoder.decode([HistoryEntry].self, from: data) {
            return entries
        }
        let fallback = try Self.decoder.decode(HistoryResponse.self, from: data)
        return fallback.entries ?? []
    }

    func historyLocations(country: Country) async throws -> HistoryLocationsResponse {
        try await get("/api/history", query: [
            URLQueryItem(name: "locations", value: "list"),
            URLQueryItem(name: "country", value: country.rawValue),
        ])
    }

    func stats(location: String? = nil, country: Country) async throws -> HistoryStats {
        var query = [URLQueryItem(name: "country", value: country.rawValue)]
        if let location {
            query.append(URLQueryItem(name: "location", value: location))
        }
        return try await get("/api/stats", query: query)
    }

    func scanLocations() async throws -> ScanLocationsResponse {
        try await get("/api/scan-locations")
    }

    func config() async throws -> PublicConfig {
        try await get("/api/config")
    }

    /// Auth-required Nominatim proxy.
    func geocode(query: String, lang: String = "de") async throws -> GeocodeResponse {
        try await get("/api/geocode", query: [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "lang", value: lang),
        ])
    }

    // MARK: - Authenticated endpoints

    func me() async throws -> MeResponse {
        try await get("/api/me")
    }

    /// Best-effort logout; the local token is dropped regardless.
    func logout() async {
        _ = try? await send("/api/logout", method: "POST")
    }

    func settings() async throws -> UserSettings {
        try await get("/api/settings")
    }

    func saveSettings(_ settings: UserSettings) async throws {
        _ = try await send("/api/settings", method: "POST", body: settings)
    }

    func favourites() async throws -> [String] {
        let response: FavouritesResponse = try await get("/api/favourites")
        return response.favourites ?? []
    }

    func setFavourite(stationId: String, isFavourite: Bool) async throws -> [String] {
        struct Body: Encodable { let stationId: String }
        let data = try await send(
            "/api/favourites",
            method: isFavourite ? "POST" : "DELETE",
            body: Body(stationId: stationId)
        )
        let response = try Self.decoder.decode(FavouritesResponse.self, from: data)
        return response.favourites ?? []
    }

    func alert() async throws -> PriceAlert? {
        try? await get("/api/alert")
    }

    func saveAlert(_ alert: PriceAlert) async throws -> AlertResponse {
        let data = try await send("/api/alert", method: "POST", body: alert)
        return try Self.decoder.decode(AlertResponse.self, from: data)
    }

    func deleteAlert() async throws {
        _ = try await send("/api/alert", method: "DELETE")
    }

    /// Fires a test push through the server's ntfy proxy (`POST /api/alert/notify`).
    func sendTestNotification(topic: String, title: String, message: String) async throws {
        struct Body: Encodable {
            let topic: String
            let title: String
            let message: String
        }
        _ = try await send("/api/alert/notify", method: "POST", body: Body(topic: topic, title: title, message: message))
    }

    // MARK: - Plumbing

    private func url(_ path: String, query: [URLQueryItem]) throws -> URL {
        guard var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: false) else {
            throw ApiError(status: 0, body: "invalid base url")
        }
        components.path = components.path.hasSuffix("/")
            ? String(components.path.dropLast()) + path
            : components.path + path
        if !query.isEmpty {
            components.queryItems = query
        }
        guard let url = components.url else {
            throw ApiError(status: 0, body: "invalid url for \(path)")
        }
        return url
    }

    private func request(_ path: String, query: [URLQueryItem] = [], method: String = "GET") throws -> URLRequest {
        var request = URLRequest(url: try url(path, query: query))
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let sessionToken, !sessionToken.isEmpty {
            request.setValue("tank_session=\(sessionToken)", forHTTPHeaderField: "Cookie")
        }
        return request
    }

    private func get<T: Decodable>(_ path: String, query: [URLQueryItem] = []) async throws -> T {
        let (data, response) = try await Self.session.data(for: request(path, query: query))
        try Self.check(response, data: data)
        return try Self.decoder.decode(T.self, from: data)
    }

    @discardableResult
    private func send(_ path: String, method: String, body: (some Encodable)? = Optional<Int>.none) async throws -> Data {
        var urlRequest = try request(path, method: method)
        if let body {
            urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
            urlRequest.httpBody = try Self.encoder.encode(body)
        }
        let (data, response) = try await Self.session.data(for: urlRequest)
        try Self.check(response, data: data)
        return data
    }

    private static func check(_ response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else { return }
        guard (200..<300).contains(http.statusCode) else {
            throw ApiError(status: http.statusCode, body: String(data: data, encoding: .utf8) ?? "")
        }
    }
}
