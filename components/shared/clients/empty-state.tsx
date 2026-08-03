import { SearchX } from 'lucide-react';

type EmptyStateProps = {
  onReset: () => void;
};

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-border/70 bg-card/70 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">Tidak ada klien yang sesuai filter</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Coba ubah kata pencarian atau reset filter untuk melihat seluruh portofolio klien.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Reset filter
      </button>
    </div>
  );
}