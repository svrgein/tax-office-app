import { useState } from 'react';
import { FileText, MoreHorizontal, PencilLine, Trash2, Eye } from 'lucide-react';

import { cn } from '@/lib/utils';

type Client = {
  id: number;
  companyName: string;
  npwp: string;
  pic: string;
  phone: string;
  email: string;
  taxStatus: string;
  activeJobs: number;
  nextDeadline: string;
  status: string;
};

type ClientTableProps = {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onUpload: (client: Client) => void;
};

function StatusBadge({ value }: { value: string }) {
  const classes = {
    Active: 'bg-success/10 text-success',
    'At Risk': 'bg-warning/10 text-warning',
    'On Hold': 'bg-muted text-muted-foreground',
    Compliant: 'bg-success/10 text-success',
    'Needs Review': 'bg-warning/10 text-warning',
    'Pending Audit': 'bg-destructive/10 text-destructive',
  } as Record<string, string>;

  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', classes[value] ?? 'bg-muted text-muted-foreground')}>
      {value}
    </span>
  );
}

function ActionMenu({ client, onView, onEdit, onDelete, onUpload }: { client: Client; onView: (client: Client) => void; onEdit: (client: Client) => void; onDelete: (client: Client) => void; onUpload: (client: Client) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-xl border border-border/70 bg-background/70 p-2 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-44 rounded-2xl border border-border/70 bg-card p-2 shadow-lg">
          <button type="button" onClick={() => { onView(client); setOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70">
            <Eye className="h-4 w-4" />
            Lihat detail
          </button>
          <button type="button" onClick={() => { onEdit(client); setOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70">
            <PencilLine className="h-4 w-4" />
            Edit klien
          </button>
          <button type="button" onClick={() => { onUpload(client); setOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-muted/70">
            <FileText className="h-4 w-4" />
            Unggah dokumen
          </button>
          <button type="button" onClick={() => { onDelete(client); setOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ClientTable({ clients, onView, onEdit, onDelete, onUpload }: ClientTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card/90 shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-border/70 text-left">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Nama Perusahaan</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">NPWP</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">PIC</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Telepon</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Status Pajak</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Pekerjaan Aktif</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Deadline Berikutnya</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 bg-background/50">
            {clients.map((client) => (
              <tr key={client.id} className="align-top">
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{client.companyName}</div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.npwp}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.pic}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.phone}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                <td className="px-4 py-3"><StatusBadge value={client.taxStatus} /></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.activeJobs}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.nextDeadline}</td>
                <td className="px-4 py-3"><StatusBadge value={client.status} /></td>
                <td className="px-4 py-3">
                  <ActionMenu client={client} onView={onView} onEdit={onEdit} onDelete={onDelete} onUpload={onUpload} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {clients.map((client) => (
          <div key={client.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">{client.companyName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{client.pic}</p>
              </div>
              <StatusBadge value={client.status} />
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <p>NPWP: {client.npwp}</p>
              <p>{client.phone}</p>
              <p>{client.email}</p>
              <p>Status Pajak: {client.taxStatus}</p>
              <p>Pekerjaan Aktif: {client.activeJobs}</p>
              <p>Deadline Berikutnya: {client.nextDeadline}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionMenu client={client} onView={onView} onEdit={onEdit} onDelete={onDelete} onUpload={onUpload} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
