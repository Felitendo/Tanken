import SwiftUI
import MapKit
import ComposeApp

/// Native MapKit map for the Karte tab. It renders price-bubble annotations coloured by the shared
/// `PriceColor` logic, supports "search here" + native search, recenters on the user's location, and
/// presents the shared Compose station detail in a native `.sheet` (Liquid Glass on iOS 26).
struct MapTabView: View {
    @StateObject private var model = MapModel()
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.1657, longitude: 10.4515),
        span: MKCoordinateSpan(latitudeDelta: 2.5, longitudeDelta: 2.5)
    )
    @State private var query: String = ""
    private var s: Strings { MainViewControllerKt.currentStrings() }

    var body: some View {
        ZStack(alignment: .top) {
            Map(
                coordinateRegion: $region,
                interactionModes: .all,
                showsUserLocation: true,
                annotationItems: model.annotations
            ) { item in
                MapAnnotation(coordinate: item.coordinate, anchorPoint: CGPoint(x: 0.5, y: 1.0)) {
                    PriceBubble(text: item.price, brand: item.brand, color: item.color)
                        .onTapGesture {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            model.select(item.id)
                        }
                }
            }
            .ignoresSafeArea(edges: .top)

            // Search field + "Hier suchen" pill
            VStack(spacing: 8) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                    TextField(s.mapSearchPlaceholder, text: $query)
                        .submitLabel(.search)
                        .onSubmit(runSearch)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .glassSurface(in: RoundedRectangle(cornerRadius: 12, style: .continuous))

                Button {
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    model.searchHere(region.center)
                } label: {
                    Text(s.searchHere).font(.subheadline.weight(.semibold))
                }
                .glassProminentButton()
                .clipShape(Capsule())

                if model.loading {
                    ProgressView().padding(.top, 4)
                }
            }
            .padding(.horizontal, 12)
            .padding(.top, 8)
        }
        .overlay(alignment: .bottomTrailing) {
            Button {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                model.requestLocation()
            } label: {
                Image(systemName: "location.fill")
                    .font(.system(size: 18, weight: .semibold))
                    .padding(14)
            }
            .interactiveGlassSurface(in: Circle())
            .padding(20)
        }
        .sheet(isPresented: Binding(
            get: { model.hasSelection },
            set: { if !$0 { model.dismissDetail() } }
        )) {
            ComposeScreen { MainViewControllerKt.stationDetailController() }
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
                .ignoresSafeArea()
        }
        .onReceive(model.$recenter) { coord in
            if let c = coord {
                withAnimation(.easeInOut(duration: 0.5)) { region.center = c }
            }
        }
    }

    private func runSearch() {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        let request = MKLocalSearch.Request()
        request.naturalLanguageQuery = trimmed
        MKLocalSearch(request: request).start { response, _ in
            guard let c = response?.mapItems.first?.placemark.coordinate else { return }
            withAnimation(.easeInOut(duration: 0.5)) { region.center = c }
            model.searchHere(c)
        }
    }
}

/// Price bubble marker matching the website (white text on a price-coloured rounded rect + arrow).
private struct PriceBubble: View {
    let text: String
    let brand: String
    let color: Color

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: -1) {
                if !brand.isEmpty {
                    Text(String(brand.prefix(12)))
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(.white.opacity(0.9))
                }
                Text(text)
                    .font(.system(size: 14, weight: .heavy))
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color, in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            BubbleArrow().fill(color).frame(width: 12, height: 6)
        }
        .shadow(color: .black.opacity(0.3), radius: 3, y: 1)
    }
}

/// Downward-pointing triangle under the bubble.
private struct BubbleArrow: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        p.closeSubpath()
        return p
    }
}
