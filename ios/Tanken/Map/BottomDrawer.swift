import SwiftUI

/// Snap positions of the station drawer, mirroring the web bottom sheet's collapsed/half/full states.
enum DrawerState: CaseIterable {
    case collapsed
    case half
    case expanded
}

/// Inline Liquid Glass bottom drawer used instead of a `.sheet`: a sheet would be presented above
/// the whole TabView and hide the tab bar, while this lives inside the tab's content and respects
/// the tab-bar safe area. The grabber and the `header` slot are draggable (snap between three
/// heights, rubber-banding, velocity-based settling); the `content` below scrolls freely.
struct BottomDrawer<Header: View, Content: View>: View {
    @Binding var state: DrawerState
    @ViewBuilder let header: Header
    @ViewBuilder let content: Content

    @State private var dragOffset: CGFloat = 0

    // Fits exactly the grabber + header controls, so no half-cut list row peeks out of the
    // collapsed drawer.
    private static var collapsedHeight: CGFloat { 68 }

    private static var shape: UnevenRoundedRectangle {
        UnevenRoundedRectangle(
            topLeadingRadius: 24,
            bottomLeadingRadius: 0,
            bottomTrailingRadius: 0,
            topTrailingRadius: 24,
            style: .continuous
        )
    }

    var body: some View {
        GeometryReader { geo in
            let expandedHeight = geo.size.height - 8
            let halfHeight = geo.size.height * 0.45
            let base = height(for: state, half: halfHeight, expanded: expandedHeight)
            // The panel keeps a FIXED expanded height and slides via offset — a pure transform.
            // Resizing the panel per drag frame re-laid-out the whole list and re-rendered the
            // glass every frame, which is what made dragging stutter.
            let visible = rubberBanded(base - dragOffset, min: Self.collapsedHeight, max: expandedHeight)
            let offsetY = expandedHeight - visible
            // Fade the list out towards the collapsed snap so the closed drawer shows only the
            // header instead of a cut-off first row; fades back in over the first stretch of an
            // opening drag.
            let fadeRange = max((halfHeight - Self.collapsedHeight) * 0.35, 1)
            let contentOpacity = min(max((visible - Self.collapsedHeight) / fadeRange, 0), 1)

            VStack(spacing: 0) {
                VStack(spacing: 0) {
                    grabber
                    header
                }
                .contentShape(Rectangle())
                .gesture(dragGesture(base: base, half: halfHeight, expanded: expandedHeight))
                .onTapGesture {
                    Haptics.selection()
                    withAnimation(.spring(duration: 0.35)) {
                        state = state == .collapsed ? .half : .collapsed
                    }
                }

                content
                    // Layout follows the SNAPPED state only (animated once per snap), so the
                    // scrollable area matches the visible part without per-frame relayout.
                    .padding(.bottom, max(expandedHeight - base, 0))
                    .opacity(contentOpacity)
                    .allowsHitTesting(state != .collapsed)
            }
            .frame(maxWidth: .infinity)
            .frame(height: expandedHeight, alignment: .top)
            .glassSurface(in: Self.shape)
            // The glass alone is transparent enough that map annotations bleed through the
            // expanded drawer as colored blobs — a translucent backdrop keeps content readable.
            .background(Self.shape.fill(Theme.background).opacity(0.5))
            .clipShape(Self.shape)
            .shadow(color: .black.opacity(0.15), radius: 12, y: -3)
            .offset(y: offsetY)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
            // The full-height panel pokes below the screen while collapsed/half — clip the
            // overflow so it can't shine around the floating tab bar.
            .clipped()
            .animation(.spring(duration: 0.35), value: state)
        }
    }

    private var grabber: some View {
        Capsule()
            .fill(Theme.hint.opacity(0.5))
            .frame(width: 36, height: 4)
            .frame(maxWidth: .infinity)
            .frame(height: 20)
    }

    private func dragGesture(base: CGFloat, half: CGFloat, expanded: CGFloat) -> some Gesture {
        DragGesture(minimumDistance: 2)
            .onChanged { value in
                dragOffset = value.translation.height
            }
            .onEnded { value in
                let projected = base - value.predictedEndTranslation.height
                let target = nearestState(to: projected, half: half, expanded: expanded)
                withAnimation(.spring(duration: 0.35)) {
                    dragOffset = 0
                    state = target
                }
                Haptics.light()
            }
    }

    private func height(for state: DrawerState, half: CGFloat, expanded: CGFloat) -> CGFloat {
        switch state {
        case .collapsed: return Self.collapsedHeight
        case .half: return half
        case .expanded: return expanded
        }
    }

    private func nearestState(to height: CGFloat, half: CGFloat, expanded: CGFloat) -> DrawerState {
        let candidates: [(DrawerState, CGFloat)] = [
            (.collapsed, Self.collapsedHeight),
            (.half, half),
            (.expanded, expanded),
        ]
        return candidates.min { abs($0.1 - height) < abs($1.1 - height) }?.0 ?? .collapsed
    }

    /// Softens dragging past the snap limits instead of hard-clamping.
    private func rubberBanded(_ value: CGFloat, min minValue: CGFloat, max maxValue: CGFloat) -> CGFloat {
        if value > maxValue {
            return maxValue + (value - maxValue) * 0.2
        }
        if value < minValue {
            return minValue + (value - minValue) * 0.2
        }
        return value
    }
}
