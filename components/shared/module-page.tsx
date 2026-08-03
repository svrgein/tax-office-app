import type { ReactNode } from 'react';

type ModulePageProps = {
  title: string;
  description: string;
  badge: string;
  action?: ReactNode;
  stats?: Array<{ label: string; value: string; helper: string }>;
  children: ReactNode;
};

export function ModulePage({
  title,
  description,
  badge,
  action,
  stats,
  children,
}: ModulePageProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {badge}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        {action}
      </header>

      {stats ? (
        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-foreground">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.helper}</p>
            </div>
          ))}
        </section>
      ) : null}

      {children}
    </div>
  );
}
