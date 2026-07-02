import SwiftUI
import Charts

/// Stats tab: overall tiles, weekday/hour bar charts (price-colored like the web tiles) and the
/// cheapest-stations ranking from the 30-day aggregates.
struct StatsTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var model = StatsViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(s.statsDescription)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    countryChips

                    if model.loading && model.stats == nil {
                        LoadingErrorState(error: nil) {}
                    } else if model.failed && model.stats == nil {
                        LoadingErrorState(error: s.errorGeneric) {
                            Task { await model.load(api: app.api) }
                        }
                    } else if model.stats == nil || model.dayAvgs.isEmpty {
                        emptyState
                    } else {
                        overallTiles
                        weekdayCard
                        hourCard
                        rankingCard
                    }
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle(s.statsTitle)
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

    private var overallTiles: some View {
        HStack(spacing: 10) {
            StatTile(
                title: s.lowest,
                value: Formatters.price(model.stats?.overall?.lowestEver),
                color: Theme.good
            )
            StatTile(
                title: s.average30d,
                value: Formatters.price(model.stats?.overall?.avg),
                color: .primary
            )
            StatTile(
                title: s.highest,
                value: Formatters.price(model.stats?.overall?.highestEver),
                color: Theme.bad
            )
        }
    }

    private var weekdayCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                SectionHeader(text: s.weekdays)
                let avgValues = model.dayAvgs.map(\.avg)
                Chart(model.dayAvgs, id: \.day) { day in
                    BarMark(
                        x: .value("Tag", day.name ?? String(day.day)),
                        y: .value("Ø", day.avg)
                    )
                    .foregroundStyle(Theme.priceColor(ratio: model.ratio(of: day.avg, within: avgValues)))
                    .cornerRadius(4)
                }
                .chartYScale(domain: .automatic(includesZero: false))
                .frame(height: 160)
            }
        }
    }

    private var hourCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                SectionHeader(text: s.cheapestTime)
                if let cheapest = model.cheapestHour {
                    Text("\(cheapest.hour):00\(s.clockSuffix)")
                        .font(.title3.weight(.bold))
                        .foregroundStyle(Theme.good)
                        .contentTransition(.numericText())
                }
                let avgValues = model.hourAvgs.map(\.avg)
                Chart(model.hourAvgs, id: \.hour) { hour in
                    BarMark(
                        x: .value("Stunde", hour.hour),
                        y: .value("Ø", hour.avg)
                    )
                    .foregroundStyle(Theme.priceColor(ratio: model.ratio(of: hour.avg, within: avgValues)))
                    .cornerRadius(2)
                }
                .chartYScale(domain: .automatic(includesZero: false))
                .frame(height: 140)
            }
        }
    }

    private var rankingCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 4) {
                SectionHeader(text: s.cheapestStations)
                    .padding(.bottom, 6)
                ForEach(Array(model.ranking.enumerated()), id: \.offset) { index, rank in
                    HStack(spacing: 10) {
                        Text("\(index + 1)")
                            .font(.footnote.weight(.bold))
                            .foregroundStyle(index < 3 ? Color.accentColor : Theme.hint)
                            .frame(width: 22, alignment: .center)
                        VStack(alignment: .leading, spacing: 1) {
                            Text(rank.brand ?? rank.station ?? "")
                                .font(.subheadline.weight(.medium))
                                .lineLimit(1)
                            if rank.brand != nil, let station = rank.station {
                                Text(station)
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                                    .lineLimit(1)
                            }
                        }
                        Spacer(minLength: 8)
                        Text(Formatters.price(rank.avg))
                            .font(.subheadline.weight(.semibold))
                            .contentTransition(.numericText())
                    }
                    .padding(.vertical, 6)
                    .scrollTransition(axis: .vertical) { content, phase in
                        content.opacity(phase.isIdentity ? 1 : 0.6)
                    }
                    if index < model.ranking.count - 1 {
                        Divider()
                    }
                }
            }
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
