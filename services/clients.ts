import { createClient } from '@/lib/supabase/client';

export interface ClientRow {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  npwp: string | null;
  pic_name: string | null;
  pic_email: string | null;
  pic_phone: string | null;
  status: 'active' | 'at_risk' | 'on_hold';
  tax_status: 'compliant' | 'needs_review' | 'pending_audit';
  notes: string | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface ClientInsert {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null;
  npwp?: string | null;
  pic_name?: string | null;
  pic_email?: string | null;
  pic_phone?: string | null;
  status?: 'active' | 'at_risk' | 'on_hold';
  tax_status?: 'compliant' | 'needs_review' | 'pending_audit';
  notes?: string | null;
}

export interface ClientFilters {
  search?: string;
  status?: string;
  tax_status?: string;
}

export async function getClients(filters?: ClientFilters): Promise<ClientRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,npwp.ilike.%${filters.search}%,pic_name.ilike.%${filters.search}%`
    );
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.tax_status && filters.tax_status !== 'all') {
    query = query.eq('tax_status', filters.tax_status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ClientRow[];
}

export async function getClientById(id: string): Promise<ClientRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as ClientRow;
}

export async function createClient_(data: ClientInsert): Promise<ClientRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: created, error } = await supabase
    .from('clients')
    .insert({ ...data, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return created as ClientRow;
}

export async function updateClient(id: string, data: Partial<ClientInsert>): Promise<ClientRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from('clients')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return updated as ClientRow;
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
}

export async function getClientCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}
