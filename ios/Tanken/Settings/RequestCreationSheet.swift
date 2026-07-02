import SwiftUI
import MapKit

/// "Neuen Scan-Standort anfragen" sheet mirroring the web's request creation bottom sheet:
/// name field, debounced address search (server geocode proxy), tap-to-place map with the
/// 25 km scan-radius circle, optional note and submit.
struct RequestCreationSheet: View {
    @Environment(AppState.self) private var app
    @Environment(\.strings) private var s
    @Environment(\.dismiss) private var dismiss

    var presetName: String? = nil
    var presetLat: Double? = nil
    var presetLng: Double? = nil
    var onCreated: () -> Void = {}

    @State private var name = ""
    @State private var note = ""
    @State private var searchText = ""
    @State private var searchResults: [GeocodeResult] = []
    @State private var searchTask: Task<Void, Never>?
    @State private var pickedLat: Double = 51.1657
    @State private var pickedLng: Double = 10.4515
    @State private var camera: MapCameraPosition = .automatic
    @State private var sending = false
    @State private var errorMessage: String?

    private let radiusKm: Double = 25

    private var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: pickedLat, longitude: pickedLng)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    field(label: s.requestName) {
                        TextField(s.requestNamePlaceholder, text: $name)
                            .textFieldStyle(.plain)
                            .padding(12)
                            .background(Theme.card, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                            .onChange(of: name) {
                                if name.count > 80 { name = String(name.prefix(80)) }
                            }
                    }

                    field(label: s.requestAddress) {
                        VStack(spacing: 4) {
                            TextField(s.requestAddressPlaceholder, text: $searchText)
                                .textFieldStyle(.plain)
                                .autocorrectionDisabled()
                                .padding(12)
                                .background(Theme.card, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                            if !searchResults.isEmpty {
                                VStack(spacing: 0) {
                                    ForEach(Array(searchResults.enumerated()), id: \.offset) { index, result in
                                        Button {
                                            Haptics.light()
                                            pick(result)
                                        } label: {
                                            Text(result.name ?? "")
                                                .font(.system(size: 13))
                                                .foregroundStyle(.primary)
                                                .lineLimit(1)
                                                .frame(maxWidth: .infinity, alignment: .leading)
                                                .padding(.horizontal, 12)
                                                .padding(.vertical, 10)
                                                .contentShape(Rectangle())
                                        }
                                        .buttonStyle(.plain)
                                        if index < searchResults.count - 1 {
                                            Divider().padding(.leading, 12)
                                        }
                                    }
                                }
                                .background(Theme.card)
                                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                                .overlay {
                                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                                        .strokeBorder(Theme.separator, lineWidth: 1)
                                }
                            }
                        }
                    }

                    mapPicker

                    field(label: s.requestWhy) {
                        TextField(s.requestWhyPlaceholder, text: $note, axis: .vertical)
                            .textFieldStyle(.plain)
                            .lineLimit(3...6)
                            .padding(12)
                            .background(Theme.card, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                            .onChange(of: note) {
                                if note.count > 500 { note = String(note.prefix(500)) }
                            }
                    }

                    if let errorMessage {
                        Text(errorMessage)
                            .font(.system(size: 13))
                            .foregroundStyle(Theme.bad)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    Button {
                        submit()
                    } label: {
                        HStack(spacing: 8) {
                            if sending {
                                ProgressView().controlSize(.small)
                            }
                            Text(sending ? s.requestSending : s.requestSubmit)
                                .font(.subheadline.weight(.semibold))
                        }
                        .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.glassProminent)
                    .disabled(sending || name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle(s.requestSheetTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(s.cancel) { dismiss() }
                }
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .onChange(of: searchText) {
            scheduleSearch()
        }
        .task { await initializeLocation() }
    }

    private var mapPicker: some View {
        MapReader { proxy in
            Map(position: $camera) {
                Marker("", coordinate: coordinate)
                MapCircle(center: coordinate, radius: radiusKm * 1000)
                    .foregroundStyle(Color.accentColor.opacity(0.12))
                    .stroke(Color.accentColor, lineWidth: 2)
            }
            .onTapGesture { position in
                if let tapped = proxy.convert(position, from: .local) {
                    Haptics.light()
                    pickedLat = tapped.latitude
                    pickedLng = tapped.longitude
                }
            }
        }
        .frame(height: 240)
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .strokeBorder(Theme.separator, lineWidth: 1)
        }
    }

    private func field(label: String, @ViewBuilder content: () -> some View) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 12, weight: .medium))
                .textCase(.uppercase)
                .kerning(0.3)
                .foregroundStyle(Theme.hint)
            content()
        }
    }

    private func initializeLocation() async {
        name = presetName ?? name
        if let presetLat, let presetLng {
            moveTo(lat: presetLat, lng: presetLng, zoomSpan: 0.35)
            return
        }
        if let current = await OneShotLocation().current() {
            moveTo(lat: current.latitude, lng: current.longitude, zoomSpan: 0.35)
        } else {
            moveTo(lat: pickedLat, lng: pickedLng, zoomSpan: 8)
        }
    }

    private func moveTo(lat: Double, lng: Double, zoomSpan: Double) {
        pickedLat = lat
        pickedLng = lng
        withAnimation(.spring(duration: 0.5)) {
            camera = .region(MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                span: MKCoordinateSpan(latitudeDelta: zoomSpan, longitudeDelta: zoomSpan)
            ))
        }
    }

    private func scheduleSearch() {
        searchTask?.cancel()
        let query = searchText.trimmingCharacters(in: .whitespaces)
        guard query.count >= 2 else {
            searchResults = []
            return
        }
        let api = app.api
        let lang = app.language == .en ? "en" : "de"
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(400))
            guard !Task.isCancelled else { return }
            let results = (try? await api.geocode(query: query, lang: lang))?.results ?? []
            guard !Task.isCancelled else { return }
            withAnimation(.spring(duration: 0.25)) {
                searchResults = results
            }
        }
    }

    private func pick(_ result: GeocodeResult) {
        moveTo(lat: result.lat, lng: result.lng, zoomSpan: 0.2)
        searchText = result.name ?? searchText
        searchTask?.cancel()
        searchResults = []
        if name.trimmingCharacters(in: .whitespaces).isEmpty, let resultName = result.name {
            name = String(resultName.prefix(80))
        }
    }

    private func submit() {
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedName.isEmpty, !sending else { return }
        sending = true
        errorMessage = nil
        let trimmedNote = note.trimmingCharacters(in: .whitespacesAndNewlines)
        Task {
            defer { sending = false }
            do {
                _ = try await app.api.createLocationRequest(
                    name: trimmedName,
                    lat: pickedLat,
                    lng: pickedLng,
                    radiusKm: radiusKm,
                    note: trimmedNote.isEmpty ? nil : trimmedNote
                )
                Haptics.success()
                app.showToast(s.requestSent)
                onCreated()
                dismiss()
            } catch let error as ApiError where error.status == 429 {
                Haptics.error()
                errorMessage = s.requestTooMany
            } catch {
                Haptics.error()
                errorMessage = s.requestFailed
            }
        }
    }
}
