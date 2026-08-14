import { JointDebtCalculatorInput, PayoffStrategy, DebtInput } from './jointDebtCalculator';

export interface DebtDraftState {
  id: string;
  name: string;
  balance: string;
  apr: string;
  minimumPayment: string;
}

export interface JointDebtDraftState {
  debts: DebtDraftState[];
  incomeA: string;
  incomeB: string;
  extraPayment: string;
  strategy: PayoffStrategy;
  calculationDate: string; // Expected format: YYYY-MM-DD
}

export type JointDebtValidationErrors = {
  general?: string;
  incomeA?: string;
  incomeB?: string;
  extraPayment?: string;
  calculationDate?: string;
  debts?: Record<string, {
    name?: string;
    balance?: string;
    apr?: string;
    minimumPayment?: string;
  }>;
};

export interface JointDebtParseResult {
  success: boolean;
  data?: JointDebtCalculatorInput;
  errors?: JointDebtValidationErrors;
}

/**
 * Creates an empty debt draft object. The ID must be supplied by the caller (e.g. crypto.randomUUID()).
 */
export function createEmptyDebtDraft(id: string): DebtDraftState {
  return {
    id,
    name: '',
    balance: '',
    apr: '',
    minimumPayment: ''
  };
}

/**
 * Helper to safely parse a string input into a number.
 * Returns null if the string is empty or completely invalid.
 */
function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}

/**
 * Validates the UI string-based draft state and transforms it into the strict, 
 * numeric `JointDebtCalculatorInput` required by the financial engine.
 * 
 * Returns a success boolean and either the parsed `data` or a map of `errors`.
 */
export function parseJointDebtState(draft: JointDebtDraftState): JointDebtParseResult {
  const errors: JointDebtValidationErrors = {};
  const debtsErrors: NonNullable<JointDebtValidationErrors['debts']> = {};
  
  const parsedIncomeA = parseNumber(draft.incomeA);
  const parsedIncomeB = parseNumber(draft.incomeB);
  const parsedExtra = parseNumber(draft.extraPayment);

  let hasErrors = false;

  if (parsedIncomeA === null || parsedIncomeA < 0) {
    errors.incomeA = 'Please enter a valid positive number or 0.';
    hasErrors = true;
  }
  if (parsedIncomeB === null || parsedIncomeB < 0) {
    errors.incomeB = 'Please enter a valid positive number or 0.';
    hasErrors = true;
  }
  if (parsedIncomeA === 0 && parsedIncomeB === 0) {
    errors.general = 'Both incomes cannot be zero. At least one partner must have income.';
    hasErrors = true;
  }

  if (parsedExtra === null || parsedExtra < 0) {
    errors.extraPayment = 'Please enter a valid positive number or 0.';
    hasErrors = true;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!draft.calculationDate || !dateRegex.test(draft.calculationDate)) {
    errors.calculationDate = 'Please select a valid date in YYYY-MM-DD format.';
    hasErrors = true;
  } else {
     const d = new Date(draft.calculationDate);
     // Note: If you enter 2024-02-31, JS Date parses it as Mar 2.
     // ToisISOString().slice(0, 10) checks if the calendar date actually existed exactly as typed.
     if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== draft.calculationDate) {
        errors.calculationDate = 'Please select a valid calendar date.';
        hasErrors = true;
     }
  }

  if (!draft.debts || draft.debts.length === 0) {
    errors.general = errors.general 
      ? errors.general + ' Please add at least one debt.'
      : 'Please add at least one debt.';
    hasErrors = true;
  }

  const parsedDebts: DebtInput[] = [];

  for (const debt of draft.debts || []) {
    const debtErrors: NonNullable<JointDebtValidationErrors['debts']>[string] = {};
    let debtHasErrors = false;

    if (!debt.name || debt.name.trim() === '') {
      debtErrors.name = 'Name is required.';
      debtHasErrors = true;
    }

    const balance = parseNumber(debt.balance);
    if (balance === null || balance < 0) {
      debtErrors.balance = 'Must be a positive number.';
      debtHasErrors = true;
    }

    const apr = parseNumber(debt.apr);
    if (apr === null || apr < 0) {
      debtErrors.apr = 'Must be a positive number.';
      debtHasErrors = true;
    }

    const minPayment = parseNumber(debt.minimumPayment);
    if (minPayment === null || minPayment < 0) {
      debtErrors.minimumPayment = 'Must be a positive number.';
      debtHasErrors = true;
    }

    if (debtHasErrors) {
      debtsErrors[debt.id] = debtErrors;
      hasErrors = true;
    } else if (!hasErrors) {
      parsedDebts.push({
        id: debt.id,
        name: debt.name.trim(),
        balance: balance as number,
        apr: apr as number,
        minimumPayment: minPayment as number
      });
    }
  }

  if (Object.keys(debtsErrors).length > 0) {
    errors.debts = debtsErrors;
  }

  if (hasErrors) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      debts: parsedDebts,
      incomeA: parsedIncomeA as number,
      incomeB: parsedIncomeB as number,
      extraPayment: parsedExtra as number,
      strategy: draft.strategy,
      calculationDate: draft.calculationDate
    }
  };
}
