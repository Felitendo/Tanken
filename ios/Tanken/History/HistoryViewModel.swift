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
            let entries = response.entries ?? []
            let parsed = entries.compactMap { entry -> HistoryPoint? in
                guard let date = Formatters.date(from: entry.timestamp) else { return nil }
                return HistoryPoint(date: date, min: entry.minPrice, avg: entry.avgPrice, max: entry.maxPrice)
            }
            .sorted { $0.date < $1.date }
            let options = await optionsResult
            withAnimation(.spring(duration: 0.5)) {
                points = parsed
                extremes = Self.fillExtremes(response.extremes, from: entries)
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

    /// Newest average across ALL loaded entries — the hero card's headline value
    /// (web `renderHistoryStats` currentAvg), independent of the selected range.
    var overallCurrentAvg: Double? {
        points.last?.avg
    }

    /// Oldest data timestamp, for the hero card's period pill.
    var sinceDate: Date? {
        points.first?.date
    }

    /// Ø of the last 7 days minus Ø of the 7 days before (web deltaWeek).
    var weekDelta: Double? {
        guard let current = avgInRange(startDaysAgo: 0, endDaysAgo: 7),
              let previous = avgInRange(startDaysAgo: 7, endDaysAgo: 14) else { return nil }
        return current - previous
    }

    /// Ø of the last 30 days minus Ø of the 30 days before (web deltaMonth).
    var monthDelta: Double? {
        guard let current = avgInRange(startDaysAgo: 0, endDaysAgo: 30),
              let previous = avgInRange(startDaysAgo: 30, endDaysAgo: 60) else { return nil }
        return current - previous
    }

    private func avgInRange(startDaysAgo: Double, endDaysAgo: Double) -> Double? {
        let now = Date()
        let start = now.addingTimeInterval(-endDaysAgo * 86400)
        let end = now.addingTimeInterval(-startDaysAgo * 86400)
        let values = points.filter { $0.date >= start && $0.date < end }.map(\.avg)
        guard !values.isEmpty else { return nil }
        return values.reduce(0, +) / Double(values.count)
    }

    /// The web falls back to the aggregated min/max entries when per-station extremes are missing.
    private static func fillExtremes(_ extremes: HistoryExtremes?, from entries: [HistoryEntry]) -> HistoryExtremes? {
        var result = extremes ?? HistoryExtremes(cheapest: nil, mostExpensive: nil)
        if result.cheapest == nil, let entry = entries.min(by: { $0.minPrice < $1.minPrice }) {
            result.cheapest = PriceExtreme(
                stationName: entry.station,
                stationId: nil,
                stationBrand: nil,
                price: entry.minPrice,
                timestamp: entry.timestamp
            )
        }
        if result.mostExpensive == nil, let entry = entries.max(by: { $0.maxPrice < $1.maxPrice }) {
            result.mostExpensive = PriceExtreme(
                stationName: entry.station,
                stationId: nil,
                stationBrand: nil,
                price: entry.maxPrice,
                timestamp: entry.timestamp
            )
        }
        if result.cheapest == nil && result.mostExpensive == nil { return nil }
        return result
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
