import { Calculator, Sparkles } from 'lucide-react';

type CalculatorFormValues = {
  monthlyIncome: string;
  otherDeductions: string;
  dependents: string;
  maritalStatus: 'single' | 'married';
};

type TaxCalculatorFormProps = {
  values: CalculatorFormValues;
  onChange: (field: keyof CalculatorFormValues, value: string) => void;
  onSubmit: () => void;
  onUseSample: () => void;
};

export function TaxCalculatorForm({
  values,
  onChange,
  onSubmit,
  onUseSample,
}: TaxCalculatorFormProps) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <Calculator className="h-4 w-4" />
        <h2 className="text-lg font-semibold text-foreground">Tax estimation input</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        This is a practical planning estimator for Indonesian personal income tax projection.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Monthly gross income</span>
          <input
            type="number"
            min="0"
            value={values.monthlyIncome}
            onChange={(event) => onChange('monthlyIncome', event.target.value)}
            className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2.5 text-foreground outline-none ring-0"
            placeholder="e.g. 25000000"
          />
        </label>

        <label className="space-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Other deductions</span>
          <input
            type="number"
            min="0"
            value={values.otherDeductions}
            onChange={(event) => onChange('otherDeductions', event.target.value)}
            className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2.5 text-foreground outline-none ring-0"
            placeholder="e.g. 3000000"
          />
        </label>

        <label className="space-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Number of dependents</span>
          <input
            type="number"
            min="0"
            value={values.dependents}
            onChange={(event) => onChange('dependents', event.target.value)}
            className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2.5 text-foreground outline-none ring-0"
            placeholder="0"
          />
        </label>

        <label className="space-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Marital status</span>
          <select
            value={values.maritalStatus}
            onChange={(event) => onChange('maritalStatus', event.target.value)}
            className="w-full rounded-2xl border border-border/70 bg-background/70 px-3 py-2.5 text-foreground outline-none ring-0"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Calculate estimate
        </button>
        <button
          type="button"
          onClick={onUseSample}
          className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background/70 px-4 py-2.5 text-sm font-semibold text-foreground"
        >
          Use sample case
        </button>
      </div>
    </div>
  );
}
