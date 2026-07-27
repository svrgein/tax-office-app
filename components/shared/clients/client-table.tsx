import type { ReactNode } from 'react';
import { FileText, PencilLine, Trash2, Eye } from 'lucide-react';

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

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-border/70 bg-background/70 p-2 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
    >
      {children}
    </button>
  );
}

export function ClientTable({ clients, onView, onEdit, onDelete, onUpload }: ClientTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card/90 shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-border/70 text-left">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Company Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">NPWP</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">PIC</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Phone</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Tax Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Active Jobs</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Next Deadline</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Actions</th>
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
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => onView(client)}><Eye className="h-4 w-4" /></ActionButton>
                    <ActionButton onClick={() => onEdit(client)}><PencilLine className="h-4 w-4" /></ActionButton>
                    <ActionButton onClick={() => onDelete(client)}><Trash2 className="h-4 w-4" /></ActionButton>
                    <ActionButton onClick={() => onUpload(client)}><FileText className="h-4 w-4" /></ActionButton>
                  </div>
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
              <p>Tax Status: {client.taxStatus}</p>
              <p>Active Jobs: {client.activeJobs}</p>
              <p>Next Deadline: {client.nextDeadline}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton onClick={() => onView(client)}><Eye className="h-4 w-4" /></ActionButton>
              <ActionButton onClick={() => onEdit(client)}><PencilLine className="h-4 w-4" /></ActionButton>
              <ActionButton onClick={() => onDelete(client)}><Trash2 className="h-4 w-4" /></ActionButton>
              <ActionButton onClick={() => onUpload(client)}><FileText className="h-4 w-4" /></ActionButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
