import { Inbox } from 'lucide-react';

type EmptyStateCardProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyStateCard({ title, description, action }: EmptyStateCardProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-border/70 bg-card/70 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
