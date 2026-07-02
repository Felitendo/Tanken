# Fehlende Features — iOS-App vs. Website

Stand: Scaffold-Version der iOS-App (SwiftUI, iOS 26, Liquid Glass). Dieses Dokument listet alle
Features der Webversion, die in der App noch fehlen, und skizziert je Feature die geplante
Umsetzung. Referenz für die Web-UI ist `src/app/(app)/shell.ts` + `public/app.js`; die API ist in
der README dokumentiert.

**Was der Scaffold bereits kann:** Karte (Apple Maps) mit Preisblasen + regionalem Preisband,
„Hier suchen", Viewport-Nachladen, Ortssuche (MKLocalSearch), Stationsliste als Bottom-Drawer,
Stationsdetail (alle 3 Preise, Öffnungszeiten, Apple/Google-Maps-Routing), Verlauf-Charts
(7/14/30/Alles, DE/AT), Stats (Tiles, Wochentags-/Stunden-Charts, Top-10-Ranking), Einstellungen
(FELO-ID-Login via OIDC, Kraftstoff, Darstellung, Sprache, Server-URL, Über), Haptik + Animationen
durchgängig.

---

## 1. Preisalarm (Preisalarm-Karte in den Einstellungen)

- **Was fehlt:** Kompletter Alarm-Bereich: Aktivieren-Toggle, Schwellenwert mit +/−-Steppern und
  Schwellen-Visualisierung, Kanalwahl ntfy.sh/E-Mail, Statuspanel, Test-Benachrichtigung.
- **Web-Referenz:** `shell.ts` (#alert-card), `public/app.js` (Alarm-Logik), Server-Evaluator
  `src/lib/alert-evaluator.ts`.
- **API:** `GET/POST/DELETE /api/alert` (authentifiziert), `PriceAlert`-Shape ist bereits in
  `Tanken/Api/Models.swift` portiert; `ApiClient.alert()/saveAlert()/deleteAlert()` existieren.
- **Umsetzung (iOS):** Neue `AlertCard`-Sektion in `SettingsTabView` (nur eingeloggt sichtbar wie
  im Web). Threshold-Hero mit `.contentTransition(.numericText())` + Stepper-Buttons
  (`.sensoryFeedback(.increase/.decrease)`), Kanal-Segmente, Speichern via `saveAlert`. Der Alarm
  läuft serverseitig weiter (ntfy/E-Mail) — es ist **kein** App-Push nötig.
- **Bonus iOS-nativ:** Zusätzlich lokale Prüfung via `BGAppRefreshTask` +
  `UNUserNotificationCenter`: Task registrieren (`BGTaskScheduler`, Info.plist-Key
  `BGTaskSchedulerPermittedIdentifiers`), im Refresh `stations()` um den Alarm-Standort abrufen und
  bei Unterschreitung lokal benachrichtigen. Dann funktioniert der Alarm auch ohne ntfy-App.

## 2. Favoriten

- **Was fehlt:** Stern-Toggle in Liste + Detail (`--color-favorite` #ffb800 → `Theme.favorite`),
  „Favoriten oben"-Sortier-Toggle, Sync mit dem Account.
- **API:** `GET/POST/DELETE /api/favourites` (Body `{stationId}`), bereits in `ApiClient`
  implementiert (`favourites()`, `setFavourite(stationId:isFavourite:)`).
- **Umsetzung:** `favourites: Set<String>` in `AppState` (bei Login aus `/api/me` übernehmen, für
  Gäste in `UserDefaults`). Stern-Button in `StationRow` + `StationDetailView` mit
  Bounce-Animation (`.symbolEffect(.bounce)`) und `.sensoryFeedback(.success)`. Sortierung in
  `MapViewModel.sortedStations` um favouritesOnTop erweitern.

## 3. Suche mit Server-Vorschlägen

- **Was fehlt:** Das Web sucht Stationen nach Name/Marke über den gesamten Cache
  (`/api/stations/search`, max. 8) und Orte via `/api/geocode`, mit Vorschlags-Dropdown. Die App
  nutzt bisher nur `MKLocalSearch` (Orte).
- **Umsetzung:** Debounced Suggestions unterhalb des Suchfelds (Glass-Panel):
  `api.searchStations(query:fuel:lat:lng:)` (existiert schon) + `MKLocalSearchCompleter` für Orte.
  Auswahl einer Station → Kamera dorthin + `select(station)`; Auswahl eines Orts → `loadAround`.
  `/api/geocode` erfordert Login — MKLocalSearch deckt Gäste ab.

## 4. Routen-/Korridorsuche („Entlang Route suchen")

- **Was fehlt:** Start/Ziel-Eingabe mit Autocomplete, Route + günstigste Stationen entlang des
  Korridors, Routen-Overlay auf der Karte.
- **Web-Referenz:** `map-route-panel` in `shell.ts`, `src/lib/route-corridor.ts`, `src/lib/ors.ts`;
  API `GET /api/route` + `/api/route/scan-point`.
- **Umsetzung:** Route-Chip unter dem Suchfeld öffnet ein Glass-Panel (Start = aktueller Standort,
  Ziel mit Autocomplete). Entweder Server-Route (`/api/route`, konsistent mit Web) oder nativ
  `MKDirections` + eigenes Korridor-Sampling. Overlay als `MapPolyline` mit accent-Stroke,
  Stationen entlang der Route wie normale Annotations, Zusammenfassung (Distanz/Dauer) im Panel.

## 5. Stationsliste: Sortierung & Gruppierung

- **Was fehlt:** Sort-Umschalter (Preis/Entfernung), „pro Preis nur nächste Station"
  (`groupByPrice`), Stationszähler-Badge mit Sync-Status.
- **Umsetzung:** Sort-Button in der Drawer-Kopfzeile (`Menu` mit Optionen), `groupByPrice` als
  Toggle; Logik in `MapViewModel` (Gruppierung: `Dictionary(grouping: by price)` → nächste je
  Preis). Einstellungen via `/api/settings` synchronisieren (Nr. 6).

## 6. Settings-Sync (Cloud-Sync der Einstellungen)

- **Was fehlt:** Das Web synct `fuelType`, `theme`, `lang`, `historyDefaultDays`,
  `favouritesOnTop`, `groupByPrice` über den Account (Sync-Badges an den Sektionen).
- **API:** `GET/POST /api/settings` — `ApiClient.settings()/saveSettings()` existieren bereits.
- **Umsetzung:** In `AppState`: nach Login Server-Settings mergen (Server gewinnt), bei lokalen
  Änderungen debounced `saveSettings` (nur eingeloggt). Kleines Sync-Badge (Wolke) neben den
  Section-Headern mit Zuständen idle/spin/ok wie im Web.

## 7. Verlauf: Standort-Picker, 24h-Ansicht, Stundenchart

- **Was fehlt:** Standort-Filter („Alle Standorte" + einzelne Scan-Standorte, automatisch nächster),
  24h-Ansicht (`historyDefaultDays` 1/7 als Einstellung), Stundenchart im 24h-Modus,
  Verlaufs-Zusammenfassung unterhalb des Charts.
- **API:** `GET /api/history?locations=list&country=`, `?location=<id>`;
  `ApiClient.historyLocations()` existiert.
- **Umsetzung:** `Picker`/Menu über dem Chart (Standorte aus `historyLocations`), Auto-Auswahl über
  CoreLocation-Distanz zum nächsten Scan-Standort (`/api/scan-locations` liefert Koordinaten).
  24h-Modus: Range-Chip „24 h" + `hourAvgs`-BarChart einblenden; Standardansicht als Einstellung
  (`historyDefaultDays`) inkl. Sync.

## 8. Stats: Standort-Picker

- **Was fehlt:** Gleicher Standort-Filter wie im Verlauf (`/api/stats?location=`).
- **Umsetzung:** Identisches Picker-Pattern wie Nr. 7, gemeinsame Komponente extrahieren.

## 9. Standorte mit Verlaufsdaten + Standort-Anfragen

- **Was fehlt:** Einstellungs-Sektion mit der Liste der Scan-Standorte (inkl. Karten-Popup im Web),
  „Meine Anfragen" und „Standort anfragen" (Formular mit Kartenauswahl, Name, Radius, Notiz;
  Login erforderlich).
- **API:** `GET /api/scan-locations`, `POST /api/location-requests` (`{name, lat, lng, radiusKm,
  note}`), Status via eigener Requests-Liste.
- **Umsetzung:** Sektion in `SettingsTabView`: Standortliste (Name, Land-Flagge, Radius) mit
  Mini-`Map`-Preview im Sheet; „Standort anfragen"-Sheet mit `MapReader`/draggable Pin +
  Radius-Slider (Glass), POST + Erfolgs-Haptik. Anfragen-Status als Liste mit Badges
  (pending/approved/denied).

## 10. Pull-to-Refresh & Offline-Cache

- **Was fehlt:** Web hat Pull-to-Refresh; App lädt nur bei Kamerabewegung/Tab-Wechsel neu.
- **Umsetzung:** `.refreshable` auf Liste/Verlauf/Stats; letzter Stationsdatensatz + Band in
  `UserDefaults`/`FileManager` cachen und beim Start sofort anzeigen (stale-while-revalidate).

## 11. Vollständige i18n

- **Was fehlt:** Einige Web-Strings (Fehlertexte, Banner, Requests-Sektion) sind noch nicht im
  `L10n.swift`-Katalog; Info.plist-Texte (Location-Permission) sind nur Deutsch.
- **Umsetzung:** Katalog erweitern (Struktur erzwingt Vollständigkeit per memberwise init);
  `InfoPlist.strings` für de/en ergänzen (erfordert Lokalisierungs-Ordner im Projekt).

## 12. Widgets (WidgetKit)

- **Neu für iOS (Web: PWA-Homescreen):** Home-/Lock-Screen-Widget „Günstigste Tankstelle in der
  Nähe" (Preis, Marke, Entfernung, Preis-Farbe).
- **Umsetzung:** Widget-Extension-Target (zweites Target im pbxproj + App Group für geteilte
  UserDefaults), `TimelineProvider` mit Refresh ~30 min, letzte bekannte Position aus der App.
  `ApiClient`/`Models` in ein geteiltes Framework oder per Target-Membership teilen.

## 13. Live Activities (ActivityKit)

- **Idee:** Eine Station „beobachten" → Live Activity auf dem Lock Screen / Dynamic Island mit
  aktuellem Preis, Update via BGTask (oder Push, falls später Server-Push existiert).

## 14. App Shortcuts / Siri (AppIntents)

- **Idee:** „Wo ist Tanken am günstigsten?" als App Shortcut: `AppIntent`, der die günstigste
  Station der Umgebung als Snippet (Preis + Entfernung) liefert und in die Karte deep-linkt.

## 15. Nice-to-have (iOS 26 / Polish)

- `tabViewBottomAccessory`: aktueller Kraftstoff + regionales Preisband als Mini-Accessory über
  der Tab-Bar.
- `backgroundExtensionEffect()` für die Karte hinter der eingeklappten Tab-Bar.
- Karten-Cluster bei vielen Stationen (`MKClusterAnnotation`-Äquivalent manuell oder Zoom-Filter).
- CarPlay (`CPPointOfInterestTemplate`) — langfristig; erfordert Apple-Entitlement.
- App-Icon-Verweis in „Über" (echtes Icon statt SF-Symbol) + Mitwirkenden-Liste wie im Web.

## Nicht übertragbar / entfällt bewusst

- **PWA-Install-Popup, Service Worker, Tastaturkürzel, Desktop-Side-Panel** — Web-spezifisch.
- **Admin-Panel** (`/admin`) — bleibt bewusst Web-only (Konfiguration des Servers).
- **E-Mail-Kanal-Sichtbarkeit** richtet sich wie im Web nach `config.smtpConfigured`.
