'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Paperclip, X } from 'lucide-react';
import * as z from 'zod';

const dailyExpenseSchema = z.object({
  date: z.string().min(1, 'Tanggal diperlukan'),
  client: z.string().min(1, 'Klien diperlukan'),
  description: z.string().min(1, 'Keterangan diperlukan'),
  category: z.string().min(1, 'Kategori diperlukan'),
  amount: z.number({ invalid_type_error: 'Nominal harus berupa angka' }).min(0.01, 'Nominal minimal 0.01'),
  note: z.string().optional(),
  attachment: z.any().optional(),
});

export type DailyExpenseFormValues = z.infer<typeof dailyExpenseSchema>;

type DailyExpenseFormProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  defaultValues?: Partial<DailyExpenseFormValues>;
  clients: string[];
  categories: string[];
  onCancel: () => void;
  onSubmit: (values: DailyExpenseFormValues, file?: File) => void;
};

export function DailyExpenseForm({
  open,
  title,
  submitLabel,
  defaultValues,
  clients,
  categories,
  onCancel,
  onSubmit,
}: DailyExpenseFormProps) {
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DailyExpenseFormValues>({
    resolver: zodResolver(dailyExpenseSchema),
    defaultValues: {
      date: '',
      client: clients[0] ?? '',
      description: '',
      category: categories[0] ?? '',
      amount: 0,
      note: '',
      ...defaultValues,
    },
  });



  const clientOptions = useMemo(() => clients, [clients]);
  const categoryOptions = useMemo(() => categories, [categories]);

  if (!open) return null;

  const handleFormSubmit = (values: DailyExpenseFormValues) => {
    const fileInput = document.getElementById('expense-attachment') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    onSubmit(values, file);
    reset({
      date: '',
      client: clients[0] ?? '',
      description: '',
      category: categories[0] ?? '',
      amount: 0,
      note: '',
      attachment: undefined,
    });
    setAttachmentName(null);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 px-4 py-5 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-border/70 bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Laporan Harian</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">{title}</h2>
          </div>
          <button type="button" onClick={onCancel} className="rounded-full border border-border/70 p-2 text-muted-foreground transition hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-foreground">
            <span>Tanggal</span>
            <input type="date" {...register('date')} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
            {errors.date ? <p className="text-xs text-destructive">{errors.date.message}</p> : null}
          </label>

          <label className="space-y-2 text-sm text-foreground">
            <span>Klien</span>
            <select {...register('client')} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
              {clientOptions.map((client) => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
            {errors.client ? <p className="text-xs text-destructive">{errors.client.message}</p> : null}
          </label>

          <label className="space-y-2 text-sm text-foreground sm:col-span-2">
            <span>Keterangan</span>
            <input type="text" {...register('description')} placeholder="Contoh: pembelian kertas printer" className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
            {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
          </label>

          <label className="space-y-2 text-sm text-foreground">
            <span>Kategori</span>
            <select {...register('category')} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category ? <p className="text-xs text-destructive">{errors.category.message}</p> : null}
          </label>

          <label className="space-y-2 text-sm text-foreground">
            <span>Nominal</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground">Rp</span>
              <input type="number" step="0.01" min="0" {...register('amount', { valueAsNumber: true })} className="w-full rounded-2xl border border-border/70 bg-background/70 px-10 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
            </div>
            {errors.amount ? <p className="text-xs text-destructive">{errors.amount.message}</p> : null}
          </label>

          <label className="space-y-2 text-sm text-foreground sm:col-span-2">
            <span>Lampiran</span>
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <input id="expense-attachment" type="file" accept="image/*,.pdf" {...register('attachment')} className="w-full text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:text-primary transition" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? null)} />
            </div>
            {attachmentName ? <p className="text-sm text-muted-foreground">{attachmentName}</p> : <p className="text-xs text-muted-foreground">PDF atau gambar</p>}
          </label>

          <label className="space-y-2 text-sm text-foreground sm:col-span-2">
            <span>Catatan</span>
            <textarea {...register('note')} rows={3} placeholder="Catatan tambahan" className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
          </label>

          <div className="sm:col-span-2 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground">
              Batal
            </button>
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
