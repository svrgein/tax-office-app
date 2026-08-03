import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Plus,
  Receipt,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getDashboardStats, formatIDR } from '@/services/dashboard';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { SectionCard } from '@/components/shared/dashboard/section-card';
import { StatCard } from '@/components/shared/dashboard/stat-card';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

const quickActions = [
  { label: 'Add Client', href: '/dashboard/clients', icon: <Users className="h-4 w-4" /> },
  { label: 'Add Expense', href: '/dashboard/expenses', icon: <Wallet className="h-4 w-4" /> },
  { label: 'Upload Document', href: '/dashboard/documents', icon: <FileText className="h-4 w-4" /> },
  { label: 'Create Invoice', href: '/dashboard/invoices', icon: <Plus className="h-4 w-4" /> },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let stats;
  try {
    stats = await getDashboardStats();
  } catch {
    stats = {
      totalClients: 0,
      activeJobs: 0,
      pendingInvoices: 0,
      pendingInvoiceTotal: 0,
      dueToday: 0,
      recentActivities: [],
      upcomingDeadlines: [],
      recentDocuments: [],
    };
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User';
  const today = format(new Date(), 'EEEE, d MMMM yyyy', { locale: idLocale });

  const statCards = [
    {
      title: 'Total Clients',
      value: String(stats.totalClients),
      detail: 'Klien terdaftar',
      trend: 'up' as const,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Active Jobs',
      value: String(stats.activeJobs),
      detail: 'Open & in progress',
      trend: 'up' as const,
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: 'Deadlines Today',
      value: String(stats.dueToday),
      detail: stats.dueToday > 0 ? 'Perlu perhatian' : 'Semua aman',
      trend: stats.dueToday > 3 ? ('down' as const) : ('up' as const),
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Pending Invoices',
      value: String(stats.pendingInvoices),
      detail: formatIDR(stats.pendingInvoiceTotal) + ' open',
      trend: 'down' as const,
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: 'Total Invoice Value',
      value: formatIDR(stats.pendingInvoiceTotal),
      detail: 'Belum terbayar',
      trend: 'up' as const,
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
  ];

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Weekly performance overview
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Selamat datang, {displayName}.
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Anda memiliki {stats.dueToday} deadline hari ini, {stats.activeJobs} pekerjaan aktif, dan {stats.pendingInvoices} invoice yang menunggu.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              {today}
            </div>
            <p className="mt-1">{stats.dueToday} prioritas hari ini</p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <SectionCard
              title="Upcoming Tax Deadlines"
              description="Prioritas 7 hari ke depan"
            >
              <div className="space-y-3">
                {stats.upcomingDeadlines.length === 0 ? (
                  <p className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    Tidak ada deadline yang mendekat. 🎉
                  </p>
                ) : (
                  stats.upcomingDeadlines.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {item.clients?.name ?? 'Tanpa klien'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          item.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-sm text-muted-foreground">{item.due_date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Dokumen Terbaru"
              description="File terbaru yang diunggah"
            >
              <div className="space-y-3">
                {stats.recentDocuments.length === 0 ? (
                  <p className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    Belum ada dokumen.{' '}
                    <Link href="/dashboard/documents" className="text-primary underline">Upload sekarang</Link>
                  </p>
                ) : (
                  stats.recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.clients?.name ?? '—'} • {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : '—'}
                          </p>
                        </div>
                      </div>
                      <Link href="/dashboard/documents" className="flex items-center text-sm font-medium text-primary">
                        View <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Aktivitas Terbaru"
              description="Perubahan terakhir di workspace"
            >
              <div className="space-y-3">
                {stats.recentActivities.length === 0 ? (
                  <p className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    Belum ada aktivitas.
                  </p>
                ) : (
                  stats.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-success/10 p-2 text-success">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">{activity.action}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{activity.entity_type}</p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard title="Quick Actions" description="Aksi cepat yang sering digunakan">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="rounded-lg bg-primary/10 p-2 text-primary">
                        {action.icon}
                      </span>
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
