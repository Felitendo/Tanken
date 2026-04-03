'use client';

import { useCallback, useEffect, useState } from 'react';
import { Fuel, KeyRound, LogOut, Mail, Radio, Save, Shield, Settings, UserPlus, Trash2, MapPin, Clock, Activity, ChevronDown, RotateCcw, Play, Square } from 'lucide-react';
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

interface CountryScanStatus {
  scanning: boolean;
  progress: string | null;
  currentPoint: { lat: number; lng: number } | null;
  stationsScanned: number;
  gridPoints: number;
  estimatedEndAt: string | null;
  lastCompletedAt: string | null;
  lastDurationSec: number | null;
  avgCallSec: number | null;
  errors: string[];
  log: Array<{ time: string; message: string; type: 'info' | 'success' | 'error' | 'warn' }>;
}

interface SchedulerStatus {
  running: boolean;
  cycleCount: number;
  scanStartedAt: string | null;
  lastCycleDurationSec: number | null;
  cache: {
    gridCells: number;
    totalStations: number;
    oldestScan: string | null;
    newestScan: string | null;
  };
  de: CountryScanStatus;
  at: CountryScanStatus;
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


// ─── Shared formatters ──────────────────────────────────────────────

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
    return `~${fmtDuration(diff / 1000)}`;
  } catch { return iso; }
};

// ─── Tiny reusable pieces ───────────────────────────────────────────

function StatCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function StatusDot({ active, className }: { active: boolean; className?: string }) {
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'} ${className ?? ''}`} />
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'destructive' }) {
  const colors = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    destructive: 'bg-destructive/10 text-destructive',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

const logTypeDots: Record<string, string> = {
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warn: 'bg-amber-500',
};
const logTypeText: Record<string, string> = {
  info: 'text-muted-foreground',
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-red-600 dark:text-red-400',
  warn: 'text-amber-600 dark:text-amber-400',
};

// ─── Country Scanner Card ───────────────────────────────────────────

function CountryScannerCard({ cs, flag, label, api: apiLabel }: {
  cs: CountryScanStatus;
  flag: string;
  label: string;
  api: string;
}) {
  const [showLog, setShowLog] = useState(false);

  const pct = (() => {
    if (!cs.progress) return 0;
    const m = cs.progress.match(/(\d+)\/(\d+)/);
    return m ? (parseInt(m[1]) / parseInt(m[2])) * 100 : 0;
  })();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{flag}</span>
            <div>
              <CardTitle className="text-base">{label}</CardTitle>
              <CardDescription className="text-xs">{apiLabel}</CardDescription>
            </div>
          </div>
          {cs.scanning ? (
            <Badge variant="success">Scannt {cs.progress}</Badge>
          ) : cs.lastCompletedAt ? (
            <Badge>{fmtRelative(cs.lastCompletedAt)}</Badge>
          ) : (
            <Badge variant="warning">Warte</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        {cs.scanning && cs.progress && (
          <div className="space-y-2">
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {cs.currentPoint && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {cs.currentPoint.lat.toFixed(2)}°N, {cs.currentPoint.lng.toFixed(2)}°E
                </span>
              )}
              {cs.estimatedEndAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {fmtEta(cs.estimatedEndAt)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCell label="Grid" value={cs.gridPoints ? cs.gridPoints.toLocaleString('de-DE') : '—'} />
          <StatCell label="Stationen" value={cs.stationsScanned ? cs.stationsScanned.toLocaleString('de-DE') : '—'} />
          <StatCell label="Dauer" value={cs.lastDurationSec ? fmtDuration(cs.lastDurationSec) : '—'} />
          <StatCell label="Ø Call" value={cs.avgCallSec ? `${cs.avgCallSec}s` : '—'} />
        </div>

        {/* Log toggle */}
        {cs.log.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowLog(!showLog)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Activity className="h-3 w-3" />
              Log ({cs.log.length})
              <ChevronDown className={`h-3 w-3 transition-transform ${showLog ? 'rotate-180' : ''}`} />
            </button>
            {showLog && (
              <div className="mt-2 rounded-lg border bg-muted/30 max-h-44 overflow-y-auto">
                {cs.log.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-1.5 border-b border-border/40 last:border-0">
                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${logTypeDots[entry.type] || 'bg-muted-foreground'}`} />
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0 pt-px">
                      {new Date(entry.time).toLocaleTimeString('de-DE')}
                    </span>
                    <span className={`text-xs break-all ${logTypeText[entry.type] || ''}`}>
                      {entry.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        {cs.errors.length > 0 && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 max-h-28 overflow-y-auto">
            <div className="px-3 py-1.5 border-b border-destructive/10">
              <p className="text-xs font-medium text-destructive">Fehler ({cs.errors.length})</p>
            </div>
            {cs.errors.slice().reverse().map((err, i) => (
              <p key={i} className="px-3 py-1 text-[11px] text-muted-foreground font-mono break-all border-b border-destructive/5 last:border-0">{err}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Scanner Console ────────────────────────────────────────────────

function ScannerConsole() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [clearing, setClearing] = useState(false);

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

  if (!status) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <div className="animate-pulse">Scanner-Status wird geladen...</div>
        </CardContent>
      </Card>
    );
  }

  const isScanning = status.de.scanning || status.at.scanning;

  return (
    <div className="space-y-4">
      {/* Scanner header card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${status.running ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                <Radio className={`h-4 w-4 ${status.running ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Scanner</CardTitle>
                  <StatusDot active={status.running} />
                </div>
                <CardDescription>
                  {status.running
                    ? isScanning ? 'Scannt DE + AT parallel' : 'Wartet auf nächsten Zyklus'
                    : 'Gestoppt'}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant={status.running ? 'outline' : 'default'}
                size="sm"
                onClick={() => handleAction(status.running ? 'stop' : 'start')}
              >
                {status.running ? <><Square className="h-3.5 w-3.5" /> Stoppen</> : <><Play className="h-3.5 w-3.5" /> Starten</>}
              </Button>
              {status.running && (
                <Button variant="outline" size="sm" onClick={() => handleAction('restart')}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Global stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <StatCell label="Grid-Zellen" value={status.cache.gridCells.toLocaleString('de-DE')} />
            <StatCell label="Tankstellen" value={status.cache.totalStations.toLocaleString('de-DE')} sub="eindeutig" />
            <StatCell label="Zyklen" value={String(status.cycleCount)} />
            <StatCell label="Letzter Zyklus" value={status.lastCycleDurationSec ? fmtDuration(status.lastCycleDurationSec) : '—'} />
          </div>

          <Separator />

          {/* Cache info + clear */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {status.cache.oldestScan && status.cache.newestScan
                ? `Cache: ${fmtRelative(status.cache.oldestScan)} — ${fmtRelative(status.cache.newestScan)}`
                : 'Cache leer'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => { if (confirm('Cache wirklich leeren? Alle gecachten Tankstellen werden gelöscht.')) handleAction('clearCache'); }}
              disabled={clearing}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {clearing ? 'Löscht...' : 'Cache leeren'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Per-country cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CountryScannerCard cs={status.de} flag="🇩🇪" label="Deutschland" api="Tankerkönig (6s Delay)" />
        <CountryScannerCard cs={status.at} flag="🇦🇹" label="Österreich" api="E-Control (5x parallel)" />
      </div>
    </div>
  );
}

// ─── Section wrapper ────────────────────────────────────────────────

function ConfigSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Config Fields ──────────────────────────────────────────────────

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
    <div className="space-y-8">
      {/* App Configuration */}
      <ConfigSection icon={Settings} title="App-Konfiguration">
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
              Kostenlos unter <a href="https://creativecommons.tankerkoenig.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">creativecommons.tankerkoenig.de</a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="orsApiKey">OpenRouteService Key <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="orsApiKey"
              value={config.orsApiKey}
              onChange={(e) => onChange({ orsApiKey: e.target.value })}
              placeholder="Für Fahrtdistanzen statt Luftlinie"
            />
            <p className="text-xs text-muted-foreground">
              Unter <a href="https://openrouteservice.org/dev/#/signup" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">openrouteservice.org</a> registrieren
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
            <Label>Kraftstoff</Label>
            <Select value={config.fuelType} onValueChange={(v) => onChange({ fuelType: v })}>
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
            <Label htmlFor="radiusKm">Radius (km)</Label>
            <Input id="radiusKm" type="number" min={1} max={25} value={config.radiusKm} onChange={(e) => onChange({ radiusKm: Number(e.target.value) || 10 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Intervall (Min.)</Label>
            <Input id="refreshInterval" type="number" min={1} value={config.refreshIntervalMinutes} onChange={(e) => onChange({ refreshIntervalMinutes: Number(e.target.value) || 60 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thresholdGood">Gut unter Ø (ct)</Label>
            <Input id="thresholdGood" type="number" value={config.thresholds.goodBelowAvgCents} onChange={(e) => onChange({ thresholds: { ...config.thresholds, goodBelowAvgCents: Number(e.target.value) || 3 } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thresholdOkay">Okay unter Ø (ct)</Label>
            <Input id="thresholdOkay" type="number" value={config.thresholds.okayBelowAvgCents} onChange={(e) => onChange({ thresholds: { ...config.thresholds, okayBelowAvgCents: Number(e.target.value) || 1 } })} />
          </div>
        </div>
        {onTestApiKey && (
          <Button type="button" variant="outline" size="sm" onClick={onTestApiKey} disabled={testingApiKey || !config.apiKey}>
            <KeyRound className="h-3.5 w-3.5" />
            {testingApiKey ? 'Teste...' : 'API-Key testen'}
          </Button>
        )}
      </ConfigSection>

      <Separator />

      {/* OIDC */}
      <ConfigSection icon={Shield} title="OIDC-Authentifizierung">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="oidcName">Anzeigename</Label>
            <Input id="oidcName" value={config.oidc.name} onChange={(e) => onChange({ oidc: { ...config.oidc, name: e.target.value } })} placeholder="z.B. Felo ID, Google, Authelia" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcIssuer">Issuer URL</Label>
            <Input id="oidcIssuer" type="url" value={config.oidc.issuerUrl} onChange={(e) => onChange({ oidc: { ...config.oidc, issuerUrl: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcClientId">Client ID</Label>
            <Input id="oidcClientId" value={config.oidc.clientId} onChange={(e) => onChange({ oidc: { ...config.oidc, clientId: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcClientSecret">Client Secret</Label>
            <Input id="oidcClientSecret" value={config.oidc.clientSecret} onChange={(e) => onChange({ oidc: { ...config.oidc, clientSecret: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label>Callback URL</Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/oidc/callback`}
                className="font-mono text-xs bg-muted"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/auth/oidc/callback`)}>
                Kopieren
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Als Redirect URI beim OIDC-Anbieter eintragen.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcScope">Scope</Label>
            <Input id="oidcScope" value={config.oidc.scope} onChange={(e) => onChange({ oidc: { ...config.oidc, scope: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcUsernameClaim">Username Claim</Label>
            <Input id="oidcUsernameClaim" value={config.oidc.usernameClaim} onChange={(e) => onChange({ oidc: { ...config.oidc, usernameClaim: e.target.value } })} placeholder="preferred_username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oidcPictureClaim">Picture Claim</Label>
            <Input id="oidcPictureClaim" value={config.oidc.pictureClaim} onChange={(e) => onChange({ oidc: { ...config.oidc, pictureClaim: e.target.value } })} placeholder="picture" />
          </div>
        </div>
      </ConfigSection>

      <Separator />

      {/* SMTP */}
      <ConfigSection icon={Mail} title="SMTP (E-Mail)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">Host</Label>
            <Input id="smtpHost" value={config.smtp.host} onChange={(e) => onChange({ smtp: { ...config.smtp, host: e.target.value } })} placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">Port</Label>
            <Input id="smtpPort" type="number" min={1} max={65535} value={config.smtp.port} onChange={(e) => onChange({ smtp: { ...config.smtp, port: Number(e.target.value) || 587 } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser">Benutzername</Label>
            <Input id="smtpUser" value={config.smtp.user} onChange={(e) => onChange({ smtp: { ...config.smtp, user: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPass">Passwort</Label>
            <Input id="smtpPass" type="password" value={config.smtp.pass} onChange={(e) => onChange({ smtp: { ...config.smtp, pass: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFrom">Absender</Label>
            <Input id="smtpFrom" type="email" value={config.smtp.from} onChange={(e) => onChange({ smtp: { ...config.smtp, from: e.target.value } })} placeholder="tanken@example.com" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer h-9 px-1">
              <input
                type="checkbox"
                checked={config.smtp.secure}
                onChange={(e) => onChange({ smtp: { ...config.smtp, secure: e.target.checked } })}
                className="rounded border-input h-4 w-4"
              />
              <span className="text-sm font-medium">SSL/TLS</span>
            </label>
          </div>
        </div>
        {onTestEmail && (
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="testEmailRecipient">Test-Empfänger</Label>
              <Input id="testEmailRecipient" type="email" value={testEmailRecipient ?? ''} onChange={(e) => onTestEmailRecipientChange?.(e.target.value)} placeholder="deine@email.com" />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onTestEmail} disabled={testingEmail || !config.smtp.host || !config.smtp.from || !testEmailRecipient}>
              <Mail className="h-3.5 w-3.5" />
              {testingEmail ? 'Sende...' : 'Testen'}
            </Button>
          </div>
        )}
      </ConfigSection>
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────────────

export default function AdminPage() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testingApiKey, setTestingApiKey] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: FeedbackType } | null>(null);

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
        <div className="animate-pulse text-muted-foreground text-sm">Laden...</div>
      </div>
    );
  }

  const panel = !status?.bootstrapped ? 'setup' : status.authenticated ? 'dashboard' : 'login';

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Tanken</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">
            Konfiguration, Scanner und Authentifizierung verwalten.
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <Alert variant={feedback.type === 'error' ? 'destructive' : feedback.type === 'success' ? 'success' : 'default'}>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}

        {/* Setup */}
        {panel === 'setup' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Erstkonfiguration</CardTitle>
                  <CardDescription>Admin anlegen und Startkonfiguration speichern.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleBootstrap}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setup-username">Benutzername</Label>
                    <Input id="setup-username" autoComplete="username" required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setup-password">Passwort</Label>
                    <Input id="setup-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <Separator />
                <ConfigFields config={config} onChange={handleConfigChange} />
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button type="submit" disabled={submitting}>
                  <Save className="h-4 w-4" />
                  {submitting ? 'Speichert...' : 'Setup abschließen'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Login */}
        {panel === 'login' && (
          <Card className="max-w-sm mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Admin Login</CardTitle>
              <CardDescription>Mit lokalem Account anmelden.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Benutzername</Label>
                  <Input id="login-username" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Passwort</Label>
                  <Input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Einloggen...' : 'Einloggen'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Dashboard */}
        {panel === 'dashboard' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Settings className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Konfiguration</CardTitle>
                    <CardDescription>
                      Angemeldet als <span className="font-medium text-foreground">{status?.user?.username || status?.user?.displayName || 'Admin'}</span>
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSaveConfig}>
              <CardContent>
                <ConfigFields config={config} onChange={handleConfigChange} onTestApiKey={handleTestApiKey} testingApiKey={testingApiKey} onTestEmail={handleTestEmail} testingEmail={testingEmail} testEmailRecipient={testEmailRecipient} onTestEmailRecipientChange={setTestEmailRecipient} />
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button type="submit" disabled={submitting}>
                  <Save className="h-4 w-4" />
                  {submitting ? 'Speichert...' : 'Speichern'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Scanner */}
        {panel === 'dashboard' && <ScannerConsole />}
      </div>
    </div>
  );
}
