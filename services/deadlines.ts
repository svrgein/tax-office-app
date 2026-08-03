import { createClient } from '@/lib/supabase/client';

export interface DeadlineRow {
  id: string;
  user_id: string;
  client_id: string | null;
  job_id: string | null;
  title: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  remind: boolean;
  status: 'upcoming' | 'done' | 'overdue';
  notes: string | null;
  created_at: string;
  clients?: { name: string } | null;
  jobs?: { title: string } | null;
}

export interface DeadlineInsert {
  client_id?: string | null;
  job_id?: string | null;
  title: string;
  due_date: string;
  priority?: 'low' | 'medium' | 'high';
  remind?: boolean;
  status?: 'upcoming' | 'done' | 'overdue';
  notes?: string | null;
}

export interface DeadlineFilters {
  search?: string;
  status?: string;
  priority?: string;
  client_id?: string;
}

export async function getDeadlines(filters?: DeadlineFilters): Promise<DeadlineRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('deadlines')
    .select('*, clients(name), jobs(title)')
    .order('due_date', { ascending: true });

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.client_id && filters.client_id !== 'all') {
    query = query.eq('client_id', filters.client_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DeadlineRow[];
}

export async function createDeadline(data: DeadlineInsert): Promise<DeadlineRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: created, error } = await supabase
    .from('deadlines')
    .insert({ ...data, user_id: user.id })
    .select('*, clients(name), jobs(title)')
    .single();
  if (error) throw error;
  return created as DeadlineRow;
}

export async function updateDeadline(id: string, data: Partial<DeadlineInsert>): Promise<DeadlineRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from('deadlines')
    .update(data)
    .eq('id', id)
    .select('*, clients(name), jobs(title)')
    .single();
  if (error) throw error;
  return updated as DeadlineRow;
}

export async function deleteDeadline(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('deadlines').delete().eq('id', id);
  if (error) throw error;
}

export async function getDeadlineStats(): Promise<{ upcoming: number; overdue: number; dueToday: number }> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('deadlines')
    .select('status, due_date, priority');
  if (error) throw error;

  const rows = (data ?? []) as { status: string; due_date: string; priority: string }[];
  const upcoming = rows.filter((d) => d.status === 'upcoming').length;
  const overdue = rows.filter((d) => d.status === 'overdue').length;
  const dueToday = rows.filter((d) => d.due_date === today).length;

  return { upcoming, overdue, dueToday };
}
