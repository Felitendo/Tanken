import SwiftUI

/// Placeholder — replaced by the full settings screen (account, fuel, appearance, server).
struct SettingsTabView: View {
    @Environment(\.strings) private var s

    var body: some View {
        NavigationStack {
            ProgressView()
                .navigationTitle(s.settingsTitle)
        }
    }
}
