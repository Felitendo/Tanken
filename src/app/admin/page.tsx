'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Fuel, KeyRound, LogOut, Mail, Radio, Save, Shield, Settings,
  UserPlus, Trash2, MapPin, Clock, Activity, ChevronDown, ChevronRight,
  RotateCcw, Play, Square, Zap, Check, ArrowRight, ArrowLeft,
  Lock, Plus, X, Pencil, Inbox, ListOrdered, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { LocationPicker, type LocationPickerValue } from '@/components/LocationPicker';
import { RequestMapPreview } from '@/components/RequestMapPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Types ─────────────────────────────────────────────────────────

interface AdminConfig {
  apiKey: string;
  orsApiKey: string;
  fuelType: string;
  radiusKm: number;
  refreshIntervalMinutes: number;
  scanTimes: string[];
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
  mode: 'location-scan' | 'discovery' | null;
  progress: string | null;
  currentPoint: { lat: number; lng: number } | null;
  currentLocation: { id: string; name: string } | null;
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
  nextCycleAt: string | null;
  cache: {
    gridCells: number;
    totalStations: number;
    oldestScan: string | null;
    newestScan: string | null;
  };
  de: CountryScanStatus;
  at: CountryScanStatus;
}

interface ScanLocationDto {
  id: string;
  name: string;
  country: 'de' | 'at';
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType: 'diesel' | 'e5' | 'e10';
  enabled: boolean;
  createdBy: string | null;
  sourceRequestId: string | null;
  lastScanAt: string | null;
  lastScanStationCount: number | null;
  lastScanError: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LocationRequestDto {
  id: string;
  userId: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  note: string | null;
  status: 'pending' | 'approved' | 'denied';
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resultingLocationId: string | null;
  createdAt: string;
  user: { id: string; displayName: string | null; email: string | null; photoUrl: string | null; authProvider: string | null };
}

type FeedbackType = 'success' | 'error' | 'info';
type SidebarSection = 'config' | 'oidc' | 'smtp' | 'locations' | 'scanner';

const SECTIONS: { id: SidebarSection; label: string; icon: typeof Settings; description: string }[] = [
  { id: 'config', label: 'Konfiguration', icon: Settings, description: 'API-Keys, Kraftstoff und Intervalle' },
  { id: 'oidc', label: 'Authentifizierung', icon: Shield, description: 'OIDC Single Sign-On' },
  { id: 'smtp', label: 'E-Mail', icon: Mail, description: 'SMTP-Server für Benachrichtigungen' },
  { id: 'locations', label: 'Standorte', icon: MapPin, description: 'Scan-Standorte und Nutzer-Anfragen' },
  { id: 'scanner', label: 'Scanner', icon: Radio, description: 'Tankstellen-Scanner steuern' },
];

const defaultConfig: AdminConfig = {
  apiKey: '',
  orsApiKey: '',
  fuelType: 'diesel',
  radiusKm: 25,
  refreshIntervalMinutes: 60,
  scanTimes: ['05:00', '11:55', '12:05', '17:00', '20:00', '22:00'],
  sessionSecret: '',
  thresholds: { goodBelowAvgCents: 3, okayBelowAvgCents: 1 },
  oidc: { issuerUrl: '', clientId: '', clientSecret: '', scope: 'openid profile email', usernameClaim: 'preferred_username', pictureClaim: 'picture', name: '' },
  smtp: { host: '', port: 587, secure: false, user: '', pass: '', from: '' },
};

const SCAN_TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

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

// Feedback now flows through sonner; see Toaster in admin/layout.tsx and
// `showFeedback` in the main page component.

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
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex w-8 shrink-0 items-center">{flag}</span>
          <div className="min-w-0">
            <CardTitle className="text-sm">{label}</CardTitle>
            <CardDescription className="text-[11px]">{apiLabel}</CardDescription>
          </div>
        </div>
        {cs.scanning ? (
          <Badge variant="success">
            {cs.mode === 'discovery' ? `Grid ${cs.progress}` : `Scan ${cs.progress}`}
          </Badge>
        ) : cs.lastCompletedAt ? (
          <Badge>{fmtRelative(cs.lastCompletedAt)}</Badge>
        ) : (
          <Badge variant="warning">Warte</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {cs.scanning && cs.progress && (
          <div className="space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="admin-progress-bar admin-progress-bar--active h-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            {cs.currentLocation && (
              <div className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 shrink-0 text-muted-foreground">Aktueller Standort:</span>
                <span className="truncate font-semibold">{cs.currentLocation.name}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              {cs.currentPoint && (
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="size-3" />
                  {cs.currentPoint.lat.toFixed(2)}°N, {cs.currentPoint.lng.toFixed(2)}°E
                </span>
              )}
              {cs.estimatedEndAt && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {fmtEta(cs.estimatedEndAt)}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <StatCell label={cs.mode === 'discovery' ? 'Grid' : 'Standorte'} value={cs.gridPoints ? cs.gridPoints.toLocaleString('de-DE') : '—'} />
          <StatCell label="Stationen" value={cs.stationsScanned ? cs.stationsScanned.toLocaleString('de-DE') : '—'} />
          <StatCell label="Dauer" value={cs.lastDurationSec ? fmtDuration(cs.lastDurationSec) : '—'} />
          <StatCell label="Ø Call" value={cs.avgCallSec ? `${cs.avgCallSec}s` : '—'} />
        </div>

        {cs.log.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowLog(!showLog)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Activity className="size-3" />
              Log ({cs.log.length})
              <ChevronDown className={'size-3 transition-transform duration-200 ' + (showLog ? 'rotate-180' : '')} />
            </button>
            {showLog && (
              <div className="mt-2 max-h-44 overflow-y-auto rounded-md border bg-muted/30">
                {cs.log.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 border-b px-3 py-1.5 last:border-0">
                    <div className={'mt-1.5 size-1.5 shrink-0 rounded-full ' + (logTypeDots[entry.type] || 'bg-muted-foreground')} />
                    <span className="shrink-0 pt-px font-mono text-[10px] text-muted-foreground">
                      {new Date(entry.time).toLocaleTimeString('de-DE')}
                    </span>
                    <span className={'break-all text-xs ' + (logTypeText[entry.type] || '')}>
                      {entry.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {cs.errors.length > 0 && (
          <div className="max-h-28 overflow-y-auto rounded-md border border-destructive/20 bg-destructive/5">
            <div className="border-b border-destructive/10 px-3 py-1.5">
              <p className="text-xs font-medium text-destructive">Fehler ({cs.errors.length})</p>
            </div>
            {cs.errors.slice().reverse().map((err, i) => (
              <p key={i} className="break-all border-b border-destructive/5 px-3 py-1 font-mono text-[11px] text-muted-foreground last:border-0">{err}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Locations Panel ───────────────────────────────────────────────

function LocationEditorModal({
  initial,
  onClose,
  onSaved,
  showFeedback,
}: {
  initial: ScanLocationDto | null;
  onClose: () => void;
  onSaved: () => void;
  showFeedback: (msg: string, type: FeedbackType) => void;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? '');
  const [fuelType, setFuelType] = useState<'diesel' | 'e5' | 'e10'>(initial?.fuelType ?? 'diesel');
  const [country, setCountry] = useState<'de' | 'at'>(initial?.country ?? 'de');
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [value, setValue] = useState<LocationPickerValue>({
    lat: initial?.lat ?? 52.52,
    lng: initial?.lng ?? 13.405,
    radiusKm: 25,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) {
      showFeedback('Name erforderlich.', 'error');
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        country,
        fuelType,
        lat: value.lat,
        lng: value.lng,
        radiusKm: 25,
        enabled,
      };
      const url = isEdit ? `/api/admin/scan-locations/${initial!.id}` : '/api/admin/scan-locations';
      const method = isEdit ? 'PUT' : 'POST';
      await api(url, { method, body: JSON.stringify(body) });
      showFeedback(isEdit ? 'Standort aktualisiert.' : 'Standort angelegt.', 'success');
      onSaved();
      onClose();
    } catch (err) {
      showFeedback((err as Error).message || 'Speichern fehlgeschlagen.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Standort bearbeiten' : 'Neuer Standort'}</DialogTitle>
          <DialogDescription>
            Geo-Koordinaten und Kraftstoff für einen Scan-Standort konfigurieren.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="loc-name">Name</Label>
            <Input
              id="loc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Berlin-Mitte"
              maxLength={80}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="loc-country">Land</Label>
              <Select value={country} onValueChange={(v) => setCountry(v as 'de' | 'at')}>
                <SelectTrigger id="loc-country" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutschland</SelectItem>
                  <SelectItem value="at">Österreich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loc-fuel">Kraftstoff</Label>
              <Select value={fuelType} onValueChange={(v) => setFuelType(v as 'diesel' | 'e5' | 'e10')}>
                <SelectTrigger id="loc-fuel" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="e5">Super E5</SelectItem>
                  <SelectItem value="e10">Super E10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <LocationPicker value={value} onChange={setValue} heightClass="h-72" />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="loc-enabled" className="font-normal">Aktiv</Label>
              <p className="text-xs text-muted-foreground">In die Scan-Warteschlange aufnehmen.</p>
            </div>
            <Switch id="loc-enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            {saving ? 'Speichert…' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequesterAvatar({
  user,
}: {
  user: { displayName: string | null; email: string | null; photoUrl: string | null };
}) {
  const initials = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase() || '?';
  if (user.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.photoUrl}
        alt=""
        className="h-9 w-9 rounded-full object-cover border border-border/60 shrink-0"
      />
    );
  }
  return (
    <div className="h-9 w-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold shrink-0 border border-border/60">
      {initials}
    </div>
  );
}

function DenyDialog({
  requestName,
  onClose,
  onConfirm,
}: {
  requestName: string;
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState('');
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>„{requestName}" ablehnen</DialogTitle>
          <DialogDescription>
            Begründung wird dem Nutzer angezeigt. Pflichtfeld.
          </DialogDescription>
        </DialogHeader>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
          rows={4}
          maxLength={1000}
          placeholder="z.B. Zu nah an einem bestehenden Standort."
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!note.trim()}
            onClick={() => onConfirm(note.trim())}
          >
            Ablehnen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function fmtNextScanTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    if (sameDay) return `heute ${time} Uhr`;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return `morgen ${time} Uhr`;
    return d.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function LocationsQueue({
  locations, schedStatus, busyId,
  onCreate, onEdit, onScanNow, onToggle, onDelete,
}: {
  locations: ScanLocationDto[] | null;
  schedStatus: SchedulerStatus | null;
  busyId: string | null;
  onCreate: () => void;
  onEdit: (loc: ScanLocationDto) => void;
  onScanNow: (loc: ScanLocationDto) => void;
  onToggle: (loc: ScanLocationDto) => void;
  onDelete: (loc: ScanLocationDto) => void;
}) {
  const enabledDe = (locations ?? []).filter((l) => l.enabled && l.country === 'de');
  const enabledAt = (locations ?? []).filter((l) => l.enabled && l.country === 'at');
  const disabled = (locations ?? []).filter((l) => !l.enabled);

  const deScanning = !!schedStatus?.de.scanning;
  const currentDeId = schedStatus?.de.currentLocation?.id ?? null;
  const deProgress = schedStatus?.de.progress ?? null;
  const nextAt = schedStatus?.nextCycleAt ?? null;

  const renderRow = (loc: ScanLocationDto, idx: number | null, status: 'current' | 'upcoming' | 'done' | 'idle') => {
    const isCurrent = status === 'current';
    return (
      <div
        key={loc.id}
        className={'flex items-center gap-3 p-4 transition-colors ' + (isCurrent ? 'bg-emerald-500/5' : '')}
      >
        {idx !== null ? (
          <div
            className={
              'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ' +
              (isCurrent
                ? 'bg-emerald-500 text-white'
                : status === 'done'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-secondary text-secondary-foreground')
            }
            aria-label={`Position ${idx} in der Warteschlange`}
          >
            {isCurrent ? <Loader2 className="size-3.5 animate-spin" /> : idx}
          </div>
        ) : (
          <div className="size-8 shrink-0" />
        )}
        <Flag country={loc.country} className="h-4 w-6 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold">{loc.name}</p>
            {isCurrent && <Badge variant="success">Wird jetzt gescannt</Badge>}
            {!loc.enabled && <Badge variant="warning">Deaktiviert</Badge>}
            {loc.lastScanError && <Badge variant="destructive">Fehler</Badge>}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">
            {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)} · {loc.fuelType}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {loc.lastScanAt
              ? `Letzter Scan ${fmtRelative(loc.lastScanAt)} · ${loc.lastScanStationCount ?? 0} Stationen`
              : 'Noch nicht gescannt'}
          </p>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onToggle(loc)}
            disabled={busyId === loc.id}
            title={loc.enabled ? 'Deaktivieren' : 'Aktivieren'}
          >
            {loc.enabled ? <Square /> : <Play />}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onScanNow(loc)}
            disabled={busyId === loc.id}
            title="Einzeln sofort scannen"
          >
            <Zap />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onEdit(loc)}
            disabled={busyId === loc.id}
            title="Bearbeiten"
          >
            <Pencil />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(loc)}
            disabled={busyId === loc.id}
            title="Löschen"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    );
  };

  const currentIdx = currentDeId ? enabledDe.findIndex((l) => l.id === currentDeId) : -1;

  return (
    <div className="space-y-6">
      {/* Next-scan banner */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm">
          {deScanning ? (
            <>
              <Loader2 className="size-4 shrink-0 animate-spin text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  Scan läuft {deProgress ? <span className="font-mono text-muted-foreground">({deProgress})</span> : null}
                </p>
                {schedStatus?.de.currentLocation && (
                  <p className="truncate text-xs text-muted-foreground">
                    Aktuell: <span className="font-semibold text-foreground">{schedStatus.de.currentLocation.name}</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <Clock className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {enabledDe.length === 0
                    ? 'Keine Standorte in der Warteschlange'
                    : <>Nächster Scan: <span className="tabular-nums">{fmtNextScanTime(nextAt)}</span></>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {enabledDe.length === 0
                    ? 'Aktiviere mindestens einen Standort, um ihn in die tägliche Warteschlange aufzunehmen.'
                    : `${enabledDe.length} DE-Standort${enabledDe.length === 1 ? '' : 'e'} werden nacheinander gescannt (5 Min. Pause je Standort).`}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Scan queue */}
      <Card className="py-0 gap-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ListOrdered className="size-3.5" />
            Scan-Warteschlange
          </div>
          <Button size="sm" onClick={onCreate}>
            <Plus /> Neuer Standort
          </Button>
        </div>
        {locations === null ? (
          <div className="animate-pulse p-6 text-center text-sm text-muted-foreground">Lade…</div>
        ) : enabledDe.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Keine aktiven DE-Standorte in der Warteschlange. „Neuer Standort" klicken, um zu starten.
          </div>
        ) : (
          <div className="divide-y">
            {enabledDe.map((loc, i) => {
              const position = i + 1;
              let status: 'current' | 'upcoming' | 'done' | 'idle' = 'idle';
              if (deScanning && currentIdx >= 0) {
                if (i === currentIdx) status = 'current';
                else if (i < currentIdx) status = 'done';
                else status = 'upcoming';
              }
              return renderRow(loc, position, status);
            })}
          </div>
        )}
      </Card>

      {/* Austria grid-discovery */}
      {enabledAt.length > 0 && (
        <Card className="py-0 gap-0">
          <div className="border-b px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Österreich (Grid-Discovery)
          </div>
          <p className="px-4 pt-3 text-xs text-muted-foreground">
            AT-Standorte werden nicht einzeln angefragt — der Scanner durchläuft ein festes Grid über das gesamte Land.
          </p>
          <div className="mt-2 divide-y">
            {enabledAt.map((loc) => renderRow(loc, null, 'idle'))}
          </div>
        </Card>
      )}

      {/* Disabled */}
      {disabled.length > 0 && (
        <Card className="py-0 gap-0">
          <div className="border-b px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Deaktiviert — nicht in der Warteschlange
          </div>
          <div className="divide-y">
            {disabled.map((loc) => renderRow(loc, null, 'idle'))}
          </div>
        </Card>
      )}
    </div>
  );
}

function LocationsPanel({ showFeedback }: { showFeedback: (msg: string, type: FeedbackType) => void }) {
  const [locations, setLocations] = useState<ScanLocationDto[] | null>(null);
  const [pending, setPending] = useState<LocationRequestDto[] | null>(null);
  const [editing, setEditing] = useState<ScanLocationDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [denying, setDenying] = useState<LocationRequestDto | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [schedStatus, setSchedStatus] = useState<SchedulerStatus | null>(null);

  const loadLocations = useCallback(async () => {
    try {
      const data = await api<{ locations: ScanLocationDto[] }>('/api/admin/scan-locations');
      setLocations(data.locations);
    } catch (err) {
      showFeedback((err as Error).message || 'Standorte konnten nicht geladen werden.', 'error');
    }
  }, [showFeedback]);

  const loadPending = useCallback(async () => {
    try {
      const data = await api<{ requests: LocationRequestDto[] }>('/api/admin/location-requests?status=pending');
      setPending(data.requests);
    } catch (err) {
      showFeedback((err as Error).message || 'Anfragen konnten nicht geladen werden.', 'error');
    }
  }, [showFeedback]);

  useEffect(() => {
    loadLocations();
    loadPending();
  }, [loadLocations, loadPending]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api<SchedulerStatus>('/api/admin/scheduler');
        if (!cancelled) setSchedStatus(data);
      } catch { /* ignore */ }
    }
    load();
    const interval = setInterval(load, 3_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  useEffect(() => {
    const scanning = schedStatus?.de.scanning || schedStatus?.at.scanning;
    if (scanning) {
      const interval = setInterval(() => loadLocations(), 5_000);
      return () => clearInterval(interval);
    }
  }, [schedStatus?.de.scanning, schedStatus?.at.scanning, loadLocations]);

  async function toggleEnabled(loc: ScanLocationDto) {
    setBusyId(loc.id);
    try {
      await api(`/api/admin/scan-locations/${loc.id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !loc.enabled }),
      });
      loadLocations();
    } catch (err) {
      showFeedback((err as Error).message || 'Änderung fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function scanNow(loc: ScanLocationDto) {
    setBusyId(loc.id);
    try {
      const res = await api<{ stationCount: number }>(`/api/admin/scan-locations/${loc.id}/scan`, { method: 'POST' });
      showFeedback(`Scan "${loc.name}": ${res.stationCount} Stationen.`, 'success');
      loadLocations();
    } catch (err) {
      showFeedback((err as Error).message || 'Scan fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function deleteLocation(loc: ScanLocationDto) {
    if (!confirm(`Standort „${loc.name}" wirklich löschen?`)) return;
    setBusyId(loc.id);
    try {
      await api(`/api/admin/scan-locations/${loc.id}`, { method: 'DELETE' });
      showFeedback('Standort gelöscht.', 'success');
      loadLocations();
    } catch (err) {
      showFeedback((err as Error).message || 'Löschen fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function approve(req: LocationRequestDto) {
    setBusyId(req.id);
    try {
      await api(`/api/admin/location-requests/${req.id}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'approve' }),
      });
      showFeedback('Anfrage genehmigt. Standort wurde angelegt.', 'success');
      loadPending();
      loadLocations();
    } catch (err) {
      showFeedback((err as Error).message || 'Genehmigung fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function deny(req: LocationRequestDto, note: string) {
    setBusyId(req.id);
    try {
      await api(`/api/admin/location-requests/${req.id}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'deny', note }),
      });
      showFeedback('Anfrage abgelehnt.', 'success');
      setDenying(null);
      loadPending();
    } catch (err) {
      showFeedback((err as Error).message || 'Ablehnen fehlgeschlagen.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending requests */}
      {pending && pending.length > 0 && (
        <Card className="py-0 gap-0">
          <div className="border-b px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Offene Anfragen ({pending.length})
          </div>
          <div className="divide-y">
            {pending.map((req) => (
              <div key={req.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <RequesterAvatar user={req.user} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{req.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          {req.user.displayName || req.user.email || req.userId}
                        </span>
                        {req.user.email && req.user.displayName ? ` · ${req.user.email}` : ''}
                        {' · '}
                        {fmtRelative(req.createdAt)}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {req.lat.toFixed(4)}, {req.lng.toFixed(4)} · Radius {req.radiusKm} km
                      </p>
                      {req.note && <p className="mt-1.5 text-xs text-foreground/80">„{req.note}"</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      onClick={() => approve(req)}
                      disabled={busyId === req.id}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Check /> Genehmigen
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDenying(req)}
                      disabled={busyId === req.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <X /> Ablehnen
                    </Button>
                  </div>
                </div>
                <RequestMapPreview
                  lat={req.lat}
                  lng={req.lng}
                  radiusKm={req.radiusKm}
                  heightClass="h-48"
                  ariaLabel={`Kartenvorschau für „${req.name}": ${req.lat.toFixed(4)}, ${req.lng.toFixed(4)}, Radius ${req.radiusKm} km`}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {pending && pending.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Inbox className="size-4" />
            Keine offenen Anfragen.
          </CardContent>
        </Card>
      )}

      {/* Scan queue */}
      <LocationsQueue
        locations={locations}
        schedStatus={schedStatus}
        busyId={busyId}
        onCreate={() => setCreating(true)}
        onEdit={(loc) => setEditing(loc)}
        onScanNow={scanNow}
        onToggle={toggleEnabled}
        onDelete={deleteLocation}
      />

      {(creating || editing) && (
        <LocationEditorModal
          initial={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={loadLocations}
          showFeedback={showFeedback}
        />
      )}
      {denying && (
        <DenyDialog
          requestName={denying.name}
          onClose={() => setDenying(null)}
          onConfirm={(note) => deny(denying, note)}
        />
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
      <Card>
        <CardContent className="space-y-3 py-8">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  const isScanning = status.de.scanning || status.at.scanning;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={
                'flex size-9 shrink-0 items-center justify-center rounded-lg ' +
                (status.running ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground')
              }
            >
              <Radio className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle>Scanner</CardTitle>
                <StatusDot active={status.running} />
              </div>
              <CardDescription>
                {status.running
                  ? isScanning ? 'Scannt DE + AT parallel' : 'Wartet auf nächsten Zyklus'
                  : 'Gestoppt'}
              </CardDescription>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <Button
              size="sm"
              variant={status.running ? 'destructive' : 'default'}
              onClick={() => handleAction(status.running ? 'stop' : 'start')}
            >
              {status.running ? <><Square /> Stoppen</> : <><Play /> Starten</>}
            </Button>
            {status.running && (
              <>
                <Button variant="outline" size="icon-sm" onClick={() => handleAction('restart')} title="Neustart">
                  <RotateCcw />
                </Button>
                {!isScanning && (
                  <Button variant="outline" size="sm" onClick={() => handleAction('triggerNow')}>
                    <Zap /> Jetzt scannen
                  </Button>
                )}
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <StatCell label="Grid-Zellen" value={status.cache.gridCells.toLocaleString('de-DE')} />
            <StatCell label="Tankstellen" value={status.cache.totalStations.toLocaleString('de-DE')} sub="eindeutig" />
            <StatCell label="Zyklen" value={String(status.cycleCount)} />
            <StatCell
              label="Letzter Zyklus"
              value={status.lastCycleDurationSec ? fmtDuration(status.lastCycleDurationSec) : '—'}
              sub={status.nextCycleAt ? `Nächster: ${new Date(status.nextCycleAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}` : undefined}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t pt-4 text-[11px] text-muted-foreground">
          <span>
            {status.cache.oldestScan && status.cache.newestScan
              ? `Cache: ${fmtRelative(status.cache.oldestScan)} — ${fmtRelative(status.cache.newestScan)}`
              : 'Cache leer'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => { if (confirm('Cache wirklich leeren? Alle gecachten Tankstellen werden gelöscht.')) handleAction('clearCache'); }}
            disabled={clearing}
          >
            {clearing ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {clearing ? 'Löscht…' : 'Cache leeren'}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CountryScannerCard cs={status.de} flag={<Flag country="de" className="h-5 rounded-sm" />} label="Deutschland" api="Tankerkönig list.php (Admin-Standorte)" />
        <CountryScannerCard cs={status.at} flag={<Flag country="at" className="h-5 rounded-sm" />} label="Österreich" api="E-Control (5x parallel)" />
      </div>
    </div>
  );
}

// ─── TimeInput (HH:MM, native picker-frei) ─────────────────────────

function TimeInput({ value, onChange, className = '' }: { value: string; onChange: (v: string) => void; className?: string }) {
  const [hStr, mStr] = (value || '00:00').split(':');
  const hh = (hStr ?? '00').padStart(2, '0');
  const mm = (mStr ?? '00').padStart(2, '0');

  const clamp = (raw: string, max: number) => {
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return '00';
    return String(Math.min(Math.max(n, 0), max)).padStart(2, '0');
  };

  const numCls =
    'w-7 bg-transparent text-center outline-none ' +
    '[appearance:textfield] [-moz-appearance:textfield] ' +
    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

  return (
    <div
      className={
        'inline-flex h-9 items-center gap-0.5 rounded-md border border-input bg-background px-2.5 text-sm font-mono tabular-nums shadow-xs transition-[color,box-shadow] ' +
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 ' +
        'dark:bg-input/30 ' +
        className
      }
    >
      <Clock className="mr-1.5 size-3.5 text-muted-foreground" aria-hidden="true" />
      <input
        type="number"
        min={0}
        max={23}
        value={hh}
        aria-label="Stunden"
        onChange={(e) => onChange(`${clamp(e.target.value, 23)}:${mm}`)}
        className={numCls}
      />
      <span className="text-muted-foreground">:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={mm}
        aria-label="Minuten"
        onChange={(e) => onChange(`${hh}:${clamp(e.target.value, 59)}`)}
        className={numCls}
      />
    </div>
  );
}

// ─── Scan Times (12-Uhr-Regel awareness) ───────────────────────────

function ScanTimesCard({ config, onChange }: { config: AdminConfig; onChange: (patch: Partial<AdminConfig>) => void }) {
  const times = config.scanTimes ?? [];
  const updateAt = (idx: number, value: string) => {
    const next = [...times];
    next[idx] = value;
    onChange({ scanTimes: next });
  };
  const addRow = () => {
    if (times.length >= 12) return;
    onChange({ scanTimes: [...times, '12:00'] });
  };
  const removeRow = (idx: number) => {
    if (times.length <= 1) return;
    onChange({ scanTimes: times.filter((_, i) => i !== idx) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan-Zeiten</CardTitle>
        <CardDescription>
          Seit April 2026 dürfen DE-Tankstellen Preise nur 1×/Tag um 12:00 erhöhen,
          Senkungen sind jederzeit erlaubt (AT analog). Mehrere Scan-Zeitpunkte
          erfassen die Senkungen am Nachmittag/Abend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {times.map((time, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TimeInput value={time} onChange={(v) => updateAt(idx, v)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(idx)}
                disabled={times.length <= 1}
                aria-label="Scan-Zeit entfernen"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={times.length >= 12}
            className="mt-1"
          >
            <Plus />
            Scan-Zeit hinzufügen
          </Button>
        </div>
      </CardContent>
    </Card>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API-Schlüssel</CardTitle>
          <CardDescription>Zugangsdaten für Datenquellen und Session-Signatur.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cfg-api-key">Tankerkönig API Key</Label>
            <div className="flex gap-2">
              <Input
                id="cfg-api-key"
                value={config.apiKey}
                onChange={(e) => onChange({ apiKey: e.target.value })}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="font-mono text-xs"
              />
              {onTestApiKey && (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="shrink-0"
                  onClick={onTestApiKey}
                  disabled={testingApiKey || !config.apiKey}
                >
                  {testingApiKey ? <Loader2 className="animate-spin" /> : <KeyRound />}
                  {testingApiKey ? 'Teste…' : 'Testen'}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Kostenlos unter{' '}
              <a
                href="https://creativecommons.tankerkoenig.de"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                tankerkoenig.de
              </a>
              .
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cfg-ors-key">OpenRouteService Key</Label>
            <Input
              id="cfg-ors-key"
              value={config.orsApiKey}
              onChange={(e) => onChange({ orsApiKey: e.target.value })}
              placeholder="Für Fahrtdistanzen statt Luftlinie"
            />
            <p className="text-xs text-muted-foreground">
              Optional — unter{' '}
              <a
                href="https://openrouteservice.org/dev/#/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                openrouteservice.org
              </a>{' '}
              registrieren.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cfg-session-secret">Session Secret</Label>
            <Input
              id="cfg-session-secret"
              value={config.sessionSecret}
              onChange={(e) => onChange({ sessionSecret: e.target.value })}
              placeholder="Wird automatisch generiert"
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suche</CardTitle>
          <CardDescription>Standard-Kraftstoff und Refresh-Intervall der Web-App.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cfg-fuel">Kraftstoff</Label>
            <Select value={config.fuelType} onValueChange={(v) => onChange({ fuelType: v })}>
              <SelectTrigger id="cfg-fuel" className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="e5">Super E5</SelectItem>
                <SelectItem value="e10">Super E10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="cfg-refresh">Refresh-Intervall</Label>
              <p className="text-xs text-muted-foreground">Wie oft die Web-App neue Daten holt.</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="cfg-refresh"
                type="number"
                min={1}
                value={config.refreshIntervalMinutes}
                onChange={(e) => onChange({ refreshIntervalMinutes: Number(e.target.value) || 60 })}
                className="w-20 text-right font-mono tabular-nums"
              />
              <span className="text-sm text-muted-foreground">Min.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScanTimesCard config={config} onChange={onChange} />

      <Card>
        <CardHeader>
          <CardTitle>Schwellenwerte</CardTitle>
          <CardDescription>Wie weit unter Durchschnitt ein Preis als „gut" oder „okay" gilt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="cfg-good" className="font-normal">Gut unter Durchschnitt</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cfg-good"
                type="number"
                value={config.thresholds.goodBelowAvgCents}
                onChange={(e) => onChange({ thresholds: { ...config.thresholds, goodBelowAvgCents: Number(e.target.value) || 3 } })}
                className="w-20 text-right font-mono tabular-nums"
              />
              <span className="text-sm text-muted-foreground">ct</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="cfg-okay" className="font-normal">Okay unter Durchschnitt</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cfg-okay"
                type="number"
                value={config.thresholds.okayBelowAvgCents}
                onChange={(e) => onChange({ thresholds: { ...config.thresholds, okayBelowAvgCents: Number(e.target.value) || 1 } })}
                className="w-20 text-right font-mono tabular-nums"
              />
              <span className="text-sm text-muted-foreground">ct</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OidcSection({ config, onChange }: { config: AdminConfig; onChange: (patch: Partial<AdminConfig>) => void }) {
  const callbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/oidc/callback`
    : '';
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Anbieter</CardTitle>
          <CardDescription>Identitätsanbieter (Google, Authelia, Keycloak, FeloID …).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="oidc-name">Anzeigename</Label>
            <Input
              id="oidc-name"
              value={config.oidc.name}
              onChange={(e) => onChange({ oidc: { ...config.oidc, name: e.target.value } })}
              placeholder="z.B. FeloID, Google, Authelia"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="oidc-issuer">Issuer URL</Label>
            <Input
              id="oidc-issuer"
              type="url"
              value={config.oidc.issuerUrl}
              onChange={(e) => onChange({ oidc: { ...config.oidc, issuerUrl: e.target.value } })}
              placeholder="https://auth.example.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zugangsdaten</CardTitle>
          <CardDescription>Beim OIDC-Anbieter angelegte Client-Credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="oidc-client-id">Client ID</Label>
            <Input
              id="oidc-client-id"
              value={config.oidc.clientId}
              onChange={(e) => onChange({ oidc: { ...config.oidc, clientId: e.target.value } })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="oidc-client-secret">Client Secret</Label>
            <Input
              id="oidc-client-secret"
              type="password"
              value={config.oidc.clientSecret}
              onChange={(e) => onChange({ oidc: { ...config.oidc, clientSecret: e.target.value } })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="oidc-callback">Callback URL</Label>
            <div className="flex gap-2">
              <Input
                id="oidc-callback"
                readOnly
                value={callbackUrl}
                className="font-mono text-xs bg-muted"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  navigator.clipboard?.writeText(callbackUrl);
                  toast.success('Callback URL kopiert.');
                }}
              >
                Kopieren
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Als Redirect URI beim OIDC-Anbieter eintragen.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
          <CardDescription>Welche Felder aus dem ID-Token gelesen werden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="oidc-scope">Scope</Label>
            <Input
              id="oidc-scope"
              value={config.oidc.scope}
              onChange={(e) => onChange({ oidc: { ...config.oidc, scope: e.target.value } })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="oidc-username-claim">Username Claim</Label>
            <Input
              id="oidc-username-claim"
              value={config.oidc.usernameClaim}
              onChange={(e) => onChange({ oidc: { ...config.oidc, usernameClaim: e.target.value } })}
              placeholder="preferred_username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="oidc-picture-claim">Picture Claim</Label>
            <Input
              id="oidc-picture-claim"
              value={config.oidc.pictureClaim}
              onChange={(e) => onChange({ oidc: { ...config.oidc, pictureClaim: e.target.value } })}
              placeholder="picture"
            />
          </div>
        </CardContent>
      </Card>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Server</CardTitle>
          <CardDescription>SMTP-Verbindungsparameter für ausgehende Mails.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="smtp-host">Host</Label>
            <Input
              id="smtp-host"
              value={config.smtp.host}
              onChange={(e) => onChange({ smtp: { ...config.smtp, host: e.target.value } })}
              placeholder="smtp.example.com"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="smtp-port" className="font-normal">Port</Label>
            <Input
              id="smtp-port"
              type="number"
              min={1}
              max={65535}
              value={config.smtp.port}
              onChange={(e) => onChange({ smtp: { ...config.smtp, port: Number(e.target.value) || 587 } })}
              className="w-24 text-right font-mono tabular-nums"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="smtp-secure" className="font-normal">SSL/TLS</Label>
              <p className="text-xs text-muted-foreground">Verbindung verschlüsseln (z.B. Port 465).</p>
            </div>
            <Switch
              id="smtp-secure"
              checked={config.smtp.secure}
              onCheckedChange={(checked) => onChange({ smtp: { ...config.smtp, secure: checked } })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zugangsdaten</CardTitle>
          <CardDescription>Login für den SMTP-Server (optional, falls Auth erforderlich).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="smtp-user">Benutzername</Label>
            <Input
              id="smtp-user"
              value={config.smtp.user}
              onChange={(e) => onChange({ smtp: { ...config.smtp, user: e.target.value } })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtp-pass">Passwort</Label>
            <Input
              id="smtp-pass"
              type="password"
              value={config.smtp.pass}
              onChange={(e) => onChange({ smtp: { ...config.smtp, pass: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Absender</CardTitle>
          <CardDescription>Welche Adresse als „Von" gesetzt wird.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="smtp-from">Von-Adresse</Label>
            <Input
              id="smtp-from"
              type="email"
              value={config.smtp.from}
              onChange={(e) => onChange({ smtp: { ...config.smtp, from: e.target.value } })}
              placeholder="tanken@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {onTestEmail && (
        <Card>
          <CardHeader>
            <CardTitle>Test</CardTitle>
            <CardDescription>Konfiguration mit einer Testmail prüfen.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="smtp-test-to">Empfänger</Label>
              <div className="flex gap-2">
                <Input
                  id="smtp-test-to"
                  type="email"
                  value={testEmailRecipient ?? ''}
                  onChange={(e) => onTestEmailRecipientChange?.(e.target.value)}
                  placeholder="deine@email.com"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={onTestEmail}
                  disabled={testingEmail || !config.smtp.host || !config.smtp.from || !testEmailRecipient}
                >
                  {testingEmail ? <Loader2 className="animate-spin" /> : <Mail />}
                  {testingEmail ? 'Sende…' : 'Senden'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          <CardTitle>Erstkonfiguration</CardTitle>
          <CardDescription>Admin anlegen und Tanken einrichten.</CardDescription>

          {/* Step indicator */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {steps.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className="flex items-center gap-2 text-xs font-medium"
              >
                <span
                  className={
                    'flex size-6 items-center justify-center rounded-full border text-[11px] transition-colors ' +
                    (i === step
                      ? 'border-primary bg-primary text-primary-foreground'
                      : i < step
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground')
                  }
                >
                  {i < step ? <Check className="size-3" /> : i + 1}
                </span>
                <span className={i === step ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
                {i < steps.length - 1 && <ChevronRight className="size-3 text-muted-foreground/40" />}
              </button>
            ))}
          </div>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            <div className={step === 0 ? 'grid gap-4' : 'hidden'}>
              <div className="grid gap-2">
                <Label htmlFor="setup-username">Benutzername</Label>
                <Input
                  id="setup-username"
                  autoComplete="username"
                  required
                  minLength={3}
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Mindestens 3 Zeichen.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="setup-password">Passwort</Label>
                <Input
                  id="setup-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Mindestens 8 Zeichen.</p>
              </div>
            </div>

            <div className={step === 1 ? '' : 'hidden'}>
              <AppConfigSection config={config} onChange={onChange} />
            </div>

            <div className={step === 2 ? 'space-y-6' : 'hidden'}>
              <OidcSection config={config} onChange={onChange} />
              <SmtpSection config={config} onChange={onChange} />
            </div>
          </CardContent>

          <CardFooter className="justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(Math.max(0, step - 1))}
              className={step === 0 ? 'invisible' : ''}
            >
              <ArrowLeft /> Zurück
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" size="sm" onClick={() => setStep(step + 1)}>
                Weiter <ArrowRight />
              </Button>
            ) : (
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : <Save />}
                {submitting ? 'Speichert…' : 'Setup abschließen'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
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
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="size-5" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Mit lokalem Account anmelden.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="admin-login-form" onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="login-username">Benutzername</Label>
              <Input
                id="login-username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-password">Passwort</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button form="admin-login-form" type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? 'Einloggen…' : 'Einloggen'}
          </Button>
        </CardFooter>
      </Card>
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
  showFeedback,
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
  showFeedback: (msg: string, type: FeedbackType) => void;
}) {
  const [activeSection, setActiveSection] = useState<SidebarSection>('config');

  const sectionIcons: Record<SidebarSection, string> = {
    config: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    oidc: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    smtp: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    locations: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    scanner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const isFormSection = activeSection === 'config' || activeSection === 'oidc' || activeSection === 'smtp';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Fuel className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Tanken Admin</span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.username || user?.displayName || 'Admin'}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      isActive={activeSection === id}
                      onClick={() => setActiveSection(id)}
                      tooltip={label}
                    >
                      <span className={`flex size-6 items-center justify-center rounded-md ${sectionIcons[id]}`}>
                        <Icon className="size-3.5" />
                      </span>
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onLogout} tooltip="Abmelden">
                <LogOut />
                <span>Abmelden</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/60 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight">{currentSection?.label}</h1>
              <p className="truncate text-xs text-muted-foreground">{currentSection?.description}</p>
            </div>
          </div>
          {isFormSection && (
            <Button type="button" size="sm" disabled={submitting} onClick={onSubmit as unknown as () => void}>
              {submitting ? <Loader2 className="animate-spin" /> : <Save />}
              {submitting ? 'Speichert…' : 'Speichern'}
            </Button>
          )}
        </header>

        <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-10">
          {activeSection === 'config' && (
            <form onSubmit={onSubmit}>
              <AppConfigSection config={config} onChange={onChange} onTestApiKey={onTestApiKey} testingApiKey={testingApiKey} />
            </form>
          )}
          {activeSection === 'oidc' && (
            <form onSubmit={onSubmit}>
              <OidcSection config={config} onChange={onChange} />
            </form>
          )}
          {activeSection === 'smtp' && (
            <form onSubmit={onSubmit}>
              <SmtpSection config={config} onChange={onChange} onTestEmail={onTestEmail} testingEmail={testingEmail} testEmailRecipient={testEmailRecipient} onTestEmailRecipientChange={onTestEmailRecipientChange} />
            </form>
          )}
          {activeSection === 'locations' && (
            <LocationsPanel showFeedback={showFeedback} />
          )}
          {activeSection === 'scanner' && (
            <ScannerConsole />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState<AdminConfig>(defaultConfig);

  const showFeedback = useCallback((message: string, type: FeedbackType) => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast(message);
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
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Fuel className="size-5" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Laden…
          </div>
        </div>
      </div>
    );
  }

  const panel = !status?.bootstrapped ? 'setup' : status.authenticated ? 'dashboard' : 'login';

  return (
    <div className="min-h-svh bg-background">
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
          showFeedback={showFeedback}
        />
      )}
    </div>
  );
}
