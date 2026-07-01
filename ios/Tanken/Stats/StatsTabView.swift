import SwiftUI

/// Placeholder — replaced by the statistics tiles and charts.
struct StatsTabView: View {
    @Environment(\.strings) private var s

    var body: some View {
        NavigationStack {
            ProgressView()
                .navigationTitle(s.statsTitle)
        }
    }
}
