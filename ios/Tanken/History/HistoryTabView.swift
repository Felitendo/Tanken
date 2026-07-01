import SwiftUI

/// Placeholder — replaced by the price history charts.
struct HistoryTabView: View {
    @Environment(\.strings) private var s

    var body: some View {
        NavigationStack {
            ProgressView()
                .navigationTitle(s.historyTitle)
        }
    }
}
