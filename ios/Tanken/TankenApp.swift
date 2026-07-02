import SwiftUI

@main
struct TankenApp: App {
    @State private var app = AppState()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environment(app)
                .environment(\.strings, app.strings)
                .preferredColorScheme(app.appearance.colorScheme)
                .task {
                    async let config: Void = app.refreshConfig()
                    async let user: Void = app.refreshUser()
                    _ = await (config, user)
                }
                .onOpenURL { url in
                    app.handleURL(url)
                }
        }
    }
}
