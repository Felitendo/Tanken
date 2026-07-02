import SwiftUI
import MapKit
import CoreLocation
import Observation

/// Equatable coordinate wrapper for camera moves; the token makes repeated requests to the same
/// coordinate distinguishable so `onChange` always fires.
struct RecenterTarget: Equatable {
    let latitude: Double
    let longitude: Double
    let token: UUID

    init(_ coordinate: CLLocationCoordinate2D) {
        latitude = coordinate.latitude
        longitude = coordinate.longitude
        token = UUID()
    }

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

/// Drives the map tab: station + price-band loading around a center or for the visible viewport
/// (debounced), one-shot "locate me", and the current selection. The view injects the current
/// `ApiClient`/`FuelType` via `configure` so base-URL or fuel changes re-point everything.
@MainActor
@Observable
final class MapViewModel: NSObject, CLLocationManagerDelegate {
    var stations: [Station] = []
    var band: PriceBand?
    var loading = false
    var selectedStation: Station?
    /// Set when the map should animate to a new center (user location, search result).
    /// Wrapped so `onChange` fires even when the same coordinate is requested twice.
    var recenterTarget: RecenterTarget?
    /// True once the camera moved away from the last loaded center.
    var showSearchHere = false

    private(set) var api = ApiClient(baseURL: URL(string: AppState.defaultBaseURL)!, sessionToken: nil)
    private(set) var fuel: FuelType = .diesel

    private let locationManager = CLLocationManager()
    private var boundsTask: Task<Void, Never>?
    private var loadTask: Task<Void, Never>?
    private var started = false
    private var lastRegion: MKCoordinateRegion?
    private var bandCenter: CLLocationCoordinate2D?

    /// Auto-fetch viewport stations only when zoomed in at least this far (like the web grid).
    private static let maxAutoSpanDegrees = 0.7

    override init() {
        super.init()
        locationManager.delegate = self
    }

    func configure(api: ApiClient, fuel: FuelType) {
        let fuelChanged = fuel != self.fuel
        self.api = api
        self.fuel = fuel
        if fuelChanged, started {
            reload()
        }
    }

    /// First appearance: locate the user if possible, otherwise load around the last/default center.
    func start() {
        guard !started else { return }
        started = true
        switch locationManager.authorizationStatus {
        case .notDetermined:
            locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            locationManager.requestLocation()
        default:
            loadAround(center: CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515))
        }
    }

    /// "Mein Standort" FAB.
    func requestLocation() {
        switch locationManager.authorizationStatus {
        case .notDetermined:
            locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            locationManager.requestLocation()
        default:
            break
        }
    }

    /// Center-based load: cached scan data if nearby, else a live Tankerkönig/E-Control call.
    func loadAround(center: CLLocationCoordinate2D) {
        loadTask?.cancel()
        boundsTask?.cancel()
        withAnimation(.spring(duration: 0.3)) {
            showSearchHere = false
            loading = true
        }
        let api = api
        let fuel = fuel
        loadTask = Task {
            async let stationsResult = api.stations(lat: center.latitude, lng: center.longitude, fuel: fuel)
            async let bandResult = api.priceBand(fuel: fuel, lat: center.latitude, lng: center.longitude)
            let newStations = (try? await stationsResult) ?? []
            let newBand = try? await bandResult
            guard !Task.isCancelled else { return }
            withAnimation(.spring(duration: 0.45)) {
                stations = newStations
                band = newBand?.band
                loading = false
            }
            bandCenter = center
        }
    }

    /// Called on every camera rest: remembers the region, offers "Hier suchen" and auto-fetches
    /// viewport stations from the cache grid when zoomed in (debounced against camera bursts).
    func cameraChanged(_ region: MKCoordinateRegion) {
        lastRegion = region
        if !showSearchHere {
            withAnimation(.spring(duration: 0.3)) {
                showSearchHere = true
            }
        }
        guard region.span.latitudeDelta <= Self.maxAutoSpanDegrees else { return }
        let api = api
        let fuel = fuel
        boundsTask?.cancel()
        boundsTask = Task {
            try? await Task.sleep(for: .milliseconds(400))
            guard !Task.isCancelled else { return }
            let south = region.center.latitude - region.span.latitudeDelta / 2
            let north = region.center.latitude + region.span.latitudeDelta / 2
            let west = region.center.longitude - region.span.longitudeDelta / 2
            let east = region.center.longitude + region.span.longitudeDelta / 2
            guard let result = try? await api.stationsInBounds(south: south, west: west, north: north, east: east, fuel: fuel),
                  !Task.isCancelled, !result.isEmpty else { return }
            withAnimation(.spring(duration: 0.45)) {
                stations = result
            }
            refreshBandIfMoved(center: region.center)
        }
    }

    /// "Hier suchen" pill at the current camera position.
    func searchHere() {
        guard let region = lastRegion else { return }
        loadAround(center: region.center)
    }

    func reload() {
        if let region = lastRegion {
            loadAround(center: region.center)
        } else {
            start()
        }
    }

    func select(_ station: Station?) {
        withAnimation(.spring(duration: 0.3)) {
            selectedStation = station
        }
    }

    /// Stations sorted like the web default: price ascending, unknown prices last, distance breaks ties.
    var sortedStations: [Station] {
        stations.sorted { a, b in
            switch (a.price, b.price) {
            case let (pa?, pb?):
                if pa != pb { return pa < pb }
                return (a.dist ?? .infinity) < (b.dist ?? .infinity)
            case (nil, nil):
                return (a.dist ?? .infinity) < (b.dist ?? .infinity)
            case (nil, _):
                return false
            case (_, nil):
                return true
            }
        }
    }

    private func refreshBandIfMoved(center: CLLocationCoordinate2D) {
        // The band covers a ~100 km radius; refresh it once the viewport drifts far away.
        if let bandCenter {
            let moved = CLLocation(latitude: center.latitude, longitude: center.longitude)
                .distance(from: CLLocation(latitude: bandCenter.latitude, longitude: bandCenter.longitude))
            guard moved > 50_000 else { return }
        }
        bandCenter = center
        let api = api
        let fuel = fuel
        Task {
            guard let response = try? await api.priceBand(fuel: fuel, lat: center.latitude, lng: center.longitude) else { return }
            withAnimation(.spring(duration: 0.45)) {
                band = response.band
            }
        }
    }

    // MARK: - CLLocationManagerDelegate

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus
        if status == .authorizedWhenInUse || status == .authorizedAlways {
            manager.requestLocation()
        } else if status == .denied || status == .restricted, started, stations.isEmpty {
            loadAround(center: CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515))
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        recenterTarget = RecenterTarget(location.coordinate)
        loadAround(center: location.coordinate)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if stations.isEmpty {
            loadAround(center: CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515))
        }
    }
}
