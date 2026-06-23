import Foundation
import SwiftUI
import CoreLocation
import ComposeApp

/// Observable wrapper around the shared Kotlin `MapViewModel`. It subscribes to the Kotlin
/// `StateFlow` via the manual `observe { }` bridge and republishes the parts SwiftUI needs, and it
/// owns a `CLLocationManager` for native "locate me" recentering.
final class MapModel: NSObject, ObservableObject {
    let vm: MapViewModel = MainViewControllerKt.mapViewModelShared()

    @Published var stations: [Station] = []
    @Published var band: PriceBand? = nil
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
            DispatchQueue.main.async {
                self.stations = state.stations
                self.band = state.band
                self.hasSelection = state.selected != nil
                self.loading = state.loading
            }
        }
    }

    func searchHere(_ c: CLLocationCoordinate2D) { vm.searchHere(lat: c.latitude, lng: c.longitude) }
    func select(_ s: Station?) { vm.select(station: s) }
    func dismissDetail() { vm.select(station: nil) }

    func requestLocation() {
        switch locationManager.authorizationStatus {
        case .notDetermined: locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways: locationManager.requestLocation()
        default: break
        }
    }

    func color(for s: Station) -> Color {
        let rgb = MainViewControllerKt.markerColor(station: s, band: band)
        return Color(red: rgb.r, green: rgb.g, blue: rgb.b)
    }

    func priceLabel(_ s: Station) -> String { MainViewControllerKt.stationPriceLabel(station: s) }

    deinit { subscription?.cancel() }
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
