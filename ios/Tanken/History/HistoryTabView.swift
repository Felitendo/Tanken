import SwiftUI
import Charts

/// Verlauf tab: country + range chips, the min–max/average price chart and extremes cards —
/// the native counterpart of the web's Preisverlauf view.
struct HistoryTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = HistoryViewModel()
    @State private var appliedDefaultRange = false
    @State private var detailTarget: StationDetailTarget?

    private struct RangeOption: Identifiable, Equatable {
        let days: Int
        var id: Int { days }
    }

    private let ranges = [
        RangeOption(days: 1),
        RangeOption(days: 7),
        RangeOption(days: 14),
        RangeOption(days: 30),
        RangeOption(days: 0),
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text(s.historyDescription)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Divider()
                    }

                    countryChips
                    if !model.locationOptions.isEmpty {
                        LocationPickerRow(
                            options: model.locationOptions,
                            selection: locationBinding,
                            autoPicked: app.historyLocationAutoPicked
                        )
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }
                    SectionHeader(text: s.periodLabel)
                    rangeChips

                    if model.loading && model.filteredPoints.isEmpty {
                        LoadingErrorState(error: nil) {}
                    } else if model.failed && model.filteredPoints.isEmpty {
                        LoadingErrorState(error: s.errorGeneric) {
                            Task { await model.load(api: app.api, location: app.historyLocation) }
                        }
                    } else if model.filteredPoints.isEmpty {
                        emptyState
                    } else {
                        heroCard
                        chartCard
                        if !model.hourPoints.isEmpty {
                            hourCard
                                .transition(.opacity.combined(with: .move(edge: .top)))
                        }
                        extremesSection
                    }
                }
                .padding(16)
                .animation(.spring(duration: 0.35), value: model.rangeDays)
                .animation(.spring(duration: 0.35), value: model.locationOptions.isEmpty)
            }
            .background(Theme.background)
            .navigationTitle(s.historyTitle)
            .refreshable {
                Haptics.light()
                await model.load(api: app.api, location: app.historyLocation)
            }
        }
        .sheet(item: $detailTarget) { target in
            StationDetailSheet(
                stationId: target.id,
                fallbackName: target.name,
                fallbackBrand: target.brand,
                fallbackPrice: target.price
            )
        }
        .task {
            // The synced historyDefaultDays setting (1 = 24 h, 7 = 7 days) seeds the range once.
            if !appliedDefaultRange {
                appliedDefaultRange = true
                model.rangeDays = app.historyDefaultDays == 1 ? 1 : 7
            }
            await model.loadIfNeeded(api: app.api, location: app.historyLocation)
            await app.autoPickHistoryLocation(from: model.locationOptions)
        }
        .onChange(of: model.country) {
            Task { await model.load(api: app.api, location: app.historyLocation) }
        }
        .onChange(of: app.historyLocation) {
            Task { await model.loadIfNeeded(api: app.api, location: app.historyLocation) }
        }
        .onChange(of: app.baseURLString) {
            Task { await model.load(api: app.api, location: app.historyLocation) }
        }
    }

    /// Manual picks flow through here — they stop the auto-pick like the web's
    /// `locationPickerTouched` and drop the "Automatisch" hint on both tabs.
    private var locationBinding: Binding<String?> {
        Binding(
            get: { app.historyLocation },
            set: { value in
                app.historyLocation = value
                app.historyLocationTouched = true
                app.historyLocationAutoPicked = false
            }
        )
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
        case 1: return s.range24h
        case 7: return s.days7
        case 14: return s.days14
        case 30: return s.days30
        default: return s.allRange
        }
    }

    /// Extra hour chart shown in 24h mode — average per hour bucket, price-colored like the
    /// stats hour chart.
    private var hourCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                SectionHeader(text: s.hourlyTitle)
                let avgValues = model.hourPoints.map(\.avg)
                let domain = Theme.priceDomain(for: avgValues)
                Chart(model.hourPoints) { point in
                    BarMark(
                        x: .value("Zeit", point.date, unit: .hour),
                        yStart: .value("Ø", domain.lowerBound),
                        yEnd: .value("Ø", point.avg)
                    )
                    .foregroundStyle(Theme.priceColor(ratio: ratio(of: point.avg, within: avgValues)))
                    .cornerRadius(2)
                }
                .chartXAxis {
                    AxisMarks(values: .stride(by: .hour, count: 6)) { _ in
                        AxisGridLine()
                        AxisValueLabel(format: .dateTime.hour())
                    }
                }
                .chartYScale(domain: domain)
                .frame(height: 140)
            }
        }
    }

    private func ratio(of value: Double, within values: [Double]) -> Double {
        guard let min = values.min(), let max = values.max(), max > min else { return 0 }
        return (value - min) / (max - min)
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

    /// Gradient hero card matching the web's `.history-hero-card`: current average with count-up,
    /// period pill, trend glyph and week/month delta pills. Computed over ALL loaded data, so it
    /// stays put while the range chips only re-scope the chart.
    private var heroCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(s.currentAvg)
                        .font(.system(size: 11, weight: .semibold))
                        .textCase(.uppercase)
                        .kerning(0.7)
                        .foregroundStyle(Theme.hint)
                    Text(Formatters.price(model.overallCurrentAvg))
                        .font(.system(size: 36, weight: .heavy))
                        .monospacedDigit()
                        .foregroundStyle(.primary)
                        .contentTransition(.numericText())
                    if let period = periodLabel {
                        HStack(spacing: 5) {
                            Image(systemName: "calendar")
                                .font(.system(size: 11, weight: .semibold))
                            Text(period)
                                .font(.system(size: 11, weight: .semibold))
                        }
                        .foregroundStyle(Color.accentColor)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Color.accentColor.opacity(0.12), in: Capsule())
                        .padding(.top, 6)
                    }
                }
                Spacer(minLength: 0)
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(trendColor(model.weekDelta).opacity(0.14))
                    .frame(width: 44, height: 44)
                    .overlay {
                        Image(systemName: trendIcon(model.weekDelta))
                            .font(.system(size: 19, weight: .semibold))
                            .foregroundStyle(trendColor(model.weekDelta))
                    }
            }
            if model.weekDelta != nil || model.monthDelta != nil {
                HStack(spacing: 8) {
                    trendPill(delta: model.weekDelta, label: s.vsLastWeek)
                    trendPill(delta: model.monthDelta, label: s.vsLastMonth)
                }
                .padding(.top, 14)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .heroCardSurface()
    }

    /// "Heute" / "Letzte N Tage" / "Seit {Datum}" from the oldest loaded entry (web periodLabel).
    private var periodLabel: String? {
        guard let since = model.sinceDate else { return nil }
        let days = max(1, Int((Date().timeIntervalSince(since) / 86400).rounded()) + 1)
        if days < 2 { return s.periodToday }
        if days < 90 { return String(format: s.periodLastDaysFormat, days) }
        return String(format: s.periodSinceFormat, since.formatted(.dateTime.day().month(.wide).year()))
    }

    private func trendColor(_ delta: Double?) -> Color {
        guard let delta, abs(delta) >= 0.005 else { return Theme.hint }
        return delta < 0 ? Theme.good : Theme.bad
    }

    private func trendIcon(_ delta: Double?) -> String {
        guard let delta, abs(delta) >= 0.005 else { return "chart.bar.fill" }
        return delta < 0 ? "chart.line.downtrend.xyaxis" : "chart.line.uptrend.xyaxis"
    }

    @ViewBuilder
    private func trendPill(delta: Double?, label: String) -> some View {
        if let delta {
            let color = trendColor(delta)
            HStack(spacing: 6) {
                Text(trendArrow(delta))
                    .font(.system(size: 12, weight: .bold))
                Text(Formatters.delta(delta))
                    .font(.system(size: 12, weight: .bold))
                    .monospacedDigit()
                Text(label)
                    .font(.system(size: 12, weight: .medium))
                    .opacity(0.75)
            }
            .foregroundStyle(color)
            .padding(.horizontal, 11)
            .padding(.vertical, 5)
            .background(color.opacity(0.16), in: Capsule())
        }
    }

    private func trendArrow(_ delta: Double) -> String {
        if abs(delta) < 0.005 { return "→" }
        return delta < 0 ? "↓" : "↑"
    }

    private var extremesSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.summary)
            HStack(spacing: 8) {
                if let cheapest = model.extremes?.cheapest {
                    extremeCard(label: s.lowestPrice, extreme: cheapest, color: Theme.good, icon: "chart.line.downtrend.xyaxis")
                }
                if let priciest = model.extremes?.mostExpensive {
                    extremeCard(label: s.highestPrice, extreme: priciest, color: Theme.bad, icon: "chart.line.uptrend.xyaxis")
                }
            }
        }
    }

    private func extremeCard(label: String, extreme: PriceExtreme, color: Color, icon: String) -> some View {
        var action: (() -> Void)?
        if let id = extreme.stationId {
            action = {
                detailTarget = StationDetailTarget(
                    id: id,
                    name: extreme.stationName,
                    brand: extreme.stationBrand,
                    price: extreme.price
                )
            }
        }
        return ExtremeCard(
            label: label,
            price: extreme.price,
            station: extreme.stationName ?? extreme.stationBrand ?? "–",
            color: color,
            icon: icon,
            action: action
        )
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

/// Identifiable payload for the extreme-card → station-detail sheet.
struct StationDetailTarget: Identifiable {
    let id: String
    var name: String?
    var brand: String?
    var price: Double?
}
