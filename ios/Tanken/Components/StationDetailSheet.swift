import SwiftUI

/// Hosts the map's `StationDetailView` in a sheet for stations referenced only by id —
/// the native counterpart of the web's `openStationDetail` popup used by the history
/// extreme cards and the stats ranking.
struct StationDetailSheet: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s
    @Environment(\.dismiss) private var dismiss

    let stationId: String
    var fallbackName: String? = nil
    var fallbackBrand: String? = nil
    var fallbackPrice: Double? = nil

    @State private var station: Station?
    @State private var failed = false

    var body: some View {
        Group {
            if let station {
                StationDetailView(station: station, band: nil, dataTimestamp: nil) {
                    dismiss()
                }
            } else if failed {
                LoadingErrorState(error: s.errorGeneric) {
                    Task { await load() }
                }
            } else {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Theme.background)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .task { await load() }
    }

    private func load() async {
        failed = false
        do {
            let detail = try await app.api.stationDetail(id: stationId)
            station = Station(
                id: stationId,
                name: detail.name ?? fallbackName,
                brand: detail.brand ?? fallbackBrand,
                street: detail.street,
                houseNumber: detail.houseNumber,
                postCode: detail.postCode,
                place: detail.place,
                lat: detail.lat ?? 0,
                lng: detail.lng ?? 0,
                dist: nil,
                distApprox: nil,
                price: detail.price(for: app.fuelType) ?? fallbackPrice,
                isOpen: detail.isOpen,
                routeDistKm: nil
            )
        } catch {
            failed = true
        }
    }
}
