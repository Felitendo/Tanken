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
    noStationsYet: 'Noch keine Stationsdaten — bitte zuerst einen Scan im Admin-Panel starten',
    errorLoading: '❌ Fehler beim Laden',
    pricesStale: 'Preise evtl. veraltet (API nicht erreichbar)',
    pricesStaleConnection: 'Preise evtl. veraltet (Verbindungsfehler)',
    pricesFallback: 'Keine gescannten Tankstellen in der Nähe – Ergebnisse von einer entfernten Messstelle',
    // Station sheet
    open: 'Geöffnet',
    closed: 'Geschlossen',
    kmAway: 'km entfernt',
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
    searchRadius: 'SUCHRADIUS',
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
  },
  en: {
    tabMap: 'Map',
    tabHistory: 'History',
    tabSettings: 'Settings',
    myLocation: 'My Location',
    loadingStations: 'Loading stations…',
    noOpenStations: 'No open gas stations found',
    showAll: 'Show all',
    noStationsYet: 'No station data yet — please start a scan in the admin panel first',
    errorLoading: '❌ Error loading',
    pricesStale: 'Prices may be outdated (API unreachable)',
    pricesStaleConnection: 'Prices may be outdated (connection error)',
    open: 'Open',
    closed: 'Closed',
    kmAway: 'km away',
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
    searchRadius: 'SEARCH RADIUS',
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
}

const state = {
  config: null,
  stations: [],
  history: [],
  stats: null,
  fuelType: 'diesel',
  radiusKm: 10,
  activeLocation: 'gps',
  userLat: null,
  userLng: null,
  currentTab: 'map',
  tabOrder: ['map', 'history', 'stats', 'settings'],
  map: null,
  markers: [],
  userMarker: null,
  chart: null,
  hourChart: null,
  sheetChart: null,
  stationSort: 'price',
  historyDays: 7,
  theme: 'auto',
  lang: detectLanguage(),
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
  priceExtremes: null
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
  state.radiusKm = state.config.radius_km;
  state.smtpConfigured = !!state.config.smtpConfigured;

  await refreshMe();
  await loadSettings();

  applyLanguage();
  setupTabs();
  setupSettings();
  setupTheme();
  setupLangPicker();
  setupMyLocationBtn();
  setupAccountUi();
  setupStationSort();
  initLocation();
  refreshAlertUi();
}




async function refreshMe() {
  try {
    const me = await api('/api/me');
    state.me = me;
    state.user = me.user || null;
  } catch {
    state.me = null;
    state.user = null;
  }
}

function setupAccountUi() {
  const btn = document.getElementById('account-login-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (state.user) {
      await api('/api/logout', { method: 'POST' });
      state.user = null;
      renderAccountUi();
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
  if (!name || !sub || !btn) return;
  if (state.user) {
    name.textContent = state.user.preferred_username || state.user.displayName || t('loggedIn');
    const connectedVia = state.config?.auth?.oidcName || 'OIDC';
    sub.textContent = state.user.email || `${t('connectedWith')} ${connectedVia}`;
    btn.textContent = 'Logout';
  } else {
    name.textContent = t('notLoggedIn');
    const oidcName = state.config?.auth?.oidcName;
    sub.textContent = state.config?.auth?.notes?.oidc || (oidcName ? `${t('loginWith')} ${oidcName}` : t('configureOidc'));
    btn.textContent = oidcName ? `${t('loginWith')} ${oidcName}` : 'Login';
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function setupTheme() {
  applyTheme(state.theme);
  const select = document.getElementById('theme-picker');
  if (!select) return;
  select.value = state.theme;
  select.addEventListener('change', () => {
    haptic('light');
    applyTheme(select.value);
    persistStateSettings({ theme: state.theme });
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

  return data;
}








function setupTabs() {
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', async () => {
      const tab = btn.dataset.tab;
      await switchTab(tab);
    });
  });

  switchTab(state.currentTab || 'map', { initial: true });
}

async function switchTab(tab, { initial = false } = {}) {
  if (!initial && tab === state.currentTab) return;
  if (!initial) haptic('light');

  document.querySelectorAll('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + tab)?.classList.add('active');
  state.currentTab = tab;

  persistStateSettings({ currentTab: tab });

  if (tab === 'map' && !state.loaded.map) await loadMapTab();
  if (tab === 'history') {
    if (!state.loaded.history) await loadHistoryTab();
    else { state.history = await fetchHistoryData(); renderChart(state.history); }
  }
  if (tab === 'stats') {
    if (!state.loaded.stats) await loadStatsTab();
    else await reloadStats();
  }
  if (tab === 'settings') await refreshAlertUi();

  if (tab === 'map' && state.map) {
    setTimeout(() => state.map.invalidateSize(), 250);
  }

}

function initLocation() {
  browserGeolocation();
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
  if (state.activeLocation === 'gps' && state.userLat && state.userLng) {
    return { lat: state.userLat, lng: state.userLng };
  }
  const locs = state.config?.locations || [];
  // Find by ID if activeLocation is a location ID
  const loc = locs.find(l => l.id === state.activeLocation);
  if (loc && loc.lat && loc.lng) return { lat: loc.lat, lng: loc.lng };
  // Fall back to first configured location
  const first = locs[0];
  if (first && first.lat && first.lng) return { lat: first.lat, lng: first.lng };
  return { lat: 48.2453, lng: 12.5225 };
}

async function loadMapTab() {
  state.loaded.map = true;
  const coords = getActiveCoords();

  if (!state.map) {
    state.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: true,
      touchZoom: true,
      tapHold: false
    }).setView([coords.lat, coords.lng], 12);

    state.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, attribution: '© OSM · CARTO', subdomains: 'abcd'
    }).addTo(state.map);

    setupMapZoomGesture();
    setupMapSearch();
  } else {
    state.map.setView([coords.lat, coords.lng], 12);
  }

  const loader = document.getElementById('map-loading');
  loader.classList.remove('hidden');

  try {
    const result = await api(`/api/stations?lat=${coords.lat}&lng=${coords.lng}&rad=${state.radiusKm}&fuel=${state.fuelType}`);
    const stations = Array.isArray(result) ? result : [];
    const cacheStatus = result._cacheStatus || 'fresh';
    state.stations = stations;
    renderStationsOnMap(stations);
    renderStationList(stations);
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

function renderStationsOnMap(stations) {
  state.markers.forEach(m => state.map.removeLayer(m));
  state.markers = [];
  if (state.userMarker) {
    state.map.removeLayer(state.userMarker);
    state.userMarker = null;
  }

  if (!stations.length) return;

  const prices = stations.filter(s => s.price).map(s => s.price);
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
    state.markers.push(state.userMarker);
  }

  stations.forEach((s) => {
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
      .addTo(state.map)
      .on('click', () => {
        haptic('light');
        if (state.map && s.lat && s.lng) {
          state.map.invalidateSize();
          state.map.flyTo([s.lat, s.lng], 15, { duration: 0.6 });
        }
        showStationSheet(s);
      });

    state.markers.push(marker);
  });

  if (state.markers.length > 1) {
    const group = L.featureGroup(state.markers);
    const bounds = group.getBounds().pad(0.1);
    state.map.fitBounds(bounds);
    state.defaultBounds = bounds;
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
  const list = document.getElementById('station-list');
  const countLabel = document.getElementById('station-count');
  const open = stations.filter(s => s.isOpen && s.price);

  if (countLabel) countLabel.textContent = `${open.length} ${t('stationsFound')}`;

  if (!open.length) {
    list.innerHTML = `<div class="empty-state"><svg class="empty-state-icon" viewBox="0 0 24 24" width="48" height="48" fill="var(--color-hint)"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/></svg><div class="empty-state-text">${t('noOpenStations')}</div></div>`;
    return;
  }

  if (state.stationSort === 'distance') {
    open.sort((a, b) => (a.dist || 999) - (b.dist || 999));
  } else {
    open.sort((a, b) => a.price - b.price);
  }

  const minPrice = Math.min(...open.map(s => s.price));
  const maxPrice = Math.max(...open.map(s => s.price));
  list.innerHTML = open.slice(0, 15).map((s, i) => {
    const ratio = maxPrice > minPrice ? (s.price - minPrice) / (maxPrice - minPrice) : 0;
    const color = priceColor(ratio);
    const dist = s.dist ? `${s.dist.toFixed(1)} km` : '';
    const priceParts = formatPriceParts(s.price);

    return `
      <div class="station-item ripple" data-idx="${i}">
        <div class="station-rank" style="background:${color}">${i + 1}</div>
        <div class="station-info">
          <div class="station-name">${fixEnc(s.brand || s.name)}</div>
          <div class="station-addr">${fixEnc(s.street)} ${s.houseNumber || ''}, ${fixEnc(s.place)}</div>
        </div>
        <div style="text-align:right">
          <div class="station-price" style="color:${color}">${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''}</div>
          <div class="station-dist">${dist}</div>
        </div>
      </div>`;
  }).join('');

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

  body.innerHTML = `
    <div class="sheet-station-header">
      <div class="sheet-station-name">${fixEnc(station.name || station.brand)}</div>
      <div class="sheet-station-brand">${fixEnc(station.brand)}</div>
    </div>
    <div class="sheet-station-price" style="color:${color}">
      ${priceParts.main}${priceParts.decimal ? `<sup>${priceParts.decimal}</sup>` : ''}
      <span style="font-size:16px;font-weight:400;color:var(--color-hint)">€/L</span>
    </div>
    <div class="sheet-info-row">
      <svg class="sheet-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
      <span>${fixEnc(station.street)} ${station.houseNumber || ''}, ${station.postCode || ''} ${fixEnc(station.place)}</span>
    </div>
    <div class="sheet-info-row">
      <span class="sheet-info-icon"><span style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${station.isOpen ? '#34c759' : '#ff3b30'}"></span></span>
      <span>${station.isOpen ? t('open') : t('closed')}</span>
      ${station.dist ? `<span style="margin-left:auto;color:var(--color-hint)">${station.dist.toFixed(1)} ${t('kmAway')}</span>` : ''}
    </div>
    <div class="sheet-chart-section">
      <div class="sheet-chart-header-row">
        <div class="sheet-chart-header">${t('priceHistory')}</div>
        <div class="sheet-chart-toggle">
          <button class="sheet-toggle-btn active" data-range="1" id="sheet-range-24h">${t('sheet24h')}</button>
          <button class="sheet-toggle-btn" data-range="7" id="sheet-range-7d">${t('sheet7d')}</button>
        </div>
      </div>
      <div class="sheet-chart-container">
        <div id="sheet-chart-loading" class="sheet-chart-empty"><div class="spinner"></div></div>
        <canvas id="sheet-price-chart" style="display:none"></canvas>
      </div>
    </div>
    <div class="sheet-nav-buttons${isAndroid ? ' android-only' : ''}">
      <a href="${gmapsUrl}" target="_blank" class="sheet-nav-btn gmaps">
        <img src="/icons/google-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Google Maps</span>
      </a>
      ${isAndroid ? '' : `<a href="${appleMapsUrl}" target="_blank" class="sheet-nav-btn amaps">
        <img src="/icons/apple-maps${isDark ? '-dark' : ''}.webp" alt="" width="24" height="24" class="sheet-nav-icon">
        <span>Apple Maps</span>
      </a>`}
    </div>`;

  sheet.classList.remove('hidden');
  const backdrop = sheet.querySelector('.bottom-sheet-backdrop');
  const content = sheet.querySelector('.bottom-sheet-content');

  const closeSheet = () => {
    if (state.sheetChart) { state.sheetChart.destroy(); state.sheetChart = null; }
    sheet.classList.add('hidden');
    backdrop.removeEventListener('click', closeSheet);
    if (state.defaultBounds) showResetViewBtn();
  };
  backdrop.addEventListener('click', closeSheet);

  let startY = 0;
  content.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true, once: true });
  content.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientY - startY;
    if (diff > 80) closeSheet();
  }, { passive: true, once: true });

  state.sheetStationName = station.name;
  loadSheetChart(station.name, 1);

  document.querySelectorAll('.sheet-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      haptic('light');
      document.querySelectorAll('.sheet-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSheetChart(state.sheetStationName, parseInt(btn.dataset.range, 10));
    });
  });
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
    const data = await api(`/api/history?station=${encodeURIComponent(stationName)}`);
    if (!data || !data.length || data.length < 2) {
      loading.innerHTML = `<span>${t('noHistory')}</span>`;
      return;
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    let filtered = data.filter(d => new Date(d.timestamp) >= cutoff);
    if (filtered.length < 2) filtered = data.slice(-10);

    const labels = filtered.map(d => {
      const dt = new Date(d.timestamp);
      if (days <= 1) return `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
      return `${dt.getDate()}.${dt.getMonth() + 1}`;
    });

    const hintColor = getComputedStyle(document.body).getPropertyValue('--color-hint') || '#999';

    loading.style.display = 'none';
    canvas.style.display = 'block';

    state.sheetChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Min',
            data: filtered.map(d => d.min_price),
            borderColor: '#34c759',
            backgroundColor: 'rgba(52,199,89,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: filtered.length < 15 ? 3 : 0,
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
            callbacks: { label: (ctx) => formatPrice(ctx.parsed.y) }
          }
        },
        scales: {
          x: {
            ticks: { color: hintColor.trim() || '#999', font: { size: 10 }, maxTicksLimit: 5 },
            grid: { display: false }
          },
          y: {
            ticks: { color: hintColor.trim() || '#999', font: { size: 10 }, callback: v => formatPrice(v), maxTicksLimit: 4 },
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
    const res = await api('/api/history?locations=list');
    const locations = res && res.locations ? res.locations : [];
    state.availableLocations = locations;

    // Also get location names from config
    let configLocations = {};
    try {
      const cfg = await api('/api/config');
      if (cfg && cfg.locations) {
        cfg.locations.forEach(l => { configLocations[l.id] = l.name; });
      }
    } catch { /* ignore */ }

    ['history-location-picker', 'stats-location-picker'].forEach(id => {
      const picker = document.getElementById(id);
      if (!picker) return;
      // Keep the first "Alle Standorte" option
      while (picker.options.length > 1) picker.remove(1);
      locations.forEach(locId => {
        const opt = document.createElement('option');
        opt.value = locId;
        opt.textContent = configLocations[locId] || locId;
        picker.appendChild(opt);
      });
      picker.value = state.selectedLocation;
      picker.style.display = locations.length > 0 ? '' : 'none';
    });
  } catch { /* ignore */ }
}

async function fetchHistoryData() {
  const url = state.selectedLocation ? `/api/history?location=${encodeURIComponent(state.selectedLocation)}` : '/api/history';
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
          callbacks: { label: (c) => `${c.dataset.label}: ${formatPrice(c.parsed.y)}` }
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
  const url = state.selectedLocation ? `/api/stats?location=${encodeURIComponent(state.selectedLocation)}` : '/api/stats';
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
    html += `<div class="section"><div class="section-header">${t('hourRanking')}</div><div class="card-list">`;
    const hourLen = stats.hourAvgs.length;
    stats.hourAvgs.forEach((h, i) => {
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

  const slider = document.getElementById('radius-slider');
  const label = document.getElementById('radius-label');
  slider.value = state.radiusKm;
  label.textContent = state.radiusKm + ' km';
  let lastRadiusHaptic = parseInt(slider.value, 10);
  slider.addEventListener('input', () => {
    label.textContent = slider.value + ' km';
    const current = parseInt(slider.value, 10);
    if (current !== lastRadiusHaptic) {
      lastRadiusHaptic = current;
      haptic('selection');
    }
  });
  slider.addEventListener('change', async () => {
    haptic('light');
    state.radiusKm = parseInt(slider.value, 10);
    state.loaded.map = false;
    await persistStateSettings({ radiusKm: state.radiusKm });
    if (state.currentTab === 'map') loadMapTab();
  });

  initAlertUI();
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
      el.addEventListener('click', () => {
        const lat = parseFloat(el.dataset.lat);
        const lng = parseFloat(el.dataset.lng);
        document.getElementById('map-search-input').value = el.querySelector('span').textContent;
        document.getElementById('map-search-clear').classList.remove('hidden');
        resultsEl.classList.add('hidden');
        // Hide location banner since user picked a location
        document.getElementById('map-location-banner')?.classList.add('hidden');
        // Fly to location and reload stations
        if (state.map) state.map.flyTo([lat, lng], 13, { duration: 0.5 });
        state.userLat = lat;
        state.userLng = lng;
        state.activeLocation = 'gps';
        state.loaded.map = false;
        loadMapTab();
      });
    });
  } catch {
    resultsEl.innerHTML = `<div class="map-search-no-results">${t('noSearchResults')}</div>`;
    resultsEl.classList.remove('hidden');
  }
}

function initAlertUI() {
  document.getElementById('alert-toggle').addEventListener('change', async (e) => {
    haptic('light');
    if (e.target.checked) {
      document.getElementById('alert-config').style.display = 'block';
    } else {
      await deleteAlert();
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
      channelSegs.forEach(s => s.classList.remove('active'));
      seg.classList.add('active');
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

  toggle.checked = false;
  configEl.style.display = 'none';
  activeInfo.style.display = 'none';
  activeInfo.textContent = '';

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

  try {
    const alert = await api(state.user ? '/api/alert' : '/api/alert/local');
    if (alert?.threshold) {
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
      channelSegs.forEach(s => s.classList.toggle('active', s.dataset.channel === state.alertChannel));
      document.getElementById('alert-ntfy-config').style.display = state.alertChannel === 'ntfy' ? 'block' : 'none';
      document.getElementById('alert-email-config').style.display = state.alertChannel === 'email' ? 'block' : 'none';
      const ntfyInput = document.getElementById('alert-ntfy-topic');
      if (ntfyInput) ntfyInput.value = state.alertNtfyTopic;
      const emailInput = document.getElementById('alert-email-address');
      if (emailInput) emailInput.value = state.alertEmail;
    }
  } catch {}

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

  try {
    const result = await api(state.user ? '/api/alert' : '/api/alert/local', {
      method: 'POST',
      body: JSON.stringify({
        threshold: state.alertPrice,
        fuel: state.fuelType,
        enabled: true,
        channel: state.alertChannel,
        ntfyTopic: state.alertNtfyTopic,
        email: state.alertEmail
      })
    });
    if (result?.ok) {
      haptic('success');
      const chLabel = state.alertChannel === 'email' ? ' (E-Mail)' : ' (ntfy.sh)';
      document.getElementById('alert-active-info').style.display = 'block';
      document.getElementById('alert-active-info').textContent = `${t('alertActive')} ${formatPrice(state.alertPrice)}${chLabel}`;
      showPopup(t('saved'), `${t('alertSetMsg')} ${state.fuelType.toUpperCase()} ${t('under')} ${formatPrice(state.alertPrice)}.`);
      await refreshMe();
    }
  } catch (error) {
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

async function checkPriceAlert(stations) {
  if (state.alertNotified) return;
  // Get current alert
  let alert = null;
  try {
    alert = await api(state.user ? '/api/alert' : '/api/alert/local');
  } catch { return; }
  if (!alert?.threshold || !alert.enabled) return;

  const priced = stations.filter(s => typeof s.price === 'number' && s.isOpen);
  const cheapest = priced.length ? priced.reduce((a, b) => a.price < b.price ? a : b) : null;
  if (!cheapest || cheapest.price >= alert.threshold) return;

  state.alertNotified = true;
  const title = t('priceAlertTitle');
  const body = `${fixEnc(cheapest.brand || cheapest.name)}: ${formatPrice(cheapest.price)} (${t('under')} ${formatPrice(alert.threshold)})`;

  const channel = alert.channel || 'ntfy';
  if (channel === 'email' && alert.email) {
    try {
      await api('/api/alert/email', {
        method: 'POST',
        body: JSON.stringify({ to: alert.email, subject: title, body })
      });
    } catch {}
  } else if (channel === 'ntfy' && alert.ntfyTopic) {
    try {
      await api('/api/alert/notify', {
        method: 'POST',
        body: JSON.stringify({ topic: alert.ntfyTopic, title, message: body })
      });
    } catch {}
  }
}

async function deleteAlert() {
  try {
    await api(state.user ? '/api/alert' : '/api/alert/local', { method: 'DELETE' });
    document.getElementById('alert-config').style.display = 'none';
    document.getElementById('alert-active-info').style.display = 'none';
    haptic('success');
  } catch (error) {
    showPopup(t('deleteFailed'), error.message || t('deleteError'));
  }
}


function setupMyLocationBtn() {
  const locBtn = document.getElementById('btn-my-location');
  locBtn.addEventListener('pointerdown', e => e.stopPropagation());
  locBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    haptic('medium');
    locBtn.style.opacity = '0.5';

    const gotLocation = async (lat, lng) => {
      state.userLat = lat;
      state.userLng = lng;
      locBtn.style.opacity = '1';
      if (state.map) state.map.flyTo([lat, lng], 14, { duration: 0.5 });
      state.activeLocation = 'gps';
      document.getElementById('map-location-banner')?.classList.add('hidden');
      state.loaded.map = false;
      persistStateSettings({ activeLocation: state.activeLocation });
      loadMapTab();
    };

    if (state.userLat && state.userLng) {
      gotLocation(state.userLat, state.userLng);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => gotLocation(pos.coords.latitude, pos.coords.longitude),
        () => {
          locBtn.style.opacity = '1';
          showPopup(t('locationTitle'), t('locationError'));
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      locBtn.style.opacity = '1';
    }
  });
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
  if (state.user?.settings) applySettingsToState(state.user.settings);
}

function loadFromLocal() {
  try {
    const val = localStorage.getItem(localSettingsKey);
    if (val) applySettingsToState(JSON.parse(val));
  } catch {}
}

function applySettingsToState(settings = {}) {
  if (settings.fuelType) state.fuelType = settings.fuelType;
  if (settings.radiusKm) state.radiusKm = parseInt(settings.radiusKm, 10);
  if (settings.activeLocation) state.activeLocation = settings.activeLocation;
  if (settings.currentTab) state.currentTab = settings.currentTab;
  if (settings.theme) state.theme = settings.theme;
  if (settings.lang) state.lang = settings.lang;

  const slider = document.getElementById('radius-slider');
  const label = document.getElementById('radius-label');
  if (slider) slider.value = state.radiusKm;
  if (label) label.textContent = state.radiusKm + ' km';

  applyTheme(state.theme);
  const themeSelect = document.getElementById('theme-picker');
  if (themeSelect) themeSelect.value = state.theme;
}

async function persistStateSettings(nextSettings = {}) {
  applySettingsToState(nextSettings);
  saveSettingsLocal();
  if (state.user) {
    await saveSettingsRemote();
  }
}

async function saveSettingsRemote() {
  const next = { fuelType: state.fuelType, radiusKm: state.radiusKm, activeLocation: state.activeLocation, currentTab: state.currentTab, theme: state.theme, lang: state.lang };
  try { await api('/api/settings', { method: 'POST', body: JSON.stringify(next) }); } catch {}
}

function saveSettingsLocal() {
  try {
    localStorage.setItem(localSettingsKey, JSON.stringify({
      fuelType: state.fuelType,
      radiusKm: state.radiusKm,
      activeLocation: state.activeLocation,
      currentTab: state.currentTab,
      theme: state.theme,
      lang: state.lang
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

if (document.getElementById('app')) {
  init();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

/* === PWA Install Popup === */
(function() {
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  var dismissed = localStorage.getItem('pwa_popup_dismissed');

  if (isStandalone || dismissed) return;

  var popup = document.getElementById('pwa-popup');
  if (!popup) return;

  // Auto-detect platform and pre-select the right tab
  var ua = navigator.userAgent || '';
  var defaultTab = 'android';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    defaultTab = 'ios';
  } else if (/Win/.test(navigator.platform)) {
    defaultTab = 'desktop';
  }

  function activateTab(name) {
    popup.querySelectorAll('.pwa-popup-tab').forEach(function(t) {
      t.classList.toggle('active', t.getAttribute('data-pwa-tab') === name);
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
