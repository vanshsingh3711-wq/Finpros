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
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-lg font-semibold text-slate-900">Your debts</h2>
        <Button 
          type="button" 
          onClick={handleAddDebt} 
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Add Debt
        </Button>
      </div>

      {listError && (
        <div className="rounded-md bg-red-50 p-3 mb-4" role="alert">
          <p className="text-sm font-medium text-red-800">{listError}</p>
        </div>
      )}

      <div className="space-y-5">
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
