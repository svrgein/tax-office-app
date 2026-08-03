'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalendarRange, Loader2, Pencil, PlusCircle, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ModulePage } from '@/components/shared/module-page';
import { SectionCard } from '@/components/shared/dashboard/section-card';
import { getDeadlines, createDeadline, updateDeadline, deleteDeadline, type DeadlineRow } from '@/services/deadlines';
import { getClients, type ClientRow } from '@/services/clients';

type Client = ClientRow;
type Deadline = DeadlineRow;

const EMPTY_FORM = {
  title: '',
  client_id: '',
  due_date: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  status: 'upcoming' as 'upcoming' | 'done' | 'overdue',
  remind: true,
  notes: '',
};

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [deadlinesData, clientsData] = await Promise.all([
        getDeadlines({ status: statusFilter }),
        getClients(),
      ]);
      setDeadlines(deadlinesData as Deadline[]);
      setClients(clientsData);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const upcoming = deadlines.filter((d) => d.status === 'upcoming').length;
  const overdue = deadlines.filter((d) => d.status === 'overdue').length;
  const done = deadlines.filter((d) => d.status === 'done').length;
  const today = new Date().toISOString().split('T')[0];
  const dueToday = deadlines.filter((d) => d.due_date === today).length;

  const PRIORITY_COLOR: Record<string, string> = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-muted text-muted-foreground',
  };
  const STATUS_COLOR: Record<string, string> = {
    upcoming: 'bg-primary/10 text-primary',
    done: 'bg-success/10 text-success',
    overdue: 'bg-destructive/10 text-destructive',
  };

  function openCreate() {
    setEditingDeadline(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(d: Deadline) {
    setEditingDeadline(d);
    setForm({
      title: d.title,
      client_id: d.client_id ?? '',
      due_date: d.due_date,
      priority: d.priority,
      status: d.status,
      remind: d.remind,
      notes: d.notes ?? '',
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, client_id: form.client_id || null };
      if (editingDeadline) {
        const updated = await updateDeadline(editingDeadline.id, payload);
        setDeadlines((prev) => prev.map((d) => (d.id === updated.id ? updated as Deadline : d)));
        toast.success('Deadline diperbarui');
      } else {
        const created = await createDeadline(payload);
        setDeadlines((prev) => [created as Deadline, ...prev]);
        toast.success('Deadline ditambahkan');
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
      await deleteDeadline(id);
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
      toast.success('Deadline dihapus');
    } catch {
      toast.error('Gagal menghapus');
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleDone(d: Deadline) {
    const newStatus = d.status === 'done' ? 'upcoming' : 'done';
    try {
      const updated = await updateDeadline(d.id, { status: newStatus });
      setDeadlines((prev) => prev.map((item) => (item.id === updated.id ? updated as Deadline : item)));
    } catch {
      toast.error('Gagal mengubah status');
    }
  }

  return (
    <DashboardShell>
      <ModulePage
        badge="Deadline control"
        title="Stay ahead of every compliance date"
        description="View urgent obligations, calendar milestones, and staff follow-up needs."
        action={
          <button onClick={openCreate} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add deadline
          </button>
        }
        stats={[
          { label: 'Upcoming', value: String(upcoming), helper: `${dueToday} hari ini` },
          { label: 'Overdue', value: String(overdue), helper: overdue > 0 ? 'Perlu segera' : 'Aman' },
          { label: 'Done', value: String(done), helper: 'Selesai' },
        ]}
      >
        <div className="mb-4 flex gap-2">
          {['all', 'upcoming', 'done', 'overdue'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'border border-border/70 text-muted-foreground hover:text-foreground'}`}>
              {s}
            </button>
          ))}
        </div>

        <SectionCard title="Daftar deadline" description="Semua kewajiban dan tenggat waktu">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : deadlines.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CalendarRange className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Tidak ada deadline</p>
              <button onClick={openCreate} className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">+ Tambah</button>
            </div>
          ) : (
            <div className="space-y-3">
              {deadlines.map((d) => (
                <div key={d.id}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between transition-all ${
                    d.status === 'done' ? 'border-border/40 bg-muted/30 opacity-70' : 'border-border/70 bg-background/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleDone(d)}
                      className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition-all ${d.status === 'done' ? 'border-success bg-success' : 'border-border hover:border-primary'}`}
                    >
                      {d.status === 'done' && <span className="flex h-full w-full items-center justify-center text-xs text-white">✓</span>}
                    </button>
                    <div>
                      <p className={`font-semibold text-foreground ${d.status === 'done' ? 'line-through opacity-60' : ''}`}>{d.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {d.clients?.name ?? 'Umum'} · {d.due_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PRIORITY_COLOR[d.priority]}`}>{d.priority}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[d.status]}`}>{d.status}</span>
                    <button onClick={() => openEdit(d)} className="rounded-xl border border-border/70 p-2 text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(d.id)} disabled={deletingId === d.id}
                      className="rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive disabled:opacity-50">
                      {deletingId === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </ModulePage>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-border/70 bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/70 p-6">
              <h2 className="text-xl font-semibold text-foreground">{editingDeadline ? 'Edit Deadline' : 'Tambah Deadline'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Judul Deadline *</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. VAT reconciliation Q3" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Due Date *</label>
                  <input required type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Prioritas</label>
                  <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as typeof form.priority }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="upcoming">Upcoming</option>
                    <option value="done">Done</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Klien</label>
                  <select value={form.client_id} onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="">Tanpa klien</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.remind} onChange={(e) => setForm((f) => ({ ...f, remind: e.target.checked }))}
                  className="h-4 w-4 rounded border-border accent-primary" />
                <span className="text-sm text-foreground">Aktifkan reminder</span>
              </label>
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
                  {editingDeadline ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
