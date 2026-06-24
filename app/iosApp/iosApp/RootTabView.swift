import SwiftUI
import UIKit
import ComposeApp

/// The native navigation shell. A plain SwiftUI `TabView` automatically adopts the iOS 26 Liquid
/// Glass tab bar when built with the Xcode 26 SDK, while remaining a normal tab bar on older iOS.
/// Each tab hosts one shared Compose screen; the Map tab is replaced by a native MapKit view in
/// Phase 2.
struct RootTabView: View {
    /// iOS accent blue (#007AFF), matching the website + shared theme.
    private let accent = Color(red: 0.0, green: 122.0 / 255.0, blue: 1.0)
    private var s: Strings { MainViewControllerKt.currentStrings() }

    /// Captured by the Kotlin/Native unhandled-exception hook on the previous run; shown once so the
    /// real exception (type + message + stack) is readable on-device when the `.ips` is unsymbolicated.
    @State private var crashReport: String?

    var body: some View {
        TabView {
            MapTabView()
                .tabItem { Label(s.tabMap, systemImage: "map") }

            ComposeScreen { MainViewControllerKt.historyViewController() }
                .tabItem { Label(s.tabHistory, systemImage: "chart.xyaxis.line") }

            ComposeScreen { MainViewControllerKt.statsViewController() }
                .tabItem { Label(s.tabStats, systemImage: "chart.bar") }

            ComposeScreen { MainViewControllerKt.settingsViewController() }
                .tabItem { Label(s.tabSettings, systemImage: "gearshape") }
        }
        .tint(accent)
        .onAppear {
            if let report = MainViewControllerKt.lastCrashReport() {
                crashReport = report
                MainViewControllerKt.clearLastCrashReport()
            }
        }
        .alert(
            "Letzter Absturz",
            isPresented: Binding(get: { crashReport != nil }, set: { if !$0 { crashReport = nil } })
        ) {
            Button("Kopieren") {
                UIPasteboard.general.string = crashReport
                crashReport = nil
            }
            Button("OK", role: .cancel) { crashReport = nil }
        } message: {
            Text(crashReport ?? "")
        }
    }
}
