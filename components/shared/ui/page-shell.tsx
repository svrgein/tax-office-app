import type { ReactNode } from 'react';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type PageShellProps = {
  title: string;
  description: string;
  badge: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageShell({ title, description, badge, action, children, className }: PageShellProps) {
  return (
    <div className={cn('mx-auto flex max-w-7xl flex-col gap-6', className)}>
      <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Dasbor
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{badge}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
