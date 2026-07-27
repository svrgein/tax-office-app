'use client';

import { useState } from 'react';

import { AppNavbar } from '@/components/layout/app-navbar';
import { AppSidebar } from '@/components/layout/app-sidebar';

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:flex">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1">
          <AppNavbar onToggleSidebar={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
