import SwiftUI

/// Einstellungen tab: FELO-ID account hero, fuel type, appearance, language, server URL and about —
/// mirroring the website's settings sections in the iOS grouped-settings style.
struct SettingsTabView: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var serverDraft = ""
    @State private var loggingIn = false
    @State private var contributorsExpanded = true

    var body: some View {
        @Bindable var app = app
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text(s.settingsDescription)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    accountHero

                    section(s.fuel) {
                        ChipRow(items: FuelType.allCases, selection: $app.fuelType) { fuel in
                            Text(fuel.label)
                        }
                    }

                    section(s.priceAlert) {
                        AlertCard()
                    }

                    ScanLocationsSection()

                    LocationRequestsSection()

                    section(s.appearance) {
                        Picker(s.appearance, selection: $app.appearance) {
                            Text(s.themeAuto).tag(AppearanceSetting.auto)
                            Text(s.themeLight).tag(AppearanceSetting.light)
                            Text(s.themeDark).tag(AppearanceSetting.dark)
                        }
                        .pickerStyle(.segmented)
                        .sensoryFeedback(.selection, trigger: app.appearance)
                    }

                    section(s.priceHistory) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(s.historyDefaultLabel)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            Picker(s.historyDefaultLabel, selection: $app.historyDefaultDays) {
                                Text(s.historyDefault24h).tag(1)
                                Text(s.historyDefault7d).tag(7)
                            }
                            .pickerStyle(.segmented)
                            .sensoryFeedback(.selection, trigger: app.historyDefaultDays)
                        }
                    }

                    section(s.language) {
                        Picker(s.language, selection: $app.language) {
                            Text(s.langAuto).tag(AppLanguage.auto)
                            Text("Deutsch").tag(AppLanguage.de)
                            Text("English").tag(AppLanguage.en)
                        }
                        .pickerStyle(.segmented)
                        .sensoryFeedback(.selection, trigger: app.language)
                    }

                    section(s.server) {
                        serverCard
                    }

                    section(s.about) {
                        aboutCard
                    }

                    footer
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle(s.settingsTitle)
        }
        .onAppear {
            serverDraft = app.baseURLString
        }
    }

    // MARK: - Account

    private var accountHero: some View {
        VStack(alignment: .leading, spacing: 12) {
            heroContent
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .heroCardSurface(cornerRadius: Theme.rLg)
        .animation(.spring(duration: 0.4), value: app.isLoggedIn)
        .sensoryFeedback(.success, trigger: app.isLoggedIn)
    }

    @ViewBuilder
    private var heroContent: some View {
        Group {
                HStack(spacing: 12) {
                    avatar
                    VStack(alignment: .leading, spacing: 2) {
                        Text(s.feloId)
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(Color.accentColor)
                        Text(displayName)
                            .font(.headline)
                            .contentTransition(.opacity)
                        if !app.isLoggedIn {
                            Text(s.loginHint)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        } else if let email = app.me?.user?.email, !email.isEmpty {
                            Text(email)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                if app.isLoggedIn {
                    Button {
                        Haptics.light()
                        Task {
                            await app.logout()
                            Haptics.success()
                        }
                    } label: {
                        Text(s.logout)
                            .font(.subheadline.weight(.semibold))
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                } else if app.config?.auth?.oidcConfigured == true {
                    Button {
                        login()
                    } label: {
                        HStack(spacing: 8) {
                            if loggingIn {
                                ProgressView()
                                    .controlSize(.small)
                            }
                            Text(s.loginButton)
                                .font(.subheadline.weight(.semibold))
                        }
                        .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(loggingIn)
                }
        }
    }

    private var displayName: String {
        if app.isLoggedIn {
            let user = app.me?.user
            let name = user?.displayName ?? user?.username ?? ""
            return name.isEmpty ? (user?.email ?? "") : name
        }
        return s.notLoggedIn
    }

    private var avatar: some View {
        Group {
            if let photo = app.me?.user?.photoUrl, !photo.isEmpty, let url = URL(string: photo) {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFill()
                } placeholder: {
                    avatarPlaceholder
                }
            } else {
                avatarPlaceholder
            }
        }
        .frame(width: 60, height: 60)
        .clipShape(Circle())
    }

    private var avatarPlaceholder: some View {
        ZStack {
            Circle().fill(Color.accentColor.opacity(0.15))
            Image(systemName: "person.fill")
                .font(.title3)
                .foregroundStyle(Color.accentColor)
        }
    }

    private func login() {
        guard !loggingIn else { return }
        Haptics.light()
        loggingIn = true
        Task {
            defer { loggingIn = false }
            do {
                let token = try await AuthService.shared.login(baseURL: app.baseURL)
                app.setSessionToken(token)
                await app.refreshUser()
                Haptics.success()
            } catch {
                Haptics.error()
            }
        }
    }

    // MARK: - Server

    private var serverCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                Text(s.apiAddress)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                TextField(AppState.defaultBaseURL, text: $serverDraft)
                    .keyboardType(.URL)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .submitLabel(.done)
                    .onSubmit(applyServer)
                    .font(.subheadline.monospaced())
                if serverDraft != app.baseURLString || app.baseURLString != AppState.defaultBaseURL {
                    HStack(spacing: 10) {
                        if serverDraft != app.baseURLString {
                            Button {
                                applyServer()
                            } label: {
                                Text(s.apply)
                                    .font(.footnote.weight(.semibold))
                            }
                            .buttonStyle(.borderedProminent)
                        }
                        if app.baseURLString != AppState.defaultBaseURL {
                            Button {
                                serverDraft = AppState.defaultBaseURL
                                applyServer()
                            } label: {
                                Text("\(s.reset) (\(s.defaultLabel))")
                                    .font(.footnote.weight(.semibold))
                            }
                            .buttonStyle(.bordered)
                        }
                    }
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }
            }
            .animation(.spring(duration: 0.3), value: serverDraft)
        }
    }

    private func applyServer() {
        var trimmed = serverDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            trimmed = AppState.defaultBaseURL
        }
        if trimmed.hasSuffix("/") {
            trimmed = String(trimmed.dropLast())
        }
        serverDraft = trimmed
        guard trimmed != app.baseURLString else { return }
        // A different server means a different session domain — drop the token.
        app.setSessionToken(nil)
        app.baseURLString = trimmed
        Haptics.success()
        Task {
            await app.refreshConfig()
        }
    }

    // MARK: - About

    /// About hero + links card mirroring the web's `.about-hero` and `.about-links-card`
    /// (collapsible contributors list, GitHub link).
    private var aboutCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 14) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color.accentColor.opacity(0.15))
                        .frame(width: 68, height: 68)
                    Image(systemName: "fuelpump.fill")
                        .font(.system(size: 30))
                        .foregroundStyle(Color.accentColor)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text("Tanken")
                        .font(.title3.weight(.bold))
                    Text("\(s.version) \(appVersion)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(s.aboutTagline)
                        .font(.caption)
                        .foregroundStyle(Theme.hint)
                }
            }
            .padding(.horizontal, 2)

            VStack(spacing: 0) {
                Button {
                    Haptics.light()
                    withAnimation(.spring(duration: 0.3)) {
                        contributorsExpanded.toggle()
                    }
                } label: {
                    HStack(spacing: 12) {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 15))
                            .foregroundStyle(.secondary)
                            .frame(width: 24)
                        Text(s.contributors)
                            .font(.subheadline)
                        Spacer(minLength: 0)
                        Image(systemName: "chevron.right")
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(.secondary)
                            .rotationEffect(.degrees(contributorsExpanded ? 90 : 0))
                    }
                    .padding(14)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                if contributorsExpanded {
                    contributorRow
                        .transition(.opacity.combined(with: .move(edge: .top)))
                }
                Divider()
                    .padding(.leading, 14)
                Link(destination: URL(string: "https://github.com/Felitendo/Tanken")!) {
                    HStack(spacing: 12) {
                        Image(systemName: "link")
                            .font(.system(size: 15))
                            .foregroundStyle(.secondary)
                            .frame(width: 24)
                        Text(s.viewOnGithub)
                            .font(.subheadline)
                        Spacer(minLength: 0)
                        Image(systemName: "arrow.up.right")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                    .padding(14)
                }
                .tint(.primary)
            }
            .background(Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                    .strokeBorder(Theme.separator, lineWidth: 1)
            }
        }
    }

    /// Static contributor entry like the web's shell (Felitendo, GitHub avatar, role line).
    private var contributorRow: some View {
        Link(destination: URL(string: "https://github.com/Felitendo")!) {
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: "https://github.com/Felitendo.png")) { image in
                    image.resizable().scaledToFill()
                } placeholder: {
                    ZStack {
                        Circle().fill(Color.accentColor.opacity(0.15))
                        Text("F")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(Color.accentColor)
                    }
                }
                .frame(width: 36, height: 36)
                .clipShape(Circle())
                VStack(alignment: .leading, spacing: 1) {
                    Text("Felitendo")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(.primary)
                    Text(s.ownerRole)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer(minLength: 0)
                Image(systemName: "chevron.right")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
        }
        .tint(.primary)
    }

    private var appVersion: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "?"
    }

    private var footer: some View {
        Text(s.madeWithLove)
            .font(.footnote)
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
    }

    // MARK: - Helpers

    private func section(_ title: String, @ViewBuilder content: () -> some View) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(text: title)
            content()
        }
    }
}
