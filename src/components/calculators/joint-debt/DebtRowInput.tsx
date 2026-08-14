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
    <Card className="w-full">
      <CardContent className="p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-4 items-start">
          
          {/* Debt Name */}
          <div className="md:col-span-3 w-full">
            <label htmlFor={`debt-name-${debt.id}`} className="block text-sm font-medium text-slate-700 mb-1.5">
              Debt Name
            </label>
            <input
              type="text"
              id={`debt-name-${debt.id}`}
              value={debt.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Visa"
              className={`
                block w-full rounded-md border h-10 px-3 text-slate-900 shadow-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm
                ${errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300' 
                  : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder-slate-400'}
              `.replace(/\s+/g, ' ').trim()}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `debt-name-error-${debt.id}` : undefined}
            />
            {errors.name && (
              <p id={`debt-name-error-${debt.id}`} className="mt-1.5 text-sm text-red-600 font-medium" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Balance */}
          <div className="md:col-span-3">
            <NumberInput
              id={`debt-balance-${debt.id}`}
              label="Current Balance"
              value={debt.balance}
              onChange={(e) => handleChange('balance', e.target.value)}
              error={errors.balance}
              placeholder="0"
              min="0"
              step="any"
            />
          </div>

          {/* APR */}
          <div className="md:col-span-2">
            <NumberInput
              id={`debt-apr-${debt.id}`}
              label="APR (%)"
              value={debt.apr}
              onChange={(e) => handleChange('apr', e.target.value)}
              error={errors.apr}
              placeholder="0"
              min="0"
              step="any"
            />
          </div>

          {/* Minimum Payment */}
          <div className="md:col-span-3">
            <NumberInput
              id={`debt-min-${debt.id}`}
              label="Min Payment"
              value={debt.minimumPayment}
              onChange={(e) => handleChange('minimumPayment', e.target.value)}
              error={errors.minimumPayment}
              placeholder="0"
              min="0"
              step="any"
            />
          </div>

          {/* Remove Button */}
          <div className="md:col-span-1 flex justify-end md:mt-7 mt-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemove(debt.id)}
              aria-label={`Remove ${debt.name || 'debt'}`}
              title="Remove Debt"
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 w-full md:w-auto"
            >
              <span className="md:hidden">Remove Debt</span>
              <svg className="hidden md:block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
