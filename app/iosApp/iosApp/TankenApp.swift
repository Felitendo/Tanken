import SwiftUI
import ComposeApp

@main
struct TankenApp: App {
    init() {
        // Start the shared Koin DI graph before any Compose screen is created.
        MainViewControllerKt.startKoinIos()
    }

    var body: some Scene {
        WindowGroup {
            RootTabView()
        }
    }
}
