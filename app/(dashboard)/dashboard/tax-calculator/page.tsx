'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ModulePage } from '@/components/shared/module-page';
import { TaxCalculatorForm } from '@/components/shared/tax-calculator/tax-calculator-form';
import { TaxResultCard } from '@/components/shared/tax-calculator/tax-result-card';

type CalculatorFormValues = {
  monthlyIncome: string;
  otherDeductions: string;
  dependents: string;
  maritalStatus: 'single' | 'married';
};

const sampleValues: CalculatorFormValues = {
  monthlyIncome: '25000000',
  otherDeductions: '3000000',
  dependents: '2',
  maritalStatus: 'married',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TaxCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>({
    monthlyIncome: '',
    otherDeductions: '',
    dependents: '0',
    maritalStatus: 'single',
  });

  const result = useMemo(() => {
    const gross = Number(values.monthlyIncome || 0);
    const deductions = Number(values.otherDeductions || 0);
    const dependents = Number(values.dependents || 0);
    const maritalStatus = values.maritalStatus;

    const taxableIncome = Math.max(0, gross - deductions - 5000000 - dependents * 1500000);
    const annualIncome = taxableIncome * 12;

    const bracket: number[] = [0, 60000000, 250000000, 500000000, Number.POSITIVE_INFINITY];
    const rates: number[] = [0, 0.05, 0.15, 0.25, 0.3];

    let tax = 0;
    let prev = 0;

    for (let index = 1; index < bracket.length; index += 1) {
      const upper = bracket[index] ?? Number.POSITIVE_INFINITY;
      const rate = rates[index] ?? 0;
      const taxableAmount = Math.min(Math.max(annualIncome - prev, 0), upper - prev);
      tax += taxableAmount * rate;
      prev = upper;
      if (annualIncome <= upper) {
        break;
      }
    }

    const annualTax = Math.max(0, tax);
    const monthlyEstimate = annualTax / 12;
    const monthlyNet = gross - monthlyEstimate - deductions;

    return {
      monthlyEstimate: formatCurrency(monthlyEstimate),
      annualTax: formatCurrency(annualTax),
      monthlyNet: formatCurrency(monthlyNet),
      deductible: formatCurrency(deductions + dependents * 1500000 + 5000000),
    };
  }, [values]);

  return (
    <DashboardShell>
      <ModulePage
        badge="Tax planning"
        title="Estimate your tax obligations with confidence"
        description="Use a simple calculator to estimate monthly and annual tax exposure for clients and personal planning."
        action={
          <Link href="/dashboard/tax-calculator" className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Calculator className="mr-2 h-4 w-4" />
            Open planner
          </Link>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <TaxCalculatorForm
            values={values}
            onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
            onSubmit={() => undefined}
            onUseSample={() => setValues(sampleValues)}
          />
          <TaxResultCard
            monthlyNet={result.monthlyNet}
            annualTax={result.annualTax}
            monthlyEstimate={result.monthlyEstimate}
            deductible={result.deductible}
          />
        </div>
      </ModulePage>
    </DashboardShell>
  );
}
