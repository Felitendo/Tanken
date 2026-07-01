import SwiftUI
import UIKit

/// Imperative haptic feedback, mirroring the web app's `web-haptics` presets
/// (success/warning/error/light/medium/heavy/soft/rigid/selection) on the native generators.
/// Prefer the declarative `.sensoryFeedback(_:trigger:)` modifier where a state change exists;
/// use these for one-shot events (button taps, marker taps, pull actions).
@MainActor
enum Haptics {
    static func light() { UIImpactFeedbackGenerator(style: .light).impactOccurred() }
    static func medium() { UIImpactFeedbackGenerator(style: .medium).impactOccurred() }
    static func heavy() { UIImpactFeedbackGenerator(style: .heavy).impactOccurred() }
    static func soft() { UIImpactFeedbackGenerator(style: .soft).impactOccurred() }
    static func rigid() { UIImpactFeedbackGenerator(style: .rigid).impactOccurred() }
    static func selection() { UISelectionFeedbackGenerator().selectionChanged() }
    static func success() { UINotificationFeedbackGenerator().notificationOccurred(.success) }
    static func warning() { UINotificationFeedbackGenerator().notificationOccurred(.warning) }
    static func error() { UINotificationFeedbackGenerator().notificationOccurred(.error) }
}
