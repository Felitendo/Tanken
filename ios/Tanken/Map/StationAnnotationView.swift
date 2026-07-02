import SwiftUI

/// Price bubble marker matching the website: white text on a price-colored rounded rect + arrow,
/// brand on top, springy selection scaling and animated price changes.
struct StationAnnotationView: View {
    let station: Station
    let band: PriceBand?
    let isSelected: Bool

    private var color: Color {
        Theme.priceColor(price: station.price, p10: band?.p10, p90: band?.p90)
    }

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: -1) {
                if !station.displayBrand.isEmpty {
                    Text(String(station.displayBrand.prefix(12)))
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(.white.opacity(0.9))
                }
                Text(Formatters.priceSuper(station.price))
                    .font(.system(size: 14, weight: .heavy))
                    .foregroundStyle(.white)
                    .contentTransition(.numericText())
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color, in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            BubbleArrow()
                .fill(color)
                .frame(width: 12, height: 6)
        }
        .shadow(color: .black.opacity(0.3), radius: 3, y: 1)
        .scaleEffect(isSelected ? 1.18 : 1, anchor: .bottom)
        .animation(.spring(duration: 0.3), value: isSelected)
        .animation(.spring(duration: 0.4), value: station.price)
    }
}

/// Downward-pointing triangle under the bubble.
private struct BubbleArrow: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}
