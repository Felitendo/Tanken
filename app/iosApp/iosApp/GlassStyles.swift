import SwiftUI

/// Liquid Glass helpers that adopt the native iOS 26 `glassEffect`/`.glass` APIs when available and
/// fall back to the previous `.regularMaterial` / `.borderedProminent` look on older systems, so the
/// app keeps building and rendering correctly on iOS 25 and below.
extension View {
    /// A static Liquid Glass surface clipped to `shape` (used for the map search field).
    @ViewBuilder
    func glassSurface<S: Shape>(in shape: S) -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect(.regular, in: shape)
        } else {
            self.background(.regularMaterial, in: shape)
        }
    }

    /// An interactive Liquid Glass surface that reacts to touch (used for the location FAB).
    @ViewBuilder
    func interactiveGlassSurface<S: Shape>(in shape: S) -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect(.regular.interactive(), in: shape)
        } else {
            self.background(.regularMaterial, in: shape)
        }
    }

    /// A prominent, tinted Liquid Glass button style (used for the "Hier suchen" pill).
    @ViewBuilder
    func glassProminentButton() -> some View {
        if #available(iOS 26.0, *) {
            self.buttonStyle(.glassProminent)
        } else {
            self.buttonStyle(.borderedProminent)
        }
    }
}
