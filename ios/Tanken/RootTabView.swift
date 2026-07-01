import SwiftUI

enum AppTab: Hashable {
    case map
    case history
    case stats
    case settings
}

/// The navigation shell: a plain SwiftUI `TabView` gets the iOS 26 Liquid Glass tab bar
/// automatically; it minimizes on scroll like the system apps.
struct RootTabView: View {
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
    }
}
