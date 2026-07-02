import SwiftUI
import CoreLocation

/// The Preisalarm card, mirroring the web's alert card: enable toggle, threshold hero with
/// ±1-cent steppers and a draggable threshold bar against the current market range, ntfy/email
/// channel picker, status panel and save/test actions.
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
    /// Cheapest…priciest price around the user (with a small margin) — anchors the threshold bar
    /// (web #alert-threshold-bar).
    @State private var marketRange: ClosedRange<Double>?
    /// The actual cheapest price in the area, for the caption under the bar.
    @State private var cheapestPrice: Double?

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
                        thresholdBar
                        channelSection
                        statusPanel
                        actions
                    }
                }
                .animation(.spring(duration: 0.35), value: enabled)
                .animation(.spring(duration: 0.35), value: marketRange)
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
            await loadMarketRange()
        }
    }

    /// Fetches the cheapest/priciest price around the alert area (saved coords, else the user's
    /// location) so the bar can show where the threshold sits in the current market.
    private func loadMarketRange() async {
        var center: CLLocationCoordinate2D?
        if let lat = existing?.lat, let lng = existing?.lng {
            center = CLLocationCoordinate2D(latitude: lat, longitude: lng)
        } else {
            center = await locator.current()
        }
        guard let center else { return }
        guard let stations = try? await app.api.stations(
            lat: center.latitude,
            lng: center.longitude,
            fuel: app.fuelType
        ) else { return }
        let prices = stations.compactMap(\.price).filter { $0 > 0 }
        guard let low = prices.min(), let high = prices.max(), high > low else { return }
        cheapestPrice = low
        marketRange = (low - 0.05)...(high + 0.05)
        // Web default when nothing is armed yet: 3 ct under the current cheapest price.
        if existing == nil {
            threshold = min(3.0, max(0.5, ((low - 0.03) * 100).rounded() / 100))
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

    /// Green→red bar spanning the current market range; the marker sits at the threshold and can
    /// be dragged, like the web's #alert-threshold-bar.
    @ViewBuilder
    private var thresholdBar: some View {
        if let range = marketRange {
            VStack(spacing: 4) {
                GeometryReader { geo in
                    let span = range.upperBound - range.lowerBound
                    let fraction = (threshold - range.lowerBound) / span
                    let x = geo.size.width * min(max(fraction, 0), 1)
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(
                                LinearGradient(
                                    colors: [Theme.good, Theme.okay, Theme.bad],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(height: 6)
                        Circle()
                            .fill(.white)
                            .frame(width: 18, height: 18)
                            .shadow(color: .black.opacity(0.25), radius: 3, y: 1)
                            .position(x: x, y: geo.size.height / 2)
                    }
                    .contentShape(Rectangle())
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { drag in
                                let dragFraction = min(max(drag.location.x / geo.size.width, 0), 1)
                                let price = range.lowerBound + dragFraction * span
                                let next = min(3.0, max(0.5, (price * 100).rounded() / 100))
                                if next != threshold {
                                    threshold = next
                                    Haptics.selection()
                                }
                            }
                    )
                }
                .frame(height: 24)
                HStack {
                    Text(Formatters.price(range.lowerBound))
                    Spacer()
                    Text(Formatters.price(range.upperBound))
                }
                .font(.caption2)
                .foregroundStyle(Theme.hint)
                if let cheapestPrice {
                    Text(String(format: s.alertCheapestFormat, Formatters.price(cheapestPrice)))
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .transition(.opacity.combined(with: .move(edge: .top)))
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
