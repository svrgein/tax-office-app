'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageShell } from '@/components/shared/ui/page-shell';
import { EmptyStateCard } from '@/components/shared/ui/empty-state-card';
import { LoadingTable } from '@/components/shared/ui/loading-table';
import { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseCategories, type ExpenseRow, type ExpenseCategoryRow } from '@/services/expenses';
import { getClients, type ClientRow } from '@/services/clients';

type Client = ClientRow;
type Category = ExpenseCategoryRow;



const EMPTY_FORM = {
  client_id: '',
  category_id: '',
  description: '',
  amount: 0,
  type: 'debit' as 'debit' | 'credit',
  incurred_at: new Date().toISOString().split('T')[0],
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expData, clientsData, catsData] = await Promise.all([
        getExpenses({ search, client_id: clientFilter, type: typeFilter }),
        getClients(),
        getExpenseCategories(),
      ]);
      setExpenses(expData as ExpenseRow[]);
      setClients(clientsData);
      setCategories(catsData);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [search, clientFilter, typeFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  function formatIDR(n: number) {
    return `Rp ${n.toLocaleString('id-ID')}`;
  }

  const totalDebit = expenses.filter((e) => e.type === 'debit').reduce((s, e) => s + e.amount, 0);
  const totalCredit = expenses.filter((e) => e.type === 'credit').reduce((s, e) => s + e.amount, 0);

  function openCreate() {
    setEditingExpense(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(exp: ExpenseRow) {
    setEditingExpense(exp);
    setForm({
      client_id: exp.client_id ?? '',
      category_id: String(exp.category_id ?? ''),
      description: exp.description,
      amount: exp.amount,
      type: exp.type,
      incurred_at: exp.incurred_at,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        client_id: form.client_id || null,
        category_id: form.category_id ? Number(form.category_id) : null,
        description: form.description,
        amount: form.amount,
        type: form.type,
        incurred_at: form.incurred_at,
      };
      if (editingExpense) {
        const updated = await updateExpense(editingExpense.id, payload);
        setExpenses((prev) => prev.map((ex) => (ex.id === updated.id ? updated as ExpenseRow : ex)));
        toast.success('Pengeluaran diperbarui');
      } else {
        await createExpense(payload);
        await loadData();
        toast.success('Pengeluaran ditambahkan');
      }
      setModalOpen(false);
    } catch {
      toast.error('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success('Pengeluaran dihapus');
    } catch {
      toast.error('Gagal menghapus');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardShell>
      <PageShell
        badge="Client Expenses"
        title="Track client expenses and balance flow"
        description="Maintain a clear audit trail of spend, refunds, and your running balance history."
        action={
          <button onClick={openCreate} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add expense
          </button>
        }
      >
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Debit', value: formatIDR(totalDebit), color: 'text-destructive' },
            { label: 'Total Credit', value: formatIDR(totalCredit), color: 'text-success' },
            { label: 'Net', value: formatIDR(totalCredit - totalDebit), color: 'text-foreground' },
          ].map((s) => (
            <div key={s.label} className="rounded-[20px] border border-border/70 bg-card/90 p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground lg:min-w-[300px]">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pengeluaran..."
                className="w-full border-none bg-transparent outline-none" />
            </label>
            <div className="flex gap-2 flex-wrap">
              <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}
                className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground">
                <option value="all">All clients</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground">
                <option value="all">Debit & Credit</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingTable />
          ) : expenses.length === 0 ? (
            <div className="mt-4">
              <EmptyStateCard title="Belum ada pengeluaran" description="Tambahkan pengeluaran pertama Anda." />
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-[20px] border border-border/70 overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70 text-left">
                <thead className="bg-muted/60">
                  <tr>
                    {['Tanggal', 'Klien', 'Kategori', 'Deskripsi', 'Tipe', 'Jumlah', 'Aksi'].map((h) => (
                      <th key={h} className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-background/50">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{exp.incurred_at}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{exp.clients?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{exp.expense_categories?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{exp.description}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${exp.type === 'debit' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                          {exp.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{formatIDR(exp.amount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(exp)} className="rounded-xl border border-border/70 p-2 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(exp.id)} disabled={deletingId === exp.id}
                            className="rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive disabled:opacity-50">
                            {deletingId === exp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageShell>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-border/70 bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/70 p-6">
              <h2 className="text-xl font-semibold text-foreground">{editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Deskripsi *</label>
                <input required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Langganan software, transport, dll" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Jumlah (IDR) *</label>
                  <input required type="number" min={0} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Tipe</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'debit' | 'credit' }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="debit">Debit (keluar)</option>
                    <option value="credit">Credit (masuk)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Tanggal</label>
                  <input type="date" value={form.incurred_at} onChange={(e) => setForm((f) => ({ ...f, incurred_at: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Kategori</label>
                  <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Klien (opsional)</label>
                <select value={form.client_id} onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="">Tanpa klien</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 border-t border-border/70 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingExpense ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
