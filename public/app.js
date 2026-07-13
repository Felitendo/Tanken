const i18n = {
  de: {
    // Tabs
    tabMap: 'Karte',
    tabHistory: 'Verlauf',
    tabSettings: 'Einstellungen',
    // Map
    myLocation: 'Mein Standort',
    loadingStations: 'Tankstellen laden…',
    noOpenStations: 'Keine offenen Tankstellen gefunden',
    showAll: 'Alle anzeigen',
    noStationsYet: 'Keine Tankstellen in der Nähe gefunden',
    errorLoading: '❌ Fehler beim Laden',
    pricesStale: 'Preise evtl. veraltet (API nicht erreichbar)',
    pricesStaleConnection: 'Preise evtl. veraltet (Verbindungsfehler)',
    pricesFallback: 'Keine gescannten Tankstellen in der Nähe – Ergebnisse von einer entfernten Messstelle',
    // Station sheet
    open: 'Geöffnet',
    closed: 'Geschlossen',
    closesAt: 'schließt um',
    opensAt: 'öffnet um',
    open24h: 'Rund um die Uhr',
    openingHours: 'Öffnungszeiten',
    kmAway: 'km entfernt',
    dayAbbr: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    // History
    timePeriod: 'ZEITRAUM',
    countryDE: 'Deutschland',
    countryAT: 'Österreich',
    days7: '7 Tage',
    days14: '14 Tage',
    days30: '30 Tage',
    all: 'Alles',
    tapForHours: 'Antippen für Stundenansicht',
    summary: 'ZUSAMMENFASSUNG',
    lowestPrice: 'Niedrigster Preis',
    highestPrice: 'Höchster Preis',
    unknown: 'Unbekannt',
    currentAvg: 'Aktuell Ø',
    vsLastWeek: 'vs. letzte Woche',
    vsLastMonth: 'vs. letzter Monat',
    // Stats
    noStats: 'Keine Statistiken verfügbar',
    avgPrice: 'Durchschnittspreis',
    lowest: 'Niedrigster',
    highest: 'Höchster',
    measurements: 'Messungen',
    bestTimes: 'BESTE TANKZEITEN',
    cheapestDay: 'Günstigster Wochentag',
    cheapestHour: 'Günstigste Uhrzeit',
    weekdays: 'WOCHENTAGE',
    hourRanking: 'UHRZEITEN',
    stationRanking: 'TANKSTELLEN RANKING',
    priceSpread: 'PREISSPANNE',
    vsWorst: 'gespart',
    periodLastDays: 'Letzte {n} Tage',
    periodSince: 'Seit {date}',
    periodToday: 'Heute',
    locationAutoPicked: 'Automatisch · nächster Standort',
    historyTooltipHint: 'Antippen für Stundenansicht',
    historyAvgLabel: 'Ø',
    historyHighLabel: 'Max',
    historyHourTitle: 'Stundenansicht',
    closeHourView: 'Schließen',
    oclock: 'Uhr',
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    // Settings
    fuelType: 'KRAFTSTOFF',
    location: 'STANDORT',
    priceAlert: 'PREISALARM',
    notification: 'Benachrichtigung',
    alertBackgroundHint: 'Läuft im Hintergrund, auch wenn die App geschlossen ist.',
    alertStatusInactive: 'Noch nicht aktiv',
    alertStatusArmed: 'Aktiv · überwacht im Hintergrund',
    alertStatusBelow: 'Aktuell unter Schwellenwert',
    alertStatusLastFiredFmt: 'Zuletzt benachrichtigt {when} bei {price}',
    alertStatusCheapestFmt: 'Aktuell günstigster Preis: {price}',
    alertJustNow: 'gerade eben',
    alertMinutesAgoFmt: 'vor {n} Min.',
    alertHoursAgoFmt: 'vor {n} Std.',
    alertDaysAgoFmt: 'vor {n} Tagen',
    notificationChannel: 'Benachrichtigungskanal',
    ntfyTopicPlaceholder: 'ntfy Topic (z.B. mein-tankalarm)',
    ntfyHint: 'Installiere die <a href="https://ntfy.sh" target="_blank" rel="noopener" style="color:var(--color-accent)">ntfy App</a> und abonniere dein Topic.',
    threshold: 'Schwellenwert',
    saveAlarm: 'Alarm speichern',
    sendTestNotification: 'Test-Benachrichtigung senden',
    appearance: 'DARSTELLUNG',
    appearanceLabel: 'Darstellung',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    language: 'SPRACHE',
    languageLabel: 'Sprache',
    about: 'ÜBER',
    versionLabel: 'Version',
    viewOnGithub: 'Auf GitHub ansehen',
    contributors: 'Mitwirkende',
    ownerRole: 'Ersteller & Maintainer',
    syncedSetting: 'Wird zwischen Geräten synchronisiert',
    cloudSyncHint: 'Anmelden für Cloud-Sync, um Einstellungen geräteübergreifend zu synchronisieren',
    madeWith: 'Gemacht mit',
    madeIn: 'in Deutschland',
    currentCheapest: 'Aktuell günstigster Preis',
    // Account
    notLoggedIn: 'Nicht eingeloggt',
    loginSubline: 'Login optional, zum Sync deiner Einstellungen.',
    loggedIn: 'Eingeloggt',
    connectedWith: 'Verbunden mit',
    loginWith: 'Login mit',
    configureOidc: 'OIDC im Admin Panel unter /admin konfigurieren.',
    loggedOut: 'Abgemeldet',
    // Alerts
    alertActive: 'Alarm aktiv: Benachrichtigung unter',
    saved: 'Gespeichert',
    alertSetMsg: 'Alarm gesetzt. Ich piekse dich bei',
    under: 'unter',
    alertFailed: 'Alarm fehlgeschlagen',
    serverError: 'Server hatte keine Lust.',
    deleteFailed: 'Alarm löschen fehlgeschlagen',
    deleteError: 'Nope.',
    enterNtfyTopic: 'Bitte ein ntfy Topic eingeben.',
    enterEmail: 'Bitte eine E-Mail-Adresse eingeben.',
    emailPlaceholder: 'E-Mail-Adresse',
    emailHint: 'Preisalarme werden an diese Adresse gesendet.',
    testAlertTitle: 'Tanken - Testalarm!',
    testAlertBody: 'Das ist eine Test-Benachrichtigung.',
    testSentNtfy: 'Test an ntfy gesendet!',
    testSentEmail: 'Test-E-Mail gesendet!',
    testFailed: 'Test fehlgeschlagen',
    ntfySendFailed: 'ntfy-Versand fehlgeschlagen.',
    emailSendFailed: 'E-Mail-Versand fehlgeschlagen.',
    priceAlertTitle: 'Tanken - Preisalarm!',
    // Location
    locationTitle: 'Standort',
    locationError: 'Konnte Standort nicht ermitteln. Bitte Berechtigung erlauben.',
    searchPlaceholder: 'Tankstelle oder Ort suchen…',
    locationBanner: 'Standort konnte nicht ermittelt werden. Bitte suche einen Ort.',
    noSearchResults: 'Keine Ergebnisse',
    // PWA
    pwaTitle: 'Tanken installieren',
    pwaDesc: 'Füge Tanken zu deinem Startbildschirm hinzu für schnelleren Zugriff und ein App-ähnliches Erlebnis.',
    pwaAndroid1: 'Tippe auf das <strong>Dreipunkt-Menü</strong> oben rechts',
    pwaAndroid2: 'Wähle <strong>„App installieren"</strong> oder <strong>„Zum Startbildschirm hinzufügen"</strong>',
    pwaAndroid3: 'Bestätige mit <strong>„Installieren"</strong>',
    pwaIos1: 'Tippe auf das <strong>Teilen-Symbol</strong> in der Safari-Leiste',
    pwaIos2: 'Scrolle und wähle <strong>„Zum Home-Bildschirm"</strong>',
    pwaIos3: 'Tippe oben rechts auf <strong>„Hinzufügen"</strong>',
    pwaWin1: 'Klicke auf das <strong>Installations-Symbol</strong> in der Adressleiste',
    pwaWin2: 'Bestätige mit <strong>„Installieren"</strong>',
    pwaWin3: 'Optional: <strong>An Taskleiste anheften</strong> für schnellen Zugriff',
    // Page headers
    historyTitle: 'Preisverlauf',
    historyDescription: 'Wie sich die Preise zuletzt entwickelt haben.',
    statsTitle: 'Statistiken',
    statsDescription: 'Wann und wo Tanken am günstigsten ist.',
    settingsTitle: 'Einstellungen',
    settingsDescription: 'Deine App-Einstellungen und dein Konto.',
    feloId: 'FELO ID',
    aboutTagline: 'Spritpreise im Blick.',
    // Station history
    priceHistory: 'PREISVERLAUF',
    areaHistory: 'Gebietspreisverlauf',
    noHistory: 'Kein Verlauf verfügbar',
    sheet24h: '24h',
    sheet7d: '7 Tage',
    // Station sort
    sortPrice: 'Preis',
    sortDistance: 'Entfernung',
    stationsFound: 'Tankstellen',
    alongRoute: 'entlang der Route',
    addFavourite: 'Zu Favoriten hinzufügen',
    removeFavourite: 'Aus Favoriten entfernen',
    maxFavourites: 'Maximale Anzahl an Favoriten erreicht',
    loginRequiredFavourite: 'Bitte einloggen, um Favoriten zu speichern',
    favouriteFailed: 'Favorit konnte nicht gespeichert werden',
    syncFailed: 'Synchronisierung fehlgeschlagen – Einstellung nur lokal gespeichert',
    sheetExpand: 'Vergrößern',
    sheetCollapse: 'Verkleinern',
    retry: 'Erneut versuchen',
    appUpdated: 'App wurde auf die neueste Version aktualisiert',
    share: 'Teilen',
    copied: 'In die Zwischenablage kopiert',
    shareFailed: 'Teilen nicht möglich',
    favouritesOnlyTitle: 'Nur Favoriten anzeigen',
    noFavouritesHere: 'Keine Favoriten in diesem Gebiet',
    clearSearch: 'Suche löschen',
    closeBanner: 'Banner schließen',
    lastUpdated: 'Zuletzt aktualisiert',
    minutesAgoFmt: 'vor {n} Min.',
    hoursAgoFmt: 'vor {n} Std.',
    justNow: 'gerade eben',
    unknownLocation: 'Unbekannter Standort',
    // Scan-Standorte
    scanLocations: 'SCAN-STANDORTE',
    historyLocations: 'STANDORTE MIT VERLAUFSDATEN',
    historyLocationsHint: 'Für diese Standorte sammeln wir täglich Preise für Verlaufscharts. Den aktuellen Preis kannst du jederzeit für jeden beliebigen Ort auf der Karte abrufen.',
    historyLocationsEmpty: 'Noch keine Standorte mit Verlaufsdaten.',
    historyLocSummary: 'Preise werden an {n} Standorten gesammelt – {parts}.',
    historyLocRadius: '{n} km Umkreis',
    historyLocToggleAria: 'Standortliste ein-/ausklappen',
    historyLocTotalLabel: 'Standorte',
    historyLocShowOnMap: 'Auf Karte anzeigen',
    historyLocOpenOnMap: 'Auf der Karte öffnen',
    historyLocClose: 'Schließen',
    shortcuts: 'TASTATURKÜRZEL',
    shortcutsHint: 'Tippe auf ein Kürzel und drücke die gewünschte Tastenkombination. Backspace entfernt es. Gilt nur auf diesem Gerät.',
    shortcutsReset: 'Auf Standard zurücksetzen',
    shortcutRecording: 'Taste drücken…',
    shortcutNone: 'Keine',
    scFocusSearch: 'Suche fokussieren',
    scMyLocation: 'Zu meinem Standort',
    scSearchHere: 'Hier suchen',
    scToggleTheme: 'Design wechseln',
    themeLabel: 'Design',
    themeAuto: 'Auto',
    myRequests: 'MEINE ANFRAGEN',
    requestLocation: 'Standort anfragen',
    requestsLoginHint: 'Mit FeloID anmelden, um neue Scan-Standorte anzufragen.',
    requestsOidcOnly: 'Standort-Anfragen nur mit FeloID-Anmeldung möglich.',
    requestsEmpty: 'Noch keine Anfragen. Neuen Standort über den Button unten anfragen.',
    requestPending: 'Ausstehend',
    requestApproved: 'Genehmigt',
    requestDenied: 'Abgelehnt',
    requestSent: 'Anfrage gesendet',
    requestSheetTitle: 'Neuen Scan-Standort anfragen',
    requestName: 'Name',
    requestNamePlaceholder: 'z.B. Mein Heimatort',
    requestAddress: 'Adresse oder Ort',
    requestAddressPlaceholder: 'Adresse oder Ort suchen…',
    requestWhy: 'Begründung (optional)',
    requestWhyPlaceholder: 'Warum sollte hier gescannt werden?',
    requestSubmit: 'Anfrage senden',
    requestCancel: 'Abbrechen',
    requestSending: 'Wird gesendet…',
    requestFailed: 'Anfrage fehlgeschlagen',
    requestNameRequired: 'Bitte einen Namen eingeben.',
    requestLocationRequired: 'Bitte einen Ort auf der Karte wählen.',
    requestTooMany: 'Zu viele offene Anfragen. Warte bitte auf Bearbeitung.',
    requestDeniedReason: 'Begründung',
    requestSearchNoResults: 'Keine Treffer',
    searchHere: 'Hier suchen',
    searchingHere: 'Suche läuft…',
    scanConfirm: 'Scannen',
    scanCancel: 'Abbrechen',
    noStationsHere: 'Keine Tankstellen in der Nähe gefunden.',
    stationNotScanned: 'Diese Tankstelle wird aktuell nicht regelmäßig erfasst.',
    stationNotScannedHint: 'Du kannst einen Scan-Standort dafür in den Einstellungen anfragen.',
    requestScanLocation: 'Standort anfragen',
    historyAccumulating: 'Noch keine Preisverlaufsdaten – sammelt sich mit der Zeit.',
    noRecent24h: 'Keine Preisdaten in den letzten 24 Stunden.',
    noRecent7d: 'Keine Preisdaten in den letzten 7 Tagen.',
    noRecentRange: 'Keine Preisdaten in den letzten {days} Tagen.',
    manualScanLabel: 'Manuell gescannt',
    manualScanExpiresIn: 'läuft in',
    manualScanExpiresSuffix: 'ab',
    refreshNearby: 'Umgebung neu scannen',
    historyDefault: 'PREISVERLAUF',
    historyDefaultLabel: 'Standard-Ansicht',
    historyDefault24h: '24 Stunden',
    historyDefault7d: '7 Tage',
    alreadyCovered: 'Bereits durch einen Scan-Standort abgedeckt – nicht nötig.',
    favouritesToggleTitle: 'Favoriten oben anzeigen',
    groupByPriceTitle: 'Pro Preis nur die nächste Tankstelle',
    favouritesEmpty: 'Noch keine Favoriten – Tippe auf den Stern bei einer Tankstelle.',
    favouritesLoginRequired: 'Bitte einloggen, um Favoriten zu sehen.',
    routePlan: 'Entlang der Route suchen',
    routeStartPlaceholder: 'Start (aktueller Standort)',
    routeDestPlaceholder: 'Ziel',
    routeCurrentLocation: 'Aktueller Standort',
    routeGo: 'Route finden',
    cancel: 'Abbrechen',
    routeLoading: 'Route wird berechnet…',
    routeLoginRequired: 'Bitte einloggen, um die Routenplanung zu nutzen.',
    routeNoOrs: 'Routenplanung nicht konfiguriert. Bitte Admin um einen ORS-Key bitten.',
    routeNoRoute: 'Route konnte nicht berechnet werden.',
    routeNoStart: 'Bitte einen Startpunkt angeben.',
    routeNoDest: 'Bitte ein Ziel angeben.',
    routeNoStations: 'Keine Tankstellen entlang der Route gefunden.',
    routeExit: 'Route beenden',
    routeSummary: (km, min, count) => `${km.toFixed(0)} km · ${formatDuration(min)} · ${count} Tankstellen`,
  },
  en: {
    tabMap: 'Map',
    tabHistory: 'History',
    tabSettings: 'Settings',
    myLocation: 'My Location',
    loadingStations: 'Loading stations…',
    noOpenStations: 'No open gas stations found',
    showAll: 'Show all',
    noStationsYet: 'No gas stations found nearby',
    errorLoading: '❌ Error loading',
    pricesStale: 'Prices may be outdated (API unreachable)',
    pricesStaleConnection: 'Prices may be outdated (connection error)',
    open: 'Open',
    closed: 'Closed',
    closesAt: 'closes at',
    opensAt: 'opens at',
    open24h: 'Open 24 hours',
    openingHours: 'Opening hours',
    kmAway: 'km away',
    dayAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timePeriod: 'TIME PERIOD',
    countryDE: 'Germany',
    countryAT: 'Austria',
    days7: '7 Days',
    days14: '14 Days',
    days30: '30 Days',
    all: 'All',
    tapForHours: 'Tap for hourly detail',
    summary: 'SUMMARY',
    lowestPrice: 'Lowest Price',
    highestPrice: 'Highest Price',
    unknown: 'Unknown',
    currentAvg: 'Current Avg',
    vsLastWeek: 'vs. last week',
    vsLastMonth: 'vs. last month',
    noStats: 'No statistics available',
    avgPrice: 'Average Price',
    lowest: 'Lowest',
    highest: 'Highest',
    measurements: 'Measurements',
    bestTimes: 'BEST REFUELING TIMES',
    cheapestDay: 'Cheapest Day',
    cheapestHour: 'Cheapest Hour',
    weekdays: 'WEEKDAYS',
    hourRanking: 'HOURS',
    stationRanking: 'STATION RANKING',
    priceSpread: 'PRICE SPREAD',
    vsWorst: 'saved',
    periodLastDays: 'Last {n} days',
    periodSince: 'Since {date}',
    periodToday: 'Today',
    locationAutoPicked: 'Auto · nearest location',
    historyTooltipHint: 'Tap for hourly view',
    historyAvgLabel: 'avg',
    historyHighLabel: 'high',
    historyHourTitle: 'Hourly view',
    closeHourView: 'Close',
    oclock: '',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    fuelType: 'FUEL TYPE',
    location: 'LOCATION',
    priceAlert: 'PRICE ALERT',
    notification: 'Notification',
    alertBackgroundHint: 'Runs in the background, even when the app is closed.',
    alertStatusInactive: 'Not active yet',
    alertStatusArmed: 'Active · monitoring in the background',
    alertStatusBelow: 'Currently below threshold',
    alertStatusLastFiredFmt: 'Last notified {when} at {price}',
    alertStatusCheapestFmt: 'Currently cheapest price: {price}',
    alertJustNow: 'just now',
    alertMinutesAgoFmt: '{n} min ago',
    alertHoursAgoFmt: '{n} h ago',
    alertDaysAgoFmt: '{n} d ago',
    notificationChannel: 'Notification Channel',
    ntfyTopicPlaceholder: 'ntfy Topic (e.g. my-fuel-alert)',
    ntfyHint: 'Install the <a href="https://ntfy.sh" target="_blank" rel="noopener" style="color:var(--color-accent)">ntfy app</a> and subscribe to your topic.',
    threshold: 'Threshold',
    saveAlarm: 'Save Alert',
    sendTestNotification: 'Send Test Notification',
    appearance: 'APPEARANCE',
    appearanceLabel: 'Appearance',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'LANGUAGE',
    languageLabel: 'Language',
    about: 'ABOUT',
    versionLabel: 'Version',
    viewOnGithub: 'View on GitHub',
    contributors: 'Contributors',
    ownerRole: 'Creator & Maintainer',
    syncedSetting: 'Synced across devices',
    cloudSyncHint: 'Sign in for Cloud Sync to sync settings across devices',
    madeWith: 'Made with',
    madeIn: 'in Germany',
    currentCheapest: 'Current cheapest price',
    notLoggedIn: 'Not logged in',
    loginSubline: 'Login optional, to sync your settings.',
    loggedIn: 'Logged in',
    connectedWith: 'Connected via',
    loginWith: 'Login with',
    configureOidc: 'Configure OIDC in admin panel at /admin.',
    loggedOut: 'Logged out',
    alertActive: 'Alert active: Notification below',
    saved: 'Saved',
    alertSetMsg: 'Alert set. I\'ll notify you when',
    under: 'drops below',
    alertFailed: 'Alert failed',
    serverError: 'Server error.',
    deleteFailed: 'Failed to delete alert',
    deleteError: 'Nope.',
    enterNtfyTopic: 'Please enter an ntfy topic.',
    enterEmail: 'Please enter an email address.',
    emailPlaceholder: 'Email address',
    emailHint: 'Price alerts will be sent to this address.',
    testAlertTitle: 'Tanken - Test Alert!',
    testAlertBody: 'This is a test notification.',
    testSentNtfy: 'Test sent to ntfy!',
    testSentEmail: 'Test email sent!',
    testFailed: 'Test failed',
    ntfySendFailed: 'Failed to send via ntfy.',
    emailSendFailed: 'Failed to send email.',
    priceAlertTitle: 'Tanken - Price Alert!',
    locationTitle: 'Location',
    locationError: 'Could not determine location. Please allow permission.',
    searchPlaceholder: 'Search station or location…',
    locationBanner: 'Could not determine location. Please search for a location.',
    noSearchResults: 'No results',
    pwaTitle: 'Install Tanken',
    pwaDesc: 'Add Tanken to your home screen for faster access and an app-like experience.',
    pwaAndroid1: 'Tap the <strong>three-dot menu</strong> in the top right',
    pwaAndroid2: 'Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>',
    pwaAndroid3: 'Confirm with <strong>"Install"</strong>',
    pwaIos1: 'Tap the <strong>Share icon</strong> in the Safari toolbar',
    pwaIos2: 'Scroll and select <strong>"Add to Home Screen"</strong>',
    pwaIos3: 'Tap <strong>"Add"</strong> in the top right',
    pwaWin1: 'Click the <strong>Install icon</strong> in the address bar',
    pwaWin2: 'Confirm with <strong>"Install"</strong>',
    pwaWin3: 'Optional: <strong>Pin to taskbar</strong> for quick access',
    historyTitle: 'Price history',
    historyDescription: 'How prices have moved recently.',
    statsTitle: 'Statistics',
    statsDescription: 'When and where fuel is cheapest.',
    settingsTitle: 'Settings',
    settingsDescription: 'Your app preferences and account.',
    feloId: 'FELO ID',
    aboutTagline: 'Fuel prices at a glance.',
    priceHistory: 'PRICE HISTORY',
    areaHistory: 'Area price trend',
    noHistory: 'No history available',
    sheet24h: '24h',
    sheet7d: '7 Days',
    sortPrice: 'Price',
    sortDistance: 'Distance',
    stationsFound: 'Stations',
    alongRoute: 'along the route',
    addFavourite: 'Add to favourites',
    removeFavourite: 'Remove from favourites',
    maxFavourites: 'Maximum number of favourites reached',
    loginRequiredFavourite: 'Please log in to save favourites',
    favouriteFailed: 'Could not save favourite',
    syncFailed: 'Sync failed – setting saved on this device only',
    sheetExpand: 'Expand',
    sheetCollapse: 'Collapse',
    retry: 'Retry',
    appUpdated: 'App updated to the latest version',
    share: 'Share',
    copied: 'Copied to clipboard',
    shareFailed: 'Sharing not available',
    favouritesOnlyTitle: 'Show favourites only',
    noFavouritesHere: 'No favourites in this area',
    clearSearch: 'Clear search',
    closeBanner: 'Dismiss banner',
    pricesFallback: 'No scanned stations nearby – results from a distant measuring point',
    lastUpdated: 'Last updated',
    minutesAgoFmt: '{n} min ago',
    hoursAgoFmt: '{n} h ago',
    justNow: 'just now',
    unknownLocation: 'Unknown location',
    // Scan locations
    scanLocations: 'SCAN LOCATIONS',
    historyLocations: 'LOCATIONS WITH HISTORY DATA',
    historyLocationsHint: 'We collect daily prices for these locations so you can see trends on the history charts. For the current price you can search any location on the map at any time.',
    historyLocationsEmpty: 'No locations with history data yet.',
    historyLocSummary: 'Prices are collected at {n} locations – {parts}.',
    historyLocRadius: '{n} km radius',
    historyLocToggleAria: 'Expand/collapse location list',
    historyLocTotalLabel: 'Locations',
    historyLocShowOnMap: 'Show on map',
    historyLocOpenOnMap: 'Open on map',
    historyLocClose: 'Close',
    shortcuts: 'KEYBOARD SHORTCUTS',
    shortcutsHint: 'Tap a shortcut and press the desired key combination. Backspace clears it. Applies on this device only.',
    shortcutsReset: 'Reset to defaults',
    shortcutRecording: 'Press a key…',
    shortcutNone: 'None',
    scFocusSearch: 'Focus search',
    scMyLocation: 'Go to my location',
    scSearchHere: 'Search here',
    scToggleTheme: 'Toggle theme',
    themeLabel: 'Theme',
    themeAuto: 'Auto',
    myRequests: 'MY REQUESTS',
    requestLocation: 'Request location',
    requestsLoginHint: 'Sign in with FeloID to request new scan locations.',
    requestsOidcOnly: 'Location requests require a FeloID login.',
    requestsEmpty: 'No requests yet. Tap the button below to request a new location.',
    requestPending: 'Pending',
    requestApproved: 'Approved',
    requestDenied: 'Denied',
    requestSent: 'Request sent',
    requestSheetTitle: 'Request a new scan location',
    requestName: 'Name',
    requestNamePlaceholder: 'e.g. My hometown',
    requestAddress: 'Address or place',
    requestAddressPlaceholder: 'Search address or place…',
    requestWhy: 'Reason (optional)',
    requestWhyPlaceholder: 'Why should this area be scanned?',
    requestSubmit: 'Send request',
    requestCancel: 'Cancel',
    requestSending: 'Sending…',
    requestFailed: 'Request failed',
    requestNameRequired: 'Please enter a name.',
    requestLocationRequired: 'Please pick a location on the map.',
    requestTooMany: 'Too many pending requests. Please wait for review.',
    requestDeniedReason: 'Reason',
    requestSearchNoResults: 'No matches',
    searchHere: 'Search here',
    searchingHere: 'Searching…',
    scanConfirm: 'Scan',
    scanCancel: 'Cancel',
    noStationsHere: 'No petrol stations nearby.',
    stationNotScanned: 'This station isn\'t scanned regularly yet.',
    stationNotScannedHint: 'You can request a scan location for it from the settings.',
    requestScanLocation: 'Request location',
    historyAccumulating: 'No price history yet – it builds up over time.',
    noRecent24h: 'No price data in the last 24 hours.',
    noRecent7d: 'No price data in the last 7 days.',
    noRecentRange: 'No price data in the last {days} days.',
    manualScanLabel: 'Manually scanned',
    manualScanExpiresIn: 'expires in',
    manualScanExpiresSuffix: '',
    refreshNearby: 'Rescan nearby',
    historyDefault: 'PRICE HISTORY',
    historyDefaultLabel: 'Default range',
    historyDefault24h: '24 hours',
    historyDefault7d: '7 days',
    alreadyCovered: 'Already covered by a scan location – no scan needed.',
    favouritesToggleTitle: 'Pin favourites to top',
    groupByPriceTitle: 'One station per price (closest)',
    favouritesEmpty: 'No favourites yet – tap the star on a station.',
    favouritesLoginRequired: 'Please log in to see your favourites.',
    routePlan: 'Search along route',
    routeStartPlaceholder: 'Start (current location)',
    routeDestPlaceholder: 'Destination',
    routeCurrentLocation: 'Current location',
    routeGo: 'Find route',
    cancel: 'Cancel',
    routeLoading: 'Calculating route…',
    routeLoginRequired: 'Please log in to use route planning.',
    routeNoOrs: 'Route planning not configured. Ask the admin for an ORS key.',
    routeNoRoute: 'Could not calculate route.',
    routeNoStart: 'Please enter a start point.',
    routeNoDest: 'Please enter a destination.',
    routeNoStations: 'No stations found along the route.',
    routeExit: 'Exit route',
    routeSummary: (km, min, count) => `${km.toFixed(0)} km · ${formatDuration(min)} · ${count} stations`,
  }
};

function detectLanguage() {
  try {
    const saved = JSON.parse(localStorage.getItem('tank_settings') || '{}').lang;
    if (saved === 'de' || saved === 'en') return saved;
  } catch {}
  const browserLang = (navigator.language || '').slice(0, 2);
  return browserLang === 'en' ? 'en' : 'de';
}

function t(key) {
  const lang = i18n[state.lang];
  if (lang && key in lang) return lang[key];
  if (key in i18n.de) return i18n.de[key];
  return key;
}

function isDarkTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getTileConfig() {
  const baseOptions = { maxZoom: 19, attribution: '© OpenStreetMap · CARTO', subdomains: 'abcd' };
  if (isDarkTheme()) {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      options: baseOptions,
      className: 'map-tiles-dark',
    };
  }
  return {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: baseOptions,
  };
}

function refreshMapTiles() {
  if (!state.map) return;
  const cfg = getTileConfig();
  if (state.tileLayer) {
    try { state.map.removeLayer(state.tileLayer); } catch {}
  }
  state.tileLayer = L.tileLayer(cfg.url, {
    ...cfg.options,
    className: cfg.className || '',
  }).addTo(state.map);
  refreshCoverageMaskStyle();
}

// Translucent gray polygon covering the world with cut-outs for DE and AT,
// signalling that those are the only countries the app currently covers.
function getCoverageMaskStyle() {
  const dark = isDarkTheme();
  return {
    color: 'transparent',
    weight: 0,
    fill: true,
    fillColor: dark ? '#000000' : '#1f2937',
    fillOpacity: dark ? 0.55 : 0.38,
    interactive: false,
  };
}

function ensureCoverageMask() {
  if (!state.map || state.coverageMask) return;
  const outlines = window.COVERAGE_OUTLINES;
  if (!outlines || !Array.isArray(outlines.de) || !Array.isArray(outlines.at)) return;
  // Outer ring: a generous world rectangle. Subsequent rings act as holes.
  // outlines.de / .at are arrays of rings (a country may consist of multiple
  // polygons such as German offshore islands).
  const worldRing = [
    [-85, -180],
    [-85, 180],
    [85, 180],
    [85, -180],
  ];
  const rings = [worldRing, ...outlines.de, ...outlines.at];
  state.coverageMask = L.polygon(rings, getCoverageMaskStyle()).addTo(state.map);
}

function refreshCoverageMaskStyle() {
  if (!state.coverageMask) return;
  try { state.coverageMask.setStyle(getCoverageMaskStyle()); } catch {}
}

function applyLanguage() {
  document.documentElement.lang = state.lang;

  // data-i18n → textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // data-i18n-html → innerHTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  // data-i18n-title → title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  // data-i18n-placeholder → placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // data-i18n-aria-label → aria-label attribute
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
  });

  // ntfy hint (has HTML with link)
  const ntfyHint = document.getElementById('alert-ntfy-hint');
  if (ntfyHint) ntfyHint.innerHTML = t('ntfyHint');

  // Update select values
  const langSelect = document.getElementById('lang-picker');
  if (langSelect) langSelect.value = state.lang;

  // Translate theme option labels
  document.querySelectorAll('[data-i18n-option]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n-option'));
  });

  // Search-here button is rendered dynamically (cooldown / confirm state),
  // so keep its label in sync when the language toggles.
  const searchBtn = document.getElementById('btn-search-here');
  if (searchBtn && !searchBtn.disabled) {
    if (state._scanPicker) setSearchBtnConfirm(searchBtn);
    else setSearchBtnIdle(searchBtn);
  }
  const cancelBtn = document.getElementById('btn-scan-cancel');
  if (cancelBtn) cancelBtn.setAttribute('aria-label', t('scanCancel'));
  // JS-built lists using t() don't carry data-i18n, so refresh them by hand.
  renderShortcutsList();
}

const state = {
  config: null,
  stations: [],
  history: [],
  stats: null,
  // Signature (country|location) of the params the currently-rendered
  // history/stats reflect. Lets a plain tab switch reuse the cached render
  // instead of re-fetching and replaying the entrance animation.
  statsKey: null,
  historyKey: null,
  fuelType: 'diesel',
  radiusKm: 25,
  activeLocation: 'gps',
  userLat: null,
  userLng: null,
  currentTab: 'map',
  tabOrder: ['map', 'history', 'stats', 'settings'],
  map: null,
  markers: [],
  clusterGroup: null,
  userMarker: null,
  chart: null,
  hourChart: null,
  sheetChart: null,
  sheetExpanded: false,
  stationSort: 'price',
  historyDays: 7,
  // Default range for the per-station price chart (1 = 24 h, 7 = 7 days).
  historyDefaultDays: 7,
  theme: 'auto',
  lang: detectLanguage(),
  activeCountry: null,
  viewCountry: null,
  // Manual override for activeCountry. When set ('de' | 'at'), wins over the
  // GPS-pin-based default. Persisted in localStorage so the user's pick
  // survives reloads.
  manualCountry: (() => {
    try {
      const v = localStorage.getItem('tank_country');
      return v === 'de' || v === 'at' ? v : null;
    } catch { return null; }
  })(),
  manualScans: [],
  favouritesOnTop: false,
  favouritesOnly: false,
  groupByPrice: true,
  loaded: { map: false, history: false, stats: false, settings: false },
  toastTimer: null,
  me: null,
  user: null,
  alertChannel: 'ntfy',
  alertNtfyTopic: '',
  alertEmail: '',
  smtpConfigured: false,
  alertNotified: false,
  selectedLocation: '',
  // True once the user has explicitly changed the location dropdown
  // (history/stats). While false, the picker auto-defaults to the
  // scan location nearest to the user's GPS pin. Reset on country
  // switch so the auto-pick kicks back in for the new country.
  locationPickerTouched: false,
  availableLocations: [],
  priceExtremes: null,
  // Regional 24h percentile band: { fuel, band: {p10,p50,p90,samples}|null, key }.
  // `key` is the snapped-anchor cache key so loadPriceBand can short-circuit
  // when the map only pans within the same cell. Single source of truth for
  // heatmap colors — when no band is available, stations render in a neutral
  // gray rather than against a misleading anchor.
  priceBand: { fuel: null, band: null, key: null },
  favourites: [],
  // ── Route planner ────────────────────────────────────────────────
  routeMode: false,         // true while a route is being displayed
  routeLayer: null,         // Leaflet polyline
  routeStart: null,         // { lat, lng, label }
  routeDest: null,          // { lat, lng, label }
  routeStartMarker: null,
  routeDestMarker: null,
  routeSummary: null,       // { distanceKm, durationMin, count }
  routeScanMarkers: null,   // Leaflet markers at scan points (yellow dots)
  routeScanRunId: 0,        // guard against overlapping scan loops
  _stationsBeforeRoute: null,
};

const localSettingsKey = 'tank_settings';

const _WebHaptics = typeof WebHapticsModule !== 'undefined' ? WebHapticsModule.WebHaptics : (typeof WebHaptics !== 'undefined' ? WebHaptics : null);
const _haptics = _WebHaptics ? new _WebHaptics() : null;

const haptic = (type = 'light') => {
  try {
    if (_haptics) {
      _haptics.trigger(type === 'selection'
        ? [{ duration: 12, intensity: 0.6 }]
        : type);
      return;
    }
    if (navigator.vibrate) {
      const patterns = { success: [20, 30, 20], medium: [18], heavy: [25], selection: [10], light: [12], warning: [15, 30, 15], error: [25, 20, 25, 20, 25] };
      navigator.vibrate(patterns[type] || [12]);
    }
  } catch {}
};

// Reusable SVG path data for confetti and decorative glyphs. Keeping them
// in one place means a confetti burst exactly mirrors the icon it spawns
// from (price tag → tag-shaped pieces, calendar → calendar pieces, …).
const ICON_PATHS = {
  priceTag: '<path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>',
  trendDown: '<path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>',
  trendUp: '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>',
  chart: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
  calendar: '<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>',
  clock: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  star: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  fuel: '<path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
  heart: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  cloud: '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>',
};

// Fun "confetti" burst. Spawns N small SVG particles at (originX, originY),
// each with random initial velocity, rotation, and scale. Particles obey a
// crude gravity + drag model and fade out. Cleans itself up after ~1.2s.
function spawnConfetti(originX, originY, svgInner, opts = {}) {
  const count = opts.count ?? 26;
  const colors = opts.colors ?? ['#34c759', '#007aff', '#ff9500', '#ffcc00', '#af52de', '#ff3b30'];
  const size = opts.size ?? 18;
  const fixedColor = opts.fixedColor;

  const container = document.createElement('div');
  container.className = 'confetti-burst';
  document.body.appendChild(container);

  const particles = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const color = fixedColor || colors[i % colors.length];
    if (opts.imgSrc) {
      el.innerHTML = `<img src="${opts.imgSrc}" width="${size}" height="${size}" alt="" style="display:block;border-radius:${opts.imgRadius || 0}px" draggable="false" />`;
    } else {
      el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}">${svgInner}</svg>`;
    }
    el.style.left = originX + 'px';
    el.style.top = originY + 'px';
    container.appendChild(el);
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const speed = 240 + Math.random() * 320;
    particles.push({
      el, x: 0, y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * 360,
      rotVel: (Math.random() - 0.5) * 480,
      scale: 0.65 + Math.random() * 0.55
    });
  }

  const start = performance.now();
  const dur = 1900;
  let lastT = start;
  function frame(now) {
    const elapsed = now - start;
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (elapsed > dur) { container.remove(); return; }
    const t = elapsed / dur;
    const opacity = t < 0.72 ? 1 : 1 - (t - 0.72) / 0.28;
    for (const p of particles) {
      p.vy += 800 * dt;
      p.vx *= 0.985;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.rotVel * dt;
      p.el.style.transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;
      p.el.style.opacity = opacity.toFixed(3);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// Wire up an element so that clicking it triggers a confetti burst from its
// centre, a haptic tap, and a brief scale-pop animation on the element.
function attachConfetti(el, svgInner, opts = {}) {
  if (!el || el._confettiAttached) return;
  el._confettiAttached = true;
  el.classList.add('confetti-trigger');
  el.addEventListener('click', (e) => {
    if (opts.stopPropagation !== false) e.stopPropagation();
    haptic('light');
    const r = el.getBoundingClientRect();
    spawnConfetti(r.left + r.width / 2, r.top + r.height / 2, svgInner, opts);
    el.classList.remove('confetti-pop');
    void el.offsetWidth;
    el.classList.add('confetti-pop');
  });
}

// Replace the native <select> with a custom dropdown on desktop only.
// Native browser selects look out of place against the rest of the UI;
// on touch we keep them because the OS picker is the right affordance.
// The native element stays in the DOM as the source of truth — we mirror
// the value back and re-dispatch a `change` event, so existing listeners
// keep working without any other changes.
function enhanceSelectForDesktop(select) {
  if (!select || select._dropdownEnhanced) return;
  if (!window.matchMedia || !window.matchMedia('(min-width: 900px)').matches) return;
  select._dropdownEnhanced = true;

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  wrapper.appendChild(trigger);

  const panel = document.createElement('div');
  panel.className = 'custom-select-panel';
  panel.setAttribute('role', 'listbox');
  wrapper.appendChild(panel);

  let optionEls = [];

  function refresh() {
    const selected = select.options[select.selectedIndex];
    trigger.innerHTML = `
      <span class="custom-select-value">${selected ? selected.textContent : ''}</span>
      <svg class="custom-select-caret" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
    `;
    panel.innerHTML = '';
    optionEls = Array.from(select.options).map((opt) => {
      const item = document.createElement('div');
      item.className = 'custom-select-option' + (opt.selected ? ' selected' : '');
      item.textContent = opt.textContent;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      item.dataset.value = opt.value;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (select.value !== opt.value) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        close();
      });
      panel.appendChild(item);
      return item;
    });
  }

  let onDocClick = null;
  let onKeydown = null;

  function open() {
    if (wrapper.classList.contains('open')) return;
    wrapper.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    onDocClick = (e) => { if (!wrapper.contains(e.target)) close(); };
    onKeydown = (e) => {
      if (e.key === 'Escape') { close(); trigger.focus(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = optionEls;
        const currentIdx = items.findIndex(it => it.dataset.value === select.value);
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        const next = items[Math.max(0, Math.min(items.length - 1, currentIdx + delta))];
        if (next) next.click();
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    if (!wrapper.classList.contains('open')) return;
    wrapper.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    if (onDocClick) document.removeEventListener('click', onDocClick);
    if (onKeydown) document.removeEventListener('keydown', onKeydown);
    onDocClick = null;
    onKeydown = null;
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (wrapper.classList.contains('open')) close(); else open();
  });

  // Re-mirror when the underlying select changes (e.g. external code
  // assigns a value programmatically, or option list is rebuilt).
  select.addEventListener('change', refresh);
  const mo = new MutationObserver(refresh);
  mo.observe(select, { childList: true, subtree: true, characterData: true });

  refresh();
}

// Pop a small floating chip above (x, y) that fades in, holds, then fades
// out. Useful for tiny tap targets like the hour heatmap cells where the
// value can't fit inside the element itself.
function showFloatingValue(originX, originY, text, color) {
  const el = document.createElement('div');
  el.className = 'floating-value';
  el.textContent = text;
  el.style.left = originX + 'px';
  el.style.top = originY + 'px';
  if (color) el.style.color = color;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 260);
  }, 1100);
}

async function init() {
  state.config = await api('/api/config');
  state.fuelType = state.config.fuel_type;
  state.radiusKm = 25;
  state.smtpConfigured = !!state.config.smtpConfigured;

  // The regional band needs a map centre to anchor against, so the first
  // fetch is triggered by loadStationsAroundCenter once the map is up.

  await refreshMe();
  await loadSettings();

  // Restore manual-scan results that haven't expired yet so the markers
  // come back after a refresh.
  state.manualScans = loadStoredManualScans();
  // Pull in any active scans from the shared backend cache so a peer's
  // recent scan saves us a Tankerkönig request. Then poll every minute.
  syncManualScansFromServer({ rerender: false });
  setInterval(() => syncManualScansFromServer(), 60 * 1000);
  // Drop and re-render every 30 s so countdowns never overshoot their TTL.
  setInterval(() => {
    if (pruneManualScans() && state.map) {
      renderStationsOnMap(state.stations || [], { skipFitBounds: true, skipRadiusFilter: true });
      renderStationList(state.stations || []);
    }
  }, 30 * 1000);

  applyLanguage();
  setupTabs();
  setupSettings();
  setupTheme();
  setupLangPicker();
  setupHistoryDefaultPicker();
  setupShortcuts();
  setupMyLocationBtn();
  setupFavouritesToggle();
  setupFavouritesOnlyToggle();
  setupGroupByPriceToggle();
  setupAccountUi();
  setupStationSort();
  setupPullToRefresh();
  setupUserRequests();
  initLocation();
  renderUserRequests();
  renderHistoryLocations();
  showAppVersion();
}

function showAppVersion() {
  // The RUNNING build's version from /api/config — not GitHub's latest
  // release, which said nothing about the code actually being served
  // (and cost a third-party API request on every load).
  const version = state.config?.version;
  if (version) {
    const el = document.getElementById('app-version');
    if (el) el.textContent = `v${version}`;
  }
}


async function refreshMe() {
  try {
    const me = await api('/api/me');
    state.me = me;
    state.user = me.user || null;
    state.favourites = state.user?.favourites || [];
    document.body.classList.toggle('logged-in', !!state.user);
  } catch {
    state.me = null;
    state.user = null;
    state.favourites = [];
    document.body.classList.remove('logged-in');
  }
}

// Single source of truth for the favourites-only filter so the station
// list and the map markers can never diverge.
function isFavouritesOnlyActive() {
  return !!(state.favouritesOnly && state.user);
}

function applyFavouritesOnlyFilter(stations) {
  if (!isFavouritesOnlyActive()) return stations;
  return stations.filter(s => s.id && state.favourites.includes(s.id));
}

async function toggleFavourite(stationId) {
  if (!state.user) {
    showToast(t('loginRequiredFavourite'));
    return;
  }
  const isFav = state.favourites.includes(stationId);
  if (isFav) {
    state.favourites = state.favourites.filter(id => id !== stationId);
  } else {
    if (state.favourites.length >= 50) {
      showToast(t('maxFavourites'));
      return;
    }
    state.favourites.push(stationId);
  }
  haptic('light');
  updateFavouriteButton(stationId, !isFav);
  try {
    await api('/api/favourites', {
      method: isFav ? 'DELETE' : 'POST',
      body: JSON.stringify({ stationId })
    });
  } catch {
    // Roll back the optimistic update so the star reflects the server state
    if (isFav) {
      state.favourites.push(stationId);
    } else {
      state.favourites = state.favourites.filter(id => id !== stationId);
    }
    updateFavouriteButton(stationId, isFav);
    showToast(t('favouriteFailed'));
  }
}

function updateFavouriteButton(stationId, isFav) {
  // Animate the fav button in the sheet (detail view)
  document.querySelectorAll(`.fav-btn[data-station-id="${stationId}"]`).forEach(btn => {
    btn.classList.toggle('active', isFav);
    btn.setAttribute('aria-label', isFav ? t('removeFavourite') : t('addFavourite'));
    btn.classList.remove('anim-pop', 'anim-unpop');

    // Remove old sparkle elements
    btn.querySelectorAll('.fav-sparkles, .fav-sparkle-ring').forEach(el => el.remove());

    void btn.offsetWidth; // force reflow to restart animation

    if (isFav) {
      // Inject sparkle particles + ring for the sparkle animation
      const sparkles = document.createElement('div');
      sparkles.className = 'fav-sparkles';
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'fav-sparkle';
        sparkles.appendChild(dot);
      }
      btn.appendChild(sparkles);
      const ring = document.createElement('div');
      ring.className = 'fav-sparkle-ring';
      btn.appendChild(ring);
      btn.classList.add('anim-pop');
      btn.addEventListener('animationend', () => {
        btn.classList.remove('anim-pop');
        btn.querySelectorAll('.fav-sparkles, .fav-sparkle-ring').forEach(el => el.remove());
      }, { once: true });
    } else {
      btn.classList.add('anim-unpop');
      btn.addEventListener('animationend', () => btn.classList.remove('anim-unpop'), { once: true });
    }
  });

  // Re-render station list so favourite stars and sort order update immediately
  if (state.stations.length) {
    renderStationList(state.stations);
  }
}

function setupAccountUi() {
  const btn = document.getElementById('account-login-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (state.user) {
      await api('/api/logout', { method: 'POST' });
      state.user = null;
      document.body.classList.remove('logged-in');
      renderAccountUi();
      renderUserRequests();
      showToast(t('loggedOut'));
      return;
    }
    const redirect = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    window.location.href = `/auth/oidc/start?redirect=${redirect}`;
  });
  renderAccountUi();
}

function renderAccountUi() {
  const card = document.getElementById('account-card');
  const name = document.getElementById('account-name');
  const sub = document.getElementById('account-subline');
  const btn = document.getElementById('account-login-btn');
  const avatar = document.getElementById('account-avatar');
  const syncHint = document.getElementById('cloud-sync-hint');
  if (!name || !sub || !btn) return;
  // Placeholder SVG shown when logged out — kept here so we can swap it
  // back when the user logs out from a previously logged-in state.
  const placeholderSvg = `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" class="account-hero-avatar-placeholder"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  if (state.user) {
    if (card) card.classList.add('is-signed-in');
    name.textContent = state.user.preferred_username || state.user.displayName || t('loggedIn');
    const connectedVia = state.config?.auth?.oidcName || 'OIDC';
    sub.textContent = state.user.email || `${t('connectedWith')} ${connectedVia}`;
    btn.textContent = 'Logout';
    if (avatar) {
      if (state.user.photoUrl) {
        avatar.innerHTML = `<img src="${state.user.photoUrl}" alt="" class="account-avatar-img">`;
      } else {
        const initials = (state.user.preferred_username || state.user.displayName || '?').substring(0, 1).toUpperCase();
        avatar.innerHTML = `<div class="account-avatar-fallback">${initials}</div>`;
      }
      avatar.classList.add('visible');
    }
    // Sync is on once logged in — drop the "sign in for cloud sync" hint.
    if (syncHint) syncHint.style.display = 'none';
  } else {
    if (card) card.classList.remove('is-signed-in');
    name.textContent = t('notLoggedIn');
    const oidcName = state.config?.auth?.oidcName;
    sub.textContent = state.config?.auth?.notes?.oidc || (oidcName ? `${t('loginWith')} ${oidcName}` : t('configureOidc'));
    btn.textContent = oidcName ? `${t('loginWith')} ${oidcName}` : 'Login';
    if (avatar) {
      avatar.innerHTML = placeholderSvg;
      avatar.classList.remove('visible');
    }
    if (syncHint) syncHint.style.display = '';
  }
}

function resolvedTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  state.theme = theme;
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  // applySettingsToState funnels every settings write through here — only
  // pay for tile swaps and chart rebuilds when the visible theme actually
  // changed, not on unrelated toggles like fuel type or language.
  const resolved = resolvedTheme(theme);
  if (state._appliedResolvedTheme === resolved) return;
  state._appliedResolvedTheme = resolved;
  refreshMapTiles();
  rerenderChartsForTheme();
}

// Chart.js canvases read their colors from CSS variables once at render
// time, so a theme flip would otherwise leave stale axis/grid/gradient
// colors until the next full re-render (same pattern the language
// switcher already uses).
function rerenderChartsForTheme() {
  try {
    if (state.loaded.history && state.history.length) renderChart(state.history);
    if (state.loaded.stats && state.stats) renderStats(state.stats);
  } catch {}
}

if (typeof window !== 'undefined' && window.matchMedia) {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  // In auto mode an OS scheme flip changes the resolved theme — applyTheme
  // notices via the resolved-theme guard and refreshes tiles + charts.
  const handler = () => { if (state.theme === 'auto') applyTheme('auto'); };
  if (mql.addEventListener) mql.addEventListener('change', handler);
  else if (mql.addListener) mql.addListener(handler);
}

// Generic segmented control wiring — N buttons with data-value + a
// sliding .seg-thumb behind them. The thumb tracks the active option's
// position via offsetWidth/offsetLeft so we can use it across themes
// where the box-model varies (padding, gap). Returns a setter the
// caller can use to programmatically change the active value without
// firing the change callback.
function setupSegmentedControl(containerId, initialValue, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return () => {};
  const options = Array.from(container.querySelectorAll('.seg-option'));
  const thumb = container.querySelector('.seg-thumb');

  const moveThumb = (activeOpt) => {
    if (!activeOpt || !thumb) return;
    const w = activeOpt.offsetWidth;
    const left = activeOpt.offsetLeft;
    if (w <= 0) return; // layout not ready yet — ResizeObserver will retry
    thumb.style.width = `${w}px`;
    thumb.style.transform = `translateX(${left}px)`;
  };

  const setActive = (value, fire) => {
    let activeOpt = null;
    options.forEach((opt) => {
      const isActive = opt.dataset.value === value;
      opt.classList.toggle('active', isActive);
      opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) activeOpt = opt;
    });
    moveThumb(activeOpt);
    if (fire && onChange) onChange(value);
  };

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      haptic('light');
      setActive(opt.dataset.value, true);
    });
  });

  setActive(initialValue, false);

  // The settings tab is display:none on boot. offsetWidth is 0 until
  // it becomes visible — re-pin the thumb once layout exists.
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      const active = container.querySelector('.seg-option.active');
      if (active) moveThumb(active);
    });
    ro.observe(container);
  }

  return (value) => setActive(value, false);
}

let _themeSegSetter = null;
function setupTheme() {
  applyTheme(state.theme);
  _themeSegSetter = setupSegmentedControl('theme-seg', state.theme || 'auto', (v) => {
    applyTheme(v);
    // Theme is device-local only — don't trigger cloud sync
    saveSettingsLocal();
  });
}

function setupHistoryDefaultPicker() {
  setupSegmentedControl(
    'history-default-seg',
    String(state.historyDefaultDays || 7),
    (v) => {
      const num = parseInt(v, 10);
      persistStateSettings({ historyDefaultDays: num === 7 ? 7 : 1 });
    }
  );
}

// ─── Keyboard shortcuts ───────────────────────────────────────────────
// Device-local (two machines never share a keyboard), so they live under their
// own localStorage key instead of the cloud-synced settings blob.
const SHORTCUTS_KEY = 'tank_shortcuts';

const DEFAULT_SHORTCUTS = {
  focusSearch: 'ctrl+k',
  myLocation: 'l',
  searchHere: 'h',
  toggleTheme: 't',
};

// Order + label + behaviour for each bindable action. The array order is the
// order shown in settings; `run` is what the binding triggers.
const SHORTCUT_ACTIONS = [
  { id: 'focusSearch', labelKey: 'scFocusSearch', run: () => {
      switchTab('map');
      setTimeout(() => {
        const input = document.getElementById('map-search-input');
        if (input) { input.focus(); input.select(); }
      }, 0);
    } },
  { id: 'myLocation', labelKey: 'scMyLocation', run: () => document.getElementById('btn-my-location')?.click() },
  { id: 'searchHere', labelKey: 'scSearchHere', run: () => { switchTab('map'); document.getElementById('btn-search-here')?.click(); } },
  { id: 'toggleTheme', labelKey: 'scToggleTheme', run: () => cycleTheme() },
];

let _recordingShortcut = null;

function cycleTheme() {
  const order = ['auto', 'light', 'dark'];
  const next = order[(order.indexOf(state.theme || 'auto') + 1) % order.length];
  applyTheme(next);
  saveSettingsLocal();
  if (_themeSegSetter) _themeSegSetter(next);
  const label = next === 'auto' ? t('themeAuto') : next === 'light' ? t('themeLight') : t('themeDark');
  showToast(`${t('themeLabel')}: ${label}`);
}

// Normalised combo string from a keyboard event, e.g. "ctrl+k", "1". Ctrl and
// Cmd collapse into one "ctrl" token so a binding works on both Windows/Linux
// and macOS without separate setup.
function comboFromEvent(e) {
  const key = e.key;
  if (!key || ['Control', 'Alt', 'Shift', 'Meta', 'Dead', 'OS'].includes(key)) return null;
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push('ctrl');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  let k = key.toLowerCase();
  if (k === ' ') k = 'space';
  parts.push(k);
  return parts.join('+');
}

const SHORTCUT_KEY_LABELS = {
  ctrl: { de: 'Strg', en: 'Ctrl' },
  alt: { de: 'Alt', en: 'Alt' },
  shift: { de: 'Umschalt', en: 'Shift' },
  space: { de: 'Leertaste', en: 'Space' },
  arrowup: { de: '↑', en: '↑' }, arrowdown: { de: '↓', en: '↓' },
  arrowleft: { de: '←', en: '←' }, arrowright: { de: '→', en: '→' },
  escape: { de: 'Esc', en: 'Esc' }, enter: { de: 'Enter', en: 'Enter' },
  tab: { de: 'Tab', en: 'Tab' },
};

function comboToLabel(combo) {
  if (!combo) return t('shortcutNone');
  const lang = state.lang === 'en' ? 'en' : 'de';
  return combo.split('+').map((tok) => {
    const m = SHORTCUT_KEY_LABELS[tok];
    if (m) return m[lang];
    return tok.length === 1 ? tok.toUpperCase() : tok.charAt(0).toUpperCase() + tok.slice(1);
  }).join(' + ');
}

function loadShortcuts() {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(SHORTCUTS_KEY) || '{}') || {}; } catch {}
  const merged = {};
  for (const a of SHORTCUT_ACTIONS) {
    merged[a.id] = typeof stored[a.id] === 'string' ? stored[a.id] : DEFAULT_SHORTCUTS[a.id];
  }
  return merged;
}

function saveShortcuts() {
  try { localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(state.shortcuts)); } catch {}
}

function handleGlobalShortcut(e) {
  if (_recordingShortcut || !state.shortcuts) return;
  const combo = comboFromEvent(e);
  if (!combo) return;
  const action = SHORTCUT_ACTIONS.find((a) => state.shortcuts[a.id] && state.shortcuts[a.id] === combo);
  if (!action) return;
  const hasMod = e.ctrlKey || e.metaKey || e.altKey;
  const el = e.target;
  const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  // Plain-key shortcuts (no modifier) must not fire while the user is typing.
  if (typing && !hasMod) return;
  e.preventDefault();
  action.run();
}

function setupShortcuts() {
  state.shortcuts = loadShortcuts();
  document.addEventListener('keydown', handleGlobalShortcut);

  // The settings section is only useful where there's a real keyboard.
  const section = document.getElementById('shortcuts-section');
  const hasKeyboard = !window.matchMedia || window.matchMedia('(any-pointer: fine)').matches;
  if (section && hasKeyboard) section.hidden = false;

  renderShortcutsList();

  const resetBtn = document.getElementById('shortcuts-reset');
  if (resetBtn && !resetBtn._wired) {
    resetBtn._wired = true;
    resetBtn.addEventListener('click', () => {
      state.shortcuts = { ...DEFAULT_SHORTCUTS };
      saveShortcuts();
      renderShortcutsList();
      haptic('light');
    });
  }
}

function renderShortcutsList() {
  const list = document.getElementById('shortcuts-list');
  if (!list || !state.shortcuts) return;
  list.innerHTML = SHORTCUT_ACTIONS.map((a, i) => `
    <div class="shortcut-row" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 16px;${i ? 'border-top:1px solid var(--color-separator)' : ''}">
      <span style="font-size:14px;color:var(--color-text)">${escapeHtml(t(a.labelKey))}</span>
      <button type="button" class="shortcut-key-btn" data-action="${a.id}" style="font:inherit;font-size:12px;font-weight:600;color:var(--color-text);background:rgba(127,127,127,0.14);border:1px solid var(--color-separator);border-radius:8px;padding:5px 10px;min-width:70px;text-align:center;cursor:pointer">${escapeHtml(comboToLabel(state.shortcuts[a.id]))}</button>
    </div>`).join('');
  list.querySelectorAll('.shortcut-key-btn').forEach((btn) => {
    btn.addEventListener('click', () => startShortcutRecording(btn.dataset.action, btn));
  });
}

function startShortcutRecording(actionId, btn) {
  if (_recordingShortcut) return;
  _recordingShortcut = actionId;
  btn.textContent = t('shortcutRecording');
  btn.style.borderColor = 'var(--color-accent, #0a84ff)';
  btn.style.color = 'var(--color-accent, #0a84ff)';

  const finish = () => {
    document.removeEventListener('keydown', onRec, true);
    _recordingShortcut = null;
  };
  const onRec = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Wait until a non-modifier key is pressed so combos like Ctrl+K record.
    if (['Control', 'Alt', 'Shift', 'Meta', 'OS', 'Dead'].includes(e.key)) return;
    if (e.key === 'Escape') { finish(); renderShortcutsList(); return; } // cancel
    if (e.key === 'Backspace' || e.key === 'Delete') {
      state.shortcuts[actionId] = ''; // unbind
    } else {
      const combo = comboFromEvent(e);
      if (!combo) return;
      // Keep bindings unique — strip this combo from any other action.
      for (const a of SHORTCUT_ACTIONS) if (a.id !== actionId && state.shortcuts[a.id] === combo) state.shortcuts[a.id] = '';
      state.shortcuts[actionId] = combo;
    }
    saveShortcuts();
    finish();
    renderShortcutsList();
    haptic('light');
  };
  document.addEventListener('keydown', onRec, true);
}

function setupLangPicker() {
  const select = document.getElementById('lang-picker');
  if (!select) return;
  select.value = state.lang;
  select.addEventListener('change', () => {
    haptic('light');
    state.lang = select.value;
    applyLanguage();
    refreshMapTiles();
    renderAccountUi();
    // Re-render dynamic content if already loaded
    if (state.loaded.history && state.history.length) renderChart(state.history);
    if (state.loaded.stats && state.stats) renderStats(state.stats);
    if (state.stations.length) renderStationList(state.stations);
    updateSortButton();
    refreshAlertUi();
    persistStateSettings({ lang: state.lang });
  });
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const err = new Error(data?.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.payload = data;
    throw err;
  }

  // Expose cache status for station requests
  if (response.headers.get('X-Cache')) {
    data._cacheStatus = response.headers.get('X-Cache');
  }
  if (response.headers.get('X-Data-Timestamp')) {
    data._dataTimestamp = response.headers.get('X-Data-Timestamp');
  }

  return data;
}








// Each tab owns a URL so it can be deep-linked, reloaded and shared. The map
// tab is the home page ("/"); the others get their own path. Server-side
// rewrites (next.config.ts) map these paths back to the single app shell.
const TAB_TO_PATH = { map: '/', history: '/history', stats: '/stats', settings: '/settings' };
function pathToTab(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/map') return 'map';
  const tab = clean.slice(1);
  return TAB_TO_PATH[tab] ? tab : null;
}

function setupTabs() {
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Back/forward navigation switches tabs without pushing a new entry.
  window.addEventListener('popstate', () => {
    switchTab(pathToTab(location.pathname) || 'map', { fromPop: true });
  });

  // Prefer the URL (deep link / reload), then the last session tab, then map.
  var initialTab = pathToTab(location.pathname) || sessionStorage.getItem('currentTab') || 'map';
  switchTab(initialTab, { initial: true });
}

let _tabLoadId = 0;

// Close any open station detail surface. The map bottom-sheet and the
// stats/history detail modal share #bottom-sheet and both close on a
// backdrop click, which runs the correct per-surface teardown.
function closeOpenSheet() {
  const sheet = document.getElementById('bottom-sheet');
  if (!sheet || sheet.classList.contains('hidden')) return;
  sheet.querySelector('.bottom-sheet-backdrop')?.click();
}

function switchTab(tab, { initial = false, fromPop = false } = {}) {
  if (!initial && !fromPop && tab === state.currentTab) return;
  if (!initial && !fromPop) haptic('light');

  // A station detail sheet/modal can sit on top of any tab — close it so it
  // doesn't linger over the newly selected tab.
  closeOpenSheet();

  // Drop any hover state from the previous tab's charts — the custom
  // tooltip divs live on document.body and would otherwise hang over
  // the new tab.
  clearChartHover(state.chart, document.getElementById('history-tooltip'));
  clearChartHover(state.statsHourChart, document.getElementById('stats-hour-tooltip'));

  // Cancel any in-flight tab data load
  _tabLoadId++;

  // Immediate visual switch — no async blocking
  document.querySelectorAll('.tab-item').forEach(t => {
    const active = t.dataset.tab === tab;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + tab)?.classList.add('active');

  state.currentTab = tab;
  sessionStorage.setItem('currentTab', tab);

  // Keep the URL in sync with the active tab. popstate-driven switches must
  // not push again (the entry already exists); the initial render replaces
  // so /map normalises to / without leaving a junk history entry.
  if (!fromPop) {
    const path = TAB_TO_PATH[tab] || '/';
    if (path !== location.pathname) {
      if (initial) history.replaceState({ tab }, '', path);
      else history.pushState({ tab }, '', path);
    }
  }

  // Fire data loading in background — never blocks UI
  loadTabData(tab, _tabLoadId);
}

async function loadTabData(tab, loadId) {
  try {
    if (tab === 'map') {
      if (!state.loaded.map) await loadMapTab();
      if (state.map) setTimeout(() => state.map.invalidateSize(), 250);
    }
    if (_tabLoadId !== loadId) return; // tab changed, abort
    if (tab === 'history') {
      if (!state.loaded.history) await loadHistoryTab();
      // Same caching as stats: only re-fetch when the country/location the
      // cached chart was built for has actually changed.
      else if (state.historyKey !== currentDataKey()) {
        state.history = await fetchHistoryData();
        if (_tabLoadId === loadId) { renderChart(state.history); state.historyKey = currentDataKey(); }
      }
    }
    if (_tabLoadId !== loadId) return;
    if (tab === 'stats') {
      if (!state.loaded.stats) await loadStatsTab();
      // Already rendered for the current country/location — reuse the cached
      // DOM as-is. No re-fetch, no re-render, no animation replay, so flicking
      // between tabs stays instant and smooth.
      else if (state.statsKey !== currentDataKey()) await reloadStats();
    }
    if (_tabLoadId !== loadId) return;
    if (tab === 'settings') {
      await refreshAlertUi();
      renderUserRequests();
      renderHistoryLocations();
    }
  } catch (e) { console.error('Tab data load error:', e); }
}

function initLocation() {
  browserGeolocation();
}

// ---------------------------------------------------------------------------
// Scan-Standorte — user requests
// ---------------------------------------------------------------------------

function setupUserRequests() {
  const btn = document.getElementById('btn-request-location');
  if (btn && !btn._setup) {
    btn._setup = true;
    btn.addEventListener('click', () => {
      if (!state.user) {
        showToast(t('requestsLoginHint'));
        return;
      }
      if (state.user.authProvider !== 'oidc') {
        showToast(t('requestsOidcOnly'));
        return;
      }
      haptic('light');
      openLocationRequestSheet();
    });
  }
}

// Inline SVG flags rather than unicode flag emojis: Windows desktop renders
// the regional-indicator pairs as plain "DE"/"AT" badges, so the flag
// disappears on most desktop browsers. SVG renders consistently everywhere.
const COUNTRY_FLAGS = {
  de: '<svg class="country-flag" viewBox="0 0 5 3" width="18" height="11" aria-hidden="true"><rect width="5" height="1" fill="#000"/><rect width="5" height="1" y="1" fill="#dd0000"/><rect width="5" height="1" y="2" fill="#ffce00"/></svg>',
  at: '<svg class="country-flag" viewBox="0 0 9 6" width="16" height="11" aria-hidden="true"><rect width="9" height="6" fill="#ed2939"/><rect width="9" height="2" y="2" fill="#fff"/></svg>',
};

// Jump to the map tab and centre on a coordinate. Used by the "Standorte mit
// Verlaufsdaten" summary so a scan location can be shown on the map.
function showLocationOnMap(lat, lng, zoom = 12) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  switchTab('map');
  document.getElementById('view-map')?.scrollTo({ top: 0 });
  setTimeout(() => {
    if (state.map) {
      state.map.invalidateSize();
      state.map.flyTo([lat, lng], zoom, { duration: 0.6 });
    }
  }, 220);
}

async function renderHistoryLocations() {
  const list = document.getElementById('history-locations-list');
  if (!list) return;

  let locations = [];
  try {
    const res = await api('/api/scan-locations');
    locations = Array.isArray(res.locations) ? res.locations : [];
  } catch {
    locations = [];
  }

  if (!locations.length) {
    list.innerHTML = `<div style="padding:14px 16px;font-size:13px;color:var(--color-hint);text-align:center">${t('historyLocationsEmpty')}</div>`;
    return;
  }

  // Group by country so the breakdown and the detail list share one ordering.
  const byCountry = {};
  for (const loc of locations) (byCountry[loc.country] || (byCountry[loc.country] = [])).push(loc);
  const order = ['de', 'at', ...Object.keys(byCountry).filter((c) => c !== 'de' && c !== 'at')]
    .filter((c) => byCountry[c] && byCountry[c].length);
  const countryName = (c) => c === 'de' ? t('countryDE') : c === 'at' ? t('countryAT') : String(c).toUpperCase();

  // Per-country count chips next to the big total.
  const chips = order.map((c) =>
    `<span class="hl-chip">${COUNTRY_FLAGS[c] || ''}<span>${escapeHtml(countryName(c))}</span><b>${byCountry[c].length}</b></span>`
  ).join('');

  // Flat list in display order so each pin button resolves its location by index.
  const flat = [];
  const detailHtml = order.map((c) => {
    const rows = byCountry[c]
      .slice()
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' }))
      .map((loc) => {
        const idx = flat.push(loc) - 1;
        return `
          <div class="hl-row">
            <div style="flex:1;min-width:0">
              <div class="hl-row-name">${escapeHtml(loc.name || '')}</div>
              <div class="hl-row-sub">${t('historyLocRadius').replace('{n}', Number(loc.radiusKm) || 25)}</div>
            </div>
            <button type="button" class="hl-pin-btn" data-idx="${idx}" aria-label="${escapeHtml(t('historyLocShowOnMap'))}" title="${escapeHtml(t('historyLocShowOnMap'))}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
            </button>
          </div>`;
      }).join('');
    return `
      <div class="hl-group-header">
        <span aria-hidden="true" style="display:inline-flex;align-items:center;line-height:1">${COUNTRY_FLAGS[c] || ''}</span>
        <span style="font-size:12px;font-weight:600;letter-spacing:0.3px;color:var(--color-text)">${escapeHtml(countryName(c))}</span>
        <span style="font-size:12px;color:var(--color-hint)">· ${byCountry[c].length}</span>
      </div>
      ${rows}`;
  }).join('');

  list.innerHTML = `
    <div class="hl-summary-top" id="history-locations-toggle" role="button" tabindex="0" aria-expanded="false" aria-label="${escapeHtml(t('historyLocToggleAria'))}">
      <div class="settings-icon-chip settings-icon-accent" aria-hidden="true" style="flex-shrink:0">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:baseline;gap:8px">
          <span class="hl-total-num">${locations.length}</span>
          <span class="hl-total-label">${escapeHtml(t('historyLocTotalLabel'))}</span>
        </div>
        <div class="hl-chips" style="margin-top:8px">${chips}</div>
      </div>
      <svg class="hl-chevron" viewBox="0 0 24 24" width="20" height="20" fill="var(--color-hint)" style="flex-shrink:0;align-self:center" aria-hidden="true"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
    </div>
    <div id="history-locations-details" hidden>${detailHtml}</div>`;

  const toggle = list.querySelector('#history-locations-toggle');
  const details = list.querySelector('#history-locations-details');
  const chevron = list.querySelector('.hl-chevron');
  const doToggle = () => {
    const open = details.hidden;
    details.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (chevron) chevron.style.transform = open ? 'rotate(90deg)' : '';
    haptic('light');
  };
  if (toggle && details) {
    toggle.addEventListener('click', doToggle);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doToggle(); }
    });
  }
  // Tapping the (blue) pin opens a map popup overlay instead of leaving the
  // settings tab — the user stays where they are.
  list.querySelectorAll('.hl-pin-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loc = flat[parseInt(btn.dataset.idx, 10)];
      if (loc) showLocationMapPopup(loc);
    });
  });
}

// Map popup for a scan location — opens the bottom sheet with a small Leaflet
// map (marker + scan radius) so the location can be inspected without being
// redirected to the map tab. An explicit button still allows that jump.
function showLocationMapPopup(loc) {
  const sheet = document.getElementById('bottom-sheet');
  const body = document.getElementById('bottom-sheet-body');
  if (!sheet || !body || !loc) return;
  const lat = Number(loc.lat), lng = Number(loc.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const radiusKm = Number(loc.radiusKm) || 25;
  const countryLabel = loc.country === 'de' ? t('countryDE')
    : loc.country === 'at' ? t('countryAT')
    : loc.country ? String(loc.country).toUpperCase() : '';

  sheet.classList.remove('detail-modal', 'centered');
  body.innerHTML = `
    <div style="padding:4px 4px 16px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div class="settings-icon-chip settings-icon-accent" aria-hidden="true" style="flex-shrink:0">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:17px;font-weight:600;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(loc.name || '')}</div>
          <div style="font-size:12px;color:var(--color-hint);margin-top:1px">${t('historyLocRadius').replace('{n}', radiusKm)}${countryLabel ? ' · ' + escapeHtml(countryLabel) : ''}</div>
        </div>
      </div>
      <div id="hl-popup-map" style="width:100%;height:260px;border-radius:12px;overflow:hidden;border:1px solid var(--color-separator);margin-bottom:14px"></div>
      <div style="display:flex;gap:10px">
        <button id="hl-popup-close" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--color-separator);background:transparent;color:var(--color-text);font-size:15px;font-weight:500;cursor:pointer">${t('historyLocClose')}</button>
        <button id="hl-popup-open" style="flex:2;padding:12px;border-radius:10px;border:none;background:var(--color-accent);color:var(--color-accent-text);font-size:15px;font-weight:600;cursor:pointer">${t('historyLocOpenOnMap')}</button>
      </div>
    </div>`;

  if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }
  sheet.classList.remove('hidden');
  sheet.setAttribute('aria-hidden', 'false');
  const backdrop = sheet.querySelector('.bottom-sheet-backdrop');
  const content = sheet.querySelector('.bottom-sheet-content');
  content.style.transform = '';
  content.classList.remove('dragging', 'snapping', 'expanded');
  state.sheetExpanded = false;
  const handleArea = document.getElementById('sheet-handle-area');
  content.querySelector('.sheet-expand-btn')?.remove();

  let popupMap = null;
  const closeSheet = () => {
    if (popupMap) { try { popupMap.remove(); } catch {} popupMap = null; }
    content.style.transform = '';
    content.classList.remove('dragging', 'snapping', 'expanded');
    content.querySelector('.sheet-desktop-close')?.remove();
    backdrop.style.opacity = '';
    sheet.classList.add('hidden');
    sheet.setAttribute('aria-hidden', 'true');
    backdrop.removeEventListener('click', closeSheet);
    if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }
  };
  backdrop.addEventListener('click', closeSheet);

  if (window.matchMedia('(min-width: 900px)').matches) {
    content.querySelector('.sheet-desktop-close')?.remove();
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sheet-desktop-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeSheet);
    content.prepend(closeBtn);
  }
  setupSheetDrag(content, handleArea, backdrop, closeSheet);

  document.getElementById('hl-popup-close')?.addEventListener('click', closeSheet);
  document.getElementById('hl-popup-open')?.addEventListener('click', () => {
    closeSheet();
    showLocationOnMap(lat, lng);
  });

  const mapEl = document.getElementById('hl-popup-map');
  if (mapEl && window.L) {
    const L = window.L;
    popupMap = L.map(mapEl, { zoomControl: true, attributionControl: false, scrollWheelZoom: false }).setView([lat, lng], 11);
    const cfg = getTileConfig();
    L.tileLayer(cfg.url, { ...cfg.options, className: cfg.className || '' }).addTo(popupMap);
    L.circle([lat, lng], { radius: radiusKm * 1000, color: '#007aff', fillColor: '#007aff', fillOpacity: 0.12, weight: 2 }).addTo(popupMap);
    L.marker([lat, lng]).addTo(popupMap);
    setTimeout(() => { try { popupMap.invalidateSize(); } catch {} }, 60);
  }
}

async function renderUserRequests() {
  const card = document.getElementById('user-requests-card');
  const header = document.getElementById('user-requests-header');
  const hint = document.getElementById('user-requests-login-hint');
  const list = document.getElementById('user-requests-list');
  const btn = document.getElementById('btn-request-location');
  if (!card || !hint || !list || !btn) return;

  if (!state.user) {
    card.style.display = 'none';
    if (header) header.style.display = 'none';
    hint.style.display = '';
    hint.querySelector('span')?.setAttribute('data-i18n', 'requestsLoginHint');
    const span = hint.querySelector('span');
    if (span) span.textContent = t('requestsLoginHint');
    return;
  }
  if (state.user.authProvider !== 'oidc') {
    card.style.display = 'none';
    if (header) header.style.display = 'none';
    hint.style.display = '';
    const span = hint.querySelector('span');
    if (span) { span.setAttribute('data-i18n', 'requestsOidcOnly'); span.textContent = t('requestsOidcOnly'); }
    return;
  }
  card.style.display = '';
  hint.style.display = 'none';

  let requests = [];
  try {
    const res = await api('/api/location-requests');
    requests = Array.isArray(res.requests) ? res.requests : [];
  } catch {
    requests = [];
  }

  // Empty: hide the "MEINE ANFRAGEN" sub-header + list placeholder so the
  // settings tab isn't cluttered with empty sections. The request button
  // below stays visible so users can still create new requests.
  if (!requests.length) {
    if (header) header.style.display = 'none';
    list.innerHTML = '';
    return;
  }
  if (header) header.style.display = '';

  const badgeColors = {
    pending: { bg: 'rgba(255,159,10,0.15)', fg: '#ff9f0a' },
    approved: { bg: 'rgba(52,199,89,0.15)', fg: '#34c759' },
    denied: { bg: 'rgba(255,59,48,0.15)', fg: '#ff3b30' },
  };
  const badgeLabels = {
    pending: t('requestPending'),
    approved: t('requestApproved'),
    denied: t('requestDenied'),
  };

  list.innerHTML = requests.map((r) => {
    const color = badgeColors[r.status] || badgeColors.pending;
    const label = badgeLabels[r.status] || r.status;
    const when = r.createdAt ? new Date(r.createdAt).toLocaleDateString(state.lang === 'en' ? 'en-GB' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    const denyNote = r.status === 'denied' && r.adminNote
      ? `<div style="margin-top:6px;padding:8px 10px;border-radius:8px;background:rgba(255,59,48,0.08);color:var(--color-text);font-size:12px;line-height:1.4"><span style="color:#ff3b30;font-weight:500">${t('requestDeniedReason')}:</span> ${escapeHtml(r.adminNote)}</div>`
      : '';
    return `
      <div class="card-row" style="flex-direction:column;align-items:stretch;padding:12px 16px;gap:6px;border-bottom:1px solid var(--color-separator)">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:500;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(r.name || '')}</div>
            <div style="font-size:12px;color:var(--color-hint);margin-top:2px">${Number(r.lat).toFixed(4)}, ${Number(r.lng).toFixed(4)}${when ? ' · ' + when : ''}</div>
          </div>
          <span style="padding:3px 10px;border-radius:999px;background:${color.bg};color:${color.fg};font-size:11px;font-weight:600;letter-spacing:0.3px">${label}</span>
        </div>
        ${denyNote}
      </div>`;
  }).join('');
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function openLocationRequestSheet(opts = {}) {
  const sheet = document.getElementById('bottom-sheet');
  const body = document.getElementById('bottom-sheet-body');
  if (!sheet || !body) return;

  // Optional pre-fill: caller can pass {lat, lng, name, address} so e.g.
  // the station-detail "Anfragen" button drops the user straight onto the
  // station's coordinates with both name and address pre-populated.
  const presetLat = Number(opts.lat);
  const presetLng = Number(opts.lng);
  const presetName = typeof opts.name === 'string' ? opts.name : '';
  const presetAddress = typeof opts.address === 'string' ? opts.address : '';
  const initialLat = Number.isFinite(presetLat) ? presetLat
    : Number.isFinite(state.userLat) ? state.userLat
    : 51.1657;
  const initialLng = Number.isFinite(presetLng) ? presetLng
    : Number.isFinite(state.userLng) ? state.userLng
    : 10.4515;
  const initialRadius = 25;

  const reqState = {
    lat: initialLat,
    lng: initialLng,
    radiusKm: initialRadius,
    map: null,
    marker: null,
    circle: null,
    searchTimer: null,
    sending: false,
  };

  body.innerHTML = `
    <div style="padding:4px 4px 20px">
      <div style="font-size:18px;font-weight:600;margin-bottom:16px;color:var(--color-text)">${t('requestSheetTitle')}</div>

      <label style="display:block;font-size:12px;font-weight:500;color:var(--color-hint);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.3px">${t('requestName')}</label>
      <input id="req-name" type="text" maxlength="80" placeholder="${t('requestNamePlaceholder')}" style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--color-separator);background:var(--color-bg-secondary);color:var(--color-text);font-size:15px;margin-bottom:14px;box-sizing:border-box">

      <label style="display:block;font-size:12px;font-weight:500;color:var(--color-hint);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.3px">${t('requestAddress')}</label>
      <div style="position:relative;margin-bottom:12px">
        <input id="req-search" type="text" placeholder="${t('requestAddressPlaceholder')}" style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--color-separator);background:var(--color-bg-secondary);color:var(--color-text);font-size:15px;box-sizing:border-box">
        <div id="req-search-results" style="position:absolute;top:100%;left:0;right:0;margin-top:4px;background:var(--color-bg);border:1px solid var(--color-separator);border-radius:10px;max-height:200px;overflow-y:auto;z-index:2000;display:none;box-shadow:0 4px 16px rgba(0,0,0,0.1)"></div>
      </div>

      <div id="req-map" style="width:100%;height:240px;border-radius:10px;overflow:hidden;border:1px solid var(--color-separator);margin-bottom:14px"></div>

      <label style="display:block;font-size:12px;font-weight:500;color:var(--color-hint);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.3px">${t('requestWhy')}</label>
      <textarea id="req-note" rows="3" maxlength="500" placeholder="${t('requestWhyPlaceholder')}" style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--color-separator);background:var(--color-bg-secondary);color:var(--color-text);font-size:15px;margin-bottom:16px;box-sizing:border-box;resize:vertical;font-family:inherit"></textarea>

      <div style="display:flex;gap:10px">
        <button id="req-cancel" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--color-separator);background:transparent;color:var(--color-text);font-size:15px;font-weight:500;cursor:pointer">${t('requestCancel')}</button>
        <button id="req-submit" style="flex:2;padding:12px;border-radius:10px;border:none;background:var(--color-accent);color:var(--color-accent-text);font-size:15px;font-weight:600;cursor:pointer">${t('requestSubmit')}</button>
      </div>
    </div>
  `;

  if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }

  sheet.classList.remove('hidden');
  sheet.setAttribute('aria-hidden', 'false');
  const backdrop = sheet.querySelector('.bottom-sheet-backdrop');
  const content = sheet.querySelector('.bottom-sheet-content');
  content.style.transform = '';
  content.classList.remove('dragging', 'snapping', 'expanded');
  state.sheetExpanded = false;
  const handleArea = document.getElementById('sheet-handle-area');

  content.querySelector('.sheet-expand-btn')?.remove();
  const expandBtn = document.createElement('button');
  expandBtn.className = 'sheet-expand-btn';
  updateExpandBtnIcon(expandBtn, false);
  expandBtn.addEventListener('click', () => toggleSheetExpanded(content));
  content.appendChild(expandBtn);

  const closeSheet = () => {
    if (reqState.map) { try { reqState.map.remove(); } catch {} reqState.map = null; }
    state.sheetExpanded = false;
    content.style.transform = '';
    content.classList.remove('dragging', 'snapping', 'expanded');
    content.querySelector('.sheet-expand-btn')?.remove();
    content.querySelector('.sheet-desktop-close')?.remove();
    backdrop.style.opacity = '';
    sheet.classList.add('hidden');
    sheet.setAttribute('aria-hidden', 'true');
    backdrop.removeEventListener('click', closeSheet);
    if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }
  };
  backdrop.addEventListener('click', closeSheet);

  if (window.matchMedia('(min-width: 900px)').matches) {
    content.querySelector('.sheet-desktop-close')?.remove();
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sheet-desktop-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeSheet);
    content.prepend(closeBtn);
  }

  setupSheetDrag(content, handleArea, backdrop, closeSheet);

  document.getElementById('req-cancel').addEventListener('click', closeSheet);

  // Initialise Leaflet map
  const mapEl = document.getElementById('req-map');
  if (mapEl && window.L) {
    const L = window.L;
    const map = L.map(mapEl, { zoomControl: true, attributionControl: false }).setView([reqState.lat, reqState.lng], 11);
    const reqTileCfg = getTileConfig();
    L.tileLayer(reqTileCfg.url, {
      ...reqTileCfg.options,
      className: reqTileCfg.className || '',
    }).addTo(map);
    const marker = L.marker([reqState.lat, reqState.lng], { draggable: true }).addTo(map);
    const circle = L.circle([reqState.lat, reqState.lng], {
      radius: reqState.radiusKm * 1000,
      color: '#007aff',
      fillColor: '#007aff',
      fillOpacity: 0.12,
      weight: 2,
    }).addTo(map);
    reqState.map = map;
    reqState.marker = marker;
    reqState.circle = circle;

    marker.on('dragend', () => {
      const p = marker.getLatLng();
      reqState.lat = p.lat;
      reqState.lng = p.lng;
      circle.setLatLng(p);
    });
    map.on('click', (e) => {
      reqState.lat = e.latlng.lat;
      reqState.lng = e.latlng.lng;
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
    });

    setTimeout(() => map.invalidateSize(), 200);
  }

  // Address search
  const searchInput = document.getElementById('req-search');
  const searchResults = document.getElementById('req-search-results');
  const runSearch = async (q) => {
    if (q.length < 2) { searchResults.style.display = 'none'; searchResults.innerHTML = ''; return; }
    try {
      const res = await api(`/api/geocode?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(state.lang || 'de')}`);
      const results = Array.isArray(res.results) ? res.results : [];
      if (!results.length) {
        searchResults.innerHTML = `<div style="padding:10px 12px;font-size:13px;color:var(--color-hint)">${t('requestSearchNoResults')}</div>`;
        searchResults.style.display = '';
        return;
      }
      searchResults.innerHTML = results.map((r, i) => `
        <button type="button" data-idx="${i}" class="req-search-hit" style="display:block;width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;color:var(--color-text);font-size:13px;cursor:pointer;border-bottom:1px solid var(--color-separator);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(r.name)}</button>
      `).join('');
      searchResults.style.display = '';
      searchResults.querySelectorAll('.req-search-hit').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.idx);
          const hit = results[idx];
          if (!hit) return;
          reqState.lat = Number(hit.lat);
          reqState.lng = Number(hit.lng);
          if (reqState.marker) reqState.marker.setLatLng([reqState.lat, reqState.lng]);
          if (reqState.circle) reqState.circle.setLatLng([reqState.lat, reqState.lng]);
          if (reqState.map) reqState.map.setView([reqState.lat, reqState.lng], 12);
          searchInput.value = hit.name;
          searchResults.style.display = 'none';
        });
      });
    } catch {
      searchResults.style.display = 'none';
    }
  };
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    clearTimeout(reqState.searchTimer);
    reqState.searchTimer = setTimeout(() => runSearch(q), 400);
  });

  // Submit
  const submitBtn = document.getElementById('req-submit');
  const nameInput = document.getElementById('req-name');
  const noteInput = document.getElementById('req-note');
  if (presetName && nameInput) nameInput.value = presetName;
  if (presetAddress) {
    const addressInput = document.getElementById('req-search');
    if (addressInput) addressInput.value = presetAddress;
  }
  submitBtn.addEventListener('click', async () => {
    if (reqState.sending) return;
    const name = nameInput.value.trim();
    if (!name) { showToast(t('requestNameRequired')); nameInput.focus(); return; }
    if (!Number.isFinite(reqState.lat) || !Number.isFinite(reqState.lng)) {
      showToast(t('requestLocationRequired'));
      return;
    }
    reqState.sending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = t('requestSending');
    try {
      await api('/api/location-requests', {
        method: 'POST',
        body: JSON.stringify({
          name,
          lat: reqState.lat,
          lng: reqState.lng,
          radiusKm: reqState.radiusKm,
          note: noteInput.value.trim() || undefined,
        }),
      });
      showToast(t('requestSent'));
      closeSheet();
      renderUserRequests();
    } catch (err) {
      if (err && err.status === 429) showToast(t('requestTooMany'));
      else showToast((err && err.message) || t('requestFailed'));
      reqState.sending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = t('requestSubmit');
    }
  });
}

function browserGeolocation() {
  if (!navigator.geolocation) {
    showLocationBanner();
    return loadMapTab();
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.userLat = pos.coords.latitude;
      state.userLng = pos.coords.longitude;
      state.activeLocation = 'gps';
      document.getElementById('map-location-banner')?.classList.add('hidden');
      // If the map is already showing roughly this area (restored last
      // viewport), refresh the data in place instead of yanking the view.
      let near = false;
      if (state.map) {
        try {
          const c = state.map.getCenter();
          near = distanceKm(c.lat, c.lng, state.userLat, state.userLng) < 2;
        } catch {}
      }
      loadMapTab({ skipFitBounds: near, silent: near });
    },
    () => {
      showLocationBanner();
      loadMapTab();
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

function showLocationBanner() {
  const banner = document.getElementById('map-location-banner');
  if (!banner) return;
  banner.classList.remove('hidden');
  const closeBtn = document.getElementById('map-location-banner-close');
  if (closeBtn && !closeBtn._setup) {
    closeBtn._setup = true;
    closeBtn.addEventListener('click', () => banner.classList.add('hidden'));
  }
  setTimeout(() => banner.classList.add('hidden'), 8000);
}

// Last map viewport, persisted across sessions so a returning user's map
// opens where they left it instead of flashing the Berlin fallback and
// jumping once geolocation resolves.
const lastViewKey = 'tank_last_view';

let _storeViewTimer = null;
function storeMapView() {
  // Debounced — moveend fires for every gesture, but only the resting
  // viewport matters, so don't do synchronous localStorage writes per pan.
  clearTimeout(_storeViewTimer);
  _storeViewTimer = setTimeout(() => {
    if (!state.map) return;
    try {
      const c = state.map.getCenter();
      localStorage.setItem(lastViewKey, JSON.stringify({
        lat: Number(c.lat.toFixed(5)),
        lng: Number(c.lng.toFixed(5)),
        zoom: state.map.getZoom()
      }));
    } catch {}
  }, 600);
}

function readStoredMapView() {
  try {
    const v = JSON.parse(localStorage.getItem(lastViewKey) || 'null');
    if (v && Number.isFinite(v.lat) && Number.isFinite(v.lng)) return v;
  } catch {}
  return null;
}

function getActiveCoords() {
  if (Number.isFinite(state.userLat) && Number.isFinite(state.userLng)) {
    return { lat: state.userLat, lng: state.userLng };
  }
  // Prefer the last viewport the user actually looked at. Deliberate side
  // effect: without GPS and without an explicit country choice
  // (state.manualCountry), getActiveCountry() now follows this too — the
  // last-viewed area is a better default than always-Berlin.
  const stored = readStoredMapView();
  if (stored) return { lat: stored.lat, lng: stored.lng };
  // Fall back to Berlin (purely for the initial map view — distance
  // calculations should NOT use this).
  return { lat: 52.52, lng: 13.405 };
}

// The user's actual location (from device GPS), or null when unknown.
// Distance labels are computed from this — never from the map centre or
// from a search-bar pick, so the "X km entfernt" stays honest.
function getUserGpsCoords() {
  if (Number.isFinite(state.userLat) && Number.isFinite(state.userLng)) {
    return { lat: state.userLat, lng: state.userLng };
  }
  return null;
}

// Apply (or strip) the dist field on a list of stations using the user's
// real GPS position. When GPS is unknown, dist is removed so the UI shows
// no distance instead of a misleading number.
function withDistanceFromUser(stations) {
  if (!Array.isArray(stations)) return [];
  const gps = getUserGpsCoords();
  if (!gps) {
    return stations.map(s => {
      // eslint-disable-next-line no-unused-vars
      const { dist, distApprox, ...rest } = s;
      return rest;
    });
  }
  return stations.map(s => ({
    ...s,
    dist: distanceKm(gps.lat, gps.lng, s.lat, s.lng),
    distApprox: false,
  }));
}

// Cheap pre-filter — AT's actual bounding box. Southern Germany (Munich,
// Ulm, Augsburg, Lindau) overlaps this box, so we still need a proper
// point-in-polygon check for anything inside it.
const AT_BBOX = { south: 46.37, north: 49.02, west: 9.53, east: 17.16 };

function pointInRing(lat, lng, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][0], xi = ring[i][1];
    const yj = ring[j][0], xj = ring[j][1];
    const intersect =
      ((yi > lat) !== (yj > lat)) &&
      (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Decides whether a coordinate sits inside Austria. Uses the loaded AT
// outline (Natural Earth 10 m) if available; otherwise falls back to the
// bounding box so we don't deadlock before outlines arrive.
function isInAustria(lat, lng) {
  if (lat < AT_BBOX.south || lat > AT_BBOX.north || lng < AT_BBOX.west || lng > AT_BBOX.east) {
    return false;
  }
  const outlines = window.COVERAGE_OUTLINES;
  const rings = outlines && Array.isArray(outlines.at) ? outlines.at : null;
  if (!rings || !rings.length) {
    // Outlines haven't loaded yet — be permissive, UI will re-check on next event.
    return true;
  }
  for (const ring of rings) {
    if (pointInRing(lat, lng, ring)) return true;
  }
  return false;
}

function getActiveCountry() {
  if (state.manualCountry === 'de' || state.manualCountry === 'at') {
    return state.manualCountry;
  }
  const c = getActiveCoords();
  return isInAustria(c.lat, c.lng) ? 'at' : 'de';
}

// Sync the active class on the country chips in both the Verlauf and Stats
// tabs to match the current activeCountry. Called whenever applyCountryUi
// runs and on tab init.
function syncCountryChips() {
  const country = state.activeCountry || getActiveCountry();
  document.querySelectorAll('#history-country-chips .chip, #stats-country-chips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.country === country);
  });
}

// Attach click handlers to the country chips in a given chip-row. Idempotent:
// uses a dataset flag so re-running on the same row (e.g. on tab re-init)
// doesn't stack listeners.
function wireCountryChips(containerId) {
  const row = document.getElementById(containerId);
  if (!row || row.dataset.wired === '1') return;
  row.dataset.wired = '1';
  row.querySelectorAll('.chip[data-country]').forEach(chip => {
    chip.addEventListener('click', () => {
      haptic('light');
      setManualCountry(chip.dataset.country);
    });
  });
}

async function setManualCountry(next) {
  if (next !== 'de' && next !== 'at') return;
  if (state.manualCountry === next && state.activeCountry === next) return;
  state.manualCountry = next;
  try { localStorage.setItem('tank_country', next); } catch {}
  applyCountryUi(); // resets selectedLocation + loaded flags when country changes
  syncCountryChips();
  // Reload data for whichever country-scoped tabs the user has already opened.
  if (state.loaded.history === false) {
    // applyCountryUi cleared the loaded flag — re-init the whole tab so the
    // location picker is re-fetched for the new country.
    if (state.currentTab === 'history') await loadHistoryTab();
  }
  if (state.loaded.stats === false) {
    if (state.currentTab === 'stats') await loadStatsTab();
  }
}

// "Active" country = where the user's pin is (from GPS or last explicit
// search). Drives history/stats filtering — should NOT flip when the user
// just pans the map around.
function applyCountryUi() {
  const next = getActiveCountry();
  applyViewCountryUi(); // view-country always follows the map center
  if (state.activeCountry === next) {
    syncCountryChips();
    return;
  }
  const prev = state.activeCountry;
  state.activeCountry = next;
  document.documentElement.setAttribute('data-active-country', next);

  // Country change invalidates cached history/stats — they're country-scoped now.
  if (prev && prev !== next) {
    state.selectedLocation = '';
    state.locationPickerTouched = false;
    state.loaded.history = false;
    state.loaded.stats = false;
  }
  syncCountryChips();
}

// "View" country = whatever the map centre is currently over. Drives the
// scan button and other map-chrome UI, because the user's intent is tied
// to what they're looking at, not where their pin sits.
function applyViewCountryUi() {
  const center = state.map ? state.map.getCenter() : null;
  const next = center ? (isInAustria(center.lat, center.lng) ? 'at' : 'de')
                      : getActiveCountry();
  if (state.viewCountry === next) return;
  state.viewCountry = next;
  document.documentElement.setAttribute('data-view-country', next);

  // Entering AT view: clear DE-only affordances the user can't use anyway.
  // The cooldown timer keeps ticking silently — the button is hidden via
  // CSS in AT mode; if the user returns to DE the countdown is still
  // accurate (and survives a refresh via localStorage).
  if (next === 'at') {
    if (state._scanPicker) exitScanPickerMode();
    if (Array.isArray(state._scanQueue)) {
      state._scanQueue.forEach(item => { try { state.map.removeLayer(item.pin); } catch {} });
      state._scanQueue = [];
    }
  } else if (next === 'de') {
    // Coming back to DE: re-arm the cooldown UI from storage if the timer
    // was never started this session (or was cleared somewhere).
    if (!state._searchHereCooldownTimer) restoreSearchHereCooldown();
  }
}

function showStationSkeletons(count = 5) {
  const list = document.getElementById('station-list');
  if (!list) return;
  list.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-item">
      <div class="skeleton-bone skeleton-rank"></div>
      <div style="flex:1;min-width:0">
        <div class="skeleton-bone skeleton-text-long"></div>
        <div class="skeleton-bone skeleton-text-short"></div>
      </div>
      <div class="skeleton-bone skeleton-price"></div>
    </div>`).join('');
}

async function loadMapTab({ skipFitBounds = false, silent = false } = {}) {
  state.loaded.map = true;
  const coords = getActiveCoords();
  applyCountryUi();

  if (!state.map) {
    // Restore the last session's zoom when the view comes from storage.
    const storedView = readStoredMapView();
    const initialZoom = (!state.userLat && storedView && Number.isFinite(storedView.zoom)) ? storedView.zoom : 12;
    state.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: true,
      touchZoom: true,
      tapHold: false
    }).setView([coords.lat, coords.lng], initialZoom);

    refreshMapTiles();
    ensureCoverageMask();

    setupMapZoomGesture();
    setupMapSearch();
    setupRoutePanel();
    setupSearchHereButton();

    // Markers are hidden when zoomed out past the world-view threshold so
    // we don't draw thousands of pins. On zoom-in we DON'T re-render the
    // previous state.stations — the centre may have moved while zoomed out
    // (zoom out → pan → zoom in elsewhere), so the old data would briefly
    // flash at the wrong coords and the list would still show old entries
    // until the debounced loader fired. Instead we fire the loader
    // immediately on zoom so list + markers refresh together.
    const MIN_ZOOM_FOR_STATIONS = 10;
    // Cancel any pending viewport refresh the moment a new zoom starts.
    // Without this, a previous zoomend's deferred timer can fire mid-way
    // through the next zoom's animation — renderStationsOnMap then tears
    // down state.clusterGroup and the merge/split animation gets cut off.
    // Rapid zoom in/out is the worst case: each zoomend sets a timer, and
    // if a new zoomstart lands within that window the timer must die.
    state.map.on('zoomstart', () => {
      if (_viewportTimer) { clearTimeout(_viewportTimer); _viewportTimer = null; }
    });
    state.map.on('zoomend', () => {
      if (!state.map) return;
      // Route mode pins the list to the corridor result — don't let zoom
      // clear the markers or trigger a viewport reload that would clobber
      // state.stations. Re-render so the corridor pins survive a zoom that
      // would otherwise drop below MIN_ZOOM_FOR_STATIONS.
      if (state.routeMode) {
        renderStationsOnMap(state.stations || [], { skipFitBounds: true, skipRadiusFilter: true });
        return;
      }
      const zoom = state.map.getZoom();
      if (zoom < MIN_ZOOM_FOR_STATIONS) {
        if (state.clusterGroup) { state.map.removeLayer(state.clusterGroup); state.clusterGroup = null; }
        state.markers.forEach(m => state.map.removeLayer(m));
        state.markers = [];
      } else if (!state.clusterGroup && (state.stations || []).length) {
        // Back in station-display range, but the cluster was torn down by an
        // earlier zoom-out below MIN_ZOOM_FOR_STATIONS. Re-render the cached
        // stations immediately so the user never sees an empty map while the
        // debounced network refresh below catches up — and so a rapid zoom
        // that cancels that refresh can't strand the map empty.
        renderStationsOnMap(state.stations, { skipFitBounds: true, skipRadiusFilter: true });
      }
      // Refresh on zoom — the visible viewport (and therefore the bounds
      // query / scan-location selection) changes drastically, and skipping
      // would leave the user with stale markers / a clipped list. Deferred
      // ~400 ms so MarkerCluster's own merge/split animation can play out
      // before renderStationsOnMap tears down state.clusterGroup. A fast
      // double-zoom resets the timer via _viewportTimer instead of stacking.
      if (zoom >= VIEWPORT_MIN_ZOOM) {
        if (_viewportTimer) clearTimeout(_viewportTimer);
        _viewportTimer = setTimeout(() => {
          _viewportTimer = null;
          syncManualScansFromServer({ rerender: false });
          loadStationsAroundCenter({ silent: true });
        }, 400);
      }
    });
    state.map.on('moveend', () => {
      showSearchHereIfMoved();
      applyViewCountryUi();
      scheduleViewportRefresh();
      storeMapView();
    });
  }

  // Austria has full grid-cache coverage — pull stations for the current
  // viewport (25 km circle around the centre) instead of the radius-around-pin
  // query, so the list and markers follow what the user is looking at.
  if (getActiveCountry() === 'at') {
    const loader = document.getElementById('map-loading');
    if (!silent) {
      loader.classList.remove('hidden');
      showStationSkeletons();
    }
    await loadStationsAroundCenter({ silent });
    return;
  }

  const loader = document.getElementById('map-loading');
  if (!silent) {
    loader.classList.remove('hidden');
    showStationSkeletons();
  }

  try {
    const result = await api(`/api/stations?lat=${coords.lat}&lng=${coords.lng}&rad=${state.radiusKm}&fuel=${state.fuelType}`);
    const rawStations = Array.isArray(result) ? result : [];
    const cacheStatus = result._cacheStatus || 'fresh';
    // Distance labels follow GPS, not the query centre — strips dist if no GPS.
    const stations = withDistanceFromUser(rawStations);
    state.stations = stations;
    state.dataTimestamp = result._dataTimestamp || null;
    renderStationsOnMap(stations, { skipFitBounds });
    renderStationList(stations);
    state._searchHereAnchor = { lat: coords.lat, lng: coords.lng };
    if (!stations.length) {
      loader.innerHTML = `<span style="font-size:13px;opacity:0.6">${t('noStationsYet')}</span>`;
    } else {
      loader.classList.add('hidden');
    }
    if (cacheStatus === 'stale') {
      showToast(t('pricesStale'));
    } else if (cacheStatus === 'fallback') {
      showToast(t('pricesFallback'));
    }
    checkPriceAlert(stations);
  } catch (error) {
    // Show last known stations from state if available
    if (state.stations?.length) {
      renderStationsOnMap(state.stations);
      renderStationList(state.stations);
      loader.classList.add('hidden');
      showToast(t('pricesStaleConnection'));
    } else {
      renderMapLoadError(loader, () => loadMapTab({ skipFitBounds }));
    }
  }
}

// Error state on the map overlay with a real retry affordance — without it
// the first-load failure is a dead end on desktop (pull-to-refresh is
// touch-only and unavailable there).
function renderMapLoadError(loader, retry) {
  loader.classList.remove('hidden');
  loader.innerHTML = `<span>${t('errorLoading')}</span><button type="button" class="map-retry-btn">${t('retry')}</button>`;
  loader.querySelector('.map-retry-btn')?.addEventListener('click', () => {
    haptic('light');
    loader.innerHTML = `<div class="spinner" aria-hidden="true"></div><span>${t('loadingStations')}</span>`;
    retry();
  }, { once: true });
}

// ─── Centre-driven viewport loader ──────────────────────────────────
//
// As the user pans, the list and markers should follow an invisible
// 25 km circle around the map centre. Two strategies depending on
// country:
//   AT — query the cached grid via ?bounds= and trim to the 25 km
//        circle client-side.
//   DE — find admin scan locations whose 25 km radius overlaps the
//        user's 25 km circle (i.e. centres within 50 km), then fetch
//        each one's full cached set so the user sees the entire scan
//        radius even when pieces of it sit outside the centre circle.

const VIEWPORT_RADIUS_KM = 25;
const VIEWPORT_DEBOUNCE_MS = 350;
const VIEWPORT_MIN_ZOOM = 8;
// Skip the viewport refresh when the map centre has barely moved since
// the last successful load — pure zoom (no pan) and tiny adjustments
// don't change the result, so re-fetching just thrashes the list.
const VIEWPORT_MIN_MOVE_KM = 1.5;
let _viewportTimer = null;
let _viewportInflight = null;

// Sorted "id:price" fingerprint over a station set. Used by
// loadStationsAroundCenter to detect a no-op re-render so the
// MarkerCluster plugin's own zoom merge/split animation can play out
// instead of being destroyed by a fresh cluster build.
function stationFingerprint(stations) {
  if (!Array.isArray(stations) || stations.length === 0) return '';
  const parts = new Array(stations.length);
  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    parts[i] = `${s.id || `${s.lat},${s.lng}`}:${s.price || 0}`;
  }
  parts.sort();
  return parts.join('|');
}

function viewportCenterMovedEnough() {
  const last = state._lastViewportCenter;
  if (!last) return true;
  if (!state.map) return false;
  const c = state.map.getCenter();
  return distanceKm(last.lat, last.lng, c.lat, c.lng) >= VIEWPORT_MIN_MOVE_KM;
}

function scheduleViewportRefresh() {
  if (!state.map) return;
  if (state.routeMode) return; // frozen list while route is active
  if (state.map.getZoom() < VIEWPORT_MIN_ZOOM) return;
  if (!viewportCenterMovedEnough()) return;
  if (_viewportTimer) clearTimeout(_viewportTimer);
  _viewportTimer = setTimeout(() => {
    _viewportTimer = null;
    // Run the manual-scan sync alongside the viewport load so panning
    // into an area a peer just scanned surfaces their markers without
    // waiting for the next 60 s poll.
    syncManualScansFromServer({ rerender: false });
    loadStationsAroundCenter({ silent: true });
  }, VIEWPORT_DEBOUNCE_MS);
}

async function loadStationsAroundCenter({ silent = true } = {}) {
  if (!state.map) return;
  if (state.routeMode) return; // route mode freezes the station list
  const c = state.map.getCenter();
  const lat = c.lat;
  const lng = c.lng;
  const isAt = isInAustria(lat, lng);

  // Refresh the regional price band against the new centre. No-ops when the
  // snapped anchor matches the last fetch, so pans within a cell don't churn.
  loadPriceBand(lat, lng);

  // Coalesce concurrent in-flight requests so the latest move wins.
  if (_viewportInflight) { try { await _viewportInflight; } catch {} }
  const loader = document.getElementById('map-loading');

  const fetchPromise = (async () => {
    try {
      let stations = [];
      if (isAt) {
        // Austria: query whichever is larger — the visible viewport or the
        // guaranteed 25 km circle around the centre. That way the list
        // always covers at least 25 km (zoomed-in case) AND every station
        // currently visible on the map gets a marker (zoomed-out case).
        const latMargin = VIEWPORT_RADIUS_KM / 111;
        const lngMargin = VIEWPORT_RADIUS_KM / Math.max(0.001, 111 * Math.cos((lat * Math.PI) / 180));
        const visible = state.map.getBounds();
        const south = Math.min(lat - latMargin, visible.getSouth()).toFixed(5);
        const north = Math.max(lat + latMargin, visible.getNorth()).toFixed(5);
        const west = Math.min(lng - lngMargin, visible.getWest()).toFixed(5);
        const east = Math.max(lng + lngMargin, visible.getEast()).toFixed(5);
        const result = await api(`/api/stations?bounds=${south},${west},${north},${east}&fuel=${state.fuelType}`);
        stations = Array.isArray(result) ? result : [];
        state.dataTimestamp = result?._dataTimestamp || null;
        // No additional client-side filter — show everything the query
        // returned so zoomed-out viewports don't end up with empty patches.
      } else {
        // Germany: find every DE scan location whose 25 km radius reaches
        // the user's 25 km circle (i.e. centre-to-centre ≤ 50 km).
        const scanLocs = await ensureScanLocations();
        const matching = (scanLocs || []).filter((loc) => {
          if (loc.country !== 'de') return false;
          const r = Number(loc.radiusKm) > 0 ? Number(loc.radiusKm) : 25;
          return distanceKm(lat, lng, loc.lat, loc.lng) <= VIEWPORT_RADIUS_KM + r;
        });
        if (matching.length) {
          const results = await Promise.allSettled(
            matching.map((loc) =>
              api(`/api/stations?location=${encodeURIComponent(loc.id)}&fuel=${state.fuelType}`),
            ),
          );
          const seen = new Set();
          for (let i = 0; i < results.length; i++) {
            const r = results[i];
            if (r.status !== 'fulfilled') continue;
            const list = Array.isArray(r.value) ? r.value : [];
            const locId = matching[i].id;
            for (const s of list) {
              const k = s.id || `${s.lat},${s.lng}`;
              if (seen.has(k)) continue;
              seen.add(k);
              s._locationId = locId;
              stations.push(s);
            }
          }
        }
      }

      // Distance labels track the user's real GPS position (not the map
      // centre, not the search-bar pick). When GPS is unknown the dist
      // field is stripped so no misleading "X km entfernt" appears.
      stations = withDistanceFromUser(stations);

      // Guard against a transient empty result wiping the map. If the fetch
      // came back with zero stations while we still have some and the centre
      // barely moved (a zoom keeps the centre fixed), it's almost certainly a
      // hiccup — a timeout or a momentary backend gap — not a genuinely empty
      // area. Keep the existing markers/list and let the next refresh correct
      // it. A real pan into empty territory moves the centre and still clears.
      if (!stations.length && (state.stations || []).length) {
        const prev = state._lastViewportCenter;
        const movedKm = prev ? distanceKm(lat, lng, prev.lat, prev.lng) : Infinity;
        if (movedKm < VIEWPORT_MIN_MOVE_KM) {
          state._lastViewportCenter = { lat, lng };
          if (loader) loader.classList.add('hidden');
          return;
        }
      }

      // Skip rebuilding the cluster if the station set is bit-for-bit
      // identical to what's already on the map. The MarkerCluster plugin
      // has its own smooth merge/split animation on zoom — destroying and
      // recreating the cluster on every viewport refresh kills that
      // animation. Compare by sorted "id:price" fingerprint so price
      // changes still trigger a real re-render.
      const newFp = stationFingerprint(stations);
      const oldFp = stationFingerprint(state.stations);
      state.stations = stations;
      state._lastViewportCenter = { lat, lng };
      const skipRender = newFp === oldFp && !!state.clusterGroup;
      // DE shows the full scan-location set even when stations sit beyond
      // the user's 25 km circle, so skip the per-list radius filter there.
      const renderOpts = { skipFitBounds: true, skipRadiusFilter: true };
      if (!skipRender) {
        renderStationsOnMap(stations, renderOpts);
        renderStationList(stations);
      }
      if (loader) {
        if (!stations.length && !silent) {
          loader.innerHTML = `<span style="font-size:13px;opacity:0.6">${t('noStationsYet')}</span>`;
        } else {
          loader.classList.add('hidden');
        }
      }
      checkPriceAlert(stations);
    } catch {
      if (loader && !silent) renderMapLoadError(loader, () => loadStationsAroundCenter({ silent: false }));
    }
  })();
  _viewportInflight = fetchPromise;
  try { await fetchPromise; } finally {
    if (_viewportInflight === fetchPromise) _viewportInflight = null;
  }
}

// ─── Manual-scan persistence ───────────────────────────────────────
//
// Results from the "Hier suchen" picker are kept in localStorage for 1 h
// so the markers come back after a refresh. Each station from such a scan
// carries an _expiresAt timestamp the sheet UI uses to render a countdown.

const MANUAL_SCAN_TTL_MS = 60 * 60 * 1000;
const MANUAL_SCANS_KEY = 'tank_manual_scans';

function loadStoredManualScans() {
  try {
    const raw = JSON.parse(localStorage.getItem(MANUAL_SCANS_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    const now = Date.now();
    return raw.filter(s => s && Number(s.expiresAt) > now && Array.isArray(s.stations));
  } catch { return []; }
}

function persistManualScans() {
  try {
    localStorage.setItem(MANUAL_SCANS_KEY, JSON.stringify(state.manualScans || []));
  } catch { /* quota exhausted — ignore */ }
}

function pruneManualScans() {
  const now = Date.now();
  const before = (state.manualScans || []).length;
  state.manualScans = (state.manualScans || []).filter(s => Number(s.expiresAt) > now);
  if (state.manualScans.length !== before) {
    persistManualScans();
    return true;
  }
  return false;
}

function recordManualScan(lat, lng, stations) {
  if (!Array.isArray(state.manualScans)) state.manualScans = [];
  const expiresAt = Date.now() + MANUAL_SCAN_TTL_MS;
  state.manualScans.push({ lat, lng, stations, expiresAt });
  persistManualScans();
}

// Manual scans are also exposed by the backend so any user (logged in or
// not) can piggy-back on a peer's recent scan. Pull the active set in,
// merge with whatever we have locally and de-dupe by rounded lat/lng so
// repeated entries from the same area collapse.
function manualScanKey(lat, lng) {
  return `${Number(lat).toFixed(2)},${Number(lng).toFixed(2)}`;
}

function mergeIntoManualScans(remoteScans) {
  if (!Array.isArray(remoteScans) || !remoteScans.length) return false;
  if (!Array.isArray(state.manualScans)) state.manualScans = [];
  const byKey = new Map();
  for (const s of state.manualScans) {
    if (!s || Number(s.expiresAt) <= Date.now()) continue;
    byKey.set(manualScanKey(s.lat, s.lng), s);
  }
  let touched = false;
  for (const r of remoteScans) {
    if (!r || !Array.isArray(r.stations)) continue;
    const exp = Number(r.expiresAt);
    if (!(exp > Date.now())) continue;
    const key = manualScanKey(r.lat, r.lng);
    const existing = byKey.get(key);
    // Keep whichever entry expires later (= scanned more recently).
    if (!existing || exp > Number(existing.expiresAt)) {
      byKey.set(key, { lat: r.lat, lng: r.lng, stations: r.stations, expiresAt: exp });
      touched = true;
    }
  }
  if (touched) {
    state.manualScans = Array.from(byKey.values());
    persistManualScans();
  }
  return touched;
}

let _manualScansFetchInflight = null;
async function syncManualScansFromServer({ rerender = true } = {}) {
  if (_manualScansFetchInflight) { try { await _manualScansFetchInflight; } catch {} return; }
  _manualScansFetchInflight = (async () => {
    try {
      const res = await api(`/api/manual-scans?fuel=${state.fuelType}`);
      const scans = Array.isArray(res?.scans) ? res.scans : [];
      const changed = mergeIntoManualScans(scans);
      if (changed && rerender && state.map && Array.isArray(state.stations)) {
        renderStationsOnMap(state.stations, { skipFitBounds: true, skipRadiusFilter: true });
        renderStationList(state.stations);
      }
    } catch { /* offline / endpoint missing — fall back to local-only */ }
  })();
  try { await _manualScansFetchInflight; } finally { _manualScansFetchInflight = null; }
}

// Drive the manual-scan freshness colour from the remaining-time fraction t
// (1 = just scanned, 0 = expired). Hue interpolates green → yellow → red.
// We push the value onto the sheet body so both the small banner and the
// big price (sibling, .has-manual-scan) inherit and pulse in the same hue.
function applyManualScanFreshness(el, t) {
  const clamped = Math.max(0, Math.min(1, t));
  let hue;
  if (clamped >= 0.5) {
    const u = (clamped - 0.5) / 0.5;
    hue = 45 + u * (142 - 45);
  } else {
    const u = clamped / 0.5;
    hue = u * 45;
  }
  const sat = 80 + (1 - clamped) * 8;
  const light = 50;
  const color = `hsl(${hue.toFixed(1)} ${sat.toFixed(1)}% ${light}%)`;
  const targets = [el];
  const sheetBody = document.getElementById('bottom-sheet-body');
  if (sheetBody) targets.push(sheetBody);
  for (const target of targets) {
    target.style.setProperty('--scan-color', color);
  }
}

// Merge active manual-scan stations into the given list. Any station the
// user manually scanned within the TTL keeps its _expiresAt tag, even when
// the primary list also contains it (so the detail sheet always shows the
// countdown right after a scan, not just after a refresh).
//
// IMPORTANT: state.manualScans now also holds peer scans pulled from
// /api/manual-scans, which can sit anywhere in DE/AT. Without a proximity
// gate they would pollute every render — e.g. an AT user would see
// distant DE peer scans in their list. Drop scans whose centre is more
// than MANUAL_SCAN_NEARBY_KM away from the current map view.
const MANUAL_SCAN_NEARBY_KM = 50;
function manualScansInRange() {
  const now = Date.now();
  const center = state.map ? state.map.getCenter() : null;
  return (state.manualScans || []).filter((scan) => {
    if (!scan || Number(scan.expiresAt) <= now) return false;
    if (!center) return true;
    if (!Number.isFinite(scan.lat) || !Number.isFinite(scan.lng)) return true;
    return distanceKm(center.lat, center.lng, scan.lat, scan.lng) <= MANUAL_SCAN_NEARBY_KM;
  });
}

function withManualScans(primary) {
  const inRange = manualScansInRange();
  // Build a station-id → latest expiresAt map across all active scans.
  const expiryByKey = new Map();
  for (const scan of inRange) {
    const exp = Number(scan.expiresAt);
    for (const s of scan.stations || []) {
      const key = s.id || `${s.lat},${s.lng}`;
      const existing = expiryByKey.get(key);
      if (!existing || exp > existing) expiryByKey.set(key, exp);
    }
  }

  const out = new Map();
  const list = Array.isArray(primary) ? primary : [];
  for (const s of list) {
    const key = s.id || `${s.lat},${s.lng}`;
    const exp = expiryByKey.get(key);
    out.set(key, exp ? { ...s, _expiresAt: exp } : s);
  }
  // Add stations only present in a manual scan (not in primary at all).
  for (const scan of inRange) {
    const exp = Number(scan.expiresAt);
    for (const s of scan.stations || []) {
      const key = s.id || `${s.lat},${s.lng}`;
      if (out.has(key)) continue;
      out.set(key, { ...s, _expiresAt: exp });
    }
  }
  return Array.from(out.values());
}

const SEARCH_HERE_COOLDOWN_SEC = 30;
const SCAN_RADIUS_KM = 25;
const SCAN_ANIMATION_DURATION = 1300;
const SCAN_RIPPLE_COUNT = 3;
const SCAN_RIPPLE_STAGGER = 260;

const SEARCH_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
const CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
const CLOSE_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

function getAccentColor() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
  return v || '#007aff';
}

function setupSearchHereButton() {
  const btn = document.getElementById('btn-search-here');
  if (!btn || btn._setup) return;
  btn._setup = true;
  btn.classList.remove('hidden');
  setSearchBtnIdle(btn);

  btn.addEventListener('click', () => {
    if (!state.map || btn.disabled) return;
    if (state._scanPicker) confirmScanPicker();
    else enterScanPickerMode();
  });

  // Survive a refresh: pick the cooldown back up if it's still ticking.
  restoreSearchHereCooldown();
}

function setSearchBtnIdle(btn) {
  btn = btn || document.getElementById('btn-search-here');
  if (!btn) return;
  btn.classList.remove('is-confirm');
  btn.innerHTML = `${SEARCH_ICON_SVG}<span>${t('searchHere')}</span>`;
}

function setSearchBtnConfirm(btn) {
  btn = btn || document.getElementById('btn-search-here');
  if (!btn) return;
  btn.classList.add('is-confirm');
  btn.innerHTML = `${CHECK_ICON_SVG}<span>${t('scanConfirm')}</span>`;
}

function enterScanPickerMode() {
  if (state._scanPicker || !state.map) return;
  haptic('light');

  const accent = getAccentColor();
  const center = state.map.getCenter();

  const circle = L.circle(center, {
    radius: SCAN_RADIUS_KM * 1000,
    color: accent,
    weight: 2,
    opacity: 0.9,
    fillColor: accent,
    fillOpacity: 0.08,
    interactive: false,
  }).addTo(state.map);

  const pinIcon = L.divIcon({
    className: '',
    html: `<div class="scan-pin" style="--scan-accent:${accent}"><span class="scan-pin-dot"></span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  const marker = L.marker(center, { draggable: true, icon: pinIcon, zIndexOffset: 1000 }).addTo(state.map);

  marker.on('drag', () => {
    const p = marker.getLatLng();
    circle.setLatLng(p);
  });

  const onMapClick = (e) => {
    marker.setLatLng(e.latlng);
    circle.setLatLng(e.latlng);
  };
  state.map.on('click', onMapClick);

  state._scanPicker = { circle, marker, onMapClick };

  // Frame the radius so the user can see the full 25 km area at a glance.
  try {
    state.map.fitBounds(circle.getBounds(), { padding: [40, 40], animate: true });
  } catch { /* fitBounds can throw on a not-yet-projected map; ignore */ }

  // Toggle button into confirm mode + insert cancel pill alongside it.
  // The confirm + cancel pills now share the top row with the search box, so
  // hide the box while picking — the row then centres (see CSS rule on
  // #map-search-top-row:has(#map-search-box.hidden)).
  document.getElementById('map-search-box')?.classList.add('hidden');
  const btn = document.getElementById('btn-search-here');
  setSearchBtnConfirm(btn);
  if (btn && !document.getElementById('btn-scan-cancel')) {
    const cancel = document.createElement('button');
    cancel.id = 'btn-scan-cancel';
    cancel.className = 'map-scan-cancel';
    cancel.type = 'button';
    cancel.setAttribute('aria-label', t('scanCancel'));
    cancel.innerHTML = CLOSE_ICON_SVG;
    cancel.addEventListener('click', cancelScanPicker);
    btn.parentNode.insertBefore(cancel, btn);
  }
}

function exitScanPickerMode() {
  const picker = state._scanPicker;
  if (picker) {
    try { state.map.removeLayer(picker.circle); } catch {}
    try { state.map.removeLayer(picker.marker); } catch {}
    if (picker.onMapClick) try { state.map.off('click', picker.onMapClick); } catch {}
    state._scanPicker = null;
  }
  document.getElementById('btn-scan-cancel')?.remove();
  document.getElementById('map-search-box')?.classList.remove('hidden');
  setSearchBtnIdle();
}

function cancelScanPicker() {
  haptic('light');
  exitScanPickerMode();
}

async function confirmScanPicker() {
  const picker = state._scanPicker;
  if (!picker) return;
  const center = picker.marker.getLatLng();

  // Don't waste a scan slot on an area already covered by an admin scan
  // location (or its immediate 25 km neighbourhood). Just navigate there
  // — loadStationsAroundCenter will pull the cached data for free.
  if (await isLocationAlreadyCovered(center.lat, center.lng)) {
    haptic('warning');
    showToast(t('alreadyCovered'));
    exitScanPickerMode();
    if (state.map) state.map.flyTo([center.lat, center.lng], 13, { duration: 0.6 });
    return;
  }

  haptic('medium');
  // Tear down picker UI but keep the search button visible (disabled during scan)
  exitScanPickerMode();
  await runScanAt(center.lat, center.lng);
}

// Scan animation + station fetch + render. Drives the search-here button
// state for both the manual picker flow and the location-search result flow.
async function runScanAt(lat, lng) {
  state._scanRunning = true;
  const btn = document.getElementById('btn-search-here');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `${SEARCH_ICON_SVG}<span>${t('searchingHere')}</span>`;
  }

  const animPromise = playScanAnimation({ lat, lng }, SCAN_RADIUS_KM);

  try {
    const result = await api(`/api/stations?lat=${lat}&lng=${lng}&rad=${SCAN_RADIUS_KM}&fuel=${state.fuelType}`);
    const rawStations = Array.isArray(result) ? result : [];
    // The scan only changes WHAT the user is looking at — not where they
    // are. The blue pin stays at the device's GPS reading; distance labels
    // are recomputed from there (or stripped if GPS is unknown).
    const stations = withDistanceFromUser(rawStations);
    state.stations = stations;
    state.dataTimestamp = result._dataTimestamp || null;
    state._searchHereAnchor = { lat, lng };
    applyCountryUi();

    // Persist the manual scan so the markers and a 15 min "valid for"
    // countdown survive a refresh. Also push a sync so other tabs /
    // users pick up this fresh scan on their next render.
    if (stations.length) {
      recordManualScan(lat, lng, stations);
      // Fire-and-forget — the server already cached via /api/stations,
      // this just nudges any other open tab to grab the new entry sooner.
      syncManualScansFromServer({ rerender: false });
    }

    await animPromise;
    // skipRadiusFilter: manual scans are user-targeted at a specific point —
    // filtering markers by *user-GPS* distance hides them entirely whenever
    // the scan happens far from the user's actual location (e.g. tapping a
    // station out of state). The list intentionally skips this filter for
    // the same reason; keep them in sync.
    renderStationsOnMap(stations, { skipFitBounds: true, skipRadiusFilter: true });
    renderStationList(stations);
    if (!stations.length) showToast(t('noStationsHere'));
  } catch {
    await animPromise;
    showToast(t('errorLoading'));
  } finally {
    state._scanRunning = false;
    startSearchHereCooldown();
  }
}

// True while a scan is animating/fetching or its post-scan cooldown is
// counting down. New scan requests must queue instead of firing.
function isScanBusy() {
  return Boolean(state._scanRunning) || state._searchHereCooldownTimer != null;
}

// Drop a yellow pin to signal "queued, waiting for cooldown". Tap the pin
// to remove the entry from the queue.
function enqueueScan(lat, lng) {
  if (!state.map) return;
  if (!Array.isArray(state._scanQueue)) state._scanQueue = [];
  const pin = L.marker([lat, lng], {
    icon: L.divIcon({
      className: '',
      html: '<div class="scan-queue-pin" aria-hidden="true"><span class="scan-queue-pin-dot"></span></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    }),
    zIndexOffset: 800,
    interactive: true,
    keyboard: false,
  }).addTo(state.map);

  const item = { lat, lng, pin };
  pin.on('click', () => removeQueuedScan(item));
  state._scanQueue.push(item);
}

function removeQueuedScan(item) {
  if (!Array.isArray(state._scanQueue)) return;
  const idx = state._scanQueue.indexOf(item);
  if (idx === -1) return;
  state._scanQueue.splice(idx, 1);
  try { state.map.removeLayer(item.pin); } catch {}
}

// Pop the oldest queued scan and run it. Called when the cooldown ends.
function processScanQueue() {
  if (!Array.isArray(state._scanQueue) || !state._scanQueue.length) return;
  const next = state._scanQueue.shift();
  try { state.map.removeLayer(next.pin); } catch {}
  const flyDuration = 0.6;
  if (state.map) state.map.flyTo([next.lat, next.lng], 13, { duration: flyDuration });
  setTimeout(() => { runScanAt(next.lat, next.lng); }, flyDuration * 1000 + 50);
}

function playScanAnimation(centerLatLng, radiusKm) {
  return new Promise((resolve) => {
    if (!state.map) { resolve(); return; }
    const accent = getAccentColor();
    const finalRadius = radiusKm * 1000;
    const total = SCAN_ANIMATION_DURATION + (SCAN_RIPPLE_COUNT - 1) * SCAN_RIPPLE_STAGGER;
    let done = 0;
    let resolved = false;
    const finish = () => { if (!resolved) { resolved = true; resolve(); } };

    for (let i = 0; i < SCAN_RIPPLE_COUNT; i++) {
      setTimeout(() => {
        if (!state.map) { done++; if (done === SCAN_RIPPLE_COUNT) finish(); return; }
        const ripple = L.circle(centerLatLng, {
          radius: 0,
          color: accent,
          weight: 2.5,
          opacity: 0.9,
          fillColor: accent,
          fillOpacity: 0.18,
          interactive: false,
        }).addTo(state.map);
        animateRipple(ripple, finalRadius, SCAN_ANIMATION_DURATION, () => {
          done++;
          if (done === SCAN_RIPPLE_COUNT) finish();
        });
      }, i * SCAN_RIPPLE_STAGGER);
    }
    // Safety net so we never hang the cooldown if a tile hiccup kills RAF
    setTimeout(finish, total + 600);
  });
}

function animateRipple(circle, finalRadius, duration, onDone) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    try {
      circle.setRadius(eased * finalRadius);
      circle.setStyle({
        opacity: 0.9 * (1 - t * 0.7),
        fillOpacity: 0.18 * (1 - t),
      });
    } catch {
      onDone && onDone();
      return;
    }
    if (t < 1) requestAnimationFrame(step);
    else {
      try { state.map.removeLayer(circle); } catch {}
      onDone && onDone();
    }
  }
  requestAnimationFrame(step);
}

// Persist the cooldown's end timestamp so a refresh doesn't reset it.
const COOLDOWN_STORAGE_KEY = 'tank_search_cooldown_until';

function startSearchHereCooldown(endsAt) {
  const btn = document.getElementById('btn-search-here');
  if (!btn) return;
  if (state._searchHereCooldownTimer) clearInterval(state._searchHereCooldownTimer);

  // Without an explicit endsAt this is a freshly-started cooldown — write
  // it to localStorage so the next page load can pick it back up.
  if (!Number.isFinite(endsAt)) {
    endsAt = Date.now() + SEARCH_HERE_COOLDOWN_SEC * 1000;
    try { localStorage.setItem(COOLDOWN_STORAGE_KEY, String(endsAt)); } catch {}
  }

  btn.disabled = true;
  const baseLabel = t('searchHere');
  setSearchBtnIdle(btn);
  const tick = () => {
    const remaining = Math.ceil((endsAt - Date.now()) / 1000);
    if (remaining <= 0) {
      clearInterval(state._searchHereCooldownTimer);
      state._searchHereCooldownTimer = null;
      try { localStorage.removeItem(COOLDOWN_STORAGE_KEY); } catch {}
      btn.disabled = false;
      setSearchBtnIdle(btn);
      processScanQueue();
      return;
    }
    btn.innerHTML = `${SEARCH_ICON_SVG}<span>${baseLabel} (${remaining})</span>`;
  };
  tick();
  state._searchHereCooldownTimer = setInterval(tick, 1000);
}

// Re-arm the cooldown UI from a previously stored endsAt. Called once
// after the search-here button has been wired up on app boot.
function restoreSearchHereCooldown() {
  let endsAt;
  try { endsAt = Number(localStorage.getItem(COOLDOWN_STORAGE_KEY)); } catch { return; }
  if (!Number.isFinite(endsAt)) return;
  if (endsAt <= Date.now()) {
    try { localStorage.removeItem(COOLDOWN_STORAGE_KEY); } catch {}
    return;
  }
  startSearchHereCooldown(endsAt);
}

function showSearchHereIfMoved() {
  // Button is always visible now; kept as a no-op hook so loadMapTab's
  // moveend handler can still call it without breaking.
}

function renderStationsOnMap(stations, { skipFitBounds = false, skipRadiusFilter = false } = {}) {
  // Layer in active manual scans so the markers persist for 15 min after
  // a refresh / pan-away. Stations already in the primary list keep their
  // fresh data and get no countdown.
  stations = withManualScans(stations);
  // Distance labels (sheet detail) follow GPS — strips dist if unknown.
  stations = withDistanceFromUser(stations);
  // Keep the map in lockstep with the list when the favourites-only
  // filter is active — markers for non-favourites would contradict it.
  stations = applyFavouritesOnlyFilter(stations);
  // Remove previous cluster group or individual markers
  if (state.clusterGroup) {
    state.map.removeLayer(state.clusterGroup);
    state.clusterGroup = null;
  }
  state.markers.forEach(m => state.map.removeLayer(m));
  state.markers = [];
  if (state.userMarker) {
    state.map.removeLayer(state.userMarker);
    state.userMarker = null;
  }

  if (!stations.length) return;

  // Filter by user-set radius (skip when loading for viewport)
  const radiusKm = state.radiusKm || 25;
  const filtered = skipRadiusFilter ? stations : stations.filter(s => !s.dist || s.dist <= radiusKm);

  if (state.userLat && state.userLng) {
    const userIcon = L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:var(--color-accent);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    state.userMarker = L.marker([state.userLat, state.userLng], { icon: userIcon }).addTo(state.map);
  }

  // Use MarkerClusterGroup if available, otherwise fall back to direct markers
  const useCluster = typeof L.markerClusterGroup === 'function';
  const cluster = useCluster ? L.markerClusterGroup({
    maxClusterRadius: 50,
    disableClusteringAtZoom: 14,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction: function(clusterObj) {
      const count = clusterObj.getChildCount();
      // Average each child's pre-computed bandRatio (cached on the marker
      // at creation time as _stationRatio) so a cluster gets the same
      // gradient as its individual pins. Doing this from a cache instead
      // of recomputing per child keeps the merge/split animation smooth —
      // the polygon point-in-country test inside stationBandRatio would
      // otherwise run for every child on every intermediate cluster.
      // Children without any band ratio contribute to price but not color.
      const childMarkers = clusterObj.getAllChildMarkers();
      let totalPrice = 0, priceCount = 0;
      let totalRatio = 0, ratioCount = 0;
      childMarkers.forEach(function(m) {
        if (!m._stationPrice) return;
        totalPrice += m._stationPrice;
        priceCount++;
        const r = m._stationRatio;
        if (r != null) {
          totalRatio += r;
          ratioCount++;
        }
      });
      const avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;
      const color = ratioCount > 0 ? priceColor3(totalRatio / ratioCount) : PRICE_COLOR_NEUTRAL;
      const pParts = avgPrice > 0 ? formatPriceParts(avgPrice) : null;
      const size = count > 20 ? 56 : count > 5 ? 48 : 40;
      return L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.8)">
          <span style="font-size:${size > 48 ? 14 : 12}px;line-height:1">${count}</span>
          ${pParts ? `<span style="font-size:${size > 48 ? 11 : 10}px;line-height:1;opacity:0.9">~${pParts.main}<sup style="font-size:7px">${pParts.decimal}</sup></span>` : ''}
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    }
  }) : null;

  const stationMarkers = [];

  filtered.forEach((s) => {
    if (!s.price || !s.isOpen) return;
    // Compute the band ratio once and reuse it for both the pin's color
    // and the cluster's average — the polygon point-in-country test inside
    // stationBandRatio is the hot path during cluster merge animations.
    const ratio = stationBandRatio(s.price, s._locationId, s.lat, s.lng);
    const color = ratio == null ? PRICE_COLOR_NEUTRAL : priceColor3(ratio);
    const brand = fixEnc(s.brand || s.name).substring(0, 6);
    const pParts = formatPriceParts(s.price);
    const icon = L.divIcon({
      className: '',
      html: `<div class="map-bubble" style="background:${color}">
        <div class="map-bubble-brand">${brand}</div>
        <div class="map-bubble-price">${pParts.main}<sup>${pParts.decimal}</sup></div>
        <div class="map-bubble-arrow" style="border-top-color:${color}"></div>
      </div>`,
      iconSize: [64, 48],
      iconAnchor: [32, 48]
    });

    const marker = L.marker([s.lat, s.lng], { icon })
      .on('click', () => {
        haptic('light');
        if (state.map && s.lat && s.lng) {
          state.map.invalidateSize();
          state.map.flyTo([s.lat, s.lng], 15, { duration: 0.6 });
        }
        showStationSheet(s);
      });

    // Set the marker caches BEFORE addLayer — MarkerCluster may call
    // iconCreateFunction synchronously if the marker lands in an
    // already-existing cluster at the current zoom.
    marker._stationPrice = s.price;
    marker._stationLocationId = s._locationId;
    marker._stationLat = s.lat;
    marker._stationLng = s.lng;
    marker._stationRatio = ratio;

    if (cluster) {
      cluster.addLayer(marker);
    } else {
      marker.addTo(state.map);
    }
    stationMarkers.push(marker);
  });

  if (cluster) {
    state.map.addLayer(cluster);
    state.clusterGroup = cluster;
  }

  state.markers = stationMarkers;

  const allMarkers = state.userMarker ? [state.userMarker, ...stationMarkers] : stationMarkers;
  if (allMarkers.length > 1) {
    const group = L.featureGroup(allMarkers);
    const bounds = group.getBounds().pad(0.1);
    state.defaultBounds = bounds;
    if (!skipFitBounds) state.map.fitBounds(bounds);
  }
}

function updateSortButton() {
  const label = document.getElementById('sort-label');
  const icon = document.getElementById('sort-icon');
  if (!label) return;
  const isPrice = state.stationSort === 'price';
  label.textContent = isPrice ? t('sortPrice') : t('sortDistance');
  if (icon) {
    const path = icon.querySelector('path');
    if (path) {
      path.setAttribute('d', isPrice
        ? 'M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z'
        : 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z');
    }
  }
}

function setupStationSort() {
  const btn = document.getElementById('station-sort');
  if (!btn) return;
  updateSortButton();
  btn.addEventListener('click', () => {
    haptic('light');
    state.stationSort = state.stationSort === 'price' ? 'distance' : 'price';
    updateSortButton();
    if (state.stations.length) renderStationList(state.stations);
  });
}

// Shown when no band is available (cold start, API failure, sparse area,
// degenerate spread). Deliberately a flat neutral so it can't be mistaken
// for a heatmap signal — the price is shown, but uncoloured.
const PRICE_COLOR_NEUTRAL = 'hsl(0, 0%, 72%)';

// Floor on the band's P10→P90 span used by bandRatio. With a 100 km regional
// band a 3-cent local spread is meaningful, so this only kicks in for truly
// degenerate clusters where every nearby station sits within a cent or two.
const MIN_BAND_SPREAD = 0.03;

// Radius (km) and snap step (deg) used to anchor the regional band. The
// snap step must match the server's REGIONAL_SNAP_DEG so the client only
// refetches when crossing a real cache-cell boundary.
const PRICE_BAND_RADIUS_KM = 100;
const PRICE_BAND_SNAP_DEG = 0.5;

function priceBandKey(fuel, lat, lng) {
  const snapLat = Math.round(lat / PRICE_BAND_SNAP_DEG) * PRICE_BAND_SNAP_DEG;
  const snapLng = Math.round(lng / PRICE_BAND_SNAP_DEG) * PRICE_BAND_SNAP_DEG;
  return `${fuel}:${snapLat.toFixed(2)}:${snapLng.toFixed(2)}`;
}

// Fetch the regional 24h price band around (lat, lng) for the current fuel
// and re-render open views once it lands. Short-circuits when the anchor
// snaps into the same cache cell as the previous fetch so pans within a
// ~55 km cell don't trigger network or recolouring churn.
async function loadPriceBand(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const fuel = state.fuelType;
  const key = priceBandKey(fuel, lat, lng);
  if (state.priceBand && state.priceBand.key === key && state.priceBand.band) return;
  try {
    const url = `/api/price-band?fuel=${encodeURIComponent(fuel)}`
      + `&lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}&radius=${PRICE_BAND_RADIUS_KM}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Ignore late responses for a fuel the user has since switched away from.
    if (state.fuelType !== fuel) return;
    state.priceBand = { fuel, band: data.band || null, key };
    if (state.stations && state.stations.length) {
      if (state.map) renderStationsOnMap(state.stations, { skipFitBounds: true, skipRadiusFilter: true });
      renderStationList(state.stations);
    }
    // The search dropdown isn't tied to state.stations, so recolour it too.
    recolorOpenSearchResults();
  } catch (err) {
    console.warn('[priceBand] load failed:', err && err.message || err);
  }
}

// Original two-stop linear RGB green → red. Passes through olive/brown
// around t≈0.5 by virtue of straight-line RGB interpolation between
// (52,199,89) and (255,59,48).
function priceColor3(t) {
  const x = Math.max(0, Math.min(1, t));
  const r = Math.round(52 + x * 203);
  const g = Math.round(199 - x * 140);
  const b = Math.round(89 - x * 41);
  return `rgb(${r},${g},${b})`;
}

// Map a price to t∈[0,1] linearly across the band [P10, P90], but never
// using less than MIN_BAND_SPREAD as the divisor. With the regional band
// the spread is already meaningful, so MIN_BAND_SPREAD only damps truly
// degenerate clusters (every nearby station within ~1 cent of each other).
function bandRatio(price, band) {
  const { p10, p90 } = band;
  if (!(p90 > p10)) return 0;
  if (price <= p10) return 0;
  const spread = Math.max(p90 - p10, MIN_BAND_SPREAD);
  const r = (price - p10) / spread;
  return r >= 1 ? 1 : r;
}

// Ratio for a single station anchored to the regional band (P10/P90 of all
// open stations within PRICE_BAND_RADIUS_KM of the map centre). The server
// snaps the anchor so small pans don't shift the band; the cheapest local
// station maps to green, the most expensive to red, regardless of how that
// region compares to the national distribution. Returns null when no band is
// available — callers render neutral grey.
function stationBandRatio(price) {
  if (!price) return null;
  const band = state.priceBand && state.priceBand.band;
  if (!band || band.p10 == null || band.p90 == null) return null;
  return bandRatio(price, band);
}

function priceColorStable(price /* , locationId, lat, lng — kept for call-site stability */) {
  const r = stationBandRatio(price);
  return r == null ? PRICE_COLOR_NEUTRAL : priceColor3(r);
}

function rankColor(ratio) {
  // green (#34c759) → orange (#ff9500) → red (#ff3b30)
  if (ratio <= 0.5) {
    const t = ratio * 2;
    const r = Math.round(52 + t * 203);
    const g = Math.round(199 - t * 50);
    const b = Math.round(89 - t * 89);
    return `rgb(${r},${g},${b})`;
  }
  const t = (ratio - 0.5) * 2;
  const r = 255;
  const g = Math.round(149 - t * 90);
  const b = Math.round(0 + t * 48);
  return `rgb(${r},${g},${b})`;
}

function renderStationList(stations) {
  // Same merge as renderStationsOnMap — list and markers stay in sync.
  // The list trusts whatever the upstream loader produced: loadStationsAroundCenter,
  // runScanAt and loadMapTab all curate state.stations to the right area
  // already, so a second radius pass here would just drop legitimate entries
  // (e.g. DE scan-location stations slightly beyond the user's 25 km circle).
  stations = withManualScans(stations);
  // The manual-scan merge can pull in stations that still carry an old
  // dist field (relative to the scan centre). Re-apply the GPS-based
  // distance pass so dist matches the user's real location, or is
  // stripped entirely when GPS is unknown.
  stations = withDistanceFromUser(stations);
  const list = document.getElementById('station-list');
  const countLabel = document.getElementById('station-count');
  let open = stations.filter(s => s.isOpen && s.price);

  // Favourites-only filter: trim the list to starred stations. Applied
  // before the group-by-price dedupe so grouping happens within favourites.
  const favFilterActive = isFavouritesOnlyActive();
  open = applyFavouritesOnlyFilter(open);

  // Group-by-price toggle: dedupe so each distinct price appears once,
  // keeping the closest station. Walk price-then-distance order and pick
  // the first of each price bucket.
  if (state.groupByPrice) {
    const byPrice = [...open].sort((a, b) => (a.price - b.price) || ((a.dist || 999) - (b.dist || 999)));
    const seen = new Set();
    const deduped = [];
    for (const s of byPrice) {
      const key = s.price.toFixed(3);
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(s);
    }
    open = deduped;
  }

  if (countLabel) {
    if (state.routeMode) {
      countLabel.classList.add('is-route');
      countLabel.innerHTML = `<span class="station-count-main">${open.length} ${t('stationsFound')}</span><span class="station-count-sub">${t('alongRoute')}</span>`;
    } else {
      countLabel.classList.remove('is-route');
      countLabel.textContent = `${open.length} ${t('stationsFound')}`;
    }
  }

  if (!open.length) {
    const emptyText = favFilterActive ? t('noFavouritesHere') : t('noOpenStations');
    list.innerHTML = `<div class="empty-state"><svg class="empty-state-icon" viewBox="0 0 24 24" width="48" height="48" fill="var(--color-hint)"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/></svg><div class="empty-state-text">${emptyText}</div></div>`;
    return;
  }

  if (state.stationSort === 'distance') {
    open.sort((a, b) => (a.dist || 999) - (b.dist || 999));
  } else {
    // Price sort with distance as tiebreaker — equal-priced stations show
    // the closer one first, which matches how a driver actually picks.
    open.sort((a, b) => (a.price - b.price) || ((a.dist || 999) - (b.dist || 999)));
  }

  // Star toggle in the sort bar: when active, pin every favourite to the
  // top of the list (relative order preserved). Off — favourites are
  // sorted just like any other station.
  if (state.favouritesOnTop) {
    open.sort((a, b) => {
      const aFav = a.id && state.favourites.includes(a.id) ? 0 : 1;
      const bFav = b.id && state.favourites.includes(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }

  list.innerHTML = open.slice(0, 50).map((s, i) => {
    const color = priceColorStable(s.price, s._locationId, s.lat, s.lng);
    const dist = s.dist ? `${s.distApprox ? '~' : ''}${s.dist.toFixed(1)} km` : '';
    const priceParts = formatPriceParts(s.price);
    const isFav = s.id && state.favourites.includes(s.id);

    return `
      <div class="station-item" data-idx="${i}">
        <div class="station-rank" style="background:${color}">${i + 1}</div>
        <div class="station-info">
          <div class="station-name">${fixEnc(s.brand || s.name)}</div>
          <div class="station-addr">${fixEnc(s.street)} ${s.houseNumber || ''}, ${fixEnc(s.place)}</div>
        </div>
        <div style="text-align:right;display:flex;align-items:center;gap:4px">
          ${isFav && state.user ? `<button class="fav-btn active" data-station-id="${s.id}" aria-label="${t('removeFavourite')}"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>` : ''}
          <div>
            <div class="station-price" style="color:${color}">${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''}</div>
            ${dist ? `<div class="station-dist">${dist}</div>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  requestAnimationFrame(() => {
    list.querySelectorAll('.station-item').forEach((el, i) => {
      el.style.animationDelay = `${Math.min(i * 35, 350)}ms`;
      el.classList.add('anim-in');
    });
  });

  list.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavourite(btn.dataset.stationId);
    });
  });

  list.querySelectorAll('.station-item').forEach(el => {
    el.addEventListener('click', () => {
      haptic('light');
      const idx = parseInt(el.dataset.idx, 10);
      const station = open[idx];
      document.getElementById('view-map').scrollTo({ top: 0, behavior: 'smooth' });
      if (state.map && station.lat && station.lng) {
        setTimeout(() => {
          state.map.invalidateSize();
          state.map.flyTo([station.lat, station.lng], 15, { duration: 0.6 });
        }, 200);
      }
      showStationSheet(station);
    });
  });
}

let _expandToggleTime = 0;
function toggleSheetExpanded(content) {
  const now = Date.now();
  if (now - _expandToggleTime < 400) return;
  _expandToggleTime = now;
  state.sheetExpanded = !state.sheetExpanded;
  content.classList.toggle('expanded', state.sheetExpanded);
  if (!state.sheetExpanded) content.scrollTop = 0;
  haptic('light');
  // Reload chart after transition so tick counts update for new size
  setTimeout(() => {
    if (state.sheetStationName) {
      const activeRange = document.querySelector('.sheet-toggle-btn.active');
      const days = activeRange ? parseInt(activeRange.dataset.range, 10) : 1;
      loadSheetChart(state.sheetStationName, days, state.sheetStation?.id);
    } else if (state.sheetChart) {
      state.sheetChart.resize();
    }
  }, 400);
  // Update expand button icon
  const btn = content.querySelector('.sheet-expand-btn');
  if (btn) updateExpandBtnIcon(btn, state.sheetExpanded);
}

function updateExpandBtnIcon(btn, expanded) {
  btn.innerHTML = expanded
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
  btn.setAttribute('aria-label', expanded ? t('sheetCollapse') : t('sheetExpand'));
}

function setupSheetDrag(content, handleArea, backdrop, closeSheet) {
  if (window.matchMedia('(min-width: 900px)').matches) return;
  let startY = 0, currentY = 0, isDragging = false;
  let velocityY = 0, lastY = 0, lastTime = 0;
  let dragSource = null; // 'handle' or 'content'
  let dragDirection = null; // 'up' or 'down'

  function canDragFromContent() {
    return content.scrollTop <= 0;
  }

  function onTouchStart(e) {
    const isHandle = handleArea && handleArea.contains(e.target);
    if (!isHandle && !canDragFromContent()) return;
    dragSource = isHandle ? 'handle' : 'content';
    dragDirection = null;
    startY = e.touches[0].clientY;
    currentY = 0;
    velocityY = 0;
    lastY = startY;
    lastTime = Date.now();
  }

  function onTouchMove(e) {
    if (dragSource === null) return;
    const touchY = e.touches[0].clientY;
    currentY = touchY - startY;

    if (!isDragging) {
      if (Math.abs(currentY) < 10) return; // dead zone

      if (currentY < 0) {
        // Swiping up — expand from handle or content (when scrolled to top)
        if (state.sheetExpanded) { dragSource = null; return; } // already expanded
        if (dragSource === 'content' && content.scrollTop > 0) { dragSource = null; return; }
        dragDirection = 'up';
      } else {
        // Swiping down
        if (dragSource === 'content' && content.scrollTop > 0) {
          dragSource = null;
          return;
        }
        dragDirection = 'down';
      }
      isDragging = true;
      content.classList.add('dragging');
    }

    let translateY;
    if (dragDirection === 'up') {
      translateY = currentY * 0.3; // lighter resistance pulling up
    } else {
      translateY = currentY;
      if (translateY < 0) {
        translateY = translateY * 0.15; // rubber band if pulling up while dismissing/collapsing
      }
    }

    content.style.transform = `translateY(${translateY}px)`;

    // Only fade backdrop for dismiss gesture (down + not expanded)
    if (dragDirection === 'down' && !state.sheetExpanded) {
      const sheetH = content.offsetHeight || 400;
      const progress = Math.max(0, Math.min(1, translateY / sheetH));
      backdrop.style.opacity = String(1 - progress * 0.8);
    }

    // Track velocity
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocityY = (touchY - lastY) / dt; // px/ms
    }
    lastY = touchY;
    lastTime = now;

    e.preventDefault();
  }

  function onTouchEnd() {
    if (!isDragging) { dragSource = null; return; }
    isDragging = false;
    dragSource = null;
    content.classList.remove('dragging');
    content.classList.add('snapping');

    const sheetH = content.offsetHeight || 400;

    if (dragDirection === 'up' && !state.sheetExpanded) {
      // Expand gesture
      const dist = Math.abs(currentY);
      const speed = Math.abs(velocityY);
      if (dist > 60 || speed > 0.3) {
        content.style.transform = 'translateY(0)';
        content.addEventListener('transitionend', () => {
          content.classList.remove('snapping');
        }, { once: true });
        toggleSheetExpanded(content);
      } else {
        content.style.transform = 'translateY(0)';
        content.addEventListener('transitionend', () => {
          content.classList.remove('snapping');
        }, { once: true });
      }
    } else if (dragDirection === 'down' && state.sheetExpanded) {
      // Collapse gesture
      const dist = currentY;
      const speed = velocityY;
      if (dist > 60 || speed > 0.3) {
        content.style.transform = 'translateY(0)';
        content.addEventListener('transitionend', () => {
          content.classList.remove('snapping');
        }, { once: true });
        toggleSheetExpanded(content);
      } else {
        content.style.transform = 'translateY(0)';
        content.addEventListener('transitionend', () => {
          content.classList.remove('snapping');
        }, { once: true });
      }
    } else if (dragDirection === 'down' && !state.sheetExpanded) {
      // Dismiss gesture (existing behavior)
      const dismiss = currentY > sheetH * 0.3 || velocityY > 0.5;
      if (dismiss) {
        content.style.transform = `translateY(${sheetH + 20}px)`;
        backdrop.style.opacity = '0';
        haptic('light');
        setTimeout(() => {
          content.classList.remove('snapping');
          closeSheet();
        }, 350);
      } else {
        content.style.transform = 'translateY(0)';
        backdrop.style.opacity = '';
        content.addEventListener('transitionend', () => {
          content.classList.remove('snapping');
        }, { once: true });
      }
    } else {
      // Fallback: snap back
      content.style.transform = 'translateY(0)';
      content.addEventListener('transitionend', () => {
        content.classList.remove('snapping');
      }, { once: true });
    }

    dragDirection = null;
  }

  content.addEventListener('touchstart', onTouchStart, { passive: true });
  content.addEventListener('touchmove', onTouchMove, { passive: false });
  content.addEventListener('touchend', onTouchEnd, { passive: true });

  state._sheetDragCleanup = () => {
    content.removeEventListener('touchstart', onTouchStart);
    content.removeEventListener('touchmove', onTouchMove);
    content.removeEventListener('touchend', onTouchEnd);
  };
}

function setupPullToRefresh() {
  const ptrContainer = document.getElementById('ptr-container');
  const ptrSpinner = document.querySelector('#ptr-spinner .native-spinner');
  const app = document.getElementById('app');
  if (!ptrContainer || !app) return;

  const THRESHOLD = 70;
  const MAX_PULL = 130;
  const RESISTANCE = 0.4;
  const HAPTIC_TICK_INTERVAL = 18;

  let startY = 0;
  let pullY = 0;
  let isDragging = false;
  let isRefreshing = false;
  let lastHapticY = 0;
  let crossedThreshold = false;
  let activeView = null;
  let rafId = 0;

  function getActiveView() {
    return document.querySelector('.tab-view.active');
  }

  function isSheetOpen() {
    const sheet = document.getElementById('bottom-sheet');
    return sheet && !sheet.classList.contains('hidden');
  }

  function applyPullTransform() {
    rafId = 0;
    const progress = Math.min(1, pullY / THRESHOLD);
    app.style.transform = `translateY(${pullY}px)`;
    ptrSpinner.style.opacity = progress;
  }

  function onTouchStart(e) {
    if (isRefreshing) return;
    if (isSheetOpen()) return;

    activeView = getActiveView();
    if (!activeView) return;

    // Don't hijack Leaflet map touches
    if (e.target.closest('#map') || e.target.closest('.leaflet-container')) return;

    if (activeView.scrollTop > 0) return;

    startY = e.touches[0].clientY;
    pullY = 0;
    lastHapticY = 0;
    crossedThreshold = false;
  }

  function onTouchMove(e) {
    if (isRefreshing || startY === 0) return;

    if (!activeView) return;

    const touchY = e.touches[0].clientY;
    const rawDelta = touchY - startY;

    // Only pull down
    if (!isDragging) {
      if (rawDelta < 4) return;
      if (activeView.scrollTop > 0) { startY = 0; return; }
      isDragging = true;
      app.classList.add('ptr-pulling');
    }

    e.preventDefault();

    // Rubber-band resistance
    pullY = rawDelta * RESISTANCE;
    if (pullY > MAX_PULL) {
      pullY = MAX_PULL + (pullY - MAX_PULL) * 0.15;
    }

    // Batch visual updates into a single rAF
    if (!rafId) {
      rafId = requestAnimationFrame(applyPullTransform);
    }

    // Haptic ticks during drag
    const hapticDelta = Math.abs(pullY - lastHapticY);
    if (hapticDelta >= HAPTIC_TICK_INTERVAL) {
      haptic('selection');
      lastHapticY = pullY;
    }

    // Threshold crossing haptic
    if (!crossedThreshold && pullY >= THRESHOLD) {
      crossedThreshold = true;
      haptic('medium');
    } else if (crossedThreshold && pullY < THRESHOLD) {
      crossedThreshold = false;
      haptic('selection');
    }
  }

  function onTouchEnd() {
    if (!isDragging) { startY = 0; activeView = null; return; }
    isDragging = false;
    startY = 0;
    activeView = null;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    applyPullTransform();

    app.classList.remove('ptr-pulling');

    if (pullY >= THRESHOLD) {
      // Trigger refresh
      isRefreshing = true;
      app.classList.add('ptr-snapping', 'ptr-refreshing');
      app.style.transform = 'translateY(44px)';
      ptrSpinner.style.opacity = '1';
      haptic('medium');

      doRefresh().finally(() => {
        haptic('success');
        isRefreshing = false;
        app.classList.add('ptr-snapping');
        app.style.transform = '';
        ptrSpinner.style.opacity = '0';

        const cleanup = () => {
          app.classList.remove('ptr-snapping', 'ptr-refreshing');
          ptrSpinner.style.opacity = '';
        };
        app.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 500); // fallback
      });
    } else {
      // Snap back
      app.classList.add('ptr-snapping');
      app.style.transform = '';
      ptrSpinner.style.opacity = '0';

      const cleanup = () => {
        app.classList.remove('ptr-snapping');
        ptrSpinner.style.opacity = '';
      };
      app.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, 500);
    }
  }

  async function doRefresh() {
    const tab = state.currentTab;
    // Reset loaded flags so data actually reloads
    if (state.loaded[tab]) state.loaded[tab] = false;
    const loadId = ++_tabLoadId;
    await loadTabData(tab, loadId);
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
}

// Share a station via the native share sheet (PWA context) with a
// clipboard fallback on desktop. Share text carries name, price and a
// universal Google-Maps web link that resolves on any device.
async function shareStation(station) {
  const addr = [
    [fixEnc(station.street || ''), station.houseNumber || ''].filter(Boolean).join(' ').trim(),
    [station.postCode || '', fixEnc(station.place || '')].filter(Boolean).join(' ').trim(),
  ].filter(Boolean).join(', ');
  const priceLabel = station.price ? `${formatPrice(station.price)}/L` : '';
  const url = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;
  const text = [fixEnc(station.brand || station.name || ''), priceLabel, addr].filter(Boolean).join(' · ');
  haptic('light');
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Tanken', text, url });
    } catch {} // user dismissed the share sheet — not an error
    return;
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    showToast(t('copied'));
  } catch {
    showToast(t('shareFailed'));
  }
}

function showStationSheet(station) {
  const sheet = document.getElementById('bottom-sheet');
  const body = document.getElementById('bottom-sheet-body');
  // The map's bottom sheet only. Stats/Verlauf use openStationDetail.
  sheet.classList.remove('detail-modal', 'centered');
  const priceParts = formatPriceParts(station.price);
  const color = priceColorStable(station.price, station._locationId, station.lat, station.lng);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    || (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const gmapsUrl = isIOS
    ? `comgooglemaps://?daddr=${station.lat},${station.lng}&directionsmode=driving`
    : isAndroid
      ? `google.navigation:q=${station.lat},${station.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
  const appleMapsUrl = isIOS
    ? `maps://?daddr=${station.lat},${station.lng}`
    : `https://maps.apple.com/?daddr=${station.lat},${station.lng}`;

  const sheetIsFav = station.id && state.favourites.includes(station.id);
  body.innerHTML = `
    <div class="sheet-station-header">
      <div style="flex:1;min-width:0">
        <div class="sheet-station-name">${fixEnc(station.name || station.brand)}</div>
        <div class="sheet-station-brand">${fixEnc(station.brand)}</div>
      </div>
      ${station.id ? `<button class="fav-btn sheet-fav-btn${sheetIsFav ? ' active' : ''}" data-station-id="${station.id}" aria-label="${sheetIsFav ? t('removeFavourite') : t('addFavourite')}"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>` : ''}
    </div>
    <div class="sheet-manual-scan-banner-wrap">
      ${station._expiresAt ? `<div class="sheet-manual-scan-banner" data-expires-at="${station._expiresAt}" data-ttl-ms="${MANUAL_SCAN_TTL_MS}">
        <span class="sheet-manual-scan-dot" aria-hidden="true"></span>
        <span class="sheet-manual-scan-text">${t('manualScanLabel')} · ${t('manualScanExpiresIn')} <strong class="sheet-manual-scan-countdown">–:––</strong>${t('manualScanExpiresSuffix') ? ' ' + t('manualScanExpiresSuffix') : ''}</span>
        <div class="sheet-manual-scan-progress" aria-hidden="true"><div class="sheet-manual-scan-progress-bar"></div></div>
      </div>` : ''}
      <button class="sheet-refresh-btn" id="sheet-refresh-btn" type="button"${(isScanBusy() || state.routeMode) ? ' disabled' : ''}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M17.65 6.35A7.958 7.958 0 0012 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        <span>${t('refreshNearby')}</span>
      </button>
    </div>

    <div class="sheet-station-price" style="color:${color}">
      ${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''}
      <span style="font-size:16px;font-weight:400;color:var(--color-hint)">€/L</span>
    </div>
    ${(station.street || station.place) ? `<div class="sheet-info-row">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
      <span>${fixEnc(station.street || '')} ${station.houseNumber || ''}${(station.street || station.houseNumber) && (station.postCode || station.place) ? ', ' : ''}${station.postCode || ''} ${fixEnc(station.place || '')}</span>
    </div>` : ''}
    <div class="sheet-info-row" id="sheet-status-row">
      <span class="sheet-info-icon"><span id="sheet-status-dot" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${station.isOpen ? '#34c759' : '#ff3b30'}"></span></span>
      <span id="sheet-status-text">${station.isOpen ? t('open') : t('closed')}</span>
      ${station.dist ? `<span style="margin-left:auto;color:var(--color-hint)">${station.distApprox ? '~' : ''}${station.dist.toFixed(1)} ${t('kmAway')}</span>` : ''}
    </div>
    ${state.dataTimestamp ? `<div class="sheet-info-row">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
      <span><strong>${t('lastUpdated')}:</strong> ${formatDataAge(state.dataTimestamp)}</span>
    </div>` : ''}
    <div class="sheet-hours-section" id="sheet-hours-section"></div>
    ${(station.lat != null && station.lng != null) ? `<div class="sheet-nav-buttons${isAndroid ? ' android-only' : ''}">
      <a href="${gmapsUrl}" target="_blank" rel="noopener" class="sheet-nav-btn gmaps">
        <img src="/icons/google-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Google Maps</span>
      </a>
      ${isAndroid ? '' : `<a href="${appleMapsUrl}" target="_blank" rel="noopener" class="sheet-nav-btn amaps">
        <img src="/icons/apple-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Apple Maps</span>
      </a>`}
      <button type="button" class="sheet-nav-btn sheet-share-btn" aria-label="${t('share')}">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
        <span>${t('share')}</span>
      </button>
    </div>` : ''}
    <div class="sheet-chart-section">
      <div class="sheet-chart-header-row">
        <div class="sheet-chart-header">${t('priceHistory')}</div>
        <div class="sheet-chart-toggle">
          <button class="sheet-toggle-btn${state.historyDefaultDays === 7 ? '' : ' active'}" data-range="1" id="sheet-range-24h">${t('sheet24h')}</button>
          <button class="sheet-toggle-btn${state.historyDefaultDays === 7 ? ' active' : ''}" data-range="7" id="sheet-range-7d">${t('sheet7d')}</button>
        </div>
      </div>
      <div class="sheet-chart-container">
        <div id="sheet-chart-loading" class="sheet-chart-empty"><div class="spinner"></div></div>
        <canvas id="sheet-price-chart" style="display:none"></canvas>
      </div>
    </div>`;

  const sheetFavBtn = body.querySelector('.sheet-fav-btn');
  if (sheetFavBtn) {
    sheetFavBtn.addEventListener('click', () => toggleFavourite(sheetFavBtn.dataset.stationId));
  }

  body.querySelector('.sheet-share-btn')?.addEventListener('click', () => shareStation(station));

  // Rescan the 25 km circle around this station: same flow as "Hier suchen"
  // but anchored on the tapped pin instead of the user's pick. Close the
  // sheet first so the scan animation on the map is visible.
  const refreshBtn = body.querySelector('#sheet-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      if (refreshBtn.disabled) return;
      if (isScanBusy() || state.routeMode || !state.map) return;
      if (!(Number.isFinite(station.lat) && Number.isFinite(station.lng))) return;
      haptic('light');
      closeSheet();
      state.map.flyTo([station.lat, station.lng], 13, { duration: 0.6 });
      setTimeout(() => { runScanAt(station.lat, station.lng); }, 650);
    });
  }

  // Clean up previous drag listeners if any
  if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }

  sheet.classList.remove('hidden');
  sheet.setAttribute('aria-hidden', 'false');
  const backdrop = sheet.querySelector('.bottom-sheet-backdrop');
  const content = sheet.querySelector('.bottom-sheet-content');
  content.style.transform = '';
  content.classList.remove('dragging', 'snapping', 'expanded');
  state.sheetExpanded = false;
  const handleArea = document.getElementById('sheet-handle-area');

  content.querySelector('.sheet-expand-btn')?.remove();
  const expandBtn = document.createElement('button');
  expandBtn.className = 'sheet-expand-btn';
  updateExpandBtnIcon(expandBtn, false);
  expandBtn.addEventListener('click', () => toggleSheetExpanded(content));
  content.appendChild(expandBtn);

  const closeSheet = () => {
    if (state.sheetChart) { state.sheetChart.destroy(); state.sheetChart = null; }
    if (state._manualScanCountdownTimer) {
      clearInterval(state._manualScanCountdownTimer);
      state._manualScanCountdownTimer = null;
    }
    state.sheetExpanded = false;
    content.style.transform = '';
    content.classList.remove('dragging', 'snapping', 'expanded');
    content.querySelector('.sheet-expand-btn')?.remove();
    content.querySelector('.sheet-desktop-close')?.remove();
    backdrop.style.opacity = '';
    sheet.classList.add('hidden');
    sheet.setAttribute('aria-hidden', 'true');
    backdrop.removeEventListener('click', closeSheet);
    if (state._sheetEscapeListener) {
      document.removeEventListener('keydown', state._sheetEscapeListener);
      state._sheetEscapeListener = null;
    }
    if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }
    if (state.defaultBounds) showResetViewBtn();
  };

  // Tick the "expires in" countdown + progress bar if the station came from
  // a manual scan. The bar starts full and depletes over the TTL window;
  // the banner shifts smoothly from green → yellow → red as it nears 0.
  const manualBanner = body.querySelector('.sheet-manual-scan-banner');
  if (manualBanner) {
    const expiresAt = Number(manualBanner.dataset.expiresAt);
    const ttlMs = Number(manualBanner.dataset.ttlMs) || MANUAL_SCAN_TTL_MS;
    const countdownEl = manualBanner.querySelector('.sheet-manual-scan-countdown');
    const barEl = manualBanner.querySelector('.sheet-manual-scan-progress-bar');
    const tick = () => {
      const remainingMs = expiresAt - Date.now();
      if (remainingMs <= 0) {
        if (countdownEl) countdownEl.textContent = '0:00';
        if (barEl) barEl.style.width = '0%';
        applyManualScanFreshness(manualBanner, 0);
        manualBanner.classList.add('expired');
        if (state._manualScanCountdownTimer) {
          clearInterval(state._manualScanCountdownTimer);
          state._manualScanCountdownTimer = null;
        }
        // Drop the now-expired scan from cache + map.
        pruneManualScans();
        renderStationsOnMap(state.stations || [], { skipFitBounds: true, skipRadiusFilter: true });
        renderStationList(state.stations || []);
        return;
      }
      const totalSec = Math.ceil(remainingMs / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      if (countdownEl) countdownEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
      const t = Math.max(0, Math.min(1, remainingMs / ttlMs));
      if (barEl) barEl.style.width = `${t * 100}%`;
      applyManualScanFreshness(manualBanner, t);
      // Last 60 s gets a faster pulse — colour is already deep red by then.
      manualBanner.classList.toggle('urgent', remainingMs <= 60 * 1000);
    };
    if (state._manualScanCountdownTimer) clearInterval(state._manualScanCountdownTimer);
    tick();
    state._manualScanCountdownTimer = setInterval(tick, 1000);
  }
  backdrop.addEventListener('click', closeSheet);

  // Escape closes the sheet — parity with the stats/history detail modal.
  if (state._sheetEscapeListener) document.removeEventListener('keydown', state._sheetEscapeListener);
  const onSheetEscape = (e) => { if (e.key === 'Escape') closeSheet(); };
  document.addEventListener('keydown', onSheetEscape);
  state._sheetEscapeListener = onSheetEscape;

  // --- Desktop: add close button for side panel. ---
  if (window.matchMedia('(min-width: 900px)').matches) {
    content.querySelector('.sheet-desktop-close')?.remove();
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sheet-desktop-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeSheet);
    content.prepend(closeBtn);
  }

  // --- Real drag-to-dismiss. ---
  setupSheetDrag(content, handleArea, backdrop, closeSheet);

  state.sheetStationName = station.name;
  state.sheetStation = station;
  loadSheetChart(station.name, state.historyDefaultDays || 7, station.id);
  if (station.id) refreshStationStatus(station);

  document.querySelectorAll('.sheet-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('disabled')) return;
      haptic('light');
      document.querySelectorAll('.sheet-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSheetChart(state.sheetStationName, parseInt(btn.dataset.range, 10), state.sheetStation?.id);
    });
  });

}

/**
 * Parse Tankerkönig openingTimes and figure out today's schedule + next transition.
 * openingTimes: [{ text: "Mo-Fr", start: "06:00", end: "22:00" }, ...]
 * wholeDay: boolean
 */
function parseOpeningTimes(openingTimes, wholeDay, isOpen) {
  if (wholeDay) return { label: t('open24h'), todayTimes: null, allTimes: null };
  if (!Array.isArray(openingTimes) || !openingTimes.length) return null;

  const dayAbbr = t('dayAbbr') || ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const now = new Date();
  const todayIdx = now.getDay(); // 0=Sun

  // Tankerkönig uses German day names/ranges like "Mo-Fr", "Sa", "So", "Feiertag"
  const tkDayMap = { 'mo': 1, 'di': 2, 'mi': 3, 'do': 4, 'fr': 5, 'sa': 6, 'so': 0,
                     'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0 };

  function parseDayRange(text) {
    const t = text.toLowerCase().trim();
    // Handle "täglich" / "daily"
    if (t === 'täglich' || t === 'daily') return [0,1,2,3,4,5,6];
    const parts = t.split(/[-–]/);
    if (parts.length === 2) {
      const from = tkDayMap[parts[0].trim()];
      const to = tkDayMap[parts[1].trim()];
      if (from !== undefined && to !== undefined) {
        const days = [];
        let d = from;
        while (true) {
          days.push(d);
          if (d === to) break;
          d = (d + 1) % 7;
        }
        return days;
      }
    }
    // Single day
    const single = tkDayMap[t];
    if (single !== undefined) return [single];
    return null;
  }

  // Build per-day schedule
  const schedule = {}; // dayIdx -> [{ start, end }]
  const allRows = [];
  openingTimes.forEach(ot => {
    const days = parseDayRange(ot.text);
    const entry = { start: ot.start, end: ot.end };
    allRows.push({ text: ot.text, start: ot.start, end: ot.end });
    if (days) {
      days.forEach(d => {
        if (!schedule[d]) schedule[d] = [];
        schedule[d].push(entry);
      });
    }
  });

  // Find today's times
  const todaySlots = schedule[todayIdx] || [];

  // Compute next transition label
  const fmtTime = (t_str) => {
    const parts = t_str.split(':');
    const hm = `${parts[0]}:${parts[1]}`;
    return state.lang === 'de' ? `${hm} Uhr` : hm;
  };
  let label = '';
  const nowMins = now.getHours() * 60 + now.getMinutes();

  if (isOpen && todaySlots.length) {
    // Find which slot we're in and when it ends
    for (const slot of todaySlots) {
      const [eh, em] = slot.end.split(':').map(Number);
      const endMins = eh * 60 + em;
      const [sh, sm] = slot.start.split(':').map(Number);
      const startMins = sh * 60 + sm;
      if (nowMins >= startMins && nowMins < endMins) {
        label = `${t('closesAt')} ${fmtTime(slot.end)}`;
        break;
      }
    }
  } else if (!isOpen && todaySlots.length) {
    // Find next opening today
    for (const slot of todaySlots) {
      const [sh, sm] = slot.start.split(':').map(Number);
      if (nowMins < sh * 60 + sm) {
        label = `${t('opensAt')} ${fmtTime(slot.start)}`;
        break;
      }
    }
    // If nothing left today, find tomorrow
    if (!label) {
      for (let off = 1; off <= 7; off++) {
        const nextDay = (todayIdx + off) % 7;
        if (schedule[nextDay]?.length) {
          label = `${t('opensAt')} ${dayAbbr[nextDay]} ${fmtTime(schedule[nextDay][0].start)}`;
          break;
        }
      }
    }
  }

  // Format all opening times for display
  const fmtHM = (s) => { const p = s.split(':'); return `${p[0]}:${p[1]}`; };
  const allTimes = allRows.map(r => ({ text: r.text, hours: `${fmtHM(r.start)} – ${fmtHM(r.end)}${state.lang === 'de' ? ' Uhr' : ''}` }));

  return { label, todayTimes: todaySlots, allTimes };
}

const STATION_DETAIL_TTL_MS = 60 * 60 * 1000;

// Shared 1-hour cache so the map bottom-sheet and the Stats/Verlauf
// detail modal don't double-fetch when the user flips between them.
async function fetchStationDetailCached(id) {
  if (!id) return null;
  state._stationDetailCache = state._stationDetailCache || {};
  const now = Date.now();
  const cached = state._stationDetailCache[id];
  if (cached && cached.expiresAt > now) return cached.detail;
  let detail;
  try {
    detail = await api(`/api/station/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
  if (!detail || detail.error) return null;
  state._stationDetailCache[id] = { detail, expiresAt: now + STATION_DETAIL_TTL_MS };
  return detail;
}

async function refreshStationStatus(station) {
  if (!station?.id) return;
  const detail = await fetchStationDetailCached(station.id);
  if (!detail) return;
  try {

    const isOpen = Boolean(detail.isOpen);

    // Update open/closed status
    const dot = document.getElementById('sheet-status-dot');
    const txt = document.getElementById('sheet-status-text');
    if (dot && txt) {
      dot.style.background = isOpen ? '#34c759' : '#ff3b30';
      station.isOpen = isOpen;

      // Parse opening times for "closes at" / "opens at" hint
      const hours = parseOpeningTimes(detail.openingTimes, detail.wholeDay, isOpen);
      let statusStr = isOpen ? t('open') : t('closed');
      if (hours?.label) statusStr += ` · ${hours.label}`;
      txt.textContent = statusStr;

      // Show opening hours section
      const hoursContainer = document.getElementById('sheet-hours-section');
      if (hoursContainer && hours?.allTimes?.length) {
        hoursContainer.innerHTML = `
          <div class="sheet-hours-toggle" id="sheet-hours-toggle">
            <span class="sheet-info-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color:var(--color-hint)"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg></span>
            <span>${t('openingHours')}</span>
            <svg class="sheet-hours-chevron" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-left:auto;color:var(--color-hint)"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
          </div>
          <div class="sheet-hours-list" id="sheet-hours-list">
            ${hours.allTimes.map(r => `<div class="sheet-hours-row"><span class="sheet-hours-day">${r.text}</span><span class="sheet-hours-time">${r.hours}</span></div>`).join('')}
          </div>`;
        document.getElementById('sheet-hours-toggle')?.addEventListener('click', () => {
          haptic('light');
          hoursContainer.classList.toggle('expanded');
        });
      }
    }

    // Deliberately do NOT update station.price from detail.php here.
    // Tankerkönig's list.php (what the scheduler scans into our cache)
    // and detail.php drift out of sync — list says 1,93 €, detail says
    // 2,08 € for the same Aral at the same moment. Refreshing the sheet
    // price from detail made the bubble and the sheet disagree. Trust
    // the scan cache; the "Umgebung neu scannen" button is the proper
    // path when the user actually wants fresh prices.
  } catch {
    // Silently fail — cached data stays as fallback
  }
}

// ─── Stats / Verlauf station detail modal ──────────────────────────────
// Opened when the user clicks a station in the Tankstellen-Ranking
// (Stats tab) or one of the cheapest/most-expensive cards (Verlauf tab).
// Shares the #bottom-sheet DOM element so only one detail surface is open
// at a time, but renders its own self-contained modal — no manual-scan
// banner, no "Umgebung neu scannen" button, no drag-to-dismiss, no
// expand button. Just the data.
async function resolveStationDetail(seed) {
  const { id, name, brand, fallbackPrice } = seed || {};
  // Exact id-match against the live map cache. A name/brand fuzzy match
  // would happily return any random "ARAL" pin for a totally different
  // physical station.
  const cached = id ? (state.stations || []).find(s => s.id === id) : null;
  // /api/station/:id handles DE (Tankerkönig detail.php) and AT (cache
  // lookup) transparently — same response shape either way.
  const detail = id ? await fetchStationDetailCached(id) : null;

  const fuel = state.fuelType || 'e5';
  const toNumOrNull = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };

  // Live scanned price wins (matches what the map shows). Fall back to
  // detail.php's fuel-specific price, then to whatever the ranking row
  // carried as a last resort.
  let price = null;
  if (cached && typeof cached.price === 'number' && cached.price > 0) price = cached.price;
  else if (detail && typeof detail[fuel] === 'number' && detail[fuel] > 0) price = detail[fuel];
  else if (typeof fallbackPrice === 'number' && fallbackPrice > 0) price = fallbackPrice;

  const lat = (cached && Number.isFinite(cached.lat)) ? cached.lat : toNumOrNull(detail?.lat);
  const lng = (cached && Number.isFinite(cached.lng)) ? cached.lng : toNumOrNull(detail?.lng);

  const userLat = state.userLat;
  const userLng = state.userLng;
  let dist;
  let distApprox;
  if (cached && Number.isFinite(cached.dist) && cached.dist > 0) {
    dist = cached.dist;
    distApprox = Boolean(cached.distApprox);
  } else if (lat != null && lng != null && Number.isFinite(userLat) && Number.isFinite(userLng)) {
    dist = distanceKm(userLat, userLng, lat, lng);
    distApprox = true;
  }

  const isOpen = typeof detail?.isOpen === 'boolean'
    ? detail.isOpen
    : (typeof cached?.isOpen === 'boolean' ? cached.isOpen : undefined);

  return {
    id: id || detail?.id || cached?.id || '',
    name: cached?.name || detail?.name || name || '',
    brand: cached?.brand || detail?.brand || brand || '',
    street: detail?.street || cached?.street || '',
    houseNumber: detail?.houseNumber || cached?.houseNumber || '',
    postCode: (detail?.postCode != null && detail.postCode !== '')
      ? String(detail.postCode)
      : (cached?.postCode || ''),
    place: detail?.place || cached?.place || '',
    lat,
    lng,
    price,
    isOpen,
    openingTimes: detail?.openingTimes ?? null,
    wholeDay: Boolean(detail?.wholeDay),
    dist,
    distApprox,
  };
}

function renderStationDetailSkeleton(seed) {
  const name = fixEnc(seed?.name || seed?.brand || '');
  const brand = fixEnc(seed?.brand || '');
  return `
    <div class="sheet-station-header">
      <div style="flex:1;min-width:0">
        <div class="sheet-station-name">${name}</div>
        ${brand ? `<div class="sheet-station-brand">${brand}</div>` : ''}
      </div>
    </div>
    <div class="detail-skeleton" aria-hidden="true">
      <div class="detail-skeleton-line detail-skeleton-price"></div>
      <div class="detail-skeleton-line"></div>
      <div class="detail-skeleton-line short"></div>
      <div class="detail-skeleton-line short"></div>
      <div class="detail-skeleton-block"></div>
    </div>
  `;
}

function renderStationDetailHtml(station) {
  const showPrice = station.price != null && station.price > 0;
  const priceParts = showPrice ? formatPriceParts(station.price) : null;
  const color = showPrice ? priceColorStable(station.price, station._locationId, station.lat, station.lng) : '';
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    || (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const hasCoords = Number.isFinite(station.lat) && Number.isFinite(station.lng);
  const gmapsUrl = hasCoords
    ? (isIOS
      ? `comgooglemaps://?daddr=${station.lat},${station.lng}&directionsmode=driving`
      : isAndroid
        ? `google.navigation:q=${station.lat},${station.lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`)
    : null;
  const appleMapsUrl = hasCoords
    ? (isIOS
      ? `maps://?daddr=${station.lat},${station.lng}`
      : `https://maps.apple.com/?daddr=${station.lat},${station.lng}`)
    : null;

  const isFav = station.id && state.favourites.includes(station.id);
  const hours = parseOpeningTimes(station.openingTimes, station.wholeDay, Boolean(station.isOpen));

  const knownOpen = typeof station.isOpen === 'boolean';
  let statusLabel = '';
  if (knownOpen) statusLabel = station.isOpen ? t('open') : t('closed');
  if (hours?.label) statusLabel = statusLabel ? `${statusLabel} · ${hours.label}` : hours.label;

  const hasAddress = Boolean(station.street || station.place);
  const hasDist = typeof station.dist === 'number' && Number.isFinite(station.dist);

  return `
    <div class="sheet-station-header">
      <div style="flex:1;min-width:0">
        <div class="sheet-station-name">${fixEnc(station.name || station.brand || '')}</div>
        ${station.brand ? `<div class="sheet-station-brand">${fixEnc(station.brand)}</div>` : ''}
      </div>
      ${station.id ? `<button class="fav-btn sheet-fav-btn${isFav ? ' active' : ''}" data-station-id="${station.id}" aria-label="${isFav ? t('removeFavourite') : t('addFavourite')}"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>` : ''}
    </div>
    ${showPrice ? `<div class="sheet-station-price" style="color:${color}">
      ${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''}
      <span style="font-size:16px;font-weight:400;color:var(--color-hint)">€/L</span>
    </div>` : ''}
    ${hasAddress ? `<div class="sheet-info-row">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
      <span>${fixEnc(station.street || '')}${station.houseNumber ? ' ' + station.houseNumber : ''}${(station.street || station.houseNumber) && (station.postCode || station.place) ? ', ' : ''}${station.postCode || ''} ${fixEnc(station.place || '')}</span>
    </div>` : ''}
    ${(knownOpen || hasDist) ? `<div class="sheet-info-row">
      <span class="sheet-info-icon">${knownOpen ? `<span style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${station.isOpen ? '#34c759' : '#ff3b30'}"></span>` : ''}</span>
      <span>${statusLabel}</span>
      ${hasDist ? `<span style="margin-left:auto;color:var(--color-hint)">${station.distApprox ? '~' : ''}${station.dist.toFixed(1)} ${t('kmAway')}</span>` : ''}
    </div>` : ''}
    ${state.dataTimestamp ? `<div class="sheet-info-row">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
      <span><strong>${t('lastUpdated')}:</strong> ${formatDataAge(state.dataTimestamp)}</span>
    </div>` : ''}
    ${hours?.allTimes?.length ? `<div class="sheet-hours-section" id="detail-hours-section">
      <div class="sheet-hours-toggle" id="detail-hours-toggle">
        <span class="sheet-info-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color:var(--color-hint)"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg></span>
        <span>${t('openingHours')}</span>
        <svg class="sheet-hours-chevron" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-left:auto;color:var(--color-hint)"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
      </div>
      <div class="sheet-hours-list">
        ${hours.allTimes.map(r => `<div class="sheet-hours-row"><span class="sheet-hours-day">${fixEnc(r.text)}</span><span class="sheet-hours-time">${r.hours}</span></div>`).join('')}
      </div>
    </div>` : ''}
    ${gmapsUrl ? `<div class="sheet-nav-buttons${isAndroid ? ' android-only' : ''}">
      <a href="${gmapsUrl}" target="_blank" rel="noopener" class="sheet-nav-btn gmaps">
        <img src="/icons/google-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Google Maps</span>
      </a>
      ${isAndroid ? '' : `<a href="${appleMapsUrl}" target="_blank" rel="noopener" class="sheet-nav-btn amaps">
        <img src="/icons/apple-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Apple Maps</span>
      </a>`}
      <button type="button" class="sheet-nav-btn sheet-share-btn" aria-label="${t('share')}">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
        <span>${t('share')}</span>
      </button>
    </div>` : ''}
    <div class="sheet-chart-section">
      <div class="sheet-chart-header-row">
        <div class="sheet-chart-header">${t('priceHistory')}</div>
        <div class="sheet-chart-toggle">
          <button class="sheet-toggle-btn${state.historyDefaultDays === 7 ? '' : ' active'}" data-range="1">${t('sheet24h')}</button>
          <button class="sheet-toggle-btn${state.historyDefaultDays === 7 ? ' active' : ''}" data-range="7">${t('sheet7d')}</button>
        </div>
      </div>
      <div class="sheet-chart-container">
        <div id="sheet-chart-loading" class="sheet-chart-empty"><div class="spinner"></div></div>
        <canvas id="sheet-price-chart" style="display:none"></canvas>
      </div>
    </div>
  `;
}

async function openStationDetail(seed) {
  const sheet = document.getElementById('bottom-sheet');
  const body = document.getElementById('bottom-sheet-body');
  if (!sheet || !body || !seed) return;

  // Clean up any prior state — also kills a map bottom-sheet if it was open
  if (state.sheetChart) { state.sheetChart.destroy(); state.sheetChart = null; }
  if (state._manualScanCountdownTimer) {
    clearInterval(state._manualScanCountdownTimer);
    state._manualScanCountdownTimer = null;
  }
  if (state._sheetDragCleanup) { state._sheetDragCleanup(); state._sheetDragCleanup = null; }
  if (state._detailEscapeListener) {
    document.removeEventListener('keydown', state._detailEscapeListener);
    state._detailEscapeListener = null;
  }

  sheet.classList.remove('centered'); // legacy: ensure no lingering class
  sheet.classList.add('detail-modal');
  sheet.classList.remove('hidden');
  sheet.setAttribute('aria-hidden', 'false');

  const backdrop = sheet.querySelector('.bottom-sheet-backdrop');
  const content = sheet.querySelector('.bottom-sheet-content');
  content.style.transform = '';
  content.classList.remove('dragging', 'snapping', 'expanded');
  state.sheetExpanded = false;
  content.querySelector('.sheet-expand-btn')?.remove();
  content.querySelector('.sheet-desktop-close')?.remove();
  content.querySelector('.detail-modal-close')?.remove();

  // Token tracks "this modal session". If the user opens another detail
  // while this one's data is still loading, the older one bails out.
  const token = (state._detailToken = (state._detailToken || 0) + 1);

  const closeDetail = () => {
    if (state.sheetChart) { state.sheetChart.destroy(); state.sheetChart = null; }
    if (state._detailEscapeListener) {
      document.removeEventListener('keydown', state._detailEscapeListener);
      state._detailEscapeListener = null;
    }
    content.querySelector('.detail-modal-close')?.remove();
    backdrop.removeEventListener('click', closeDetail);
    sheet.classList.add('hidden');
    sheet.classList.remove('detail-modal');
    sheet.setAttribute('aria-hidden', 'true');
    body.innerHTML = '';
    state.sheetStation = null;
    state.sheetStationName = null;
  };

  const closeBtn = document.createElement('button');
  closeBtn.className = 'detail-modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', t('closeHourView'));
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  closeBtn.addEventListener('click', closeDetail);
  content.appendChild(closeBtn);

  const onEscape = (e) => { if (e.key === 'Escape') closeDetail(); };
  document.addEventListener('keydown', onEscape);
  state._detailEscapeListener = onEscape;
  backdrop.addEventListener('click', closeDetail);

  // 1. Skeleton with whatever we know from the click seed
  body.innerHTML = renderStationDetailSkeleton(seed);

  // 2. Resolve full data (cache + detail endpoint)
  const station = await resolveStationDetail(seed);
  if (token !== state._detailToken) return; // newer detail opened during fetch
  if (sheet.classList.contains('hidden')) return; // user closed during fetch

  // 3. Full render
  body.innerHTML = renderStationDetailHtml(station);

  // Favourite toggle
  const favBtn = body.querySelector('.sheet-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => toggleFavourite(favBtn.dataset.stationId));
  }
  body.querySelector('.sheet-share-btn')?.addEventListener('click', () => shareStation(station));
  // Opening-hours expand
  const hoursToggle = body.querySelector('#detail-hours-toggle');
  if (hoursToggle) {
    hoursToggle.addEventListener('click', () => {
      haptic('light');
      document.getElementById('detail-hours-section')?.classList.toggle('expanded');
    });
  }
  // Chart range toggle
  body.querySelectorAll('.sheet-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('disabled')) return;
      haptic('light');
      body.querySelectorAll('.sheet-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSheetChart(state.sheetStationName, parseInt(btn.dataset.range, 10), state.sheetStation?.id);
    });
  });

  // 4. Chart
  state.sheetStation = station;
  state.sheetStationName = station.name;
  loadSheetChart(station.name, state.historyDefaultDays || 7, station.id);
}

// Lazy-load admin-curated scan locations once and cache them. Used to
// decide whether a German station has coverage (i.e. lies within some
// scan location's radius); if not, we skip the API call and surface the
// "request a scan location" hint directly.
async function ensureScanLocations() {
  if (Array.isArray(state._scanLocations)) return state._scanLocations;
  if (state._scanLocationsPromise) return state._scanLocationsPromise;
  state._scanLocationsPromise = (async () => {
    try {
      const res = await api('/api/scan-locations');
      const list = Array.isArray(res?.locations) ? res.locations : [];
      state._scanLocations = list;
      return list;
    } catch {
      state._scanLocations = [];
      return [];
    } finally {
      state._scanLocationsPromise = null;
    }
  })();
  return state._scanLocationsPromise;
}

// Haversine distance in km between two lat/lng pairs.
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// True if any DE scan location's radius covers this station. Austrian
// stations are covered by the grid scan everywhere, so they short-circuit
// to true.
function isStationCovered(station, scanLocations) {
  if (!station || !Number.isFinite(station.lat) || !Number.isFinite(station.lng)) return false;
  if (isInAustria(station.lat, station.lng)) return true;
  const locs = Array.isArray(scanLocations) ? scanLocations : [];
  for (const loc of locs) {
    if (loc.country !== 'de') continue;
    const r = Number(loc.radiusKm) > 0 ? Number(loc.radiusKm) : 25;
    if (distanceKm(station.lat, station.lng, loc.lat, loc.lng) <= r) return true;
  }
  return false;
}

// True if a manual scan at (lat, lng) would be redundant — either AT
// (whole country grid-scanned) or DE inside / immediately neighbouring
// an existing scan location's radius (loc.radiusKm + 10 km buffer).
const ALREADY_COVERED_BUFFER_KM = 10;
async function isLocationAlreadyCovered(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (isInAustria(lat, lng)) return true;
  const scanLocs = await ensureScanLocations();
  for (const loc of scanLocs || []) {
    if (loc.country !== 'de') continue;
    const r = Number(loc.radiusKm) > 0 ? Number(loc.radiusKm) : 25;
    if (distanceKm(lat, lng, loc.lat, loc.lng) <= r + ALREADY_COVERED_BUFFER_KM) return true;
  }
  return false;
}

// Render the empty state for the per-station price chart.
// - notCovered=true (DE only): no admin scan location covers this station,
//   so we'll never have history — surface the "request a scan location" CTA.
// - notCovered=false: station IS covered (or AT) but we just don't have
//   enough rows yet; show the neutral "data is accumulating" hint.
function renderSheetChartEmptyState(loadingEl, station, notCovered = false) {
  if (!loadingEl) return;

  if (!notCovered) {
    loadingEl.innerHTML = `<span style="opacity:0.75">${t('historyAccumulating')}</span>`;
    return;
  }

  // Germany, station not covered: explain why and offer the location request flow.
  loadingEl.innerHTML = `
    <div class="sheet-chart-empty-msg">
      <div class="sheet-chart-empty-title">${t('stationNotScanned')}</div>
      <div class="sheet-chart-empty-hint">${t('stationNotScannedHint')}</div>
      <button type="button" class="sheet-chart-empty-btn" id="sheet-chart-request-btn">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>${t('requestScanLocation')}</span>
      </button>
    </div>`;
  const btn = document.getElementById('sheet-chart-request-btn');
  if (btn && station) {
    btn.addEventListener('click', () => {
      haptic('light');
      const label = [station.name || station.brand, station.place].filter(Boolean).join(' · ');
      // Build a "Street 12, 12345 City" string from whichever pieces exist
      // so the request sheet's address field starts pre-filled and matches
      // the station the user just tapped.
      const streetLine = [
        [station.street, station.houseNumber].filter(Boolean).join(' ').trim(),
      ].filter(Boolean).join('');
      const cityLine = [station.postCode, station.place].filter(Boolean).join(' ').trim();
      const address = [streetLine, cityLine].filter(Boolean).join(', ');
      openLocationRequestSheet({
        lat: station.lat,
        lng: station.lng,
        name: label,
        address,
      });
    });
  }
}

function updateSheetToggleAvailability({ has24h, has7d }) {
  document.querySelectorAll('.sheet-toggle-btn').forEach(btn => {
    const range = parseInt(btn.dataset.range, 10);
    const enabled = range === 1 ? has24h : has7d;
    btn.classList.toggle('disabled', !enabled);
  });
}

async function loadSheetChart(stationName, days = 1, stationId) {
  if (state.sheetChart) { state.sheetChart.destroy(); state.sheetChart = null; }
  const loading = document.getElementById('sheet-chart-loading');
  const canvas = document.getElementById('sheet-price-chart');
  if (!loading || !canvas) return;
  loading.style.display = '';
  loading.innerHTML = '<div class="spinner"></div>';
  canvas.style.display = 'none';

  try {
    // For German stations: if no admin scan location covers the station's
    // 25 km radius, we know we won't have meaningful history. Skip the API
    // call entirely and show the request CTA instead. (AT short-circuits
    // to "covered" inside isStationCovered.)
    const station = state.sheetStation;
    if (station && Number.isFinite(station.lat) && Number.isFinite(station.lng) && !isInAustria(station.lat, station.lng)) {
      const scanLocs = await ensureScanLocations();
      if (!isStationCovered(station, scanLocs)) {
        updateSheetToggleAvailability({ has24h: false, has7d: false });
        renderSheetChartEmptyState(loading, station, true);
        return;
      }
    }

    const idParam = stationId ? `&id=${encodeURIComponent(stationId)}` : '';
    const fuelParam = state.fuelType ? `&fuel=${encodeURIComponent(state.fuelType)}` : '';
    const data = await api(`/api/history?station=${encodeURIComponent(stationName)}${idParam}${fuelParam}`);
    // Backend returns an array of station entries when ≥ 2 rows exist; an
    // object {entries, extremes} otherwise. Treat both "no rows" cases the same.
    const hasSeries = Array.isArray(data) && data.length >= 2;
    if (!hasSeries) {
      updateSheetToggleAvailability({ has24h: false, has7d: false });
      renderSheetChartEmptyState(loading, station, false);
      return;
    }

    const countWithin = (d) => {
      const c = new Date();
      c.setDate(c.getDate() - d);
      return data.filter(x => new Date(x.timestamp) >= c).length;
    };
    const has24h = countWithin(1) >= 1;
    const has7d = countWithin(7) >= 2;
    updateSheetToggleAvailability({ has24h, has7d });

    // If the requested range is empty but the other has data, auto-switch
    // rather than showing a stale fallback (= honest UX).
    if (days <= 1 && !has24h && has7d) days = 7;
    else if (days === 7 && !has7d && has24h) days = 1;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const filtered = data.filter(d => new Date(d.timestamp) >= cutoff);
    if (filtered.length < 1) {
      loading.style.display = '';
      canvas.style.display = 'none';
      const msg = days <= 1 ? t('noRecent24h') : t('noRecent7d');
      loading.innerHTML = `<span style="opacity:0.75">${msg}</span>`;
      return;
    }

    // Sync the active toggle button with whichever range we ended up rendering.
    document.querySelectorAll('.sheet-toggle-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.range, 10) === days);
    });

    // For 7-day view: aggregate to 1 value per day (lowest price)
    let chartData;
    if (days === 7) {
      const dayMap = {};
      filtered.forEach(d => {
        const dt = new Date(d.timestamp);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        if (!dayMap[key] || d.min_price < dayMap[key].min_price) {
          dayMap[key] = { timestamp: key, min_price: d.min_price };
        }
      });
      chartData = Object.values(dayMap);
    } else {
      chartData = filtered;
    }

    const hintColor = getComputedStyle(document.body).getPropertyValue('--color-hint') || '#999';

    // Anchor the x-axis to a stable "last 24 h" / "last 7 d" window — without
    // an explicit min/max the linear scale spans only the data range, and
    // Chart.js's nice-numbers algorithm picks ticks in raw-ms space, which
    // strips down to chaotic HH:MM labels like "06:06 / 09:53 / 20:00".
    const HOUR_MS = 60 * 60 * 1000;
    const DAY_MS = 24 * HOUR_MS;
    const xMax = Date.now();
    const xMin = xMax - (days <= 1 ? DAY_MS : 7 * DAY_MS);

    const points = chartData.map(d => ({ x: new Date(d.timestamp).getTime(), y: d.min_price }));
    const prices = chartData.map(d => d.min_price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);

    // Step-aligned y-axis so ticks fall on round 0.01–0.20€ values. The old
    // forced min/max + maxTicksLimit combo let Chart.js insert the raw
    // bounds as ticks alongside "nice" intermediates (e.g. 1.84 next to
    // 1.85), which read as noise. yMin/yMax must be step multiples so
    // Chart.js's stepSize lays ticks at clean boundaries.
    const yRange = Math.max(maxP - minP, 0.01);
    const Y_STEPS = [0.01, 0.02, 0.05, 0.10, 0.20];
    const yStep = Y_STEPS.find(s => yRange / s <= 3) || 0.20;
    const yEps = yStep * 0.15;
    const yMin = Math.max(0, Math.floor((minP - yEps) / yStep) * yStep);
    const yMax = Math.ceil((maxP + yEps) / yStep) * yStep;

    const pad2 = (n) => String(n).padStart(2, '0');
    const formatX = (ms) => {
      const dt = new Date(ms);
      if (days <= 1) return `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;
      return formatShortDate(dt);
};

    // Manually computed evenly spaced ticks aligned to clock boundaries.
    // 24h → 5 ticks every 6h ending at the most recent local-hour boundary.
    // 7d  → one tick per local midnight inside the window.
    const buildXTicks = () => {
      const out = [];
      if (days <= 1) {
        const anchor = new Date(xMax);
        anchor.setMinutes(0, 0, 0);
        const end = anchor.getTime();
        for (let k = 4; k >= 0; k--) {
          const t = end - k * 6 * HOUR_MS;
          if (t >= xMin && t <= xMax) out.push({ value: t });
        }
      } else {
        const anchor = new Date(xMax);
        anchor.setHours(0, 0, 0, 0);
        const end = anchor.getTime();
        for (let k = 7; k >= 0; k--) {
          const t = end - k * DAY_MS;
          if (t >= xMin && t <= xMax) out.push({ value: t });
        }
      }
      return out;
    };

    loading.style.display = 'none';
    canvas.style.display = 'block';

    state.sheetChart = new Chart(canvas, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Min',
            data: points,
            borderColor: '#34c759',
            backgroundColor: 'rgba(52,199,89,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: points.length < 2 || days === 7 ? 3 : 0,
            pointBackgroundColor: '#34c759',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // The popup that hosts this chart already has its own scale-in
        // entrance — Chart.js's default growing-from-zero animation on
        // top of that reads as a competing "fly in". Suppress it.
        animation: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const ms = items[0].parsed?.x;
                if (!Number.isFinite(ms)) return '';
                const dt = new Date(ms);
                if (days <= 1) return `${pad2(dt.getHours())}:${pad2(dt.getMinutes())} Uhr`;
                return `${dt.getDate()}.${dt.getMonth() + 1}. ${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;
              },
              label: (ctx) => formatPrice(ctx.parsed.y)
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: xMin,
            max: xMax,
            afterBuildTicks: (axis) => { axis.ticks = buildXTicks(); },
            ticks: {
              color: hintColor.trim() || '#999',
              font: { size: 10 },
              autoSkip: false,
              callback: (val) => formatX(val),
            },
            grid: { display: false }
          },
          y: {
            min: yMin,
            max: yMax,
            ticks: {
              color: hintColor.trim() || '#999',
              font: { size: 10 },
              stepSize: yStep,
              callback: v => formatPrice(v),
            },
            grid: { color: 'rgba(128,128,128,0.08)' }
          }
        }
      }
    });
  } catch {
    updateSheetToggleAvailability({ has24h: false, has7d: false });
    loading.innerHTML = `<span>${t('noHistory')}</span>`;
  }
}

async function loadLocationPickers() {
  try {
    const country = state.activeCountry || getActiveCountry();
    const [histRes, scanRes] = await Promise.all([
      api(`/api/history?locations=list&country=${country}`),
      api('/api/scan-locations').catch(() => null),
    ]);
    const locations = histRes && histRes.locations ? histRes.locations : [];
    const scanLocs = scanRes && Array.isArray(scanRes.locations) ? scanRes.locations : [];
    const nameById = new Map(scanLocs.map(l => [l.id, l.name]));
    state.availableLocations = locations;

    // Drop IDs that no longer match any admin scan location. They're
    // legacy/orphan rows in price_history (renames, deletions) — exposing
    // them as "Unbekannter Standort" entries just clutters the dropdown.
    const knownLocations = locations.filter(locId => nameById.has(locId));

    // Default the picker to the scan location closest to the user when
    // we still have a GPS pin and the user hasn't yet overridden the
    // dropdown for this country. Without coords (e.g. denied permission)
    // we fall back to the "Alle Standorte" baseline.
    let autoPicked = false;
    if (!state.locationPickerTouched
      && Number.isFinite(state.userLat)
      && Number.isFinite(state.userLng)
      && knownLocations.length) {
      const knownIdSet = new Set(knownLocations);
      const candidates = scanLocs.filter(l =>
        l.country === country
        && knownIdSet.has(l.id)
        && Number.isFinite(l.lat)
        && Number.isFinite(l.lng)
      );
      if (candidates.length) {
        let nearest = candidates[0];
        let nearestDist = distanceKm(state.userLat, state.userLng, nearest.lat, nearest.lng);
        for (let i = 1; i < candidates.length; i++) {
          const d = distanceKm(state.userLat, state.userLng, candidates[i].lat, candidates[i].lng);
          if (d < nearestDist) { nearestDist = d; nearest = candidates[i]; }
        }
        state.selectedLocation = nearest.id;
        autoPicked = true;
      }
    }

    [
      { picker: 'history-location-picker', hint: 'history-location-hint' },
      { picker: 'stats-location-picker', hint: 'stats-location-hint' },
    ].forEach(({ picker: id, hint: hintId }) => {
      const picker = document.getElementById(id);
      if (!picker) return;
      // Keep the first "Alle Standorte" option
      while (picker.options.length > 1) picker.remove(1);
      knownLocations.forEach(locId => {
        const opt = document.createElement('option');
        opt.value = locId;
        opt.textContent = nameById.get(locId);
        picker.appendChild(opt);
      });
      picker.value = state.selectedLocation;
      enhanceSelectForDesktop(picker);
      // Drive the parent wrapper visibility so the hint hides with it.
      const wrap = picker.closest('.location-picker-row') || picker;
      wrap.style.display = knownLocations.length > 0 ? '' : 'none';
      const hint = document.getElementById(hintId);
      if (hint) hint.hidden = !autoPicked || !state.selectedLocation;
    });
  } catch { /* ignore */ }
}

async function fetchHistoryData() {
  const country = state.activeCountry || getActiveCountry();
  const url = state.selectedLocation
    ? `/api/history?location=${encodeURIComponent(state.selectedLocation)}&country=${country}`
    : `/api/history?country=${country}`;
  try {
    const res = await api(url);
    // Support both old format (plain array) and new format ({ entries, extremes })
    if (Array.isArray(res)) {
      state.priceExtremes = null;
      return res;
    }
    state.priceExtremes = res.extremes || null;
    return Array.isArray(res.entries) ? res.entries : [];
  } catch { state.priceExtremes = null; return []; }
}

async function loadHistoryTab() {
  state.loaded.history = true;
  showHistorySkeleton();
  await loadLocationPickers();
  state.history = await fetchHistoryData();
  renderChart(state.history);
  state.historyKey = currentDataKey();
  syncCountryChips();
  wireCountryChips('history-country-chips');

  const historyPicker = document.getElementById('history-location-picker');
  if (historyPicker) {
    historyPicker.addEventListener('change', async () => {
      state.locationPickerTouched = true;
      state.selectedLocation = historyPicker.value;
      // Sync stats picker and tear down the "auto-picked" hint on both
      // since the user has just made their own choice.
      const statsPicker = document.getElementById('stats-location-picker');
      if (statsPicker) statsPicker.value = state.selectedLocation;
      document.getElementById('history-location-hint')?.setAttribute('hidden', '');
      document.getElementById('stats-location-hint')?.setAttribute('hidden', '');
      state.history = await fetchHistoryData();
      renderChart(state.history);
      state.historyKey = currentDataKey();
      // Reload stats if already loaded
      if (state.loaded.stats) {
        await reloadStats();
      }
    });
  }

  document.querySelectorAll('#view-history .chip[data-days]').forEach(chip => {
    chip.addEventListener('click', () => {
      haptic('light');
      document.querySelectorAll('#view-history .chip[data-days]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.historyDays = parseInt(chip.dataset.days, 10);
      renderChart(state.history);
    });
  });

}

// History counterpart to showStatsSkeleton: shimmering bones in the hero,
// the price-chart box and the summary cards while the first fetch runs.
// The hero (#history-stats) and summary (#history-summary) get overwritten
// by their render functions; the chart overlay is removed explicitly.
function showHistorySkeleton() {
  const bone = (style) => `<div class="skeleton-bone" style="${style}"></div>`;
  const statsEl = document.getElementById('history-stats');
  if (statsEl) {
    statsEl.style.display = '';
    statsEl.innerHTML = `
      <div class="history-hero-card" aria-hidden="true">
        <div class="history-hero-top">
          <div style="flex:1;min-width:0">
            ${bone('width:34%;height:11px')}
            ${bone('width:50%;height:30px;margin-top:11px')}
            ${bone('width:128px;height:13px;margin-top:12px;border-radius:999px')}
          </div>
          ${bone('width:26px;height:26px;border-radius:8px;flex-shrink:0')}
        </div>
      </div>`;
  }
  const chartContainer = document.querySelector('#view-history .chart-container');
  if (chartContainer && !chartContainer.querySelector('.chart-skeleton')) {
    const sk = document.createElement('div');
    sk.className = 'skeleton-bone chart-skeleton';
    sk.setAttribute('aria-hidden', 'true');
    chartContainer.appendChild(sk);
  }
  const summary = document.getElementById('history-summary');
  if (summary) {
    const card = () => `
      <div class="history-extreme-card" aria-hidden="true">
        ${bone('width:34px;height:34px;border-radius:10px;flex-shrink:0')}
        <div style="flex:1;min-width:0">
          ${bone('width:55%;height:11px')}
          ${bone('width:70%;height:18px;margin-top:7px')}
          ${bone('width:45%;height:11px;margin-top:7px')}
        </div>
      </div>`;
    summary.innerHTML = `
      <div class="section-header">${t('summary')}</div>
      <div class="history-extreme-row">${card()}${card()}</div>`;
  }
}

// Drop the chart skeleton overlay once we're about to draw (or clear) the
// chart. Safe to call on every render — it's a no-op when none is present.
function removeHistoryChartSkeleton() {
  document.querySelector('#view-history .chart-skeleton')?.remove();
}

function renderChart(data) {
  removeHistoryChartSkeleton();
  if (!data.length) {
    if (state.chart) { state.chart.destroy(); state.chart = null; }
    if (state.hourChart) { state.hourChart.destroy(); state.hourChart = null; }
    document.getElementById('hour-chart-section').style.display = 'none';
    const statsEl = document.getElementById('history-stats');
    if (statsEl) { statsEl.style.display = 'none'; statsEl.innerHTML = ''; }
    const summary = document.getElementById('history-summary');
    const emptyCard = (label, accent) => `
      <div class="history-extreme-card is-empty" style="--accent:${accent}">
        <div class="history-extreme-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19 13H5v-2h14v2z"/></svg>
        </div>
        <div class="history-extreme-body">
          <div class="history-extreme-label">${label}</div>
          <div class="history-extreme-value">–</div>
          <div class="history-extreme-station">–</div>
        </div>
      </div>`;
    summary.innerHTML = `
      <div class="empty-state-inline">${t('noHistory')}</div>
      <div class="section-header">${t('summary')}</div>
      <div class="history-extreme-row">
        ${emptyCard(t('lowestPrice'), 'var(--color-good)')}
        ${emptyCard(t('highestPrice'), 'var(--color-bad)')}
      </div>`;
    return;
  }
  let filtered = data;
  if (state.historyDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - state.historyDays);
    filtered = data.filter(d => new Date(d.timestamp) >= cutoff);
  }
  if (!filtered.length) {
    if (state.chart) { state.chart.destroy(); state.chart = null; }
    if (state.hourChart) { state.hourChart.destroy(); state.hourChart = null; }
    document.getElementById('hour-chart-section').style.display = 'none';
    const statsEl = document.getElementById('history-stats');
    if (statsEl) { statsEl.style.display = 'none'; statsEl.innerHTML = ''; }
    const summary = document.getElementById('history-summary');
    const msg = state.historyDays > 0
      ? t('noRecentRange').replace('{days}', String(state.historyDays))
      : t('noHistory');
    summary.innerHTML = `
      <div style="text-align:center;padding:1.5rem 0 0.5rem;opacity:0.45;font-size:13px">${msg}</div>`;
    return;
  }

  // Aggregate by day
  const dayMap = {};
  filtered.forEach(d => {
    const dt = new Date(d.timestamp);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    if (!dayMap[key]) {
      dayMap[key] = { key, timestamp: key, entries: [], mins: [], avgs: [], maxs: [] };
    }
    dayMap[key].entries.push(d);
    dayMap[key].mins.push(d.min_price);
    dayMap[key].avgs.push(d.avg_price);
    dayMap[key].maxs.push(d.max_price);
  });
  const daily = Object.values(dayMap).map(g => ({
    key: g.key,
    timestamp: g.timestamp,
    min_price: Math.min(...g.mins),
    avg_price: g.avgs.reduce((a, b) => a + b, 0) / g.avgs.length,
    max_price: Math.max(...g.maxs),
    entries: g.entries,
  }));

  renderHistoryStats(data);

  const labels = daily.map(d => {
    const dt = new Date(d.timestamp);
    return `${dt.getDate()}.${dt.getMonth() + 1}`;
  });

  const ctx = document.getElementById('price-chart');
  const styles = getComputedStyle(document.body);
  const hintColor = styles.getPropertyValue('--color-hint').trim() || '#999';
  const sepColor = styles.getPropertyValue('--color-separator').trim() || '#e0e0e0';
  const bgSecondary = styles.getPropertyValue('--color-bg-secondary').trim() || '#f2f2f7';
  // Skip the entry animation when we're swapping data (e.g. location
  // switch) — animating the y-axis on each switch reads as a jitter.
  const isUpdate = !!state.chart;
  if (state.chart) state.chart.destroy();
  if (state.hourChart) { state.hourChart.destroy(); state.hourChart = null; }
  document.getElementById('hour-chart-section').style.display = 'none';

  // Per-day rank colour mapped to each day's min_price — cheap → green,
  // expensive → red. Used for points, the latest-day glow, and the
  // hover tooltip's price text.
  const minVals = daily.map(d => d.min_price);
  const minLo = Math.min(...minVals);
  const minHi = Math.max(...minVals);
  const minRange = Math.max(minHi - minLo, 0.0001);
  const dayColor = (price) => rankColor((price - minLo) / minRange);
  const pointColors = daily.map(d => dayColor(d.min_price));

  const lastIdx = daily.length - 1;
  const minBaseRadius = daily.length < 25 ? 4 : 2.5;
  const pointRadii = daily.map((_, i) => i === lastIdx ? 7 : minBaseRadius);
  const pointHoverRadii = daily.map((_, i) => i === lastIdx ? 10 : minBaseRadius + 3);

  // Horizontal gradient stroke — one CanvasGradient spanning the chart
  // width with a colour stop at each day's x position, sampled from
  // that day's rank colour. Matches the stats hour chart treatment so
  // both tabs read in the same visual language.
  const buildHistoryLineGradient = (chartCtx) => {
    const chart = chartCtx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return '#ff9500';
    const g = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    const denom = Math.max(1, pointColors.length - 1);
    pointColors.forEach((color, i) => {
      g.addColorStop(Math.max(0, Math.min(1, i / denom)), color);
    });
    return g;
  };
  // Vertical area gradient — red top, orange middle, yellow bottom.
  // Same warm palette the stats hour chart uses for its fill so the
  // two charts feel like siblings.
  const buildHistoryFillGradient = (chartCtx) => {
    const chart = chartCtx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return 'rgba(255,149,0,0.15)';
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0,   'rgba(255, 59, 48, 0.34)');
    g.addColorStop(0.5, 'rgba(255, 149, 0, 0.18)');
    g.addColorStop(1,   'rgba(255, 204, 0, 0.04)');
    return g;
  };

  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Min',
          data: minVals,
          borderColor: buildHistoryLineGradient,
          backgroundColor: buildHistoryFillGradient,
          borderWidth: 3,
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: pointColors,
          pointBorderColor: bgSecondary,
          pointBorderWidth: 2.5,
          pointRadius: pointRadii,
          pointHoverRadius: pointHoverRadii,
          pointHoverBorderWidth: 3,
          pointHoverBorderColor: bgSecondary,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: isUpdate ? false : { duration: 1100, easing: 'easeOutQuart' },
      interaction: { intersect: false, mode: 'index' },
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        const day = daily[idx];
        if (day && day.entries.length > 1) {
          renderHourChart(day.entries, day.key);
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          // Custom HTML tooltip so the price can be coloured by rank
          // and we can stack min / avg / max in one card.
          enabled: false,
          external: (chartCtx) => {
            const el = ensureHistoryTooltipEl();
            const tt = chartCtx.tooltip;
            if (!tt || tt.opacity === 0 || !tt.dataPoints || !tt.dataPoints.length) {
              el.classList.remove('show');
              return;
            }
            const idx = tt.dataPoints[0].dataIndex;
            const day = daily[idx];
            if (!day) { el.classList.remove('show'); return; }
            const dt = new Date(day.timestamp);
            const dayNames = t('dayNames') || [];
            const name = dayNames[dt.getDay()] || '';
            const dateLabel = `${name} ${dt.getDate()}.${dt.getMonth() + 1}.`;
            const color = pointColors[idx] || '#ff9500';
            const drillable = day.entries.length > 1;
            el.innerHTML = `
              <div class="history-tooltip-time">${dateLabel}</div>
              <div class="history-tooltip-price" style="color:${color}">${formatPrice(day.min_price)}</div>
              <div class="history-tooltip-meta">
                <span>${t('historyAvgLabel')} ${formatPrice(day.avg_price)}</span>
                <span>${t('historyHighLabel')} ${formatPrice(day.max_price)}</span>
              </div>
              ${drillable ? `<div class="history-tooltip-hint">${t('historyTooltipHint')}</div>` : ''}
            `;
            const rect = chartCtx.chart.canvas.getBoundingClientRect();
            el.style.left = (rect.left + window.scrollX + tt.caretX) + 'px';
            el.style.top = (rect.top + window.scrollY + tt.caretY) + 'px';
            el.classList.add('show');
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: hintColor,
            font: { size: 11, family: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif' },
            maxTicksLimit: 8,
          },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: {
            color: hintColor,
            font: { size: 11, family: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif' },
            callback: (v) => formatPrice(v),
            maxTicksLimit: 4,
          },
          grid: { color: sepColor, lineWidth: 0.5 },
          border: { display: false },
          // Padding around the data range so the line + halo never
          // clip against the chart's top/bottom edges.
          grace: '12%',
        }
      }
    },
    plugins: [{
      id: 'historyCrosshair',
      afterDatasetsDraw(chart) {
        const active = chart.getActiveElements();
        if (!active.length) return;
        const elPt = active[0].element;
        if (!elPt) return;
        const idx = active[0].index;
        const color = pointColors[idx] || '#ff9500';
        const { ctx: c, chartArea } = chart;
        const x = elPt.x, y = elPt.y;
        c.save();
        c.strokeStyle = rgbWithAlpha(color, 0.45);
        c.lineWidth = 1.25;
        c.setLineDash([4, 5]);
        c.beginPath();
        c.moveTo(x, chartArea.top);
        c.lineTo(x, chartArea.bottom);
        c.stroke();
        c.setLineDash([]);
        c.beginPath();
        c.arc(x, y, 16, 0, Math.PI * 2);
        c.fillStyle = rgbWithAlpha(color, 0.12);
        c.fill();
        c.beginPath();
        c.arc(x, y, 10, 0, Math.PI * 2);
        c.fillStyle = rgbWithAlpha(color, 0.22);
        c.fill();
        c.restore();
      }
    }, {
      // Persistent soft halo around the latest "today" point so the eye
      // lands on where the price is right now.
      id: 'historyTodayGlow',
      afterDatasetsDraw(chart) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || !meta.data.length) return;
        const last = meta.data[meta.data.length - 1];
        if (!last || last.skip) return;
        const color = pointColors[pointColors.length - 1] || '#ff9500';
        const { ctx: c } = chart;
        c.save();
        c.beginPath();
        c.arc(last.x, last.y, 14, 0, Math.PI * 2);
        c.fillStyle = rgbWithAlpha(color, 0.15);
        c.fill();
        c.restore();
      }
    }]
  });

  // Clear tooltip + crosshair when the finger leaves the canvas. Listeners
  // are bound once per <canvas> — the same element survives Chart.destroy(),
  // and the callback resolves state.chart at fire time so re-renders stay
  // wired correctly.
  if (!ctx.__hoverListenersBound) {
    ctx.__hoverListenersBound = true;
    const clear = () => clearChartHover(state.chart, document.getElementById('history-tooltip'));
    ctx.addEventListener('touchend', clear);
    ctx.addEventListener('touchcancel', clear);
    ctx.addEventListener('pointerleave', clear);
  }

  const summary = document.getElementById('history-summary');
  // Use actual per-station extremes from station_prices if available
  const extremes = state.priceExtremes;
  const cheapestName = extremes?.cheapest?.station_name || '';
  const cheapestPrice = extremes?.cheapest?.price;
  const cheapestId = extremes?.cheapest?.station_id || '';
  const cheapestBrand = extremes?.cheapest?.station_brand || '';
  const expensiveName = extremes?.mostExpensive?.station_name || '';
  const expensivePrice = extremes?.mostExpensive?.price;
  const expensiveId = extremes?.mostExpensive?.station_id || '';
  const expensiveBrand = extremes?.mostExpensive?.station_brand || '';
  // Fallback to aggregated data if no extremes
  const minEntry = filtered.reduce((a, b) => a.min_price < b.min_price ? a : b);
  const maxEntry = filtered.reduce((a, b) => a.max_price > b.max_price ? a : b);
  const lowestStation = cheapestName || fixEnc(minEntry.station) || t('unknown');
  const lowestPrice = cheapestPrice != null ? cheapestPrice : minEntry.min_price;
  const highestStation = expensiveName || fixEnc(maxEntry.station) || t('unknown');
  const highestPrice = expensivePrice != null ? expensivePrice : maxEntry.max_price;

  const extremeCard = (kind, label, price, station, id, brand) => {
    const isLow = kind === 'low';
    const colorVar = isLow ? 'var(--color-good)' : 'var(--color-bad)';
    const iconPath = isLow ? ICON_PATHS.trendDown : ICON_PATHS.trendUp;
    const dataAttrs = id
      ? `data-station-id="${id}" data-station-name="${fixEnc(station)}" data-station-brand="${fixEnc(brand)}" data-station-price="${price}"`
      : `data-station-name="${fixEnc(station)}" data-station-price="${price}"`;
    return `<button type="button" class="history-extreme-card" style="--accent:${colorVar}" ${dataAttrs}>
      <div class="history-extreme-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">${iconPath}</svg>
      </div>
      <div class="history-extreme-body">
        <div class="history-extreme-label">${label}</div>
        <div class="history-extreme-value">${formatPrice(price)}</div>
        <div class="history-extreme-station">${fixEnc(station)}</div>
      </div>
    </button>`;
  };

  summary.innerHTML = `
    <div class="section-header">${t('summary')}</div>
    <div class="history-extreme-row">
      ${extremeCard('low', t('lowestPrice'), lowestPrice, lowestStation, cheapestId, cheapestBrand)}
      ${extremeCard('high', t('highestPrice'), highestPrice, highestStation, expensiveId, expensiveBrand)}
    </div>`;

  // Open the same detail modal the stats ranking uses — openStationDetail
  // resolves cache + /api/station/:id and handles DE/AT transparently.
  // Animate in only on the first render so period/location refreshes
  // don't re-trigger the slide-in.
  const isFresh = !isUpdate;
  summary.querySelectorAll('.history-extreme-card').forEach((card, i) => {
    if (isFresh) {
      card.style.animationDelay = `${Math.min(i * 60, 120)}ms`;
      card.classList.add('anim-in');
    }
    if (card.classList.contains('is-empty')) return;
    card.addEventListener('click', () => {
      haptic('light');
      const id = card.dataset.stationId;
      const name = card.dataset.stationName;
      const brand = card.dataset.stationBrand || '';
      const price = parseFloat(card.dataset.stationPrice) || null;
      openStationDetail({ id, name, brand, fallbackPrice: price });
    });
  });
}

function renderHistoryStats(data) {
  const el = document.getElementById('history-stats');
  if (!el || !data || !data.length) {
    if (el) { el.style.display = 'none'; el.innerHTML = ''; }
    return;
  }

  const now = Date.now();
  const dayMs = 86400000;
  const avgInRange = (startDaysAgo, endDaysAgo) => {
    const startTs = now - endDaysAgo * dayMs;
    const endTs = now - startDaysAgo * dayMs;
    const vals = [];
    for (const d of data) {
      const ts = new Date(d.timestamp).getTime();
      if (ts >= startTs && ts < endTs) vals.push(d.avg_price);
    }
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const currentAvg = sorted[0]?.avg_price;

  const week = avgInRange(0, 7);
  const prevWeek = avgInRange(7, 14);
  const deltaWeek = (week != null && prevWeek != null) ? week - prevWeek : null;

  const month = avgInRange(0, 30);
  const prevMonth = avgInRange(30, 60);
  const deltaMonth = (month != null && prevMonth != null) ? month - prevMonth : null;

  // Period label sourced from the entire dataset's oldest timestamp so it
  // reflects how much history is actually available (after retention).
  const tsList = data.map(d => new Date(d.timestamp).getTime()).filter(ts => !isNaN(ts));
  let periodLabel = '';
  if (tsList.length) {
    const since = Math.min(...tsList);
    const days = Math.max(1, Math.round((Date.now() - since) / dayMs) + 1);
    if (days < 2) periodLabel = t('periodToday') || 'Today';
    else if (days < 90) periodLabel = (t('periodLastDays') || 'Last {n} days').replace('{n}', String(days));
    else {
      const locale = state.lang === 'en' ? 'en-US' : 'de-DE';
      const dateStr = new Date(since).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
      periodLabel = (t('periodSince') || 'Since {date}').replace('{date}', dateStr);
    }
  }

  const trendIconPath = (delta) => {
    if (delta == null || Math.abs(delta) < 0.005) return ICON_PATHS.chart;
    return delta < 0 ? ICON_PATHS.trendDown : ICON_PATHS.trendUp;
  };
  const trendVar = (delta) => {
    if (delta == null || Math.abs(delta) < 0.005) return 'var(--color-hint)';
    return delta < 0 ? 'var(--color-good)' : 'var(--color-bad)';
  };
  const trendArrow = (delta) => {
    if (delta == null || Math.abs(delta) < 0.005) return '→';
    return delta < 0 ? '↓' : '↑';
  };

  const renderPill = (delta, label) => {
    if (delta == null) return '';
    return `<span class="history-hero-pill" style="--pill-color:${trendVar(delta)}">
      <span class="history-hero-pill-arrow">${trendArrow(delta)}</span>
      <span class="history-hero-pill-value">${formatDelta(delta)}</span>
      <span class="history-hero-pill-label">${label}</span>
    </span>`;
  };

  el.style.display = '';
  el.innerHTML = `
    <div class="history-hero-card">
      <div class="history-hero-top">
        <div class="history-hero-headline">
          <div class="history-hero-label">${t('currentAvg')}</div>
          <div class="history-hero-value metric-value">${currentAvg != null ? formatPrice(currentAvg) : '–'}</div>
          ${periodLabel ? `<div class="history-hero-period">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/></svg>
            <span>${periodLabel}</span>
          </div>` : ''}
        </div>
        <div class="history-hero-glyph" style="--glyph-color:${trendVar(deltaWeek)}" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">${trendIconPath(deltaWeek)}</svg>
        </div>
      </div>
      ${(deltaWeek != null || deltaMonth != null) ? `<div class="history-hero-pills">
        ${renderPill(deltaWeek, t('vsLastWeek'))}
        ${renderPill(deltaMonth, t('vsLastMonth'))}
      </div>` : ''}
    </div>`;

  // Slide-in + count-up only on the very first render of the tab —
  // re-running them on every period-chip / location switch reads as a
  // jittery "everything just re-animated" effect. state.chart is the
  // marker: it's truthy whenever we're about to swap data (the chart
  // hasn't been destroyed yet at this point in renderChart).
  const isFresh = !state.chart;
  if (!isFresh) return;
  requestAnimationFrame(() => {
    const card = el.querySelector('.history-hero-card');
    if (card) card.classList.add('anim-in');
    const cv = el.querySelector('.history-hero-value');
    if (cv) {
      const num = parseFloat(cv.textContent.replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        countUp(cv, num, 700, (v) => formatPrice(v));
      }
    }
  });
}

function renderHourChart(entries, dayKey) {
  const section = document.getElementById('hour-chart-section');
  const label = document.getElementById('hour-chart-label');
  // Parse the YYYY-MM-DD key as LOCAL time — new Date('2026-07-13') is UTC
  // midnight, which shifts to the previous day (wrong weekday/date in the
  // header) for users west of UTC.
  const [y, m, d] = String(dayKey).split('-').map(Number);
  const dt = Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d)
    ? new Date(y, m - 1, d)
    : new Date(dayKey);
  const dayNames = t('dayNames') || [];
  const dayName = dayNames[dt.getDay()] || '';
  // The section header carries the drilled-down day plus a close button
  // so the user can collapse the panel without scrolling away.
  label.innerHTML = `
    <span class="hour-chart-day">${dayName} ${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}</span>
    <button type="button" class="hour-chart-close" aria-label="${t('closeHourView')}">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
  `;
  label.querySelector('.hour-chart-close')?.addEventListener('click', () => {
    haptic('light');
    section.style.display = 'none';
    if (state.hourChart) { state.hourChart.destroy(); state.hourChart = null; }
  });
  section.style.display = '';

  const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const hLabels = sorted.map(d => {
    const h = new Date(d.timestamp);
    return `${h.getHours()}:${String(h.getMinutes()).padStart(2, '0')}`;
  });

  const styles = getComputedStyle(document.body);
  const hintColor = styles.getPropertyValue('--color-hint').trim() || '#999';
  const sepColor = styles.getPropertyValue('--color-separator').trim() || '#e0e0e0';
  const bgSecondary = styles.getPropertyValue('--color-bg-secondary').trim() || '#fff';

  // Rank-based colour per data point — same scheme the day chart uses,
  // applied here to the intraday min values.
  const minVals = sorted.map(d => d.min_price);
  const minLo = Math.min(...minVals);
  const minHi = Math.max(...minVals);
  const minRange = Math.max(minHi - minLo, 0.0001);
  const pointColors = minVals.map(v => rankColor((v - minLo) / minRange));

  if (state.hourChart) state.hourChart.destroy();
  const ctx = document.getElementById('hour-chart');

  // Same horizontal-stroke + warm vertical-fill recipe as the day
  // chart (and the stats hour chart) — keeps the visual family
  // consistent across the whole app.
  const buildHourLineGradient = (chartCtx) => {
    const chart = chartCtx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return '#ff9500';
    const g = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    const denom = Math.max(1, pointColors.length - 1);
    pointColors.forEach((color, i) => {
      g.addColorStop(Math.max(0, Math.min(1, i / denom)), color);
    });
    return g;
  };
  const buildHourFillGradient = (chartCtx) => {
    const chart = chartCtx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return 'rgba(255,149,0,0.15)';
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0,   'rgba(255, 59, 48, 0.32)');
    g.addColorStop(0.5, 'rgba(255, 149, 0, 0.18)');
    g.addColorStop(1,   'rgba(255, 204, 0, 0.04)');
    return g;
  };

  state.hourChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hLabels,
      datasets: [{
        label: 'Min',
        data: minVals,
        borderColor: buildHourLineGradient,
        backgroundColor: buildHourFillGradient,
        borderWidth: 2.5,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: pointColors,
        pointBorderColor: bgSecondary,
        pointBorderWidth: 1.5,
        pointRadius: sorted.length < 30 ? 3 : 1.5,
        pointHoverRadius: sorted.length < 30 ? 5 : 4,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: bgSecondary,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: (chartCtx) => {
            const el = ensureHistoryTooltipEl();
            const tt = chartCtx.tooltip;
            if (!tt || tt.opacity === 0 || !tt.dataPoints || !tt.dataPoints.length) {
              el.classList.remove('show');
              return;
            }
            const idx = tt.dataPoints[0].dataIndex;
            const entry = sorted[idx];
            if (!entry) { el.classList.remove('show'); return; }
            const t1 = new Date(entry.timestamp);
            const hh = String(t1.getHours()).padStart(2, '0');
            const mm = String(t1.getMinutes()).padStart(2, '0');
            const suffix = t('oclock');
            const timeLabel = suffix ? `${hh}:${mm} ${suffix}` : `${hh}:${mm}`;
            const color = pointColors[idx] || '#ff9500';
            el.innerHTML = `
              <div class="history-tooltip-time">${timeLabel}</div>
              <div class="history-tooltip-price" style="color:${color}">${formatPrice(entry.min_price)}</div>
              <div class="history-tooltip-meta">
                <span>${t('historyAvgLabel')} ${formatPrice(entry.avg_price)}</span>
                <span>${t('historyHighLabel')} ${formatPrice(entry.max_price)}</span>
              </div>
            `;
            const rect = chartCtx.chart.canvas.getBoundingClientRect();
            el.style.left = (rect.left + window.scrollX + tt.caretX) + 'px';
            el.style.top = (rect.top + window.scrollY + tt.caretY) + 'px';
            el.classList.add('show');
          }
        }
      },
      scales: {
        x: {
          ticks: { color: hintColor, font: { size: 11 }, maxTicksLimit: 8 },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: {
            color: hintColor,
            font: { size: 11 },
            callback: (v) => formatPrice(v),
            maxTicksLimit: 4,
          },
          grid: { color: sepColor, lineWidth: 0.5 },
          border: { display: false },
          grace: '12%',
        }
      }
    },
    plugins: [{
      id: 'historyHourCrosshair',
      afterDatasetsDraw(chart) {
        const active = chart.getActiveElements();
        if (!active.length) return;
        const elPt = active[0].element;
        if (!elPt) return;
        const idx = active[0].index;
        const color = pointColors[idx] || '#ff9500';
        const { ctx: c, chartArea } = chart;
        const x = elPt.x, y = elPt.y;
        c.save();
        c.strokeStyle = rgbWithAlpha(color, 0.4);
        c.lineWidth = 1.25;
        c.setLineDash([4, 5]);
        c.beginPath();
        c.moveTo(x, chartArea.top);
        c.lineTo(x, chartArea.bottom);
        c.stroke();
        c.setLineDash([]);
        c.beginPath();
        c.arc(x, y, 12, 0, Math.PI * 2);
        c.fillStyle = rgbWithAlpha(color, 0.18);
        c.fill();
        c.restore();
      }
    }]
  });

  // Scroll the hour chart into view
  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Signature of the inputs the history/stats fetches depend on. When it's
// unchanged we can skip a re-fetch + re-render on tab switches and keep the
// cached view (and its already-finished entrance animation).
function currentDataKey() {
  const country = state.activeCountry || getActiveCountry();
  return `${country}|${state.selectedLocation || ''}`;
}

async function reloadStats() {
  const country = state.activeCountry || getActiveCountry();
  const url = state.selectedLocation
    ? `/api/stats?location=${encodeURIComponent(state.selectedLocation)}&country=${country}`
    : `/api/stats?country=${country}`;
  const stats = await api(url);
  state.stats = stats;
  renderStats(stats);
  state.statsKey = currentDataKey();
}

async function loadStatsTab() {
  state.loaded.stats = true;
  showStatsSkeleton();
  await loadLocationPickers();
  try {
    await reloadStats();
  } catch (e) {
    // A failed first fetch must not leave the skeleton shimmering forever —
    // swap it for the empty state. statsKey stays unset, so the next tab
    // switch retries the load.
    console.error('Stats load error:', e);
    renderStats(null);
  }
  syncCountryChips();
  wireCountryChips('stats-country-chips');

  const statsPicker = document.getElementById('stats-location-picker');
  if (statsPicker) {
    statsPicker.addEventListener('change', async () => {
      state.locationPickerTouched = true;
      state.selectedLocation = statsPicker.value;
      // Sync history picker and tear down the "auto-picked" hint on
      // both since the user has just made their own choice.
      const historyPicker = document.getElementById('history-location-picker');
      if (historyPicker) historyPicker.value = state.selectedLocation;
      document.getElementById('history-location-hint')?.setAttribute('hidden', '');
      document.getElementById('stats-location-hint')?.setAttribute('hidden', '');
      await reloadStats();
      // Reload history if already loaded
      if (state.loaded.history) {
        state.history = await fetchHistoryData();
        renderChart(state.history);
        state.historyKey = currentDataKey();
      }
    });
  }
}

function countUp(el, target, duration = 700, formatter) {
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = formatter ? formatter(current) : Math.round(current).toString();
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// Structural placeholder dropped into #stats-content on first load so the
// tab fills in gracefully instead of flashing from blank to a fully built
// page. Mirrors renderStats' layout — same container classes, so there's no
// layout shift when the real content swaps in — with shimmering bones where
// the data will land. renderStats overwrites innerHTML, clearing it.
function showStatsSkeleton() {
  const el = document.getElementById('stats-content');
  if (!el) return;
  const bone = (style) => `<div class="skeleton-bone" style="${style}"></div>`;
  const factCard = () => `
    <div class="stats-fact-card">
      ${bone('width:30px;height:30px;border-radius:9px;flex-shrink:0')}
      <div style="flex:1;min-width:0">
        ${bone('width:60%;height:9px;margin-bottom:7px')}
        ${bone('width:85%;height:15px')}
      </div>
    </div>`;
  const bestCard = () => `
    <div class="best-time-card">
      ${bone('width:50%;height:11px')}
      ${bone('width:72%;height:20px;margin-top:8px')}
      ${bone('width:40%;height:15px;margin-top:8px')}
    </div>`;
  const tile = () => `
    <div class="stats-tile">
      ${bone('width:62%;height:9px')}
      ${bone('width:84%;height:13px;margin-top:5px')}
      ${bone('width:calc(100% - 12px);height:3px;margin-top:auto;border-radius:999px')}
    </div>`;
  const row = () => `
    <div class="skeleton-item">
      ${bone('width:28px;height:28px;border-radius:8px;flex-shrink:0')}
      <div style="flex:1;min-width:0">${bone('width:55%;height:14px')}</div>
      ${bone('width:52px;height:18px;margin-left:auto;flex-shrink:0')}
    </div>`;
  el.innerHTML = `
    <div class="section stats-hero-section" aria-hidden="true">
      <div class="stats-hero-card">
        <div class="stats-hero-top">
          <div style="flex:1;min-width:0">
            ${bone('width:38%;height:11px')}
            ${bone('width:55%;height:30px;margin-top:11px')}
          </div>
          ${bone('width:24px;height:24px;border-radius:7px;flex-shrink:0')}
        </div>
        ${bone('width:128px;height:13px;margin-top:14px;border-radius:999px')}
        ${bone('width:100%;height:6px;margin-top:18px;border-radius:999px')}
      </div>
      <div class="stats-facts-row">${factCard()}${factCard()}${factCard()}</div>
    </div>
    <div class="section" aria-hidden="true">
      <div class="section-header">${t('bestTimes')}</div>
      <div class="best-time-grid">${bestCard()}${bestCard()}</div>
    </div>
    <div class="section" aria-hidden="true">
      <div class="section-header">${t('weekdays')}</div>
      <div class="stats-tile-grid stats-tile-grid-7">${tile().repeat(7)}</div>
    </div>
    <div class="section" aria-hidden="true">
      <div class="section-header">${t('hourRanking')}</div>
      <div class="stats-hour-chart-wrap" style="animation:none">${bone('position:absolute;inset:0;border-radius:12px')}</div>
    </div>
    <div class="section" aria-hidden="true">
      <div class="section-header">${t('stationRanking')}</div>
      <div class="card-list stats-station-list">${row().repeat(5)}</div>
    </div>`;
}

function renderStats(stats) {
  const el = document.getElementById('stats-content');
  // A sparse location can come back without overall/dayAvgs/hourAvgs —
  // treat that like "no stats" instead of throwing mid-render (which would
  // strand the previous location's stats on screen).
  if (!stats || !stats.overall || !Array.isArray(stats.dayAvgs) || !Array.isArray(stats.hourAvgs)) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-text">${t('noStats')}</div></div>`;
    return;
  }

  const bestDay = stats.dayAvgs[0];
  const worstDay = stats.dayAvgs[stats.dayAvgs.length - 1];
  const bestHour = stats.hourAvgs[0];
  const worstHour = stats.hourAvgs[stats.hourAvgs.length - 1];
  const hourLabel = bestHour ? (t('oclock') ? `${bestHour.hour}:00 ${t('oclock')}` : `${bestHour.hour}:00`) : '–';

  const dayDelta = (bestDay && worstDay && worstDay.avg > bestDay.avg) ? (worstDay.avg - bestDay.avg) : 0;
  const hourDelta = (bestHour && worstHour && worstHour.avg > bestHour.avg) ? (worstHour.avg - bestHour.avg) : 0;

  const lo = stats.overall.lowest_ever;
  const hi = stats.overall.highest_ever;
  const avg = stats.overall.avg;
  const spreadRange = Math.max(hi - lo, 0.0001);
  const avgPct = Math.max(0, Math.min(100, ((avg - lo) / spreadRange) * 100));

  const fmtDeltaShort = (n) => '−' + Number(n).toFixed(2).replace('.', ',') + '€';

  // Build a period label for the hero — short days form when the range
  // is recent, absolute date when it stretches back further.
  let periodLabel = '';
  if (stats.overall.since) {
    const sinceDate = new Date(stats.overall.since);
    const untilDate = stats.overall.until ? new Date(stats.overall.until) : new Date();
    const daysSpan = Math.max(1, Math.round((untilDate.getTime() - sinceDate.getTime()) / 86400000) + 1);
    if (daysSpan < 2) {
      periodLabel = t('periodToday') || 'Today';
    } else if (daysSpan < 90) {
      periodLabel = (t('periodLastDays') || 'Last {n} days').replace('{n}', String(daysSpan));
    } else {
      const locale = state.lang === 'en' ? 'en-US' : 'de-DE';
      const dateStr = sinceDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
      periodLabel = (t('periodSince') || 'Since {date}').replace('{date}', dateStr);
    }
  }

  let html = `
    <div class="section stats-hero-section">
      <div class="stats-hero-card">
        <div class="stats-hero-top">
          <div class="stats-hero-headline">
            <div class="stats-hero-label">${t('avgPrice')}</div>
            <div class="stats-hero-value metric-value">${formatPrice(avg)}</div>
          </div>
          <div class="stats-hero-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
          </div>
        </div>
        ${periodLabel ? `
        <div class="stats-hero-period" title="${stats.overall.since ? new Date(stats.overall.since).toLocaleString(state.lang === 'en' ? 'en-US' : 'de-DE') : ''}">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
          <span>${periodLabel}</span>
        </div>` : ''}
        ${hi > lo ? `
        <div class="stats-spread">
          <div class="stats-spread-track">
            <div class="stats-spread-fill"></div>
            <div class="stats-spread-marker" style="left:${avgPct}%" title="${formatPrice(avg)}"></div>
          </div>
          <div class="stats-spread-labels">
            <span class="stats-spread-low">${formatPrice(lo)}</span>
            <span class="stats-spread-caption">${t('priceSpread')}</span>
            <span class="stats-spread-high">${formatPrice(hi)}</span>
          </div>
        </div>` : ''}
      </div>
      <div class="stats-facts-row">
        <div class="stats-fact-card">
          <div class="stats-fact-icon stats-fact-icon-good">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/></svg>
          </div>
          <div class="stats-fact-body">
            <div class="stats-fact-label">${t('lowest')}</div>
            <div class="stats-fact-value metric-value" style="color:var(--color-good)">${formatPrice(lo)}</div>
          </div>
        </div>
        <div class="stats-fact-card">
          <div class="stats-fact-icon stats-fact-icon-bad">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          </div>
          <div class="stats-fact-body">
            <div class="stats-fact-label">${t('highest')}</div>
            <div class="stats-fact-value metric-value" style="color:var(--color-bad)">${formatPrice(hi)}</div>
          </div>
        </div>
        <div class="stats-fact-card">
          <div class="stats-fact-icon stats-fact-icon-accent">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
          </div>
          <div class="stats-fact-body">
            <div class="stats-fact-label">${t('measurements')}</div>
            <div class="stats-fact-value metric-value" style="color:var(--color-accent)">${stats.overall.entries}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">${t('bestTimes')}</div>
      <div class="best-time-grid">
        <div class="best-time-card">
          <div class="best-time-head">
            <div class="best-time-icon-wrap">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/></svg>
            </div>
            <div class="best-time-label">${t('cheapestDay')}</div>
          </div>
          <div class="best-time-value">${bestDay ? (t('dayNames')[bestDay.day] || bestDay.name) : '–'}</div>
          <div class="best-time-price good">${bestDay ? formatPrice(bestDay.avg) : '–'}</div>
          ${dayDelta > 0.005 ? `<div class="best-time-savings"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/></svg>${fmtDeltaShort(dayDelta)} ${t('vsWorst')}</div>` : ''}
        </div>
        <div class="best-time-card">
          <div class="best-time-head">
            <div class="best-time-icon-wrap">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            </div>
            <div class="best-time-label">${t('cheapestHour')}</div>
          </div>
          <div class="best-time-value">${hourLabel}</div>
          <div class="best-time-price good">${bestHour ? formatPrice(bestHour.avg) : '–'}</div>
          ${hourDelta > 0.005 ? `<div class="best-time-savings"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/></svg>${fmtDeltaShort(hourDelta)} ${t('vsWorst')}</div>` : ''}
        </div>
      </div>
    </div>`;

  // Weekdays: chronological 7-tile row (Mon..Sun). Each tile shows the
  // day + price on a clean surface and renders a thin coloured progress
  // bar at the bottom whose width tracks how cheap the day is. The
  // cheapest day also gets a subtle tinted surface, a coloured border
  // and a star badge.
  if (stats.dayAvgs.length) {
    const dayCount = stats.dayAvgs.length;
    const dayRankMap = new Map();
    stats.dayAvgs.forEach((d, idx) => dayRankMap.set(d.day, idx));
    const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0];
    const dayAbbrev = t('dayAbbr') || [];
    // Colour and bar width track the *displayed* (2-decimal) price, not the
    // raw average or the rank. Two days that show the same number (e.g.
    // 1,84 €) must look identical — basing the colour on the rank would
    // spread tied prices across the green→red gradient even though the user
    // sees the exact same value.
    const dayDispV = (avg) => Number(Number(avg).toFixed(2));
    const dayValuesArr = stats.dayAvgs.map(d => dayDispV(d.avg));
    const dayMaxV = Math.max(...dayValuesArr);
    const dayMinV = Math.min(...dayValuesArr);
    const dayRangeV = Math.max(dayMaxV - dayMinV, 0.0001);
    let dayTiles = '';
    for (const dayNum of dayDisplayOrder) {
      const abbr = dayAbbrev[dayNum] || '';
      const data = stats.dayAvgs.find(d => d.day === dayNum);
      if (!data) {
        dayTiles += `<div class="stats-tile is-empty"><div class="stats-tile-name">${abbr}</div><div class="stats-tile-value">–</div><div class="stats-tile-bar"><div class="stats-tile-bar-fill"></div></div></div>`;
        continue;
      }
      const rank = dayRankMap.get(dayNum);
      // Position in the displayed-price range drives both colour and bar
      // width, so equal prices map to an identical tint and length: empty +
      // green for the cheapest, full + red for the priciest. Reads
      // naturally — less is better, since you want to spend less.
      const ratio = dayCount > 1 ? (dayDispV(data.avg) - dayMinV) / dayRangeV : 0;
      const color = rankColor(ratio);
      const isBest = rank === 0;
      const barWidth = Math.round(ratio * 100);
      const crown = isBest ? '<span class="stats-tile-crown" aria-hidden="true">★</span>' : '';
      const fullDayName = (t('dayNames') || [])[dayNum] || data.name || abbr;
      dayTiles += `<div class="stats-tile${isBest ? ' is-best' : ''}" style="--tile-color:${color}" data-tile-label="${fullDayName} · ${formatPrice(data.avg)}" data-tile-color="${color}">${crown}<div class="stats-tile-name">${abbr}</div><div class="stats-tile-value" style="color:${color}">${formatPrice(data.avg)}</div><div class="stats-tile-bar"><div class="stats-tile-bar-fill" style="width:${barWidth}%"></div></div></div>`;
    }
    html += `<div class="section"><div class="section-header">${t('weekdays')}</div><div class="stats-tile-grid stats-tile-grid-7">${dayTiles}</div></div>`;
  }

  // Hours: line chart spanning 0..23 on the x-axis. Each measured hour
  // is a point coloured by its rank (cheap = green, expensive = red);
  // unmeasured hours are skipped and the line bridges across them.
  if (stats.hourAvgs.length) {
    html += `
      <div class="section">
        <div class="section-header">${t('hourRanking')}</div>
        <div class="stats-hour-chart-wrap">
          <canvas id="stats-hour-chart"></canvas>
        </div>
      </div>`;
  }

  // Stations: compact ranked list with a colour-tinted left accent stripe
  // per row. Drop the sparkbar background — the medals + coloured price
  // already carry the rank signal.
  if (stats.stationRanking.length) {
    html += `<div class="section"><div class="section-header">${t('stationRanking')}</div><div class="card-list stats-station-list">`;
    const stations = stats.stationRanking.slice(0, 10);
    const stLen = stations.length;
    stations.forEach((s, i) => {
      const ratio = stLen > 1 ? i / (stLen - 1) : 0;
      const color = rankColor(ratio);
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
      const isMedal = i < 3;
      const idAttr = s.id ? ` data-station-id="${s.id}"` : '';
      const brandAttr = s.brand ? ` data-station-brand="${fixEnc(s.brand)}"` : '';
      const avgAttr = ` data-station-avg="${s.avg}"`;
      // Tooltip with the lowest observed price + sample count so users
      // can see the ranking confidence without us cluttering the row.
      const minLabel = Number.isFinite(s.min) ? `↓ ${formatPrice(s.min)}` : '';
      const countLabel = Number.isFinite(s.count) ? `${s.count} ${t('measurements')}` : '';
      const titleParts = [`Ø ${formatPrice(s.avg)}`, minLabel, countLabel].filter(Boolean).join(' · ');
      html += `<div class="ranking-item station-ranking-item${isMedal ? ' ranking-medal' : ''}" data-station-name="${fixEnc(s.station)}"${idAttr}${brandAttr}${avgAttr} title="${titleParts}" style="--rank-color:${color}"><div class="ranking-pos">${medal}</div><div class="ranking-name">${fixEnc(s.station)}</div><div class="ranking-price" style="color:${color}"><span class="ranking-price-avg-mark">Ø</span>${formatPrice(s.avg)}</div></div>`;
    });
    html += '</div></div>';
  }

  html += '<div style="height:20px"></div>';
  el.innerHTML = html;

  // Defer animations to next frame so DOM write doesn't block tab bar
  requestAnimationFrame(() => {
    el.querySelectorAll('.metric-value').forEach(cv => {
      const num = parseFloat(cv.textContent.replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        const isPrice = cv.textContent.includes(',');
        countUp(cv, num, 600, isPrice ? (v => formatPrice(v)) : (v => Math.round(v).toString()));
      }
    });
    el.querySelectorAll('.stats-hero-card, .stats-fact-card, .best-time-card').forEach((card, i) => {
      card.style.animationDelay = `${Math.min(i * 50, 240)}ms`;
      card.classList.add('anim-in');
    });
    el.querySelectorAll('.stats-tile').forEach((tile, i) => {
      tile.style.animationDelay = `${Math.min(i * 35, 240)}ms`;
      tile.classList.add('anim-in');
    });
    renderStatsHourChart(stats);
    el.querySelectorAll('.stats-tile-bar-fill').forEach((fill, i) => {
      const target = fill.style.width;
      if (target) {
        fill.style.width = '0%';
        fill.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
        requestAnimationFrame(() => { fill.style.width = target; });
      }
    });
    el.querySelectorAll('.ranking-item').forEach((item, i) => {
      item.style.animationDelay = `${Math.min(i * 25, 240)}ms`;
      item.classList.add('anim-in');
    });
    // Slide the spread marker into place after layout settles
    const marker = el.querySelector('.stats-spread-marker');
    if (marker) {
      const targetLeft = marker.style.left;
      marker.style.left = '0%';
      requestAnimationFrame(() => { marker.style.left = targetLeft; });
    }
  });

  el.querySelectorAll('.station-ranking-item').forEach(item => {
    item.addEventListener('click', () => {
      haptic('light');
      const name = item.dataset.stationName;
      const id = item.dataset.stationId;
      const brand = item.dataset.stationBrand || '';
      const avg = parseFloat(item.dataset.stationAvg) || null;
      openStationDetail({ id, name, brand, fallbackPrice: avg });
    });
  });

  // Only the hero price-tag glyph is a fun easter-egg trigger here.
  // The category icons inside the fact and best-time cards (trend
  // arrows, chart, calendar, clock) stay as plain labels — making them
  // tappable just turns them into pseudo-buttons that aren't actions.
  attachConfetti(el.querySelector('.stats-hero-glyph'), ICON_PATHS.priceTag, {
    colors: ['#34c759', '#007aff', '#ff9500', '#ffcc00', '#af52de'],
    count: 30, size: 18,
  });

  // Every weekday tile is now interactive. The cheapest one keeps its
  // gold star burst; the others fire a small price-tag burst tinted by
  // their rank colour and reveal a floating chip with the full label.
  el.querySelectorAll('.stats-tile').forEach(tile => {
    if (tile.classList.contains('is-empty')) return;
    const color = tile.dataset.tileColor;
    const label = tile.dataset.tileLabel || '';
    if (tile.classList.contains('is-best')) {
      attachConfetti(tile, ICON_PATHS.star, { fixedColor: '#34c759', count: 24, size: 16 });
    } else {
      attachConfetti(tile, ICON_PATHS.priceTag, { fixedColor: color, count: 14, size: 14 });
    }
    tile.addEventListener('click', () => {
      const r = tile.getBoundingClientRect();
      if (label) showFloatingValue(r.left + r.width / 2, r.top, label, color);
    });
  });

}

// Lazily create (and reuse) a single floating tooltip element for the
// stats hour chart so the price can be coloured per-hover.
function ensureStatsHourTooltipEl() {
  let el = document.getElementById('stats-hour-tooltip');
  if (!el) {
    el = document.createElement('div');
    el.id = 'stats-hour-tooltip';
    el.className = 'stats-hour-tooltip';
    document.body.appendChild(el);
  }
  return el;
}

// Same idea for the history tab's chart (min/avg/max for the day).
function ensureHistoryTooltipEl() {
  let el = document.getElementById('history-tooltip');
  if (!el) {
    el = document.createElement('div');
    el.id = 'history-tooltip';
    el.className = 'history-tooltip';
    document.body.appendChild(el);
  }
  return el;
}

// Clear a chart's hover state — used on touchend / pointerleave and on
// tab switch so the custom tooltip + crosshair don't stick around after
// the finger lifts. Chart.js' default events don't include touchend, so
// without this the last-hovered point stays "active" forever on mobile.
function clearChartHover(chart, tooltipEl) {
  if (tooltipEl) tooltipEl.classList.remove('show');
  if (!chart) return;
  try {
    chart.setActiveElements([]);
    if (chart.tooltip) chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    chart.update('none');
  } catch {}
}

// Helper: convert an "rgb(r, g, b)" string to "rgba(r, g, b, a)".
function rgbWithAlpha(rgbString, alpha) {
  const m = rgbString.match(/\d+/g);
  if (!m || m.length < 3) return rgbString;
  return `rgba(${m[0]},${m[1]},${m[2]},${alpha})`;
}

// Hour-of-day price chart — line with a warm gradient stroke (yellow →
// orange → red) sampled from each measured hour's rank, a vertical
// gradient area fill, and a custom hover crosshair + glow halo.
function renderStatsHourChart(stats) {
  const canvas = document.getElementById('stats-hour-chart');
  if (!canvas || !stats.hourAvgs.length) return;

  const hourMap = new Map();
  stats.hourAvgs.forEach((h, idx) => hourMap.set(h.hour, { ...h, rank: idx }));
  const hourCount = stats.hourAvgs.length;

  const labels = [];
  const data = [];
  const pointBg = [];       // colour per hour, null = no data
  const pointRadii = [];
  const pointHoverRadii = [];
  for (let hour = 0; hour < 24; hour++) {
    labels.push(`${hour}:00`);
    const d = hourMap.get(hour);
    if (!d) {
      data.push(null);
      pointBg.push(null);
      pointRadii.push(0);
      pointHoverRadii.push(0);
      continue;
    }
    const ratio = hourCount > 1 ? d.rank / (hourCount - 1) : 0;
    pointBg.push(rankColor(ratio));
    data.push(d.avg);
    const r = d.rank === 0 ? 7 : 4;
    pointRadii.push(r);
    pointHoverRadii.push(r + 3);
  }

  const styles = getComputedStyle(document.body);
  const hintColor = styles.getPropertyValue('--color-hint').trim() || '#999';
  const sepColor = styles.getPropertyValue('--color-separator').trim() || '#e0e0e0';
  const bgColor = styles.getPropertyValue('--color-bg-secondary').trim() || '#fff';

  const isUpdate = !!state.statsHourChart;
  if (state.statsHourChart) state.statsHourChart.destroy();

  // Horizontal gradient stroke: one CanvasGradient spanning the chart
  // width with a colour stop at each measured hour's x position. The
  // line itself smoothly transitions through yellow / orange / red.
  const buildLineGradient = (chartCtx) => {
    const chart = chartCtx.chart;
    const { ctx: canvasCtx, chartArea } = chart;
    if (!chartArea) return '#ff9500';
    const g = canvasCtx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    const stops = [];
    for (let i = 0; i < 24; i++) {
      if (pointBg[i]) stops.push({ pos: i / 23, color: pointBg[i] });
    }
    if (!stops.length) return '#ff9500';
    if (stops.length === 1) return stops[0].color;
    stops.forEach(s => g.addColorStop(Math.max(0, Math.min(1, s.pos)), s.color));
    return g;
  };

  // Vertical area gradient — red-tinted at the top (high price = bad),
  // fading through orange to a faint yellow at the bottom.
  const buildFillGradient = (chartCtx) => {
    const chart = chartCtx.chart;
    const { ctx: canvasCtx, chartArea } = chart;
    if (!chartArea) return 'rgba(255,149,0,0.15)';
    const g = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0,   'rgba(255, 59, 48, 0.34)');
    g.addColorStop(0.5, 'rgba(255, 149, 0, 0.18)');
    g.addColorStop(1,   'rgba(255, 204, 0, 0.04)');
    return g;
  };

  state.statsHourChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('avgPrice') || 'Avg',
        data,
        borderColor: buildLineGradient,
        backgroundColor: buildFillGradient,
        borderWidth: 3,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        tension: 0.4,
        spanGaps: true,
        fill: true,
        pointBackgroundColor: pointBg.map(c => c || 'rgba(0,0,0,0)'),
        pointBorderColor: bgColor,
        pointBorderWidth: 2.5,
        pointRadius: pointRadii,
        pointHoverRadius: pointHoverRadii,
        pointHoverBorderWidth: 3,
        pointHoverBorderColor: bgColor,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: isUpdate ? false : {
        duration: 1300,
        easing: 'easeOutQuart',
      },
      interaction: { intersect: false, mode: 'index' },
      hover: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          // Replace Chart.js's flat tooltip with a custom HTML tooltip
          // so the price text can carry the hovered hour's rank colour
          // (Chart.js doesn't allow per-tooltip body colours otherwise).
          enabled: false,
          external: (ctx) => {
            const el = ensureStatsHourTooltipEl();
            const tt = ctx.tooltip;
            if (!tt || tt.opacity === 0 || !tt.dataPoints || !tt.dataPoints.length) {
              el.classList.remove('show');
              return;
            }
            const dp = tt.dataPoints[0];
            if (dp.parsed.y == null) {
              el.classList.remove('show');
              return;
            }
            const idx = dp.dataIndex;
            const color = pointBg[idx] || '#ff9500';
            const suffix = t('oclock');
            const hourLabel = suffix ? `${idx}:00 ${suffix}` : `${idx}:00`;
            el.innerHTML = `
              <div class="stats-hour-tooltip-time">${hourLabel}</div>
              <div class="stats-hour-tooltip-price" style="color:${color}">${formatPrice(dp.parsed.y)}</div>
            `;
            const rect = ctx.chart.canvas.getBoundingClientRect();
            el.style.left = (rect.left + window.scrollX + tt.caretX) + 'px';
            el.style.top = (rect.top + window.scrollY + tt.caretY) + 'px';
            el.classList.add('show');
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: hintColor,
            font: { size: 11, family: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif' },
            autoSkip: false,
            maxRotation: 0,
            callback: (_value, index) => (index % 6 === 0 ? `${index}:00` : ''),
          },
          grid: { color: sepColor, drawTicks: false, lineWidth: 0.5 },
          border: { display: false },
        },
        y: {
          display: false,
          beginAtZero: false,
          // Breathing room above and below the actual range so the
          // line never touches the chart edges (the lowest/highest
          // hour was getting clipped against the bottom).
          grace: '18%',
        }
      }
    },
    plugins: [{
      // Custom hover decoration: vertical dashed crosshair tinted by the
      // hovered hour's rank colour, plus two soft halos around the point
      // for an at-a-glance "this is what you're hovering" cue.
      id: 'statsHourCrosshair',
      afterDatasetsDraw(chart) {
        const active = chart.getActiveElements();
        if (!active.length) return;
        const el = active[0].element;
        if (!el || el.skip) return;
        const idx = active[0].index;
        const color = pointBg[idx];
        if (!color) return;
        const { ctx, chartArea } = chart;
        const x = el.x;
        const y = el.y;
        ctx.save();
        // Dashed vertical crosshair
        ctx.strokeStyle = rgbWithAlpha(color, 0.45);
        ctx.lineWidth = 1.25;
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        // Two-ring halo around the point
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = rgbWithAlpha(color, 0.12);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = rgbWithAlpha(color, 0.22);
        ctx.fill();
        ctx.restore();
      }
    }]
  });

  if (!canvas.__hoverListenersBound) {
    canvas.__hoverListenersBound = true;
    const clear = () => clearChartHover(state.statsHourChart, document.getElementById('stats-hour-tooltip'));
    canvas.addEventListener('touchend', clear);
    canvas.addEventListener('touchcancel', clear);
    canvas.addEventListener('pointerleave', clear);
  }
}

function setupSettings() {
  const fuelChips = document.getElementById('fuel-chips');
  fuelChips.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.fuel === state.fuelType);
    chip.addEventListener('click', async () => {
      haptic('light');
      fuelChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.fuelType = chip.dataset.fuel;
      state.loaded.map = false;
      // Different fuel ⇒ different price band; refetch and drop the old one
      // so the heatmap stays neutral until the new band lands.
      state.priceBand = { fuel: null, band: null, key: null };
      if (state.map) {
        const c = state.map.getCenter();
        loadPriceBand(c.lat, c.lng);
      }
      persistStateSettings({ fuelType: state.fuelType });
      if (state.currentTab === 'map') loadMapTab();
      // If the station sheet is open, reload its chart so it tracks the
      // new fuel type instead of showing a stale series.
      if (state.sheetStationName) {
        const activeRange = document.querySelector('.sheet-toggle-btn.active');
        const days = activeRange ? parseInt(activeRange.dataset.range, 10) : (state.historyDefaultDays || 7);
        loadSheetChart(state.sheetStationName, days, state.sheetStation?.id);
      }
      refreshAlertUi();
    });
  });

  initAlertUI();

  // Easter eggs in the About section — the app icon bursts copies of
  // itself, and the heart in the footer rains hearts.
  attachConfetti(document.querySelector('.about-app-icon'), null, {
    imgSrc: '/icons/icon-192.png',
    imgRadius: 6,
    count: 24, size: 24,
  });
  attachConfetti(document.querySelector('.about-heart'), ICON_PATHS.heart, {
    fixedColor: '#ff3b30', count: 28, size: 18,
  });

  // Contributors collapsible
  const contribToggle = document.getElementById('about-contributors-toggle');
  const contribList = document.getElementById('about-contributors-list');
  if (contribToggle && contribList) {
    const contribCount = contribList.querySelectorAll('.about-contributor').length;
    const chevron = contribToggle.querySelector('.about-contributors-chevron');
    // Use saved preference, or default to open if ≤3 contributors
    const shouldOpen = typeof state.contributorsOpen === 'boolean' ? state.contributorsOpen : contribCount <= 3;
    if (shouldOpen) {
      contribList.classList.add('open');
      if (chevron) chevron.classList.add('open');
    }
    contribToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    contribToggle.addEventListener('click', () => {
      haptic('light');
      const isOpen = contribList.classList.toggle('open');
      if (chevron) chevron.classList.toggle('open', isOpen);
      contribToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      state.contributorsOpen = isOpen;
      persistStateSettings({ contributorsOpen: isOpen });
    });
  }
}

function setupMapSearch() {
  const input = document.getElementById('map-search-input');
  const clearBtn = document.getElementById('map-search-clear');
  const resultsEl = document.getElementById('map-search-results');
  if (!input || input._searchSetup) return;
  input._searchSetup = true;

  let debounceTimer = null;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearBtn.classList.toggle('hidden', !q);
    clearTimeout(debounceTimer);
    if (!q) {
      resultsEl.classList.add('hidden');
      return;
    }
    debounceTimer = setTimeout(() => searchLocation(q), 350);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.add('hidden');
    resultsEl.classList.add('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#map-search-wrapper')) {
      resultsEl.classList.add('hidden');
    }
  });

  input.addEventListener('focus', () => {
    if (resultsEl.children.length && input.value.trim()) {
      resultsEl.classList.remove('hidden');
    }
  });

  // Keyboard operability (combobox pattern): arrows move a highlight over
  // the results, Enter selects, Escape closes. Previously mouse/touch-only.
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-controls', 'map-search-results');
  input.setAttribute('aria-autocomplete', 'list');

  const setActiveResult = (items, idx) => {
    items.forEach((el, i) => {
      el.classList.toggle('kb-active', i === idx);
      if (i === idx) {
        if (!el.id) el.id = `map-search-opt-${i}`;
        input.setAttribute('aria-activedescendant', el.id);
        el.scrollIntoView({ block: 'nearest' });
      }
    });
    if (idx < 0) input.removeAttribute('aria-activedescendant');
  };

  input.addEventListener('keydown', (e) => {
    if (resultsEl.classList.contains('hidden')) return;
    const items = Array.from(resultsEl.querySelectorAll('.map-search-result-item'));
    if (e.key === 'Escape') {
      resultsEl.classList.add('hidden');
      input.removeAttribute('aria-activedescendant');
      return;
    }
    if (!items.length) return;
    const current = items.findIndex(el => el.classList.contains('kb-active'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResult(items, (current + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResult(items, current <= 0 ? items.length - 1 : current - 1);
    } else if (e.key === 'Enter' && current >= 0) {
      e.preventDefault();
      items[current].click();
    }
  });
}

// Match the user's query against the currently loaded stations. Ranking
// mirrors renderStationList: open + priced stations sorted by price (with
// distance as tiebreaker), so the rank badge in the search dropdown is
// the same number the user would see in the list below.
function matchStationsByQuery(query) {
  const stations = Array.isArray(state.stations) ? state.stations : [];
  const open = stations.filter(s => s.isOpen && s.price != null && s.price > 0);
  if (!open.length) return [];

  const ranked = [...open].sort((a, b) => (a.price - b.price) || ((a.dist || 999) - (b.dist || 999)));
  const stationKey = (s) => s.id || `${s.lat},${s.lng}`;
  const rankByKey = new Map();
  ranked.forEach((s, i) => rankByKey.set(stationKey(s), i + 1));

  const q = query.toLowerCase();
  const scored = [];
  for (const s of open) {
    const name = (s.name || '').toLowerCase();
    const brand = (s.brand || '').toLowerCase();
    const street = (s.street || '').toLowerCase();
    const place = (s.place || '').toLowerCase();
    let score = 0;
    if (brand && brand.startsWith(q)) score = 100;
    else if (name && name.startsWith(q)) score = 90;
    else if (brand && brand.includes(q)) score = 80;
    else if (name && name.includes(q)) score = 70;
    else if (street.includes(q)) score = 50;
    else if (place.includes(q)) score = 40;
    if (!score) continue;
    scored.push({ station: s, rank: rankByKey.get(stationKey(s)) || null, score });
  }
  scored.sort((a, b) => (b.score - a.score) || (a.station.price - b.station.price));
  return scored.slice(0, 6);
}

function renderStationSearchResultsHtml(matches) {
  if (!matches.length) return '';
  return matches.map((m, i) => {
    const s = m.station;
    const color = priceColorStable(s.price, s._locationId, s.lat, s.lng);
    const priceParts = formatPriceParts(s.price);
    const distLabel = s.dist ? `${s.distApprox ? '~' : ''}${s.dist.toFixed(1)} km` : '';
    const addrParts = [
      [fixEnc(s.street || ''), s.houseNumber || ''].filter(Boolean).join(' ').trim(),
      fixEnc(s.place || ''),
    ].filter(Boolean).join(', ');
    const meta = [distLabel, addrParts].filter(Boolean).join(' · ');
    return `
      <div class="map-search-result-item map-search-station-item" role="option" data-station-idx="${i}">
        <div class="map-search-station-rank" style="background:${color}">${m.rank ?? '–'}</div>
        <div class="map-search-station-info">
          <div class="map-search-station-name">${fixEnc(s.brand || s.name || '')}</div>
          <div class="map-search-station-addr">${meta}</div>
        </div>
        <div class="map-search-station-price" style="color:${color}">${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''}</div>
      </div>`;
  }).join('');
}

function renderLocationSearchResultsHtml(items) {
  if (!items.length) return '';
  return items.map(item => `
    <div class="map-search-result-item" role="option" data-lat="${item.lat}" data-lng="${item.lon}">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-hint)" style="flex-shrink:0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      <span>${escapeHtml(item.display_name)}</span>
    </div>
  `).join('');
}

function attachStationSearchHandlers(resultsEl, matches) {
  const input = document.getElementById('map-search-input');
  const clearBtn = document.getElementById('map-search-clear');
  resultsEl.querySelectorAll('.map-search-station-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.stationIdx, 10);
      const station = matches[idx]?.station;
      if (!station) return;
      haptic('light');
      input.value = station.brand || station.name || '';
      clearBtn.classList.remove('hidden');
      resultsEl.classList.add('hidden');
      document.getElementById('map-location-banner')?.classList.add('hidden');
      if (Number.isFinite(station.lat) && Number.isFinite(station.lng) && state.map) {
        state.map.flyTo([station.lat, station.lng], 15, { duration: 0.6 });
      }
      showStationSheet(station);
    });
  });
}

function attachLocationSearchHandlers(resultsEl) {
  resultsEl.querySelectorAll('.map-search-result-item:not(.map-search-station-item)').forEach(el => {
    el.addEventListener('click', async () => {
      const lat = parseFloat(el.dataset.lat);
      const lng = parseFloat(el.dataset.lng);
      document.getElementById('map-search-input').value = el.querySelector('span').textContent;
      document.getElementById('map-search-clear').classList.remove('hidden');
      resultsEl.classList.add('hidden');
      // Hide location banner since user picked a location
      document.getElementById('map-location-banner')?.classList.add('hidden');
      // Tear down any open picker so the ripple is the only overlay
      if (state._scanPicker) exitScanPickerMode();
      state.loaded.map = true;

      // Austria has live E-Control coverage everywhere — no scan, no queue,
      // no cooldown. Just fly to the spot and load prices directly. Same
      // applies for German locations that already sit inside (or within
      // 25 km of) an existing scan location's radius — manually scanning
      // there would be wasted, the data is already in the cache.
      // The user's pin (state.userLat/Lng) is NOT moved by a search — the
      // search only changes the map view, not the user's actual location.
      const covered = await isLocationAlreadyCovered(lat, lng);
      if (covered) {
        applyCountryUi();
        if (state.map) state.map.flyTo([lat, lng], 13, { duration: 0.6 });
        await new Promise(r => setTimeout(r, 650));
        // viewport refresh fires from the moveend hook after flyTo finishes.
        return;
      }

      // Germany flow: queue if a scan is running or the cooldown is still ticking.
      if (isScanBusy()) {
        enqueueScan(lat, lng);
        return;
      }

      const flyDuration = 0.6;
      if (state.map) state.map.flyTo([lat, lng], 13, { duration: flyDuration });
      await new Promise(r => setTimeout(r, flyDuration * 1000 + 50));
      await runScanAt(lat, lng);
    });
  });
}

// Monotonic counter so only the latest search's async results get rendered.
// Fast typing fires several searchLocation calls and the place/station lookups
// can resolve out of order — without this an old response could clobber a newer.
let _searchSeq = 0;

// Last rendered dropdown results, kept so the dropdown can be recoloured if the
// regional price band loads after the results were first drawn.
let _lastSearchResults = null;

// Places come only from DE/AT — countrycodes keeps Nominatim from returning
// worldwide noise. Called directly (not via /api/geocode) so search keeps
// working for anonymous users, same posture as /api/stations.
async function fetchPlaceResults(query) {
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&countrycodes=de,at&accept-language=${state.lang || 'de'}`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Searches every cached station server-side, not just the current viewport,
// so a station can be found anywhere the scanner has data.
async function fetchServerStationMatches(query) {
  const fuel = state.fuelType || 'diesel';
  let url = `/api/stations/search?q=${encodeURIComponent(query)}&fuel=${encodeURIComponent(fuel)}`;
  if (state.userLat != null && state.userLng != null) {
    url += `&lat=${state.userLat}&lng=${state.userLng}`;
  }
  try {
    const data = await api(url);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Combine the instant local (viewport) hits with the server-wide hits. Local
// matches win on dedupe so they keep their list rank; server-only stations are
// appended without a rank badge.
function mergeStationMatches(localMatches, serverStations) {
  const keyOf = (s) => s.id || `${s.lat},${s.lng}`;
  const seen = new Set(localMatches.map(m => keyOf(m.station)));
  const merged = [...localMatches];
  for (const s of serverStations) {
    const key = keyOf(s);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({ station: s, rank: null, score: 0 });
  }
  return merged.slice(0, 8);
}

async function searchLocation(query) {
  const resultsEl = document.getElementById('map-search-results');
  const seq = ++_searchSeq;

  // Local viewport hits are synchronous — show them at once for instant
  // feedback while the async place/station lookups are still in flight.
  const localMatches = matchStationsByQuery(query);
  if (localMatches.length) {
    resultsEl.innerHTML = renderStationSearchResultsHtml(localMatches);
    resultsEl.classList.remove('hidden');
    attachStationSearchHandlers(resultsEl, localMatches);
  }

  const [locationItems, serverStations] = await Promise.all([
    fetchPlaceResults(query),
    fetchServerStationMatches(query),
  ]);

  // A newer keystroke already started — discard these stale results.
  if (seq !== _searchSeq) return;

  const stationMatches = mergeStationMatches(localMatches, serverStations);
  _lastSearchResults = { locationItems, stationMatches };
  renderSearchResultsInto(resultsEl, locationItems, stationMatches);
}

// Builds the dropdown markup (places first, stations after) and wires handlers.
function renderSearchResultsInto(resultsEl, locationItems, stationMatches) {
  const stationHtml = renderStationSearchResultsHtml(stationMatches);
  const locationHtml = renderLocationSearchResultsHtml(locationItems);

  if (!stationHtml && !locationHtml) {
    resultsEl.innerHTML = `<div class="map-search-no-results">${t('noSearchResults')}</div>`;
    resultsEl.classList.remove('hidden');
    return;
  }

  // Places first, stations after — places are the preferred result type.
  resultsEl.innerHTML = locationHtml + stationHtml;
  resultsEl.classList.remove('hidden');
  attachLocationSearchHandlers(resultsEl);
  attachStationSearchHandlers(resultsEl, stationMatches);
}

// Re-render the open search dropdown so station price colours pick up a price
// band that loaded after the results were first drawn. Without this the map and
// station list recolour on band-ready but the dropdown stays neutral grey.
function recolorOpenSearchResults() {
  const resultsEl = document.getElementById('map-search-results');
  if (!resultsEl || resultsEl.classList.contains('hidden') || !_lastSearchResults) return;
  renderSearchResultsInto(resultsEl, _lastSearchResults.locationItems, _lastSearchResults.stationMatches);
}

// ─── Route planner ────────────────────────────────────────────────

function formatDuration(min) {
  if (!Number.isFinite(min) || min < 1) return '<1 min';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function setupRoutePanel() {
  const chip = document.getElementById('map-route-chip');
  const panel = document.getElementById('map-route-panel');
  if (!chip || !panel || chip._setup) return;
  chip._setup = true;

  const startInput = document.getElementById('map-route-start-input');
  const destInput = document.getElementById('map-route-dest-input');
  const startResults = document.getElementById('map-route-start-results');
  const destResults = document.getElementById('map-route-dest-results');
  const goBtn = document.getElementById('map-route-go');
  const closeBtn = document.getElementById('map-route-close');
  const summaryEl = document.getElementById('map-route-summary');

  chip.addEventListener('click', () => {
    haptic('light');
    const expanded = chip.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      panel.classList.add('hidden');
      chip.setAttribute('aria-expanded', 'false');
    } else {
      panel.classList.remove('hidden');
      chip.setAttribute('aria-expanded', 'true');
      // If user has GPS, pre-fill start as "current location" sentinel.
      if (!startInput.value && (state.userLat != null && state.userLng != null)) {
        startInput.value = t('routeCurrentLocation');
        startInput.dataset.lat = String(state.userLat);
        startInput.dataset.lng = String(state.userLng);
        updateRouteGoButton();
      }
      destInput.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    haptic('light');
    closeRoutePanel();
    if (state.routeMode) exitRouteMode();
  });

  bindRouteAutocomplete(startInput, startResults, { allowCurrentLocation: true });
  bindRouteAutocomplete(destInput, destResults, { allowCurrentLocation: false });

  goBtn.addEventListener('click', async () => {
    const start = getRouteInputCoords(startInput);
    const dest = getRouteInputCoords(destInput);
    if (!start) { showToast(t('routeNoStart')); return; }
    if (!dest) { showToast(t('routeNoDest')); return; }
    goBtn.disabled = true;
    summaryEl.classList.remove('hidden');
    summaryEl.textContent = t('routeLoading');
    try {
      await enterRouteMode(start, dest);
    } catch (err) {
      summaryEl.textContent = err?.message || t('routeNoRoute');
    } finally {
      goBtn.disabled = false;
      updateRouteGoButton();
    }
  });

  [startInput, destInput].forEach(i => i.addEventListener('input', updateRouteGoButton));

  function updateRouteGoButton() {
    const start = getRouteInputCoords(startInput);
    const dest = getRouteInputCoords(destInput);
    goBtn.disabled = !(start && dest);
  }
}

function getRouteInputCoords(input) {
  const lat = parseFloat(input.dataset.lat || '');
  const lng = parseFloat(input.dataset.lng || '');
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, label: input.value };
}

function bindRouteAutocomplete(input, resultsEl, { allowCurrentLocation }) {
  let debounceTimer = null;

  input.addEventListener('input', () => {
    // Clear attached coords whenever the user types — they'll be re-set
    // when the user picks a suggestion.
    delete input.dataset.lat;
    delete input.dataset.lng;
    const q = input.value.trim();
    clearTimeout(debounceTimer);
    if (!q) {
      resultsEl.classList.add('hidden');
      resultsEl.innerHTML = '';
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8&countrycodes=de,at&accept-language=${state.lang || 'de'}`);
        const data = await resp.json();
        renderRouteSuggestions(resultsEl, input, data, { allowCurrentLocation });
      } catch {
        resultsEl.innerHTML = `<div class="map-route-suggest-item">${t('noSearchResults')}</div>`;
        resultsEl.classList.remove('hidden');
      }
    }, 350);
  });

  input.addEventListener('focus', () => {
    if (allowCurrentLocation && state.userLat != null && state.userLng != null && !input.value.trim()) {
      renderRouteSuggestions(resultsEl, input, [], { allowCurrentLocation });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#map-route-panel')) {
      resultsEl.classList.add('hidden');
    }
  });
}

function renderRouteSuggestions(resultsEl, input, data, { allowCurrentLocation }) {
  const items = [];
  if (allowCurrentLocation && state.userLat != null && state.userLng != null) {
    items.push(`
      <div class="map-route-suggest-item is-current-location" data-lat="${state.userLat}" data-lng="${state.userLng}" data-label="${t('routeCurrentLocation')}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
        <span>${t('routeCurrentLocation')}</span>
      </div>
    `);
  }
  (data || []).forEach(item => {
    items.push(`
      <div class="map-route-suggest-item" data-lat="${item.lat}" data-lng="${item.lon}" data-label="${escapeHtml(item.display_name)}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--color-hint)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>${escapeHtml(item.display_name)}</span>
      </div>
    `);
  });
  if (!items.length) {
    resultsEl.innerHTML = `<div class="map-route-suggest-item">${t('noSearchResults')}</div>`;
    resultsEl.classList.remove('hidden');
    return;
  }
  resultsEl.innerHTML = items.join('');
  resultsEl.classList.remove('hidden');

  resultsEl.querySelectorAll('.map-route-suggest-item').forEach(el => {
    el.addEventListener('click', () => {
      input.value = el.dataset.label || el.querySelector('span').textContent;
      input.dataset.lat = el.dataset.lat;
      input.dataset.lng = el.dataset.lng;
      resultsEl.classList.add('hidden');
      document.getElementById('map-route-go').disabled =
        !(getRouteInputCoords(document.getElementById('map-route-start-input'))
          && getRouteInputCoords(document.getElementById('map-route-dest-input')));
    });
  });
}

async function enterRouteMode(start, dest) {
  const resp = await fetch('/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startLat: start.lat, startLng: start.lng,
      destLat: dest.lat, destLng: dest.lng,
      fuel: state.fuelType,
      bufferKm: 3,
    }),
  });
  if (resp.status === 401) throw new Error(t('routeLoginRequired'));
  if (resp.status === 503) throw new Error(t('routeNoOrs'));
  if (!resp.ok) throw new Error(t('routeNoRoute'));
  const data = await resp.json();
  if (!data.route?.coordinates?.length) throw new Error(t('routeNoRoute'));

  // Capture pre-route state so exitRouteMode can restore it.
  if (!state.routeMode) {
    state._stationsBeforeRoute = state.stations;
  }
  state.routeMode = true;
  state.routeStart = start;
  state.routeDest = dest;
  state.routeSummary = {
    distanceKm: data.route.distanceKm,
    durationMin: data.route.durationMin,
    count: data.stations.length,
  };

  // Clear existing station markers / cluster / user pin so only the route
  // and its corridor remain visible.
  if (state.clusterGroup) { state.map.removeLayer(state.clusterGroup); state.clusterGroup = null; }
  state.markers.forEach(m => state.map.removeLayer(m));
  state.markers = [];

  // Leaflet doesn't resolve CSS vars in SVG attributes — grab the computed value.
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent').trim() || '#007aff';

  // Polyline — Leaflet takes [lat, lng] but ORS gives [lng, lat].
  const latlngs = data.route.coordinates.map(([lng, lat]) => [lat, lng]);
  if (state.routeLayer) state.map.removeLayer(state.routeLayer);
  state.routeLayer = L.polyline(latlngs, {
    color: accentColor,
    weight: 5,
    opacity: 0.85,
    interactive: false,
  }).addTo(state.map);

  // Start/dest pin markers
  if (state.routeStartMarker) state.map.removeLayer(state.routeStartMarker);
  if (state.routeDestMarker) state.map.removeLayer(state.routeDestMarker);
  state.routeStartMarker = L.marker([start.lat, start.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${accentColor};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    }),
  }).addTo(state.map);
  state.routeDestMarker = L.marker([dest.lat, dest.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid ${accentColor};box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    }),
  }).addTo(state.map);

  // Overlay stations from the corridor response into state.stations and render.
  state.stations = data.stations;
  renderStationsOnMap(data.stations, { skipFitBounds: true, skipRadiusFilter: true });
  renderStationList(data.stations);

  // Fit map to route + both pins.
  state.map.fitBounds(state.routeLayer.getBounds().pad(0.1));

  // Hide competing UI bits — the normal search/scan flow would clobber
  // state.stations and erase the corridor.
  document.getElementById('btn-search-here')?.classList.add('hidden');
  document.getElementById('map-search-box')?.classList.add('hidden');
  document.getElementById('map-loading')?.classList.add('hidden');

  // Update panel summary + show exit button.
  const summaryEl = document.getElementById('map-route-summary');
  summaryEl.classList.remove('hidden');
  summaryEl.textContent = t('routeSummary')(
    state.routeSummary.distanceKm,
    state.routeSummary.durationMin,
    state.routeSummary.count,
  );
  showRouteExitButton();

  // Kick off scan-point fills in the background. The function manages its own
  // markers, sequential 30 s cooldown, and incremental corridor refresh — we
  // don't await it because the UI is already interactive with cached results.
  if (Array.isArray(data.scanPoints) && data.scanPoints.length > 0) {
    processRouteScanPoints(data.scanPoints, start, dest);
  } else if (!data.stations.length) {
    showToast(t('routeNoStations'));
  }
}

/**
 * Walk the scan points returned by /api/route, dropping a yellow dot at each.
 * Scan them one-by-one with a 30 s cooldown between calls; refresh the
 * corridor list after each successful fill so the sidebar grows as new
 * stations come in.
 */
async function processRouteScanPoints(scanPoints, start, dest) {
  const runId = ++state.routeScanRunId;
  const fuel = state.fuelType;

  // Clean up any previous run's markers before placing new ones.
  if (state.routeScanMarkers) {
    state.routeScanMarkers.forEach((entry) => {
      try { state.map.removeLayer(entry.marker); } catch {}
      entry.stopRipples?.();
    });
  }
  state.routeScanMarkers = scanPoints.map((p) => {
    const marker = L.marker([p.lat, p.lng], {
      icon: L.divIcon({
        className: 'route-scan-dot pending',
        html: '<div class="route-scan-dot-inner"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
      interactive: false,
      keyboard: false,
    }).addTo(state.map);
    // Continuous ripple circles at the 25 km live-scan radius — same
    // visual as the "Hier suchen" button so the user sees exactly what
    // area each dot will cover. Cancelled when the dot transitions to
    // done / empty / error.
    const stopRipples = startRouteScanRipples(p.lat, p.lng);
    return { marker, stopRipples, lat: p.lat, lng: p.lng };
  });

  const setDotState = (i, cls) => {
    const entry = state.routeScanMarkers?.[i];
    if (!entry) return;
    const el = entry.marker.getElement();
    if (el) {
      el.classList.remove('pending', 'scanning', 'done', 'empty', 'error');
      el.classList.add(cls);
    }
    if (cls === 'done' || cls === 'empty' || cls === 'error') {
      entry.stopRipples?.();
      entry.stopRipples = null;
    }
  };

  for (let i = 0; i < scanPoints.length; i++) {
    if (runId !== state.routeScanRunId || !state.routeMode) return;
    if (i > 0) {
      await sleep(30000);
      if (runId !== state.routeScanRunId || !state.routeMode) return;
    }
    setDotState(i, 'scanning');

    let scanOk = false;
    let hadStations = false;
    let rateLimited = false;
    try {
      const resp = await fetch('/api/route/scan-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: scanPoints[i].lat,
          lng: scanPoints[i].lng,
          fuel,
        }),
      });
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) {
        scanOk = true;
        hadStations = (body.stationsFound ?? 0) > 0;
      } else if (resp.status === 429 || body.rateLimited) {
        // Tankerkönig soft rate-cap — the 30 s wait before the next scan
        // usually clears it. Distinguish from a real failure so we don't
        // scare the user with a red dot for a backend throttling event.
        rateLimited = true;
      }
    } catch {
      // network error — treated as 'error' dot below
    }

    if (runId !== state.routeScanRunId || !state.routeMode) return;
    const dotState = scanOk
      ? (hadStations ? 'done' : 'empty')
      : rateLimited ? 'empty' : 'error';
    setDotState(i, dotState);

    // Refresh corridor list from the now-warmer cache.
    try {
      const resp = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startLat: start.lat, startLng: start.lng,
          destLat: dest.lat, destLng: dest.lng,
          fuel, bufferKm: 3,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (runId !== state.routeScanRunId || !state.routeMode) return;
        if (Array.isArray(data.stations)) {
          state.stations = data.stations;
          if (state.routeSummary) state.routeSummary.count = data.stations.length;
          renderStationsOnMap(data.stations, { skipFitBounds: true, skipRadiusFilter: true });
          renderStationList(data.stations);
          const summaryEl = document.getElementById('map-route-summary');
          if (summaryEl && state.routeSummary) {
            summaryEl.textContent = t('routeSummary')(
              state.routeSummary.distanceKm,
              state.routeSummary.durationMin,
              state.routeSummary.count,
            );
          }
        }
      }
    } catch {
      // keep going to next scan point — partial results are better than nothing
    }
  }

  // Fade markers out a moment after the last scan so the user sees the final state.
  setTimeout(() => {
    if (runId !== state.routeScanRunId) return;
    state.routeScanMarkers?.forEach((entry) => {
      try { state.map.removeLayer(entry.marker); } catch {}
      entry.stopRipples?.();
    });
    state.routeScanMarkers = null;
  }, 3000);
}

/**
 * Spawn continuously expanding L.circle ripples at (lat, lng) that grow to
 * the 25 km live-scan radius — identical to the "Hier suchen" animation so
 * users see exactly what geographic area each dot scans. Zoom changes keep
 * the ripples at the correct ground size (L.circle uses meters).
 * Returns a cancel function that stops the interval and removes live ripples.
 */
const ROUTE_SCAN_RIPPLE_RADIUS_KM = 25;
const ROUTE_SCAN_RIPPLE_DURATION = 1800;
const ROUTE_SCAN_RIPPLE_STAGGER = 900;
function startRouteScanRipples(lat, lng) {
  let stopped = false;
  const live = new Set();
  const finalRadius = ROUTE_SCAN_RIPPLE_RADIUS_KM * 1000;
  const color = getAccentColor();

  const spawn = () => {
    if (stopped || !state.map) return;
    let ripple;
    try {
      ripple = L.circle([lat, lng], {
        radius: 0,
        color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.1,
        interactive: false,
      }).addTo(state.map);
    } catch {
      return;
    }
    live.add(ripple);
    const t0 = performance.now();
    const step = (now) => {
      if (stopped) return;
      const t = Math.min((now - t0) / ROUTE_SCAN_RIPPLE_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      try {
        ripple.setRadius(eased * finalRadius);
        ripple.setStyle({
          opacity: 0.8 * (1 - t * 0.8),
          fillOpacity: 0.1 * (1 - t),
        });
      } catch {
        live.delete(ripple);
        return;
      }
      if (t < 1) requestAnimationFrame(step);
      else {
        try { state.map.removeLayer(ripple); } catch {}
        live.delete(ripple);
      }
    };
    requestAnimationFrame(step);
  };

  spawn();
  const interval = setInterval(spawn, ROUTE_SCAN_RIPPLE_STAGGER);

  return () => {
    stopped = true;
    clearInterval(interval);
    live.forEach((r) => { try { state.map.removeLayer(r); } catch {} });
    live.clear();
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function exitRouteMode() {
  if (!state.routeMode) return;
  state.routeScanRunId++; // cancel in-flight scan loop
  if (state.routeLayer) { state.map.removeLayer(state.routeLayer); state.routeLayer = null; }
  if (state.routeStartMarker) { state.map.removeLayer(state.routeStartMarker); state.routeStartMarker = null; }
  if (state.routeDestMarker) { state.map.removeLayer(state.routeDestMarker); state.routeDestMarker = null; }
  if (state.routeScanMarkers) {
    state.routeScanMarkers.forEach((entry) => {
      try { state.map.removeLayer(entry.marker); } catch {}
      entry.stopRipples?.();
    });
    state.routeScanMarkers = null;
  }
  state.routeMode = false;
  state.routeStart = null;
  state.routeDest = null;
  state.routeSummary = null;

  document.getElementById('btn-search-here')?.classList.remove('hidden');
  document.getElementById('map-search-box')?.classList.remove('hidden');
  hideRouteExitButton();

  // Reload normal station list for current viewport.
  state._stationsBeforeRoute = null;
  loadStationsAroundCenter({ silent: false });
}

function closeRoutePanel() {
  const chip = document.getElementById('map-route-chip');
  const panel = document.getElementById('map-route-panel');
  if (!chip || !panel) return;
  panel.classList.add('hidden');
  chip.setAttribute('aria-expanded', 'false');
}

function showRouteExitButton() {
  let btn = document.getElementById('route-exit-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'route-exit-btn';
    btn.className = 'route-exit-btn';
    btn.type = 'button';
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg><span>${t('routeExit')}</span>`;
    btn.addEventListener('click', () => { haptic('light'); exitRouteMode(); });
    document.getElementById('map-container').appendChild(btn);
  } else {
    btn.classList.remove('hidden');
  }
}

function hideRouteExitButton() {
  const btn = document.getElementById('route-exit-btn');
  if (btn) btn.classList.add('hidden');
}

function initAlertUI() {
  document.getElementById('alert-toggle').addEventListener('change', async (e) => {
    haptic('light');
    const toggle = e.target;
    const config = document.getElementById('alert-config');
    if (toggle.checked) {
      // Just reveal the config; nothing is saved server-side until "Save".
      config.style.display = 'block';
    } else {
      // Optimistic disable: hide UI immediately, roll back on failure.
      const previous = config.style.display;
      config.style.display = 'none';
      try {
        await deleteAlert();
      } catch {
        // Roll back on error
        toggle.checked = true;
        config.style.display = previous || 'block';
      }
    }
  });

  document.getElementById('alert-minus').addEventListener('click', () => {
    haptic('light');
    const next = Math.max(1.00, Math.round(((state.alertPrice || 2.0) - 0.01) * 100) / 100);
    state.alertPrice = next;
    updateAlertDisplay();
  });

  document.getElementById('alert-plus').addEventListener('click', () => {
    haptic('light');
    const next = Math.min(3.00, Math.round(((state.alertPrice || 2.0) + 0.01) * 100) / 100);
    state.alertPrice = next;
    updateAlertDisplay();
  });

  // Direct numeric entry — user can type the threshold instead of stepping.
  const priceInput = document.getElementById('alert-price-display');
  if (priceInput) {
    const commit = () => {
      const raw = (priceInput.value || '').replace(/[€\s]/g, '').replace(',', '.');
      const n = parseFloat(raw);
      if (Number.isFinite(n)) {
        state.alertPrice = Math.max(1.00, Math.min(3.00, Math.round(n * 100) / 100));
      }
      updateAlertDisplay();
    };
    priceInput.addEventListener('focus', () => {
      // Strip the € while editing so the user types a clean number.
      priceInput.value = (state.alertPrice || 2.0).toFixed(2).replace('.', ',');
      requestAnimationFrame(() => priceInput.select());
    });
    priceInput.addEventListener('blur', commit);
    priceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); priceInput.blur(); }
      else if (e.key === 'Escape') { e.preventDefault(); priceInput.blur(); }
    });
  }

  // Draggable threshold bar — click or drag the marker to set the price.
  const bar = document.getElementById('alert-threshold-bar');
  const track = bar?.querySelector('.alert-threshold-bar-track');
  if (bar && track) {
    const priceFromX = (clientX) => {
      const lowText = document.getElementById('alert-bar-low')?.textContent || '';
      const highText = document.getElementById('alert-bar-high')?.textContent || '';
      const low = parseFloat(lowText.replace(',', '.'));
      const high = parseFloat(highText.replace(',', '.'));
      if (!Number.isFinite(low) || !Number.isFinite(high) || high <= low) return null;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round((low + pct * (high - low)) * 100) / 100;
    };
    const apply = (clientX) => {
      const price = priceFromX(clientX);
      if (price == null) return;
      state.alertPrice = Math.max(1.00, Math.min(3.00, price));
      updateAlertDisplay();
    };
    let dragging = false;
    bar.addEventListener('pointerdown', (e) => {
      if (bar.hidden) return;
      e.preventDefault();
      dragging = true;
      bar.classList.add('is-dragging');
      try { bar.setPointerCapture(e.pointerId); } catch {}
      haptic('light');
      apply(e.clientX);
    });
    bar.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      apply(e.clientX);
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      bar.classList.remove('is-dragging');
      try { bar.releasePointerCapture(e.pointerId); } catch {}
    };
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);
    bar.addEventListener('keydown', (e) => {
      if (bar.hidden) return;
      const cur = state.alertPrice || 2.0;
      let next = null;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = cur - 0.01;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = cur + 0.01;
      else if (e.key === 'PageDown') next = cur - 0.05;
      else if (e.key === 'PageUp') next = cur + 0.05;
      if (next != null) {
        e.preventDefault();
        state.alertPrice = Math.max(1.00, Math.min(3.00, Math.round(next * 100) / 100));
        updateAlertDisplay();
      }
    });
  }

  document.getElementById('alert-save').addEventListener('click', saveAlert);
  document.getElementById('alert-test').addEventListener('click', testAlert);

  // Show email channel button if SMTP configured
  if (state.smtpConfigured) {
    const emailBtn = document.getElementById('alert-ch-email');
    if (emailBtn) emailBtn.style.display = '';
  }

  // Channel picker
  const channelSegs = document.querySelectorAll('#alert-channel-picker .alert-ch-seg');
  channelSegs.forEach(seg => {
    seg.addEventListener('click', () => {
      haptic('light');
      const ch = seg.dataset.channel;
      channelSegs.forEach(s => { s.classList.remove('active'); s.setAttribute('aria-selected', 'false'); });
      seg.classList.add('active');
      seg.setAttribute('aria-selected', 'true');
      state.alertChannel = ch;
      document.getElementById('alert-ntfy-config').style.display = ch === 'ntfy' ? 'block' : 'none';
      document.getElementById('alert-email-config').style.display = ch === 'email' ? 'block' : 'none';
    });
  });

  // ntfy topic input
  const ntfyInput = document.getElementById('alert-ntfy-topic');
  if (ntfyInput) {
    ntfyInput.addEventListener('input', () => {
      state.alertNtfyTopic = ntfyInput.value.trim();
    });
  }

  // email input
  const emailInput = document.getElementById('alert-email-address');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      state.alertEmail = emailInput.value.trim();
    });
  }

  refreshAlertUi();
}

// Format a relative timestamp like "vor 3 Min." / "vor 2 Std." for the
// alert status panel. Uses the same i18n keys as the rest of the app.
function formatRelativeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 60_000) return t('alertJustNow') || 'just now';
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return (t('alertMinutesAgoFmt') || '{n} min ago').replace('{n}', mins);
  const hours = Math.round(mins / 60);
  if (hours < 36) return (t('alertHoursAgoFmt') || '{n} h ago').replace('{n}', hours);
  const days = Math.round(hours / 24);
  return (t('alertDaysAgoFmt') || '{n} d ago').replace('{n}', days);
}

async function refreshAlertUi() {
  const toggle = document.getElementById('alert-toggle');
  const configEl = document.getElementById('alert-config');
  const activeInfo = document.getElementById('alert-active-info');
  const refEl = document.getElementById('alert-ref-price');
  const card = document.getElementById('alert-card');

  // Track the cheapest in radius so the threshold bar + status panel can
  // show how the user's threshold relates to the current market.
  let cheapestInRadius = null;
  try {
    // Reuse the stations the map already loaded instead of re-fetching on
    // every settings-tab visit — the threshold bar only needs a rough
    // "cheapest nearby" anchor, and the map data is at most minutes old.
    let stations = Array.isArray(state.stations) && state.stations.length ? state.stations : null;
    if (!stations) {
      const coords = getActiveCoords();
      stations = await api(`/api/stations?lat=${coords.lat}&lng=${coords.lng}&rad=${state.radiusKm}&fuel=${state.fuelType}`);
    }
    const priced = stations.filter(s => typeof s.price === 'number');
    if (priced.length) {
      const prices = priced.map(s => s.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      cheapestInRadius = { min, max };
      refEl.textContent = (t('alertStatusCheapestFmt') || 'Currently cheapest price: {price}').replace('{price}', formatPrice(min));
      if (!state.alertPrice) state.alertPrice = Math.max(1.5, Math.round((min - 0.03) * 100) / 100);
    }
  } catch {}

  let alert = null;
  try {
    alert = await api(state.user ? '/api/alert' : '/api/alert/local');
  } catch { /* network error — keep current UI */ return; }

  if (alert?.threshold && alert.enabled !== false) {
    state.alertPrice = alert.threshold;
    state.alertChannel = alert.channel || 'ntfy';
    state.alertNtfyTopic = alert.ntfyTopic || '';
    state.alertEmail = alert.email || '';
    toggle.checked = true;
    configEl.style.display = 'block';
    if (card) card.classList.add('is-armed');
    activeInfo.style.display = 'none'; // status panel replaces this
    activeInfo.textContent = '';

    // Restore channel picker UI
    const channelSegs = document.querySelectorAll('#alert-channel-picker .alert-ch-seg');
    channelSegs.forEach(s => {
      const active = s.dataset.channel === state.alertChannel;
      s.classList.toggle('active', active);
      s.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.getElementById('alert-ntfy-config').style.display = state.alertChannel === 'ntfy' ? 'block' : 'none';
    document.getElementById('alert-email-config').style.display = state.alertChannel === 'email' ? 'block' : 'none';
    const ntfyInput = document.getElementById('alert-ntfy-topic');
    if (ntfyInput) ntfyInput.value = state.alertNtfyTopic;
    const emailInput = document.getElementById('alert-email-address');
    if (emailInput) emailInput.value = state.alertEmail;

    // Status panel — surfaces the background evaluator's state so the
    // user understands the alert is being checked server-side, not
    // only when the website is open.
    const statusLabel = document.getElementById('alert-status-label');
    const statusState = document.getElementById('alert-status-state');
    const statusPanel = document.getElementById('alert-status-panel');
    const lastRow = document.getElementById('alert-status-last');
    const lastText = document.getElementById('alert-status-last-text');
    if (statusLabel && statusState) {
      const isBelow = cheapestInRadius && cheapestInRadius.min < alert.threshold;
      statusState.classList.toggle('is-below', !!isBelow);
      statusState.classList.toggle('is-armed', !isBelow);
      if (statusPanel) {
        statusPanel.classList.toggle('is-below', !!isBelow);
        statusPanel.classList.toggle('is-armed', !isBelow);
      }
      statusLabel.textContent = isBelow
        ? t('alertStatusBelow') || 'Currently below threshold'
        : t('alertStatusArmed') || 'Active · monitoring in the background';
    }
    if (lastRow && lastText) {
      if (alert.lastNotifiedAt) {
        const when = formatRelativeAgo(alert.lastNotifiedAt);
        const priceStr = typeof alert.lastNotifiedPrice === 'number'
          ? formatPrice(alert.lastNotifiedPrice)
          : '';
        lastRow.hidden = false;
        lastText.textContent = (t('alertStatusLastFiredFmt') || 'Last notified {when} at {price}')
          .replace('{when}', when)
          .replace('{price}', priceStr);
      } else {
        lastRow.hidden = true;
      }
    }
  } else {
    // No active alert — collapse the panel.
    toggle.checked = false;
    configEl.style.display = 'none';
    if (card) card.classList.remove('is-armed');
    activeInfo.style.display = 'none';
    activeInfo.textContent = '';
    // Reset the status row to the neutral "not yet active" look so the
    // green dot doesn't lie if the user re-opens the panel without saving.
    const statusState = document.getElementById('alert-status-state');
    const statusPanel = document.getElementById('alert-status-panel');
    const statusLabel = document.getElementById('alert-status-label');
    const lastRow = document.getElementById('alert-status-last');
    statusState?.classList.remove('is-armed', 'is-below');
    statusPanel?.classList.remove('is-armed', 'is-below');
    if (statusLabel) statusLabel.textContent = t('alertStatusInactive') || 'Noch nicht aktiv';
    if (lastRow) lastRow.hidden = true;
  }

  // Threshold-vs-current-cheapest bar. The threshold marker slides along
  // a track bounded by [cheapest-0.10, cheapest+0.15] so the user can
  // see whether their threshold is realistic without having to do mental
  // maths against the cheapest price.
  const barEl = document.getElementById('alert-threshold-bar');
  const barCurrent = document.getElementById('alert-bar-current');
  const barMarker = document.getElementById('alert-bar-marker');
  const barLow = document.getElementById('alert-bar-low');
  const barHigh = document.getElementById('alert-bar-high');
  if (barEl && cheapestInRadius && state.alertPrice) {
    const low = Math.max(1.0, cheapestInRadius.min - 0.10);
    const high = cheapestInRadius.min + 0.15;
    const range = Math.max(high - low, 0.0001);
    const clamp01 = (n) => Math.max(0, Math.min(1, n));
    const currentPct = clamp01((cheapestInRadius.min - low) / range) * 100;
    const markerPct = clamp01((state.alertPrice - low) / range) * 100;
    barEl.hidden = false;
    if (barCurrent) barCurrent.style.left = `${currentPct}%`;
    if (barMarker) barMarker.style.left = `${markerPct}%`;
    if (barLow) barLow.textContent = formatPrice(low);
    if (barHigh) barHigh.textContent = formatPrice(high);
  } else if (barEl) {
    barEl.hidden = true;
  }

  updateAlertDisplay();
}

function updateAlertDisplay() {
  const display = document.getElementById('alert-price-display');
  if (display && document.activeElement !== display) {
    display.value = formatPrice(state.alertPrice || 2.0);
  }
  // Slide the threshold marker on the visual bar as the user steps the
  // price. Keep the marker inside the visible track.
  const barEl = document.getElementById('alert-threshold-bar');
  const marker = document.getElementById('alert-bar-marker');
  if (barEl && !barEl.hidden && marker) {
    const lowText = document.getElementById('alert-bar-low')?.textContent || '';
    const highText = document.getElementById('alert-bar-high')?.textContent || '';
    const low = parseFloat(lowText.replace(',', '.'));
    const high = parseFloat(highText.replace(',', '.'));
    if (Number.isFinite(low) && Number.isFinite(high) && high > low) {
      const pct = Math.max(0, Math.min(1, ((state.alertPrice || 0) - low) / (high - low)));
      marker.style.left = `${pct * 100}%`;
    }
    barEl.setAttribute('aria-valuenow', String((state.alertPrice || 0).toFixed(2)));
  }
}

async function saveAlert() {
  haptic('medium');

  if (state.alertChannel === 'ntfy' && !state.alertNtfyTopic) {
    showToast(t('enterNtfyTopic'));
    return;
  }

  if (state.alertChannel === 'email' && !state.alertEmail) {
    showToast(t('enterEmail'));
    return;
  }

  if (state.user) setSyncBadgeState('syncing', ['alert']);
  try {
    // Capture the user's current location so the background evaluator
    // knows which area to watch. Falls back to the GPS / saved fallback.
    const coords = getActiveCoords();
    const result = await api(state.user ? '/api/alert' : '/api/alert/local', {
      method: 'POST',
      body: JSON.stringify({
        threshold: state.alertPrice,
        fuel: state.fuelType,
        enabled: true,
        channel: state.alertChannel,
        ntfyTopic: state.alertNtfyTopic,
        email: state.alertEmail,
        lat: coords.lat,
        lng: coords.lng,
        radiusKm: state.radiusKm || 25,
      })
    });
    if (result?.ok) {
      haptic('success');
      if (state.user) setSyncBadgeState('synced', ['alert']);
      const chLabel = state.alertChannel === 'email' ? ' (E-Mail)' : ' (ntfy.sh)';
      document.getElementById('alert-active-info').style.display = 'block';
      document.getElementById('alert-active-info').textContent = `${t('alertActive')} ${formatPrice(state.alertPrice)}${chLabel}`;
      showPopup(t('saved'), `${t('alertSetMsg')} ${state.fuelType.toUpperCase()} ${t('under')} ${formatPrice(state.alertPrice)}.`);
      await refreshMe();
      // Pull the saved alert back so the status row flips from
      // "Noch nicht aktiv" to the green "Aktiv" state without a page reload.
      await refreshAlertUi();
    }
  } catch (error) {
    if (state.user) setSyncBadgeState('idle', ['alert']);
    showPopup(t('alertFailed'), error.message || t('serverError'));
  }
}

async function testAlert() {
  haptic('light');
  const title = t('testAlertTitle');
  const body = t('testAlertBody');

  if (state.alertChannel === 'email') {
    if (!state.alertEmail) {
      showToast(t('enterEmail'));
      return;
    }
    try {
      await api('/api/alert/email', {
        method: 'POST',
        body: JSON.stringify({ to: state.alertEmail, subject: title, body })
      });
      haptic('success');
      showToast(t('testSentEmail'));
    } catch (e) {
      showPopup(t('testFailed'), e.message || t('emailSendFailed'));
    }
  } else {
    if (!state.alertNtfyTopic) {
      showToast(t('enterNtfyTopic'));
      return;
    }
    try {
      await api('/api/alert/notify', {
        method: 'POST',
        body: JSON.stringify({ topic: state.alertNtfyTopic, title, message: body })
      });
      haptic('success');
      showToast(t('testSentNtfy'));
    } catch (e) {
      showPopup(t('testFailed'), e.message || t('ntfySendFailed'));
    }
  }
}

// Client-side trigger is no longer needed — the server-side evaluator runs
// after every scheduler cycle and handles dedup via lastNotifiedAt /
// lastNotifiedPrice. Kept as a no-op so call sites don't need to change.
async function checkPriceAlert(_stations) { /* handled server-side */ }

async function deleteAlert() {
  if (state.user) setSyncBadgeState('syncing', ['alert']);
  try {
    await api(state.user ? '/api/alert' : '/api/alert/local', { method: 'DELETE' });
    document.getElementById('alert-config').style.display = 'none';
    document.getElementById('alert-active-info').style.display = 'none';
    const card = document.getElementById('alert-card');
    if (card) card.classList.remove('is-armed');
    haptic('success');
    if (state.user) {
      setSyncBadgeState('synced', ['alert']);
      // Keep state.user.alerts in sync with the server so any later reader
      // (or another refreshAlertUi pass) doesn't see the just-deleted alert.
      await refreshMe();
    }
  } catch (error) {
    if (state.user) setSyncBadgeState('idle', ['alert']);
    showPopup(t('deleteFailed'), error.message || t('deleteError'));
    throw error;
  }
}


function setupMyLocationBtn() {
  const locBtn = document.getElementById('btn-my-location');
  locBtn.addEventListener('pointerdown', e => e.stopPropagation());
  locBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    haptic('medium');

    const flyToUser = (lat, lng) => {
      if (!state.map) return;
      // Toggle: if already centered on user, zoom out to show all stations
      const center = state.map.getCenter();
      const isNearUser = Math.abs(center.lat - lat) < 0.002 && Math.abs(center.lng - lng) < 0.002 && state.map.getZoom() >= 13;
      if (isNearUser && state.defaultBounds) {
        state.map.flyToBounds(state.defaultBounds, { duration: 0.5 });
      } else {
        state.map.flyTo([lat, lng], 14, { duration: 0.5 });
      }
    };

    // Always try device GPS first, fall back to last known location
    if (navigator.geolocation) {
      locBtn.style.opacity = '0.5';
      navigator.geolocation.getCurrentPosition(
        pos => {
          state.userLat = pos.coords.latitude;
          state.userLng = pos.coords.longitude;
          locBtn.style.opacity = '1';
          state.activeLocation = 'gps';
          document.getElementById('map-location-banner')?.classList.add('hidden');
          persistStateSettings({ activeLocation: state.activeLocation });
          state.loaded.map = false;
          loadMapTab({ skipFitBounds: true, silent: true }).then(() => flyToUser(state.userLat, state.userLng));
        },
        () => {
          locBtn.style.opacity = '1';
          // GPS unavailable — fall back to last known coordinates (e.g. search result)
          if (state.userLat && state.userLng) {
            flyToUser(state.userLat, state.userLng);
          } else {
            showPopup(t('locationTitle'), t('locationError'));
          }
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else if (state.userLat && state.userLng) {
      // No geolocation API — fall back to last known coordinates
      flyToUser(state.userLat, state.userLng);
    } else {
      showPopup(t('locationTitle'), t('locationError'));
    }
  });
}

function setupFavouritesToggle() {
  const btn = document.getElementById('station-fav-toggle');
  if (!btn || btn._setup) return;
  btn._setup = true;
  applyFavouritesToggleUi();
  btn.addEventListener('click', () => {
    haptic('light');
    const next = !state.favouritesOnTop;
    // persistStateSettings calls applySettingsToState which sets the flag,
    // refreshes the toggle UI and re-renders the list, plus syncs to the
    // Felo ID account if logged in.
    persistStateSettings({ favouritesOnTop: next });
  });
}

function applyFavouritesToggleUi() {
  const btn = document.getElementById('station-fav-toggle');
  if (!btn) return;
  const active = !!state.favouritesOnTop;
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
}

function setupFavouritesOnlyToggle() {
  const btn = document.getElementById('station-fav-filter');
  if (!btn || btn._setup) return;
  btn._setup = true;
  applyFavouritesOnlyToggleUi();
  btn.addEventListener('click', () => {
    if (!state.user) {
      showToast(t('loginRequiredFavourite'));
      return;
    }
    haptic('light');
    persistStateSettings({ favouritesOnly: !state.favouritesOnly });
    // The list re-renders via applySettingsToState; the markers need an
    // explicit pass so the map doesn't contradict the filtered list.
    if (state.map && state.stations?.length) {
      renderStationsOnMap(state.stations, { skipFitBounds: true, skipRadiusFilter: true });
    }
  });
}

function applyFavouritesOnlyToggleUi() {
  const btn = document.getElementById('station-fav-filter');
  if (!btn) return;
  const active = !!(state.favouritesOnly && state.user);
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
}

function setupGroupByPriceToggle() {
  const btn = document.getElementById('station-group-toggle');
  if (!btn || btn._setup) return;
  btn._setup = true;
  applyGroupByPriceToggleUi();
  btn.addEventListener('click', () => {
    haptic('light');
    // persistStateSettings calls applySettingsToState (which refreshes the
    // toggle UI and re-renders the list) and syncs the flag to Felo ID when
    // the user is logged in.
    persistStateSettings({ groupByPrice: !state.groupByPrice });
  });
}

function applyGroupByPriceToggleUi() {
  const btn = document.getElementById('station-group-toggle');
  if (!btn) return;
  const active = !!state.groupByPrice;
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
}

function setupMapZoomGesture() {
  const mapEl = document.getElementById('map');
  if (!mapEl || mapEl._zoomGestureSetup) return;
  mapEl._zoomGestureSetup = true;
  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;
  let holdTimer = null;
  let holdActive = false;
  let holdStartY = 0;
  let holdStartZoom = 0;
  let holdPoint = null;
  let rafPending = false;
  let pendingZoom = null;

  mapEl.addEventListener('touchstart', (e) => {
    if (!state.map || e.touches.length !== 1) return;
    const t = e.touches[0];
    const now = Date.now();
    const dt = now - lastTapTime;
    const dx = Math.abs(t.clientX - lastTapX);
    const dy = Math.abs(t.clientY - lastTapY);
    if (dt < 320 && dx < 32 && dy < 32) {
      holdStartY = t.clientY;
      holdStartZoom = state.map.getZoom();
      holdPoint = state.map.mouseEventToContainerPoint({ clientX: t.clientX, clientY: t.clientY });
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        holdActive = true;
        haptic('light');
        try { state.map.dragging.disable(); } catch {}
        try { state.map.touchZoom.disable(); } catch {}
        try { state.map.doubleClickZoom.disable(); } catch {}
      }, 180);
    }
  }, { passive: true });

  mapEl.addEventListener('touchmove', (e) => {
    if (!state.map || !holdActive || e.touches.length !== 1) return;
    const t = e.touches[0];
    const deltaY = holdStartY - t.clientY;
    const zoomDelta = deltaY / 140;
    pendingZoom = Math.max(3, Math.min(19, holdStartZoom + zoomDelta));
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        if (pendingZoom != null) state.map.setZoomAround(holdPoint || state.map.getCenter(), pendingZoom);
        rafPending = false;
      });
    }
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });

  mapEl.addEventListener('touchend', (e) => {
    if (!state.map) return;
    clearTimeout(holdTimer);
    const wasHold = holdActive;
    holdActive = false;
    try { state.map.dragging.enable(); } catch {}
    try { state.map.touchZoom.enable(); } catch {}
    try { state.map.doubleClickZoom.enable(); } catch {}
    const t = e.changedTouches[0];
    const now = Date.now();
    const dx = Math.abs((t?.clientX || 0) - lastTapX);
    const dy = Math.abs((t?.clientY || 0) - lastTapY);
    if (!wasHold && now - lastTapTime < 320 && dx < 32 && dy < 32) {
      const pt = state.map.mouseEventToContainerPoint({ clientX: t.clientX, clientY: t.clientY });
      state.map.setZoomAround(pt, state.map.getZoom() + 1);
      haptic('light');
      lastTapTime = 0;
      e.preventDefault();
      return;
    }
    lastTapTime = now;
    lastTapX = t?.clientX || 0;
    lastTapY = t?.clientY || 0;
    if (wasHold) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false });
}

function showResetViewBtn() {
  const old = document.getElementById('reset-view-btn');
  if (old) old.remove();
  const btn = document.createElement('button');
  btn.id = 'reset-view-btn';
  btn.textContent = t('showAll');
  btn.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);z-index:500;background:var(--color-bg);color:var(--color-text);border:none;border-radius:20px;padding:8px 16px;font-size:13px;font-weight:600;box-shadow:0 2px 12px rgba(0,0,0,0.25);cursor:pointer;display:flex;align-items:center;gap:6px;';
  btn.addEventListener('click', () => {
    haptic('light');
    if (state.defaultBounds) state.map.flyToBounds(state.defaultBounds, { duration: 0.5 });
    btn.remove();
  });
  document.getElementById('map-container').appendChild(btn);
  setTimeout(() => { if (btn.parentNode) btn.remove(); }, 5000);
}

async function loadSettings() {
  loadFromLocal();
  if (state.user?.settings) {
    // Theme is device-local only — don't let server override it
    const { theme, ...remoteSettings } = state.user.settings;
    applySettingsToState(remoteSettings);
  }
}

function loadFromLocal() {
  try {
    const val = localStorage.getItem(localSettingsKey);
    if (val) applySettingsToState(JSON.parse(val));
  } catch {}
}

function applySettingsToState(settings = {}) {
  if (settings.fuelType) state.fuelType = settings.fuelType;
  if (settings.activeLocation) state.activeLocation = settings.activeLocation;

  if (settings.theme) state.theme = settings.theme;
  if (settings.lang) state.lang = settings.lang;
  if (typeof settings.contributorsOpen === 'boolean') state.contributorsOpen = settings.contributorsOpen;
  if (settings.historyDefaultDays === 1 || settings.historyDefaultDays === 7) {
    state.historyDefaultDays = settings.historyDefaultDays;
  }
  if (typeof settings.favouritesOnTop === 'boolean') {
    state.favouritesOnTop = settings.favouritesOnTop;
  }
  if (typeof settings.favouritesOnly === 'boolean') {
    state.favouritesOnly = settings.favouritesOnly;
  }
  if (typeof settings.groupByPrice === 'boolean') {
    state.groupByPrice = settings.groupByPrice;
  }

  state.radiusKm = 25;

  applyTheme(state.theme);
  // Theme and history-default ranges are segmented controls now — they
  // pick up their initial value from state inside their own setup
  // functions. The language picker stays a <select>; swap it for the
  // custom desktop dropdown on wide viewports.
  const langSelectInit = document.getElementById('lang-picker');
  if (langSelectInit) enhanceSelectForDesktop(langSelectInit);
  // Reflect the toggle's pressed state — the bar may already be in the DOM.
  if (typeof applyFavouritesToggleUi === 'function') applyFavouritesToggleUi();
  if (typeof applyFavouritesOnlyToggleUi === 'function') applyFavouritesOnlyToggleUi();
  if (typeof applyGroupByPriceToggleUi === 'function') applyGroupByPriceToggleUi();
  // Re-render the station list so the new pinning takes effect immediately
  // (e.g. when the value arrives from the cloud-sync after an account login).
  if (state.stations?.length) renderStationList(state.stations);
}

async function persistStateSettings(nextSettings = {}) {
  // Determine which sync keys are affected by this change
  const changedKeys = Object.keys(nextSettings);
  applySettingsToState(nextSettings);
  saveSettingsLocal();
  if (state.user) {
    setSyncBadgeState('syncing', changedKeys);
    // Tiny floor so a < 16 ms round-trip doesn't make the spinner flash
    // for a single frame. Otherwise let the green check land as soon as
    // the network round-trip finishes — that's the feedback the user
    // is waiting for.
    const minDelay = new Promise(r => setTimeout(r, 90));
    try {
      await Promise.all([saveSettingsRemote(), minDelay]);
      setSyncBadgeState('synced', changedKeys);
    } catch {
      await minDelay;
      setSyncBadgeState('idle', changedKeys);
      showToast(t('syncFailed'));
    }
  }
}

function setSyncBadgeState(s, keys) {
  // s = 'idle' | 'syncing' | 'synced'
  // keys = array of setting keys to target, e.g. ['fuelType']
  // ~= matches space-separated tokens, so a single badge can cover multiple
  // sync keys (e.g. data-sync-key="favouritesOnTop groupByPrice") without
  // duplicating the icon in the toolbar.
  const badges = keys && keys.length
    ? Array.from(new Set(keys.flatMap(k => Array.from(document.querySelectorAll(`.sync-badge[data-sync-key~="${k}"]`)))))
    : Array.from(document.querySelectorAll('.sync-badge'));
  badges.forEach(el => {
    el.classList.remove('syncing', 'synced');
    if (s !== 'idle') el.classList.add(s);
  });
  if (s === 'synced') {
    const timerKey = keys ? keys.join(',') : '_all';
    state._syncTimers = state._syncTimers || {};
    clearTimeout(state._syncTimers[timerKey]);
    state._syncTimers[timerKey] = setTimeout(() => setSyncBadgeState('idle', keys), 1000);
  }
}

async function saveSettingsRemote() {
  // Theme is intentionally excluded — it stays device-local
  const next = {
    fuelType: state.fuelType,
    activeLocation: state.activeLocation,
    lang: state.lang,
    contributorsOpen: state.contributorsOpen,
    historyDefaultDays: state.historyDefaultDays,
    favouritesOnTop: !!state.favouritesOnTop,
    favouritesOnly: !!state.favouritesOnly,
    groupByPrice: !!state.groupByPrice,
  };
  // Let failures propagate — persistStateSettings uses them to show an
  // honest badge state instead of a false green check.
  await api('/api/settings', { method: 'POST', body: JSON.stringify(next) });
}

function saveSettingsLocal() {
  try {
    localStorage.setItem(localSettingsKey, JSON.stringify({
      fuelType: state.fuelType,
      activeLocation: state.activeLocation,
      theme: state.theme,
      lang: state.lang,
      contributorsOpen: state.contributorsOpen,
      historyDefaultDays: state.historyDefaultDays,
      favouritesOnTop: !!state.favouritesOnTop,
      favouritesOnly: !!state.favouritesOnly,
      groupByPrice: !!state.groupByPrice,
    }));
  } catch {}
}

function showPopup(title, message) {
  // Popup messages are longer than plain toasts — give them time to be read.
  showToast(`${title}: ${message}`, 4500);
}

function showToast(message, duration) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(state.toastTimer);
  // Scale display time with message length (~180 ms per word, clamped) so
  // longer sentences don't vanish before they can be read.
  const ms = duration || Math.min(5000, Math.max(2600, 1400 + message.split(/\s+/).length * 180));
  state.toastTimer = setTimeout(() => el.classList.remove('visible'), ms);
}

function fixEnc(s) { return (s || '').replace(/\x81/g, 'ü').replace(/\x9A/g, 'Ü').replace(/\x84/g, 'ä').replace(/\x8E/g, 'Ä').replace(/\x94/g, 'ö').replace(/\x99/g, 'Ö').replace(/\xE1/g, 'ß'); }
function formatPrice(price) { return Number(price).toFixed(2).replace('.', ',') + '€'; }
// Short numeric date for chart axes/tooltips in the active language's
// order: de 13.7 — en 7/13. Charts render once per language switch, so
// labels stay in sync with applyLanguage's re-render.
function formatShortDate(dt) {
  return state.lang === 'en' ? `${dt.getMonth() + 1}/${dt.getDate()}` : `${dt.getDate()}.${dt.getMonth() + 1}`;
}
function formatPriceParts(price) { return { main: Number(price).toFixed(2).replace('.', ','), decimal: '' }; }
function formatDelta(n) {
  if (n == null || !isFinite(n)) return '–';
  if (Math.abs(n) < 0.005) return '±0,00€';
  return (n > 0 ? '+' : '−') + formatPrice(Math.abs(n));
}
function deltaColor(n) {
  if (n == null || !isFinite(n) || Math.abs(n) < 0.005) return 'var(--color-hint)';
  return n < 0 ? 'var(--color-good)' : 'var(--color-bad)';
}

function formatDataAge(isoTimestamp) {
  if (!isoTimestamp) return null;
  const seconds = Math.round((Date.now() - new Date(isoTimestamp).getTime()) / 1000);
  if (seconds < 60) return t('justNow');
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return t('minutesAgoFmt').replace('{n}', minutes);
  const hours = Math.round(minutes / 60);
  return t('hoursAgoFmt').replace('{n}', hours);
}


if (document.getElementById('app')) {
  init();
}

if ('serviceWorker' in navigator) {
  // On a first-ever visit there is no controller yet; clients.claim() in the
  // fresh worker fires controllerchange, which used to trigger a spurious
  // full reload right after load. Only reload when an OLD worker is being
  // replaced — and leave a breadcrumb so the reloaded page can tell the
  // user why it refreshed.
  var hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (!hadController) { hadController = true; return; }
    if (!refreshing) {
      refreshing = true;
      try { sessionStorage.setItem('tank_updated', '1'); } catch {}
      window.location.reload();
    }
  });
  try {
    if (sessionStorage.getItem('tank_updated')) {
      sessionStorage.removeItem('tank_updated');
      setTimeout(() => showToast(t('appUpdated')), 800);
    }
  } catch {}
}

/* === PWA Install Popup === */
(function() {
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  var dismissed = localStorage.getItem('pwa_popup_dismissed');

  if (isStandalone || dismissed) return;

  // Don't show PWA popup on desktop — only mobile
  var ua = navigator.userAgent || '';
  var isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  if (!isIos && !isAndroid) return;

  var popup = document.getElementById('pwa-popup');
  if (!popup) return;

  // Auto-detect platform and pre-select the right tab
  var defaultTab = isIos ? 'ios' : 'android';

  function activateTab(name) {
    popup.querySelectorAll('.pwa-popup-tab').forEach(function(t) {
      var active = t.getAttribute('data-pwa-tab') === name;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    popup.querySelectorAll('.pwa-popup-panel').forEach(function(p) {
      p.classList.toggle('active', p.getAttribute('data-pwa-panel') === name);
    });
  }

  activateTab(defaultTab);

  // Tab switching
  popup.querySelectorAll('.pwa-popup-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      activateTab(this.getAttribute('data-pwa-tab'));
    });
  });

  // Show popup after a short delay
  setTimeout(function() {
    popup.classList.remove('hidden');
  }, 1500);

  // Dismiss
  function dismiss() {
    popup.classList.add('hidden');
    localStorage.setItem('pwa_popup_dismissed', '1');
  }

  document.getElementById('pwa-popup-ok').addEventListener('click', dismiss);
  popup.querySelector('.pwa-popup-backdrop').addEventListener('click', dismiss);
})();
