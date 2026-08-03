'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, FilePlus, FileText, Printer, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageShell } from '@/components/shared/ui/page-shell';
import { EmptyStateCard } from '@/components/shared/ui/empty-state-card';
import { LoadingTable } from '@/components/shared/ui/loading-table';
import { DailyExpenseForm, DailyExpenseFormValues } from '@/components/shared/expenses/daily-expense-form';
import { DailyExpenseTable, type DailyExpenseRecord } from '@/components/shared/expenses/daily-expense-table';

const categoryOptions = ['Operasional', 'Bahan', 'Transport', 'Listrik', 'Lainnya'];
const clientOptions = ['PT Bintang Abadi', 'CV Sinar Mandiri', 'PT Citra Arta'];
const statusOptions = ['submitted', 'reviewed', 'approved'] as const;

const mockExpenses: DailyExpenseRecord[] = [
  { id: 1, date: '2026-07-30', description: 'Pembelian tinta printer', category: 'Operasional', amount: 358000, attachment: 'tinta-printer.pdf', note: 'Untuk laporan klien A', status: 'submitted', client: 'PT Bintang Abadi' },
  { id: 2, date: '2026-07-29', description: 'Makan siang tim', category: 'Operasional', amount: 542000, attachment: null, note: 'Rapat internal', status: 'approved', client: 'CV Sinar Mandiri' },
  { id: 3, date: '2026-07-28', description: 'Isi ulang kertas A4', category: 'Bahan', amount: 198000, attachment: 'nota.pdf', note: '', status: 'reviewed', client: 'PT Citra Arta' },
  { id: 4, date: '2026-07-27', description: 'Ojek online ke kantor pajak', category: 'Transport', amount: 72000, attachment: 'struk.jpg', note: 'Pengiriman dokumen', status: 'submitted', client: 'PT Bintang Abadi' },
];

export default function DailyReportPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DailyExpenseRecord[]>(mockExpenses);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateRange] = useState('2026-07-01 - 2026-07-31');
  const [monthFilter, setMonthFilter] = useState('July');
  const [yearFilter, setYearFilter] = useState('2026');
  const [clientFilter, setClientFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | (typeof statusOptions)[number]>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DailyExpenseRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const normalizedQuery = search.toLowerCase();
      const matchesSearch = record.description.toLowerCase().includes(normalizedQuery) || record.note.toLowerCase().includes(normalizedQuery);
      const matchesClient = clientFilter === 'all' || record.client === clientFilter;
      const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesMonth = monthFilter === 'all' || new Date(record.date).toLocaleString('id-ID', { month: 'long' }) === monthFilter;
      const matchesYear = yearFilter === 'all' || new Date(record.date).getFullYear().toString() === yearFilter;
      return matchesSearch && matchesClient && matchesCategory && matchesStatus && matchesMonth && matchesYear;
    });
  }, [records, search, clientFilter, categoryFilter, statusFilter, monthFilter, yearFilter]);

  const totalToday = useMemo(() => records.filter((record) => record.date === new Date().toISOString().slice(0, 10)).reduce((sum, record) => sum + record.amount, 0), [records]);
  const totalMonth = useMemo(() => {
    const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
    return records.filter((record) => new Date(record.date).toLocaleString('id-ID', { month: 'long' }) === currentMonth).reduce((sum, record) => sum + record.amount, 0);
  }, [records]);

  const handleAdd = () => {
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleEdit = (record: DailyExpenseRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleDelete = (record: DailyExpenseRecord) => {
    setRecords((current) => current.filter((item) => item.id !== record.id));
    setToastMessage('Data berhasil dihapus');
    window.setTimeout(() => setToastMessage(null), 1800);
  };

  const handleSubmit = (values: DailyExpenseFormValues, file?: File) => {
    const newRecord: DailyExpenseRecord = {
      id: records.length + 1,
      date: values.date,
      client: values.client,
      description: values.description,
      category: values.category,
      amount: values.amount,
      attachment: file?.name ?? null,
      note: values.note ?? '',
      status: 'submitted',
    };

    setRecords((current) => {
      if (selectedRecord) {
        return current.map((item) => (item.id === selectedRecord.id ? { ...item, ...newRecord, id: selectedRecord.id } : item));
      }
      return [newRecord, ...current];
    });

    setToastMessage(selectedRecord ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan');
    setModalOpen(false);
    window.setTimeout(() => setToastMessage(null), 1800);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map((record) => ({
        Tanggal: record.date,
        Keterangan: record.description,
        Nominal: record.amount,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Harian');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'laporan-harian.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const csvRows = [['Tanggal', 'Keterangan', 'Nominal']];
    filteredRecords.forEach((record) => csvRows.push([record.date, record.description, record.amount.toString()]));
    const csvContent = csvRows.map((row) => row.map((value) => `"${value}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'laporan-harian.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPrint = () => window.print();

  return (
    <DashboardShell>
      <PageShell
        badge="Biaya"
        title="Laporan Harian"
        description="Catat pengeluaran harian secara manual, ekspor ke spreadsheet, dan teruskan ke klien tanpa perubahan format." 
        action={
          <button type="button" onClick={handleAdd} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95">
            <FilePlus className="h-4 w-4" />
            Tambah laporan
          </button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Total Pengeluaran Hari Ini</p>
                <p className="mt-4 text-3xl font-semibold text-foreground">Rp {totalToday.toLocaleString('id-ID')}</p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Total Bulan Ini</p>
                <p className="mt-4 text-3xl font-semibold text-foreground">Rp {totalMonth.toLocaleString('id-ID')}</p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Jumlah Transaksi</p>
                <p className="mt-4 text-3xl font-semibold text-foreground">{records.length}</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Filter</p>
                  <p className="text-base font-semibold text-foreground">Penyaring Laporan Harian</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={exportExcel} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/70">
                    <Download className="h-4 w-4" />
                    Export Excel
                  </button>
                  <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/70">
                    <FileText className="h-4 w-4" />
                    Export CSV
                  </button>
                  <button type="button" onClick={exportPrint} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/70">
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-2 text-sm text-foreground">
                  <span>Search Description</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari keterangan atau catatan" className="w-full border-none bg-transparent outline-none" />
                  </div>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>Bulan</span>
                  <select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="all">Semua Bulan</option>
                    <option value="July">July</option>
                    <option value="June">June</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>Tahun</span>
                  <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="all">Semua Tahun</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>Kategori</span>
                  <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="all">Semua Kategori</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>Klien</span>
                  <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="all">Semua Klien</option>
                    {clientOptions.map((client) => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-foreground">
                  <span>Status</span>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusOptions[number] | 'all')} className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="all">Semua Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Ringkasan Cepat</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                <p className="text-sm text-muted-foreground">Transaksi Bulan Ini</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{filteredRecords.length}</p>
              </div>
              <div className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                <p className="text-sm text-muted-foreground">Total Filter Saat Ini</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">Rp {filteredRecords.reduce((sum, record) => sum + record.amount, 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                <p className="text-sm text-muted-foreground">Lampiran Tersedia</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{filteredRecords.filter((record) => record.attachment).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <LoadingTable />
          ) : filteredRecords.length === 0 ? (
            <EmptyStateCard title="Tidak ada data pengeluaran harian" description="Tambahkan laporan harian pertama Anda untuk mulai mencatat aktivitas." />
          ) : (
            <DailyExpenseTable records={filteredRecords} page={page} pageSize={5} onPageChange={setPage} onEdit={handleEdit} onDelete={handleDelete} onPreview={() => undefined} />
          )}
        </div>

        {modalOpen && (
          <DailyExpenseForm
            open={modalOpen}
            title={selectedRecord ? 'Edit Laporan Harian' : 'Tambah Laporan Harian'}
            submitLabel={selectedRecord ? 'Simpan perubahan' : 'Tambah laporan'}
            defaultValues={selectedRecord ? {
              date: selectedRecord.date,
              client: selectedRecord.client,
              description: selectedRecord.description,
              category: selectedRecord.category,
              amount: selectedRecord.amount,
              note: selectedRecord.note,
            } : undefined}
            clients={clientOptions}
            categories={categoryOptions}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {toastMessage ? (
          <div className="fixed bottom-4 right-4 z-[90] rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </PageShell>
    </DashboardShell>
  );
}
