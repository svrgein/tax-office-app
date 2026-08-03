import { createClient } from '@/lib/supabase/client';

export interface ExpenseRow {
  id: string;
  user_id: string;
  client_id: string | null;
  job_id: string | null;
  category_id: number | null;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  incurred_at: string;
  receipt_url: string | null;
  metadata: unknown;
  created_at: string;
  clients?: { name: string } | null;
  expense_categories?: { name: string } | null;
}

export interface ExpenseCategoryRow {
  id: number;
  name: string;
  description: string | null;
}

export interface ExpenseInsert {
  client_id?: string | null;
  job_id?: string | null;
  category_id?: number | null;
  description: string;
  amount: number;
  type?: 'debit' | 'credit';
  incurred_at?: string;
  receipt_url?: string | null;
}

export interface ExpenseFilters {
  search?: string;
  client_id?: string;
  category_id?: number;
  type?: string;
}

export async function getExpenses(filters?: ExpenseFilters): Promise<ExpenseRow[]> {
  const supabase = createClient();
  let query = supabase
    .from('expenses')
    .select('*, clients(name), expense_categories(name)')
    .order('incurred_at', { ascending: false });

  if (filters?.search) {
    query = query.ilike('description', `%${filters.search}%`);
  }
  if (filters?.client_id && filters.client_id !== 'all') {
    query = query.eq('client_id', filters.client_id);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ExpenseRow[];
}

export async function getExpenseCategories(): Promise<ExpenseCategoryRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data ?? []) as ExpenseCategoryRow[];
}

export async function createExpense(data: ExpenseInsert): Promise<ExpenseRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: created, error } = await supabase
    .from('expenses')
    .insert({ ...data, user_id: user.id })
    .select('*, clients(name), expense_categories(name)')
    .single();
  if (error) throw error;
  return created as ExpenseRow;
}

export async function updateExpense(id: string, data: Partial<ExpenseInsert>): Promise<ExpenseRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from('expenses')
    .update(data)
    .eq('id', id)
    .select('*, clients(name), expense_categories(name)')
    .single();
  if (error) throw error;
  return updated as ExpenseRow;
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

export async function getExpenseSummary(): Promise<{ total: number; month: string }> {
  const supabase = createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const { data, error } = await supabase
    .from('expenses')
    .select('amount, type')
    .gte('incurred_at', startOfMonth);
  if (error) throw error;

  const rows = (data ?? []) as { amount: number; type: string }[];
  const total = rows.reduce((sum, e) => {
    return e.type === 'debit' ? sum + e.amount : sum - e.amount;
  }, 0);

  return { total, month: now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }) };
}
