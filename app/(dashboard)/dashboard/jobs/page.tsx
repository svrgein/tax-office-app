'use client';

import { useCallback, useEffect, useState } from 'react';
import { BriefcaseBusiness, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { SectionCard } from '@/components/shared/dashboard/section-card';
import { ModulePage } from '@/components/shared/module-page';
import { getJobs, createJob, updateJob, deleteJob, type JobRow } from '@/services/jobs';
import { getClients, type ClientRow } from '@/services/clients';

type JobRowExtended = JobRow;

const EMPTY_FORM = {
  client_id: '',
  title: '',
  description: '',
  status: 'open' as JobRow['status'],
  priority: 'medium' as JobRow['priority'],
  due_date: '',
  amount: 0,
  progress: 0,
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRowExtended[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRowExtended | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsData, clientsData] = await Promise.all([
        getJobs({ status: statusFilter }),
        getClients(),
      ]);
      setJobs(jobsData as JobRowExtended[]);
      setClients(clientsData as ClientRow[]);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const activeCount = jobs.filter((j) => ['open', 'in_progress'].includes(j.status)).length;
  const doneCount = jobs.filter((j) => j.status === 'done').length;
  const avgProgress = jobs.length > 0
    ? Math.round(jobs.reduce((s, j) => s + (j.progress ?? 0), 0) / jobs.length)
    : 0;

  function openCreate() {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(job: JobRowExtended) {
    setEditingJob(job);
    setForm({
      client_id: job.client_id ?? '',
      title: job.title,
      description: job.description ?? '',
      status: job.status,
      priority: job.priority,
      due_date: job.due_date ?? '',
      amount: job.amount ?? 0,
      progress: job.progress ?? 0,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, client_id: form.client_id || null };
      if (editingJob) {
        const updated = await updateJob(editingJob.id, payload);
        setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated as JobRowExtended : j)));
        toast.success('Pekerjaan diperbarui');
      } else {
        const created = await createJob(payload);
        setJobs((prev) => [created as JobRowExtended, ...prev]);
        toast.success('Pekerjaan ditambahkan');
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
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success('Pekerjaan dihapus');
    } catch {
      toast.error('Gagal menghapus');
    } finally {
      setDeletingId(null);
    }
  }

  const PRIORITY_COLOR: Record<string, string> = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-muted text-muted-foreground',
  };
  const STATUS_COLOR: Record<string, string> = {
    open: 'bg-primary/10 text-primary',
    in_progress: 'bg-warning/10 text-warning',
    done: 'bg-success/10 text-success',
    cancelled: 'bg-muted text-muted-foreground',
  };

  return (
    <DashboardShell>
      <ModulePage
        badge="Operations hub"
        title="Track active jobs and delivery progress"
        description="Monitor ongoing tax assignments, team workload, and delivery health in one view."
        action={
          <button onClick={openCreate} className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            New job
          </button>
        }
        stats={[
          { label: 'Active jobs', value: String(activeCount), helper: 'Open & in progress' },
          { label: 'Avg progress', value: `${avgProgress}%`, helper: 'Across all jobs' },
          { label: 'Completed', value: String(doneCount), helper: 'This period' },
        ]}
      >
        <div className="mb-4 flex gap-2">
          {['all', 'open', 'in_progress', 'done', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'border border-border/70 text-muted-foreground hover:text-foreground'
              }`}>
              {s === 'in_progress' ? 'In Progress' : s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <SectionCard title="Current pipeline" description="Live progress across key client assignments">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <p className="text-sm text-muted-foreground">Belum ada pekerjaan. Tambahkan sekarang.</p>
              <button onClick={openCreate} className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">+ New Job</button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job: JobRowExtended) => (
                <div key={job.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{job.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job.clients?.name ?? 'Tanpa klien'} {job.due_date ? `· Due ${job.due_date}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PRIORITY_COLOR[job.priority] ?? ''}`}>
                        {job.priority}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[job.status] ?? ''}`}>
                        {job.status}
                      </span>
                      <button onClick={() => openEdit(job)} className="rounded-xl border border-border/70 p-2 text-muted-foreground hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}
                        className="rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive disabled:opacity-50">
                        {deletingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span><span>{job.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${job.progress}%` }} />
                    </div>
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
          <div className="w-full max-w-lg rounded-[28px] border border-border/70 bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/70 p-6">
              <h2 className="text-xl font-semibold text-foreground">{editingJob ? 'Edit Pekerjaan' : 'Tambah Pekerjaan'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Judul Pekerjaan *</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. Annual tax reconciliation" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Klien</label>
                <select value={form.client_id} onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="">Tanpa klien</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                  <label className="text-sm font-medium text-foreground">Due Date</label>
                  <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Progress (%)</label>
                  <input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="Detail pekerjaan..." />
              </div>
              <div className="flex justify-end gap-3 border-t border-border/70 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingJob ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
