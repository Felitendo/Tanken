import SwiftUI

/// A geocoded place suggestion (from MKLocalSearch — the native stand-in for the web's Nominatim).
struct PlaceResult: Identifiable, Equatable {
    let id: UUID
    let name: String
    let subtitle: String
    let latitude: Double
    let longitude: Double
}

/// A station suggestion; `rank` is the station's position in the price-sorted list (nil when the
/// station comes from the server-wide search and isn't in the current viewport).
struct StationMatch: Identifiable, Equatable {
    let station: Station
    let rank: Int?

    var id: String { station.id }
}

struct SearchResults: Equatable {
    var places: [PlaceResult] = []
    var stations: [StationMatch] = []

    var isEmpty: Bool { places.isEmpty && stations.isEmpty }
}

/// Dropdown under the map search field, mirroring the web's `#map-search-results`:
/// places first, then stations with rank badge + colored price.
struct SearchResultsView: View {
    @Environment(\.strings) private var s
    let results: SearchResults
    let band: PriceBand?
    let onStation: (Station) -> Void
    let onPlace: (PlaceResult) -> Void

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                if results.isEmpty {
                    Text(s.noResults)
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.hint)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                } else {
                    ForEach(results.places) { place in
                        Button {
                            onPlace(place)
                        } label: {
                            placeRow(place)
                        }
                        .buttonStyle(PressableRowStyle())
                        Divider().padding(.leading, 14)
                    }
                    ForEach(results.stations) { match in
                        Button {
                            onStation(match.station)
                        } label: {
                            stationRow(match)
                        }
                        .buttonStyle(PressableRowStyle())
                        if match.id != results.stations.last?.id {
                            Divider().padding(.leading, 14)
                        }
                    }
                }
            }
        }
        .frame(maxHeight: 240)
    }

    private func placeRow(_ place: PlaceResult) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "mappin.and.ellipse")
                .font(.system(size: 14))
                .foregroundStyle(Theme.hint)
                .frame(width: 20)
            VStack(alignment: .leading, spacing: 1) {
                Text(place.name)
                    .font(.system(size: 14))
                    .lineLimit(1)
                if !place.subtitle.isEmpty, place.subtitle != place.name {
                    Text(place.subtitle)
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.hint)
                        .lineLimit(1)
                }
            }
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .contentShape(Rectangle())
    }

    private func stationRow(_ match: StationMatch) -> some View {
        let color = Theme.priceColor(price: match.station.price, p10: band?.p10, p90: band?.p90)
        return HStack(spacing: 10) {
            Text(match.rank.map(String.init) ?? "–")
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 26, height: 26)
                .background(color, in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            VStack(alignment: .leading, spacing: 1) {
                Text(match.station.displayBrand)
                    .font(.system(size: 14, weight: .semibold))
                    .lineLimit(1)
                Text(stationSubtitle(match.station))
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.hint)
                    .lineLimit(1)
            }
            Spacer(minLength: 8)
            Text(Formatters.priceText(match.station.price))
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(color)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .contentShape(Rectangle())
    }

    private func stationSubtitle(_ station: Station) -> String {
        var parts: [String] = []
        if let dist = station.dist {
            parts.append(Formatters.distance(dist, approximate: station.distApprox == true))
        }
        let address = [station.addressLine, station.place ?? ""].filter { !$0.isEmpty }.joined(separator: ", ")
        if !address.isEmpty {
            parts.append(address)
        }
        return parts.joined(separator: " · ")
    }
}
