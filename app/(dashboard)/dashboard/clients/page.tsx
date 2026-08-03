'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import {
  getClients,
  createClient_,
  updateClient,
  deleteClient,
  type ClientRow,
  type ClientInsert,
} from '@/services/clients';

type Client = ClientRow;

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  at_risk: 'At Risk',
  on_hold: 'On Hold',
};
const TAX_STATUS_LABEL: Record<string, string> = {
  compliant: 'Compliant',
  needs_review: 'Needs Review',
  pending_audit: 'Pending Audit',
};

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  npwp: '',
  tax_id: '',
  pic_name: '',
  pic_email: '',
  pic_email: '',
  pic_phone: '',
  status: 'active' as 'active' | 'at_risk' | 'on_hold',
  tax_status: 'compliant' as 'compliant' | 'needs_review' | 'pending_audit',
  notes: '',
};

export default function ClientManagementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTaxStatus, setSelectedTaxStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClients({ search, status: selectedStatus, tax_status: selectedTaxStatus });
      setClients(data);
    } catch (err) {
      toast.error('Gagal memuat data klien');
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, selectedTaxStatus]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => { setPage(1); }, [search, selectedStatus, selectedTaxStatus]);

  const totalPages = Math.max(1, Math.ceil(clients.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = clients.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function openCreate() {
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      address: client.address ?? '',
      npwp: client.npwp ?? '',
      tax_id: client.tax_id ?? '',
      pic_name: client.pic_name ?? '',
      pic_email: client.pic_email ?? '',
      pic_phone: client.pic_phone ?? '',
      status: client.status,
      tax_status: client.tax_status,
      notes: client.notes ?? '',
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingClient) {
        const updated = await updateClient(editingClient.id, form);
        setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success('Klien berhasil diperbarui');
      } else {
        const created = await createClient_(form as Omit<ClientInsert, 'user_id'>);
        setClients((prev) => [created, ...prev]);
        toast.success('Klien berhasil ditambahkan');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error('Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success('Klien berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus klien');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Client management
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Kelola portofolio klien Anda.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {clients.length} klien terdaftar. Lacak kewajiban pajak, pekerjaan aktif, dan status dalam satu tampilan.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Client
          </button>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground sm:min-w-[280px]">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NPWP, email, PIC..."
              className="w-full border-none bg-transparent outline-none"
            />
          </label>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="at_risk">At Risk</option>
              <option value="on_hold">On Hold</option>
            </select>
            <select
              value={selectedTaxStatus}
              onChange={(e) => setSelectedTaxStatus(e.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground"
            >
              <option value="all">All Tax Status</option>
              <option value="compliant">Compliant</option>
              <option value="needs_review">Needs Review</option>
              <option value="pending_audit">Pending Audit</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[24px] border border-border/70 bg-card/90 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PlusCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Belum ada klien</p>
              <p className="mt-1 text-sm text-muted-foreground">Tambahkan klien pertama Anda sekarang</p>
              <button onClick={openCreate} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                + Tambah Klien
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70 text-left">
                <thead className="bg-muted/60">
                  <tr>
                    {['Nama / NPWP', 'PIC', 'Status', 'Tax Status', 'Kontak', 'Aksi'].map((h) => (
                      <th key={h} className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-background/50">
                  {paginated.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.npwp ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {client.pic_name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          client.status === 'active' ? 'bg-success/10 text-success' :
                          client.status === 'at_risk' ? 'bg-destructive/10 text-destructive' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {STATUS_LABEL[client.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          client.tax_status === 'compliant' ? 'bg-success/10 text-success' :
                          client.tax_status === 'needs_review' ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {TAX_STATUS_LABEL[client.tax_status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        <p>{client.email ?? '—'}</p>
                        <p>{client.phone ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(client)}
                            className="rounded-xl border border-border/70 p-2 text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            disabled={deletingId === client.id}
                            className="rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === client.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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

        {/* Pagination */}
        {clients.length > 0 && (
          <div className="flex flex-col gap-3 rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, clients.length)} dari {clients.length} klien
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={safePage === 1}
                className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium disabled:opacity-50">
                <ArrowLeft className="mr-2 h-4 w-4" /> Prev
              </button>
              <span className="rounded-full bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
                {safePage} / {totalPages}
              </span>
              <button onClick={() => setPage((v) => Math.min(totalPages, v + 1))} disabled={safePage === totalPages}
                className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium disabled:opacity-50">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] border border-border/70 bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/70 p-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingClient ? 'Edit Klien' : 'Tambah Klien Baru'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Nama Perusahaan / Klien *</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="PT Contoh Makmur" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">NPWP</label>
                  <input value={form.npwp} onChange={(e) => setForm((f) => ({ ...f, npwp: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="00.000.000.0-000.000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Tax ID</label>
                  <input value={form.tax_id} onChange={(e) => setForm((f) => ({ ...f, tax_id: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Tax ID" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="info@perusahaan.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Telepon</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="+62 812 3456 7890" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Nama PIC</label>
                  <input value={form.pic_name} onChange={(e) => setForm((f) => ({ ...f, pic_name: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Nama person in charge" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email PIC</label>
                  <input type="email" value={form.pic_email} onChange={(e) => setForm((f) => ({ ...f, pic_email: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="pic@perusahaan.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'at_risk' | 'on_hold' }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="active">Active</option>
                    <option value="at_risk">At Risk</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Tax Status</label>
                  <select value={form.tax_status} onChange={(e) => setForm((f) => ({ ...f, tax_status: e.target.value as 'compliant' | 'needs_review' | 'pending_audit' }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="compliant">Compliant</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="pending_audit">Pending Audit</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Alamat</label>
                  <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Alamat lengkap" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Catatan</label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    placeholder="Catatan tambahan..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-border/70 pt-4">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingClient ? 'Simpan Perubahan' : 'Tambah Klien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
