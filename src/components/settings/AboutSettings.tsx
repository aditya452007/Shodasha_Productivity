'use client';

import { Info, Shield, HardDrive, Cpu } from 'lucide-react';

export function AboutSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">About & System Info</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Technical specifications, version details, and backend status for Shodasha Desktop.
        </p>
      </div>

      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] overflow-hidden shrink-0 flex items-center justify-center p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Shodasha Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">Shodasha Productivity</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Version 0.1.0 • Desktop Time & Productivity Tracker</p>
          </div>
        </div>

        <hr className="border-[var(--border)]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
            <span className="text-[var(--muted-foreground)] block mb-1 flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Desktop Architecture
            </span>
            <span className="font-semibold text-[var(--foreground)]">Tauri v2 + Next.js 16 (Turbopack)</span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
            <span className="text-[var(--muted-foreground)] block mb-1 flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> Embedded Database
            </span>
            <span className="font-semibold text-[var(--foreground)]">SQLite (rusqlite native engine)</span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
            <span className="text-[var(--muted-foreground)] block mb-1 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Privacy & Local Storage
            </span>
            <span className="font-semibold text-[var(--foreground)]">100% Offline & Local On-Device</span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
            <span className="text-[var(--muted-foreground)] block mb-1 flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-emerald-500" /> System OS Target
            </span>
            <span className="font-semibold text-[var(--foreground)]">Windows (windows-sys foreground API)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
