import Foundation

/// Shared formatting helpers — price/distance rendering matches the website.
enum Formatters {
    private static let isoWithFraction: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()

    private static let isoPlain = ISO8601DateFormatter()

    /// Parses API timestamps ("2026-06-30T12:00:00.000Z", with or without milliseconds).
    static func date(from timestamp: String?) -> Date? {
        guard let timestamp else { return nil }
        return isoWithFraction.date(from: timestamp) ?? isoPlain.date(from: timestamp)
    }

    /// "1,79€" — the web's formatPrice: two decimals, German comma, no space before €.
    static func price(_ value: Double?) -> String {
        guard let value, value > 0 else { return "–" }
        return String(format: "%.2f€", value).replacingOccurrences(of: ".", with: ",")
    }

    /// "1,79" — price without the € suffix, for the compact map bubbles.
    static func priceText(_ value: Double?) -> String {
        guard let value, value > 0 else { return "–" }
        return String(format: "%.2f", value).replacingOccurrences(of: ".", with: ",")
    }

    /// "+0,04€" / "−0,04€" / "±0,00€" — the web's formatDelta for trend pills.
    static func delta(_ value: Double?) -> String {
        guard let value, value.isFinite else { return "–" }
        if abs(value) < 0.005 { return "±0,00€" }
        return (value > 0 ? "+" : "−") + price(abs(value))
    }

    /// "1,2 km" / "850 m" (approximate distances get a "~" prefix like the website).
    static func distance(_ km: Double?, approximate: Bool = false) -> String {
        guard let km, km >= 0 else { return "" }
        let prefix = approximate ? "~" : ""
        if km < 1 {
            return "\(prefix)\(Int((km * 1000).rounded())) m"
        }
        return prefix + String(format: "%.1f km", km).replacingOccurrences(of: ".", with: ",")
    }

    /// Short day/time for chart axes and status lines, following the active locale.
    static func shortDayTime(_ date: Date) -> String {
        date.formatted(.dateTime.day().month().hour().minute())
    }
}
