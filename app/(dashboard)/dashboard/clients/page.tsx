'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ClientTable } from '@/components/shared/clients/client-table';
import { ClientToolbar } from '@/components/shared/clients/client-toolbar';
import { EmptyState } from '@/components/shared/clients/empty-state';
import { LoadingSkeleton } from '@/components/shared/clients/loading-skeleton';

type Client = {
  id: number;
  companyName: string;
  npwp: string;
  pic: string;
  phone: string;
  email: string;
  taxStatus: 'Compliant' | 'Needs Review' | 'Pending Audit';
  activeJobs: number;
  nextDeadline: string;
  status: 'Active' | 'At Risk' | 'On Hold';
};

const clientsSeed: Client[] = [
  {
    id: 1,
    companyName: 'PT Bintang Abadi Sejahtera',
    npwp: '01.234.567.8-901.000',
    pic: 'Rina Wulandari',
    phone: '+62 812 3456 7890',
    email: 'rina@bintangabadi.co.id',
    taxStatus: 'Compliant',
    activeJobs: 3,
    nextDeadline: '02 Aug 2026',
    status: 'Active',
  },
  {
    id: 2,
    companyName: 'CV Sinar Mandiri',
    npwp: '02.345.678.9-012.000',
    pic: 'Dimas Pratama',
    phone: '+62 813 4567 8901',
    email: 'dimas@sinar-mandiri.com',
    taxStatus: 'Needs Review',
    activeJobs: 2,
    nextDeadline: '05 Aug 2026',
    status: 'At Risk',
  },
  {
    id: 3,
    companyName: 'PT Citra Arta Nusantara',
    npwp: '03.456.789.0-123.000',
    pic: 'Lestari Putri',
    phone: '+62 821 5678 9012',
    email: 'lestari@citraarta.co.id',
    taxStatus: 'Pending Audit',
    activeJobs: 4,
    nextDeadline: '08 Aug 2026',
    status: 'Active',
  },
  {
    id: 4,
    companyName: 'UD Maju Sejahtera',
    npwp: '04.567.890.1-234.000',
    pic: 'Agung Santoso',
    phone: '+62 815 6789 0123',
    email: 'agung@maju-sejahtera.id',
    taxStatus: 'Compliant',
    activeJobs: 1,
    nextDeadline: '11 Aug 2026',
    status: 'On Hold',
  },
  {
    id: 5,
    companyName: 'PT Harmoni Keluarga',
    npwp: '05.678.901.2-345.000',
    pic: 'Nadia Rahma',
    phone: '+62 817 7890 1234',
    email: 'nadia@harmonikeluarga.com',
    taxStatus: 'Needs Review',
    activeJobs: 5,
    nextDeadline: '14 Aug 2026',
    status: 'Active',
  },
  {
    id: 6,
    companyName: 'CV Karya Prima',
    npwp: '06.789.012.3-456.000',
    pic: 'Bambang Setiawan',
    phone: '+62 818 8901 2345',
    email: 'bambang@karyaprima.co.id',
    taxStatus: 'Compliant',
    activeJobs: 2,
    nextDeadline: '18 Aug 2026',
    status: 'Active',
  },
];

const pageSize = 5;

export default function ClientManagementPage() {
  const [clients] = useState(clientsSeed);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTaxStatus, setSelectedTaxStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredClients = useMemo(() => {
    const query = search.toLowerCase();
    return clients.filter((client) => {
      const matchesSearch =
        client.companyName.toLowerCase().includes(query) ||
        client.pic.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.npwp.toLowerCase().includes(query);
      const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
      const matchesTaxStatus = selectedTaxStatus === 'all' || client.taxStatus === selectedTaxStatus;
      return matchesSearch && matchesStatus && matchesTaxStatus;
    });
  }, [clients, search, selectedStatus, selectedTaxStatus]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus, selectedTaxStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + pageSize);

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Client management
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Manage your client portfolio with clarity.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Track tax obligations, active jobs, deadline health, and engagement status in one view.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Client
          </button>
        </header>

        <ClientToolbar
          search={search}
          onSearchChange={setSearch}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedTaxStatus={selectedTaxStatus}
          onTaxStatusChange={setSelectedTaxStatus}
          totalClients={clients.length}
        />

        {loading ? (
          <LoadingSkeleton />
        ) : filteredClients.length === 0 ? (
          <EmptyState onReset={() => { setSearch(''); setSelectedStatus('all'); setSelectedTaxStatus('all'); }} />
        ) : (
          <>
            <ClientTable
              clients={paginatedClients}
              onView={(client) => console.log('View', client.companyName)}
              onEdit={(client) => console.log('Edit', client.companyName)}
              onDelete={(client) => console.log('Delete', client.companyName)}
              onUpload={(client) => console.log('Upload', client.companyName)}
            />

            <div className="flex flex-col gap-3 rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredClients.length)} of {filteredClients.length} clients
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={safePage === 1}
                  className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Prev
                </button>
                <span className="rounded-full bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
