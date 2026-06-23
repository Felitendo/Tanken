import SwiftUI
import ComposeApp

/// The native navigation shell. A plain SwiftUI `TabView` automatically adopts the iOS 26 Liquid
/// Glass tab bar when built with the Xcode 26 SDK, while remaining a normal tab bar on older iOS.
/// Each tab hosts one shared Compose screen; the Map tab is replaced by a native MapKit view in
/// Phase 2.
struct RootTabView: View {
    /// iOS accent blue (#007AFF), matching the website + shared theme.
    private let accent = Color(red: 0.0, green: 122.0 / 255.0, blue: 1.0)

    var body: some View {
        TabView {
            ComposeScreen { MainViewControllerKt.mapViewController() }
                .ignoresSafeArea(edges: .top)
                .tabItem { Label("Karte", systemImage: "map") }

            ComposeScreen { MainViewControllerKt.historyViewController() }
                .tabItem { Label("Verlauf", systemImage: "chart.xyaxis.line") }

            ComposeScreen { MainViewControllerKt.statsViewController() }
                .tabItem { Label("Statistik", systemImage: "chart.bar") }

            ComposeScreen { MainViewControllerKt.settingsViewController() }
                .tabItem { Label("Einstellungen", systemImage: "gearshape") }
        }
        .tint(accent)
    }
}
