"use client";

import React, { useRef, useEffect } from 'react';
import { useJointDebtCalculator } from './useJointDebtCalculator';
import { IncomeInputs } from './IncomeInputs';
import { DebtRowList } from './DebtRowList';
import { PayoffStrategySelector } from './PayoffStrategySelector';
import { ResultsSummary } from './ResultsSummary';
import { ContributionSplit } from './ContributionSplit';
import { PayoffChart } from './PayoffChart';
import { Button } from '../../ui/Button';
import { NumberInput } from '../../ui/NumberInput';

export function JointDebtCalculator() {
  const { 
    draft, 
    validationErrors, 
    calculationError, 
    result, 
    actions 
  } = useJointDebtCalculator(new Date().toISOString().slice(0, 10));

  const errorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to calculation error if it appears
  useEffect(() => {
    if (calculationError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [calculationError]);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-8">
        <IncomeInputs
          incomeA={draft.incomeA}
          incomeB={draft.incomeB}
          onIncomeAChange={actions.setIncomeA}
          onIncomeBChange={actions.setIncomeB}
          incomeAError={validationErrors?.incomeA}
          incomeBError={validationErrors?.incomeB}
        />
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <DebtRowList
            debts={draft.debts}
            onChange={actions.setDebts}
            errors={validationErrors?.debts}
            listError={validationErrors?.general}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1.5">Extra Payment</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Any additional money you can pay each month beyond your minimums.
            </p>
            <NumberInput
              id="extra-payment"
              name="extraPayment"
              label="Monthly Extra Payment"
              value={draft.extraPayment}
              onChange={(e) => actions.setExtraPayment(e.target.value)}
              error={validationErrors?.extraPayment}
              placeholder="0"
              min="0"
              step="any"
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1.5">Payoff Strategy</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Choose how to target your extra payments.
            </p>
            <PayoffStrategySelector
              value={draft.strategy}
              onChange={actions.setStrategy}
            />
          </div>
        </div>

        {calculationError && (
          <div 
            ref={errorRef}
            className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm" 
            role="alert"
          >
            <h3 className="text-sm font-semibold text-red-800 mb-1">Calculation Error</h3>
            <p className="text-sm text-red-700">{calculationError}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button 
            onClick={actions.calculate} 
            className="flex-1 sm:flex-none text-base py-6 px-8 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            Calculate Payoff Plan
          </Button>
          <Button 
            onClick={actions.reset} 
            variant="secondary" 
            className="flex-1 sm:flex-none text-base py-6 px-8"
          >
            Reset
          </Button>
        </div>
      </div>

      {result && (
        <div 
          ref={resultsRef}
          className="space-y-8 pt-10 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Payoff Plan</h2>
            <p className="text-slate-500 mt-2">Here is how you can become debt-free together.</p>
          </div>
          
          <ResultsSummary result={result} />
          <ContributionSplit result={result} />
          <PayoffChart result={result} />
        </div>
      )}
    </div>
  );
}
