import SwiftUI

/// Horizontal chip selector matching the website's `.chip-row` (selected chip = accent capsule,
/// animated thumb slide via matchedGeometryEffect, selection haptic).
struct ChipRow<Item: Identifiable & Equatable, Label: View>: View {
    let items: [Item]
    @Binding var selection: Item
    @ViewBuilder let label: (Item) -> Label

    @Namespace private var thumb

    var body: some View {
        HStack(spacing: 8) {
            ForEach(items) { item in
                Button {
                    withAnimation(.spring(duration: 0.35)) {
                        selection = item
                    }
                } label: {
                    label(item)
                        .font(.subheadline.weight(selection == item ? .semibold : .regular))
                        .foregroundStyle(selection == item ? Color.white : .primary)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background {
                            if selection == item {
                                Capsule().fill(Color.accentColor)
                                    .matchedGeometryEffect(id: "chip-thumb", in: thumb)
                            } else {
                                Capsule().fill(Theme.card)
                            }
                        }
                }
                .buttonStyle(.plain)
            }
            Spacer(minLength: 0)
        }
        .sensoryFeedback(.selection, trigger: selection)
    }
}

/// Uppercase section header like the website's `.section-header` (iOS settings style).
struct SectionHeader: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.footnote.weight(.medium))
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 4)
    }
}

/// Card container matching the website's `.card` surfaces.
struct Card<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        content
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rLg, style: .continuous))
    }
}

/// Compact stat tile (label + big value), used on the history/stats screens.
struct StatTile: View {
    let title: String
    let value: String
    var color: Color = .primary

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.6)
            Text(value)
                .font(.title3.weight(.bold))
                .foregroundStyle(color)
                .contentTransition(.numericText())
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
    }
}

/// Full-width loading/error/empty placeholder used while a tab loads.
struct LoadingErrorState: View {
    @Environment(\.strings) private var s
    let error: String?
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 12) {
            if let error {
                Image(systemName: "wifi.exclamationmark")
                    .font(.title)
                    .foregroundStyle(.secondary)
                Text(error)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                Button(s.retry) {
                    Haptics.light()
                    retry()
                }
                .buttonStyle(.bordered)
            } else {
                ProgressView()
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 48)
    }
}
