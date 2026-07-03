import SwiftUI

/// The web's renderStationList pipeline: dedupe by id (the API can repeat stations across scan
/// batches, and duplicate ids corrupt SwiftUI's ForEach diffing) → open + priced only → optional
/// group-by-price (keep the closest station per distinct price) → sort (price|distance) →
/// favourites pinned on top → cap at 50 rows.
enum StationListPipeline {
    static func apply(
        _ stations: [Station],
        sort: StationSort,
        groupByPrice: Bool,
        favouritesOnTop: Bool,
        favourites: [String]
    ) -> [Station] {
        var seenIds = Set<String>()
        var open = stations.filter {
            $0.isOpen == true && ($0.price ?? 0) > 0 && seenIds.insert($0.id).inserted
        }

        if groupByPrice {
            var seen = Set<String>()
            var kept: [Station] = []
            for station in open.sorted(by: priceThenDistance) {
                let key = String(format: "%.3f", station.price ?? 0)
                if seen.insert(key).inserted {
                    kept.append(station)
                }
            }
            open = kept
        }

        switch sort {
        case .price:
            open.sort(by: priceThenDistance)
        case .distance:
            open.sort { ($0.dist ?? 999) < ($1.dist ?? 999) }
        }

        if favouritesOnTop, !favourites.isEmpty {
            let favs = Set(favourites)
            open = open.filter { favs.contains($0.id) } + open.filter { !favs.contains($0.id) }
        }

        return Array(open.prefix(50))
    }

    private static func priceThenDistance(_ a: Station, _ b: Station) -> Bool {
        if let pa = a.price, let pb = b.price, pa != pb { return pa < pb }
        return (a.dist ?? 999) < (b.dist ?? 999)
    }
}

/// Station list inside the bottom drawer (the count/controls header lives in the drawer's
/// draggable header slot). Rows mirror the web's `.station-item` design; reorders and refreshes
/// animate in place instead of replaying an entrance animation.
struct StationListSheet: View {
    @Environment(AppState.self) private var app
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
                ForEach(Array(stations.enumerated()), id: \.element.id) { index, station in
                    Button {
                        onSelect(station)
                    } label: {
                        StationRow(
                            station: station,
                            rank: index + 1,
                            band: band,
                            showsFavourite: app.isLoggedIn && app.isFavourite(station.id)
                        )
                    }
                    .buttonStyle(PressableRowStyle())
                    if index < stations.count - 1 {
                        Divider()
                            .padding(.leading, 56)
                    }
                }
            }
            .padding(.bottom, 24)
            .animation(.spring(duration: 0.3), value: stations.map(\.id))
        }
        .scrollBounceBehavior(.basedOnSize)
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
                    .font(.system(size: 40))
                    .foregroundStyle(Theme.hint)
                Text(s.noOpenStations)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.vertical, 40)
    }
}

/// One station row like the web: rank square colored by the price band, brand + address, and the
/// price as bold colored text with the distance below.
struct StationRow: View {
    let station: Station
    let rank: Int
    let band: PriceBand?
    let showsFavourite: Bool

    private var priceColor: Color {
        Theme.priceColor(price: station.price, p10: band?.p10, p90: band?.p90)
    }

    var body: some View {
        HStack(spacing: 12) {
            Text("\(rank)")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 28, height: 28)
                .background(priceColor, in: RoundedRectangle(cornerRadius: 8, style: .continuous))
                .contentTransition(.numericText())

            VStack(alignment: .leading, spacing: 2) {
                Text(station.displayBrand)
                    .font(.system(size: 15, weight: .medium))
                    .lineLimit(1)
                Text([station.addressLine, station.place ?? ""].filter { !$0.isEmpty }.joined(separator: ", "))
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.hint)
                    .lineLimit(1)
            }

            Spacer(minLength: 8)

            if showsFavourite {
                Image(systemName: "star.fill")
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.favorite)
            }

            VStack(alignment: .trailing, spacing: 1) {
                Text(Formatters.priceText(station.price))
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(priceColor)
                    .contentTransition(.numericText())
                if let dist = station.dist {
                    Text(Formatters.distance(dist, approximate: station.distApprox == true))
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.hint)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .contentShape(Rectangle())
    }
}

/// Web `:active { transform: scale(0.97) }` press feedback.
struct PressableRowStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}
