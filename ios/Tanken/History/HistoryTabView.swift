import SwiftUI
import Charts

/// Verlauf tab: country + range chips, the min–max/average price chart and extremes cards —
/// the native counterpart of the web's Preisverlauf view.
struct HistoryTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = HistoryViewModel()

    private struct RangeOption: Identifiable, Equatable {
        let days: Int
        var id: Int { days }
    }

    private let ranges = [RangeOption(days: 7), RangeOption(days: 14), RangeOption(days: 30), RangeOption(days: 0)]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(s.historyDescription)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    countryChips
                    SectionHeader(text: s.periodLabel)
                    rangeChips

                    if model.loading && model.filteredPoints.isEmpty {
                        LoadingErrorState(error: nil) {}
                    } else if model.failed && model.filteredPoints.isEmpty {
                        LoadingErrorState(error: s.errorGeneric) {
                            Task { await model.load(api: app.api) }
                        }
                    } else if model.filteredPoints.isEmpty {
                        emptyState
                    } else {
                        chartCard
                        summaryTiles
                        extremesSection
                    }
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle(s.historyTitle)
        }
        .task {
            await model.loadIfNeeded(api: app.api)
        }
        .onChange(of: model.country) {
            Task { await model.load(api: app.api) }
        }
        .onChange(of: app.baseURLString) {
            Task { await model.load(api: app.api) }
        }
    }

    private var countryChips: some View {
        ChipRow(items: Country.allCases, selection: $model.country) { country in
            Text("\(country.flag) \(country == .de ? s.countryDe : s.countryAt)")
        }
    }

    private var rangeChips: some View {
        ChipRow(items: ranges, selection: rangeBinding) { option in
            Text(label(for: option))
        }
    }

    private var rangeBinding: Binding<RangeOption> {
        Binding(
            get: { RangeOption(days: model.rangeDays) },
            set: { model.rangeDays = $0.days }
        )
    }

    private func label(for option: RangeOption) -> String {
        switch option.days {
        case 7: return s.days7
        case 14: return s.days14
        case 30: return s.days30
        default: return s.allRange
        }
    }

    private var chartCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 14) {
                    legendDot(color: Color.accentColor, label: s.averageLabel)
                    legendDot(color: Color.accentColor.opacity(0.25), label: s.spanMinMax)
                }
                Chart(model.filteredPoints) { point in
                    AreaMark(
                        x: .value("Zeit", point.date),
                        yStart: .value("Min", point.min),
                        yEnd: .value("Max", point.max)
                    )
                    .foregroundStyle(Color.accentColor.opacity(0.15))
                    .interpolationMethod(.monotone)

                    LineMark(
                        x: .value("Zeit", point.date),
                        y: .value("Ø", point.avg)
                    )
                    .foregroundStyle(Color.accentColor)
                    .interpolationMethod(.monotone)
                    .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round))
                }
                .chartYScale(domain: .automatic(includesZero: false))
                .frame(height: 220)
                .animation(.spring(duration: 0.5), value: model.rangeDays)
            }
        }
    }

    private func legendDot(color: Color, label: String) -> some View {
        HStack(spacing: 5) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private var summaryTiles: some View {
        HStack(spacing: 10) {
            StatTile(
                title: s.currentAverage,
                value: Formatters.price(model.currentAverage),
                color: .primary
            )
            StatTile(
                title: s.periodTrendTitle(days: model.rangeDays),
                value: trendText,
                color: trendColor
            )
        }
    }

    private var trendText: String {
        guard let delta = model.trendDelta else { return "–" }
        let cents = delta * 100
        let sign = cents > 0 ? "+" : ""
        return String(format: "%@%.1f ct", sign, cents).replacingOccurrences(of: ".", with: ",")
    }

    private var trendColor: Color {
        guard let delta = model.trendDelta else { return .primary }
        if delta > 0.001 { return Theme.bad }
        if delta < -0.001 { return Theme.good }
        return .primary
    }

    private var extremesSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.extremes.uppercased())
            HStack(spacing: 10) {
                if let cheapest = model.extremes?.cheapest {
                    extremeCard(title: s.cheapest, extreme: cheapest, color: Theme.good)
                }
                if let priciest = model.extremes?.mostExpensive {
                    extremeCard(title: s.mostExpensive, extreme: priciest, color: Theme.bad)
                }
            }
        }
    }

    private func extremeCard(title: String, extreme: PriceExtreme, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(Formatters.price(extreme.price))
                .font(.title3.weight(.bold))
                .foregroundStyle(color)
                .contentTransition(.numericText())
            Text(extreme.stationBrand ?? extreme.stationName ?? "")
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            if let date = Formatters.date(from: extreme.timestamp) {
                Text(date.formatted(.dateTime.day().month().year()))
                    .font(.caption2)
                    .foregroundStyle(Theme.hint)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
    }

    private var emptyState: some View {
        VStack(spacing: 10) {
            Image(systemName: "chart.xyaxis.line")
                .font(.title)
                .foregroundStyle(.secondary)
            Text(s.noHistory)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 48)
    }
}

private extension Strings {
    /// "Trend (7 Tage)" tile title — "Trend" reads the same in German and English.
    func periodTrendTitle(days: Int) -> String {
        let range: String
        switch days {
        case 7: range = days7
        case 14: range = days14
        case 30: range = days30
        default: range = allRange
        }
        return "Trend (\(range))"
    }
}
