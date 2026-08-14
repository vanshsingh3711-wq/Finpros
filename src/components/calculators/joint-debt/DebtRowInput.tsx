import * as React from 'react';
import { DebtDraftState } from '../../../lib/calculations/jointDebtState';
import { NumberInput } from '../../ui/NumberInput';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';

export interface DebtRowErrors {
  name?: string;
  balance?: string;
  apr?: string;
  minimumPayment?: string;
}

export interface DebtRowInputProps {
  debt: DebtDraftState;
  onChange: (debt: DebtDraftState) => void;
  onRemove: (id: string) => void;
  errors?: DebtRowErrors;
}

export function DebtRowInput({ debt, onChange, onRemove, errors = {} }: DebtRowInputProps) {
  const handleChange = (field: keyof DebtDraftState, value: string) => {
    onChange({ ...debt, [field]: value });
  };

  return (
    <Card className="w-full border-slate-200 shadow-sm transition-all hover:border-slate-300 overflow-hidden bg-white">
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* Debt Name */}
          <div className="col-span-2 md:col-span-3 w-full">
            <label 
              htmlFor={`debt-name-${debt.id}`} 
              className="block text-sm font-bold text-slate-900 mb-2.5 tracking-tight"
            >
              Debt Name
            </label>
            <input
              type="text"
              id={`debt-name-${debt.id}`}
              value={debt.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Chase Sapphire"
              className={`
                block w-full rounded-lg border h-11 px-4 text-slate-900 shadow-sm transition-all font-medium
                focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 sm:text-sm bg-white
                placeholder:text-slate-400 placeholder:font-normal
                ${errors.name 
                  ? 'border-red-700 focus:border-red-700 focus:ring-red-700 text-red-900 bg-red-50/50' 
                  : 'border-slate-200 hover:border-slate-300'}
              `.replace(/\s+/g, ' ').trim()}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `debt-name-error-${debt.id}` : undefined}
            />
            {errors.name && (
              <p id={`debt-name-error-${debt.id}`} className="mt-2 text-[13px] text-red-700 font-medium" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Balance */}
          <div className="col-span-1 md:col-span-3">
            <NumberInput
              id={`debt-balance-${debt.id}`}
              label="Current Balance"
              value={debt.balance}
              onChange={(e) => handleChange('balance', e.target.value)}
              error={errors.balance}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </div>

          {/* APR */}
          <div className="col-span-1 md:col-span-2">
            <NumberInput
              id={`debt-apr-${debt.id}`}
              label="APR (%)"
              value={debt.apr}
              onChange={(e) => handleChange('apr', e.target.value)}
              error={errors.apr}
              placeholder="0.0"
              min="0"
              step="any"
            />
          </div>

          {/* Minimum Payment */}
          <div className="col-span-2 md:col-span-3">
            <NumberInput
              id={`debt-min-${debt.id}`}
              label="Min Payment"
              value={debt.minimumPayment}
              onChange={(e) => handleChange('minimumPayment', e.target.value)}
              error={errors.minimumPayment}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </div>

          {/* Remove Button */}
          <div className="col-span-2 md:col-span-1 flex justify-end md:mt-8 mt-4 border-t md:border-t-0 pt-5 md:pt-0 border-slate-100">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemove(debt.id)}
              aria-label={`Remove ${debt.name || 'debt'}`}
              title="Remove Debt"
              className="text-slate-400 hover:text-red-700 hover:bg-red-50 w-full md:w-auto h-11 transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <span className="md:hidden font-semibold">Remove Debt</span>
              <svg className="hidden md:block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

