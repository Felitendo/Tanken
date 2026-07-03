import SwiftUI
import MapKit

/// "Standorte mit Verlaufsdaten" settings section, mirroring the web's history-locations card:
/// a collapsible summary (total + per-country chips) over per-country rows, each with a pin
/// button that opens a mini-map sheet with a "show on map" jump.
struct ScanLocationsSection: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var locations: [ScanLocation] = []
    @State private var expanded = false
    @State private var mapLocation: ScanLocation?

    private var grouped: [(country: String, locations: [ScanLocation])] {
        let byCountry = Dictionary(grouping: locations) { $0.country ?? "" }
        let order = ["de", "at"] + byCountry.keys.filter { $0 != "de" && $0 != "at" }.sorted()
        return order.compactMap { country in
            guard let group = byCountry[country], !group.isEmpty else { return nil }
            let sorted = group.sorted {
                ($0.name ?? "").localizedCaseInsensitiveCompare($1.name ?? "") == .orderedAscending
            }
            return (country, sorted)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.historyLocations)
            Text(s.historyLocationsHint)
                .font(.system(size: 13))
                .foregroundStyle(Theme.hint)
                .padding(.horizontal, 4)
                .padding(.bottom, 2)
            card
        }
        .task { await load() }
        .onChange(of: app.baseURLString) {
            Task { await load() }
        }
        .sheet(item: $mapLocation) { location in
            LocationMapSheet(location: location)
        }
    }

    private var card: some View {
        VStack(spacing: 0) {
            if locations.isEmpty {
                Text(s.historyLocationsEmpty)
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.hint)
                    .frame(maxWidth: .infinity)
                    .padding(14)
            } else {
                summaryRow
                if expanded {
                    ForEach(grouped, id: \.country) { group in
                        groupHeader(country: group.country, count: group.locations.count)
                        ForEach(group.locations) { location in
                            locationRow(location)
                        }
                    }
                }
            }
        }
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
        .animation(.spring(duration: 0.3), value: expanded)
        .animation(.spring(duration: 0.3), value: locations)
    }

    private var summaryRow: some View {
        Button {
            Haptics.light()
            expanded.toggle()
        } label: {
            HStack(alignment: .top, spacing: 12) {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .fill(Color.accentColor.opacity(0.15))
                    .frame(width: 36, height: 36)
                    .overlay {
                        Image(systemName: "mappin.and.ellipse")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(Color.accentColor)
                    }
                VStack(alignment: .leading, spacing: 8) {
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        Text("\(locations.count)")
                            .font(.system(size: 22, weight: .bold))
                            .monospacedDigit()
                        Text(s.historyLocTotalLabel)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(Theme.hint)
                    }
                    HStack(spacing: 6) {
                        ForEach(grouped, id: \.country) { group in
                            HStack(spacing: 4) {
                                Text(flag(for: group.country))
                                Text(countryName(group.country))
                                    .font(.system(size: 12, weight: .medium))
                                Text("\(group.locations.count)")
                                    .font(.system(size: 12, weight: .bold))
                                    .monospacedDigit()
                            }
                            .padding(.horizontal, 9)
                            .padding(.vertical, 4)
                            .background(Theme.background, in: Capsule())
                        }
                    }
                }
                Spacer(minLength: 0)
                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(Theme.hint)
                    .rotationEffect(.degrees(expanded ? 90 : 0))
                    .frame(maxHeight: .infinity)
            }
            .padding(14)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func groupHeader(country: String, count: Int) -> some View {
        HStack(spacing: 6) {
            Text(flag(for: country))
            Text(countryName(country))
                .font(.system(size: 12, weight: .semibold))
            Text("· \(count)")
                .font(.system(size: 12))
                .foregroundStyle(Theme.hint)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(Theme.background.opacity(0.6))
        .overlay(alignment: .top) { Divider() }
    }

    private func locationRow(_ location: ScanLocation) -> some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 1) {
                Text(location.name ?? "")
                    .font(.system(size: 15, weight: .medium))
                    .lineLimit(1)
                Text(String(format: s.historyLocRadiusFormat, Int(location.radiusKm ?? 25)))
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.hint)
            }
            Spacer(minLength: 0)
            Button {
                Haptics.light()
                mapLocation = location
            } label: {
                Image(systemName: "mappin.and.ellipse")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Color.accentColor)
                    .frame(width: 34, height: 34)
                    .background(Color.accentColor.opacity(0.12), in: Circle())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .overlay(alignment: .top) { Divider().padding(.leading, 14) }
    }

    private func flag(for country: String) -> String {
        switch country {
        case "de": return "🇩🇪"
        case "at": return "🇦🇹"
        default: return "🌍"
        }
    }

    private func countryName(_ country: String) -> String {
        switch country {
        case "de": return s.countryDe
        case "at": return s.countryAt
        default: return country.uppercased()
        }
    }

    private func load() async {
        let result = (try? await app.api.scanLocations())?.locations ?? []
        withAnimation(.spring(duration: 0.3)) {
            locations = result
        }
    }
}

/// Mini-map sheet for a scan location (marker + scan-radius circle) with a jump to the map tab —
/// the native counterpart of the web's `showLocationMapPopup` bottom sheet.
struct LocationMapSheet: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s
    @Environment(\.dismiss) private var dismiss

    let location: ScanLocation

    private var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: location.lat, longitude: location.lng)
    }

    private var radiusKm: Double {
        location.radiusKm ?? 25
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 2) {
                Text(location.name ?? "")
                    .font(.title3.weight(.bold))
                Text("\(countryLabel) · " + String(format: s.historyLocRadiusFormat, Int(radiusKm)))
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.hint)
            }
            Map(initialPosition: .region(region)) {
                Marker(location.name ?? "", coordinate: coordinate)
                MapCircle(center: coordinate, radius: radiusKm * 1000)
                    .foregroundStyle(Color.accentColor.opacity(0.10))
                    .stroke(Color.accentColor.opacity(0.5), lineWidth: 1.5)
            }
            .allowsHitTesting(false)
            .frame(maxHeight: .infinity)
            .clipShape(RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous))
            Button {
                Haptics.light()
                app.mapJumpTarget = MapJumpTarget(lat: location.lat, lng: location.lng)
                app.requestedTab = .map
                dismiss()
            } label: {
                Text(s.historyLocShowOnMap)
                    .font(.subheadline.weight(.semibold))
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(16)
        .presentationDetents([.medium])
        .presentationDragIndicator(.visible)
    }

    private var countryLabel: String {
        switch location.country {
        case "de": return s.countryDe
        case "at": return s.countryAt
        default: return (location.country ?? "").uppercased()
        }
    }

    private var region: MKCoordinateRegion {
        let delta = max(radiusKm, 5) * 2.6 / 111.0
        return MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: delta, longitudeDelta: delta)
        )
    }
}
