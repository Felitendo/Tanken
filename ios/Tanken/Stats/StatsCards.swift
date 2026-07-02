import SwiftUI

/// Compact fact card matching the web's `.stats-fact-card`: tinted 30×30 icon + label/value column.
struct FactCard: View {
    let icon: String
    let label: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 10) {
            RoundedRectangle(cornerRadius: 9, style: .continuous)
                .fill(color.opacity(0.16))
                .frame(width: 30, height: 30)
                .overlay {
                    Image(systemName: icon)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(color)
                }
            VStack(alignment: .leading, spacing: 0) {
                Text(label)
                    .font(.system(size: 10, weight: .semibold))
                    .textCase(.uppercase)
                    .kerning(0.5)
                    .foregroundStyle(Theme.hint)
                    .lineLimit(1)
                Text(value)
                    .font(.system(size: 16, weight: .bold))
                    .monospacedDigit()
                    .foregroundStyle(color)
                    .contentTransition(.numericText())
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            }
            Spacer(minLength: 0)
        }
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
    }
}

/// Best-time card matching the web's `.best-time-card`: tinted icon + label head, big value,
/// green price and an optional "−0,04€ gespart" savings pill.
struct BestTimeCard: View {
    let icon: String
    let label: String
    let value: String
    let price: String
    let savings: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 8) {
                RoundedRectangle(cornerRadius: 8, style: .continuous)
                    .fill(Color.accentColor.opacity(0.14))
                    .frame(width: 26, height: 26)
                    .overlay {
                        Image(systemName: icon)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Color.accentColor)
                    }
                Text(label)
                    .font(.system(size: 12, weight: .medium))
                    .textCase(.uppercase)
                    .kerning(0.5)
                    .foregroundStyle(Theme.hint)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
            }
            .padding(.bottom, 2)
            Text(value)
                .font(.system(size: 20, weight: .bold))
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(price)
                .font(.system(size: 14, weight: .semibold))
                .monospacedDigit()
                .foregroundStyle(Theme.good)
                .padding(.top, 2)
            if let savings {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.down")
                        .font(.system(size: 10, weight: .semibold))
                    Text(savings)
                        .font(.system(size: 11, weight: .semibold))
                        .monospacedDigit()
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                }
                .foregroundStyle(Theme.good)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Theme.good.opacity(0.16), in: Capsule())
                .padding(.top, 4)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, minHeight: 112, alignment: .leading)
        .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
    }
}

/// Seven chronological weekday tiles matching the web's `.stats-tile-grid-7`: day abbreviation,
/// price colored via rankColor, a thin cheapness bar at the bottom and a ★ crown on the best day.
/// Color and bar width track the *displayed* 2-decimal price so equal displayed prices look identical.
struct WeekdayTileGrid: View {
    let dayAvgs: [DayAvg]
    let dayAbbr: [String]

    private static let displayOrder = [1, 2, 3, 4, 5, 6, 0]

    var body: some View {
        let displayValue = { (avg: Double) in (avg * 100).rounded() / 100 }
        let values = dayAvgs.map { displayValue($0.avg) }
        let minValue = values.min() ?? 0
        let maxValue = values.max() ?? 0
        let range = max(maxValue - minValue, 0.0001)
        let bestDay = dayAvgs.min { $0.avg < $1.avg }?.day

        HStack(spacing: 6) {
            ForEach(Self.displayOrder, id: \.self) { dayNum in
                let abbr = dayNum < dayAbbr.count ? dayAbbr[dayNum] : ""
                if let data = dayAvgs.first(where: { $0.day == dayNum }) {
                    let ratio = dayAvgs.count > 1 ? (displayValue(data.avg) - minValue) / range : 0
                    tile(
                        abbr: abbr,
                        price: Formatters.price(data.avg),
                        ratio: ratio,
                        color: Theme.rankColor(ratio: ratio),
                        isBest: data.day == bestDay
                    )
                } else {
                    emptyTile(abbr: abbr)
                }
            }
        }
    }

    private func tile(abbr: String, price: String, ratio: Double, color: Color, isBest: Bool) -> some View {
        VStack(spacing: 2) {
            Text(abbr)
                .font(.system(size: 10, weight: .bold))
                .textCase(.uppercase)
                .kerning(0.5)
                .foregroundStyle(Theme.hint)
            Text(price)
                .font(.system(size: 13, weight: .bold))
                .monospacedDigit()
                .foregroundStyle(color)
                .lineLimit(1)
                .minimumScaleFactor(0.6)
                .padding(.top, 2)
            Spacer(minLength: 4)
            bar(fillRatio: ratio, color: color)
        }
        .padding(EdgeInsets(top: 11, leading: 4, bottom: 9, trailing: 4))
        .frame(maxWidth: .infinity, minHeight: 64)
        .background {
            ZStack {
                Theme.card
                if isBest { color.opacity(0.09) }
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .strokeBorder(isBest ? color.opacity(0.65) : Theme.separator, lineWidth: 1)
        }
        .overlay(alignment: .topTrailing) {
            if isBest {
                Text("★")
                    .font(.system(size: 10))
                    .foregroundStyle(color)
                    .padding(.top, 4)
                    .padding(.trailing, 5)
            }
        }
    }

    private func emptyTile(abbr: String) -> some View {
        VStack(spacing: 2) {
            Text(abbr)
                .font(.system(size: 10, weight: .bold))
                .textCase(.uppercase)
                .kerning(0.5)
                .foregroundStyle(Theme.hint)
                .opacity(0.4)
            Text("–")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Theme.hint)
                .opacity(0.4)
                .padding(.top, 2)
            Spacer(minLength: 4)
            bar(fillRatio: 0, color: Theme.separator)
        }
        .padding(EdgeInsets(top: 11, leading: 4, bottom: 9, trailing: 4))
        .frame(maxWidth: .infinity, minHeight: 64)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
    }

    private func bar(fillRatio: Double, color: Color) -> some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Theme.separator)
                Capsule()
                    .fill(color)
                    .frame(width: max(geo.size.width * fillRatio, 0))
            }
        }
        .frame(height: 3)
        .padding(.horizontal, 2)
    }
}
