import Foundation
import SwiftUI
import CoreLocation
import ComposeApp

/// Observable wrapper around the shared Kotlin `MapViewModel`. It subscribes to the Kotlin
/// `StateFlow` via the manual `observe { }` bridge and republishes the parts SwiftUI needs, and it
/// owns a `CLLocationManager` for native "locate me" recentering.
final class MapModel: NSObject, ObservableObject {
    let vm: MapViewModel = MainViewControllerKt.mapViewModelShared()

    // Only pure-Swift value types are published. SwiftUI/AttributeGraph must never observe or diff
    // raw Kotlin/Native objects (`Station`, `PriceBand`, …): doing so makes AttributeGraph touch
    // those objects on its background queue, which aborts the Kotlin runtime. We map Kotlin → Swift
    // inside the `observe` callback (delivered on the main thread) and publish the result.
    @Published var annotations: [StationMarker] = []
    @Published var hasSelection: Bool = false
    @Published var loading: Bool = false
    @Published var recenter: CLLocationCoordinate2D? = nil

    private var subscription: Cancellable?
    private let locationManager = CLLocationManager()

    override init() {
        super.init()
        locationManager.delegate = self
        vm.start()
        subscription = vm.observe { [weak self] state in
            guard let self = self else { return }
            // Read the Kotlin objects here (the collector runs on Dispatchers.Main) and project them
            // into plain Swift values before they ever reach SwiftUI's state.
            let markers: [StationMarker] = state.stations.compactMap { s in
                guard let p = s.price, p.doubleValue > 0 else { return nil }
                let rgb = MainViewControllerKt.markerColor(station: s, band: state.band)
                return StationMarker(
                    id: s.id,
                    coordinate: CLLocationCoordinate2D(latitude: s.lat, longitude: s.lng),
                    price: MainViewControllerKt.stationPriceLabel(station: s),
                    brand: s.displayBrand,
                    color: Color(red: rgb.r, green: rgb.g, blue: rgb.b)
                )
            }
            let hasSelection = state.selected != nil
            let loading = state.loading
            DispatchQueue.main.async {
                self.annotations = markers
                self.hasSelection = hasSelection
                self.loading = loading
            }
        }
    }

    func searchHere(_ c: CLLocationCoordinate2D) { vm.searchHere(lat: c.latitude, lng: c.longitude) }
    func select(_ id: String) { vm.selectById(id: id) }
    func dismissDetail() { vm.select(station: nil) }

    func requestLocation() {
        switch locationManager.authorizationStatus {
        case .notDetermined: locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways: locationManager.requestLocation()
        default: break
        }
    }

    deinit { subscription?.cancel() }
}

/// A map marker projected from a Kotlin `Station` into pure Swift value types, so SwiftUI never
/// holds or diffs a Kotlin/Native object. `id` is the station id used to re-select in Kotlin.
struct StationMarker: Identifiable {
    let id: String
    let coordinate: CLLocationCoordinate2D
    let price: String
    let brand: String
    let color: Color
}

extension MapModel: CLLocationManagerDelegate {
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        if manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways {
            manager.requestLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        searchHere(loc.coordinate)
        recenter = loc.coordinate
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {}
}
