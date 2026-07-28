import { invoke } from '@tauri-apps/api/core';

const PET_RATE_LIMIT_MS = 30_000;
const petRateLimitMap = new Map<string, number>();

function checkPetRateLimit(key: string): boolean {
  const last = petRateLimitMap.get(key);
  const now = Date.now();
  if (last && now - last < PET_RATE_LIMIT_MS) return false;
  petRateLimitMap.set(key, now);
  return true;
}

export interface OpenPetsStatus {
  available: boolean;
  default_pet_id: string | null;
  default_pet_name: string | null;
  app_version: string | null;
}

export interface OpenPetsPetInfo {
  id: string;
  display_name: string;
  built_in: boolean;
  broken: boolean;
}

export interface OpenPetsSayResult {
  sent: boolean;
}

export type PetReaction =
  | 'idle' | 'thinking' | 'working' | 'editing'
  | 'running' | 'testing' | 'waiting' | 'waving'
  | 'success' | 'error' | 'celebrating';

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function discover(): Promise<OpenPetsStatus> {
  if (!isTauri()) return { available: false, default_pet_id: null, default_pet_name: null, app_version: null };
  try {
    return await invoke<OpenPetsStatus>('openpets_discover');
  } catch (err) {
    console.warn('OpenPets discover failed:', err);
    return { available: false, default_pet_id: null, default_pet_name: null, app_version: null };
  }
}

export async function say(
  message: string,
  reaction?: PetReaction,
  petId?: string,
): Promise<OpenPetsSayResult> {
  if (!isTauri()) return { sent: false };
  const key = `say:${petId ?? 'default'}`;
  if (!checkPetRateLimit(key)) {
    console.warn('OpenPets say rate-limited');
    return { sent: false };
  }
  try {
    return await invoke<OpenPetsSayResult>('openpets_say', {
      message,
      reaction: reaction ?? null,
      petId: petId ?? null,
    });
  } catch (err) {
    console.warn('OpenPets say failed:', err);
    return { sent: false };
  }
}

export async function react(
  reaction: PetReaction,
  petId?: string,
): Promise<OpenPetsSayResult> {
  if (!isTauri()) return { sent: false };
  const key = `react:${petId ?? 'default'}`;
  if (!checkPetRateLimit(key)) {
    console.warn('OpenPets react rate-limited');
    return { sent: false };
  }
  try {
    return await invoke<OpenPetsSayResult>('openpets_react', {
      reaction,
      petId: petId ?? null,
    });
  } catch (err) {
    console.warn('OpenPets react failed:', err);
    return { sent: false };
  }
}

export async function listPets(): Promise<OpenPetsPetInfo[]> {
  if (!isTauri()) return [];
  try {
    return await invoke<OpenPetsPetInfo[]>('openpets_list_pets');
  } catch (err) {
    console.warn('OpenPets list_pets failed:', err);
    return [];
  }
}

export function reactionForNotification(type: NotificationType): PetReaction {
  switch (type) {
    case 'habit': return 'waving';
    case 'idle': return 'idle';
    case 'summary': return 'thinking';
    case 'test': return 'celebrating';
    case 'task_deadline': return 'waiting';
    case 'streak': return 'success';
    case 'focus_goal': return 'working';
    case 'error': return 'error';
  }
}

export type NotificationType =
  | 'habit'
  | 'idle'
  | 'summary'
  | 'test'
  | 'task_deadline'
  | 'streak'
  | 'focus_goal'
  | 'error';

export type DeliveryChannel = 'web' | 'pet' | 'both' | 'silent';

export interface OpenPetsInstallResult {
  success: boolean;
  message: string;
  petId?: string;
}

export async function installPet(petId: string): Promise<OpenPetsInstallResult> {
  if (!isTauri()) return { success: false, message: 'Desktop runtime not available' };
  try {
    const result = await invoke<string>('openpets_install_pet', { petId });
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

export async function runInstallCommand(command: string): Promise<OpenPetsInstallResult> {
  if (!isTauri()) return { success: false, message: 'Desktop runtime not available' };
  try {
    const result = await invoke<string>('openpets_run_command', { command });
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

export async function installPetFromUrl(url: string): Promise<OpenPetsInstallResult> {
  const petId = extractPetIdFromUrl(url);
  if (petId) {
    const result = await installPet(petId);
    return { ...result, petId };
  }
  return { success: false, message: 'Could not extract a pet ID from the URL. Use a direct ZIP URL from the gallery.', petId: undefined };
}

export interface CatalogEntry {
  id: string;
  displayName: string;
  description: string;
  thumbnail: string;
  spritesheet: string;
  zip: string;
  category?: string;
  subcategory?: string;
  featured?: boolean;
}

export interface PetMeta {
  id: string;
  display_name: string;
  description: string;
  spritesheet_path: string;
  preview_path: string | null;
}

export async function fetchCatalog(): Promise<CatalogEntry[]> {
  if (!isTauri()) return [];
  try {
    return await invoke<CatalogEntry[]>('openpets_fetch_catalog');
  } catch (err) {
    console.warn('OpenPets fetch_catalog failed:', err);
    return [];
  }
}

export async function listInstalled(): Promise<PetMeta[]> {
  if (!isTauri()) return [];
  try {
    return await invoke<PetMeta[]>('openpets_list_installed');
  } catch (err) {
    console.warn('OpenPets list_installed failed:', err);
    return [];
  }
}

export function extractPetIdFromUrl(url: string): string | null {
  const match = url.match(/\/pets\/[^/]+\/([^/]+)\.zip$/);
  if (match) return match[1];
  // Try openpets protocol URL: openpets://install?source=<url>
  const srcMatch = url.match(/[?&]source=([^&]+)/);
  if (srcMatch) {
    const decoded = decodeURIComponent(srcMatch[1]);
    return extractPetIdFromUrl(decoded);
  }
  return null;
}
