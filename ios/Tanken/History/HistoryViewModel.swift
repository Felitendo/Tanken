import SwiftUI
import Observation

/// A parsed history point ready for Swift Charts.
struct HistoryPoint: Identifiable, Equatable {
    let date: Date
    let min: Double
    let avg: Double
    let max: Double

    var id: Date { date }
}

/// Loads `/api/history` for the selected country + scan location and filters it client-side by
/// range, mirroring the web's Zeitraum chips (1 = 24 h, 7/14/30 days, 0 = everything).
@MainActor
@Observable
final class HistoryViewModel {
    var country: Country = .de
    /// Selected range in days; 1 means "24 h", 0 means "Alles".
    var rangeDays = 7

    private(set) var points: [HistoryPoint] = []
    private(set) var extremes: HistoryExtremes?
    private(set) var loading = false
    private(set) var failed = false
    /// Scan locations with history data for the picker (shared UI with the stats tab).
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
            let response = try await api.history(location: location, country: country)
            let parsed = (response.entries ?? []).compactMap { entry -> HistoryPoint? in
                guard let date = Formatters.date(from: entry.timestamp) else { return nil }
                return HistoryPoint(date: date, min: entry.minPrice, avg: entry.avgPrice, max: entry.maxPrice)
            }
            .sorted { $0.date < $1.date }
            let options = await optionsResult
            withAnimation(.spring(duration: 0.5)) {
                points = parsed
                extremes = response.extremes
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

    /// Points within the selected range (0 = all).
    var filteredPoints: [HistoryPoint] {
        guard rangeDays > 0 else { return points }
        let cutoff = Date().addingTimeInterval(-Double(rangeDays) * 24 * 3600)
        return points.filter { $0.date >= cutoff }
    }

    var currentAverage: Double? {
        filteredPoints.last?.avg
    }

    /// Average trend across the selected range (last avg minus first avg).
    var trendDelta: Double? {
        guard let first = filteredPoints.first?.avg, let last = filteredPoints.last?.avg else { return nil }
        return last - first
    }

    /// Hour buckets of the last 24 h for the extra hour chart in 24h mode (web hour drill-down).
    var hourPoints: [HistoryPoint] {
        guard rangeDays == 1 else { return [] }
        let calendar = Calendar.current
        let buckets = Dictionary(grouping: filteredPoints) { point in
            calendar.dateInterval(of: .hour, for: point.date)?.start ?? point.date
        }
        return buckets.map { start, group in
            HistoryPoint(
                date: start,
                min: group.map(\.min).min() ?? 0,
                avg: group.map(\.avg).reduce(0, +) / Double(group.count),
                max: group.map(\.max).max() ?? 0
            )
        }
        .sorted { $0.date < $1.date }
    }
}
