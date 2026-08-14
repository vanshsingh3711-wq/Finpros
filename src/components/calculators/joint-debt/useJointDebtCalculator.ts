"use client";

import { useState, useCallback } from 'react';
import { 
  JointDebtDraftState, 
  JointDebtValidationErrors,
  createEmptyDebtDraft,
  parseJointDebtState,
  DebtDraftState
} from '../../../lib/calculations/jointDebtState';
import { 
  PayoffStrategy,
  JointDebtCalculatorResult,
  calculateJointDebtPayoff,
  JointDebtCalculationError,
  JointDebtValidationError
} from '../../../lib/calculations/jointDebtCalculator';

export function useJointDebtCalculator(initialCalculationDate: string) {
  const getInitialState = (): JointDebtDraftState => ({
    incomeA: "",
    incomeB: "",
    extraPayment: "",
    strategy: "snowball",
    calculationDate: initialCalculationDate,
    debts: [createEmptyDebtDraft('initial-debt-1')]
  });

  const [draft, setDraft] = useState<JointDebtDraftState>(getInitialState);
  
  const [validationErrors, setValidationErrors] = useState<JointDebtValidationErrors | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [result, setResult] = useState<JointDebtCalculatorResult | null>(null);

  const setIncomeA = (val: string) => setDraft(prev => ({ ...prev, incomeA: val }));
  const setIncomeB = (val: string) => setDraft(prev => ({ ...prev, incomeB: val }));
  const setExtraPayment = (val: string) => setDraft(prev => ({ ...prev, extraPayment: val }));
  const setStrategy = (val: PayoffStrategy) => setDraft(prev => ({ ...prev, strategy: val }));
  const setCalculationDate = (val: string) => setDraft(prev => ({ ...prev, calculationDate: val }));
  
  const setDebts = (debts: DebtDraftState[]) => setDraft(prev => ({ ...prev, debts }));

  const addDebt = () => {
    setDraft(prev => ({
      ...prev,
      debts: [...prev.debts, createEmptyDebtDraft(crypto.randomUUID())]
    }));
  };

  const updateDebt = (updatedDebt: DebtDraftState) => {
    setDraft(prev => ({
      ...prev,
      debts: prev.debts.map(d => (d.id === updatedDebt.id ? updatedDebt : d))
    }));
  };

  const removeDebt = (idToRemove: string) => {
    setDraft(prev => ({
      ...prev,
      debts: prev.debts.filter(d => d.id !== idToRemove)
    }));
  };

  const reset = useCallback(() => {
    setDraft(getInitialState());
    setValidationErrors(null);
    setCalculationError(null);
    setResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCalculationDate]);

  const calculate = () => {
    // Clear previous errors/results
    setValidationErrors(null);
    setCalculationError(null);
    setResult(null);

    // 1. Parse draft state
    const parseResult = parseJointDebtState(draft);

    // 2. If parsing fails, expose structured errors
    if (!parseResult.success) {
      setValidationErrors(parseResult.errors || null);
      return;
    }

    // 3. If parsing succeeds, run calculation engine
    if (parseResult.data) {
      try {
        const calcResult = calculateJointDebtPayoff(parseResult.data);
        setResult(calcResult);
      } catch (err) {
        if (err instanceof JointDebtCalculationError || err instanceof JointDebtValidationError) {
          setCalculationError(err.message);
        } else if (err instanceof Error) {
          setCalculationError(err.message);
        } else {
          setCalculationError("An unexpected error occurred during calculation.");
        }
      }
    }
  };

  return {
    draft,
    validationErrors,
    calculationError,
    result,
    actions: {
      setIncomeA,
      setIncomeB,
      setExtraPayment,
      setStrategy,
      setCalculationDate,
      setDebts,
      addDebt,
      updateDebt,
      removeDebt,
      calculate,
      reset
    }
  };
}