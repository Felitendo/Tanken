'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Fuel, KeyRound, LogOut, Mail, MapPin, Plus, Save, Search, Shield, Settings, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType: string;
}

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
  locations: AdminLocation[];
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
  currentLocation: string | null;
  scanProgress: string | null;
  lastCycleAt: string | null;
  nextCycleAt: string | null;
  cycleCount: number;
  locationScans: Record<string, { timestamp: string; stationCount: number }>;
  errors: string[];
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

type FeedbackType = 'success' | 'error' | 'info';

const defaultConfig: AdminConfig = {
  apiKey: '',
  fuelType: 'diesel',
  radiusKm: 10,
  refreshIntervalMinutes: 60,
  sessionSecret: '',
  thresholds: { goodBelowAvgCents: 3, okayBelowAvgCents: 1 },
  oidc: { issuerUrl: '', clientId: '', clientSecret: '', scope: 'openid profile email', usernameClaim: 'preferred_username', name: '' },
  smtp: { host: '', port: 587, secure: false, user: '', pass: '', from: '' },
  locations: [],
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

function generateLocationId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${slug}-${Date.now().toString(36)}`;
}

function LocationsSection({
  locations,
  defaultFuelType,
  defaultRadius,
  onChange,
}: {
  locations: AdminLocation[];
  defaultFuelType: string;
  defaultRadius: number;
  onChange: (locations: AdminLocation[]) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=de`,
        { headers: { 'User-Agent': 'Tanken-Admin/1.0' } }
      );
      const data: NominatimResult[] = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 400);
  }, [handleSearch]);

  const addLocation = useCallback((result: NominatimResult) => {
    const name = result.display_name.split(',').slice(0, 2).join(',').trim();
    const newLoc: AdminLocation = {
      id: generateLocationId(name),
      name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      radiusKm: defaultRadius,
      fuelType: defaultFuelType,
    };
    onChange([...locations, newLoc]);
    setSearchQuery('');
    setSearchResults([]);
  }, [locations, onChange, defaultFuelType, defaultRadius]);

  const removeLocation = useCallback((id: string) => {
    onChange(locations.filter(l => l.id !== id));
  }, [locations, onChange]);

  const updateLocation = useCallback((id: string, patch: Partial<AdminLocation>) => {
    onChange(locations.map(l => l.id === id ? { ...l, ...patch } : l));
  }, [locations, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <MapPin className="h-4 w-4" />
        Scan-Standorte
      </div>
      <p className="text-sm text-muted-foreground">
        Standorte hinzufügen, die automatisch nach Preisen gescannt werden. Zwischen den Abfragen wird mindestens 1 Minute gewartet.
      </p>

      {/* Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Ort suchen, z.B. München..."
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => handleSearch(searchQuery)} disabled={searching || searchQuery.length < 2}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="border rounded-lg divide-y bg-card">
            {searchResults.map((result) => (
              <div key={result.place_id} className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm truncate">{result.display_name}</p>
                  <p className="text-xs text-muted-foreground">{parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLocation(result)}
                  disabled={locations.some(l => Math.abs(l.lat - parseFloat(result.lat)) < 0.001 && Math.abs(l.lng - parseFloat(result.lon)) < 0.001)}
                >
                  <Plus className="h-3 w-3" />
                  Hinzufügen
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location list */}
      {locations.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Keine Standorte konfiguriert. Suche oben nach einem Ort.</p>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <div key={loc.id} className="border rounded-lg p-3 bg-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLocation(loc.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Radius (km)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={25}
                    value={loc.radiusKm}
                    onChange={(e) => updateLocation(loc.id, { radiusKm: Math.max(1, Math.min(25, Number(e.target.value) || 10)) })}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Kraftstoff</Label>
                  <Select value={loc.fuelType} onValueChange={(v) => updateLocation(loc.id, { fuelType: v })}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="e5">Super E5</SelectItem>
                      <SelectItem value="e10">Super E10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SchedulerStatusBadge({ locations }: { locations: AdminLocation[] }) {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [scanningNow, setScanningNow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api<SchedulerStatus>('/api/admin/scheduler');
        if (!cancelled) {
          setStatus(data);
          if (!data.scanning) setScanningNow(false);
        }
      } catch {
        // ignore
      }
    }
    load();
    const interval = setInterval(load, 5_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const handleToggle = async () => {
    if (!status) return;
    try {
      const result = await api<{ status: SchedulerStatus }>('/api/admin/scheduler', {
        method: 'POST',
        body: JSON.stringify({ action: status.running ? 'stop' : 'start' }),
      });
      setStatus(result.status);
    } catch {
      // ignore
    }
  };

  const handleScanNow = async () => {
    setScanningNow(true);
    try {
      const result = await api<{ status: SchedulerStatus }>('/api/admin/scheduler', {
        method: 'POST',
        body: JSON.stringify({ action: 'scan-now' }),
      });
      setStatus(result.status);
    } catch {
      setScanningNow(false);
    }
  };

  const locName = (id: string) => locations.find(l => l.id === id)?.name ?? id;

  const fmtTime = (iso: string) => {
    try { return new Date(iso).toLocaleString('de-DE'); } catch { return iso; }
  };

  const fmtRelative = (iso: string) => {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      if (diff < 60_000) return 'gerade eben';
      if (diff < 3_600_000) return `vor ${Math.floor(diff / 60_000)} Min.`;
      if (diff < 86_400_000) return `vor ${Math.floor(diff / 3_600_000)} Std.`;
      return fmtTime(iso);
    } catch { return iso; }
  };

  if (!status) return null;

  const isScanning = status.scanning || scanningNow;

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-3">
        <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${status.running ? (isScanning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500') : 'bg-gray-400'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            Scheduler: {status.running ? (isScanning ? 'Scannt...' : 'Aktiv') : 'Gestoppt'}
          </p>
          {isScanning && status.currentLocation && (
            <p className="text-xs text-muted-foreground">
              {status.scanProgress} — {status.currentLocation}
            </p>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={handleScanNow} disabled={isScanning || locations.length === 0}>
            {isScanning ? 'Scannt...' : 'Jetzt scannen'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleToggle}>
            {status.running ? 'Stoppen' : 'Starten'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t px-3 py-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div>Zyklen: <span className="text-foreground font-medium">{status.cycleCount}</span></div>
        <div>Standorte: <span className="text-foreground font-medium">{locations.length}</span></div>
        {status.lastCycleAt && (
          <div>Letzter Zyklus: <span className="text-foreground font-medium">{fmtRelative(status.lastCycleAt)}</span></div>
        )}
        {status.nextCycleAt && !isScanning && (
          <div>Nächster: <span className="text-foreground font-medium">{fmtTime(status.nextCycleAt)}</span></div>
        )}
      </div>

      {/* Per-location last scan */}
      {Object.keys(status.locationScans).length > 0 && (
        <div className="border-t px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Letzte Scans pro Standort</p>
          <div className="space-y-0.5">
            {Object.entries(status.locationScans).map(([id, info]) => (
              <div key={id} className="flex justify-between text-xs gap-2">
                <span className="truncate text-foreground">{locName(id)}</span>
                <span className="text-muted-foreground flex-shrink-0">{info.stationCount} Tankstellen · {fmtRelative(info.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent errors */}
      {status.errors.length > 0 && (
        <div className="border-t px-3 py-2">
          <p className="text-xs font-medium text-destructive mb-1">Letzte Fehler ({status.errors.length})</p>
          <div className="space-y-0.5 max-h-32 overflow-y-auto">
            {status.errors.slice().reverse().map((err, i) => (
              <p key={i} className="text-xs text-muted-foreground font-mono break-all">{err}</p>
            ))}
          </div>
        </div>
      )}
    </div>
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
  showScheduler,
}: {
  config: AdminConfig;
  onChange: (patch: Partial<AdminConfig>) => void;
  onTestApiKey?: () => void;
  testingApiKey?: boolean;
  onTestEmail?: () => void;
  testingEmail?: boolean;
  testEmailRecipient?: string;
  onTestEmailRecipientChange?: (value: string) => void;
  showScheduler?: boolean;
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

      {/* Scan Locations */}
      <LocationsSection
        locations={config.locations}
        defaultFuelType={config.fuelType}
        defaultRadius={config.radiusKm}
        onChange={(locations) => onChange({ locations })}
      />
      {showScheduler && config.locations.length > 0 && <SchedulerStatusBadge locations={config.locations} />}

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
        setConfig({ ...defaultConfig, ...data.config, locations: data.config.locations ?? [] });
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
        setConfig({ ...defaultConfig, ...result.config, locations: result.config.locations ?? [] });
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
                <ConfigFields config={config} onChange={handleConfigChange} onTestApiKey={handleTestApiKey} testingApiKey={testingApiKey} onTestEmail={handleTestEmail} testingEmail={testingEmail} testEmailRecipient={testEmailRecipient} onTestEmailRecipientChange={setTestEmailRecipient} showScheduler />
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
