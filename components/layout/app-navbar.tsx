'use client';

import Link from 'next/link';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { createClient } from '@/lib/supabase/client';

type AppNavbarProps = {
  onToggleSidebar: () => void;
};

export function AppNavbar({ onToggleSidebar }: AppNavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('U');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const fullName = user.user_metadata?.full_name ?? '';
      const email = user.email ?? '';
      setUserEmail(email);
      if (fullName) {
        setUserName(fullName.split(' ')[0] + (fullName.split(' ')[1] ? ' ' + fullName.split(' ')[1][0] + '.' : ''));
        setUserInitials(fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
      } else {
        setUserName(email.split('@')[0] ?? '');
        setUserInitials(email.slice(0, 2).toUpperCase());
      }
    });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

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
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-primary" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border/70 bg-card p-3 shadow-lg">
                <p className="text-sm font-semibold text-foreground">Pemberitahuan</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                    Notifikasi real-time akan ditampilkan di sini
                  </div>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* User menu */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2 py-1.5 transition hover:border-primary/40"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {userInitials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">{userName || '...'}</p>
                <p className="max-w-[120px] truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <ChevronDown className="mr-1 h-4 w-4 text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border/70 bg-card p-2 shadow-lg">
                <div className="mb-2 px-3 py-2 border-b border-border/70">
                  <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70"
                >
                  <User className="h-4 w-4" />
                  Profil
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70"
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </Link>
                <hr className="my-1 border-border/70" />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? 'Keluar...' : 'Keluar'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
