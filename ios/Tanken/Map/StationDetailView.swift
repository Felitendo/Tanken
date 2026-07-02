import SwiftUI
import UIKit

/// Station detail inside the bottom drawer: back row, open/closed state, fuel prices, address
/// with Apple/Google Maps directions, and opening times.
struct StationDetailView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s
    let station: Station
    let band: PriceBand?
    let onBack: () -> Void

    @State private var detail: StationDetail?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                header
                pricesCard
                addressCard
                if let times = detail?.openingTimes, !times.isEmpty {
                    openingTimesCard(times)
                        .transition(.opacity.combined(with: .move(edge: .bottom)))
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
        .task(id: station.id) {
            let loaded = try? await app.api.stationDetail(id: station.id)
            withAnimation(.spring(duration: 0.4)) {
                detail = loaded
            }
        }
    }

    private var isOpen: Bool? {
        detail?.isOpen ?? station.isOpen
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 8) {
                Button {
                    Haptics.light()
                    onBack()
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.body.weight(.semibold))
                        .padding(6)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                Text(station.displayBrand)
                    .font(.headline)
                    .lineLimit(1)
                Spacer()
                Button {
                    app.toggleFavourite(station.id)
                } label: {
                    Image(systemName: app.isFavourite(station.id) ? "star.fill" : "star")
                        .font(.title3)
                        .foregroundStyle(app.isFavourite(station.id) ? Theme.favorite : Theme.hint)
                        .symbolEffect(.bounce, value: app.isFavourite(station.id))
                        .padding(4)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            if let name = station.name, !name.isEmpty, name != station.displayBrand {
                Text(name)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            if let isOpen {
                HStack(spacing: 5) {
                    Circle()
                        .fill(isOpen ? Theme.good : Theme.bad)
                        .frame(width: 8, height: 8)
                    Text(isOpen ? s.open : s.closed)
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(isOpen ? Theme.good : Theme.bad)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background((isOpen ? Theme.good : Theme.bad).opacity(0.12), in: Capsule())
            }
        }
    }

    private var pricesCard: some View {
        Card {
            VStack(spacing: 0) {
                SectionHeader(text: s.prices)
                    .padding(.bottom, 6)
                ForEach(FuelType.allCases) { fuel in
                    let isActive = fuel == app.fuelType
                    HStack {
                        Text(fuel.label)
                            .font(.subheadline.weight(isActive ? .semibold : .regular))
                        if isActive {
                            Circle()
                                .fill(Color.accentColor)
                                .frame(width: 6, height: 6)
                        }
                        Spacer()
                        Text(Formatters.price(detail?.price(for: fuel)))
                            .font(.body.weight(isActive ? .bold : .semibold))
                            .foregroundStyle(isActive ? Color.accentColor : .primary)
                            .contentTransition(.numericText())
                            .animation(.spring(duration: 0.4), value: detail?.price(for: fuel))
                    }
                    .padding(.vertical, 8)
                    if fuel != FuelType.allCases.last {
                        Divider()
                    }
                }
            }
        }
    }

    private var addressCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 12) {
                SectionHeader(text: s.address)
                VStack(alignment: .leading, spacing: 2) {
                    Text(station.addressLine)
                        .font(.subheadline)
                    Text(station.cityLine)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                HStack(spacing: 10) {
                    Button {
                        Haptics.medium()
                        openAppleMaps()
                    } label: {
                        Label(s.appleMaps, systemImage: "arrow.triangle.turn.up.right.diamond.fill")
                            .font(.subheadline.weight(.semibold))
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glassProminent)

                    Button {
                        Haptics.light()
                        openGoogleMaps()
                    } label: {
                        Label(s.googleMaps, systemImage: "map")
                            .font(.subheadline.weight(.semibold))
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glass)
                }
            }
        }
    }

    private func openingTimesCard(_ times: [OpeningTime]) -> some View {
        Card {
            VStack(alignment: .leading, spacing: 8) {
                SectionHeader(text: s.openingTimes)
                if detail?.wholeDay == true {
                    Text(s.wholeDay)
                        .font(.subheadline)
                } else {
                    ForEach(Array(times.enumerated()), id: \.offset) { _, time in
                        HStack {
                            Text(time.text ?? "")
                                .font(.subheadline)
                            Spacer()
                            Text("\(time.start ?? "")–\(time.end ?? "")")
                                .font(.subheadline.weight(.medium))
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
    }

    private func openAppleMaps() {
        let url = URL(string: "maps://?daddr=\(station.lat),\(station.lng)")
        if let url, UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else if let web = URL(string: "https://maps.apple.com/?daddr=\(station.lat),\(station.lng)") {
            UIApplication.shared.open(web)
        }
    }

    private func openGoogleMaps() {
        let url = URL(string: "comgooglemaps://?daddr=\(station.lat),\(station.lng)&directionsmode=driving")
        if let url, UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else if let web = URL(string: "https://www.google.com/maps/dir/?api=1&destination=\(station.lat),\(station.lng)") {
            UIApplication.shared.open(web)
        }
    }
}
