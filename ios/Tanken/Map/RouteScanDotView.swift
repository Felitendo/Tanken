import SwiftUI

/// Scan-point marker on the map (web: yellow dot with ripple while scanning; green when the
/// scan found stations, grey when empty/rate-limited, red on error).
struct RouteScanDotView: View {
    let state: RouteScanDot.DotState

    private var color: Color {
        switch state {
        case .pending, .scanning: return Theme.favorite
        case .done: return Theme.good
        case .empty: return Theme.hint
        case .error: return Theme.bad
        }
    }

    var body: some View {
        ZStack {
            if state == .scanning {
                Circle()
                    .stroke(color.opacity(0.7), lineWidth: 2)
                    .frame(width: 18, height: 18)
                    .phaseAnimator([false, true]) { view, expanded in
                        view
                            .scaleEffect(expanded ? 2.1 : 0.9)
                            .opacity(expanded ? 0 : 0.9)
                    } animation: { _ in
                        .easeOut(duration: 1.1)
                    }
            }
            Circle()
                .fill(color)
                .frame(width: 18, height: 18)
                .overlay {
                    Circle().strokeBorder(.white, lineWidth: 2.5)
                }
                .shadow(color: .black.opacity(0.25), radius: 3, y: 1)
        }
        .animation(.spring(duration: 0.3), value: state)
    }
}
