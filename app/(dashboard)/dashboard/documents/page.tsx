'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, FolderOpen, Loader2, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ModulePage } from '@/components/shared/module-page';
import { SectionCard } from '@/components/shared/dashboard/section-card';
import { getDocuments, uploadDocument, deleteDocument } from '@/services/documents';
import { getClients } from '@/services/clients';
import type { Database } from '@/types/database.types';

type Client = Database['public']['Tables']['clients']['Row'];
type DocRow = {
  id: string;
  name: string;
  size: number | null;
  mime: string | null;
  url: string;
  created_at: string;
  clients?: { name: string } | null;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [clientFilter, setClientFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [docsData, clientsData] = await Promise.all([
        getDocuments(clientFilter),
        getClients(),
      ]);
      setDocuments(docsData as DocRow[]);
      setClients(clientsData);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [clientFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(file, { client_id: selectedClientId || undefined });
      }
      await loadData();
      toast.success(`${files.length} file berhasil diupload`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload gagal';
      toast.error(msg.includes('bucket') ? 'Buat bucket "documents" di Supabase Storage dulu' : msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Dokumen dihapus');
    } catch {
      toast.error('Gagal menghapus dokumen');
    } finally {
      setDeletingId(null);
    }
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  function getMimeIcon(mime: string | null) {
    if (!mime) return '📄';
    if (mime.includes('pdf')) return '📋';
    if (mime.includes('sheet') || mime.includes('excel')) return '📊';
    if (mime.includes('image')) return '🖼️';
    if (mime.includes('zip') || mime.includes('rar')) return '📦';
    return '📄';
  }

  return (
    <DashboardShell>
      <ModulePage
        badge="Document center"
        title="Organize client paperwork in one place"
        description="Review uploaded files, shared packages, and document status by client."
        action={
          <div className="flex items-center gap-3">
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground"
            >
              <option value="">Pilih klien (opsional)</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          </div>
        }
        stats={[
          { label: 'Total dokumen', value: String(documents.length), helper: 'Semua file' },
          { label: 'Klien dengan file', value: String(new Set(documents.map((d) => d.clients?.name).filter(Boolean)).size), helper: 'Klien unik' },
        ]}
      >
        <div className="mb-4 flex gap-2 flex-wrap">
          <button onClick={() => setClientFilter('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${clientFilter === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border/70 text-muted-foreground hover:text-foreground'}`}>
            Semua
          </button>
          {clients.map((c) => (
            <button key={c.id} onClick={() => setClientFilter(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${clientFilter === c.id ? 'bg-primary text-primary-foreground' : 'border border-border/70 text-muted-foreground hover:text-foreground'}`}>
              {c.name}
            </button>
          ))}
        </div>

        <SectionCard title="File yang diupload" description="Semua dokumen tersimpan di Supabase Storage">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Belum ada dokumen</p>
              <p className="mt-1 text-sm text-muted-foreground">Klik Upload untuk menambahkan file</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5 text-xl">
                      {getMimeIcon(doc.mime)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{doc.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {doc.clients?.name ?? 'Umum'} · {formatSize(doc.size)} · {new Date(doc.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      Lihat
                    </a>
                    <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id}
                      className="rounded-xl border border-destructive/30 p-2 text-destructive/70 hover:text-destructive disabled:opacity-50">
                      {deletingId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </ModulePage>
    </DashboardShell>
  );
}
