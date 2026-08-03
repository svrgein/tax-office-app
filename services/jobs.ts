import { createClient } from '@/lib/supabase/client';

export interface JobRow {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  status: 'open' | 'in_progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  amount: number;
  progress: number;
  created_at: string;
  updated_at: string;
  clients?: { name: string } | null;
}

export interface JobInsert {
  client_id?: string | null;
  title: string;
  description?: string | null;
  status?: 'open' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string | null;
  amount?: number;
  progress?: number;
}

export interface JobFilters {
  search?: string;
  status?: string;
  client_id?: string;
}

export async function getJobs(filters?: JobFilters): Promise<JobRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('jobs')
    .select('*, clients(name)')
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.client_id && filters.client_id !== 'all') {
    query = query.eq('client_id', filters.client_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as JobRow[];
}

export async function createJob(data: JobInsert): Promise<JobRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: created, error } = await supabase
    .from('jobs')
    .insert({ ...data, user_id: user.id })
    .select('*, clients(name)')
    .single();
  if (error) throw error;
  return created as JobRow;
}

export async function updateJob(id: string, data: Partial<JobInsert>): Promise<JobRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from('jobs')
    .update(data)
    .eq('id', id)
    .select('*, clients(name)')
    .single();
  if (error) throw error;
  return updated as JobRow;
}

export async function deleteJob(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
}

export async function getActiveJobCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'in_progress']);
  if (error) throw error;
  return count ?? 0;
}
