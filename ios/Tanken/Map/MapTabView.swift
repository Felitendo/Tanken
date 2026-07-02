import SwiftUI
import MapKit

/// The Karte tab: Apple Maps with price-bubble annotations, Liquid Glass search overlay,
/// "Hier suchen" pill, locate-me FAB and a persistent bottom drawer (station list → detail).
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
    @State private var sheetVisible = false
    @State private var detent: PresentationDetent = .height(88)
    @State private var path: [Station] = []
    @Namespace private var glass

    var body: some View {
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
            guard let station else { return }
            path = [station]
            if detent == .height(88) {
                withAnimation(.spring(duration: 0.35)) {
                    detent = .fraction(0.45)
                }
            }
        }
        .onChange(of: path) { _, newPath in
            if newPath.isEmpty {
                model.select(nil)
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
        .onAppear { sheetVisible = true }
        .onDisappear { sheetVisible = false }
        .sheet(isPresented: $sheetVisible) { drawer }
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
        .padding(.bottom, 108)
    }

    // MARK: - Drawer

    private var drawer: some View {
        NavigationStack(path: $path) {
            StationListSheet(
                stations: model.sortedStations,
                band: model.band,
                loading: model.loading
            ) { station in
                Haptics.light()
                model.select(station)
            }
            .navigationDestination(for: Station.self) { station in
                StationDetailView(station: station, band: model.band)
            }
        }
        .presentationDetents([.height(88), .fraction(0.45), .large], selection: $detent)
        .presentationBackgroundInteraction(.enabled(upThrough: .fraction(0.45)))
        .presentationDragIndicator(.visible)
        .interactiveDismissDisabled()
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
                model.recenterTarget = RecenterTarget(coordinate)
                model.loadAround(center: coordinate)
            }
        }
    }
}
