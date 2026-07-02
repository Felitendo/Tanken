import SwiftUI
import MapKit

/// The Karte tab: Apple Maps with price-bubble annotations, Liquid Glass search overlay,
/// "Hier suchen" pill, locate-me FAB and an inline Liquid Glass bottom drawer (station list ⇄
/// detail). The drawer is deliberately not a `.sheet` — sheets cover the Liquid Glass tab bar.
struct MapTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = MapViewModel()
    @State private var planner = RoutePlanner()
    @State private var camera: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515),
            span: MKCoordinateSpan(latitudeDelta: 8, longitudeDelta: 8)
        )
    )
    @State private var query = ""
    @State private var drawerState: DrawerState = .collapsed
    @State private var searchResults: SearchResults?
    @State private var searchTask: Task<Void, Never>?
    @State private var searchSeq = 0
    @FocusState private var searchFocused: Bool
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
        .onChange(of: app.mapJumpTarget) { _, target in
            guard let target else { return }
            let coordinate = CLLocationCoordinate2D(latitude: target.lat, longitude: target.lng)
            model.recenter(to: coordinate)
            model.loadAround(center: coordinate)
            app.mapJumpTarget = nil
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
            if planner.phase == .active {
                if planner.polyline.count > 1 {
                    MapPolyline(coordinates: planner.polyline)
                        .stroke(
                            Color.accentColor.opacity(0.85),
                            style: StrokeStyle(lineWidth: 5, lineCap: .round, lineJoin: .round)
                        )
                }
                if let start = planner.start {
                    Annotation("", coordinate: start.coordinate) {
                        routeEndpointDot(fill: Color.accentColor, border: .white)
                    }
                }
                if let dest = planner.dest {
                    Annotation("", coordinate: dest.coordinate) {
                        routeEndpointDot(fill: .white, border: Color.accentColor)
                    }
                }
                ForEach(planner.scanDots) { dot in
                    Annotation("", coordinate: dot.coordinate) {
                        RouteScanDotView(state: dot.state)
                    }
                }
                ForEach(planner.scanDots.filter { $0.state == .pending || $0.state == .scanning }) { dot in
                    MapCircle(center: dot.coordinate, radius: 25_000)
                        .foregroundStyle(Color.accentColor.opacity(0.07))
                        .stroke(Color.accentColor.opacity(0.35), lineWidth: 1)
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
                if planner.phase != .active {
                    HStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(.secondary)
                        TextField(s.mapSearchPlaceholder, text: $query)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                            .submitLabel(.search)
                            .focused($searchFocused)
                            .onSubmit(submitSearch)
                        if !query.isEmpty {
                            Button {
                                Haptics.light()
                                withAnimation(.spring(duration: 0.25)) {
                                    query = ""
                                    searchResults = nil
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
                    .onChange(of: query) {
                        queryChanged()
                    }
                }

                if let results = searchResults, searchFocused || !results.isEmpty {
                    SearchResultsView(
                        results: results,
                        band: model.band,
                        onStation: selectSearchStation,
                        onPlace: selectSearchPlace
                    )
                    .glassSurface(in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                    .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }

                routeOverlay

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
        .animation(.spring(duration: 0.3), value: searchResults)
        .animation(.spring(duration: 0.35), value: planner.phase)
    }

    // MARK: - Route planner overlay

    /// Route chip → input panel → active summary, mirroring the web's route chip/panel flow.
    @ViewBuilder
    private var routeOverlay: some View {
        switch planner.phase {
        case .idle:
            if searchResults == nil && !searchFocused {
                Button {
                    Haptics.light()
                    withAnimation(.spring(duration: 0.35)) {
                        planner.phase = .planning
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "point.topleft.down.to.point.bottomright.curvepath")
                            .font(.footnote.weight(.semibold))
                        Text(s.routePlan)
                    }
                    .font(.subheadline.weight(.semibold))
                }
                .buttonStyle(.glass)
                .glassEffectID("route-chip", in: glass)
                .transition(.scale.combined(with: .opacity))
            }
        case .planning:
            RoutePanel(
                planner: planner,
                userLocation: model.userCoordinate,
                biasRegion: model.lastRegion,
                onRoute: startRoute,
                onClose: {
                    withAnimation(.spring(duration: 0.35)) {
                        planner.phase = .idle
                    }
                }
            )
            .transition(.opacity.combined(with: .move(edge: .top)))
        case .active:
            HStack(spacing: 10) {
                Image(systemName: "point.topleft.down.to.point.bottomright.curvepath")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(Color.accentColor)
                Text(routeSummaryText)
                    .font(.footnote.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                Button {
                    Haptics.light()
                    exitRoute()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 18))
                        .foregroundStyle(.secondary)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(s.routeExit)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .glassSurface(in: Capsule())
            .glassEffectID("route-summary", in: glass)
            .transition(.scale.combined(with: .opacity))
        }
    }

    private var routeSummaryText: String {
        String(
            format: s.routeSummaryFormat,
            "\(Int(planner.distanceKm.rounded()))",
            RoutePlanner.formatDuration(planner.durationMin),
            planner.stationCount
        )
    }

    private func routeEndpointDot(fill: Color, border: Color) -> some View {
        Circle()
            .fill(fill)
            .frame(width: 16, height: 16)
            .overlay {
                Circle().strokeBorder(border, lineWidth: 3)
            }
            .shadow(color: .black.opacity(0.3), radius: 3, y: 1)
    }

    /// Compute the route and enter route mode (web `enterRouteMode`).
    private func startRoute() {
        guard !planner.loading else { return }
        // Fall back to the current location when the start field was left empty, like the web.
        if planner.start == nil, let user = model.userCoordinate {
            planner.start = RoutePlanner.Endpoint(
                label: s.routeCurrentLocation,
                lat: user.latitude,
                lng: user.longitude
            )
        }
        guard let start = planner.start, let dest = planner.dest else { return }
        planner.loading = true
        Task {
            do {
                let response = try await app.api.route(
                    startLat: start.lat, startLng: start.lng,
                    destLat: dest.lat, destLng: dest.lng,
                    fuel: app.fuelType
                )
                planner.loading = false
                guard response.route != nil else {
                    app.showToast(s.routeNoRoute)
                    return
                }
                planner.savedStations = model.stations
                planner.apply(response)
                let corridor = response.stations ?? []
                withAnimation(.spring(duration: 0.35)) {
                    planner.phase = .active
                    model.routeModeActive = true
                    model.showSearchHere = false
                    model.stations = corridor
                }
                if corridor.isEmpty {
                    app.showToast(s.routeNoStations)
                }
                if let region = planner.routeRegion {
                    withAnimation(.spring(duration: 0.7)) {
                        camera = .region(region)
                    }
                }
                Haptics.success()
                planner.startScanLoop(api: app.api, fuel: app.fuelType) { stations in
                    withAnimation(.easeInOut(duration: 0.25)) {
                        model.stations = stations
                    }
                }
            } catch let error as ApiError {
                planner.loading = false
                Haptics.error()
                switch error.status {
                case 401: app.showToast(s.routeLoginRequired)
                case 503: app.showToast(s.routeNoOrs)
                default: app.showToast(s.routeNoRoute)
                }
            } catch {
                planner.loading = false
                Haptics.error()
                app.showToast(s.routeNoRoute)
            }
        }
    }

    /// Leave route mode: cancel scans, clear the route and restore the pre-route stations.
    private func exitRoute() {
        let restored = planner.savedStations
        withAnimation(.spring(duration: 0.35)) {
            planner.reset()
            model.routeModeActive = false
            model.stations = restored
        }
        planner.savedStations = []
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
        // The half/expanded drawer covers the FAB's fixed spot — hide it instead of leaving a
        // dead button underneath.
        .opacity(drawerState == .collapsed ? 1 : 0)
        .scaleEffect(drawerState == .collapsed ? 1 : 0.8)
        .allowsHitTesting(drawerState == .collapsed)
        .animation(.spring(duration: 0.3), value: drawerState)
    }

    // MARK: - Drawer

    private var drawer: some View {
        BottomDrawer(state: $drawerState) {
            // The sort/count controls only make sense for the list; the detail view brings its
            // own back header, so only the grabber stays draggable there.
            if model.selectedStation == nil {
                drawerHeader
                    .transition(.opacity)
            }
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
        .animation(.spring(duration: 0.35), value: model.selectedStation == nil)
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

    // MARK: - Search (web: 350 ms debounce, instant local matches, places first, max 8)

    private func queryChanged() {
        searchTask?.cancel()
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.count >= 2 else {
            withAnimation(.spring(duration: 0.25)) {
                searchResults = nil
            }
            return
        }

        // Instant feedback from the already loaded stations, like the web's local matching.
        let local = localMatches(trimmed)
        if !local.isEmpty {
            withAnimation(.spring(duration: 0.25)) {
                searchResults = SearchResults(places: searchResults?.places ?? [], stations: local)
            }
        }

        searchSeq += 1
        let seq = searchSeq
        let fuel = app.fuelType
        let api = app.api
        let center = model.lastRegion?.center
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(350))
            guard !Task.isCancelled else { return }
            async let serverTask = api.searchStations(query: trimmed, fuel: fuel, lat: center?.latitude, lng: center?.longitude)
            async let placesTask = searchPlaces(trimmed)
            let server = (try? await serverTask) ?? []
            let places = await placesTask
            guard !Task.isCancelled, seq == searchSeq else { return }
            let stations = mergeMatches(local: localMatches(trimmed), server: server)
            withAnimation(.spring(duration: 0.3)) {
                searchResults = SearchResults(places: places, stations: stations)
            }
        }
    }

    /// Web matchStationsByQuery: score brand/name/street/place, only open + priced, top 6.
    private func localMatches(_ rawQuery: String) -> [StationMatch] {
        let q = rawQuery.lowercased()
        let ranked = displayStations
        var scored: [(Station, Int)] = []
        for station in model.stations where station.isOpen == true && (station.price ?? 0) > 0 {
            let brand = (station.brand ?? "").lowercased()
            let name = (station.name ?? "").lowercased()
            let street = (station.street ?? "").lowercased()
            let place = (station.place ?? "").lowercased()
            let score: Int
            if !brand.isEmpty, brand.hasPrefix(q) { score = 100 }
            else if !name.isEmpty, name.hasPrefix(q) { score = 90 }
            else if !brand.isEmpty, brand.contains(q) { score = 80 }
            else if !name.isEmpty, name.contains(q) { score = 70 }
            else if street.contains(q) { score = 50 }
            else if place.contains(q) { score = 40 }
            else { continue }
            scored.append((station, score))
        }
        scored.sort { a, b in
            if a.1 != b.1 { return a.1 > b.1 }
            return (a.0.price ?? .infinity) < (b.0.price ?? .infinity)
        }
        return scored.prefix(6).map { station, _ in
            let rank = ranked.firstIndex(where: { $0.id == station.id }).map { $0 + 1 }
            return StationMatch(station: station, rank: rank)
        }
    }

    /// Local matches win (they carry the list rank); server-wide results fill up to 8.
    private func mergeMatches(local: [StationMatch], server: [Station]) -> [StationMatch] {
        var merged = local
        var seen = Set(local.map(\.id))
        for station in server where !seen.contains(station.id) {
            seen.insert(station.id)
            merged.append(StationMatch(station: station, rank: nil))
            if merged.count >= 8 { break }
        }
        return Array(merged.prefix(8))
    }

    private func searchPlaces(_ rawQuery: String) async -> [PlaceResult] {
        let request = MKLocalSearch.Request()
        request.naturalLanguageQuery = rawQuery
        request.resultTypes = .address
        if let region = model.lastRegion {
            request.region = region
        }
        guard let response = try? await MKLocalSearch(request: request).start() else { return [] }
        return response.mapItems.prefix(4).compactMap { item in
            let coordinate = item.placemark.coordinate
            let name = item.name ?? ""
            guard !name.isEmpty else { return nil }
            return PlaceResult(
                id: UUID(),
                name: name,
                subtitle: item.placemark.title ?? "",
                latitude: coordinate.latitude,
                longitude: coordinate.longitude
            )
        }
    }

    private func selectSearchStation(_ station: Station) {
        Haptics.light()
        query = station.displayBrand
        dismissSearch()
        model.recenter(to: CLLocationCoordinate2D(latitude: station.lat, longitude: station.lng))
        model.loadAround(center: CLLocationCoordinate2D(latitude: station.lat, longitude: station.lng))
        model.select(station)
    }

    private func selectSearchPlace(_ place: PlaceResult) {
        Haptics.light()
        query = place.name
        dismissSearch()
        let coordinate = CLLocationCoordinate2D(latitude: place.latitude, longitude: place.longitude)
        model.recenter(to: coordinate)
        model.loadAround(center: coordinate)
    }

    private func dismissSearch() {
        searchFocused = false
        searchTask?.cancel()
        searchSeq += 1
        withAnimation(.spring(duration: 0.25)) {
            searchResults = nil
        }
    }

    /// Return key: pick the first suggestion (places first, like the web dropdown order).
    private func submitSearch() {
        if let place = searchResults?.places.first {
            selectSearchPlace(place)
        } else if let match = searchResults?.stations.first {
            selectSearchStation(match.station)
        }
    }
}
