import SwiftUI

/// Gradient hero card matching the web's `.stats-hero-card`: average price headline, price-tag
/// glyph, period pill and the green→orange→red spread bar with the average marker.
struct StatsHeroCard: View {
    let avg: Double?
    let lowest: Double?
    let highest: Double?
    let periodLabel: String?
    let avgLabel: String
    let spreadCaption: String

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(avgLabel)
                        .font(.system(size: 11, weight: .semibold))
                        .textCase(.uppercase)
                        .kerning(0.7)
                        .foregroundStyle(Theme.hint)
                    Text(Formatters.price(avg))
                        .font(.system(size: 36, weight: .heavy))
                        .monospacedDigit()
                        .foregroundStyle(.primary)
                        .contentTransition(.numericText())
                }
                Spacer(minLength: 0)
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(Color.accentColor.opacity(0.14))
                    .frame(width: 44, height: 44)
                    .overlay {
                        Image(systemName: "tag.fill")
                            .font(.system(size: 19, weight: .semibold))
                            .foregroundStyle(Color.accentColor)
                    }
            }
            if let periodLabel {
                HStack(spacing: 5) {
                    Image(systemName: "calendar")
                        .font(.system(size: 11, weight: .semibold))
                    Text(periodLabel)
                        .font(.system(size: 11, weight: .semibold))
                }
                .foregroundStyle(Color.accentColor)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color.accentColor.opacity(0.12), in: Capsule())
                .padding(.top, 10)
            }
            if let avg, let lowest, let highest, highest > lowest {
                spreadBar(avg: avg, lo: lowest, hi: highest)
                    .padding(.top, 16)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .heroCardSurface()
    }

    private func spreadBar(avg: Double, lo: Double, hi: Double) -> some View {
        let pct = min(max((avg - lo) / max(hi - lo, 0.0001), 0), 1)
        return VStack(spacing: 8) {
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(LinearGradient(
                            colors: [Theme.good, Theme.okay, Theme.bad],
                            startPoint: .leading,
                            endPoint: .trailing
                        ))
                        .opacity(0.85)
                        .frame(height: 6)
                        .frame(maxHeight: .infinity)
                    Circle()
                        .fill(Color.primary)
                        .frame(width: 14, height: 14)
                        .overlay {
                            Circle().strokeBorder(Theme.card, lineWidth: 2)
                        }
                        .shadow(color: .black.opacity(0.28), radius: 1.5, y: 1)
                        .offset(x: geo.size.width * pct - 7)
                }
            }
            .frame(height: 14)
            HStack {
                Text(Formatters.price(lo))
                    .font(.system(size: 11, weight: .semibold))
                    .monospacedDigit()
                    .foregroundStyle(Theme.good)
                Spacer()
                Text(spreadCaption)
                    .font(.system(size: 10, weight: .semibold))
                    .textCase(.uppercase)
                    .kerning(0.6)
                    .foregroundStyle(Theme.hint)
                Spacer()
                Text(Formatters.price(hi))
                    .font(.system(size: 11, weight: .semibold))
                    .monospacedDigit()
                    .foregroundStyle(Theme.bad)
            }
        }
    }
}
