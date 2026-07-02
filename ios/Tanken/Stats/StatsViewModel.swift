import SwiftUI
import Observation

/// Loads `/api/stats` (30-day aggregates) for the selected country.
@MainActor
@Observable
final class StatsViewModel {
    var country: Country = .de

    private(set) var stats: HistoryStats?
    private(set) var loading = false
    private(set) var failed = false
    private var loadedCountry: Country?

    func loadIfNeeded(api: ApiClient) async {
        guard loadedCountry != country else { return }
        await load(api: api)
    }

    func load(api: ApiClient) async {
        loading = true
        failed = false
        do {
            let result = try await api.stats(country: country)
            withAnimation(.spring(duration: 0.5)) {
                stats = result
                loading = false
            }
            loadedCountry = country
        } catch {
            withAnimation(.spring(duration: 0.3)) {
                failed = true
                loading = false
            }
        }
    }

    var dayAvgs: [DayAvg] {
        (stats?.dayAvgs ?? []).sorted { $0.day < $1.day }
    }

    var hourAvgs: [HourAvg] {
        (stats?.hourAvgs ?? []).sorted { $0.hour < $1.hour }
    }

    var ranking: [StationRank] {
        Array((stats?.stationRanking ?? []).prefix(10))
    }

    /// The cheapest hour of the day, for the headline fact tile.
    var cheapestHour: HourAvg? {
        hourAvgs.min { $0.avg < $1.avg }
    }

    /// Ratio of `value` across the min…max of the given series, for price-coloring bars like the web.
    func ratio(of value: Double, within values: [Double]) -> Double {
        guard let min = values.min(), let max = values.max(), max > min else { return 0 }
        return (value - min) / (max - min)
    }
}
