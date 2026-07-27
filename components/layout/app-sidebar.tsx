'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BadgeDollarSign,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  FolderKanban,
  LayoutGrid,
  ReceiptText,
  Settings,
  Users,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutGrid className="h-4 w-4" /> },
  { label: 'Clients', href: '/dashboard/clients', icon: <Users className="h-4 w-4" /> },
  { label: 'Jobs', href: '/dashboard/jobs', icon: <BriefcaseBusiness className="h-4 w-4" /> },
  { label: 'Deadlines', href: '/dashboard/deadlines', icon: <CalendarClock className="h-4 w-4" /> },
  { label: 'Expenses', href: '/dashboard/expenses', icon: <ReceiptText className="h-4 w-4" /> },
  { label: 'Documents', href: '/dashboard/documents', icon: <FolderKanban className="h-4 w-4" /> },
  { label: 'Invoices', href: '/dashboard/invoices', icon: <BadgeDollarSign className="h-4 w-4" /> },
];

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition lg:hidden',
          isOpen ? 'block' : 'hidden',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/70 bg-card/95 px-4 py-5 shadow-xl backdrop-blur transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:border-r lg:bg-card/90 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between lg:justify-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Tax Office
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Control Center</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border/70 p-2 text-muted-foreground transition hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
              >
                <span className="rounded-xl bg-background/80 p-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">Daily sync ready</p>
              <p className="mt-1 text-sm text-muted-foreground">
                3 important tasks are due today.
              </p>
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Settings className="h-4 w-4" />
            Configure alerts
          </button>
        </div>
      </aside>
    </>
  );
}
