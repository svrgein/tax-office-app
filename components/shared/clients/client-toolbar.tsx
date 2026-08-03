import { Filter, Search } from 'lucide-react';

type ClientToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedTaxStatus: string;
  onTaxStatusChange: (value: string) => void;
  totalClients: number;
};

export function ClientToolbar({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedTaxStatus,
  onTaxStatusChange,
  totalClients,
}: ClientToolbarProps) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Portofolio klien</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totalClients} klien aktif</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground md:min-w-[280px]">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari perusahaan, PIC, email..."
              className="w-full border-none bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <select
                value={selectedStatus}
                onChange={(event) => onStatusChange(event.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="all">Semua status</option>
                <option value="Active">Aktif</option>
                <option value="At Risk">Berisiko</option>
                <option value="On Hold">Ditahan</option>
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <select
                value={selectedTaxStatus}
                onChange={(event) => onTaxStatusChange(event.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="all">Semua status pajak</option>
                <option value="Compliant">Patuh</option>
                <option value="Needs Review">Perlu Review</option>
                <option value="Pending Audit">Menunggu Audit</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
