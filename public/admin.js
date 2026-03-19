(function () {
  const root = document.querySelector('.admin-page');
  if (!root) return;

  const state = {
    status: null
  };

  const panels = {
    setup: document.getElementById('admin-setup-panel'),
    login: document.getElementById('admin-login-panel'),
    dashboard: document.getElementById('admin-dashboard-panel')
  };

  const feedbackEl = document.getElementById('admin-feedback');
  const bootstrapForm = document.getElementById('admin-bootstrap-form');
  const loginForm = document.getElementById('admin-login-form');
  const configForm = document.getElementById('admin-config-form');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const userLabel = document.getElementById('admin-user-label');

  function setFeedback(message, type) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message || '';
    feedbackEl.className = `admin-feedback${message ? ` visible ${type || 'info'}` : ''}`;
  }

  function togglePanel(name) {
    Object.entries(panels).forEach(([key, element]) => {
      if (!element) return;
      element.classList.toggle('is-hidden', key !== name);
    });
  }

  async function api(url, options) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error || `HTTP ${response.status}`);
    }

    return payload;
  }

  function formatLocations(locations) {
    return JSON.stringify(locations || {}, null, 2);
  }

  function fillConfigForm(form, config) {
    if (!form || !config) return;

    form.querySelector('[data-config-field="apiKey"]').value = config.apiKey || '';
    form.querySelector('[data-config-field="fuelType"]').value = config.fuelType || 'diesel';
    form.querySelector('[data-config-field="radiusKm"]').value = config.radiusKm ?? 10;
    form.querySelector('[data-config-field="sessionSecret"]').value = config.sessionSecret || '';
    form.querySelector('[data-config-field="thresholds.goodBelowAvgCents"]').value = config.thresholds?.goodBelowAvgCents ?? 3;
    form.querySelector('[data-config-field="thresholds.okayBelowAvgCents"]').value = config.thresholds?.okayBelowAvgCents ?? 1;
    form.querySelector('[data-config-field="oidc.issuerUrl"]').value = config.oidc?.issuerUrl || '';
    form.querySelector('[data-config-field="oidc.clientId"]').value = config.oidc?.clientId || '';
    form.querySelector('[data-config-field="oidc.clientSecret"]').value = config.oidc?.clientSecret || '';
    form.querySelector('[data-config-field="oidc.scope"]').value = config.oidc?.scope || 'openid profile email';
    form.querySelector('[data-config-field="locationsJson"]').value = formatLocations(config.locations);
  }

  function readConfigForm(form) {
    const locationsRaw = form.querySelector('[data-config-field="locationsJson"]').value.trim() || '{}';
    let locations;

    try {
      locations = JSON.parse(locationsRaw);
    } catch {
      throw new Error('Locations JSON ist ungueltig.');
    }

    return {
      apiKey: form.querySelector('[data-config-field="apiKey"]').value.trim(),
      fuelType: form.querySelector('[data-config-field="fuelType"]').value,
      radiusKm: Number(form.querySelector('[data-config-field="radiusKm"]').value || 10),
      sessionSecret: form.querySelector('[data-config-field="sessionSecret"]').value.trim(),
      thresholds: {
        goodBelowAvgCents: Number(form.querySelector('[data-config-field="thresholds.goodBelowAvgCents"]').value || 3),
        okayBelowAvgCents: Number(form.querySelector('[data-config-field="thresholds.okayBelowAvgCents"]').value || 1)
      },
      locations,
      oidc: {
        issuerUrl: form.querySelector('[data-config-field="oidc.issuerUrl"]').value.trim(),
        clientId: form.querySelector('[data-config-field="oidc.clientId"]').value.trim(),
        clientSecret: form.querySelector('[data-config-field="oidc.clientSecret"]').value.trim(),
        scope: form.querySelector('[data-config-field="oidc.scope"]').value.trim() || 'openid profile email'
      }
    };
  }

  function renderStatus() {
    if (!state.status) return;

    if (!state.status.bootstrapped) {
      fillConfigForm(bootstrapForm, state.status.config || {});
      togglePanel('setup');
      userLabel.textContent = '';
      return;
    }

    if (state.status.authenticated) {
      fillConfigForm(configForm, state.status.config || {});
      userLabel.textContent = `Angemeldet als ${state.status.user?.username || state.status.user?.displayName || 'Admin'}`;
      togglePanel('dashboard');
      return;
    }

    togglePanel('login');
  }

  async function refreshStatus() {
    state.status = await api('/api/admin/status');
    renderStatus();
  }

  bootstrapForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFeedback('');

    try {
      const config = readConfigForm(bootstrapForm);
      const formData = new FormData(bootstrapForm);
      await api('/api/admin/bootstrap', {
        method: 'POST',
        body: JSON.stringify({
          username: String(formData.get('username') || '').trim(),
          password: String(formData.get('password') || ''),
          config
        })
      });

      setFeedback('Setup gespeichert. Admin ist jetzt eingeloggt.', 'success');
      bootstrapForm.reset();
      await refreshStatus();
    } catch (error) {
      setFeedback(error.message || 'Setup fehlgeschlagen.', 'error');
    }
  });

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFeedback('');

    try {
      const formData = new FormData(loginForm);
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: String(formData.get('username') || '').trim(),
          password: String(formData.get('password') || '')
        })
      });

      setFeedback('Login erfolgreich.', 'success');
      loginForm.reset();
      await refreshStatus();
    } catch (error) {
      setFeedback(error.message || 'Login fehlgeschlagen.', 'error');
    }
  });

  configForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFeedback('');

    try {
      const config = readConfigForm(configForm);
      const result = await api('/api/admin/config', {
        method: 'PUT',
        body: JSON.stringify(config)
      });

      fillConfigForm(configForm, result.config);
      setFeedback('Konfiguration gespeichert.', 'success');
      await refreshStatus();
    } catch (error) {
      setFeedback(error.message || 'Speichern fehlgeschlagen.', 'error');
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    setFeedback('');

    try {
      await api('/api/logout', { method: 'POST' });
      setFeedback('Logout erfolgreich.', 'success');
      await refreshStatus();
    } catch (error) {
      setFeedback(error.message || 'Logout fehlgeschlagen.', 'error');
    }
  });

  refreshStatus().catch((error) => {
    setFeedback(error.message || 'Admin Panel konnte nicht geladen werden.', 'error');
  });
})();
