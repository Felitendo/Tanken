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

/// Drives the map tab: station + price-band loading around a center or for the visible viewport,
/// one-shot "locate me", and the current selection. Viewport refreshes are threshold-gated and
/// silent so the list stays calm while the user pans; explicit loads show the loading state.
@MainActor
@Observable
final class MapViewModel: NSObject, CLLocationManagerDelegate {
    var stations: [Station] = []
    var band: PriceBand?
    /// True only during explicit loads (start, locate-me, search, "Hier suchen") — background
    /// viewport refreshes stay silent to avoid list flicker.
    var loading = false
    var selectedStation: Station?
    /// Set when the map should animate to a new center (user location, search result).
    var recenterTarget: RecenterTarget?
    /// True once the camera moved meaningfully away from the last loaded center.
    var showSearchHere = false
    /// While a route is active, viewport fetches and "Hier suchen" are paused so the corridor
    /// station list stays put (web: `state.routeActive` guard in refreshMapData).
    var routeModeActive = false

    /// When the currently shown station data was fetched — feeds the detail's "Zuletzt
    /// aktualisiert" row like the web's dataTimestamp.
    private(set) var lastDataAt: Date?

    private(set) var api = ApiClient(baseURL: URL(string: AppState.defaultBaseURL)!, sessionToken: nil)
    private(set) var fuel: FuelType = .diesel

    private let locationManager = CLLocationManager()
    private var boundsTask: Task<Void, Never>?
    private var loadTask: Task<Void, Never>?
    private var started = false
    private(set) var lastRegion: MKCoordinateRegion?
    private var lastLoadedCenter: CLLocationCoordinate2D?
    private var lastBoundsFetchRegion: MKCoordinateRegion?
    private var bandCenter: CLLocationCoordinate2D?
    /// Camera-rest events caused by our own recenter animations are consumed once so they don't
    /// pop the "Hier suchen" pill or trigger a redundant viewport fetch.
    private var suppressNextCameraEvent = false

    /// Last known device location (route planner "Aktueller Standort" shortcut).
    var userCoordinate: CLLocationCoordinate2D? {
        locationManager.location?.coordinate
    }

    private static let fallbackCenter = CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515)
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

    /// First appearance: locate the user if possible, otherwise load around the default center.
    func start() {
        guard !started else { return }
        started = true
        switch locationManager.authorizationStatus {
        case .notDetermined:
            locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            locationManager.requestLocation()
        default:
            loadAround(center: Self.fallbackCenter)
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

    /// Programmatic camera move — flags the resulting camera-rest event as self-inflicted.
    func recenter(to coordinate: CLLocationCoordinate2D) {
        suppressNextCameraEvent = true
        recenterTarget = RecenterTarget(coordinate)
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
            withAnimation(.easeInOut(duration: 0.25)) {
                stations = newStations
                band = newBand?.band
                loading = false
            }
            lastLoadedCenter = center
            lastBoundsFetchRegion = nil
            bandCenter = center
            lastDataAt = Date()
        }
    }

    /// Called on every camera rest. Programmatic moves are consumed; user pans offer "Hier suchen"
    /// once they leave the loaded area and silently refresh viewport stations when the view moved
    /// far enough from the last fetch (no loading UI, no reshuffle animation churn).
    func cameraChanged(_ region: MKCoordinateRegion) {
        lastRegion = region
        if suppressNextCameraEvent {
            suppressNextCameraEvent = false
            return
        }
        guard !routeModeActive else { return }

        if !showSearchHere, movedMeters(from: lastLoadedCenter, to: region.center) > 2_000 {
            withAnimation(.spring(duration: 0.3)) {
                showSearchHere = true
            }
        }

        guard region.span.latitudeDelta <= Self.maxAutoSpanDegrees else { return }
        if let last = lastBoundsFetchRegion {
            let movedLat = abs(region.center.latitude - last.center.latitude)
            let movedLng = abs(region.center.longitude - last.center.longitude)
            let movedEnough = movedLat > region.span.latitudeDelta * 0.4
                || movedLng > region.span.longitudeDelta * 0.4
            let zoomChanged = abs(region.span.latitudeDelta - last.span.latitudeDelta)
                > last.span.latitudeDelta * 0.35
            guard movedEnough || zoomChanged else { return }
        }

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
            withAnimation(.easeInOut(duration: 0.2)) {
                stations = result
            }
            lastBoundsFetchRegion = region
            lastDataAt = Date()
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
        } else if let center = lastLoadedCenter {
            loadAround(center: center)
        } else {
            loadAround(center: Self.fallbackCenter)
        }
    }

    func select(_ station: Station?) {
        withAnimation(.spring(duration: 0.35)) {
            selectedStation = station
        }
    }

    private func movedMeters(from: CLLocationCoordinate2D?, to: CLLocationCoordinate2D) -> Double {
        guard let from else { return .infinity }
        return CLLocation(latitude: from.latitude, longitude: from.longitude)
            .distance(from: CLLocation(latitude: to.latitude, longitude: to.longitude))
    }

    private func refreshBandIfMoved(center: CLLocationCoordinate2D) {
        // The band covers a ~100 km radius; refresh it once the viewport drifts far away.
        if let bandCenter, movedMeters(from: bandCenter, to: center) < 50_000 {
            return
        }
        bandCenter = center
        let api = api
        let fuel = fuel
        Task {
            guard let response = try? await api.priceBand(fuel: fuel, lat: center.latitude, lng: center.longitude) else { return }
            withAnimation(.easeInOut(duration: 0.25)) {
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
            loadAround(center: Self.fallbackCenter)
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        recenter(to: location.coordinate)
        loadAround(center: location.coordinate)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if stations.isEmpty {
            loadAround(center: Self.fallbackCenter)
        }
    }
}
