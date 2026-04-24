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
    days7: '7 Tage',
    days14: '14 Tage',
    days30: '30 Tage',
    all: 'Alles',
    tapForHours: 'Antippen für Stundenansicht',
    summary: 'ZUSAMMENFASSUNG',
    lowestPrice: 'Niedrigster Preis',
    highestPrice: 'Höchster Preis',
    unknown: 'Unbekannt',
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
    oclock: 'Uhr',
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    // Settings
    fuelType: 'KRAFTSTOFF',
    location: 'STANDORT',
    priceAlert: 'PREISALARM',
    notification: 'Benachrichtigung',
    notificationChannel: 'Benachrichtigungskanal',
    ntfyTopicPlaceholder: 'ntfy Topic (z.B. mein-tankalarm)',
    ntfyHint: 'Installiere die <a href="https://ntfy.sh" target="_blank" style="color:var(--color-accent)">ntfy App</a> und abonniere dein Topic.',
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
    fuelDecisionTitle: 'Tankentscheidung',
    fuelDecisionBuy: 'Jetzt tanken',
    fuelDecisionOkay: 'Okay',
    fuelDecisionWait: 'Eher warten',
    fuelDecisionNeutral: 'Noch keine klare Empfehlung',
    fuelDecisionNoOpen: 'Keine offene Tankstelle',
    fuelDecisionNoHistory: 'Zu wenig Verlaufsdaten in der N\u00e4he',
    fuelDecisionNoNearbyHistory: 'Kein Scan-Standort in 30 km N\u00e4he',
    fuelDecisionCurrentBest: 'Aktuell g\u00fcnstigste offene Station',
    fuelDecisionComparedToAvg: 'zum 30-Tage-Schnitt',
    fuelDecisionBestDay: 'Bester Tag',
    fuelDecisionBestHour: 'Beste Uhrzeit',
    fuelDecisionHistoryBasis: 'Vergleich mit',
    fuelDecisionHistoryDays: '30 Tagen',
    fuelDecisionNoRecommendation: 'Keine verl\u00e4ssliche Empfehlung m\u00f6glich.',
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
    searchPlaceholder: 'Ort suchen…',
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
    // Station history
    priceHistory: 'PREISVERLAUF',
    areaHistory: 'Gebietspreisverlauf',
    noHistory: 'Kein Verlauf verfügbar',
    sheet24h: '24h',
    sheet7d: '7 Tage',
    measureNow: 'Jetzt messen',
    measuring: 'Messe...',
    measureSuccess: 'Messung gespeichert',
    measureError: 'Messung fehlgeschlagen',
    // Station sort
    sortPrice: 'Preis',
    sortDistance: 'Entfernung',
    stationsFound: 'Tankstellen',
    alongRoute: 'entlang der Route',
    addFavourite: 'Zu Favoriten hinzufügen',
    removeFavourite: 'Aus Favoriten entfernen',
    maxFavourites: 'Maximale Anzahl an Favoriten erreicht',
    loginRequiredFavourite: 'Bitte einloggen, um Favoriten zu speichern',
    priceAge: 'Aktualisiert vor',
    minutesAgo: 'Min.',
    hoursAgo: 'Std.',
    justNow: 'gerade eben',
    // Scan-Standorte
    scanLocations: 'SCAN-STANDORTE',
    historyLocations: 'STANDORTE MIT VERLAUFSDATEN',
    historyLocationsHint: 'Für diese Standorte sammeln wir täglich Preise für Verlaufscharts. Den aktuellen Preis kannst du jederzeit für jeden beliebigen Ort auf der Karte abrufen.',
    historyLocationsEmpty: 'Noch keine Standorte mit Verlaufsdaten.',
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
    routeNoOrs: 'Routenplanung nicht konfiguriert — bitte Admin um einen ORS-Key bitten.',
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
    days7: '7 Days',
    days14: '14 Days',
    days30: '30 Days',
    all: 'All',
    tapForHours: 'Tap for hourly detail',
    summary: 'SUMMARY',
    lowestPrice: 'Lowest Price',
    highestPrice: 'Highest Price',
    unknown: 'Unknown',
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
    oclock: '',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    fuelType: 'FUEL TYPE',
    location: 'LOCATION',
    priceAlert: 'PRICE ALERT',
    notification: 'Notification',
    notificationChannel: 'Notification Channel',
    ntfyTopicPlaceholder: 'ntfy Topic (e.g. my-fuel-alert)',
    ntfyHint: 'Install the <a href="https://ntfy.sh" target="_blank" style="color:var(--color-accent)">ntfy app</a> and subscribe to your topic.',
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
    fuelDecisionTitle: 'Fuel decision',
    fuelDecisionBuy: 'Refuel now',
    fuelDecisionOkay: 'Okay',
    fuelDecisionWait: 'Better wait',
    fuelDecisionNeutral: 'No clear recommendation yet',
    fuelDecisionNoOpen: 'No open station',
    fuelDecisionNoHistory: 'Too little nearby history data',
    fuelDecisionNoNearbyHistory: 'No scan location within 30 km',
    fuelDecisionCurrentBest: 'Current cheapest open station',
    fuelDecisionComparedToAvg: 'vs. 30-day average',
    fuelDecisionBestDay: 'Best day',
    fuelDecisionBestHour: 'Best time',
    fuelDecisionHistoryBasis: 'Compared with',
    fuelDecisionHistoryDays: '30 days',
    fuelDecisionNoRecommendation: 'No reliable recommendation available.',
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
    searchPlaceholder: 'Search location…',
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
    priceHistory: 'PRICE HISTORY',
    areaHistory: 'Area price trend',
    noHistory: 'No history available',
    sheet24h: '24h',
    sheet7d: '7 Days',
    measureNow: 'Measure now',
    measuring: 'Measuring...',
    measureSuccess: 'Measurement saved',
    measureError: 'Measurement failed',
    sortPrice: 'Price',
    sortDistance: 'Distance',
    stationsFound: 'Stations',
    alongRoute: 'along the route',
    addFavourite: 'Add to favourites',
    removeFavourite: 'Remove from favourites',
    maxFavourites: 'Maximum number of favourites reached',
    loginRequiredFavourite: 'Please log in to save favourites',
    priceAge: 'Updated',
    minutesAgo: 'min ago',
    hoursAgo: 'h ago',
    justNow: 'just now',
    // Scan locations
    scanLocations: 'SCAN LOCATIONS',
    historyLocations: 'LOCATIONS WITH HISTORY DATA',
    historyLocationsHint: 'We collect daily prices for these locations so you can see trends on the history charts. For the current price you can search any location on the map at any time.',
    historyLocationsEmpty: 'No locations with history data yet.',
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
    routeNoOrs: 'Route planning not configured — ask the admin for an ORS key.',
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
}

const state = {
  config: null,
  stations: [],
  history: [],
  stats: null,
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
  historyDefaultDays: 1,
  theme: 'auto',
  lang: detectLanguage(),
  activeCountry: null,
  viewCountry: null,
  manualScans: [],
  favouritesOnTop: false,
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
  availableLocations: [],
  priceExtremes: null,
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
  scanLocationsCache: null,
  historyByLocation: {},
  fuelDecisionLoadId: 0
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

async function init() {
  state.config = await api('/api/config');
  state.fuelType = state.config.fuel_type;
  state.radiusKm = 25;
  state.smtpConfigured = !!state.config.smtpConfigured;

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
  setupMyLocationBtn();
  setupFavouritesToggle();
  setupAccountUi();
  setupStationSort();
  setupPullToRefresh();
  setupUserRequests();
  initLocation();
  refreshAlertUi();
  renderUserRequests();
  renderHistoryLocations();
  fetchAppVersion();
}

async function fetchAppVersion() {
  try {
    const res = await fetch('https://api.github.com/repos/Felitendo/Tanken/releases/latest');
    if (!res.ok) return;
    const data = await res.json();
    const version = data.tag_name || data.name;
    if (version) {
      const el = document.getElementById('app-version');
      if (el) el.textContent = version;
    }
  } catch {}
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
  } catch {}
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
  const name = document.getElementById('account-name');
  const sub = document.getElementById('account-subline');
  const btn = document.getElementById('account-login-btn');
  const avatar = document.getElementById('account-avatar');
  if (!name || !sub || !btn) return;
  if (state.user) {
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
  } else {
    name.textContent = t('notLoggedIn');
    const oidcName = state.config?.auth?.oidcName;
    sub.textContent = state.config?.auth?.notes?.oidc || (oidcName ? `${t('loginWith')} ${oidcName}` : t('configureOidc'));
    btn.textContent = oidcName ? `${t('loginWith')} ${oidcName}` : 'Login';
    if (avatar) {
      avatar.innerHTML = '';
      avatar.classList.remove('visible');
    }
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  refreshMapTiles();
}

if (typeof window !== 'undefined' && window.matchMedia) {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => { if (state.theme === 'auto') refreshMapTiles(); };
  if (mql.addEventListener) mql.addEventListener('change', handler);
  else if (mql.addListener) mql.addListener(handler);
}

function setupTheme() {
  applyTheme(state.theme);
  const select = document.getElementById('theme-picker');
  if (!select) return;
  select.value = state.theme;
  select.addEventListener('change', () => {
    haptic('light');
    applyTheme(select.value);
    // Theme is device-local only — don't trigger cloud sync
    saveSettingsLocal();
  });
}

function setupHistoryDefaultPicker() {
  const select = document.getElementById('history-default-picker');
  if (!select) return;
  select.value = String(state.historyDefaultDays || 1);
  select.addEventListener('change', () => {
    haptic('light');
    const v = parseInt(select.value, 10);
    persistStateSettings({ historyDefaultDays: v === 7 ? 7 : 1 });
  });
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








function setupTabs() {
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  var sessionTab = sessionStorage.getItem('currentTab') || 'map';
  switchTab(sessionTab, { initial: true });
}

let _tabLoadId = 0;

function switchTab(tab, { initial = false } = {}) {
  if (!initial && tab === state.currentTab) return;
  if (!initial) haptic('light');

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
      else { state.history = await fetchHistoryData(); if (_tabLoadId === loadId) renderChart(state.history); }
    }
    if (_tabLoadId !== loadId) return;
    if (tab === 'stats') {
      if (!state.loaded.stats) await loadStatsTab();
      else await reloadStats();
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

const COUNTRY_FLAGS = { de: '🇩🇪', at: '🇦🇹' };

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

  const sorted = locations.slice().sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
  });

  list.innerHTML = sorted.map((loc) => {
    const flag = COUNTRY_FLAGS[loc.country] || '';
    const coords = `${Number(loc.lat).toFixed(3)}, ${Number(loc.lng).toFixed(3)}`;
    return `
      <div class="card-row" style="padding:12px 16px;gap:10px;border-bottom:1px solid var(--color-separator)">
        <span aria-hidden="true" style="font-size:18px;line-height:1;flex-shrink:0">${flag}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:500;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(loc.name || '')}</div>
          <div style="font-size:11px;color:var(--color-hint);margin-top:2px;font-variant-numeric:tabular-nums">${coords}</div>
        </div>
      </div>`;
  }).join('');
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
      loadMapTab();
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

function getActiveCoords() {
  if (state.userLat && state.userLng) {
    return { lat: state.userLat, lng: state.userLng };
  }
  // Fallback: Berlin (used purely for the initial map view when geolocation
  // isn't available — distance calculations should NOT use this).
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
  const c = getActiveCoords();
  return isInAustria(c.lat, c.lng) ? 'at' : 'de';
}

// "Active" country = where the user's pin is (from GPS or last explicit
// search). Drives history/stats filtering — should NOT flip when the user
// just pans the map around.
function applyCountryUi() {
  const next = getActiveCountry();
  applyViewCountryUi(); // view-country always follows the map center
  if (state.activeCountry === next) return;
  const prev = state.activeCountry;
  state.activeCountry = next;
  document.documentElement.setAttribute('data-active-country', next);

  // Country change invalidates cached history/stats — they're country-scoped now.
  if (prev && prev !== next) {
    state.selectedLocation = '';
    state.loaded.history = false;
    state.loaded.stats = false;
  }
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

const FUEL_DECISION_HISTORY_DAYS = 30;
const FUEL_DECISION_MAX_LOCATION_KM = 30;
const FUEL_DECISION_MIN_HISTORY_ENTRIES = 5;

function getOpenStationsForDecision(stations) {
  const radiusKm = state.radiusKm || 25;
  return (stations || [])
    .filter(s => s && s.isOpen && typeof s.price === 'number' && (!s.dist || s.dist <= radiusKm))
    .sort((a, b) => a.price - b.price);
}

function distanceKm(a, b) {
  const lat1 = Number(a.lat);
  const lng1 = Number(a.lng);
  const lat2 = Number(b.lat);
  const lng2 = Number(b.lng);
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return Infinity;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const r1 = toRad(lat1);
  const r2 = toRad(lat2);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r1) * Math.cos(r2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function getPublicScanLocations() {
  if (Array.isArray(state.scanLocationsCache)) return state.scanLocationsCache;
  const res = await api('/api/scan-locations');
  state.scanLocationsCache = Array.isArray(res.locations) ? res.locations : [];
  return state.scanLocationsCache;
}

function findNearestScanLocation(coords, locations) {
  let best = null;
  for (const loc of locations || []) {
    const distKm = distanceKm(coords, loc);
    if (distKm <= FUEL_DECISION_MAX_LOCATION_KM && (!best || distKm < best.distKm)) {
      best = { ...loc, distKm };
    }
  }
  return best;
}

async function getHistoryForLocation(locationId) {
  if (state.historyByLocation[locationId]) return state.historyByLocation[locationId];
  const res = await api(`/api/history?location=${encodeURIComponent(locationId)}`);
  const entries = Array.isArray(res) ? res : (Array.isArray(res.entries) ? res.entries : []);
  state.historyByLocation[locationId] = entries;
  return entries;
}

function getRecentHistoryPrices(entries) {
  const cutoff = Date.now() - FUEL_DECISION_HISTORY_DAYS * 24 * 60 * 60 * 1000;
  return (entries || [])
    .filter(entry => new Date(entry.timestamp).getTime() >= cutoff)
    .map(entry => ({
      timestamp: entry.timestamp,
      price: Number(entry.min_price)
    }))
    .filter(entry => Number.isFinite(entry.price));
}

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const idx = Math.floor((sorted.length - 1) * p);
  return sorted[idx];
}

function bestDayLabel(recent) {
  const buckets = {};
  for (const entry of recent) {
    const d = new Date(entry.timestamp);
    if (Number.isNaN(d.getTime())) continue;
    const day = d.getDay();
    buckets[day] = buckets[day] || [];
    buckets[day].push(entry.price);
  }
  const ranked = Object.entries(buckets)
    .map(([day, prices]) => ({ day: Number(day), price: avg(prices) }))
    .sort((a, b) => a.price - b.price);
  const best = ranked[0];
  return best ? (t('dayNames')[best.day] || '') : '';
}

function bestHourLabel(recent) {
  const buckets = {};
  for (const entry of recent) {
    const d = new Date(entry.timestamp);
    if (Number.isNaN(d.getTime())) continue;
    const hour = d.getHours();
    buckets[hour] = buckets[hour] || [];
    buckets[hour].push(entry.price);
  }
  const hours = Object.keys(buckets);
  if (hours.length < 3) return '';
  const ranked = hours
    .map(hour => ({ hour: Number(hour), price: avg(buckets[hour]) }))
    .sort((a, b) => a.price - b.price);
  const best = ranked[0];
  if (!best) return '';
  return t('oclock') ? `${best.hour}:00 ${t('oclock')}` : `${best.hour}:00`;
}

function formatSignedCents(deltaEuro) {
  const cents = Math.round(deltaEuro * 100);
  if (cents === 0) return '0 ct';
  return `${cents > 0 ? '+' : ''}${cents} ct`;
}

function renderFuelDecisionCard(view) {
  const card = document.getElementById('fuel-decision-card');
  if (!card) return;
  card.classList.remove('hidden', 'buy', 'okay', 'wait', 'neutral');
  card.classList.add(view.tone || 'neutral');

  const priceHtml = view.station
    ? `<div class="fuel-decision-station">
        <span>${escapeHtml(fixEnc(view.station.brand || view.station.name || t('unknown')))}</span>
        <strong>${formatPrice(view.station.price)}</strong>
      </div>`
    : `<div class="fuel-decision-station muted"><span>${escapeHtml(view.emptyLabel || t('fuelDecisionNoOpen'))}</span></div>`;

  const metrics = (view.metrics || []).map(metric => `
    <div class="fuel-decision-metric">
      <span>${escapeHtml(metric.label)}</span>
      <strong>${escapeHtml(metric.value)}</strong>
    </div>`).join('');

  card.innerHTML = `
    <div class="fuel-decision-head">
      <div>
        <div class="fuel-decision-kicker">${t('fuelDecisionTitle')}</div>
        <div class="fuel-decision-title">${escapeHtml(view.title)}</div>
      </div>
      <div class="fuel-decision-pill">${escapeHtml(view.badge)}</div>
    </div>
    <div class="fuel-decision-body">
      <div class="fuel-decision-label">${t('fuelDecisionCurrentBest')}</div>
      ${priceHtml}
      ${view.note ? `<div class="fuel-decision-note">${escapeHtml(view.note)}</div>` : ''}
      ${metrics ? `<div class="fuel-decision-metrics">${metrics}</div>` : ''}
    </div>`;
}

function renderFuelDecisionNeutral(station, noteKey) {
  renderFuelDecisionCard({
    tone: 'neutral',
    title: station ? t('fuelDecisionNeutral') : t('fuelDecisionNoOpen'),
    badge: station ? t('fuelDecisionOkay') : '-',
    station,
    emptyLabel: t('fuelDecisionNoOpen'),
    note: t(noteKey || 'fuelDecisionNoRecommendation'),
    metrics: []
  });
}

async function updateFuelDecisionCard(stations, coords) {
  const loadId = ++state.fuelDecisionLoadId;
  const open = getOpenStationsForDecision(stations);
  const cheapest = open[0] || null;

  if (!cheapest) {
    renderFuelDecisionNeutral(null, 'fuelDecisionNoRecommendation');
    return;
  }

  try {
    const locations = await getPublicScanLocations();
    if (loadId !== state.fuelDecisionLoadId) return;
    const nearest = findNearestScanLocation(coords, locations);
    if (!nearest) {
      renderFuelDecisionNeutral(cheapest, 'fuelDecisionNoNearbyHistory');
      return;
    }

    const history = await getHistoryForLocation(nearest.id);
    if (loadId !== state.fuelDecisionLoadId) return;
    const recent = getRecentHistoryPrices(history);
    if (recent.length < FUEL_DECISION_MIN_HISTORY_ENTRIES) {
      renderFuelDecisionNeutral(cheapest, 'fuelDecisionNoHistory');
      return;
    }

    const prices = recent.map(entry => entry.price);
    const average = avg(prices);
    const cheapQuartile = percentile(prices, 0.25);
    const delta = cheapest.price - average;
    let tone = 'okay';
    let title = t('fuelDecisionOkay');
    if (delta <= -0.03 || cheapest.price <= cheapQuartile) {
      tone = 'buy';
      title = t('fuelDecisionBuy');
    } else if (delta > 0.02) {
      tone = 'wait';
      title = t('fuelDecisionWait');
    }

    const metrics = [
      { label: t('fuelDecisionComparedToAvg'), value: formatSignedCents(delta) },
    ];
    const bestDay = bestDayLabel(recent);
    if (bestDay) metrics.push({ label: t('fuelDecisionBestDay'), value: bestDay });
    const bestHour = bestHourLabel(recent);
    if (bestHour) metrics.push({ label: t('fuelDecisionBestHour'), value: bestHour });

    renderFuelDecisionCard({
      tone,
      title,
      badge: formatPrice(average),
      station: cheapest,
      note: `${t('fuelDecisionHistoryBasis')} ${fixEnc(nearest.name || nearest.id)} (${t('fuelDecisionHistoryDays')})`,
      metrics
    });
  } catch {
    if (loadId === state.fuelDecisionLoadId) renderFuelDecisionNeutral(cheapest, 'fuelDecisionNoHistory');
  }
}

async function loadMapTab({ skipFitBounds = false, silent = false } = {}) {
  state.loaded.map = true;
  const coords = getActiveCoords();
  applyCountryUi();

  if (!state.map) {
    state.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: true,
      touchZoom: true,
      tapHold: false
    }).setView([coords.lat, coords.lng], 12);

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
      if (state.map.getZoom() < MIN_ZOOM_FOR_STATIONS) {
        if (state.clusterGroup) { state.map.removeLayer(state.clusterGroup); state.clusterGroup = null; }
        state.markers.forEach(m => state.map.removeLayer(m));
        state.markers = [];
      }
      // Always refresh on zoom — the visible viewport (and therefore the
      // bounds query / scan-location selection) changes drastically, and
      // skipping would leave the user with stale markers / a clipped list.
      // Pan refresh is still gated by the move-distance threshold below.
      if (state.map.getZoom() >= VIEWPORT_MIN_ZOOM) {
        if (_viewportTimer) { clearTimeout(_viewportTimer); _viewportTimer = null; }
        syncManualScansFromServer({ rerender: false });
        loadStationsAroundCenter({ silent: true });
      }
    });
    state.map.on('moveend', () => {
      showSearchHereIfMoved();
      applyViewCountryUi();
      scheduleViewportRefresh();
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
    updateFuelDecisionCard(stations, coords);
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
      loader.innerHTML = `<span>${t('errorLoading')}</span>`;
    }
  }
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
          for (const r of results) {
            if (r.status !== 'fulfilled') continue;
            const list = Array.isArray(r.value) ? r.value : [];
            for (const s of list) {
              const k = s.id || `${s.lat},${s.lng}`;
              if (seen.has(k)) continue;
              seen.add(k);
              stations.push(s);
            }
          }
        }
      }

      // Distance labels track the user's real GPS position (not the map
      // centre, not the search-bar pick). When GPS is unknown the dist
      // field is stripped so no misleading "X km entfernt" appears.
      stations = withDistanceFromUser(stations);
      state.stations = stations;
      state._lastViewportCenter = { lat, lng };
      // DE shows the full scan-location set even when stations sit beyond
      // the user's 25 km circle, so skip the per-list radius filter there.
      const renderOpts = { skipFitBounds: true, skipRadiusFilter: true };
      renderStationsOnMap(stations, renderOpts);
      renderStationList(stations);
      updateFuelDecisionCard(stations, { lat, lng });
      if (loader) {
        if (!stations.length && !silent) {
          loader.innerHTML = `<span style="font-size:13px;opacity:0.6">${t('noStationsYet')}</span>`;
        } else {
          loader.classList.add('hidden');
        }
      }
      checkPriceAlert(stations);
    } catch {
      if (loader && !silent) loader.innerHTML = `<span>${t('errorLoading')}</span>`;
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

  // Toggle button into confirm mode + insert cancel pill alongside it
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
    renderStationsOnMap(stations, { skipFitBounds: true });
    renderStationList(stations);
    updateFuelDecisionCard(stations, { lat, lng });
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

  const prices = filtered.filter(s => s.price).map(s => s.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

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
      // Compute average price for the cluster
      const childMarkers = clusterObj.getAllChildMarkers();
      let totalPrice = 0, priceCount = 0;
      childMarkers.forEach(function(m) {
        if (m._stationPrice) { totalPrice += m._stationPrice; priceCount++; }
      });
      const avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;
      const avgRatio = (maxPrice > minPrice && avgPrice > 0) ? (avgPrice - minPrice) / (maxPrice - minPrice) : 0;
      const color = priceColor(avgRatio);
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
    const ratio = maxPrice > minPrice ? (s.price - minPrice) / (maxPrice - minPrice) : 0;
    const color = priceColor(ratio);
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

    marker._stationPrice = s.price;

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

function priceColor(ratio) {
  const r = Math.round(52 + ratio * 203);
  const g = Math.round(199 - ratio * 140);
  const b = Math.round(89 - ratio * 41);
  return `rgb(${r},${g},${b})`;
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
  const open = stations.filter(s => s.isOpen && s.price);

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
    list.innerHTML = `<div class="empty-state"><svg class="empty-state-icon" viewBox="0 0 24 24" width="48" height="48" fill="var(--color-hint)"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/></svg><div class="empty-state-text">${t('noOpenStations')}</div></div>`;
    return;
  }

  if (state.stationSort === 'distance') {
    open.sort((a, b) => (a.dist || 999) - (b.dist || 999));
  } else {
    open.sort((a, b) => a.price - b.price);
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

  const minPrice = Math.min(...open.map(s => s.price));
  const maxPrice = Math.max(...open.map(s => s.price));
  list.innerHTML = open.slice(0, 15).map((s, i) => {
    const ratio = maxPrice > minPrice ? (s.price - minPrice) / (maxPrice - minPrice) : 0;
    const color = priceColor(ratio);
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
      loadSheetChart(state.sheetStationName, days);
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
  btn.setAttribute('aria-label', expanded ? 'Collapse' : 'Expand');
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

function showStationSheet(station) {
  const sheet = document.getElementById('bottom-sheet');
  const body = document.getElementById('bottom-sheet-body');
  const priceParts = formatPriceParts(station.price);
  const prices = state.stations.filter(s => s.price).map(s => s.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const ratio = maxP > minP ? (station.price - minP) / (maxP - minP) : 0;
  const color = priceColor(ratio);
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
    <div class="sheet-info-row">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
      <span>${fixEnc(station.street)} ${station.houseNumber || ''}, ${station.postCode || ''} ${fixEnc(station.place)}</span>
    </div>
    <div class="sheet-info-row" id="sheet-status-row">
      <span class="sheet-info-icon"><span id="sheet-status-dot" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${station.isOpen ? '#34c759' : '#ff3b30'}"></span></span>
      <span id="sheet-status-text">${station.isOpen ? t('open') : t('closed')}</span>
      ${station.dist ? `<span style="margin-left:auto;color:var(--color-hint)">${station.distApprox ? '~' : ''}${station.dist.toFixed(1)} ${t('kmAway')}</span>` : ''}
    </div>
    ${state.dataTimestamp ? `<div class="sheet-info-row" style="color:var(--color-hint)">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
      <span>${formatDataAge(state.dataTimestamp)}</span>
    </div>` : ''}
    <div class="sheet-hours-section" id="sheet-hours-section"></div>
    <div class="sheet-nav-buttons${isAndroid ? ' android-only' : ''}">
      <a href="${gmapsUrl}" target="_blank" class="sheet-nav-btn gmaps">
        <img src="/icons/google-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Google Maps</span>
      </a>
      ${isAndroid ? '' : `<a href="${appleMapsUrl}" target="_blank" class="sheet-nav-btn amaps">
        <img src="/icons/apple-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Apple Maps</span>
      </a>`}
    </div>
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

  // Add expand button for desktop
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

  // --- Desktop: add close button for side panel ---
  if (window.matchMedia('(min-width: 900px)').matches) {
    content.querySelector('.sheet-desktop-close')?.remove();
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sheet-desktop-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeSheet);
    content.prepend(closeBtn);
  }

  // --- Real drag-to-dismiss ---
  setupSheetDrag(content, handleArea, backdrop, closeSheet);

  state.sheetStationName = station.name;
  state.sheetStation = station;
  loadSheetChart(station.name, state.historyDefaultDays || 1);
  if (station.id) refreshStationStatus(station);

  document.querySelectorAll('.sheet-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      haptic('light');
      document.querySelectorAll('.sheet-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSheetChart(state.sheetStationName, parseInt(btn.dataset.range, 10));
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

async function refreshStationStatus(station) {
  try {
    const detail = await api(`/api/station/${station.id}`);
    if (!detail) return;

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

    // Update price if it changed
    const fuelKey = state.fuelType === 'e5' ? 'e5' : state.fuelType === 'e10' ? 'e10' : 'diesel';
    const freshPrice = typeof detail[fuelKey] === 'number' && detail[fuelKey] > 0 ? detail[fuelKey] : null;
    if (freshPrice && freshPrice !== station.price) {
      station.price = freshPrice;
      const priceEl = document.querySelector('.sheet-station-price');
      if (priceEl) {
        const priceParts = formatPriceParts(freshPrice);
        const prices = state.stations.filter(s => s.price).map(s => s.price);
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        const ratio = maxP > minP ? (freshPrice - minP) / (maxP - minP) : 0;
        priceEl.style.color = priceColor(ratio);
        priceEl.innerHTML = `${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''} <span style="font-size:16px;font-weight:400;color:var(--color-hint)">€/L</span>`;
      }
    }
  } catch {
    // Silently fail — cached data stays as fallback
  }
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

// Render the empty state for the per-station price chart. In Austria we just
// say "data is accumulating"; in Germany we point users to the request flow
// because the station isn't covered by the scanner.
function renderSheetChartEmptyState(loadingEl, station) {
  if (!loadingEl) return;
  const inAustria = station && Number.isFinite(station.lat) && Number.isFinite(station.lng)
    ? isInAustria(station.lat, station.lng)
    : false;

  if (inAustria) {
    loadingEl.innerHTML = `<span style="opacity:0.75">${t('historyAccumulating')}</span>`;
    return;
  }

  // Germany: explain why and offer the location request flow.
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

async function loadSheetChart(stationName, days = 1) {
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
        renderSheetChartEmptyState(loading, station);
        return;
      }
    }

    const data = await api(`/api/history?station=${encodeURIComponent(stationName)}`);
    // Backend returns an array of station entries when ≥ 2 rows exist; an
    // object {entries, extremes} otherwise. Treat both "no rows" cases the same.
    const hasSeries = Array.isArray(data) && data.length >= 2;
    if (!hasSeries) {
      renderSheetChartEmptyState(loading, station);
      return;
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    let filtered = data.filter(d => new Date(d.timestamp) >= cutoff);
    if (filtered.length < 2) filtered = data.slice(-10);

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

    const labels = chartData.map(d => {
      const dt = new Date(d.timestamp);
      if (days <= 1) return `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
      return `${dt.getDate()}.${dt.getMonth() + 1}`;
    });

    const hintColor = getComputedStyle(document.body).getPropertyValue('--color-hint') || '#999';

    // Calculate Y-axis range with minimum visible spread (at least 0.06€)
    const prices = chartData.map(d => d.min_price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const spread = maxP - minP;
    const minSpread = 0.06;
    const padding = spread < minSpread ? (minSpread - spread) / 2 + 0.01 : (spread * 0.15);
    const yMin = Math.max(0, Math.floor((minP - padding) * 100) / 100);
    const yMax = Math.ceil((maxP + padding) * 100) / 100;

    loading.style.display = 'none';
    canvas.style.display = 'block';

    state.sheetChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Min',
            data: prices,
            borderColor: '#34c759',
            backgroundColor: 'rgba(52,199,89,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: days === 7 ? 3 : 0,
            pointBackgroundColor: '#34c759',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
                const d = chartData[items[0].dataIndex];
                if (!d) return '';
                const dt = new Date(d.timestamp);
                if (days <= 1) return `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')} Uhr`;
                return `${dt.getDate()}.${dt.getMonth() + 1}. ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
              },
              label: (ctx) => formatPrice(ctx.parsed.y)
            }
          }
        },
        scales: {
          x: {
            ticks: { color: hintColor.trim() || '#999', font: { size: 10 }, maxTicksLimit: state.sheetExpanded ? 8 : 5 },
            grid: { display: false }
          },
          y: {
            min: yMin,
            max: yMax,
            ticks: { color: hintColor.trim() || '#999', font: { size: 10 }, callback: v => formatPrice(v), maxTicksLimit: state.sheetExpanded ? 10 : 4 },
            grid: { color: 'rgba(128,128,128,0.08)' }
          }
        }
      }
    });
  } catch {
    loading.innerHTML = `<span>${t('noHistory')}</span>`;
  }
}

async function loadLocationPickers() {
  try {
    const country = state.activeCountry || getActiveCountry();
    const res = await api(`/api/history?locations=list&country=${country}`);
    const locations = res && res.locations ? res.locations : [];
    state.availableLocations = locations;

    ['history-location-picker', 'stats-location-picker'].forEach(id => {
      const picker = document.getElementById(id);
      if (!picker) return;
      // Keep the first "Alle Standorte" option
      while (picker.options.length > 1) picker.remove(1);
      locations.forEach(locId => {
        const opt = document.createElement('option');
        opt.value = locId;
        opt.textContent = locId;
        picker.appendChild(opt);
      });
      picker.value = state.selectedLocation;
      picker.style.display = locations.length > 0 ? '' : 'none';
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
  await loadLocationPickers();
  state.history = await fetchHistoryData();
  renderChart(state.history);

  const historyPicker = document.getElementById('history-location-picker');
  if (historyPicker) {
    historyPicker.addEventListener('change', async () => {
      state.selectedLocation = historyPicker.value;
      // Sync stats picker
      const statsPicker = document.getElementById('stats-location-picker');
      if (statsPicker) statsPicker.value = state.selectedLocation;
      state.history = await fetchHistoryData();
      renderChart(state.history);
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

  // Show measure button for admin users
  const measureBtn = document.getElementById('btn-measure');
  if (measureBtn && state.user?.roles?.includes('admin')) {
    measureBtn.style.display = '';
    measureBtn.addEventListener('click', async () => {
      if (measureBtn.disabled) return;
      measureBtn.disabled = true;
      measureBtn.textContent = t('measuring');
      haptic('light');
      try {
        const body = {};
        if (state.userLat && state.userLng) {
          body.lat = state.userLat;
          body.lng = state.userLng;
        }
        await api('/api/admin/measure', { method: 'POST', body: JSON.stringify(body) });
        showToast(t('measureSuccess'));
        haptic('success');
        // Reload history data
        state.history = await fetchHistoryData();
        renderChart(state.history);
      } catch (err) {
        showToast(t('measureError'));
        haptic('error');
      } finally {
        measureBtn.disabled = false;
        measureBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg> ${t('measureNow')}`;
      }
    });
  }
}

function renderChart(data) {
  if (!data.length) {
    if (state.chart) { state.chart.destroy(); state.chart = null; }
    if (state.hourChart) { state.hourChart.destroy(); state.hourChart = null; }
    document.getElementById('hour-chart-section').style.display = 'none';
    const summary = document.getElementById('history-summary');
    summary.innerHTML = `
      <div style="text-align:center;padding:1.5rem 0 0.5rem;opacity:0.45;font-size:13px">${t('noHistory')}</div>
      <div class="section-header">${t('summary')}</div>
      <div class="card">
        <div class="card-row" style="padding:4px 0">
          <div class="card-row-left"><div><div class="card-title">${t('lowestPrice')}</div><div class="card-subtitle">–</div></div></div>
          <div class="card-value" style="opacity:0.3">–</div>
        </div>
      </div>
      <div class="card">
        <div class="card-row" style="padding:4px 0">
          <div class="card-row-left"><div><div class="card-title">${t('highestPrice')}</div><div class="card-subtitle">–</div></div></div>
          <div class="card-value" style="opacity:0.3">–</div>
        </div>
      </div>`;
    return;
  }
  let filtered = data;
  if (state.historyDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - state.historyDays);
    filtered = data.filter(d => new Date(d.timestamp) >= cutoff);
  }
  if (!filtered.length) filtered = data.slice(-5);

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

  const labels = daily.map(d => {
    const dt = new Date(d.timestamp);
    return `${dt.getDate()}.${dt.getMonth() + 1}`;
  });

  const ctx = document.getElementById('price-chart');
  const textColor = getComputedStyle(document.body).getPropertyValue('--color-text') || '#000';
  const hintColor = getComputedStyle(document.body).getPropertyValue('--color-hint') || '#999';
  const btnColor = getComputedStyle(document.body).getPropertyValue('--color-accent') || '#007aff';
  if (state.chart) state.chart.destroy();
  if (state.hourChart) { state.hourChart.destroy(); state.hourChart = null; }
  document.getElementById('hour-chart-section').style.display = 'none';

  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Ø',
          data: daily.map(d => d.avg_price),
          borderColor: btnColor.trim() || '#007aff',
          backgroundColor: 'rgba(0,122,255,0.06)',
          borderWidth: 2,
          borderDash: [4, 4],
          fill: '+1',
          tension: 0.3,
          pointRadius: daily.length < 20 ? 3 : 1,
          pointBackgroundColor: btnColor.trim() || '#007aff',
          order: 1,
        },
        {
          label: 'Min',
          data: daily.map(d => d.min_price),
          borderColor: '#34c759',
          backgroundColor: 'rgba(52,199,89,0.1)',
          borderWidth: 2.5,
          fill: false,
          tension: 0.3,
          pointRadius: daily.length < 20 ? 4 : 2,
          pointBackgroundColor: '#34c759',
          order: 2,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor.trim() || '#000',
            font: { size: 12, family: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif' },
            boxWidth: 12,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 13 },
          callbacks: { label: (c) => `${c.dataset.label}: ${formatPrice(c.parsed.y)}` },
          footer: () => [t('tapForHours') || 'Tap for hourly detail'],
        }
      },
      scales: {
        x: { ticks: { color: hintColor.trim() || '#999', font: { size: 11 }, maxTicksLimit: 8 }, grid: { display: false } },
        y: { ticks: { color: hintColor.trim() || '#999', font: { size: 11 }, callback: v => formatPrice(v) }, grid: { color: 'rgba(128,128,128,0.1)' } }
      }
    }
  });

  const summary = document.getElementById('history-summary');
  // Use actual per-station extremes from station_prices if available
  const extremes = state.priceExtremes;
  const cheapestName = extremes?.cheapest?.station_name || '';
  const cheapestPrice = extremes?.cheapest?.price;
  const expensiveName = extremes?.mostExpensive?.station_name || '';
  const expensivePrice = extremes?.mostExpensive?.price;
  // Fallback to aggregated data if no extremes
  const minEntry = filtered.reduce((a, b) => a.min_price < b.min_price ? a : b);
  const maxEntry = filtered.reduce((a, b) => a.max_price > b.max_price ? a : b);
  const lowestStation = cheapestName || fixEnc(minEntry.station) || t('unknown');
  const lowestPrice = cheapestPrice != null ? cheapestPrice : minEntry.min_price;
  const highestStation = expensiveName || fixEnc(maxEntry.station) || t('unknown');
  const highestPrice = expensivePrice != null ? expensivePrice : maxEntry.max_price;
  summary.innerHTML = `
    <div class="section-header">${t('summary')}</div>
    <div class="card">
      <div class="card-row" style="padding:4px 0">
        <div class="card-row-left"><div><div class="card-title">${t('lowestPrice')}</div><div class="card-subtitle">${fixEnc(lowestStation)}</div></div></div>
        <div class="card-value good">${formatPrice(lowestPrice)}</div>
      </div>
    </div>
    <div class="card">
      <div class="card-row" style="padding:4px 0">
        <div class="card-row-left"><div><div class="card-title">${t('highestPrice')}</div><div class="card-subtitle">${fixEnc(highestStation)}</div></div></div>
        <div class="card-value bad">${formatPrice(highestPrice)}</div>
      </div>
    </div>`;
}

function renderHourChart(entries, dayKey) {
  const section = document.getElementById('hour-chart-section');
  const label = document.getElementById('hour-chart-label');
  const dt = new Date(dayKey);
  const dayNames = t('dayNames') || [];
  const dayName = dayNames[dt.getDay()] || '';
  label.textContent = `${dayName} ${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}`;
  section.style.display = '';

  const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const hLabels = sorted.map(d => {
    const h = new Date(d.timestamp);
    return `${h.getHours()}:${String(h.getMinutes()).padStart(2, '0')}`;
  });

  const textColor = getComputedStyle(document.body).getPropertyValue('--color-text') || '#000';
  const hintColor = getComputedStyle(document.body).getPropertyValue('--color-hint') || '#999';
  const btnColor = getComputedStyle(document.body).getPropertyValue('--color-accent') || '#007aff';

  if (state.hourChart) state.hourChart.destroy();
  const ctx = document.getElementById('hour-chart');

  state.hourChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hLabels,
      datasets: [
        {
          label: 'Ø',
          data: sorted.map(d => d.avg_price),
          borderColor: btnColor.trim() || '#007aff',
          backgroundColor: 'rgba(0,122,255,0.06)',
          borderWidth: 2,
          borderDash: [4, 4],
          fill: '+1',
          tension: 0.3,
          pointRadius: sorted.length < 20 ? 3 : 1,
          pointBackgroundColor: btnColor.trim() || '#007aff',
          order: 1,
        },
        {
          label: 'Min',
          data: sorted.map(d => d.min_price),
          borderColor: '#34c759',
          backgroundColor: 'rgba(52,199,89,0.1)',
          borderWidth: 2.5,
          fill: false,
          tension: 0.3,
          pointRadius: sorted.length < 20 ? 4 : 2,
          pointBackgroundColor: '#34c759',
          order: 2,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor.trim() || '#000',
            font: { size: 12, family: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif' },
            boxWidth: 12,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 13 },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const d = sorted[items[0].dataIndex];
              if (!d) return '';
              const dt = new Date(d.timestamp);
              const hh = String(dt.getHours()).padStart(2, '0');
              const mm = String(dt.getMinutes()).padStart(2, '0');
              const ss = String(dt.getSeconds()).padStart(2, '0');
              const suffix = t('oclock');
              return suffix ? `${hh}:${mm}:${ss} ${suffix}` : `${hh}:${mm}:${ss}`;
            },
            label: (c) => `${c.dataset.label}: ${formatPrice(c.parsed.y)}`
          }
        }
      },
      scales: {
        x: { ticks: { color: hintColor.trim() || '#999', font: { size: 11 }, maxTicksLimit: 12 }, grid: { display: false } },
        y: { ticks: { color: hintColor.trim() || '#999', font: { size: 11 }, callback: v => formatPrice(v) }, grid: { color: 'rgba(128,128,128,0.1)' } }
      }
    }
  });

  // Scroll the hour chart into view
  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function reloadStats() {
  const country = state.activeCountry || getActiveCountry();
  const url = state.selectedLocation
    ? `/api/stats?location=${encodeURIComponent(state.selectedLocation)}&country=${country}`
    : `/api/stats?country=${country}`;
  const stats = await api(url);
  state.stats = stats;
  renderStats(stats);
}

async function loadStatsTab() {
  state.loaded.stats = true;
  await loadLocationPickers();
  await reloadStats();

  const statsPicker = document.getElementById('stats-location-picker');
  if (statsPicker) {
    statsPicker.addEventListener('change', async () => {
      state.selectedLocation = statsPicker.value;
      // Sync history picker
      const historyPicker = document.getElementById('history-location-picker');
      if (historyPicker) historyPicker.value = state.selectedLocation;
      await reloadStats();
      // Reload history if already loaded
      if (state.loaded.history) {
        state.history = await fetchHistoryData();
        renderChart(state.history);
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

function renderStats(stats) {
  const el = document.getElementById('stats-content');
  if (!stats) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-text">${t('noStats')}</div></div>`;
    return;
  }
  const bestDay = stats.dayAvgs[0];
  const bestHour = stats.hourAvgs[0];
  const hourLabel = bestHour ? (t('oclock') ? `${bestHour.hour}:00 ${t('oclock')}` : `${bestHour.hour}:00`) : '-';
  let html = `
    <div class="stat-big">
      <div class="stat-big-value">${formatPrice(stats.overall.avg)}</div>
      <div class="stat-big-label">${t('avgPrice')}</div>
    </div>
    <div class="stat-row">
      <div class="stat-card"><div class="stat-card-value" style="color:#34c759">${formatPrice(stats.overall.lowest_ever)}</div><div class="stat-card-label">${t('lowest')}</div></div>
      <div class="stat-card"><div class="stat-card-value" style="color:#ff3b30">${formatPrice(stats.overall.highest_ever)}</div><div class="stat-card-label">${t('highest')}</div></div>
      <div class="stat-card"><div class="stat-card-value" style="color:#007aff">${stats.overall.entries}</div><div class="stat-card-label">${t('measurements')}</div></div>
    </div>
    <div class="section" style="margin-top:8px">
      <div class="section-header">${t('bestTimes')}</div>
      <div class="card"><div class="card-row" style="padding:4px 0"><div class="card-row-left"><div><div class="card-title">${bestDay ? (t('dayNames')[bestDay.day] || bestDay.name) : '-'}</div><div class="card-subtitle">${t('cheapestDay')}</div></div></div><div class="card-value good">${bestDay ? formatPrice(bestDay.avg) : '-'}</div></div></div>
      <div class="card"><div class="card-row" style="padding:4px 0"><div class="card-row-left"><div><div class="card-title">${hourLabel}</div><div class="card-subtitle">${t('cheapestHour')}</div></div></div><div class="card-value good">${bestHour ? formatPrice(bestHour.avg) : '-'}</div></div></div>
    </div>`;

  if (stats.dayAvgs.length) {
    html += `<div class="section"><div class="section-header">${t('weekdays')}</div><div class="card-list">`;
    const dayLen = stats.dayAvgs.length;
    stats.dayAvgs.forEach((d, i) => {
      const ratio = dayLen > 1 ? i / (dayLen - 1) : 0;
      const color = rankColor(ratio);
      html += `<div class="ranking-item"><div class="ranking-pos">${i + 1}</div><div class="ranking-name">${t('dayNames')[d.day] || d.name}</div><div class="ranking-price" style="color:${color}">${formatPrice(d.avg)}</div></div>`;
    });
    html += '</div></div>';
  }

  if (stats.hourAvgs.length) {
    const topHours = stats.hourAvgs.slice(0, 6);
    html += `<div class="section"><div class="section-header">${t('hourRanking')}</div><div class="card-list">`;
    const hourLen = topHours.length;
    topHours.forEach((h, i) => {
      const ratio = hourLen > 1 ? i / (hourLen - 1) : 0;
      const color = rankColor(ratio);
      const label = t('oclock') ? `${h.hour}:00 ${t('oclock')}` : `${h.hour}:00`;
      html += `<div class="ranking-item"><div class="ranking-pos">${i + 1}</div><div class="ranking-name">${label}</div><div class="ranking-price" style="color:${color}">${formatPrice(h.avg)}</div></div>`;
    });
    html += '</div></div>';
  }

  if (stats.stationRanking.length) {
    html += `<div class="section"><div class="section-header">${t('stationRanking')}</div><div class="card-list">`;
    const stations = stats.stationRanking.slice(0, 10);
    const stLen = stations.length;
    stations.forEach((s, i) => {
      const ratio = stLen > 1 ? i / (stLen - 1) : 0;
      const color = rankColor(ratio);
      html += `<div class="ranking-item station-ranking-item" data-station-name="${fixEnc(s.station)}" style="cursor:pointer"><div class="ranking-pos">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div><div class="ranking-name">${fixEnc(s.station)}</div><div class="ranking-price" style="color:${color}">${formatPrice(s.avg)}</div></div>`;
    });
    html += '</div></div>';
  }

  html += '<div style="height:20px"></div>';
  el.innerHTML = html;

  // Defer animations to next frame so DOM write doesn't block tab bar
  requestAnimationFrame(() => {
    const bigVal = el.querySelector('.stat-big-value');
    if (bigVal && stats.overall.avg) {
      countUp(bigVal, stats.overall.avg, 800, v => formatPrice(v));
    }
    el.querySelectorAll('.stat-card-value').forEach(cv => {
      const num = parseFloat(cv.textContent.replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        const isPrice = cv.textContent.includes(',');
        countUp(cv, num, 600, isPrice ? (v => formatPrice(v)) : (v => Math.round(v).toString()));
      }
    });
    el.querySelectorAll('.stat-card').forEach((card, i) => {
      card.style.animationDelay = `${Math.min(i * 60, 200)}ms`;
      card.classList.add('anim-in');
    });
    el.querySelectorAll('.ranking-item').forEach((item, i) => {
      item.style.animationDelay = `${Math.min(i * 20, 300)}ms`;
      item.classList.add('anim-in');
    });
  });

  el.querySelectorAll('.station-ranking-item').forEach(item => {
    item.addEventListener('click', () => {
      haptic('light');
      const name = item.dataset.stationName;
      const station = (state.stations || []).find(s => (s.name || s.brand) === name);
      if (station) showStationSheet(station);
    });
  });
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
      persistStateSettings({ fuelType: state.fuelType });
      if (state.currentTab === 'map') loadMapTab();
      refreshAlertUi();
    });
  });

  initAlertUI();

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
}

async function searchLocation(query) {
  const resultsEl = document.getElementById('map-search-results');
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=${state.lang || 'de'}`);
    const data = await resp.json();
    if (!data.length) {
      resultsEl.innerHTML = `<div class="map-search-no-results">${t('noSearchResults')}</div>`;
      resultsEl.classList.remove('hidden');
      return;
    }
    resultsEl.innerHTML = data.map(item => `
      <div class="map-search-result-item" data-lat="${item.lat}" data-lng="${item.lon}">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-hint)" style="flex-shrink:0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>${item.display_name}</span>
      </div>
    `).join('');
    resultsEl.classList.remove('hidden');

    resultsEl.querySelectorAll('.map-search-result-item').forEach(el => {
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
  } catch {
    resultsEl.innerHTML = `<div class="map-search-no-results">${t('noSearchResults')}</div>`;
    resultsEl.classList.remove('hidden');
  }
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
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=${state.lang || 'de'}`);
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

async function refreshAlertUi() {
  const toggle = document.getElementById('alert-toggle');
  const configEl = document.getElementById('alert-config');
  const activeInfo = document.getElementById('alert-active-info');
  const refEl = document.getElementById('alert-ref-price');

  // Don't blank the toggle before the network round-trip finishes — that's
  // the flicker the user sees when re-opening the settings tab. Instead we
  // overwrite once with whatever the server returns.

  // Reference price (cheapest in current radius) is informational only; if
  // the request fails we just leave the previous label in place.
  try {
    const coords = getActiveCoords();
    const stations = await api(`/api/stations?lat=${coords.lat}&lng=${coords.lng}&rad=${state.radiusKm}&fuel=${state.fuelType}`);
    const priced = stations.filter(s => typeof s.price === 'number');
    if (priced.length) {
      const min = Math.min(...priced.map(s => s.price));
      refEl.textContent = `${t('currentCheapest')}: ${formatPrice(min)}`;
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
    activeInfo.style.display = 'block';
    const chLabel = state.alertChannel === 'email' ? ' (E-Mail)' : ' (ntfy.sh)';
    activeInfo.textContent = `${t('alertActive')} ${formatPrice(alert.threshold)}${chLabel}`;

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
  } else {
    // No active alert — collapse the panel.
    toggle.checked = false;
    configEl.style.display = 'none';
    activeInfo.style.display = 'none';
    activeInfo.textContent = '';
  }

  updateAlertDisplay();
}

function updateAlertDisplay() {
  const display = document.getElementById('alert-price-display');
  display.textContent = formatPrice(state.alertPrice || 2.0);
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
    haptic('success');
    if (state.user) setSyncBadgeState('synced', ['alert']);
  } catch (error) {
    if (state.user) setSyncBadgeState('idle', ['alert']);
    showPopup(t('deleteFailed'), error.message || t('deleteError'));
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

  state.radiusKm = 25;

  applyTheme(state.theme);
  const themeSelect = document.getElementById('theme-picker');
  if (themeSelect) themeSelect.value = state.theme;
  const histSelect = document.getElementById('history-default-picker');
  if (histSelect) histSelect.value = String(state.historyDefaultDays);
  // Reflect the toggle's pressed state — the bar may already be in the DOM.
  if (typeof applyFavouritesToggleUi === 'function') applyFavouritesToggleUi();
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
    const minDelay = new Promise(r => setTimeout(r, 1000));
    try {
      await Promise.all([saveSettingsRemote(), minDelay]);
      setSyncBadgeState('synced', changedKeys);
    } catch {
      await minDelay;
      setSyncBadgeState('idle', changedKeys);
    }
  }
}

function setSyncBadgeState(s, keys) {
  // s = 'idle' | 'syncing' | 'synced'
  // keys = array of setting keys to target, e.g. ['fuelType']
  const badges = keys && keys.length
    ? keys.map(k => document.querySelector(`.sync-badge[data-sync-key="${k}"]`)).filter(Boolean)
    : document.querySelectorAll('.sync-badge');
  badges.forEach(el => {
    el.classList.remove('syncing', 'synced');
    if (s !== 'idle') el.classList.add(s);
  });
  if (s === 'synced') {
    const timerKey = keys ? keys.join(',') : '_all';
    state._syncTimers = state._syncTimers || {};
    clearTimeout(state._syncTimers[timerKey]);
    state._syncTimers[timerKey] = setTimeout(() => setSyncBadgeState('idle', keys), 2500);
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
  };
  try { await api('/api/settings', { method: 'POST', body: JSON.stringify(next) }); } catch {}
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
    }));
  } catch {}
}

function showPopup(title, message) {
  showToast(`${title}: ${message}`);
}

function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove('visible'), 2600);
}

function fixEnc(s) { return (s || '').replace(/\x81/g, 'ü').replace(/\x9A/g, 'Ü').replace(/\x84/g, 'ä').replace(/\x8E/g, 'Ä').replace(/\x94/g, 'ö').replace(/\x99/g, 'Ö').replace(/\xE1/g, 'ß'); }
function formatPrice(price) { return Number(price).toFixed(2).replace('.', ',') + '€'; }
function formatPriceParts(price) { return { main: Number(price).toFixed(2).replace('.', ','), decimal: '' }; }

function formatDataAge(isoTimestamp) {
  if (!isoTimestamp) return null;
  const seconds = Math.round((Date.now() - new Date(isoTimestamp).getTime()) / 1000);
  if (seconds < 60) return t('justNow');
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${t('priceAge')} ${minutes} ${t('minutesAgo')}`;
  const hours = Math.round(minutes / 60);
  return `${t('priceAge')} ${hours} ${t('hoursAgo')}`;
}

if (document.getElementById('app')) {
  init();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
  // Reload page when a new service worker takes over
  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
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
