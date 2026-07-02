import SwiftUI

enum AppTab: Hashable {
    case map
    case history
    case stats
    case settings
}

/// The navigation shell: a plain SwiftUI `TabView` gets the iOS 26 Liquid Glass tab bar
/// automatically; it minimizes on scroll like the system apps. Hosts the global toast.
struct RootTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s
    @State private var selection: AppTab = .map

    var body: some View {
        TabView(selection: $selection) {
            Tab(s.tabMap, systemImage: "map", value: AppTab.map) {
                MapTabView()
            }
            Tab(s.tabHistory, systemImage: "chart.xyaxis.line", value: AppTab.history) {
                HistoryTabView()
            }
            Tab(s.tabStats, systemImage: "chart.bar", value: AppTab.stats) {
                StatsTabView()
            }
            Tab(s.tabSettings, systemImage: "gearshape", value: AppTab.settings) {
                SettingsTabView()
            }
        }
        .tabBarMinimizeBehavior(.onScrollDown)
        .sensoryFeedback(.selection, trigger: selection)
        .onChange(of: app.requestedTab) { _, tab in
            guard let tab else { return }
            selection = tab
            app.requestedTab = nil
        }
        .overlay(alignment: .bottom) {
            toastOverlay
        }
    }

    /// Web-style toast: dark pill floating above the tab bar, auto-dismissed by AppState.
    @ViewBuilder
    private var toastOverlay: some View {
        if let toast = app.toast {
            Text(toast.text)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    Color(red: 17.0 / 255.0, green: 17.0 / 255.0, blue: 17.0 / 255.0).opacity(0.92),
                    in: RoundedRectangle(cornerRadius: 12, style: .continuous)
                )
                .shadow(color: .black.opacity(0.24), radius: 12, y: 6)
                .padding(.horizontal, 24)
                .padding(.bottom, 18)
                .transition(.move(edge: .bottom).combined(with: .opacity))
        }
    }
}
