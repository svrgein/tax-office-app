'use client';

import { useMemo } from 'react';
import { Download, FileText, MoreHorizontal } from 'lucide-react';

export type DailyExpenseRecord = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  attachment: string | null;
  note: string;
  status: 'submitted' | 'reviewed' | 'approved';
  client: string;
};

type DailyExpenseTableProps = {
  records: DailyExpenseRecord[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (record: DailyExpenseRecord) => void;
  onDelete: (record: DailyExpenseRecord) => void;
  onPreview: (record: DailyExpenseRecord) => void;
};

export function DailyExpenseTable({ records, page, pageSize, onPageChange, onEdit, onDelete, onPreview }: DailyExpenseTableProps) {
  const visibleRecords = useMemo(() => records.slice((page - 1) * pageSize, page * pageSize), [records, page, pageSize]);

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card/90 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-background/95 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">No</th>
              <th className="whitespace-nowrap px-4 py-3">Tanggal</th>
              <th className="whitespace-nowrap px-4 py-3">Keterangan</th>
              <th className="whitespace-nowrap px-4 py-3">Kategori</th>
              <th className="whitespace-nowrap px-4 py-3">Nominal</th>
              <th className="whitespace-nowrap px-4 py-3">Lampiran</th>
              <th className="whitespace-nowrap px-4 py-3">Catatan</th>
              <th className="whitespace-nowrap px-4 py-3">Status</th>
              <th className="whitespace-nowrap px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 bg-card/80">
            {visibleRecords.map((record, index) => (
              <tr key={record.id} className="transition hover:bg-muted/30">
                <td className="px-4 py-4 font-medium text-foreground">{(page - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{record.date}</td>
                <td className="px-4 py-4 text-sm text-foreground">{record.description}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{record.category}</td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">Rp {record.amount.toLocaleString('id-ID')}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {record.attachment ? (
                    <button type="button" onClick={() => onPreview(record)} className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/10">
                      <FileText className="h-3.5 w-3.5" />
                      Preview
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{record.note || '—'}</td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">{record.status}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onEdit(record)} className="rounded-2xl border border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground transition hover:bg-muted/70">Edit</button>
                    <button type="button" onClick={() => onDelete(record)} className="rounded-2xl border border-destructive/60 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/20">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 bg-background/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Menampilkan {visibleRecords.length} dari {records.length} transaksi</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onPageChange(Math.max(page - 1, 1))} className="rounded-full border border-border/70 bg-background px-3 py-2 text-sm text-foreground transition hover:bg-muted/70">
            Prev
          </button>
          <span className="text-sm font-medium text-foreground">{page}</span>
          <button type="button" onClick={() => onPageChange(page + 1)} className="rounded-full border border-border/70 bg-background px-3 py-2 text-sm text-foreground transition hover:bg-muted/70">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
