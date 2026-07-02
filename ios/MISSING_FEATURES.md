# Fehlende Features — iOS-App vs. Website

Stand: Scaffold-Version der iOS-App (SwiftUI, iOS 26, Liquid Glass). Dieses Dokument listet alle
Features der Webversion, die in der App noch fehlen, und skizziert je Feature die geplante
Umsetzung. Referenz für die Web-UI ist `src/app/(app)/shell.ts` + `public/app.js`; die API ist in
der README dokumentiert.

**Was die App bereits kann:** Karte (Apple Maps) mit Preisblasen + regionalem Preisband,
„Hier suchen", Viewport-Nachladen, Suche mit Vorschlägen (Server-Stationssuche + Orte), Stationsliste
als Liquid-Glass-Bottom-Drawer im Web-Design (Rank-Badges, Sortierung Preis/Entfernung,
groupByPrice, Favoriten-oben), Stationsdetail nach Web-Vorlage (großer Preis, Status, Öffnungszeiten,
Routing, Preisverlauf-Chart 24h/7d), Favoriten mit Account-Sync, Preisalarm (ntfy/E-Mail,
serverseitig ausgewertet), Settings-Sync (Kraftstoff, Darstellung, Sprache, Chart-Standard,
Listen-Optionen), Verlauf-Charts (7/14/30/Alles, DE/AT), Stats, FELO-ID-Login, Toasts, Haptik +
Animationen durchgängig.

---

## 1. Preisalarm: lokale Prüfung als Bonus

Die Alarm-Karte (Toggle, Schwellenwert-Stepper, ntfy/E-Mail, Status, Test) ist umgesetzt —
serverseitige Auswertung wie im Web. **Offen als iOS-Bonus:** lokale Prüfung via
`BGAppRefreshTask` + `UNUserNotificationCenter` (Task via `BGTaskScheduler` registrieren,
Info.plist-Key `BGTaskSchedulerPermittedIdentifiers`, im Refresh `stations()` um den
Alarm-Standort abrufen und bei Unterschreitung lokal benachrichtigen) — dann kommt der Alarm auch
ohne ntfy-App an. Außerdem fehlt noch die Schwellen-Visualisierung (Threshold-Bar gegen den
aktuell günstigsten Preis) aus dem Web.

## 2. Routen-/Korridorsuche („Entlang Route suchen")

- **Was fehlt:** Start/Ziel-Eingabe mit Autocomplete, Route + günstigste Stationen entlang des
  Korridors, Routen-Overlay auf der Karte.
- **Web-Referenz:** `map-route-panel` in `shell.ts`, `src/lib/route-corridor.ts`, `src/lib/ors.ts`;
  API `GET /api/route` + `/api/route/scan-point`.
- **Umsetzung:** Route-Chip unter dem Suchfeld öffnet ein Glass-Panel (Start = aktueller Standort,
  Ziel mit Autocomplete). Entweder Server-Route (`/api/route`, konsistent mit Web) oder nativ
  `MKDirections` + eigenes Korridor-Sampling. Overlay als `MapPolyline` mit accent-Stroke,
  Stationen entlang der Route wie normale Annotations, Zusammenfassung (Distanz/Dauer) im Panel.

## 3. Verlauf: Standort-Picker, 24h-Ansicht, Stundenchart

- **Was fehlt:** Standort-Filter („Alle Standorte" + einzelne Scan-Standorte, automatisch nächster),
  24h-Ansicht des Verlauf-Tabs, Stundenchart im 24h-Modus, Verlaufs-Zusammenfassung unterhalb des
  Charts. (Die `historyDefaultDays`-Einstellung + das Stations-Chart im Detail sind umgesetzt.)
- **API:** `GET /api/history?locations=list&country=`, `?location=<id>`;
  `ApiClient.historyLocations()` existiert.
- **Umsetzung:** `Picker`/Menu über dem Chart (Standorte aus `historyLocations`), Auto-Auswahl über
  CoreLocation-Distanz zum nächsten Scan-Standort (`/api/scan-locations` liefert Koordinaten).
  24h-Modus: Range-Chip „24 h" + `hourAvgs`-BarChart einblenden.

## 4. Stats: Standort-Picker

- **Was fehlt:** Gleicher Standort-Filter wie im Verlauf (`/api/stats?location=`).
- **Umsetzung:** Identisches Picker-Pattern wie Nr. 3, gemeinsame Komponente extrahieren.

## 5. Standorte mit Verlaufsdaten + Standort-Anfragen

- **Was fehlt:** Einstellungs-Sektion mit der Liste der Scan-Standorte (inkl. Karten-Popup im Web),
  „Meine Anfragen" und „Standort anfragen" (Formular mit Kartenauswahl, Name, Radius, Notiz;
  Login erforderlich).
- **API:** `GET /api/scan-locations`, `POST /api/location-requests` (`{name, lat, lng, radiusKm,
  note}`), Status via eigener Requests-Liste.
- **Umsetzung:** Sektion in `SettingsTabView`: Standortliste (Name, Land-Flagge, Radius) mit
  Mini-`Map`-Preview im Sheet; „Standort anfragen"-Sheet mit `MapReader`/draggable Pin +
  Radius-Slider (Glass), POST + Erfolgs-Haptik. Anfragen-Status als Liste mit Badges
  (pending/approved/denied).

## 6. Pull-to-Refresh & Offline-Cache

- **Was fehlt:** Web hat Pull-to-Refresh; App lädt nur bei Kamerabewegung/Tab-Wechsel neu.
- **Umsetzung:** `.refreshable` auf Liste/Verlauf/Stats; letzter Stationsdatensatz + Band in
  `UserDefaults`/`FileManager` cachen und beim Start sofort anzeigen (stale-while-revalidate).

## 7. Vollständige i18n

- **Was fehlt:** Einige Web-Strings (Fehlertexte, Banner, Requests-Sektion) sind noch nicht im
  `L10n.swift`-Katalog; Info.plist-Texte (Location-Permission) sind nur Deutsch.
- **Umsetzung:** Katalog erweitern (Struktur erzwingt Vollständigkeit per memberwise init);
  `InfoPlist.strings` für de/en ergänzen (erfordert Lokalisierungs-Ordner im Projekt).

## 8. Widgets (WidgetKit)

- **Neu für iOS (Web: PWA-Homescreen):** Home-/Lock-Screen-Widget „Günstigste Tankstelle in der
  Nähe" (Preis, Marke, Entfernung, Preis-Farbe).
- **Umsetzung:** Widget-Extension-Target (zweites Target im pbxproj + App Group für geteilte
  UserDefaults), `TimelineProvider` mit Refresh ~30 min, letzte bekannte Position aus der App.
  `ApiClient`/`Models` in ein geteiltes Framework oder per Target-Membership teilen.

## 9. Live Activities (ActivityKit)

- **Idee:** Eine Station „beobachten" → Live Activity auf dem Lock Screen / Dynamic Island mit
  aktuellem Preis, Update via BGTask (oder Push, falls später Server-Push existiert).

## 10. App Shortcuts / Siri (AppIntents)

- **Idee:** „Wo ist Tanken am günstigsten?" als App Shortcut: `AppIntent`, der die günstigste
  Station der Umgebung als Snippet (Preis + Entfernung) liefert und in die Karte deep-linkt.

## 11. Nice-to-have (iOS 26 / Polish)

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
