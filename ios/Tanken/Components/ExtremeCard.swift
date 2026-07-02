import SwiftUI

/// Extreme-value card matching the web's `.history-extreme-card`: colored left stripe,
/// tinted 34×34 icon and a label/value/station column. Tappable when an action is set
/// (the web opens the station detail popup).
struct ExtremeCard: View {
    let label: String
    let price: Double
    let station: String
    let color: Color
    let icon: String
    var action: (() -> Void)?

    var body: some View {
        if let action {
            Button {
                Haptics.light()
                action()
            } label: {
                content
            }
            .buttonStyle(.plain)
        } else {
            content.opacity(0.75)
        }
    }

    private var content: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .fill(color.opacity(0.16))
                .frame(width: 34, height: 34)
                .overlay {
                    Image(systemName: icon)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(color)
                }
            VStack(alignment: .leading, spacing: 1) {
                Text(label)
                    .font(.system(size: 10, weight: .semibold))
                    .textCase(.uppercase)
                    .kerning(0.5)
                    .foregroundStyle(Theme.hint)
                    .lineLimit(1)
                Text(Formatters.price(price))
                    .font(.system(size: 18, weight: .heavy))
                    .monospacedDigit()
                    .foregroundStyle(color)
                    .contentTransition(.numericText())
                Text(station)
                    .font(.system(size: 12))
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            Spacer(minLength: 0)
        }
        .padding(EdgeInsets(top: 12, leading: 18, bottom: 12, trailing: 14))
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.card)
        .overlay(alignment: .leading) {
            UnevenRoundedRectangle(
                topLeadingRadius: 0,
                bottomLeadingRadius: 0,
                bottomTrailingRadius: 2,
                topTrailingRadius: 2
            )
            .fill(color)
            .frame(width: 3)
            .padding(.vertical, 10)
        }
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
    }
}
