import * as React from 'react';
import { DebtDraftState, createEmptyDebtDraft } from '../../../lib/calculations/jointDebtState';
import { DebtRowInput, DebtRowErrors } from './DebtRowInput';
import { Button } from '../../ui/Button';

export interface DebtRowListProps {
  debts: DebtDraftState[];
  onChange: (debts: DebtDraftState[]) => void;
  errors?: Record<string, DebtRowErrors>;
  listError?: string;
}

export function DebtRowList({
  debts,
  onChange,
  errors,
  listError,
}: DebtRowListProps) {
  const handleAddDebt = () => {
    const newDebt = createEmptyDebtDraft(crypto.randomUUID());
    onChange([...debts, newDebt]);
  };

  const handleRemoveDebt = (idToRemove: string) => {
    onChange(debts.filter(debt => debt.id !== idToRemove));
  };

  const handleChangeDebt = (updatedDebt: DebtDraftState) => {
    onChange(
      debts.map(debt => (debt.id === updatedDebt.id ? updatedDebt : debt))
    );
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Editorial Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Shared Household Debts
          </h2>
          <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed max-w-lg">
            List all the debts you want to pay off together. The calculation engine will combine these into a unified payoff timeline.
          </p>
        </div>
        
        <Button 
          type="button" 
          onClick={handleAddDebt} 
          variant="secondary"
          className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm h-11 px-5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-teal-700"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Another Debt
        </Button>
      </div>

      {/* Refined Global Error State */}
      {listError && (
        <div className="rounded-lg bg-red-50/80 border border-red-200 p-4 flex items-start gap-3" role="alert">
          <svg className="w-5 h-5 text-red-700 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium text-red-800 leading-relaxed">
            {listError}
          </p>
        </div>
      )}

      {/* Spaced List Container */}
      <div className="space-y-6">
        {debts.map((debt) => (
          <DebtRowInput
            key={debt.id}
            debt={debt}
            onChange={handleChangeDebt}
            onRemove={handleRemoveDebt}
            errors={errors?.[debt.id]}
          />
        ))}
      </div>
      
    </div>
  );
}