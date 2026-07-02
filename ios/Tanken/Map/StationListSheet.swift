import SwiftUI

/// Station list inside the bottom drawer (the count/controls header lives in the drawer's
/// draggable header slot).
struct StationListSheet: View {
    @Environment(\.strings) private var s
    let stations: [Station]
    let band: PriceBand?
    let loading: Bool
    let onSelect: (Station) -> Void

    var body: some View {
        if stations.isEmpty {
            emptyState
        } else {
            list
        }
    }

    private var list: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(stations) { station in
                    Button {
                        onSelect(station)
                    } label: {
                        StationRow(station: station, band: band)
                    }
                    .buttonStyle(.plain)
                    Divider()
                        .padding(.leading, 16)
                }
            }
            .padding(.bottom, 24)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 10) {
            if loading {
                ProgressView()
                Text(s.loadingStations)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            } else {
                Image(systemName: "fuelpump")
                    .font(.title)
                    .foregroundStyle(.secondary)
                Text(s.noStations)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.vertical, 40)
    }
}

/// One station row, matching the web list: brand + address left, distance hint, price pill right.
struct StationRow: View {
    let station: Station
    let band: PriceBand?

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(station.displayBrand)
                    .font(.subheadline.weight(.semibold))
                    .lineLimit(1)
                Text([station.addressLine, station.cityLine].filter { !$0.isEmpty }.joined(separator: ", "))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                if let dist = station.dist {
                    Text(Formatters.distance(dist, approximate: station.distApprox == true))
                        .font(.caption2)
                        .foregroundStyle(Theme.hint)
                }
            }
            Spacer(minLength: 8)
            Text(Formatters.priceSuper(station.price))
                .font(.callout.weight(.heavy))
                .foregroundStyle(.white)
                .contentTransition(.numericText())
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(
                    Theme.priceColor(price: station.price, p10: band?.p10, p90: band?.p90),
                    in: RoundedRectangle(cornerRadius: Theme.rSm, style: .continuous)
                )
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .contentShape(Rectangle())
    }
}
