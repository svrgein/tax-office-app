import { CheckCircle2 } from 'lucide-react';

type ToastPlaceholderProps = {
  message: string;
  open: boolean;
};

export function ToastPlaceholder({ message, open }: ToastPlaceholderProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <CheckCircle2 className="h-4 w-4 text-success" />
        {message}
      </div>
    </div>
  );
}
