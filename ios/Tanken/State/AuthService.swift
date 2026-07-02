import AuthenticationServices
import UIKit

/// OIDC login via the system in-app browser. Opens the server's
/// `/auth/oidc/start?mode=app&app_redirect=tanken://auth` flow; the callback deep-links back with
/// the signed session token, which the app replays as the `tank_session` cookie.
@MainActor
final class AuthService: NSObject, ASWebAuthenticationPresentationContextProviding {
    static let shared = AuthService()

    /// Kept alive for the duration of the flow — ASWebAuthenticationSession must be retained.
    private var activeSession: ASWebAuthenticationSession?

    func login(baseURL: URL) async throws -> String {
        guard var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: false) else {
            throw ApiError(status: 0, body: "invalid base url")
        }
        components.path += "/auth/oidc/start"
        components.queryItems = [
            URLQueryItem(name: "mode", value: "app"),
            URLQueryItem(name: "app_redirect", value: "tanken://auth"),
        ]
        guard let url = components.url else {
            throw ApiError(status: 0, body: "invalid login url")
        }

        return try await withCheckedThrowingContinuation { continuation in
            let session = ASWebAuthenticationSession(url: url, callbackURLScheme: "tanken") { [weak self] callbackURL, error in
                Task { @MainActor in
                    self?.activeSession = nil
                }
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                let token = callbackURL.flatMap {
                    URLComponents(url: $0, resolvingAgainstBaseURL: false)?
                        .queryItems?
                        .first(where: { $0.name == "token" })?
                        .value
                }
                if let token, !token.isEmpty {
                    continuation.resume(returning: token)
                } else {
                    continuation.resume(throwing: ApiError(status: 0, body: "no token in callback"))
                }
            }
            session.presentationContextProvider = self
            activeSession = session
            session.start()
        }
    }

    nonisolated func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        MainActor.assumeIsolated {
            UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap(\.windows)
                .first(where: \.isKeyWindow) ?? ASPresentationAnchor()
        }
    }
}
