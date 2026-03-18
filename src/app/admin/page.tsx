'use client';

import { useCallback, useEffect, useState } from 'react';
import { Fuel, KeyRound, LogOut, Mail, Save, Shield, Settings, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminConfig {
  apiKey: string;
  fuelType: string;
  radiusKm: number;
  refreshIntervalMinutes: number;
  sessionSecret: string;
  thresholds: { goodBelowAvgCents: number; okayBelowAvgCents: number };
  oidc: {
    issuerUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string;
    usernameClaim: string;
    name: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  };
}

interface AdminStatus {
  bootstrapped: boolean;
  authenticated: boolean;
  user?: { username?: string; displayName?: string };
  config?: AdminConfig;
}

type FeedbackType = 'success' | 'error' | 'info';

const defaultConfig: AdminConfig = {
  apiKey: '',
  fuelType: 'diesel',
  radiusKm: 10,
  refreshIntervalMinutes: 60,
  sessionSecret: '',
  thresholds: { goodBelowAvgCents: 3, okayBelowAvgCents: 1 },
  oidc: { issuerUrl: '', clientId: '', clientSecret: '', redirectUri: '', scope: 'openid profile email', usernameClaim: 'preferred_username', name: '' },
  smtp: { host: '', port: 587, secure: false, user: '', pass: '', from: '' },
};

async function api<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error((payload as { error?: string })?.error || `HTTP ${response.status}`);
  return payload as T;
}

function ConfigFields({
  config,
  onChange,
  onTestApiKey,
  testingApiKey,
  onTestEmail,
  testingEmail,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  onTestApiKey?: () => void;
  testingApiKey?: boolean;
  onTestEmail?: () => void;
  testingEmail?: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* App Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Settings className="h-4 w-4" />
          App-Konfiguration
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Tankerkoenig API Key</Label>
            <Input
              id="apiKey"
              value={config.apiKey}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionSecret">Session Secret</Label>
            <Input
              id="sessionSecret"
              value={config.sessionSecret}
              onChange={(e) => onChange({ sessionSecret: e.target.value })}
              placeholder="Wird automatisch generiert"
            />
          </div>
          <div className="space-y-2">
            <Label>Standard-Kraftstoff</Label>
            <Select
              value={config.fuelType}
              onValueChange={(v) => onChange({ fuelType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="e5">Super E5</SelectItem>
                <SelectItem value="e10">Super E10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="radiusKm">Standard-Radius (km)</Label>
            <Input
              id="radiusKm"
              type="number"
              min={1}
              max={25}
              value={config.radiusKm}
              onChange={(e) => onChange({ radiusKm: Number(e.target.value) || 10 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Aktualisierungsintervall (Min.)</Label>
            <Input
              id="refreshInterval"
              type="number"
              min={1}
              value={config.refreshIntervalMinutes}
              onChange={(e) => onChange({ refreshIntervalMinutes: Number(e.target.value) || 60 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thresholdGood">Threshold gut unter Ø (ct)</Label>
            <Input
              id="thresholdGood"
              type="number"
              value={config.thresholds.goodBelowAvgCents}
              onChange={(e) =>
                onChange({
                  thresholds: { ...config.thresholds, goodBelowAvgCents: Number(e.target.value) || 3 },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thresholdOkay">Threshold okay unter Ø (ct)</Label>
            <Input
              id="thresholdOkay"
              type="number"
              value={config.thresholds.okayBelowAvgCents}
              onChange={(e) =>
                onChange({
                  thresholds: { ...config.thresholds, okayBelowAvgCents: Number(e.target.value) || 1 },
                })
              }
            />
          </div>
        </div>
        {onTestApiKey && (
          <Button type="button" variant="outline" size="sm" onClick={onTestApiKey} disabled={testingApiKey || !config.apiKey}>
            <KeyRound className="h-4 w-4" />
            {testingApiKey ? 'Teste...' : 'API-Key testen'}
          </Button>
        )}
      </div>

      <Separator />

      {/* OIDC */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Shield className="h-4 w-4" />
          OIDC
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="oidcName">Anzeigename</Label>
            <Input
              id="oidcName"
              value={config.oidc.name}
              onChange={(e) => onChange({ oidc: { ...config.oidc, name: e.target.value } })}
              placeholder="z.B. Felo ID, Google, Authelia"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcIssuer">Issuer URL</Label>
            <Input
              id="oidcIssuer"
              type="url"
              value={config.oidc.issuerUrl}
              onChange={(e) => onChange({ oidc: { ...config.oidc, issuerUrl: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcClientId">Client ID</Label>
            <Input
              id="oidcClientId"
              value={config.oidc.clientId}
              onChange={(e) => onChange({ oidc: { ...config.oidc, clientId: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcClientSecret">Client Secret</Label>
            <Input
              id="oidcClientSecret"
              value={config.oidc.clientSecret}
              onChange={(e) => onChange({ oidc: { ...config.oidc, clientSecret: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcRedirect">Redirect URI</Label>
            <Input
              id="oidcRedirect"
              type="url"
              value={config.oidc.redirectUri}
              onChange={(e) => onChange({ oidc: { ...config.oidc, redirectUri: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcScope">Scope</Label>
            <Input
              id="oidcScope"
              value={config.oidc.scope}
              onChange={(e) => onChange({ oidc: { ...config.oidc, scope: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcUsernameClaim">Username Claim</Label>
            <Input
              id="oidcUsernameClaim"
              value={config.oidc.usernameClaim}
              onChange={(e) => onChange({ oidc: { ...config.oidc, usernameClaim: e.target.value } })}
              placeholder="preferred_username"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* SMTP */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Mail className="h-4 w-4" />
          SMTP (E-Mail-Benachrichtigungen)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              value={config.smtp.host}
              onChange={(e) => onChange({ smtp: { ...config.smtp, host: e.target.value } })}
              placeholder="smtp.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">Port</Label>
            <Input
              id="smtpPort"
              type="number"
              min={1}
              max={65535}
              value={config.smtp.port}
              onChange={(e) => onChange({ smtp: { ...config.smtp, port: Number(e.target.value) || 587 } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser">Benutzername</Label>
            <Input
              id="smtpUser"
              value={config.smtp.user}
              onChange={(e) => onChange({ smtp: { ...config.smtp, user: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPass">Passwort</Label>
            <Input
              id="smtpPass"
              type="password"
              value={config.smtp.pass}
              onChange={(e) => onChange({ smtp: { ...config.smtp, pass: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFrom">Absender-Adresse</Label>
            <Input
              id="smtpFrom"
              type="email"
              value={config.smtp.from}
              onChange={(e) => onChange({ smtp: { ...config.smtp, from: e.target.value } })}
              placeholder="tanken@example.com"
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.smtp.secure}
                onChange={(e) => onChange({ smtp: { ...config.smtp, secure: e.target.checked } })}
                className="rounded border-input"
              />
              <span className="text-sm font-medium">SSL/TLS</span>
            </label>
          </div>
        </div>
        {onTestEmail && (
          <Button type="button" variant="outline" size="sm" onClick={onTestEmail} disabled={testingEmail || !config.smtp.host || !config.smtp.from}>
            <Mail className="h-4 w-4" />
            {testingEmail ? 'Sende...' : 'Test-E-Mail senden'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingApiKey, setTestingApiKey] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: FeedbackType } | null>(null);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState<AdminConfig>(defaultConfig);

  const showFeedback = useCallback((message: string, type: FeedbackType) => {
    setFeedback({ message, type });
    if (type === 'success') setTimeout(() => setFeedback(null), 4000);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const data = await api<AdminStatus>('/api/admin/status');
      setStatus(data);
      if (data.config) {
        setConfig(data.config);
      }
    } catch (err) {
      showFeedback((err as Error).message || 'Admin Panel konnte nicht geladen werden.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleConfigChange = useCallback((patch: Partial<AdminConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await api('/api/admin/bootstrap', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), password, config }),
      });
      showFeedback('Setup gespeichert. Admin ist jetzt eingeloggt.', 'success');
      setUsername('');
      setPassword('');
      await refreshStatus();
    } catch (err) {
      showFeedback((err as Error).message || 'Setup fehlgeschlagen.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), password }),
      });
      showFeedback('Login erfolgreich.', 'success');
      setUsername('');
      setPassword('');
      await refreshStatus();
    } catch (err) {
      showFeedback((err as Error).message || 'Login fehlgeschlagen.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await api<{ config: AdminConfig }>('/api/admin/config', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      if (result.config) {
        setConfig(result.config);
      }
      showFeedback('Konfiguration gespeichert.', 'success');
    } catch (err) {
      showFeedback((err as Error).message || 'Speichern fehlgeschlagen.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setFeedback(null);
    try {
      await api('/api/admin/smtp-test', { method: 'POST', body: JSON.stringify({ to: config.smtp.from }) });
      showFeedback('Test-E-Mail gesendet.', 'success');
    } catch (err) {
      showFeedback((err as Error).message || 'Test-E-Mail fehlgeschlagen.', 'error');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleTestApiKey = async () => {
    setTestingApiKey(true);
    setFeedback(null);
    try {
      const result = await api<{ ok: boolean; stations?: number }>('/api/admin/apikey-test', {
        method: 'POST',
        body: JSON.stringify({ apiKey: config.apiKey }),
      });
      showFeedback(`API-Key gueltig. ${result.stations ?? 0} Stationen gefunden.`, 'success');
    } catch (err) {
      showFeedback((err as Error).message || 'API-Key Test fehlgeschlagen.', 'error');
    } finally {
      setTestingApiKey(false);
    }
  };

  const handleLogout = async () => {
    setFeedback(null);
    try {
      await api('/api/logout', { method: 'POST' });
      showFeedback('Logout erfolgreich.', 'success');
      await refreshStatus();
    } catch (err) {
      showFeedback((err as Error).message || 'Logout fehlgeschlagen.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    );
  }

  const panel = !status?.bootstrapped ? 'setup' : status.authenticated ? 'dashboard' : 'login';

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600">Tanken</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Lokalen Admin anlegen, App-Konfiguration speichern und OIDC ohne <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">.env</code> verwalten.
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <Alert variant={feedback.type === 'error' ? 'destructive' : feedback.type === 'success' ? 'success' : 'default'}>
            <AlertDescription className="font-medium">{feedback.message}</AlertDescription>
          </Alert>
        )}

        {/* Setup Panel */}
        {panel === 'setup' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Erstkonfiguration</CardTitle>
                  <CardDescription>
                    Lege den ersten lokalen Admin an und speichere die Startkonfiguration.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleBootstrap}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setup-username">Admin-Benutzername</Label>
                    <Input
                      id="setup-username"
                      autoComplete="username"
                      required
                      minLength={3}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setup-password">Admin-Passwort</Label>
                    <Input
                      id="setup-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <ConfigFields config={config} onChange={handleConfigChange} />
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" disabled={submitting}>
                  <Save className="h-4 w-4" />
                  {submitting ? 'Speichert...' : 'Setup abschliessen'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Login Panel */}
        {panel === 'login' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Admin Login</CardTitle>
                  <CardDescription>Login mit lokalem Admin-Account.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Benutzername</Label>
                  <Input
                    id="login-username"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Passwort</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" disabled={submitting}>
                  <KeyRound className="h-4 w-4" />
                  {submitting ? 'Einloggen...' : 'Einloggen'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Dashboard Panel */}
        {panel === 'dashboard' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Konfiguration</CardTitle>
                    <CardDescription>
                      Angemeldet als{' '}
                      <span className="font-medium text-foreground">
                        {status?.user?.username || status?.user?.displayName || 'Admin'}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSaveConfig}>
              <CardContent>
                <ConfigFields config={config} onChange={handleConfigChange} onTestApiKey={handleTestApiKey} testingApiKey={testingApiKey} onTestEmail={handleTestEmail} testingEmail={testingEmail} />
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" disabled={submitting}>
                  <Save className="h-4 w-4" />
                  {submitting ? 'Speichert...' : 'Konfiguration speichern'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
