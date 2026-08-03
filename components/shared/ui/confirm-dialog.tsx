import { XCircle } from 'lucide-react';

type ConfirmDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
};

export function ConfirmDialog({ title, description, onConfirm, onCancel, open }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border border-border/70 bg-card p-5 shadow-xl">
        <div className="flex items-center gap-3 text-warning">
          <XCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full border border-border/70 px-3 py-2 text-sm font-medium text-foreground">
            Batal
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
