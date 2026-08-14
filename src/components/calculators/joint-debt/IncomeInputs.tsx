import * as React from 'react';
import { NumberInput } from '../../ui/NumberInput';

export interface IncomeInputsProps {
  incomeA: string;
  incomeB: string;
  onIncomeAChange: (value: string) => void;
  onIncomeBChange: (value: string) => void;
  incomeAError?: string;
  incomeBError?: string;
}

export function IncomeInputs({
  incomeA,
  incomeB,
  onIncomeAChange,
  onIncomeBChange,
  incomeAError,
  incomeBError
}: IncomeInputsProps) {
  return (
    <section 
      aria-labelledby="income-section-heading"
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300"
    >
      {/* Editorial Header Section */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h2 id="income-section-heading" className="text-xl font-extrabold text-slate-900 tracking-tight">
          Household Monthly Income
        </h2>
        <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed max-w-2xl">
          Enter the take-home monthly income for each partner. The calculator uses this to determine a fair, proportional split for your shared debt payments.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <NumberInput
            id="partner-a-income"
            name="incomeA"
            label="Partner A Income"
            value={incomeA}
            onChange={(e) => onIncomeAChange(e.target.value)}
            error={incomeAError}
            hint="Monthly after-tax income"
            placeholder="0.00"
            min="0"
            step="any"
          />
        </div>

        <div className="relative">
          <NumberInput
            id="partner-b-income"
            name="incomeB"
            label="Partner B Income"
            value={incomeB}
            onChange={(e) => onIncomeBChange(e.target.value)}
            error={incomeBError}
            hint="Monthly after-tax income"
            placeholder="0.00"
            min="0"
            step="any"
          />
        </div>
      </div>
    </section>
  );
}