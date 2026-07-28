'use client';

import { useEffect, useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { discover, listPets, say, installPet, fetchCatalog, listInstalled, runInstallCommand, type OpenPetsStatus, type OpenPetsPetInfo, type DeliveryChannel, type CatalogEntry, type PetMeta } from '@/lib/openpets';
import { Cat, CheckCircle2, AlertCircle, Loader2, RefreshCw, MessageCircle, Smartphone, ExternalLink, Terminal, Link2, Download, FolderOpen, Star } from 'lucide-react';
import { toast } from 'sonner';

const INSTALLED_PETS_KEY = 'shodasha_installed_pets';

function loadInstalledPetIds(): string[] {
  try {
    const raw = localStorage.getItem(INSTALLED_PETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveInstalledPetIds(ids: string[]) {
  localStorage.setItem(INSTALLED_PETS_KEY, JSON.stringify(ids));
}

type ConnectionState = 'loading' | 'available' | 'not_installed' | 'not_running' | 'error' | 'no_pets';

export function DesktopPetSettings() {
  const {
    petDeliveryEnabled,
    petId,
    channelHabit,
    channelIdle,
    channelSummary,
    setPetDeliveryEnabled,
    setPetId,
    setChannelHabit,
    setChannelIdle,
    setChannelSummary,
  } = useNotificationStore();

  const [connectionState, setConnectionState] = useState<ConnectionState>('loading');
  const [status, setStatus] = useState<OpenPetsStatus | null>(null);
  const [pets, setPets] = useState<OpenPetsPetInfo[]>([]);
  const [catalog, setCatalog] = useState<CatalogEntry[]>([]);
  const [installedIds, setInstalledIds] = useState<string[]>(loadInstalledPetIds);
  const [localPets, setLocalPets] = useState<PetMeta[]>([]);
  const [sending, setSending] = useState(false);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installUrl, setInstallUrl] = useState('');
  const [installingFromUrl, setInstallingFromUrl] = useState(false);
  const [customCommand, setCustomCommand] = useState('');
  const [installingFromCommand, setInstallingFromCommand] = useState(false);

  const refresh = useCallback(async () => {
    setConnectionState('loading');
    const [disc, cat, local] = await Promise.all([
      discover(),
      fetchCatalog(),
      listInstalled(),
    ]);
    setStatus(disc);
    setCatalog(cat);
    setLocalPets(local);

    const localIds = local.map((m) => m.id);
    if (localIds.length) {
      setInstalledIds((prev) => {
        const merged = [...new Set([...prev, ...localIds])];
        saveInstalledPetIds(merged);
        return merged;
      });
    }

    if (!disc.available) {
      setConnectionState(disc.app_version === null ? 'not_installed' : 'not_running');
      return;
    }

    const petList = await listPets();
    const validPets = petList.filter((p) => !p.broken);
    setPets(validPets);

    if (validPets.length === 0) {
      setConnectionState('no_pets');
      return;
    }

    setConnectionState('available');
    if (!petId && disc.default_pet_id && validPets.some((p) => p.id === disc.default_pet_id)) {
      setPetId(disc.default_pet_id);
    }
  }, [petId, setPetId]);

  useEffect(() => { refresh(); }, []);

  const handleSendTest = async () => {
    if (!status?.available) return;
    setSending(true);
    const result = await say('Hello from Shodasha! All systems operational.', 'celebrating', petId ?? undefined);
    toast[result.sent ? 'success' : 'error'](result.sent ? 'Pet notification sent!' : 'Failed to send pet notification.');
    setSending(false);
  };

  const handleSelectPet = (id: string) => setPetId(id === petId ? null : id);

  const handleInstall = async (id: string, name: string) => {
    if (installingId) return;
    setInstallingId(id);
    toast.loading(`Installing ${name}…`, { id: `install-${id}` });
    const result = await installPet(id);
    if (result.success) {
      const updated = installedIds.includes(id) ? installedIds : [...installedIds, id];
      setInstalledIds(updated);
      saveInstalledPetIds(updated);
      toast.success(`${name} installed successfully!`, { id: `install-${id}` });
      // Refresh local pets list to show the new pet in Installed Pets panel
      const fresh = await listInstalled();
      setLocalPets(fresh);
      if (connectionState === 'available') {
        const petList = await listPets();
        setPets(petList.filter((p) => !p.broken));
      }
    } else {
      toast.error(`Installation failed: ${result.message}`, { id: `install-${id}` });
    }
    setInstallingId(null);
  };

  const handleInstallFromUrl = async () => {
    const url = installUrl.trim();
    if (!url) return;
    setInstallingFromUrl(true);
    setInstallUrl('');
    toast.loading('Installing from URL…', { id: 'install-url' });
    const petId = url.match(/\/pets\/[^/]+\/([^/]+)\.zip$/)?.[1];
    const result = await installPet(petId ?? url);
    if (result.success) {
      if (petId) {
        const updated = installedIds.includes(petId) ? installedIds : [...installedIds, petId];
        setInstalledIds(updated);
        saveInstalledPetIds(updated);
      }
      toast.success('Pet installed successfully!', { id: 'install-url' });
      // Refresh local pets list to show the new pet
      const fresh = await listInstalled();
      setLocalPets(fresh);
      if (connectionState === 'available') {
        const petList = await listPets();
        setPets(petList.filter((p) => !p.broken));
      }
    } else {
      toast.error(`Installation failed: ${result.message}`, { id: 'install-url' });
    }
    setInstallingFromUrl(false);
  };

  const handleInstallFromCommand = async () => {
    const cmd = customCommand.trim();
    if (!cmd) return;
    setInstallingFromCommand(true);
    setCustomCommand('');
    toast.loading('Running install command…', { id: 'install-cmd' });
    const result = await runInstallCommand(cmd);
    if (result.success) {
      toast.success('Command completed successfully!', { id: 'install-cmd' });
      if (connectionState === 'available') {
        const petList = await listPets();
        setPets(petList.filter((p) => !p.broken));
      }
    } else {
      toast.error(`Command failed: ${result.message}`, { id: 'install-cmd' });
    }
    setInstallingFromCommand(false);
  };

  const isInstalled = (id: string) =>
    installedIds.includes(id) || pets.some((p) => p.id === id && !p.broken);

  const channelOptions: { value: DeliveryChannel; label: string; desc: string }[] = [
    { value: 'both', label: 'Both', desc: 'Web + Pet notification' },
    { value: 'pet', label: 'Pet Only', desc: 'Deliver via pet only' },
    { value: 'web', label: 'Web Only', desc: 'Standard web alert' },
    { value: 'silent', label: 'Silent', desc: 'Suppress this type' },
  ];

  const ChannelSelect = ({ value, onChange }: { value: DeliveryChannel; onChange: (v: DeliveryChannel) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as DeliveryChannel)}
      className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-xs font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-shadow cursor-pointer"
    >
      {channelOptions.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[var(--card)] text-[var(--foreground)]">{opt.label}</option>
      ))}
    </select>
  );

  const PetCard = ({ pet, isSelected }: { pet: OpenPetsPetInfo; isSelected: boolean }) => (
    <button
      onClick={() => handleSelectPet(pet.id)}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
        isSelected
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xs'
          : 'border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]/5 hover:border-[var(--border-strong)]'
      }`}
    >
      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
        <Cat className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold leading-tight truncate">{pet.display_name}</div>
        <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{pet.built_in ? 'Built-in pet' : 'Custom pet'}</div>
      </div>
      {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />}
    </button>
  );

  const CatalogPetCard = ({ entry }: { entry: CatalogEntry }) => {
    const installed = isInstalled(entry.id);
    const installing = installingId === entry.id;
    return (
      <div className="relative flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden hover:border-[var(--border-strong)] transition-all">
        <div className="flex items-center gap-3 p-3 pb-2">
          <img
            src={entry.thumbnail}
            alt={entry.displayName}
            className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] object-cover"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[var(--foreground)] leading-tight truncate">{entry.displayName}</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{entry.description}</div>
          </div>
          {installed && (
            <div className="shrink-0 p-1 rounded-full bg-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          )}
        </div>
        <div className="px-3 pb-3">
          <button
            onClick={() => handleInstall(entry.id, entry.displayName)}
            disabled={installing || installed}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              installed
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {installing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Installing…</>
            : installed ? <><CheckCircle2 className="w-3.5 h-3.5" /> Installed</>
            : <><Download className="w-3.5 h-3.5" /> Install</>}
          </button>
          {installed && (
            <button
              onClick={() => handleSelectPet(entry.id)}
              className={`w-full mt-1.5 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                petId === entry.id
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/5'
              }`}
            >
              {petId === entry.id ? 'Active Pet' : 'Select as Active'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">Desktop Pet Notifications</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Route notifications through OpenPets desktop companion for charming in-app delivery.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className={`p-4 rounded-xl border ${
        connectionState === 'available'
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : connectionState === 'loading'
          ? 'border-[var(--border)] bg-[var(--card)]'
          : 'border-amber-500/20 bg-amber-500/5'
      } flex items-start justify-between gap-4`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2.5 rounded-lg shrink-0 ${
            connectionState === 'available'
              ? 'bg-emerald-500/10 text-emerald-500'
              : connectionState === 'loading'
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
              : 'bg-amber-500/10 text-amber-500'
          }`}>
            {connectionState === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" />
            : connectionState === 'available' ? <CheckCircle2 className="w-5 h-5" />
            : <AlertCircle className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {connectionState === 'loading' && 'Discovering OpenPets…'}
                {connectionState === 'available' && 'OpenPets Connected'}
                {connectionState === 'not_installed' && 'OpenPets Not Installed'}
                {connectionState === 'not_running' && 'OpenPets Not Running'}
                {connectionState === 'no_pets' && 'No Pets Available'}
                {connectionState === 'error' && 'Connection Error'}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {connectionState === 'loading' && 'Checking for OpenPets runtime…'}
              {connectionState === 'available' && `Pet notifications ready · ${pets.length} pet${pets.length !== 1 ? 's' : ''} available`}
              {connectionState === 'not_installed' && 'Install pets below — they will appear when OpenPets is running.'}
              {connectionState === 'not_running' && 'OpenPets is installed but the background service is not running.'}
              {connectionState === 'no_pets' && 'OpenPets is running but no compatible pets were found.'}
              {connectionState === 'error' && 'An unexpected error occurred while connecting to OpenPets.'}
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={connectionState === 'loading'}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]/5 hover:border-[var(--border-strong)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${connectionState === 'loading' ? 'animate-spin' : ''}`} />
          Retry
        </button>
      </div>

      {/* Pet Browser + Install */}
      <div className="space-y-6">
        {/* Install OpenPets CTA */}
        {(connectionState === 'not_installed' || connectionState === 'not_running') && (
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Download className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Install OpenPets Desktop</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Download and run the OpenPets desktop app from your system tray.</p>
              </div>
            </div>
            <a href="https://openpets.dev" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> Download OpenPets
            </a>
          </div>
        )}

        {/* Pets Section */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500"><Cat className="w-4 h-4" /></div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">Pets</h4>
              <p className="text-xs text-[var(--muted-foreground)]">
                {connectionState === 'available'
                  ? 'Select a pet to receive notifications through.'
                  : 'Install pets now — they will appear here once OpenPets is running. '}
                <a href="https://openpets.dev/gallery" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">Browse 1000+ pets</a>.
              </p>
            </div>
          </div>

          {connectionState === 'available' && pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {pets.map((pet) => <PetCard key={pet.id} pet={pet} isSelected={pet.id === petId} />)}
            </div>
          ) : catalog.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {catalog.slice(0, 6).map((entry) => <CatalogPetCard key={entry.id} entry={entry} />)}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] pt-1">Loading catalog…</p>
          )}
        </div>

        {/* How it works — info card */}
        <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] space-y-2.5">
          <h4 className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            How Pet Notifications Work
          </h4>
          <div className="space-y-1.5 text-[11px] text-[var(--muted-foreground)] leading-relaxed">
            <p>
              <strong className="text-[var(--foreground)]">1. Install</strong> — Pick a pet from the catalog below and install it. The pet files are downloaded to your local app data folder.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">2. Select Active</strong> — Choose which installed pet receives notifications. Each pet has animated reactions (idle, thinking, working, celebrating, etc.) that play when a notification is delivered.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">3. Route Notifications</strong> — In the Delivery Channels section, pick which notification types go to your pet (Habit Reminders, Idle Alerts, Daily Summary). Each type can route to <em>Both</em>, <em>Pet Only</em>, <em>Web Only</em>, or <em>Silent</em>.
            </p>
            <p className="pt-0.5 text-[var(--text-muted)]">
              💡 Notification preferences persist across sessions. Your active pet is saved automatically.
            </p>
          </div>
        </div>

        {/* Installed Pets panel — always visible when pets are installed */}
        {localPets.length > 0 && (
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><FolderOpen className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Installed Pets ({localPets.length})</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Pets stored locally. The <strong className="text-[var(--foreground)]">Active</strong> pet receives notifications.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {localPets.map((lp) => (
                <div key={lp.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                  petId === lp.id
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--border-strong)]'
                }`}>
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden shrink-0">
                    <img
                      src={`https://openpets.dev/pets/${lp.id}/thumb.webp`}
                      alt={lp.display_name}
                      className="w-9 h-9 object-cover"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class=\"w-9 h-9 flex items-center justify-center text-[var(--text-muted)]\"><svg class=\"w-4 h-4\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 5c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z\"/><path d=\"M9 12l2 2 4-4\"/></svg></div>'; }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[var(--foreground)] truncate">{lp.display_name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">{lp.id}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      <span className="text-emerald-500">●</span> {petId === lp.id ? 'Receives notifications' : 'Click Select to activate'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectPet(lp.id)}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg transition-all ${
                      petId === lp.id
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                        : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/5'
                    }`}
                  >
                    {petId === lp.id ? <><Star className="w-3 h-3" /> Active</> : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show empty state when no pets installed yet */}
        {connectionState !== 'available' && localPets.length === 0 && !catalog.length && (
          <div className="p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] text-center">
            <div className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)] inline-flex mb-2">
              <FolderOpen className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[var(--foreground)]">No pets installed yet</p>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Install a pet from the catalog below, then select it as Active.</p>
          </div>
        )}

        {/* Install from URL / Command (hide when OpenPets is connected and has pets) */}
        {connectionState !== 'available' && (
          <>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Link2 className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">Install from URL</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">Paste a pet ZIP URL from the OpenPets gallery to install it directly.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="text" value={installUrl} onChange={(e) => setInstallUrl(e.target.value)}
                  placeholder="https://zip.openpets.dev/pets/&lt;pet-id&gt;/&lt;pet&gt;.zip"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-shadow placeholder:text-[var(--text-muted)]/50"
                  disabled={installingFromUrl} />
                <button onClick={handleInstallFromUrl} disabled={!installUrl.trim() || installingFromUrl}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                  {installingFromUrl ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Installing</>
                  : <><Download className="w-3.5 h-3.5" /> Install</>}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Terminal className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">Install from Command</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">Run any install command (e.g. from an agent instruction).</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="text" value={customCommand} onChange={(e) => setCustomCommand(e.target.value)}
                  placeholder="npx -y @open-pets/cli@latest install &lt;pet-id&gt;"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-shadow placeholder:text-[var(--text-muted)]/50"
                  disabled={installingFromCommand} />
                <button onClick={handleInstallFromCommand} disabled={!customCommand.trim() || installingFromCommand}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                  {installingFromCommand ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running</>
                  : <><Terminal className="w-3.5 h-3.5" /> Run</>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Connected-state extras */}
      {connectionState === 'available' && pets.length > 0 && (
        <>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Smartphone className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Pet Delivery</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Route notifications through your selected desktop pet.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={petDeliveryEnabled} onChange={(e) => setPetDeliveryEnabled(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-[var(--border)] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0.5px] after:left-[0.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {petDeliveryEnabled && (
            <>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><MessageCircle className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">Delivery Channels</h4>
                    <p className="text-xs text-[var(--muted-foreground)]">Configure how each notification type is delivered.</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1">
                  {[
                    { label: 'Habit Reminders', value: channelHabit, set: setChannelHabit },
                    { label: 'Idle Alerts', value: channelIdle, set: setChannelIdle },
                    { label: 'Daily Summary', value: channelSummary, set: setChannelSummary },
                  ].map((ch) => (
                    <div key={ch.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                      <div>
                        <span className="text-xs font-semibold text-[var(--foreground)]">{ch.label}</span>
                        <p className="text-[10px] text-[var(--text-muted)]">{channelOptions.find((o) => o.value === ch.value)?.desc}</p>
                      </div>
                      <ChannelSelect value={ch.value} onChange={ch.set} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button onClick={handleSendTest} disabled={sending || !status?.available}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
                  {sending ? 'Sending…' : 'Send Test to Pet'}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
