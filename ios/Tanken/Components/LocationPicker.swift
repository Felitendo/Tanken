import SwiftUI
import CoreLocation

/// A scan location that has history data — the dropdown entries of the web's
/// `#history-location-picker` / `#stats-location-picker`.
struct LocationOption: Identifiable, Equatable {
    let id: String
    let name: String
    let lat: Double
    let lng: Double
}

/// Shared loader for the history/stats location pickers, mirroring the web's
/// `loadLocationPickers()`: intersect `/api/history?locations=list` with the admin scan locations
/// (dropping orphan ids) and offer the nearest location for the auto-pick.
enum LocationPickerData {
    static func load(api: ApiClient, country: Country) async -> [LocationOption] {
        async let historyIds = api.historyLocations(country: country)
        async let scanLocations = api.scanLocations()
        let ids = (try? await historyIds)?.locations ?? []
        let scans = (try? await scanLocations)?.locations ?? []
        let byId = Dictionary(scans.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
        // Drop ids that no longer match any admin scan location — legacy/orphan history rows.
        return ids.compactMap { id in
            guard let scan = byId[id], scan.country == country.rawValue else { return nil }
            return LocationOption(id: id, name: scan.name ?? id, lat: scan.lat, lng: scan.lng)
        }
    }

    /// The option closest to `coordinate` (used to default the picker to the user's area).
    static func nearest(in options: [LocationOption], to coordinate: CLLocationCoordinate2D) -> LocationOption? {
        let user = CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude)
        return options.min { a, b in
            CLLocation(latitude: a.lat, longitude: a.lng).distance(from: user)
                < CLLocation(latitude: b.lat, longitude: b.lng).distance(from: user)
        }
    }
}

/// The picker row above the history/stats charts: a menu with "Alle Standorte" plus the scan
/// locations, and the web's "Automatisch · nächster Standort" hint when the app auto-picked.
struct LocationPickerRow: View {
    @Environment(\.strings) private var s
    let options: [LocationOption]
    @Binding var selection: String?
    let autoPicked: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            Menu {
                Picker(s.allLocations, selection: $selection) {
                    Text(s.allLocations).tag(String?.none)
                    ForEach(options) { option in
                        Text(option.name).tag(String?.some(option.id))
                    }
                }
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "mappin.and.ellipse")
                        .font(.footnote)
                        .foregroundStyle(Color.accentColor)
                    Text(selectedName)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.primary)
                        .lineLimit(1)
                        .contentTransition(.opacity)
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(.secondary)
                    Spacer(minLength: 0)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 9)
                .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                .contentShape(Rectangle())
            }
            .sensoryFeedback(.selection, trigger: selection)
            if autoPicked, selection != nil {
                Text(s.locationAutoPicked)
                    .font(.caption2)
                    .foregroundStyle(Theme.hint)
                    .padding(.leading, 4)
                    .transition(.opacity)
            }
        }
        .animation(.spring(duration: 0.3), value: selection)
    }

    private var selectedName: String {
        guard let selection, let option = options.first(where: { $0.id == selection }) else {
            return s.allLocations
        }
        return option.name
    }
}
