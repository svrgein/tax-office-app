'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, FileText, Loader2, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageShell } from '@/components/shared/ui/page-shell';
import { EmptyStateCard } from '@/components/shared/ui/empty-state-card';
import { LoadingTable } from '@/components/shared/ui/loading-table';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, type InvoiceRow } from '@/services/invoices';
import { getClients, type ClientRow } from '@/services/clients';

type Client = ClientRow;
type InvoiceStatus = InvoiceRow['status'];

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-primary/10 text-primary',
  paid: 'bg-success/10 text-success',
  overdue: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};




const EMPTY_FORM = {
  client_id: '',
  due_date: '',
  status: 'draft' as InvoiceStatus,
  notes: '',
  items: [{ description: '', quantity: 1, unit_price: 0 }],
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [invData, clientsData] = await Promise.all([
        getInvoices({ search, status: statusFilter }),
        getClients(),
      ]);
      setInvoices(invData as InvoiceRow[]);
      setClients(clientsData);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  function formatIDR(n: number) {
    return `Rp ${n.toLocaleString('id-ID')}`;
  }

  function openCreate() {
    setEditingInvoice(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(inv: InvoiceRow) {
    setEditingInvoice(inv);
    setForm({
      client_id: (inv as unknown as { client_id: string }).client_id ?? '',
      due_date: inv.due_date ?? '',
      status: inv.status,
      notes: (inv as unknown as { notes: string }).notes ?? '',
      items: inv.invoice_items?.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })) ?? [{ description: '', quantity: 1, unit_price: 0 }],
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingInvoice) {
        const updated = await updateInvoice(editingInvoice.id, {
          client_id: form.client_id || null,
          due_date: form.due_date || null,
          status: form.status,
          notes: form.notes || null,
        });
        setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated as InvoiceRow : i)));
        toast.success('Invoice diperbarui');
      } else {
        const created = await createInvoice(
          { client_id: form.client_id || null, due_date: form.due_date || null, status: form.status, notes: form.notes || null },
          form.items
        );
        await loadData();
        toast.success('Invoice dibuat');
      }
      setModalOpen(false);
    } catch {
      toast.error('Gagal menyimpan invoice');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      toast.success('Invoice dihapus');
    } catch {
      toast.error('Gagal menghapus');
    } finally {
      setDeletingId(null);
    }
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { description: '', quantity: 1, unit_price: 0 }] }));
  }
  function removeItem(idx: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }
  function updateItem(idx: number, field: string, value: string | number) {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  }
  const formTotal = form.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  return (
    <DashboardShell>
      <PageShell
        badge="Invoice"
        title="Invoice overview"
        description="Monitor client invoices, payment status, and due dates."
        action={
          <button onClick={openCreate} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </button>
        }
      >
        <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground md:min-w-[280px]">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nomor invoice..."
                className="w-full border-none bg-transparent outline-none" />
            </label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground">
              <option value="all">All status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <LoadingTable />
          ) : invoices.length === 0 ? (
            <div className="mt-4">
              <EmptyStateCard title="Belum ada invoice" description="Buat invoice pertama Anda sekarang." />
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-[20px] border border-border/70">
              <table className="min-w-full divide-y divide-border/70 text-left">
                <thead className="bg-muted/60">
                  <tr>
                    {['Invoice #', 'Klien', 'Total', 'Status', 'Due Date', 'Aksi'].map((h) => (
                      <th key={h} className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-background/50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{inv.invoice_number ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{inv.clients?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{formatIDR(inv.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{inv.due_date ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(inv)} className="rounded-xl border border-border/70 p-2 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(inv.id)} disabled={deletingId === inv.id}
                            className="rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive disabled:opacity-50">
                            {deletingId === inv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] border border-border/70 bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/70 p-6">
              <h2 className="text-xl font-semibold text-foreground">{editingInvoice ? 'Edit Invoice' : 'Buat Invoice Baru'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Klien</label>
                  <select value={form.client_id} onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="">Pilih klien</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as InvoiceStatus }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Due Date</label>
                  <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              </div>

              {/* Line items */}
              {!editingInvoice && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Item Invoice</label>
                    <button type="button" onClick={addItem} className="text-xs text-primary hover:underline">+ Tambah item</button>
                  </div>
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid gap-2 rounded-2xl border border-border/70 p-3 sm:grid-cols-[1fr_80px_100px_40px]">
                      <input value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Deskripsi layanan"
                        className="w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                        placeholder="Qty" min={0}
                        className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <input type="number" value={item.unit_price} onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))}
                        placeholder="Harga" min={0}
                        className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <button type="button" onClick={() => removeItem(idx)} disabled={form.items.length === 1}
                        className="flex items-center justify-center rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive disabled:opacity-30">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <p className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      Total: {formatIDR(formTotal)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Catatan</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="Catatan tambahan..." />
              </div>

              <div className="flex justify-end gap-3 border-t border-border/70 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingInvoice ? 'Simpan' : 'Buat Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
