import SwiftUI
import CoreLocation

/// One-shot location fetch for the alert's monitoring center (no permission prompt of its own —
/// the map tab is responsible for asking; without permission the alert is saved without coords
/// and the server keeps/derives the area).
@MainActor
private final class OneShotLocation: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<CLLocationCoordinate2D?, Never>?

    func current() async -> CLLocationCoordinate2D? {
        let status = manager.authorizationStatus
        guard status == .authorizedWhenInUse || status == .authorizedAlways else { return nil }
        manager.delegate = self
        return await withCheckedContinuation { continuation in
            self.continuation = continuation
            manager.requestLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        continuation?.resume(returning: locations.last?.coordinate)
        continuation = nil
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        continuation?.resume(returning: nil)
        continuation = nil
    }
}

/// The Preisalarm card, mirroring the web's alert card: enable toggle, threshold hero with
/// ±1-cent steppers, ntfy/email channel picker, status panel and save/test actions.
/// Server-side evaluation — no push infrastructure needed in the app.
struct AlertCard: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var enabled = false
    @State private var threshold = 1.80
    @State private var channel = "ntfy"
    @State private var ntfyTopic = ""
    @State private var email = ""
    @State private var existing: PriceAlert?
    @State private var busy = false
    @State private var loaded = false

    private let locator = OneShotLocation()

    var body: some View {
        Card {
            if !app.isLoggedIn {
                HStack(spacing: 10) {
                    Image(systemName: "bell.badge")
                        .foregroundStyle(Color.accentColor)
                    Text(s.alertLoginRequired)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            } else {
                VStack(alignment: .leading, spacing: 14) {
                    toggleRow
                    if enabled {
                        thresholdHero
                        channelSection
                        statusPanel
                        actions
                    }
                }
                .animation(.spring(duration: 0.35), value: enabled)
            }
        }
        .task(id: app.isLoggedIn) {
            guard app.isLoggedIn, !loaded else { return }
            if let alert = try? await app.api.alert() {
                existing = alert
                enabled = alert.enabled
                threshold = alert.threshold
                channel = alert.channel
                ntfyTopic = alert.ntfyTopic ?? ""
                email = alert.email ?? ""
            }
            loaded = true
        }
    }

    private var toggleRow: some View {
        HStack(spacing: 10) {
            Image(systemName: "bell.fill")
                .font(.system(size: 15))
                .foregroundStyle(Color.accentColor)
                .frame(width: 30, height: 30)
                .background(Color.accentColor.opacity(0.12), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            VStack(alignment: .leading, spacing: 1) {
                Text(s.notification)
                    .font(.subheadline.weight(.medium))
                Text(s.alertBackgroundHint)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Toggle("", isOn: $enabled)
                .labelsHidden()
                .sensoryFeedback(.selection, trigger: enabled)
                .onChange(of: enabled) { _, isOn in
                    // Turning an existing alert off is saved immediately, like the web.
                    if !isOn, existing != nil {
                        Task { await save() }
                    }
                }
        }
    }

    private var thresholdHero: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(s.threshold)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            HStack(spacing: 16) {
                stepButton(icon: "minus") {
                    threshold = max(0.5, (threshold * 100 - 1).rounded() / 100)
                }
                Text(Formatters.price(threshold))
                    .font(.system(size: 34, weight: .heavy))
                    .contentTransition(.numericText())
                    .animation(.spring(duration: 0.25), value: threshold)
                    .frame(maxWidth: .infinity)
                stepButton(icon: "plus") {
                    threshold = min(3.0, (threshold * 100 + 1).rounded() / 100)
                }
            }
        }
    }

    private func stepButton(icon: String, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.selection()
            withAnimation {
                action()
            }
        } label: {
            Image(systemName: icon)
                .font(.system(size: 17, weight: .semibold))
                .frame(width: 40, height: 40)
                .background(Color.primary.opacity(0.06), in: Circle())
        }
        .buttonStyle(PressableRowStyle())
    }

    private var channelSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(s.notificationChannel)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            if app.config?.smtpConfigured == true {
                Picker(s.notificationChannel, selection: $channel) {
                    Text("ntfy.sh").tag("ntfy")
                    Text("E-Mail").tag("email")
                }
                .pickerStyle(.segmented)
                .sensoryFeedback(.selection, trigger: channel)
            }
            if channel == "email", app.config?.smtpConfigured == true {
                TextField(s.emailPlaceholder, text: $email)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .textFieldStyle(.roundedBorder)
                Text(s.emailHint)
                    .font(.caption2)
                    .foregroundStyle(Theme.hint)
            } else {
                TextField(s.ntfyTopicPlaceholder, text: $ntfyTopic)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .textFieldStyle(.roundedBorder)
                Text(s.ntfyHint)
                    .font(.caption2)
                    .foregroundStyle(Theme.hint)
            }
        }
    }

    private var statusPanel: some View {
        HStack(spacing: 8) {
            Circle()
                .fill(existing?.enabled == true ? Theme.good : Theme.hint)
                .frame(width: 8, height: 8)
            Text(existing?.enabled == true ? s.alertStatusActive : s.alertStatusInactive)
                .font(.caption.weight(.medium))
                .foregroundStyle(.secondary)
            if let last = existing?.lastNotifiedPrice, last > 0 {
                Spacer()
                Text(Formatters.price(last))
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(Theme.good)
            }
        }
        .padding(10)
        .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: Theme.rSm, style: .continuous))
    }

    private var actions: some View {
        VStack(spacing: 8) {
            Button {
                Haptics.medium()
                Task { await save() }
            } label: {
                HStack(spacing: 8) {
                    if busy {
                        ProgressView()
                            .controlSize(.small)
                    }
                    Text(s.saveAlarm)
                        .font(.subheadline.weight(.semibold))
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.glassProminent)
            .disabled(busy || !inputValid)

            if channel == "ntfy", !ntfyTopic.trimmingCharacters(in: .whitespaces).isEmpty {
                Button {
                    Haptics.light()
                    Task { await sendTest() }
                } label: {
                    Text(s.sendTestNotification)
                        .font(.subheadline.weight(.medium))
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.glass)
                .disabled(busy)
            }
        }
    }

    private var inputValid: Bool {
        if channel == "email" {
            return email.contains("@")
        }
        return !ntfyTopic.trimmingCharacters(in: .whitespaces).isEmpty
    }

    private func save() async {
        busy = true
        defer { busy = false }
        let location = await locator.current()
        let alert = PriceAlert(
            threshold: threshold,
            fuel: app.fuelType,
            enabled: enabled,
            channel: channel,
            ntfyTopic: ntfyTopic.trimmingCharacters(in: .whitespaces),
            email: email.trimmingCharacters(in: .whitespaces),
            lat: location?.latitude,
            lng: location?.longitude,
            radiusKm: 25
        )
        if let response = try? await app.api.saveAlert(alert), response.ok == true {
            existing = response.alert ?? alert
            Haptics.success()
            app.showToast(s.alertSaved)
        } else {
            Haptics.error()
            app.showToast(s.errorGeneric)
        }
    }

    private func sendTest() async {
        busy = true
        defer { busy = false }
        do {
            try await app.api.sendTestNotification(
                topic: ntfyTopic.trimmingCharacters(in: .whitespaces),
                title: "Tanken",
                message: "Test-Benachrichtigung 🚀"
            )
            Haptics.success()
            app.showToast(s.testSent)
        } catch {
            Haptics.error()
            app.showToast(s.errorGeneric)
        }
    }
}
