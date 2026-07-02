import SwiftUI

/// Gradient hero-card background matching the web's `.history-hero-card` / `.stats-hero-card` /
/// `.account-hero` treatment: a 135° accent-tinted linear gradient over the card surface plus a
/// radial accent glow bleeding in from the top-right corner.
struct HeroCardBackground: View {
    var body: some View {
        ZStack {
            Theme.card
            LinearGradient(
                colors: [.clear, Color.accentColor.opacity(0.07)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            RadialGradient(
                colors: [Color.accentColor.opacity(0.18), .clear],
                center: UnitPoint(x: 0.92, y: -0.1),
                startRadius: 0,
                endRadius: 230
            )
        }
    }
}

extension View {
    /// Applies the hero gradient surface, rounded corners and hairline border in one go.
    func heroCardSurface(cornerRadius: CGFloat = Theme.rMd) -> some View {
        background(HeroCardBackground())
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(Theme.separator, lineWidth: 1)
            }
    }
}
