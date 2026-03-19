export const APP_SHELL = `
<div id="ptr-container">
  <div id="ptr-spinner">
    <div class="native-spinner"></div>
  </div>
</div>
<div id="app">
  <div class="tab-view active" id="view-map">
    <div id="map-container">
      <div id="map"></div>
      <div id="map-search-wrapper">
        <div id="map-search-box">
          <svg class="map-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" id="map-search-input" data-i18n-placeholder="searchPlaceholder" placeholder="Ort suchen…" autocomplete="off" />
          <button id="map-search-clear" class="map-search-clear hidden" type="button">&times;</button>
        </div>
        <div id="map-search-results" class="hidden"></div>
      </div>
      <div id="map-location-banner" class="hidden">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="flex-shrink:0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span id="map-location-banner-text" data-i18n="locationBanner">Standort konnte nicht ermittelt werden. Bitte suche einen Ort.</span>
        <button id="map-location-banner-close" type="button">&times;</button>
      </div>
      <button id="btn-my-location" class="map-fab" data-i18n-title="myLocation" title="Mein Standort">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
      </button>
      <div id="map-loading" class="map-overlay">
        <div class="spinner"></div>
        <span data-i18n="loadingStations">Tankstellen laden…</span>
      </div>
    </div>
    <div class="station-sort-bar">
      <span class="station-sort-label" id="station-count"></span>
      <button class="station-sort-btn" id="station-sort">
        <svg id="sort-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
        <span id="sort-label"></span>
      </button>
    </div>
    <div id="station-list" class="station-list"></div>
  </div>

  <div class="tab-view" id="view-history">
    <div class="section">
      <select id="history-location-picker" class="location-picker" style="display:none;width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--color-hint);background:var(--color-bg-secondary);color:var(--color-text);font-size:14px;margin-bottom:8px;box-sizing:border-box">
        <option value="">Alle Standorte</option>
      </select>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="section-header" data-i18n="timePeriod" style="margin:0">ZEITRAUM</div>
        <button id="btn-measure" class="chip" style="display:none;font-size:11px;padding:4px 10px;gap:4px" data-i18n="measureNow">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Jetzt messen
        </button>
      </div>
      <div class="chip-row">
        <button class="chip active" data-days="7" data-i18n="days7">7 Tage</button>
        <button class="chip" data-days="14" data-i18n="days14">14 Tage</button>
        <button class="chip" data-days="30" data-i18n="days30">30 Tage</button>
        <button class="chip" data-days="0" data-i18n="all">Alles</button>
      </div>
    </div>
    <div class="section">
      <div class="chart-container">
        <canvas id="price-chart"></canvas>
      </div>
    </div>
    <div id="hour-chart-section" class="section" style="display:none">
      <div id="hour-chart-label" class="section-header"></div>
      <div class="chart-container">
        <canvas id="hour-chart"></canvas>
      </div>
    </div>
    <div id="history-summary" class="section"></div>
  </div>

  <div class="tab-view" id="view-stats">
    <div class="section" style="padding-bottom:0">
      <select id="stats-location-picker" class="location-picker" style="display:none;width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--color-hint);background:var(--color-bg-secondary);color:var(--color-text);font-size:14px;box-sizing:border-box">
        <option value="">Alle Standorte</option>
      </select>
    </div>
    <div id="stats-content"></div>
  </div>

  <div class="tab-view" id="view-settings">
    <div class="section">
      <div class="section-header">FELO ID</div>
      <div class="card" id="account-card">
        <div class="card-row">
          <div class="card-row-left">
            <div class="account-avatar" id="account-avatar"></div>
            <div>
              <div class="card-title" id="account-name">Nicht eingeloggt</div>
              <div class="card-subtitle" id="account-subline">Login optional, zum Sync deiner Einstellungen.</div>
            </div>
          </div>
          <button id="account-login-btn" class="card-action">Login</button>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-i18n="fuelType">KRAFTSTOFF</div>
      <div class="chip-row" id="fuel-chips">
        <button class="chip" data-fuel="diesel">Diesel</button>
        <button class="chip" data-fuel="e5">Super E5</button>
        <button class="chip" data-fuel="e10">Super E10</button>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-i18n="searchRadius">SUCHRADIUS</div>
      <div class="card">
        <div class="slider-row">
          <span id="radius-label">10 km</span>
          <input type="range" id="radius-slider" min="1" max="25" value="10" class="slider" />
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-i18n="priceAlert">PREISALARM</div>
      <div class="card">
        <div class="card-row" style="padding: 12px 16px;">
          <div class="card-row-left">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:var(--color-hint);flex-shrink:0"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span style="font-size:15px;font-weight:500" data-i18n="notification">Benachrichtigung</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="alert-toggle" />
            <span class="toggle-track"></span>
          </label>
        </div>
        <div id="alert-config" style="display:none;border-top:1px solid var(--color-hint);padding:16px">
          <div style="margin-bottom:14px">
            <div style="font-size:12px;font-weight:600;color:var(--color-hint);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px" data-i18n="notificationChannel">Benachrichtigungskanal</div>
            <div id="alert-channel-picker" style="display:flex;border-radius:10px;background:var(--color-separator);padding:2px;gap:2px">
              <button class="alert-ch-seg active" data-channel="ntfy">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                ntfy.sh
              </button>
              <button class="alert-ch-seg" data-channel="email" id="alert-ch-email" style="display:none">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                E-Mail
              </button>
            </div>
          </div>
          <div id="alert-ntfy-config" style="margin-bottom:14px">
            <input type="text" id="alert-ntfy-topic" data-i18n-placeholder="ntfyTopicPlaceholder" placeholder="ntfy Topic (z.B. mein-tankalarm)" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-hint);background:var(--color-bg-secondary);color:var(--color-text);font-size:14px;box-sizing:border-box" />
            <div style="font-size:11px;color:var(--color-hint);margin-top:4px" id="alert-ntfy-hint" data-i18n-html="ntfyHint">Installiere die <a href="https://ntfy.sh" target="_blank" style="color:var(--color-accent)">ntfy App</a> und abonniere dein Topic.</div>
          </div>
          <div id="alert-email-config" style="display:none;margin-bottom:14px">
            <input type="email" id="alert-email-address" data-i18n-placeholder="emailPlaceholder" placeholder="E-Mail-Adresse" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--color-hint);background:var(--color-bg-secondary);color:var(--color-text);font-size:14px;box-sizing:border-box" />
            <div style="font-size:11px;color:var(--color-hint);margin-top:4px" data-i18n="emailHint">Preisalarme werden an diese Adresse gesendet.</div>
          </div>
          <div style="text-align:center;margin-bottom:12px;font-size:13px;color:var(--color-hint)" id="alert-ref-price"></div>
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px">
            <button id="alert-minus" style="width:40px;height:40px;border-radius:50%;border:none;background:var(--color-bg-secondary);color:var(--color-text);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
            <div style="text-align:center">
              <div id="alert-price-display" style="font-size:32px;font-weight:700;color:var(--color-text);letter-spacing:-0.5px">2,00€</div>
              <div style="font-size:12px;color:var(--color-hint);margin-top:2px" data-i18n="threshold">Schwellenwert</div>
            </div>
            <button id="alert-plus" style="width:40px;height:40px;border-radius:50%;border:none;background:var(--color-bg-secondary);color:var(--color-text);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
          </div>
          <button id="alert-save" style="width:100%;padding:12px;border-radius:10px;border:none;background:var(--color-accent);color:var(--color-accent-text);font-size:15px;font-weight:600;cursor:pointer" data-i18n="saveAlarm">Alarm speichern</button>
          <button id="alert-test" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--color-hint);background:transparent;color:var(--color-text);font-size:13px;font-weight:500;cursor:pointer;margin-top:8px" data-i18n="sendTestNotification">Test-Benachrichtigung senden</button>
          <div id="alert-active-info" style="display:none;margin-top:10px;padding:10px 12px;border-radius:8px;background:var(--color-bg-secondary);font-size:13px;color:var(--color-hint);text-align:center"></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-i18n="appearance">DARSTELLUNG</div>
      <div class="card">
        <div class="settings-row">
          <div class="settings-row-left">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:var(--color-hint);flex-shrink:0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86z"/></svg>
            <span data-i18n="appearanceLabel" style="font-size:15px;font-weight:500">Darstellung</span>
          </div>
          <select id="theme-picker" class="settings-select">
            <option value="auto">Auto</option>
            <option value="light" data-i18n-option="themeLight">Hell</option>
            <option value="dark" data-i18n-option="themeDark">Dunkel</option>
          </select>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-i18n="language">SPRACHE</div>
      <div class="card">
        <div class="settings-row">
          <div class="settings-row-left">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:var(--color-hint);flex-shrink:0"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
            <span data-i18n="languageLabel" style="font-size:15px;font-weight:500">Sprache</span>
          </div>
          <select id="lang-picker" class="settings-select">
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>

  </div>
</div>

<div id="bottom-sheet" class="bottom-sheet hidden">
  <div class="bottom-sheet-backdrop"></div>
  <div class="bottom-sheet-content">
    <div class="bottom-sheet-handle-area" id="sheet-handle-area">
      <div class="bottom-sheet-handle"></div>
    </div>
    <div id="bottom-sheet-body"></div>
  </div>
</div>

<div id="toast" class="toast"></div>

<div id="pwa-popup" class="pwa-popup hidden">
  <div class="pwa-popup-backdrop"></div>
  <div class="pwa-popup-sheet">
    <div class="pwa-popup-icon">
      <img src="/icons/icon-192.png" alt="Tanken" width="72" height="72" />
    </div>
    <h2 class="pwa-popup-title" data-i18n="pwaTitle">Tanken installieren</h2>
    <p class="pwa-popup-desc" data-i18n="pwaDesc">Füge Tanken zu deinem Startbildschirm hinzu für schnelleren Zugriff und ein App-ähnliches Erlebnis.</p>

    <div class="pwa-popup-tabs">
      <button class="pwa-popup-tab active" data-pwa-tab="android">Android</button>
      <button class="pwa-popup-tab" data-pwa-tab="ios">iOS</button>
      <button class="pwa-popup-tab" data-pwa-tab="desktop">Desktop</button>
    </div>

    <div class="pwa-popup-instructions">
      <div class="pwa-popup-panel active" data-pwa-panel="android">
        <ol class="pwa-popup-steps">
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </span>
            <span data-i18n-html="pwaAndroid1">Tippe auf das <strong>Dreipunkt-Menü</strong> oben rechts</span>
          </li>
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-1-6.4l-5 5-2-2 1.4-1.4.6.6 3.6-3.6L16 12.6z"/></svg>
            </span>
            <span data-i18n-html="pwaAndroid2">Wähle <strong>„App installieren"</strong> oder <strong>„Zum Startbildschirm hinzufügen"</strong></span>
          </li>
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </span>
            <span data-i18n-html="pwaAndroid3">Bestätige mit <strong>„Installieren"</strong></span>
          </li>
        </ol>
      </div>
      <div class="pwa-popup-panel" data-pwa-panel="ios">
        <ol class="pwa-popup-steps">
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg>
            </span>
            <span data-i18n-html="pwaIos1">Tippe auf das <strong>Teilen-Symbol</strong> in der Safari-Leiste</span>
          </li>
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </span>
            <span data-i18n-html="pwaIos2">Scrolle und wähle <strong>„Zum Home-Bildschirm"</strong></span>
          </li>
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </span>
            <span data-i18n-html="pwaIos3">Tippe oben rechts auf <strong>„Hinzufügen"</strong></span>
          </li>
        </ol>
      </div>
      <div class="pwa-popup-panel" data-pwa-panel="desktop">
        <ol class="pwa-popup-steps">
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4l-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z"/></svg>
            </span>
            <span data-i18n-html="pwaWin1">Klicke auf das <strong>Installations-Symbol</strong> in der Adressleiste</span>
          </li>
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </span>
            <span data-i18n-html="pwaWin2">Bestätige mit <strong>„Installieren"</strong></span>
          </li>
          <li>
            <span class="pwa-step-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
            </span>
            <span data-i18n-html="pwaWin3">Optional: <strong>An Taskleiste anheften</strong> für schnellen Zugriff</span>
          </li>
        </ol>
      </div>
    </div>

    <button id="pwa-popup-ok" class="pwa-popup-btn">Okay</button>
  </div>
</div>

<nav class="tab-bar">
  <button class="tab-item active" data-tab="map">
    <svg class="tab-icon" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
    <span data-i18n="tabMap">Karte</span>
  </button>
  <button class="tab-item" data-tab="history">
    <svg class="tab-icon" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
    <span data-i18n="tabHistory">Verlauf</span>
  </button>
  <button class="tab-item" data-tab="stats">
    <svg class="tab-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
    <span>Stats</span>
  </button>
  <button class="tab-item" data-tab="settings">
    <svg class="tab-icon" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z"/></svg>
    <span data-i18n="tabSettings">Einstellungen</span>
  </button>
</nav>
`;
