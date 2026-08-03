import { createClient } from '@/lib/supabase/client';

export interface InvoiceRow {
  id: string;
  user_id: string;
  client_id: string | null;
  invoice_number: string | null;
  issued_at: string;
  due_date: string | null;
  tax_period_start: string | null;
  tax_period_end: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  total: number;
  currency: string;
  notes: string | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
  clients?: { name: string } | null;
  invoice_items?: InvoiceItemRow[];
}

export interface InvoiceItemRow {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceInsert {
  client_id?: string | null;
  due_date?: string | null;
  tax_period_start?: string | null;
  tax_period_end?: string | null;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string | null;
  currency?: string;
}

export interface ItemInsert {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceFilters {
  search?: string;
  status?: string;
}

export async function getInvoices(filters?: InvoiceFilters): Promise<InvoiceRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('invoices')
    .select('*, clients(name), invoice_items(*)')
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.ilike('invoice_number', `%${filters.search}%`);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as InvoiceRow[];
}

export async function createInvoice(
  invoiceData: InvoiceInsert,
  items: ItemInsert[]
): Promise<InvoiceRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true });
  const invoiceNumber = `INV-${String((count ?? 0) + 1).padStart(4, '0')}`;

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({ ...invoiceData, user_id: user.id, invoice_number: invoiceNumber })
    .select()
    .single();
  if (invoiceError) throw invoiceError;

  const invoiceRecord = invoice as InvoiceRow;

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(items.map((item) => ({ ...item, invoice_id: invoiceRecord.id })));
    if (itemsError) throw itemsError;
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  await supabase.from('invoices').update({ total }).eq('id', invoiceRecord.id);

  return { ...invoiceRecord, total };
}

export async function updateInvoice(id: string, data: Partial<InvoiceInsert & { total?: number }>): Promise<InvoiceRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from('invoices')
    .update(data)
    .eq('id', id)
    .select('*, clients(name)')
    .single();
  if (error) throw error;
  return updated as InvoiceRow;
}

export async function deleteInvoice(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) throw error;
}

export async function getPendingInvoiceStats(): Promise<{ count: number; total: number }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('total, status')
    .in('status', ['draft', 'sent', 'overdue']);
  if (error) throw error;
  const rows = (data ?? []) as { total: number; status: string }[];
  return {
    count: rows.length,
    total: rows.reduce((sum, inv) => sum + (inv.total ?? 0), 0),
  };
}
