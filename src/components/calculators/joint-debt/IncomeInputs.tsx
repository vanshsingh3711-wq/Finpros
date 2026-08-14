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
      className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 id="income-section-heading" className="text-lg font-semibold text-slate-900">
          Household Monthly Income
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Enter the take-home monthly income for each partner. This determines how much each person contributes to the total monthly payment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <NumberInput
          id="partner-a-income"
          name="incomeA"
          label="Partner A Income"
          value={incomeA}
          onChange={(e) => onIncomeAChange(e.target.value)}
          error={incomeAError}
          hint="Monthly after-tax income"
          placeholder="0"
          min="0"
          step="any"
        />

        <NumberInput
          id="partner-b-income"
          name="incomeB"
          label="Partner B Income"
          value={incomeB}
          onChange={(e) => onIncomeBChange(e.target.value)}
          error={incomeBError}
          hint="Monthly after-tax income"
          placeholder="0"
          min="0"
          step="any"
        />
      </div>
    </section>
  );
}
