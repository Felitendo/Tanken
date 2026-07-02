import SwiftUI

/// "Meine Anfragen" settings section mirroring the web's user location requests:
/// status-badged request rows (with admin denial notes) plus the "Standort anfragen"
/// button. OIDC accounts only — others get the same hints as the web.
struct LocationRequestsSection: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s

    @State private var requests: [LocationRequest] = []
    @State private var showCreationSheet = false

    private var isOidc: Bool {
        app.me?.user?.authProvider == "oidc"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !app.isLoggedIn {
                hintRow(s.requestsLoginHint)
            } else if !isOidc {
                hintRow(s.requestsOidcOnly)
            } else {
                if !requests.isEmpty {
                    SectionHeader(text: s.myRequests)
                    requestsCard
                }
                requestButton
            }
        }
        .animation(.spring(duration: 0.3), value: requests)
        .task(id: app.isLoggedIn) { await load() }
        .onChange(of: app.baseURLString) {
            Task { await load() }
        }
        .sheet(isPresented: $showCreationSheet) {
            RequestCreationSheet {
                Task { await load() }
            }
        }
    }

    private func hintRow(_ text: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "info.circle")
                .font(.system(size: 15))
                .foregroundStyle(Theme.hint)
            Text(text)
                .font(.system(size: 13))
                .foregroundStyle(Theme.hint)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(Theme.card, in: RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
    }

    private var requestsCard: some View {
        VStack(spacing: 0) {
            ForEach(Array(requests.enumerated()), id: \.element.id) { index, request in
                requestRow(request)
                if index < requests.count - 1 {
                    Divider().padding(.leading, 16)
                }
            }
        }
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Theme.rMd, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
    }

    private func requestRow(_ request: LocationRequest) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 10) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(request.name ?? "")
                        .font(.system(size: 15, weight: .medium))
                        .lineLimit(1)
                    Text(subline(for: request))
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.hint)
                }
                Spacer(minLength: 0)
                statusBadge(request.status ?? "pending")
            }
            if request.status == "denied", let note = request.adminNote, !note.isEmpty {
                (Text("\(s.requestDeniedReason): ").foregroundStyle(Theme.bad).fontWeight(.medium)
                    + Text(note).foregroundStyle(.primary))
                    .font(.system(size: 12))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 8)
                    .background(Theme.bad.opacity(0.08), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    private func subline(for request: LocationRequest) -> String {
        var text = String(format: "%.4f, %.4f", request.lat, request.lng)
        if let date = Formatters.date(from: request.createdAt) {
            text += " · " + date.formatted(.dateTime.day(.twoDigits).month(.twoDigits).year())
        }
        return text
    }

    private func statusBadge(_ status: String) -> some View {
        let (label, color): (String, Color) = switch status {
        case "approved": (s.requestApproved, Theme.good)
        case "denied": (s.requestDenied, Theme.bad)
        default: (s.requestPending, Theme.okay)
        }
        return Text(label)
            .font(.system(size: 11, weight: .semibold))
            .kerning(0.3)
            .foregroundStyle(color)
            .padding(.horizontal, 10)
            .padding(.vertical, 3)
            .background(color.opacity(0.15), in: Capsule())
    }

    private var requestButton: some View {
        Button {
            Haptics.light()
            showCreationSheet = true
        } label: {
            HStack(spacing: 8) {
                Image(systemName: "plus")
                    .font(.system(size: 13, weight: .semibold))
                Text(s.requestLocation)
                    .font(.subheadline.weight(.semibold))
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.glass)
    }

    private func load() async {
        guard app.isLoggedIn, isOidc else {
            requests = []
            return
        }
        requests = (try? await app.api.locationRequests()) ?? []
    }
}
