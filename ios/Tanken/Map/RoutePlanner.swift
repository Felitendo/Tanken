import SwiftUI
import MapKit
import Observation

/// A coverage-gap scan dot along the active route (web: yellow scan markers).
struct RouteScanDot: Identifiable, Equatable {
    enum DotState: Equatable {
        case pending
        case scanning
        case done
        case empty
        case error
    }

    let id: Int
    let lat: Double
    let lng: Double
    var state: DotState = .pending

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: lat, longitude: lng)
    }
}

/// Route-mode state + the sequential scan loop, mirroring the web's `enterRouteMode` /
/// `processRouteScanPoints` (30 s cooldown between scans, corridor refresh after each).
@MainActor
@Observable
final class RoutePlanner {
    enum Phase: Equatable {
        case idle
        case planning
        case active
    }

    struct Endpoint: Equatable {
        var label: String
        var lat: Double
        var lng: Double

        var coordinate: CLLocationCoordinate2D {
            CLLocationCoordinate2D(latitude: lat, longitude: lng)
        }
    }

    var phase: Phase = .idle
    var start: Endpoint?
    var dest: Endpoint?
    var loading = false

    private(set) var polyline: [CLLocationCoordinate2D] = []
    private(set) var distanceKm: Double = 0
    private(set) var durationMin: Double = 0
    private(set) var stationCount = 0
    private(set) var scanDots: [RouteScanDot] = []
    /// Pre-route station snapshot, restored on exit.
    var savedStations: [Station] = []

    private var scanTask: Task<Void, Never>?

    /// Adopts a `/api/route` response (ORS coordinates arrive as `[lng, lat]`).
    func apply(_ response: RouteResponse) {
        if let route = response.route {
            polyline = route.coordinates.compactMap { pair in
                guard pair.count >= 2 else { return nil }
                return CLLocationCoordinate2D(latitude: pair[1], longitude: pair[0])
            }
            distanceKm = route.distanceKm
            durationMin = route.durationMin
        }
        stationCount = response.stations?.count ?? 0
        scanDots = (response.scanPoints ?? []).enumerated().map { index, point in
            RouteScanDot(id: index, lat: point.lat, lng: point.lng)
        }
    }

    /// Sequentially fills coverage gaps: scan → refresh corridor → wait 30 s → next.
    /// Dots fade out 3 s after the last scan, like the web.
    func startScanLoop(api: ApiClient, fuel: FuelType, onCorridorUpdate: @escaping ([Station]) -> Void) {
        scanTask?.cancel()
        guard !scanDots.isEmpty, let start, let dest else { return }
        scanTask = Task {
            for index in scanDots.indices {
                if index > 0 {
                    try? await Task.sleep(for: .seconds(30))
                }
                guard !Task.isCancelled, index < scanDots.count else { return }
                withAnimation(.spring(duration: 0.3)) {
                    scanDots[index].state = .scanning
                }
                let dot = scanDots[index]
                let result = try? await api.routeScanPoint(lat: dot.lat, lng: dot.lng, fuel: fuel)
                guard !Task.isCancelled, index < scanDots.count else { return }
                let newState: RouteScanDot.DotState
                if let result {
                    if result.rateLimited == true {
                        newState = .empty
                    } else if result.error != nil, result.ok != true {
                        newState = .error
                    } else if (result.stationsFound ?? 0) > 0 {
                        newState = .done
                    } else {
                        newState = .empty
                    }
                } else {
                    newState = .error
                }
                withAnimation(.spring(duration: 0.3)) {
                    scanDots[index].state = newState
                }
                // Re-fetch the corridor from the now-warmer cache (web re-POSTs /api/route).
                if let refreshed = try? await api.route(
                    startLat: start.lat, startLng: start.lng,
                    destLat: dest.lat, destLng: dest.lng,
                    fuel: fuel
                ) {
                    guard !Task.isCancelled else { return }
                    let stations = refreshed.stations ?? []
                    stationCount = stations.count
                    onCorridorUpdate(stations)
                }
            }
            try? await Task.sleep(for: .seconds(3))
            guard !Task.isCancelled else { return }
            withAnimation(.spring(duration: 0.4)) {
                scanDots = []
            }
        }
    }

    /// Leaves route mode; the caller restores the station list from `savedStations`.
    func reset() {
        scanTask?.cancel()
        scanTask = nil
        phase = .idle
        start = nil
        dest = nil
        loading = false
        polyline = []
        distanceKm = 0
        durationMin = 0
        stationCount = 0
        scanDots = []
    }

    /// Bounding region of the polyline with ~12% padding, for the camera zoom.
    var routeRegion: MKCoordinateRegion? {
        guard polyline.count > 1 else { return nil }
        var minLat = polyline[0].latitude
        var maxLat = minLat
        var minLng = polyline[0].longitude
        var maxLng = minLng
        for point in polyline {
            minLat = min(minLat, point.latitude)
            maxLat = max(maxLat, point.latitude)
            minLng = min(minLng, point.longitude)
            maxLng = max(maxLng, point.longitude)
        }
        return MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: (minLat + maxLat) / 2, longitude: (minLng + maxLng) / 2),
            span: MKCoordinateSpan(
                latitudeDelta: max((maxLat - minLat) * 1.25, 0.05),
                longitudeDelta: max((maxLng - minLng) * 1.25, 0.05)
            )
        )
    }

    /// "412 km · 3 h 55 min" duration part (web formatDuration).
    static func formatDuration(_ minutes: Double) -> String {
        guard minutes.isFinite, minutes >= 1 else { return "<1 min" }
        let hours = Int(minutes) / 60
        let mins = Int((minutes.truncatingRemainder(dividingBy: 60)).rounded())
        if hours == 0 { return "\(mins) min" }
        if mins == 0 { return "\(hours) h" }
        return "\(hours) h \(mins) min"
    }
}
