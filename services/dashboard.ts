import { createClient } from '@/lib/supabase/server';

export interface DashboardStats {
  totalClients: number;
  activeJobs: number;
  pendingInvoices: number;
  pendingInvoiceTotal: number;
  dueToday: number;
  recentActivities: Array<{
    id: string;
    action: string;
    entity_type: string | null;
    created_at: string;
    changes: unknown;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    due_date: string;
    priority: string;
    clients: { name: string } | null;
  }>;
  recentDocuments: Array<{
    id: string;
    name: string;
    size: number | null;
    created_at: string;
    clients: { name: string } | null;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const [
    clientsRes,
    jobsRes,
    invoicesRes,
    deadlinesRes,
    activitiesRes,
    upcomingDeadlinesRes,
    recentDocsRes,
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('invoices').select('total, status').in('status', ['draft', 'sent', 'overdue']),
    supabase.from('deadlines').select('due_date').eq('status', 'upcoming'),
    supabase.from('activity_logs').select('id, action, entity_type, created_at, changes').order('created_at', { ascending: false }).limit(5),
    supabase.from('deadlines').select('id, title, due_date, priority, clients(name)').eq('status', 'upcoming').gte('due_date', today).order('due_date', { ascending: true }).limit(5),
    supabase.from('documents').select('id, name, size, created_at, clients(name)').order('created_at', { ascending: false }).limit(5),
  ]);

  const invoices = (invoicesRes.data ?? []) as { total: number; status: string }[];
  const deadlines = (deadlinesRes.data ?? []) as { due_date: string }[];

  const pendingInvoices = invoices.length;
  const pendingInvoiceTotal = invoices.reduce((sum, inv) => sum + (inv.total ?? 0), 0);
  const dueToday = deadlines.filter((d) => d.due_date === today).length;

  return {
    totalClients: clientsRes.count ?? 0,
    activeJobs: jobsRes.count ?? 0,
    pendingInvoices,
    pendingInvoiceTotal,
    dueToday,
    recentActivities: (activitiesRes.data ?? []) as DashboardStats['recentActivities'],
    upcomingDeadlines: (upcomingDeadlinesRes.data ?? []) as unknown as DashboardStats['upcomingDeadlines'],
    recentDocuments: (recentDocsRes.data ?? []) as unknown as DashboardStats['recentDocuments'],
  };
}

export function formatIDR(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}K`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
