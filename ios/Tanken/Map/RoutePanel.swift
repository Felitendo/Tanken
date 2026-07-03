import SwiftUI
import MapKit

/// Route input panel (web `.map-route-panel`): start/destination fields with native
/// MKLocalSearch autocomplete, a "current location" shortcut and the route button.
struct RoutePanel: View {
    @Environment(\.strings) private var s

    @Bindable var planner: RoutePlanner
    let userLocation: CLLocationCoordinate2D?
    let biasRegion: MKCoordinateRegion?
    let onRoute: () -> Void
    let onClose: () -> Void

    @State private var startText = ""
    @State private var destText = ""
    @State private var startResults: [RoutePlaceHit] = []
    @State private var destResults: [RoutePlaceHit] = []
    @State private var searchTask: Task<Void, Never>?
    @FocusState private var focusedField: Field?

    private enum Field {
        case start
        case dest
    }

    var body: some View {
        VStack(spacing: 10) {
            endpointField(
                icon: "circle",
                placeholder: s.routeStartPlaceholder,
                text: $startText,
                field: .start,
                results: startResults,
                showCurrentLocation: userLocation != nil
            )
            endpointField(
                icon: "mappin.circle.fill",
                placeholder: s.routeDestPlaceholder,
                text: $destText,
                field: .dest,
                results: destResults,
                showCurrentLocation: false
            )
            HStack(spacing: 10) {
                Button {
                    Haptics.light()
                    onClose()
                } label: {
                    Text(s.cancel)
                        .font(.subheadline.weight(.medium))
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                Button {
                    Haptics.medium()
                    onRoute()
                } label: {
                    HStack(spacing: 8) {
                        if planner.loading {
                            ProgressView().controlSize(.small)
                        }
                        Text(planner.loading ? s.routeLoading : s.routeGo)
                            .font(.subheadline.weight(.semibold))
                    }
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .disabled(planner.loading || resolvedStart == nil || planner.dest == nil)
            }
        }
        .padding(14)
        .glassSurface(in: RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous))
        .onAppear {
            startText = planner.start?.label ?? ""
            destText = planner.dest?.label ?? ""
        }
    }

    /// Start falls back to the user's location when the field is empty (web behaviour).
    private var resolvedStart: RoutePlanner.Endpoint? {
        if let start = planner.start { return start }
        if startText.trimmingCharacters(in: .whitespaces).isEmpty, let userLocation {
            return RoutePlanner.Endpoint(
                label: s.routeCurrentLocation,
                lat: userLocation.latitude,
                lng: userLocation.longitude
            )
        }
        return nil
    }

    private func endpointField(
        icon: String,
        placeholder: String,
        text: Binding<String>,
        field: Field,
        results: [RoutePlaceHit],
        showCurrentLocation: Bool
    ) -> some View {
        VStack(spacing: 4) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Color.accentColor)
                    .frame(width: 18)
                TextField(placeholder, text: text)
                    .autocorrectionDisabled()
                    .focused($focusedField, equals: field)
                    .onChange(of: text.wrappedValue) {
                        scheduleSearch(for: field, query: text.wrappedValue)
                    }
                if !text.wrappedValue.isEmpty {
                    Button {
                        text.wrappedValue = ""
                        setEndpoint(nil, for: field)
                        clearResults(for: field)
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.secondary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Theme.card.opacity(0.75), in: RoundedRectangle(cornerRadius: 10, style: .continuous))

            if focusedField == field, showCurrentLocation || !results.isEmpty {
                VStack(spacing: 0) {
                    if showCurrentLocation, let userLocation {
                        suggestionRow(icon: "location.fill", title: s.routeCurrentLocation) {
                            apply(
                                RoutePlanner.Endpoint(
                                    label: s.routeCurrentLocation,
                                    lat: userLocation.latitude,
                                    lng: userLocation.longitude
                                ),
                                text: s.routeCurrentLocation,
                                for: field
                            )
                        }
                        if !results.isEmpty {
                            Divider().padding(.leading, 12)
                        }
                    }
                    ForEach(Array(results.enumerated()), id: \.offset) { index, hit in
                        suggestionRow(icon: "mappin", title: hit.title) {
                            apply(
                                RoutePlanner.Endpoint(label: hit.title, lat: hit.lat, lng: hit.lng),
                                text: hit.title,
                                for: field
                            )
                        }
                        if index < results.count - 1 {
                            Divider().padding(.leading, 12)
                        }
                    }
                }
                .background(Theme.card.opacity(0.75))
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            }
        }
    }

    private func suggestionRow(icon: String, title: String, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.light()
            action()
        } label: {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Color.accentColor)
                    .frame(width: 18)
                Text(title)
                    .font(.system(size: 13))
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func apply(_ endpoint: RoutePlanner.Endpoint, text: String, for field: Field) {
        setEndpoint(endpoint, for: field)
        switch field {
        case .start: startText = text
        case .dest: destText = text
        }
        clearResults(for: field)
        focusedField = nil
    }

    private func setEndpoint(_ endpoint: RoutePlanner.Endpoint?, for field: Field) {
        switch field {
        case .start: planner.start = endpoint
        case .dest: planner.dest = endpoint
        }
    }

    private func clearResults(for field: Field) {
        searchTask?.cancel()
        switch field {
        case .start: startResults = []
        case .dest: destResults = []
        }
    }

    /// Debounced MKLocalSearch (native replacement for the web's direct Nominatim autocomplete).
    private func scheduleSearch(for field: Field, query: String) {
        searchTask?.cancel()
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        guard trimmed.count >= 2 else {
            clearResults(for: field)
            return
        }
        let bias = biasRegion
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(350))
            guard !Task.isCancelled else { return }
            let request = MKLocalSearch.Request()
            request.naturalLanguageQuery = trimmed
            request.resultTypes = [.address, .pointOfInterest]
            if let bias {
                request.region = bias
            }
            let response = try? await MKLocalSearch(request: request).start()
            guard !Task.isCancelled else { return }
            let hits = (response?.mapItems ?? []).prefix(5).map { item in
                RoutePlaceHit(
                    title: [item.name, item.placemark.title].compactMap { $0 }.first ?? "",
                    lat: item.placemark.coordinate.latitude,
                    lng: item.placemark.coordinate.longitude
                )
            }
            withAnimation(.spring(duration: 0.25)) {
                switch field {
                case .start: startResults = Array(hits)
                case .dest: destResults = Array(hits)
                }
            }
        }
    }
}

/// A resolved place suggestion for the route inputs.
struct RoutePlaceHit: Equatable {
    let title: String
    let lat: Double
    let lng: Double
}
