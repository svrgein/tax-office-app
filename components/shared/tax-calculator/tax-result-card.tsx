import { ArrowUpRight, BadgeCheck } from 'lucide-react';

type TaxResultCardProps = {
  monthlyNet: string;
  annualTax: string;
  monthlyEstimate: string;
  deductible: string;
};

export function TaxResultCard({ monthlyNet, annualTax, monthlyEstimate, deductible }: TaxResultCardProps) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <BadgeCheck className="h-4 w-4" />
        <h2 className="text-lg font-semibold text-foreground">Estimated tax outcome</h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
          <p className="text-sm text-muted-foreground">Estimated monthly tax</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{monthlyEstimate}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
          <p className="text-sm text-muted-foreground">Estimated annual tax</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{annualTax}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Estimated monthly net income</span>
          <span className="font-semibold text-foreground">{monthlyNet}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Calculated deductions</span>
          <span className="font-semibold text-foreground">{deductible}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowUpRight className="h-4 w-4 text-primary" />
        This is a planning estimate, not legal tax advice.
      </div>
    </div>
  );
}
