'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sliders, Sparkles } from 'lucide-react';
import {
  SettingsSidebar,
  SETTINGS_NAV_ITEMS,
  type SettingsNavItem,
  TrackingPreferences,
  AppCategoryManager,
  AppearanceSettings,
  NotificationsSettings,
  DataManagement,
  AboutSettings,
} from '@/components/settings';

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('tracking');
  const [mobileView, setMobileView] = useState<'nav' | 'detail'>('nav');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectCategory = (id: string) => {
    setActiveCategory(id);
    if (isMobile) {
      setMobileView('detail');
    }
  };

  const activeItem = SETTINGS_NAV_ITEMS.find((item: SettingsNavItem) => item.id === activeCategory) || SETTINGS_NAV_ITEMS[0];

  const renderContent = () => {
    switch (activeCategory) {
      case 'tracking':
        return (
          <div className="space-y-8">
            <TrackingPreferences />
            <AppCategoryManager />
          </div>
        );
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'data':
        return <DataManagement />;
      case 'about':
        return <AboutSettings />;
      default:
        return <TrackingPreferences />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto pb-16 px-2 sm:px-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20 mb-2">
            <Sparkles className="size-3" />
            <span>Preferences & Control Center</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Settings
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
            Configure desktop activity tracking, notifications, appearance themes, and database backups.
          </p>
        </div>
      </div>

      {/* Mobile Detail Navigation Back Bar */}
      {isMobile && mobileView === 'detail' && (
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)] mb-4">
          <button
            onClick={() => setMobileView('nav')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings Menu
          </button>
          <span className="text-xs font-bold text-[var(--muted-foreground)]">•</span>
          <span className="text-xs font-bold text-emerald-500">{activeItem.label}</span>
        </div>
      )}

      {/* 2-Column Sidebar Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav Column */}
        {(!isMobile || mobileView === 'nav') && (
          <div className="md:col-span-4 lg:col-span-3 border border-[var(--border)] bg-[var(--card)] rounded-2xl p-3 shadow-xs">
            <SettingsSidebar
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        )}

        {/* Content Column */}
        {(!isMobile || mobileView === 'detail') && (
          <div className="md:col-span-8 lg:col-span-9 border border-[var(--border)] bg-[var(--card)] rounded-2xl p-6 shadow-xs min-h-[500px]">
            {renderContent()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
