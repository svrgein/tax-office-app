export function LoadingTable() {
  return (
    <div className="space-y-3 rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
