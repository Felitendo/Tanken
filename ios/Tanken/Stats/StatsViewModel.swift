import SwiftUI
import Observation

/// Loads `/api/stats` (30-day aggregates) for the selected country + scan location.
@MainActor
@Observable
final class StatsViewModel {
    var country: Country = .de

    private(set) var stats: HistoryStats?
    private(set) var loading = false
    private(set) var failed = false
    /// Scan locations with history data for the picker (shared UI with the history tab).
    private(set) var locationOptions: [LocationOption] = []
    private var loadedCountry: Country?
    private var loadedLocation: String??

    func loadIfNeeded(api: ApiClient, location: String?) async {
        guard loadedCountry != country || loadedLocation != .some(location) else { return }
        await load(api: api, location: location)
    }

    func load(api: ApiClient, location: String?) async {
        loading = true
        failed = false
        async let optionsResult = LocationPickerData.load(api: api, country: country)
        do {
            let result = try await api.stats(location: location, country: country)
            let options = await optionsResult
            withAnimation(.spring(duration: 0.5)) {
                stats = result
                locationOptions = options
                loading = false
            }
            loadedCountry = country
            loadedLocation = .some(location)
        } catch {
            locationOptions = await optionsResult
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
