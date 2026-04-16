'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Fuel, KeyRound, LogOut, Mail, Radio, Save, Shield, Settings,
  UserPlus, Trash2, MapPin, Clock, Activity, ChevronDown, ChevronRight,
  RotateCcw, Play, Square, Zap, Download, Check, ArrowRight, ArrowLeft,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ─── Types ─────────────────────────────────────────────────────────

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
  mode: 'price-dump' | 'discovery' | null;
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

interface ImportStatus {
  phase: 'idle' | 'download' | 'decompress' | 'extract' | 'seed' | 'prices' | 'done' | 'error';
  percent: number;
  detail: string;
  stationsImported: number;
  pricesImported: number;
  error: string | null;
}

interface SchedulerStatus {
  running: boolean;
  cycleCount: number;
  scanStartedAt: string | null;
  lastCycleDurationSec: number | null;
  nextCycleAt: string | null;
  cache: {
    gridCells: number;
    totalStations: number;
    oldestScan: string | null;
    newestScan: string | null;
  };
  de: CountryScanStatus;
  at: CountryScanStatus;
  import: ImportStatus;
}

type FeedbackType = 'success' | 'error' | 'info';
type SidebarSection = 'config' | 'oidc' | 'smtp' | 'scanner';

const SECTIONS: { id: SidebarSection; label: string; icon: typeof Settings; description: string }[] = [
  { id: 'config', label: 'Konfiguration', icon: Settings, description: 'API-Keys, Kraftstoff und Intervalle' },
  { id: 'oidc', label: 'Authentifizierung', icon: Shield, description: 'OIDC Single Sign-On' },
  { id: 'smtp', label: 'E-Mail', icon: Mail, description: 'SMTP-Server für Benachrichtigungen' },
  { id: 'scanner', label: 'Scanner', icon: Radio, description: 'Tankstellen-Scanner steuern' },
];

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

// ─── API helper ────────────────────────────────────────────────────

async function api<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error((payload as { error?: string })?.error || `HTTP ${response.status}`);
  return payload as T;
}

// ─── Formatters ────────────────────────────────────────────────────

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

// ─── Micro-components ──────────────────────────────────────────────

function StatCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${active ? 'bg-emerald-500 admin-status-pulse' : 'bg-muted-foreground/30'}`} />
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

function Flag({ country, className }: { country: 'de' | 'at'; className?: string }) {
  if (country === 'de') {
    return (
      <svg viewBox="0 0 5 3" className={className} aria-label="Deutschland">
        <rect width="5" height="1" y="0" fill="#000" />
        <rect width="5" height="1" y="1" fill="#D00" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 5 3" className={className} aria-label="Österreich">
      <rect width="5" height="1" y="0" fill="#ED2939" />
      <rect width="5" height="1" y="1" fill="#FFF" />
      <rect width="5" height="1" y="2" fill="#ED2939" />
    </svg>
  );
}

function IconBox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`admin-icon-box ${className}`}>
      {children}
    </div>
  );
}

// ─── Feedback Toast ────────────────────────────────────────────────

function FeedbackToast({ message, type, onDismiss }: { message: string; type: FeedbackType; onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        setLeaving(true);
        setTimeout(onDismiss, 300);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [type, onDismiss]);

  const bgColor = type === 'success'
    ? 'bg-emerald-500 text-white'
    : type === 'error'
      ? 'bg-red-500 text-white'
      : 'bg-card text-card-foreground border border-border';

  const icon = type === 'success'
    ? <Check className="h-4 w-4" />
    : type === 'error'
      ? <span className="text-sm">!</span>
      : null;

  return (
    <div className={`admin-toast ${leaving ? 'admin-toast--leaving' : ''}`}>
      <button
        type="button"
        onClick={() => { setLeaving(true); setTimeout(onDismiss, 300); }}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg ${bgColor} text-sm font-medium cursor-pointer`}
      >
        {icon}
        {message}
      </button>
    </div>
  );
}

// ─── Settings Group (iOS inset grouped) ────────────────────────────

function SettingsGroup({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      {title && <p className="admin-section-header">{title}</p>}
      <div className="admin-settings-group">{children}</div>
    </div>
  );
}

function SettingsRow({ label, hint, children, inline }: { label?: string; hint?: React.ReactNode; children: React.ReactNode; inline?: boolean }) {
  return (
    <div className={`admin-settings-row ${inline ? 'admin-settings-row--inline' : ''}`}>
      {label && (
        <div className={inline ? 'admin-row-label' : ''}>
          <Label className="text-sm">{label}</Label>
          {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
        </div>
      )}
      <div className={inline ? 'admin-row-control' : 'w-full'}>{children}</div>
    </div>
  );
}

// ─── Log type styles ───────────────────────────────────────────────

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

// ─── Country Scanner Card ──────────────────────────────────────────

function CountryScannerCard({ cs, flag, label, api: apiLabel }: {
  cs: CountryScanStatus;
  flag: React.ReactNode;
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
    <div className="admin-settings-group p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center w-8 shrink-0">{flag}</span>
          <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-[11px] text-muted-foreground">{apiLabel}</p>
          </div>
        </div>
        {cs.scanning ? (
          <Badge variant="success">
            {cs.mode === 'discovery' ? `Grid-Discovery ${cs.progress}` : `Preis-Update ${cs.progress}`}
          </Badge>
        ) : cs.lastCompletedAt ? (
          <Badge>{fmtRelative(cs.lastCompletedAt)}</Badge>
        ) : (
          <Badge variant="warning">Warte</Badge>
        )}
      </div>

      {/* Progress bar */}
      {cs.scanning && cs.progress && (
        <div className="space-y-2">
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full admin-progress-bar ${cs.scanning ? 'admin-progress-bar--active' : 'bg-primary'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
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
        <StatCell label={cs.mode === 'price-dump' ? 'Batches' : 'Grid'} value={cs.gridPoints ? cs.gridPoints.toLocaleString('de-DE') : '—'} />
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
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showLog ? 'rotate-180' : ''}`} />
          </button>
          <div className={`admin-log-expand ${showLog ? 'admin-log-expand--open' : ''}`}>
            <div>
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
            </div>
          </div>
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
    </div>
  );
}

// ─── Scanner Console ───────────────────────────────────────────────

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
      <div className="admin-settings-group p-12 text-center text-muted-foreground">
        <div className="animate-pulse text-sm">Scanner-Status wird geladen...</div>
      </div>
    );
  }

  const isScanning = status.de.scanning || status.at.scanning;

  return (
    <div className="space-y-5 admin-stagger">
      {/* Scanner header */}
      <div className="admin-settings-group p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <IconBox className={status.running ? 'bg-emerald-500/10' : 'bg-muted'}>
              <Radio className={`h-4 w-4 ${status.running ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
            </IconBox>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">Scanner</p>
                <StatusDot active={status.running} />
              </div>
              <p className="text-xs text-muted-foreground">
                {status.running
                  ? isScanning ? 'Scannt DE + AT parallel' : 'Wartet auf nächsten Zyklus'
                  : 'Gestoppt'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className={`admin-btn ${status.running ? 'admin-btn-danger' : 'admin-btn-success'}`}
              onClick={() => handleAction(status.running ? 'stop' : 'start')}
            >
              {status.running ? <><Square className="h-3.5 w-3.5" /> Stoppen</> : <><Play className="h-3.5 w-3.5" /> Starten</>}
            </Button>
            {status.running && (
              <>
                <Button variant="outline" size="sm" className="admin-btn" onClick={() => handleAction('restart')}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                {!isScanning && (
                  <Button variant="outline" size="sm" className="admin-btn admin-btn-primary" onClick={() => handleAction('triggerNow')}>
                    <Zap className="h-3.5 w-3.5" /> Jetzt scannen
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-5">
          <StatCell label="Grid-Zellen" value={status.cache.gridCells.toLocaleString('de-DE')} />
          <StatCell label="Tankstellen" value={status.cache.totalStations.toLocaleString('de-DE')} sub="eindeutig" />
          <StatCell label="Zyklen" value={String(status.cycleCount)} />
          <StatCell label="Letzter Zyklus" value={status.lastCycleDurationSec ? fmtDuration(status.lastCycleDurationSec) : '—'} sub={status.nextCycleAt ? `Nächster: ${new Date(status.nextCycleAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}` : undefined} />
        </div>

        <div className="h-px bg-border/60 mb-5" />

        {/* Dump Import */}
        <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">Tankerkönig-Dump <Flag country="de" className="inline h-3" /></p>
              <p className="text-[11px] text-muted-foreground">
                Stationsliste (~15.000) herunterladen und importieren
              </p>
            </div>
            {status.import.phase !== 'idle' && status.import.phase !== 'done' && status.import.phase !== 'error' ? (
              <Button
                size="sm"
                className="admin-btn admin-btn-danger"
                onClick={() => handleAction('abortImport')}
              >
                <Square className="h-3.5 w-3.5" />
                Abbrechen
              </Button>
            ) : (
              <Button
                size="sm"
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (confirm('Tankerkönig-Dump importieren?\n\nLädt history.dump.gz (~8 GB) herunter.\nBenötigt ~16 GB freien Speicher.\nDauer: je nach Verbindung 10–60 Min.'))
                    handleAction('importDump');
                }}
                disabled={status.import.phase !== 'idle' && status.import.phase !== 'done' && status.import.phase !== 'error'}
              >
                <Download className="h-3.5 w-3.5" />
                Import starten
              </Button>
            )}
          </div>

          {status.import.phase !== 'idle' && (
            <div className="space-y-1.5">
              {status.import.phase !== 'done' && status.import.phase !== 'error' && (
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full admin-progress-bar admin-progress-bar--active"
                    style={{ width: `${status.import.percent}%` }}
                  />
                </div>
              )}
              <p className={`text-xs ${
                status.import.phase === 'error' ? 'text-destructive' :
                status.import.phase === 'done' ? 'text-emerald-600 dark:text-emerald-400' :
                'text-muted-foreground'
              }`}>
                {status.import.detail}
              </p>
            </div>
          )}
        </div>

        {/* Cache info */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-[11px] text-muted-foreground">
            {status.cache.oldestScan && status.cache.newestScan
              ? `Cache: ${fmtRelative(status.cache.oldestScan)} — ${fmtRelative(status.cache.newestScan)}`
              : 'Cache leer'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="admin-btn admin-btn-danger text-xs"
            onClick={() => { if (confirm('Cache wirklich leeren? Alle gecachten Tankstellen werden gelöscht.')) handleAction('clearCache'); }}
            disabled={clearing}
          >
            <Trash2 className="h-3 w-3" />
            {clearing ? 'Löscht...' : 'Cache leeren'}
          </Button>
        </div>
      </div>

      {/* Per-country cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CountryScannerCard cs={status.de} flag={<Flag country="de" className="h-5 rounded-sm" />} label="Deutschland" api={status.de.scanning ? 'Tankerkönig prices.php (1s Delay)' : 'Tankerkönig prices.php + On-Demand list.php'} />
        <CountryScannerCard cs={status.at} flag={<Flag country="at" className="h-5 rounded-sm" />} label="Österreich" api="E-Control (5x parallel)" />
      </div>
    </div>
  );
}

// ─── Config Section Components ─────────────────────────────────────

function AppConfigSection({
  config,
  onChange,
  onTestApiKey,
  testingApiKey,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  onTestApiKey?: () => void;
  testingApiKey?: boolean;
}) {
  return (
    <div className="space-y-5 admin-stagger">
      <SettingsGroup title="API-Schlüssel">
        <SettingsRow label="Tankerkönig API Key" hint={<>Kostenlos unter <a href="https://creativecommons.tankerkoenig.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">tankerkoenig.de</a></>}>
          <div className="flex gap-2">
            <Input
              value={config.apiKey}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="font-mono text-xs"
            />
            {onTestApiKey && (
              <Button type="button" variant="outline" size="sm" className="admin-btn shrink-0" onClick={onTestApiKey} disabled={testingApiKey || !config.apiKey}>
                <KeyRound className="h-3.5 w-3.5" />
                {testingApiKey ? 'Teste...' : 'Testen'}
              </Button>
            )}
          </div>
        </SettingsRow>
        <SettingsRow label="OpenRouteService Key" hint={<>Optional — unter <a href="https://openrouteservice.org/dev/#/signup" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">openrouteservice.org</a> registrieren</>}>
          <Input
            value={config.orsApiKey}
            onChange={(e) => onChange({ orsApiKey: e.target.value })}
            placeholder="Für Fahrtdistanzen statt Luftlinie"
          />
        </SettingsRow>
        <SettingsRow label="Session Secret">
          <Input
            value={config.sessionSecret}
            onChange={(e) => onChange({ sessionSecret: e.target.value })}
            placeholder="Wird automatisch generiert"
            className="font-mono text-xs"
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Suche">
        <SettingsRow label="Kraftstoff">
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
        </SettingsRow>
        <SettingsRow label="Radius" inline>
          <div className="flex items-center gap-2">
            <Input type="number" min={1} max={25} value={config.radiusKm} onChange={(e) => onChange({ radiusKm: Number(e.target.value) || 10 })} className="w-20 text-right" />
            <span className="text-sm text-muted-foreground">km</span>
          </div>
        </SettingsRow>
        <SettingsRow label="Scan-Intervall" inline>
          <div className="flex items-center gap-2">
            <Input type="number" min={1} value={config.refreshIntervalMinutes} onChange={(e) => onChange({ refreshIntervalMinutes: Number(e.target.value) || 60 })} className="w-20 text-right" />
            <span className="text-sm text-muted-foreground">Min.</span>
          </div>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Schwellenwerte">
        <SettingsRow label="Gut unter Durchschnitt" inline>
          <div className="flex items-center gap-2">
            <Input type="number" value={config.thresholds.goodBelowAvgCents} onChange={(e) => onChange({ thresholds: { ...config.thresholds, goodBelowAvgCents: Number(e.target.value) || 3 } })} className="w-20 text-right" />
            <span className="text-sm text-muted-foreground">ct</span>
          </div>
        </SettingsRow>
        <SettingsRow label="Okay unter Durchschnitt" inline>
          <div className="flex items-center gap-2">
            <Input type="number" value={config.thresholds.okayBelowAvgCents} onChange={(e) => onChange({ thresholds: { ...config.thresholds, okayBelowAvgCents: Number(e.target.value) || 1 } })} className="w-20 text-right" />
            <span className="text-sm text-muted-foreground">ct</span>
          </div>
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

function OidcSection({ config, onChange }: { config: AdminConfig; onChange: (patch: Partial<AdminConfig>) => void }) {
  return (
    <div className="space-y-5 admin-stagger">
      <SettingsGroup title="Anbieter">
        <SettingsRow label="Anzeigename" hint="z.B. Google, Authelia, Keycloak">
          <Input value={config.oidc.name} onChange={(e) => onChange({ oidc: { ...config.oidc, name: e.target.value } })} placeholder="z.B. Felo ID, Google, Authelia" />
        </SettingsRow>
        <SettingsRow label="Issuer URL">
          <Input type="url" value={config.oidc.issuerUrl} onChange={(e) => onChange({ oidc: { ...config.oidc, issuerUrl: e.target.value } })} placeholder="https://auth.example.com" />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Zugangsdaten">
        <SettingsRow label="Client ID">
          <Input value={config.oidc.clientId} onChange={(e) => onChange({ oidc: { ...config.oidc, clientId: e.target.value } })} />
        </SettingsRow>
        <SettingsRow label="Client Secret">
          <Input value={config.oidc.clientSecret} onChange={(e) => onChange({ oidc: { ...config.oidc, clientSecret: e.target.value } })} />
        </SettingsRow>
        <SettingsRow label="Callback URL" hint="Als Redirect URI beim OIDC-Anbieter eintragen">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/oidc/callback`}
              className="font-mono text-xs bg-muted"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button type="button" variant="outline" size="sm" className="admin-btn shrink-0" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/auth/oidc/callback`)}>
              Kopieren
            </Button>
          </div>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Claims">
        <SettingsRow label="Scope">
          <Input value={config.oidc.scope} onChange={(e) => onChange({ oidc: { ...config.oidc, scope: e.target.value } })} />
        </SettingsRow>
        <SettingsRow label="Username Claim">
          <Input value={config.oidc.usernameClaim} onChange={(e) => onChange({ oidc: { ...config.oidc, usernameClaim: e.target.value } })} placeholder="preferred_username" />
        </SettingsRow>
        <SettingsRow label="Picture Claim">
          <Input value={config.oidc.pictureClaim} onChange={(e) => onChange({ oidc: { ...config.oidc, pictureClaim: e.target.value } })} placeholder="picture" />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

function SmtpSection({
  config,
  onChange,
  onTestEmail,
  testingEmail,
  testEmailRecipient,
  onTestEmailRecipientChange,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  onTestEmail?: () => void;
  testingEmail?: boolean;
  testEmailRecipient?: string;
  onTestEmailRecipientChange?: (value: string) => void;
}) {
  return (
    <div className="space-y-5 admin-stagger">
      <SettingsGroup title="Server">
        <SettingsRow label="Host">
          <Input value={config.smtp.host} onChange={(e) => onChange({ smtp: { ...config.smtp, host: e.target.value } })} placeholder="smtp.example.com" />
        </SettingsRow>
        <SettingsRow label="Port" inline>
          <Input type="number" min={1} max={65535} value={config.smtp.port} onChange={(e) => onChange({ smtp: { ...config.smtp, port: Number(e.target.value) || 587 } })} className="w-24 text-right" />
        </SettingsRow>
        <SettingsRow label="SSL/TLS" inline>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={config.smtp.secure}
              onChange={(e) => onChange({ smtp: { ...config.smtp, secure: e.target.checked } })}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ring transition-colors after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
          </label>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Zugangsdaten">
        <SettingsRow label="Benutzername">
          <Input value={config.smtp.user} onChange={(e) => onChange({ smtp: { ...config.smtp, user: e.target.value } })} />
        </SettingsRow>
        <SettingsRow label="Passwort">
          <Input type="password" value={config.smtp.pass} onChange={(e) => onChange({ smtp: { ...config.smtp, pass: e.target.value } })} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Absender">
        <SettingsRow label="Von-Adresse">
          <Input type="email" value={config.smtp.from} onChange={(e) => onChange({ smtp: { ...config.smtp, from: e.target.value } })} placeholder="tanken@example.com" />
        </SettingsRow>
      </SettingsGroup>

      {onTestEmail && (
        <SettingsGroup title="Test">
          <SettingsRow label="Test-E-Mail senden">
            <div className="flex items-center gap-2">
              <Input type="email" value={testEmailRecipient ?? ''} onChange={(e) => onTestEmailRecipientChange?.(e.target.value)} placeholder="deine@email.com" />
              <Button type="button" variant="outline" size="sm" className="admin-btn shrink-0" onClick={onTestEmail} disabled={testingEmail || !config.smtp.host || !config.smtp.from || !testEmailRecipient}>
                <Mail className="h-3.5 w-3.5" />
                {testingEmail ? 'Sende...' : 'Senden'}
              </Button>
            </div>
          </SettingsRow>
        </SettingsGroup>
      )}
    </div>
  );
}

// ─── Setup Wizard ──────────────────────────────────────────────────

function SetupPanel({
  config,
  onChange,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  submitting,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  username: string;
  password: string;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}) {
  const [step, setStep] = useState(0);
  const steps = ['Account', 'API & Suche', 'Erweitert'];

  return (
    <div className="admin-panel-enter max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className="flex items-center gap-2 group"
          >
            <div className={`admin-step-dot ${i === step ? 'admin-step-dot--active' : i < step ? 'admin-step-dot--done' : ''}`} />
            <span className={`text-xs font-medium transition-colors ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s}
            </span>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 mx-1" />}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        {/* Header */}
        <div className="text-center mb-8">
          <IconBox className="admin-icon-box--lg bg-primary/10 mx-auto mb-4">
            <UserPlus className="h-6 w-6 text-primary" />
          </IconBox>
          <h2 className="text-xl font-semibold tracking-tight">Erstkonfiguration</h2>
          <p className="text-sm text-muted-foreground mt-1">Admin anlegen und Tanken einrichten.</p>
        </div>

        {/* Step 0: Account */}
        <div className={step === 0 ? 'admin-section-enter' : 'hidden'}>
          <SettingsGroup title="Admin-Account">
            <SettingsRow label="Benutzername">
              <Input autoComplete="username" required minLength={3} value={username} onChange={(e) => onUsernameChange(e.target.value)} />
            </SettingsRow>
            <SettingsRow label="Passwort">
              <Input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => onPasswordChange(e.target.value)} />
            </SettingsRow>
          </SettingsGroup>
        </div>

        {/* Step 1: API & Search */}
        <div className={step === 1 ? 'admin-section-enter' : 'hidden'}>
          <AppConfigSection config={config} onChange={onChange} />
        </div>

        {/* Step 2: Advanced */}
        <div className={step === 2 ? 'admin-section-enter' : 'hidden'}>
          <div className="space-y-5">
            <OidcSection config={config} onChange={onChange} />
            <SmtpSection config={config} onChange={onChange} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            className={step === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Button>
          {step < steps.length - 1 ? (
            <Button
              type="button"
              size="sm"
              className="admin-btn admin-btn-primary"
              onClick={() => setStep(step + 1)}
            >
              Weiter <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
              <Save className="h-4 w-4" />
              {submitting ? 'Speichert...' : 'Setup abschließen'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Login Panel ───────────────────────────────────────────────────

function LoginPanel({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  submitting,
}: {
  username: string;
  password: string;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}) {
  return (
    <div className="admin-panel-enter flex items-center justify-center min-h-[70vh]">
      <div className="admin-glass-card w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <IconBox className="admin-icon-box--lg bg-primary/10 mx-auto mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </IconBox>
          <h2 className="text-xl font-semibold tracking-tight">Admin Login</h2>
          <p className="text-sm text-muted-foreground mt-1">Mit lokalem Account anmelden.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-username" className="text-sm">Benutzername</Label>
            <Input id="login-username" autoComplete="username" required value={username} onChange={(e) => onUsernameChange(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-sm">Passwort</Label>
            <Input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => onPasswordChange(e.target.value)} className="h-11" />
          </div>
          <Button type="submit" className="w-full h-11 admin-btn admin-btn-primary mt-2" disabled={submitting}>
            {submitting ? 'Einloggen...' : 'Einloggen'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Panel ───────────────────────────────────────────────

function DashboardPanel({
  config,
  onChange,
  onSubmit,
  submitting,
  onLogout,
  onTestApiKey,
  testingApiKey,
  onTestEmail,
  testingEmail,
  testEmailRecipient,
  onTestEmailRecipientChange,
  user,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onLogout: () => void;
  onTestApiKey: () => void;
  testingApiKey: boolean;
  onTestEmail: () => void;
  testingEmail: boolean;
  testEmailRecipient: string;
  onTestEmailRecipientChange: (v: string) => void;
  user?: { username?: string; displayName?: string };
}) {
  const [activeSection, setActiveSection] = useState<SidebarSection>('config');
  const [animKey, setAnimKey] = useState(0);

  const switchSection = (section: SidebarSection) => {
    if (section === activeSection) return;
    setActiveSection(section);
    setAnimKey((k) => k + 1);
  };

  const sectionIcons: Record<SidebarSection, string> = {
    config: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    oidc: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    smtp: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    scanner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="admin-panel-enter flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Sidebar header */}
        <div className="p-5 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Fuel className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Tanken</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Einstellungen</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {user?.username || user?.displayName || 'Admin'}
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchSection(id)}
              className={`admin-sidebar-item ${activeSection === id ? 'admin-sidebar-item--active' : ''}`}
            >
              <IconBox className={`admin-icon-box--sm ${sectionIcons[id]}`}>
                <Icon className="h-3.5 w-3.5" />
              </IconBox>
              {label}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-border/50">
          <button
            type="button"
            onClick={onLogout}
            className="admin-sidebar-item text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-60">
        {/* Mobile pill bar */}
        <div className="lg:hidden sticky top-0 z-10 bg-[--admin-bg]/90 backdrop-blur-md border-b border-border/50 px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Einstellungen</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              Abmelden
            </button>
          </div>
          <div className="admin-pill-bar">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchSection(id)}
                className={`admin-pill ${activeSection === id ? 'admin-pill--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {SECTIONS.find((s) => s.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {SECTIONS.find((s) => s.id === activeSection)?.description}
              </p>
            </div>
            {activeSection !== 'scanner' && (
              <Button
                type="button"
                size="sm"
                className="admin-btn admin-btn-primary"
                disabled={submitting}
                onClick={onSubmit as unknown as () => void}
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Speichert...' : 'Speichern'}
              </Button>
            )}
          </div>

          {/* Section content with animation */}
          <form onSubmit={onSubmit}>
            <div key={animKey} className="admin-section-enter">
              {activeSection === 'config' && (
                <AppConfigSection config={config} onChange={onChange} onTestApiKey={onTestApiKey} testingApiKey={testingApiKey} />
              )}
              {activeSection === 'oidc' && (
                <OidcSection config={config} onChange={onChange} />
              )}
              {activeSection === 'smtp' && (
                <SmtpSection config={config} onChange={onChange} onTestEmail={onTestEmail} testingEmail={testingEmail} testEmailRecipient={testEmailRecipient} onTestEmailRecipientChange={onTestEmailRecipientChange} />
              )}
              {activeSection === 'scanner' && (
                <ScannerConsole />
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────

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
  }, []);

  const dismissFeedback = useCallback(() => setFeedback(null), []);

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
      showFeedback('Abgemeldet.', 'success');
      await refreshStatus();
    } catch (err) {
      showFeedback((err as Error).message || 'Logout fehlgeschlagen.', 'error');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--admin-bg)' }}>
        <div className="text-center admin-panel-enter">
          <IconBox className="admin-icon-box--lg bg-primary/10 mx-auto mb-4">
            <Fuel className="h-6 w-6 text-primary" />
          </IconBox>
          <div className="animate-pulse text-sm text-muted-foreground">Laden...</div>
        </div>
      </div>
    );
  }

  const panel = !status?.bootstrapped ? 'setup' : status.authenticated ? 'dashboard' : 'login';

  return (
    <div className="min-h-screen" style={{ background: 'var(--admin-bg)' }}>
      {/* Toast feedback */}
      {feedback && (
        <FeedbackToast
          key={feedback.message}
          message={feedback.message}
          type={feedback.type}
          onDismiss={dismissFeedback}
        />
      )}

      {/* Setup */}
      {panel === 'setup' && (
        <div className="px-4 py-8 sm:py-12">
          <SetupPanel
            config={config}
            onChange={handleConfigChange}
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSubmit={handleBootstrap}
            submitting={submitting}
          />
        </div>
      )}

      {/* Login */}
      {panel === 'login' && (
        <LoginPanel
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          submitting={submitting}
        />
      )}

      {/* Dashboard */}
      {panel === 'dashboard' && (
        <DashboardPanel
          config={config}
          onChange={handleConfigChange}
          onSubmit={handleSaveConfig}
          submitting={submitting}
          onLogout={handleLogout}
          onTestApiKey={handleTestApiKey}
          testingApiKey={testingApiKey}
          onTestEmail={handleTestEmail}
          testingEmail={testingEmail}
          testEmailRecipient={testEmailRecipient}
          onTestEmailRecipientChange={setTestEmailRecipient}
          user={status?.user}
        />
      )}
    </div>
  );
}
