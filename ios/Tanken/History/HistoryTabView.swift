import SwiftUI

/// Verlauf tab: country + range chips, the min–max/average price chart and extremes cards —
/// the native counterpart of the web's Preisverlauf view.
struct HistoryTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = HistoryViewModel()
    @State private var appliedDefaultRange = false
    @State private var detailTarget: StationDetailTarget?
    @State private var drillDay: ChartDay?

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
                        if let drill = drillDay {
                            drillHourCard(drill)
                                .transition(.opacity.combined(with: .move(edge: .top)))
                        } else if !model.hourPoints.isEmpty {
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
        .onChange(of: model.rangeDays) {
            drillDay = nil
        }
        .onChange(of: model.country) {
            drillDay = nil
            Task { await model.load(api: app.api, location: app.historyLocation) }
        }
        .onChange(of: app.historyLocation) {
            drillDay = nil
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

    /// Extra hour chart shown in 24h mode — per-hour minimum, same warm line recipe as the web.
    private var hourCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                SectionHeader(text: s.hourlyTitle)
                PriceLineChart(
                    points: model.hourPoints.map { ($0.date, $0.min) },
                    height: 140,
                    hourAxis: true
                )
            }
        }
    }

    /// Tap-to-drill-down hour view for one day of the range chart (web `renderHourChart`):
    /// day label + close button over the day's raw minimum prices.
    private func drillHourCard(_ day: ChartDay) -> some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text(drillDayLabel(day))
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(.secondary)
                    Spacer(minLength: 0)
                    Button {
                        Haptics.light()
                        withAnimation(.spring(duration: 0.3)) {
                            drillDay = nil
                        }
                    } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(.secondary)
                            .padding(6)
                            .background(Theme.background, in: Circle())
                    }
                    .buttonStyle(.plain)
                }
                PriceLineChart(
                    points: day.entries.map { ($0.date, $0.min) },
                    height: 140,
                    hourAxis: true
                )
            }
        }
    }

    private func drillDayLabel(_ day: ChartDay) -> String {
        let weekday = Calendar.current.component(.weekday, from: day.day) - 1
        let name = weekday >= 0 && weekday < s.dayNames.count ? s.dayNames[weekday] : ""
        return "\(name) \(day.day.formatted(.dateTime.day().month().year()))"
    }

    /// Main range chart (web `renderChart`): one point per day at the day's minimum price,
    /// rank-colored line + points and the warm vertical fill. Scrub to inspect prices; tapping
    /// a day with intraday data opens the hour drill-down.
    private var chartCard: some View {
        let dayPoints: [(Date, Double)] = model.rangeDays == 1
            ? model.filteredPoints.map { ($0.date, $0.min) }
            : model.chartDays.map { ($0.day, $0.minPrice) }
        // In 24h mode there is nothing to drill into — a tap pins the tooltip instead.
        var drillAction: ((Date) -> Void)?
        if model.rangeDays != 1 {
            drillAction = { tapped in
                let day = Calendar.current.startOfDay(for: tapped)
                if let hit = model.chartDays.first(where: { $0.day == day }), hit.entries.count > 1 {
                    Haptics.light()
                    withAnimation(.spring(duration: 0.3)) {
                        drillDay = hit
                    }
                }
            }
        }
        return Card {
            PriceLineChart(
                points: dayPoints,
                height: 220,
                hourAxis: model.rangeDays == 1,
                onTap: drillAction
            )
            .animation(.spring(duration: 0.5), value: model.rangeDays)
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
