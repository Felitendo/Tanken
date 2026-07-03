import SwiftUI
import Charts

/// Stats tab: overall tiles, weekday/hour bar charts (price-colored like the web tiles) and the
/// cheapest-stations ranking from the 30-day aggregates.
struct StatsTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = StatsViewModel()
    @State private var detailTarget: StationDetailTarget?
    @State private var hourSelection: Int?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text(s.statsDescription)
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

                    if model.loading && model.stats == nil {
                        LoadingErrorState(error: nil) {}
                    } else if model.failed && model.stats == nil {
                        LoadingErrorState(error: s.errorGeneric) {
                            Task { await model.load(api: app.api, location: app.historyLocation) }
                        }
                    } else if model.stats == nil || model.dayAvgs.isEmpty {
                        emptyState
                    } else {
                        heroSection
                        bestTimesSection
                        weekdaySection
                        hourSection
                        rankingSection
                    }
                }
                .padding(16)
                .animation(.spring(duration: 0.35), value: model.locationOptions.isEmpty)
            }
            .background(Theme.background)
            .navigationTitle(s.statsTitle)
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

    /// Manual picks stop the auto-pick and drop the "Automatisch" hint — the selection is shared
    /// with the history tab, like the web keeps both pickers in sync.
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

    /// Hero card + 3-up fact row (web `.stats-hero-section`).
    private var heroSection: some View {
        VStack(spacing: 8) {
            StatsHeroCard(
                avg: model.stats?.overall?.avg,
                lowest: model.stats?.overall?.lowestEver,
                highest: model.stats?.overall?.highestEver,
                periodLabel: periodLabel,
                avgLabel: s.avgPrice,
                spreadCaption: s.priceSpread
            )
            HStack(spacing: 8) {
                FactCard(
                    icon: "chart.line.downtrend.xyaxis",
                    label: s.lowest,
                    value: Formatters.price(model.stats?.overall?.lowestEver),
                    color: Theme.good
                )
                FactCard(
                    icon: "chart.line.uptrend.xyaxis",
                    label: s.highest,
                    value: Formatters.price(model.stats?.overall?.highestEver),
                    color: Theme.bad
                )
                FactCard(
                    icon: "chart.bar.fill",
                    label: s.measurements,
                    value: "\(model.stats?.overall?.entries ?? 0)",
                    color: Color.accentColor
                )
            }
        }
    }

    /// "Heute" / "Letzte N Tage" / "Seit {Datum}" from overall.since/until (web periodLabel).
    private var periodLabel: String? {
        guard let since = Formatters.date(from: model.stats?.overall?.since) else { return nil }
        let until = Formatters.date(from: model.stats?.overall?.until) ?? Date()
        let days = max(1, Int((until.timeIntervalSince(since) / 86400).rounded()) + 1)
        if days < 2 { return s.periodToday }
        if days < 90 { return String(format: s.periodLastDaysFormat, days) }
        return String(format: s.periodSinceFormat, since.formatted(.dateTime.day().month(.wide).year()))
    }

    /// Cheapest day + cheapest hour cards with savings pills (web `.best-time-grid`).
    private var bestTimesSection: some View {
        let bestDay = model.dayAvgsByAvg.first
        let worstDay = model.dayAvgsByAvg.last
        let bestHour = model.hourAvgsByAvg.first
        let worstHour = model.hourAvgsByAvg.last
        let dayDelta = max((worstDay?.avg ?? 0) - (bestDay?.avg ?? 0), 0)
        let hourDelta = max((worstHour?.avg ?? 0) - (bestHour?.avg ?? 0), 0)

        return VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.bestTimes)
            HStack(spacing: 12) {
                BestTimeCard(
                    icon: "calendar",
                    label: s.cheapestDay,
                    value: bestDay.map { dayName(for: $0.day) } ?? "–",
                    price: Formatters.price(bestDay?.avg),
                    savings: dayDelta > 0.005 ? savingsLabel(dayDelta) : nil
                )
                BestTimeCard(
                    icon: "clock",
                    label: s.cheapestHourLabel,
                    value: bestHour.map { "\($0.hour):00\(s.clockSuffix)" } ?? "–",
                    price: Formatters.price(bestHour?.avg),
                    savings: hourDelta > 0.005 ? savingsLabel(hourDelta) : nil
                )
            }
        }
    }

    private func dayName(for day: Int) -> String {
        guard day >= 0, day < s.dayNames.count else { return "–" }
        return s.dayNames[day]
    }

    private func savingsLabel(_ delta: Double) -> String {
        "−" + String(format: "%.2f€", delta).replacingOccurrences(of: ".", with: ",") + " " + s.vsWorst
    }

    private var weekdaySection: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.weekdays.uppercased())
            WeekdayTileGrid(dayAvgs: model.stats?.dayAvgs ?? [], dayAbbr: s.dayAbbr)
        }
    }

    /// Hour-of-day line chart with rank-colored points (web `renderStatsHourChart`), scrubbable:
    /// drag across the plot to inspect any hour's average with a rule line and tooltip.
    private var hourSection: some View {
        let rankMap = Dictionary(uniqueKeysWithValues: model.hourAvgsByAvg.enumerated().map { ($0.element.hour, $0.offset) })
        let count = model.hourAvgsByAvg.count
        let domain = Theme.priceDomain(for: model.hourAvgs.map(\.avg))
        let selected = hourSelection.flatMap { sel in
            model.hourAvgs.min { abs($0.hour - sel) < abs($1.hour - sel) }
        }
        let rankRatio: (Int) -> Double = { hour in
            count > 1 ? Double(rankMap[hour] ?? 0) / Double(count - 1) : 0
        }

        return VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.hourRanking)
            Card {
                Chart {
                    ForEach(model.hourAvgs, id: \.hour) { hour in
                        AreaMark(
                            x: .value("Stunde", hour.hour),
                            yStart: .value("Ø", domain.lowerBound),
                            yEnd: .value("Ø", hour.avg)
                        )
                        .foregroundStyle(LinearGradient(
                            colors: [Theme.bad.opacity(0.34), Theme.okay.opacity(0.18), Color.yellow.opacity(0.04)],
                            startPoint: .top,
                            endPoint: .bottom
                        ))
                        .interpolationMethod(.monotone)

                        LineMark(
                            x: .value("Stunde", hour.hour),
                            y: .value("Ø", hour.avg)
                        )
                        .foregroundStyle(Theme.okay)
                        .interpolationMethod(.monotone)
                        .lineStyle(StrokeStyle(lineWidth: 2.5, lineCap: .round))

                        PointMark(
                            x: .value("Stunde", hour.hour),
                            y: .value("Ø", hour.avg)
                        )
                        .foregroundStyle(Theme.rankColor(ratio: rankRatio(hour.hour)))
                        .symbolSize(rankMap[hour.hour] == 0 ? 120 : 45)
                    }

                    if let selected {
                        RuleMark(x: .value("Stunde", selected.hour))
                            .foregroundStyle(Theme.hint.opacity(0.45))
                            .lineStyle(StrokeStyle(lineWidth: 1.5, dash: [4, 4]))
                            .zIndex(-1)
                            .annotation(
                                position: .top,
                                spacing: 8,
                                overflowResolution: .init(x: .fit(to: .chart), y: .fit(to: .chart))
                            ) {
                                hourTooltip(for: selected, color: Theme.rankColor(ratio: rankRatio(selected.hour)))
                            }

                        PointMark(
                            x: .value("Stunde", selected.hour),
                            y: .value("Ø", selected.avg)
                        )
                        .foregroundStyle(Theme.card)
                        .symbolSize(190)

                        PointMark(
                            x: .value("Stunde", selected.hour),
                            y: .value("Ø", selected.avg)
                        )
                        .foregroundStyle(Theme.rankColor(ratio: rankRatio(selected.hour)))
                        .symbolSize(100)
                    }
                }
                .chartXScale(domain: 0...23)
                .chartXAxis {
                    AxisMarks(values: [0, 6, 12, 18, 23]) { _ in
                        AxisGridLine()
                        AxisValueLabel()
                    }
                }
                .chartYScale(domain: domain)
                .chartXSelection(value: $hourSelection)
                .chartGesture { proxy in
                    ExclusiveGesture(
                        SpatialTapGesture()
                            .onEnded { value in
                                let before = hourSelection
                                proxy.selectXValue(at: value.location.x)
                                if before != nil, before == hourSelection {
                                    withAnimation(.easeOut(duration: 0.15)) {
                                        hourSelection = nil
                                    }
                                }
                            },
                        DragGesture(minimumDistance: 12)
                            .onChanged { value in
                                proxy.selectXValue(at: value.location.x)
                            }
                            .onEnded { _ in
                                withAnimation(.easeOut(duration: 0.2)) {
                                    hourSelection = nil
                                }
                            }
                    )
                }
                .sensoryFeedback(.selection, trigger: selected?.hour) { _, new in new != nil }
                .frame(height: 160)
            }
        }
    }

    private func hourTooltip(for hour: HourAvg, color: Color) -> some View {
        VStack(spacing: 2) {
            Text("\(hour.hour):00\(s.clockSuffix)")
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.secondary)
            HStack(alignment: .firstTextBaseline, spacing: 3) {
                Text("Ø")
                    .font(.system(size: 11, weight: .semibold))
                    .opacity(0.65)
                Text(Formatters.price(hour.avg))
                    .font(.system(size: 15, weight: .bold))
                    .monospacedDigit()
                    .contentTransition(.numericText())
            }
            .foregroundStyle(color)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Theme.card, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 0.5)
        }
        .shadow(color: .black.opacity(0.12), radius: 6, y: 2)
    }

    /// Top-10 ranking rows with medals, rank-colored stripe and Ø price (web `.stats-station-list`).
    private var rankingSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: s.stationRanking)
            VStack(spacing: 0) {
                let count = model.ranking.count
                ForEach(Array(model.ranking.enumerated()), id: \.offset) { index, rank in
                    rankingRow(index: index, rank: rank, count: count)
                    if index < count - 1 {
                        Divider().padding(.leading, 22)
                    }
                }
            }
            .background(Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                    .strokeBorder(Theme.separator, lineWidth: 1)
            }
        }
    }

    private func rankingRow(index: Int, rank: StationRank, count: Int) -> some View {
        let ratio = count > 1 ? Double(index) / Double(count - 1) : 0
        let color = Theme.rankColor(ratio: ratio)
        let isMedal = index < 3
        let medal = index == 0 ? "🥇" : index == 1 ? "🥈" : index == 2 ? "🥉" : "\(index + 1)"

        return Button {
            guard let id = rank.id else { return }
            Haptics.light()
            detailTarget = StationDetailTarget(id: id, name: rank.station, brand: rank.brand, price: rank.avg)
        } label: {
            HStack(spacing: 12) {
                Text(medal)
                    .font(.system(size: isMedal ? 17 : 13, weight: .bold))
                    .monospacedDigit()
                    .foregroundStyle(Theme.hint)
                    .frame(width: 24)
                Text(rank.station ?? "")
                    .font(.system(size: 14))
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                Spacer(minLength: 8)
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("Ø")
                        .font(.system(size: 11, weight: .semibold))
                        .opacity(0.65)
                    Text(Formatters.price(rank.avg))
                        .font(.system(size: 15, weight: .semibold))
                        .monospacedDigit()
                        .contentTransition(.numericText())
                }
                .foregroundStyle(color)
            }
            .padding(.vertical, 12)
            .padding(.leading, 22)
            .padding(.trailing, 16)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .overlay(alignment: .leading) {
            Capsule()
                .fill(color)
                .frame(width: isMedal ? 4 : 3)
                .padding(.vertical, isMedal ? 8 : 10)
                .padding(.leading, 6)
        }
        .scrollTransition(axis: .vertical) { content, phase in
            content.opacity(phase.isIdentity ? 1 : 0.6)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 10) {
            Image(systemName: "chart.bar")
                .font(.title)
                .foregroundStyle(.secondary)
            Text(s.noStats)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 48)
    }
}
