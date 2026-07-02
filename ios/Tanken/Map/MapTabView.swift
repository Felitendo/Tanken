import SwiftUI
import MapKit

/// The Karte tab: Apple Maps with price-bubble annotations, Liquid Glass search overlay,
/// "Hier suchen" pill, locate-me FAB and an inline Liquid Glass bottom drawer (station list ⇄
/// detail). The drawer is deliberately not a `.sheet` — sheets cover the Liquid Glass tab bar.
struct MapTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = MapViewModel()
    @State private var camera: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515),
            span: MKCoordinateSpan(latitudeDelta: 8, longitudeDelta: 8)
        )
    )
    @State private var query = ""
    @State private var drawerState: DrawerState = .collapsed
    @Namespace private var glass

    var body: some View {
        ZStack(alignment: .bottom) {
            mapLayer
            drawer
        }
        .onChange(of: model.recenterTarget) { _, target in
            guard let target else { return }
            withAnimation(.spring(duration: 0.7)) {
                camera = .region(
                    MKCoordinateRegion(
                        center: target.coordinate,
                        span: MKCoordinateSpan(latitudeDelta: 0.18, longitudeDelta: 0.18)
                    )
                )
            }
        }
        .onChange(of: model.selectedStation) { _, station in
            guard station != nil else { return }
            if drawerState == .collapsed {
                withAnimation(.spring(duration: 0.35)) {
                    drawerState = .half
                }
            }
        }
        .task {
            model.configure(api: app.api, fuel: app.fuelType)
            model.start()
        }
        .onChange(of: app.fuelType) {
            model.configure(api: app.api, fuel: app.fuelType)
        }
        .onChange(of: app.baseURLString) {
            model.configure(api: app.api, fuel: app.fuelType)
        }
    }

    // MARK: - Map

    private var mapLayer: some View {
        Map(position: $camera) {
            UserAnnotation()
            ForEach(model.stations.filter { $0.price != nil }) { station in
                Annotation(
                    "",
                    coordinate: CLLocationCoordinate2D(latitude: station.lat, longitude: station.lng),
                    anchor: .bottom
                ) {
                    StationAnnotationView(
                        station: station,
                        band: model.band,
                        isSelected: model.selectedStation?.id == station.id
                    )
                    .onTapGesture {
                        Haptics.light()
                        model.select(station)
                    }
                }
            }
        }
        .mapStyle(.standard(pointsOfInterest: .excludingAll))
        .ignoresSafeArea(edges: .top)
        .onMapCameraChange(frequency: .onEnd) { context in
            model.cameraChanged(context.region)
        }
        .overlay(alignment: .top) { topOverlay }
        .overlay(alignment: .bottomTrailing) { locateFab }
    }

    // MARK: - Overlays

    private var topOverlay: some View {
        GlassEffectContainer(spacing: 16) {
            VStack(spacing: 10) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(.secondary)
                    TextField(s.mapSearchPlaceholder, text: $query)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .submitLabel(.search)
                        .onSubmit(runSearch)
                    if !query.isEmpty {
                        Button {
                            Haptics.light()
                            withAnimation(.spring(duration: 0.25)) {
                                query = ""
                            }
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(.secondary)
                        }
                        .buttonStyle(.plain)
                        .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .glassSurface(in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                .glassEffectID("search", in: glass)

                if model.showSearchHere {
                    Button {
                        Haptics.medium()
                        model.searchHere()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "magnifyingglass")
                                .font(.footnote.weight(.semibold))
                            Text(s.searchHere)
                        }
                        .font(.subheadline.weight(.semibold))
                    }
                    .buttonStyle(.glassProminent)
                    .glassEffectID("search-here", in: glass)
                    .transition(.scale.combined(with: .opacity))
                }

                if model.loading {
                    HStack(spacing: 8) {
                        ProgressView()
                            .controlSize(.small)
                        Text(s.loadingStations)
                            .font(.footnote)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .glassSurface(in: Capsule())
                    .transition(.scale.combined(with: .opacity))
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.top, 8)
        .animation(.spring(duration: 0.35), value: model.showSearchHere)
        .animation(.spring(duration: 0.35), value: model.loading)
    }

    private var locateFab: some View {
        Button {
            Haptics.light()
            model.requestLocation()
        } label: {
            Image(systemName: "location.fill")
                .font(.system(size: 18, weight: .semibold))
                .padding(14)
        }
        .interactiveGlass(in: Circle())
        .padding(.trailing, 16)
        .padding(.bottom, 118)
    }

    // MARK: - Drawer

    private var drawer: some View {
        BottomDrawer(state: $drawerState) {
            drawerHeader
        } content: {
            ZStack {
                if let station = model.selectedStation {
                    StationDetailView(
                        station: station,
                        band: model.band,
                        dataTimestamp: model.lastDataAt
                    ) {
                        model.select(nil)
                    }
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .trailing).combined(with: .opacity),
                            removal: .move(edge: .trailing).combined(with: .opacity)
                        )
                    )
                } else {
                    StationListSheet(
                        stations: displayStations,
                        band: model.band,
                        loading: model.loading
                    ) { station in
                        Haptics.light()
                        model.select(station)
                    }
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .leading).combined(with: .opacity),
                            removal: .move(edge: .leading).combined(with: .opacity)
                        )
                    )
                }
            }
            .animation(.spring(duration: 0.35), value: model.selectedStation)
            .clipped()
        }
    }

    /// The web's list pipeline, driven by the synced list options in AppState.
    private var displayStations: [Station] {
        StationListPipeline.apply(
            model.stations,
            sort: app.stationSort,
            groupByPrice: app.groupByPrice,
            favouritesOnTop: app.favouritesOnTop,
            favourites: app.favourites
        )
    }

    /// Sort bar like the web's `.station-sort-bar`: toggles left, count centered, sort right.
    /// Draggable together with the grabber (it sits in the drawer's header slot).
    private var drawerHeader: some View {
        HStack(spacing: 8) {
            HStack(spacing: 4) {
                headerToggle(
                    icon: "star",
                    active: app.favouritesOnTop
                ) {
                    app.favouritesOnTop.toggle()
                }
                headerToggle(
                    icon: "rectangle.stack",
                    active: app.groupByPrice
                ) {
                    app.groupByPrice.toggle()
                }
            }

            Spacer(minLength: 4)

            Text(String(format: s.stationsCountFormat, displayStations.count).uppercased())
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(Theme.hint)
                .lineLimit(1)
                .contentTransition(.numericText())
                .animation(.easeInOut(duration: 0.2), value: displayStations.count)

            Spacer(minLength: 4)

            Button {
                Haptics.selection()
                withAnimation(.spring(duration: 0.3)) {
                    app.stationSort = app.stationSort == .price ? .distance : .price
                }
            } label: {
                HStack(spacing: 5) {
                    Image(systemName: app.stationSort == .price ? "arrow.up.arrow.down" : "location")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Color.accentColor)
                    Text(app.stationSort == .price ? s.sortPrice : s.sortDistance)
                        .font(.system(size: 13, weight: .semibold))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.primary.opacity(0.06), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            }
            .buttonStyle(PressableRowStyle())
        }
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
    }

    private func headerToggle(icon: String, active: Bool, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.selection()
            withAnimation(.spring(duration: 0.3)) {
                action()
            }
        } label: {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(active ? .white : Theme.hint)
                .padding(7)
                .background(
                    active ? Color.accentColor : Color.primary.opacity(0.06),
                    in: RoundedRectangle(cornerRadius: 8, style: .continuous)
                )
        }
        .buttonStyle(PressableRowStyle())
    }

    // MARK: - Search

    private func runSearch() {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        Haptics.medium()
        let request = MKLocalSearch.Request()
        request.naturalLanguageQuery = trimmed
        MKLocalSearch(request: request).start { response, _ in
            guard let coordinate = response?.mapItems.first?.placemark.coordinate else { return }
            Task { @MainActor in
                model.recenter(to: coordinate)
                model.loadAround(center: coordinate)
            }
        }
    }
}
