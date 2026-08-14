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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* 1. Income Section (Maintains its own card styling internally) */}
      <IncomeInputs
        incomeA={draft.incomeA}
        incomeB={draft.incomeB}
        onIncomeAChange={actions.setIncomeA}
        onIncomeBChange={actions.setIncomeB}
        incomeAError={validationErrors?.incomeA}
        incomeBError={validationErrors?.incomeB}
      />
      
      {/* 2. Debts Section */}
      <section 
        aria-label="Shared Debts"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300"
      >
        <DebtRowList
          debts={draft.debts}
          onChange={actions.setDebts}
          errors={validationErrors?.debts}
          listError={validationErrors?.general}
        />
      </section>

      {/* 3. Strategy & Extra Payments Section */}
      <section 
        aria-label="Payoff Strategy"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300"
      >
        <div className="border-b border-slate-200 pb-5 mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Payoff Strategy
          </h2>
          <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed max-w-2xl">
            Fine-tune how you tackle the debt. Adding extra monthly payments and choosing the right strategy can drastically reduce your total interest and timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Extra Payment Input */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-2 tracking-tight">Extra Payment</h3>
            <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
              Any additional money you can commit each month beyond your required minimums.
            </p>
            <div className="mt-auto">
              <NumberInput
                id="extra-payment"
                name="extraPayment"
                label="Monthly Extra Payment"
                value={draft.extraPayment}
                onChange={(e) => actions.setExtraPayment(e.target.value)}
                error={validationErrors?.extraPayment}
                placeholder="0.00"
                min="0"
                step="any"
              />
            </div>
          </div>
          
          {/* Strategy Selector */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-2 tracking-tight">Target Method</h3>
            <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
              Choose how your extra payments are distributed across your debts.
            </p>
            <div className="mt-auto">
              <PayoffStrategySelector
                value={draft.strategy}
                onChange={actions.setStrategy}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Global Engine Errors */}
      {calculationError && (
        <div 
          ref={errorRef}
          className="bg-red-50/80 border border-red-200 rounded-xl p-5 shadow-sm flex items-start gap-3 mt-4" 
          role="alert"
        >
          <svg className="w-5 h-5 text-red-700 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-red-900 mb-1">Calculation Error</h3>
            <p className="text-[13px] text-red-800 leading-relaxed">{calculationError}</p>
          </div>
        </div>
      )}

      {/* 5. Primary Action Area */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-4">
        {/* Enforcing the Teal brand color strictly on the primary CTA */}
        <Button 
          onClick={actions.calculate} 
          className="flex-1 sm:flex-[2] h-14 text-lg font-bold tracking-wide rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-md hover:shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          Calculate Payoff Plan
        </Button>
        <Button 
          onClick={actions.reset} 
          variant="secondary" 
          className="flex-1 h-14 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          Reset Calculator
        </Button>
      </div>

      {/* 6. Results Layer */}
      {result && (
        <div 
          ref={resultsRef}
          className="space-y-10 pt-16 mt-8 border-t-2 border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-700 mb-5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Your Payoff Plan</h2>
            <p className="text-[15px] text-slate-500 mt-3 max-w-xl mx-auto">
              Based on your inputs, here is your most efficient path to becoming debt-free together.
            </p>
          </div>
          
          <ResultsSummary result={result} />
          <ContributionSplit result={result} />
          <PayoffChart result={result} />
        </div>
      )}
      
    </div>
  );
}