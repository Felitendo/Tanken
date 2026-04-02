'use client';

import { useCallback, useEffect, useState } from 'react';
import { Fuel, KeyRound, LogOut, Mail, Radio, Save, Shield, Settings, UserPlus, Trash2, MapPin, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminConfig {
  apiKey: string;
  orsApiKey: string;
  fuelType: string;
  radiusKm: number;
  refreshIntervalMinutes: number;
  sessionSecret: string;
  thresholds: { goodBelowAvgCents: number; okayBelowAvgCents: number };
  oidc: {
    issuerUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    usernameClaim: string;
    pictureClaim: string;
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

interface SchedulerStatus {
  running: boolean;
  scanning: boolean;
  scanProgress: string | null;
  errors: string[];
  grid: {
    scanning: boolean;
    progress: string | null;
    lastFullScanAt: string | null;
    totalStationsCached: number;
    cycleCount: number;
  };
  cache: {
    gridCells: number;
    totalStations: number;
    oldestScan: string | null;
    newestScan: string | null;
  };
  timing: {
    scanStartedAt: string | null;
    estimatedEndAt: string | null;
    lastCycleDurationSec: number | null;
    avgCallDurationSec: number | null;
  };
  log: Array<{ time: string; message: string; type: 'info' | 'success' | 'error' | 'warn' }>;
  currentPoint: { lat: number; lng: number; country: string } | null;
}

type FeedbackType = 'success' | 'error' | 'info';

const defaultConfig: AdminConfig = {
  apiKey: '',
  orsApiKey: '',
  fuelType: 'diesel',
  radiusKm: 10,
  refreshIntervalMinutes: 60,
  sessionSecret: '',
  thresholds: { goodBelowAvgCents: 3, okayBelowAvgCents: 1 },
  oidc: { issuerUrl: '', clientId: '', clientSecret: '', scope: 'openid profile email', usernameClaim: 'preferred_username', pictureClaim: 'picture', name: '' },
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



function ScannerConsole() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api<SchedulerStatus>('/api/admin/scheduler');
        if (!cancelled) setStatus(data);
      } catch { /* ignore */ }
    }
    load();
    const interval = setInterval(load, 3_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const handleAction = async (action: string) => {
    try {
      if (action === 'clearCache') setClearing(true);
      const result = await api<{ status: SchedulerStatus }>('/api/admin/scheduler', {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      setStatus(result.status);
    } catch { /* ignore */ } finally {
      if (action === 'clearCache') setClearing(false);
    }
  };

  const fmtTime = (iso: string) => {
    try { return new Date(iso).toLocaleString('de-DE'); } catch { return iso; }
  };

  const fmtRelative = (iso: string) => {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      if (diff < 0) return 'gleich';
      if (diff < 60_000) return 'gerade eben';
      if (diff < 3_600_000) return `vor ${Math.floor(diff / 60_000)} Min.`;
      if (diff < 86_400_000) return `vor ${Math.floor(diff / 3_600_000)} Std.`;
      return fmtTime(iso);
    } catch { return iso; }
  };

  const fmtDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    if (h > 0) return `${h} Std. ${m} Min.`;
    if (m > 0) return `${m} Min. ${s} Sek.`;
    return `${s} Sek.`;
  };

  const fmtEta = (iso: string) => {
    try {
      const diff = new Date(iso).getTime() - Date.now();
      if (diff <= 0) return 'gleich fertig';
      return `noch ~${fmtDuration(diff / 1000)}`;
    } catch { return iso; }
  };

  if (!status) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <div className="animate-pulse">Scanner-Status wird geladen...</div>
        </CardContent>
      </Card>
    );
  }

  const isScanning = status.scanning || status.grid.scanning;
  const logTypeColors: Record<string, string> = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warn: 'text-amber-600 dark:text-amber-400',
  };
  const logTypeDots: Record<string, string> = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warn: 'bg-amber-500',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.running ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Scanner</CardTitle>
              <CardDescription>
                {status.running
                  ? isScanning
                    ? 'Scannt gerade Tankstellen...'
                    : 'Aktiv — wartet auf nächsten Zyklus'
                  : 'Gestoppt'}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={() => handleAction(status.running ? 'stop' : 'start')}>
              {status.running ? 'Stoppen' : 'Starten'}
            </Button>
            {status.running && (
              <Button variant="outline" size="sm" onClick={() => handleAction('restart')}>
                Neustart
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground">Grid-Zellen</p>
            <p className="text-lg font-bold">{status.cache.gridCells}</p>
          </div>
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground">Tankstellen gesamt</p>
            <p className="text-lg font-bold">{status.cache.totalStations.toLocaleString('de-DE')}</p>
          </div>
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground">Scan-Zyklen</p>
            <p className="text-lg font-bold">{status.grid.cycleCount}</p>
          </div>
          <div className="border rounded-lg p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground">Letzter Scan</p>
            <p className="text-sm font-medium">
              {status.cache.newestScan ? fmtRelative(status.cache.newestScan) : '—'}
            </p>
          </div>
        </div>

        {/* Grid scan progress with ETA */}
        {isScanning && status.grid.progress && (
          <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium">
                  {status.grid.progress.startsWith('DE') ? '🇩🇪' : '🇦🇹'} Grid-Scan: {status.grid.progress}
                </span>
              </div>
              {status.timing.estimatedEndAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {fmtEta(status.timing.estimatedEndAt)}
                </span>
              )}
            </div>
            {(() => {
              const match = status.grid.progress.match(/(\d+)\/(\d+)/);
              const current = match ? parseInt(match[1]) : 0;
              const total = match ? parseInt(match[2]) : 0;
              const pct = total > 0 ? (current / total) * 100 : 0;
              return (
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              );
            })()}
            {/* Current point */}
            {status.currentPoint && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Aktuell: {status.currentPoint.lat.toFixed(2)}°N, {status.currentPoint.lng.toFixed(2)}°E
              </div>
            )}
          </div>
        )}

        {/* Timing stats */}
        {(status.timing.lastCycleDurationSec || status.timing.scanStartedAt || status.timing.avgCallDurationSec) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {status.timing.lastCycleDurationSec && (
              <div className="border rounded-lg p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Letzter Zyklus</p>
                <p className="text-sm font-bold">{fmtDuration(status.timing.lastCycleDurationSec)}</p>
              </div>
            )}
            {status.timing.scanStartedAt && (
              <div className="border rounded-lg p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Scan läuft seit</p>
                <p className="text-sm font-bold">{fmtRelative(status.timing.scanStartedAt)}</p>
              </div>
            )}
            {status.timing.avgCallDurationSec && (
              <div className="border rounded-lg p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">Ø API-Call</p>
                <p className="text-sm font-bold">{status.timing.avgCallDurationSec} Sek.</p>
              </div>
            )}
          </div>
        )}

        {/* Cache age info */}
        {status.grid.lastFullScanAt && (
          <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Letzter vollständiger Zyklus</p>
                <p className="text-sm font-medium">
                  {fmtTime(status.grid.lastFullScanAt)} — {status.grid.totalStationsCached.toLocaleString('de-DE')} Stationen
                </p>
              </div>
              {status.cache.oldestScan && status.cache.newestScan && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Cache-Alter</p>
                  <p className="text-xs font-medium">
                    {fmtRelative(status.cache.oldestScan)} — {fmtRelative(status.cache.newestScan)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Log */}
        {status.log && status.log.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowLog(!showLog)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors"
            >
              <Activity className="h-3 w-3" />
              Scan-Log ({status.log.length})
              <span className="text-[10px] ml-1">{showLog ? '▲' : '▼'}</span>
            </button>
            {showLog && (
              <div className="border rounded-lg bg-muted/20 max-h-60 overflow-y-auto">
                <div className="divide-y divide-border/50">
                  {status.log.slice().reverse().map((entry, i) => (
                    <div key={i} className="px-3 py-1.5 flex items-start gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${logTypeDots[entry.type] || 'bg-gray-400'}`} />
                      <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0 mt-0.5">
                        {new Date(entry.time).toLocaleTimeString('de-DE')}
                      </span>
                      <span className={`text-xs break-all ${logTypeColors[entry.type] || ''}`}>
                        {entry.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        {status.errors.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">Fehler ({status.errors.length})</p>
            <div className="border border-destructive/20 rounded-lg bg-destructive/5 max-h-40 overflow-y-auto">
              <div className="divide-y divide-destructive/10">
                {status.errors.slice().reverse().map((err, i) => (
                  <p key={i} className="px-3 py-1.5 text-xs text-muted-foreground font-mono break-all">{err}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Cache Button */}
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Cache leeren</p>
            <p className="text-xs text-muted-foreground">Löscht alle gecachten Stationen aus Speicher und Datenbank.</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => { if (confirm('Cache wirklich leeren? Alle gecachten Tankstellen werden gelöscht.')) handleAction('clearCache'); }}
            disabled={clearing}
          >
            <Trash2 className="h-4 w-4" />
            {clearing ? 'Löscht...' : 'Cache leeren'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfigFields({
  config,
  onChange,
  onTestApiKey,
  testingApiKey,
  onTestEmail,
  testingEmail,
  testEmailRecipient,
  onTestEmailRecipientChange,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  onTestApiKey?: () => void;
  testingApiKey?: boolean;
  onTestEmail?: () => void;
  testingEmail?: boolean;
  testEmailRecipient?: string;
  onTestEmailRecipientChange?: (value: string) => void;
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
            <Label htmlFor="apiKey">Tankerkönig API Key</Label>
            <Input
              id="apiKey"
              value={config.apiKey}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              Kostenlos registrieren unter <a href="https://creativecommons.tankerkoenig.de" target="_blank" rel="noopener noreferrer" className="underline">creativecommons.tankerkoenig.de</a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="orsApiKey">OpenRouteService API Key <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="orsApiKey"
              value={config.orsApiKey}
              onChange={(e) => onChange({ orsApiKey: e.target.value })}
              placeholder="Für Fahrtdistanzen statt Luftlinie"
            />
            <p className="text-xs text-muted-foreground">
              Kostenlos registrieren unter <a href="https://openrouteservice.org/dev/#/signup" target="_blank" rel="noopener noreferrer" className="underline">openrouteservice.org</a> — zeigt echte Fahrtdistanzen statt Luftlinie
            </p>
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
          <div className="space-y-2 sm:col-span-2">
            <Label>Callback URL</Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/oidc/callback`}
                className="font-mono text-xs bg-muted"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/auth/oidc/callback`)}
              >
                Kopieren
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Diese URL als Redirect/Callback URI beim OIDC-Anbieter eintragen.</p>
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
          <div className="space-y-2">
            <Label htmlFor="oidcPictureClaim">Picture Claim</Label>
            <Input
              id="oidcPictureClaim"
              value={config.oidc.pictureClaim}
              onChange={(e) => onChange({ oidc: { ...config.oidc, pictureClaim: e.target.value } })}
              placeholder="picture"
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
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="testEmailRecipient">Empfänger für Test-E-Mail</Label>
              <Input
                id="testEmailRecipient"
                type="email"
                value={testEmailRecipient ?? ''}
                onChange={(e) => onTestEmailRecipientChange?.(e.target.value)}
                placeholder="deine@email.com"
              />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onTestEmail} disabled={testingEmail || !config.smtp.host || !config.smtp.from || !testEmailRecipient}>
              <Mail className="h-4 w-4" />
              {testingEmail ? 'Sende...' : 'Test-E-Mail senden'}
            </Button>
          </div>
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
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
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
        setConfig({ ...defaultConfig, ...data.config });
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
        setConfig({ ...defaultConfig, ...result.config });
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
      await api('/api/admin/smtp-test', { method: 'POST', body: JSON.stringify({ to: testEmailRecipient }) });
      showFeedback(`Test-E-Mail an ${testEmailRecipient} gesendet.`, 'success');
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
      showFeedback(`API-Key gültig. ${result.stations ?? 0} Stationen gefunden.`, 'success');
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
                  {submitting ? 'Speichert...' : 'Setup abschließen'}
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
                <ConfigFields config={config} onChange={handleConfigChange} onTestApiKey={handleTestApiKey} testingApiKey={testingApiKey} onTestEmail={handleTestEmail} testingEmail={testingEmail} testEmailRecipient={testEmailRecipient} onTestEmailRecipientChange={setTestEmailRecipient} />
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

        {/* Scanner Console — only visible when logged in */}
        {panel === 'dashboard' && <ScannerConsole />}
      </div>
    </div>
  );
}
