'use client';

import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useState } from 'react';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils';

type AppNavbarProps = {
  onToggleSidebar: () => void;
};

export function AppNavbar({ onToggleSidebar }: AppNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition hover:text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <label className="hidden items-center gap-2 rounded-2xl border border-border/70 bg-muted/50 px-3 py-2 text-sm text-muted-foreground sm:flex sm:min-w-[320px]">
            <Search className="h-4 w-4" />
            <input
              className="w-full border-none bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Search clients, jobs, documents..."
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-primary" />
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border/70 bg-card p-3 shadow-lg">
                <p className="text-sm font-semibold text-foreground">Recent alerts</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                    Deadline reminder for PT Bintang Sejahtera
                  </div>
                  <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                    Invoice #INV-104 was approved
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2 py-1.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                AL
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">Aisyah L.</p>
                <p className="text-xs text-muted-foreground">Partner</p>
              </div>
              <ChevronDown className="mr-1 h-4 w-4 text-muted-foreground" />
            </button>

            {userMenuOpen ? (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/70 bg-card p-2 shadow-lg">
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70">
                  Profile
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70">
                  Settings
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
