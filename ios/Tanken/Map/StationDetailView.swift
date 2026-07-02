import SwiftUI
import Charts
import UIKit

/// Station detail inside the bottom drawer, mirroring the web's `showStationSheet` content order:
/// header (name/brand/star) → big colored price → address → status/distance → last updated →
/// collapsible opening hours → maps buttons → per-station price-history chart (24h/7d).
struct StationDetailView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s
    let station: Station
    let band: PriceBand?
    let dataTimestamp: Date?
    let onBack: () -> Void

    @State private var detail: StationDetail?
    @State private var hoursExpanded = false
    @State private var chartEntries: [HistoryEntry]?
    @State private var chartDays = 7
    @State private var chartLoading = true

    private var priceColor: Color {
        Theme.priceColor(price: station.price, p10: band?.p10, p90: band?.p90)
    }

    private var isOpen: Bool? {
        detail?.isOpen ?? station.isOpen
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                header
                priceHero
                infoDivider
                addressRow
                infoDivider
                statusRow
                if let dataTimestamp {
                    infoDivider
                    updatedRow(dataTimestamp)
                }
                infoDivider
                hoursSection
                navButtons
                chartSection
            }
            .padding(.bottom, 24)
        }
        .task(id: "\(station.id)-\(app.fuelType.rawValue)") {
            chartDays = app.historyDefaultDays == 1 ? 1 : 7
            async let detailResult = app.api.stationDetail(id: station.id)
            async let historyResult = app.api.stationHistory(
                name: station.name ?? station.displayBrand,
                id: station.id,
                fuel: app.fuelType
            )
            let loadedDetail = try? await detailResult
            let loadedHistory = (try? await historyResult) ?? []
            withAnimation(.spring(duration: 0.4)) {
                detail = loadedDetail
                chartEntries = loadedHistory
                chartLoading = false
            }
            adjustRangeToAvailability()
        }
    }

    // MARK: - Header + price

    private var header: some View {
        HStack(alignment: .center, spacing: 8) {
            Button {
                Haptics.light()
                onBack()
            } label: {
                Image(systemName: "chevron.left")
                    .font(.body.weight(.semibold))
                    .padding(6)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            VStack(alignment: .leading, spacing: 1) {
                Text(station.name ?? station.displayBrand)
                    .font(.system(size: 18, weight: .bold))
                    .lineLimit(1)
                if let brand = station.brand, !brand.isEmpty {
                    Text(brand)
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.hint)
                }
            }
            Spacer()
            Button {
                app.toggleFavourite(station.id)
            } label: {
                Image(systemName: app.isFavourite(station.id) ? "star.fill" : "star")
                    .font(.title3)
                    .foregroundStyle(app.isFavourite(station.id) ? Theme.favorite : Theme.hint)
                    .symbolEffect(.bounce, value: app.isFavourite(station.id))
                    .padding(4)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 12)
        .padding(.bottom, 4)
    }

    private var priceHero: some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text(Formatters.priceText(station.price))
                .font(.system(size: 36, weight: .heavy))
                .foregroundStyle(priceColor)
                .contentTransition(.numericText())
            Text("€/L")
                .font(.system(size: 16))
                .foregroundStyle(Theme.hint)
        }
        .frame(maxWidth: .infinity, alignment: .center)
        .padding(.vertical, 8)
    }

    // MARK: - Info rows (web .sheet-info-row)

    private var infoDivider: some View {
        Divider().padding(.leading, 20)
    }

    private func infoRow(icon: String, @ViewBuilder content: () -> some View) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Theme.hint)
                .frame(width: 24)
            content()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 10)
    }

    private var addressRow: some View {
        infoRow(icon: "mappin.and.ellipse") {
            Text([station.addressLine, station.cityLine].filter { !$0.isEmpty }.joined(separator: ", "))
                .font(.system(size: 14))
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private var statusRow: some View {
        HStack(spacing: 10) {
            if let isOpen {
                Circle()
                    .fill(isOpen ? Theme.good : Theme.bad)
                    .frame(width: 10, height: 10)
                Text(isOpen ? s.open : s.closed)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(isOpen ? Theme.good : Theme.bad)
            }
            Spacer()
            if let dist = station.dist {
                Text(String(
                    format: s.distanceAwayFormat,
                    Formatters.distance(dist, approximate: station.distApprox == true)
                ))
                .font(.system(size: 13))
                .foregroundStyle(Theme.hint)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 10)
    }

    private func updatedRow(_ timestamp: Date) -> some View {
        infoRow(icon: "clock") {
            Text(String(format: s.lastUpdatedFormat, agoText(timestamp)))
                .font(.system(size: 13))
                .foregroundStyle(Theme.hint)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private func agoText(_ date: Date) -> String {
        let minutes = Int(-date.timeIntervalSinceNow / 60)
        if minutes < 1 { return s.justNow }
        if minutes < 60 { return String(format: s.minutesAgoFormat, minutes) }
        return String(format: s.hoursAgoFormat, minutes / 60)
    }

    // MARK: - Opening hours (collapsible like the web)

    @ViewBuilder
    private var hoursSection: some View {
        let times = detail?.openingTimes ?? []
        if detail?.wholeDay == true || !times.isEmpty {
            VStack(spacing: 0) {
                Button {
                    Haptics.selection()
                    withAnimation(.spring(duration: 0.3)) {
                        hoursExpanded.toggle()
                    }
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "clock")
                            .font(.system(size: 15))
                            .foregroundStyle(Theme.hint)
                            .frame(width: 24)
                        Text(s.openingTimes)
                            .font(.system(size: 14, weight: .medium))
                        Spacer()
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Theme.hint)
                            .rotationEffect(.degrees(hoursExpanded ? 180 : 0))
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if hoursExpanded {
                    VStack(spacing: 6) {
                        if detail?.wholeDay == true {
                            HStack {
                                Text(s.wholeDay)
                                    .font(.system(size: 14))
                                Spacer()
                            }
                        } else {
                            ForEach(Array(times.enumerated()), id: \.offset) { _, time in
                                HStack {
                                    Text(time.text ?? "")
                                        .font(.system(size: 14))
                                    Spacer()
                                    Text("\(time.start ?? "")–\(time.end ?? "")")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(.secondary)
                                        .monospacedDigit()
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 10)
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }
                infoDivider
            }
        }
    }

    // MARK: - Maps buttons (web .sheet-nav-buttons)

    private var navButtons: some View {
        HStack(spacing: 10) {
            navButton(label: s.googleMaps, icon: "map") {
                openGoogleMaps()
            }
            navButton(label: s.appleMaps, icon: "arrow.triangle.turn.up.right.diamond") {
                openAppleMaps()
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    private func navButton(label: String, icon: String, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.medium()
            action()
        } label: {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 15, weight: .semibold))
                Text(label)
                    .font(.system(size: 14, weight: .semibold))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 13)
            .background(Color.primary.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
        .buttonStyle(PressableRowStyle())
    }

    private func openAppleMaps() {
        let url = URL(string: "maps://?daddr=\(station.lat),\(station.lng)")
        if let url, UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else if let web = URL(string: "https://maps.apple.com/?daddr=\(station.lat),\(station.lng)") {
            UIApplication.shared.open(web)
        }
    }

    private func openGoogleMaps() {
        let url = URL(string: "comgooglemaps://?daddr=\(station.lat),\(station.lng)&directionsmode=driving")
        if let url, UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else if let web = URL(string: "https://www.google.com/maps/dir/?api=1&destination=\(station.lat),\(station.lng)") {
            UIApplication.shared.open(web)
        }
    }

    // MARK: - Price history chart (web .sheet-chart-section)

    private struct ChartPoint: Identifiable {
        let date: Date
        let value: Double
        var id: Date { date }
    }

    private var chartPoints: [ChartPoint] {
        guard let entries = chartEntries else { return [] }
        let cutoff = Date().addingTimeInterval(-Double(chartDays) * 86_400)
        let raw = entries.compactMap { entry -> ChartPoint? in
            guard let date = Formatters.date(from: entry.timestamp), date >= cutoff else { return nil }
            return ChartPoint(date: date, value: entry.minPrice)
        }
        .sorted { $0.date < $1.date }
        guard chartDays >= 7 else { return raw }
        // 7-day view: one point per calendar day — the day's lowest price (like the web).
        let calendar = Calendar.current
        var perDay: [Date: Double] = [:]
        for point in raw {
            let day = calendar.startOfDay(for: point.date)
            perDay[day] = min(perDay[day] ?? .infinity, point.value)
        }
        return perDay.keys.sorted().map { ChartPoint(date: $0, value: perDay[$0]!) }
    }

    private func points(within days: Int) -> Int {
        guard let entries = chartEntries else { return 0 }
        let cutoff = Date().addingTimeInterval(-Double(days) * 86_400)
        return entries.reduce(0) { count, entry in
            guard let date = Formatters.date(from: entry.timestamp), date >= cutoff else { return count }
            return count + 1
        }
    }

    private func adjustRangeToAvailability() {
        if chartDays == 1, points(within: 1) < 1, points(within: 7) >= 2 {
            chartDays = 7
        } else if chartDays == 7, points(within: 7) < 2, points(within: 1) >= 1 {
            chartDays = 1
        }
    }

    private var chartSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(s.priceHistory)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Theme.hint)
                Spacer()
                rangeToggle
            }
            .padding(.horizontal, 20)

            Group {
                if chartLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .frame(height: 130)
                } else if chartPoints.count < 2 {
                    VStack(spacing: 6) {
                        Image(systemName: "chart.line.downtrend.xyaxis")
                            .foregroundStyle(Theme.hint)
                        Text(s.noChartData)
                            .font(.system(size: 13))
                            .foregroundStyle(Theme.hint)
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 130)
                } else {
                    chart
                }
            }
            .padding(10)
            .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
            .padding(.horizontal, 16)
        }
        .padding(.top, 4)
    }

    private var rangeToggle: some View {
        HStack(spacing: 2) {
            rangeButton(days: 1, label: s.range24h, enabled: points(within: 1) >= 1)
            rangeButton(days: 7, label: s.days7, enabled: points(within: 7) >= 2)
        }
        .padding(2)
        .background(Color.primary.opacity(0.06), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
    }

    private func rangeButton(days: Int, label: String, enabled: Bool) -> some View {
        Button {
            Haptics.selection()
            withAnimation(.spring(duration: 0.3)) {
                chartDays = days
            }
        } label: {
            Text(label)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(chartDays == days ? .white : Theme.hint)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(
                    chartDays == days ? Color.accentColor : .clear,
                    in: RoundedRectangle(cornerRadius: 6, style: .continuous)
                )
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
        .opacity(enabled ? 1 : 0.35)
    }

    private var chart: some View {
        let cutoff = Date().addingTimeInterval(-Double(chartDays) * 86_400)
        return Chart(chartPoints) { point in
            AreaMark(
                x: .value("Zeit", point.date),
                y: .value("Preis", point.value)
            )
            .foregroundStyle(Theme.good.opacity(0.08))
            .interpolationMethod(.monotone)

            LineMark(
                x: .value("Zeit", point.date),
                y: .value("Preis", point.value)
            )
            .foregroundStyle(Theme.good)
            .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round))
            .interpolationMethod(.monotone)

            if chartDays >= 7 {
                PointMark(
                    x: .value("Zeit", point.date),
                    y: .value("Preis", point.value)
                )
                .foregroundStyle(Theme.good)
                .symbolSize(28)
            }
        }
        .chartXScale(domain: cutoff...Date())
        .chartYScale(domain: .automatic(includesZero: false))
        .frame(height: 120)
        .animation(.spring(duration: 0.4), value: chartDays)
    }
}
