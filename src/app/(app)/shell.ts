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
          <input type="text" id="map-search-input" data-i18n-placeholder="searchPlaceholder" data-i18n-aria-label="searchPlaceholder" aria-label="Ort suchen" placeholder="Ort suchen…" autocomplete="off" />
          <button id="map-search-clear" class="map-search-clear hidden" type="button" aria-label="Suche löschen" data-i18n-aria-label="clearSearch">&times;</button>
        </div>
        <div id="map-search-results" class="hidden" role="listbox" aria-label="Suchergebnisse"></div>
      </div>
      <div id="map-location-banner" class="hidden" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="flex-shrink:0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span id="map-location-banner-text" data-i18n="locationBanner">Standort konnte nicht ermittelt werden. Bitte suche einen Ort.</span>
        <button id="map-location-banner-close" type="button" aria-label="Banner schließen" data-i18n-aria-label="closeBanner">&times;</button>
      </div>
      <button id="btn-my-location" class="map-fab" type="button" data-i18n-title="myLocation" data-i18n-aria-label="myLocation" title="Mein Standort" aria-label="Mein Standort">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
      </button>
      <button id="btn-search-here" class="map-search-here" type="button">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <span data-i18n="searchHere">Hier suchen</span>
      </button>
      <div id="map-loading" class="map-overlay" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <span data-i18n="loadingStations">Tankstellen laden…</span>
      </div>
    </div>
    <div class="desktop-station-panel">
      <div class="station-sort-bar">
        <span class="station-sort-label" id="station-count"></span>
        <button type="button" class="station-sort-btn" id="station-sort" aria-label="Sortierung ändern">
          <svg id="sort-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
          <span id="sort-label"></span>
        </button>
      </div>
      <div id="station-list" class="station-list"></div>
    </div>
  </div>

  <div class="tab-view" id="view-history">
    <div class="section">
      <select id="history-location-picker" class="location-picker" aria-label="Standort filtern" style="display:none;margin-bottom:8px">
        <option value="">Alle Standorte</option>
      </select>
      <div class="section-header-row">
        <div class="section-header" data-i18n="timePeriod" style="margin:0">ZEITRAUM</div>
        <button id="btn-measure" type="button" class="chip measure-chip" style="display:none" data-i18n="measureNow">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Jetzt messen
        </button>
      </div>
      <div class="chip-row" role="tablist" aria-label="Zeitraum">
        <button type="button" class="chip active" data-days="7" data-i18n="days7">7 Tage</button>
        <button type="button" class="chip" data-days="14" data-i18n="days14">14 Tage</button>
        <button type="button" class="chip" data-days="30" data-i18n="days30">30 Tage</button>
        <button type="button" class="chip" data-days="0" data-i18n="all">Alles</button>
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
      <select id="stats-location-picker" class="location-picker" aria-label="Standort filtern" style="display:none">
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
          <button type="button" id="account-login-btn" class="card-action">Login</button>
        </div>
      </div>
    </div>

    <div id="cloud-sync-hint" class="cloud-sync-hint">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
      <span data-i18n="cloudSyncHint">Anmelden für Cloud-Sync, um Einstellungen geräteübergreifend zu synchronisieren</span>
    </div>

    <div class="section">
      <div class="section-header"><span data-i18n="fuelType">KRAFTSTOFF</span><span class="sync-badge" data-sync-key="fuelType" data-i18n-title="syncedSetting" title="Wird zwischen Geräten synchronisiert"><svg class="sync-icon-idle" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg><svg class="sync-icon-spin" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg><svg class="sync-icon-ok" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l5.09-5.09L16.5 10.5 10 17z"/></svg></span></div>
      <div class="chip-row" id="fuel-chips" role="tablist" aria-label="Kraftstoff">
        <button type="button" class="chip" data-fuel="diesel">Diesel</button>
        <button type="button" class="chip" data-fuel="e5">Super E5</button>
        <button type="button" class="chip" data-fuel="e10">Super E10</button>
      </div>
    </div>

    <div class="section">
      <div class="section-header"><span data-i18n="priceAlert">PREISALARM</span><span class="sync-badge" data-sync-key="alert" data-i18n-title="syncedSetting" title="Wird zwischen Geräten synchronisiert"><svg class="sync-icon-idle" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg><svg class="sync-icon-spin" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg><svg class="sync-icon-ok" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l5.09-5.09L16.5 10.5 10 17z"/></svg></span></div>
      <div class="card">
        <div class="card-row card-toggle-row">
          <div class="card-row-left">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" style="color:var(--color-hint);flex-shrink:0"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span class="settings-row-label" data-i18n="notification">Benachrichtigung</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="alert-toggle" aria-label="Preisalarm aktivieren" />
            <span class="toggle-track"></span>
          </label>
        </div>
        <div id="alert-config" class="alert-config-body" style="display:none">
          <div class="alert-config-group">
            <div class="alert-config-label" data-i18n="notificationChannel">Benachrichtigungskanal</div>
            <div id="alert-channel-picker" class="alert-channel-picker" role="tablist">
              <button class="alert-ch-seg active" type="button" role="tab" aria-selected="true" data-channel="ntfy">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                ntfy.sh
              </button>
              <button class="alert-ch-seg" type="button" role="tab" aria-selected="false" data-channel="email" id="alert-ch-email" style="display:none">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                E-Mail
              </button>
            </div>
          </div>
          <div id="alert-ntfy-config" class="alert-config-group">
            <input type="text" id="alert-ntfy-topic" class="alert-input" data-i18n-placeholder="ntfyTopicPlaceholder" placeholder="ntfy Topic (z.B. mein-tankalarm)" aria-label="ntfy Topic" />
            <div class="alert-input-hint" id="alert-ntfy-hint" data-i18n-html="ntfyHint">Installiere die <a href="https://ntfy.sh" target="_blank" rel="noopener" style="color:var(--color-accent)">ntfy App</a> und abonniere dein Topic.</div>
          </div>
          <div id="alert-email-config" class="alert-config-group" style="display:none">
            <input type="email" id="alert-email-address" class="alert-input" data-i18n-placeholder="emailPlaceholder" placeholder="E-Mail-Adresse" aria-label="E-Mail-Adresse" />
            <div class="alert-input-hint" data-i18n="emailHint">Preisalarme werden an diese Adresse gesendet.</div>
          </div>
          <div class="alert-ref-price" id="alert-ref-price"></div>
          <div class="alert-price-row">
            <button id="alert-minus" type="button" class="alert-step-btn" aria-label="Schwellenwert verringern">−</button>
            <div style="text-align:center">
              <div id="alert-price-display" class="alert-price-display" aria-live="polite">2,00€</div>
              <div class="alert-price-caption" data-i18n="threshold">Schwellenwert</div>
            </div>
            <button id="alert-plus" type="button" class="alert-step-btn" aria-label="Schwellenwert erhöhen">+</button>
          </div>
          <button id="alert-save" type="button" class="alert-save-btn" data-i18n="saveAlarm">Alarm speichern</button>
          <button id="alert-test" type="button" class="alert-test-btn" data-i18n="sendTestNotification">Test-Benachrichtigung senden</button>
          <div id="alert-active-info" class="alert-active-info" style="display:none"></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-i18n="scanLocations">SCAN-STANDORTE</div>
      <div class="card" id="user-requests-card">
        <div id="user-requests-list"></div>
        <button type="button" id="btn-request-location" class="card-row request-location-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="flex-shrink:0"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span data-i18n="requestLocation">Standort anfragen</span>
        </button>
      </div>
      <div class="cloud-sync-hint" id="user-requests-login-hint" style="display:none">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/></svg>
        <span data-i18n="requestsLoginHint">Anmelden, um neue Scan-Standorte anzufragen.</span>
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
      <div class="section-header"><span data-i18n="language">SPRACHE</span><span class="sync-badge" data-sync-key="lang" data-i18n-title="syncedSetting" title="Wird zwischen Geräten synchronisiert"><svg class="sync-icon-idle" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg><svg class="sync-icon-spin" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg><svg class="sync-icon-ok" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l5.09-5.09L16.5 10.5 10 17z"/></svg></span></div>
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

    <div class="section">
      <div class="section-header" data-i18n="about">ÜBER</div>
      <div class="card about-card">
        <div class="about-app-row">
          <img src="/icons/icon-192.png" alt="Tanken" width="48" height="48" class="about-app-icon" />
          <div class="about-app-info">
            <div class="about-app-name">Tanken</div>
            <div id="app-version" class="about-app-version"></div>
          </div>
        </div>
      </div>
      <div class="card about-card about-links-card">
        <button type="button" class="about-row" id="about-contributors-toggle" aria-expanded="false" aria-controls="about-contributors-list">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" class="about-row-icon"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span class="about-row-label" data-i18n="contributors">Mitwirkende</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" class="about-row-chevron about-contributors-chevron"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
        <div class="about-contributors-list" id="about-contributors-list">
          <a href="https://github.com/Felitendo" target="_blank" rel="noopener" class="about-contributor">
            <img src="https://github.com/Felitendo.png" alt="Felitendo" width="36" height="36" class="about-contributor-avatar" loading="lazy" />
            <div class="about-contributor-info">
              <div class="about-contributor-name">Felitendo</div>
              <div class="about-contributor-role" data-i18n="ownerRole">Ersteller & Maintainer</div>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="about-row-chevron"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </a>
        </div>
        <div class="about-row-divider"></div>
        <a href="https://github.com/Felitendo/Tanken" target="_blank" rel="noopener" class="about-row">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="about-row-icon"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          <span class="about-row-label" data-i18n="viewOnGithub">Auf GitHub ansehen</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="about-row-chevron"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </a>
      </div>
    </div>

    <div class="about-footer">
      <span data-i18n="madeWith">Gemacht mit</span> ❤️ <span data-i18n="madeIn">in Deutschland</span>
    </div>

  </div>
</div>

<div id="bottom-sheet" class="bottom-sheet hidden" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="bottom-sheet-backdrop"></div>
  <div class="bottom-sheet-content">
    <div class="bottom-sheet-handle-area" id="sheet-handle-area" aria-hidden="true">
      <div class="bottom-sheet-handle"></div>
    </div>
    <div id="bottom-sheet-body"></div>
  </div>
</div>

<div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"></div>

<div id="pwa-popup" class="pwa-popup hidden">
  <div class="pwa-popup-backdrop"></div>
  <div class="pwa-popup-sheet">
    <div class="pwa-popup-icon">
      <img src="/icons/icon-192.png" alt="Tanken" width="72" height="72" />
    </div>
    <h2 class="pwa-popup-title" data-i18n="pwaTitle">Tanken installieren</h2>
    <p class="pwa-popup-desc" data-i18n="pwaDesc">Füge Tanken zu deinem Startbildschirm hinzu für schnelleren Zugriff und ein App-ähnliches Erlebnis.</p>

    <div class="pwa-popup-tabs" role="tablist" aria-label="Plattform">
      <button type="button" class="pwa-popup-tab active" role="tab" aria-selected="true" data-pwa-tab="android">Android</button>
      <button type="button" class="pwa-popup-tab" role="tab" aria-selected="false" data-pwa-tab="ios">iOS</button>
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
    </div>

    <button type="button" id="pwa-popup-ok" class="pwa-popup-btn">Okay</button>
  </div>
</div>

<nav class="tab-bar" role="tablist" aria-label="Hauptnavigation">
  <button type="button" class="tab-item active" role="tab" aria-selected="true" data-tab="map">
    <svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
    <span data-i18n="tabMap">Karte</span>
  </button>
  <button type="button" class="tab-item" role="tab" aria-selected="false" data-tab="history">
    <svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
    <span data-i18n="tabHistory">Verlauf</span>
  </button>
  <button type="button" class="tab-item" role="tab" aria-selected="false" data-tab="stats">
    <svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
    <span>Stats</span>
  </button>
  <button type="button" class="tab-item" role="tab" aria-selected="false" data-tab="settings">
    <svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z"/></svg>
    <span data-i18n="tabSettings">Einstellungen</span>
  </button>
</nav>
`;
