import SwiftUI
import Charts

/// The web's shared chart recipe — line colored by price (green cheap → red expensive), warm
/// red→orange→yellow area fill, rank-colored points — plus native scrubbing: drag across the
/// plot to inspect any point with a dashed rule line and a price tooltip. A plain tap either
/// drills down (`onTap`) or pins/unpins the tooltip when no drill action is given.
struct PriceLineChart: View {
    let points: [(Date, Double)]
    let height: CGFloat
    let hourAxis: Bool
    var onTap: ((Date) -> Void)?

    @State private var rawSelection: Date?

    private struct ChartPoint: Identifiable {
        let index: Int
        let date: Date
        let value: Double

        var id: Int { index }
    }

    var body: some View {
        let values = points.map(\.1)
        let domain = Theme.priceDomain(for: values)
        let lo = values.min() ?? 0
        let hi = values.max() ?? 1
        let span = max(hi - lo, 0.0001)
        let manyPoints = points.count > 30
        let chartPoints = points.enumerated().map { pair in
            ChartPoint(index: pair.offset, date: pair.element.0, value: pair.element.1)
        }
        let selected = nearestPoint(to: rawSelection, in: chartPoints)

        Chart {
            ForEach(chartPoints) { point in
                AreaMark(
                    x: .value("Zeit", point.date),
                    yStart: .value("Preis", domain.lowerBound),
                    yEnd: .value("Preis", point.value)
                )
                .foregroundStyle(LinearGradient(
                    colors: [Theme.bad.opacity(0.34), Theme.okay.opacity(0.18), Color.yellow.opacity(0.04)],
                    startPoint: .top,
                    endPoint: .bottom
                ))
                .interpolationMethod(.monotone)

                LineMark(
                    x: .value("Zeit", point.date),
                    y: .value("Preis", point.value)
                )
                .foregroundStyle(priceLineGradient(domain: domain, dataLo: lo, dataHi: hi))
                .interpolationMethod(.monotone)
                .lineStyle(StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round))

                PointMark(
                    x: .value("Zeit", point.date),
                    y: .value("Preis", point.value)
                )
                .foregroundStyle(Theme.rankColor(ratio: (point.value - lo) / span))
                .symbolSize(point.index == chartPoints.count - 1 ? 100 : (manyPoints ? 20 : 50))
            }

            if let selected {
                RuleMark(x: .value("Zeit", selected.date))
                    .foregroundStyle(Theme.hint.opacity(0.45))
                    .lineStyle(StrokeStyle(lineWidth: 1.5, dash: [4, 4]))
                    .zIndex(-1)
                    .annotation(
                        position: .top,
                        spacing: 8,
                        overflowResolution: .init(x: .fit(to: .chart), y: .fit(to: .chart))
                    ) {
                        tooltip(for: selected, lo: lo, span: span)
                    }

                // Lollipop head: card-colored ring below a rank-colored dot.
                PointMark(
                    x: .value("Zeit", selected.date),
                    y: .value("Preis", selected.value)
                )
                .foregroundStyle(Theme.card)
                .symbolSize(190)

                PointMark(
                    x: .value("Zeit", selected.date),
                    y: .value("Preis", selected.value)
                )
                .foregroundStyle(Theme.rankColor(ratio: (selected.value - lo) / span))
                .symbolSize(100)
            }
        }
        .chartYScale(domain: domain)
        .chartXAxis {
            if hourAxis {
                AxisMarks(values: .stride(by: .hour, count: 6)) { _ in
                    AxisGridLine()
                    AxisValueLabel(format: .dateTime.hour())
                }
            } else {
                AxisMarks(values: .automatic(desiredCount: 5)) { _ in
                    AxisGridLine()
                    AxisValueLabel(format: .dateTime.day().month())
                }
            }
        }
        .chartXSelection(value: $rawSelection)
        // Custom gesture instead of the default: horizontal drags scrub while vertical swipes
        // still scroll the page, and a plain tap drives the drill-down / tooltip pinning.
        .chartGesture { proxy in
            ExclusiveGesture(
                SpatialTapGesture()
                    .onEnded { value in
                        let before = nearestPoint(to: rawSelection, in: chartPoints)?.index
                        proxy.selectXValue(at: value.location.x)
                        guard let tapped = nearestPoint(to: rawSelection, in: chartPoints) else { return }
                        if let onTap {
                            rawSelection = nil
                            onTap(tapped.date)
                        } else if before == tapped.index {
                            withAnimation(.easeOut(duration: 0.15)) {
                                rawSelection = nil
                            }
                        }
                    },
                DragGesture(minimumDistance: 12)
                    .onChanged { value in
                        proxy.selectXValue(at: value.location.x)
                    }
                    .onEnded { _ in
                        withAnimation(.easeOut(duration: 0.2)) {
                            rawSelection = nil
                        }
                    }
            )
        }
        .sensoryFeedback(.selection, trigger: selected?.index) { _, new in new != nil }
        .frame(height: height)
    }

    private func nearestPoint(to selection: Date?, in chartPoints: [ChartPoint]) -> ChartPoint? {
        guard let selection else { return nil }
        return chartPoints.min {
            abs($0.date.timeIntervalSince(selection)) < abs($1.date.timeIntervalSince(selection))
        }
    }

    private func tooltip(for point: ChartPoint, lo: Double, span: Double) -> some View {
        VStack(spacing: 2) {
            Text(
                hourAxis
                    ? point.date.formatted(.dateTime.hour().minute())
                    : point.date.formatted(.dateTime.weekday(.abbreviated).day().month())
            )
            .font(.caption2.weight(.semibold))
            .foregroundStyle(.secondary)
            Text(Formatters.price(point.value))
                .font(.system(size: 15, weight: .bold))
                .monospacedDigit()
                .foregroundStyle(Theme.rankColor(ratio: (point.value - lo) / span))
                .contentTransition(.numericText())
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

    /// Vertical gradient whose stops map the y-domain onto the web's rankColor scale.
    private func priceLineGradient(domain: ClosedRange<Double>, dataLo: Double, dataHi: Double) -> LinearGradient {
        let domainSpan = max(domain.upperBound - domain.lowerBound, 0.0001)
        let dataSpan = max(dataHi - dataLo, 0.0001)
        // Sample rankColor at several y positions across the plot (top = domain max).
        let stops = stride(from: 0.0, through: 1.0, by: 0.25).map { location -> Gradient.Stop in
            let value = domain.upperBound - location * domainSpan
            let ratio = (value - dataLo) / dataSpan
            return Gradient.Stop(color: Theme.rankColor(ratio: ratio), location: location)
        }
        return LinearGradient(gradient: Gradient(stops: stops), startPoint: .top, endPoint: .bottom)
    }
}
