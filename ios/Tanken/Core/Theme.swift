import SwiftUI

/// Design tokens mirroring the website's CSS custom properties (public/style.css). The web palette
/// is deliberately modelled on the iOS system palette, so most tokens map to exact system colors
/// and adapt to light/dark automatically.
enum Theme {
    // MARK: - Colors (web token → iOS)

    /// `--color-accent` #007aff / #0a84ff — asset catalog AccentColor (exact systemBlue values).
    static let accent = Color.accentColor
    /// `--color-good` #34c759
    static let good = Color(.systemGreen)
    /// `--color-okay` #ff9500
    static let okay = Color(.systemOrange)
    /// `--color-bad` #ff3b30
    static let bad = Color(.systemRed)
    /// `--color-favorite` #ffb800 (not a system color; systemYellow is #ffcc00)
    static let favorite = Color(red: 255.0 / 255.0, green: 184.0 / 255.0, blue: 0.0 / 255.0)
    /// Neutral station color when no price band is available (app.js: hsl(0,0%,72%)).
    static let neutralPrice = Color(red: 183.0 / 255.0, green: 183.0 / 255.0, blue: 183.0 / 255.0)
    /// `--color-hint` #8e8e93
    static let hint = Color(.systemGray)
    /// `--color-bg-secondary` — screen background (#f2f2f7 / #1c1c1e like grouped settings).
    static let background = Color(.systemGroupedBackground)
    /// `--color-bg-elevated` — card surfaces (#ffffff / #2c2c2e).
    static let card = Color(.secondarySystemGroupedBackground)
    /// `--color-separator`
    static let separator = Color(.separator)

    // MARK: - Radii (web `--r-*` scale)

    static let rSm: CGFloat = 8
    static let rMd: CGFloat = 12
    static let rLg: CGFloat = 16
    static let rXl: CGFloat = 20

    // MARK: - Price → color

    /// `bandRatio(price, band)` from public/app.js: maps a price to t∈[0,1] across the regional
    /// [p10, p90] band, clamped, with a minimum spread so tiny bands don't explode the gradient.
    static func priceRatio(price: Double, p10: Double, p90: Double) -> Double {
        guard p90 > p10, price > p10 else { return 0 }
        let spread = max(p90 - p10, 0.03)
        return min((price - p10) / spread, 1)
    }

    /// `priceColor3(t)` from public/app.js: straight-line RGB interpolation from
    /// green (52,199,89 = #34c759) to red (255,59,48 = #ff3b30).
    static func priceColor(ratio t: Double) -> Color {
        let x = min(max(t, 0), 1)
        return Color(
            red: (52.0 + x * 203.0).rounded() / 255.0,
            green: (199.0 - x * 140.0).rounded() / 255.0,
            blue: (89.0 - x * 41.0).rounded() / 255.0
        )
    }

    /// Station color for a price given the active regional band; neutral grey without a band.
    static func priceColor(price: Double?, p10: Double?, p90: Double?) -> Color {
        guard let price, price > 0, let p10, let p90 else { return neutralPrice }
        return priceColor(ratio: priceRatio(price: price, p10: p10, p90: p90))
    }

    // MARK: - Chart domains

    /// Padded y-domain for price charts: [min − pad, max + pad] with a minimum spread, so tightly
    /// clustered prices still show visible variation instead of a flat line or equal-height bars.
    static func priceDomain(for values: [Double], pad: Double = 0.03, minSpread: Double = 0.10) -> ClosedRange<Double> {
        guard let lo = values.min(), let hi = values.max() else { return 0...1 }
        let spread = max(hi - lo, minSpread)
        let mid = (lo + hi) / 2
        return (mid - spread / 2 - pad)...(mid + spread / 2 + pad)
    }
}

// MARK: - Liquid Glass helpers

/// All Liquid Glass usage funnels through these helpers so API changes are a one-file fix.
extension View {
    /// A static Liquid Glass surface clipped to `shape` (search fields, chips, panels).
    func glassSurface<S: Shape>(in shape: S) -> some View {
        glassEffect(.regular, in: shape)
    }

    /// An interactive Liquid Glass surface that reacts to touch (FABs, tappable pills).
    func interactiveGlass<S: Shape>(in shape: S) -> some View {
        glassEffect(.regular.interactive(), in: shape)
    }

    /// A tinted interactive Liquid Glass surface (selected chips, highlighted controls).
    func tintedGlass<S: Shape>(_ tint: Color, in shape: S) -> some View {
        glassEffect(.regular.tint(tint).interactive(), in: shape)
    }
}
