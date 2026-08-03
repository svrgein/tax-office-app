'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageShell } from '@/components/shared/ui/page-shell';
import { EmptyStateCard } from '@/components/shared/ui/empty-state-card';

const summaryCards = [
  { label: 'Revenue', value: 'Rp 312M', helper: '+8.2% vs last month' },
  { label: 'Expense', value: 'Rp 43.9M', helper: 'Within budget' },
  { label: 'Clients', value: '184', helper: '12 new this month' },
];

export default function ReportsPage() {
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('month');

  return (
    <DashboardShell>
      <PageShell
        badge="Reports"
        title="Executive reporting"
        description="Track performance, cost efficiency, and client growth with polished summary cards and mock analytics."
        action={
          <Link href="/dashboard/reports" className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold text-foreground">{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.helper}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-4 w-4" />
              <h2 className="text-lg font-semibold text-foreground">Monthly chart placeholder</h2>
            </div>
            <div className="flex gap-2">
              <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground">
                <option value="month">This month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
              <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground">
                <option value="all">All clients</option>
                <option value="bintang">PT Bintang Abadi</option>
                <option value="sinar">CV Sinar Mandiri</option>
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] border border-border/70 bg-background/70 p-6">
            <div className="flex h-56 items-end justify-between gap-2 rounded-[18px] border border-dashed border-border/70 bg-muted/30 p-4">
              {[40, 70, 55, 85, 95, 78].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-2xl bg-primary/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>

        <EmptyStateCard title="Reports are ready to share" description="Use the export action to download a snapshot for board review or client communication." />
      </PageShell>
    </DashboardShell>
  );
}
