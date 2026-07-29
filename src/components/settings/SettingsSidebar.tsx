'use client';

import { LucideIcon, Sliders, Palette, Bell, Database, Info, Cat, Trophy } from 'lucide-react';

export interface SettingsNavItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    id: 'tracking',
    label: 'Tracking Preferences',
    description: 'Idle detection, polling frequency, process filters',
    icon: Sliders,
  },
  {
    id: 'appearance',
    label: 'Appearance & Theme',
    description: 'Accent colors, dark mode, reduced motion',
    icon: Palette,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Habit reminders, idle alerts, daily reports',
    icon: Bell,
  },
  {
    id: 'data',
    label: 'Data & Backup',
    description: 'Database export, import, storage management',
    icon: Database,
  },
  {
    id: 'gamification',
    label: 'Gamification & XP',
    description: 'XP, levels, achievements, skill octagon',
    icon: Trophy,
  },
  {
    id: 'desktop-pet',
    label: 'Desktop Pet',
    description: 'OpenPets integration, pet selection, delivery channels',
    icon: Cat,
  },
  {
    id: 'about',
    label: 'About & System',
    description: 'App version, Tauri v2, system status',
    icon: Info,
  },
];

interface SettingsSidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function SettingsSidebar({ activeCategory, onSelectCategory }: SettingsSidebarProps) {
  return (
    <div className="w-full space-y-1">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        Settings Menu
      </div>
      <nav className="space-y-1">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20 shadow-xs'
                  : 'text-[var(--foreground)] hover:bg-[var(--background)] hover:text-emerald-500 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                isActive ? 'bg-emerald-500 text-white' : 'bg-[var(--background)] text-[var(--muted-foreground)]'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm leading-tight truncate">{item.label}</div>
                <div className="text-[11px] text-[var(--muted-foreground)] truncate mt-0.5 font-normal">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
