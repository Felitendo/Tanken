import SwiftUI
import UIKit
import ComposeApp

/// Bridges a Kotlin `ComposeUIViewController` (one shared Compose screen) into SwiftUI so it can be
/// embedded inside the native Liquid Glass `TabView`.
struct ComposeScreen: UIViewControllerRepresentable {
    let make: () -> UIViewController

    func makeUIViewController(context: Context) -> UIViewController {
        make()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
