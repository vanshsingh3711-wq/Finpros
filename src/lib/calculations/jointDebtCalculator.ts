/**
 * JOINT DEBT PAYOFF CALCULATOR DOMAIN MODEL
 * 
 * PURE FUNCTIONALITY & DETERMINISM:
 * - This module must remain completely pure and deterministic.
 * - Given the exact same input, it must always produce the exact same output.
 * - It must NEVER call `new Date()`, `Date.now()`, or browser APIs.
 * 
 * INPUT VALIDATION RULES (Strict Rejection, No Coercion):
 * The engine must explicitly throw an error and reject the input if any of the following occur:
 * 1. Negative income (incomeA < 0 or incomeB < 0).
 * 2. Negative extra payment (extraPayment < 0).
 * 3. Negative debt balance (balance < 0).
 * 4. Negative APR (apr < 0).
 * 5. Negative minimum payment (minimumPayment < 0).
 * 6. Empty debt list (debts.length === 0).
 * 7. Invalid or malformed ISO calculation date string.
 * 8. Both incomes are zero (incomeA === 0 && incomeB === 0). Proportions cannot be determined.
 * 
 * ZERO INCOME BEHAVIOR:
 * - If one partner has 0 income and the other has >0 income, the zero-income partner contributes 0% 
 *   and the other contributes 100%.
 * 
 * MONTHLY PAYMENT & INTEREST ALGORITHM MODEL:
 * For each month, the engine will process exactly in this order:
 * A. Apply monthly interest to each outstanding debt: Balance * (APR / 100) / 12.
 * B. Determine required minimum payments for all active debts.
 * C. Apply available payment capacity to satisfy minimums.
 * D. Apply the entire extra payment to the actively selected target debt based on the strategy.
 * E. When a debt is paid off, its previous minimum-payment capacity rolls completely into the target debt.
 * F. Continue until all balances reach zero.
 * 
 * NON-AMORTIZING DEBT DETECTION:
 * - If the total available payment capacity in a month cannot cover the total accrued interest 
 *   across all debts, the debt is mathematically non-amortizing.
 * - The engine must immediately identify this state and throw a "Non-amortizing debt" exception 
 *   rather than endlessly looping.
 * 
 * SAFETY LIMIT:
 * - A hard limit of 1200 months is enforced purely as a defensive programming safeguard against 
 *   algorithmic infinite loops. It is NOT the definition of an impossible payoff.
 * 
 * ROUNDING & TOLERANCE:
 * - Internal calculations must be performed using full JavaScript numeric floating-point precision.
 * - Payoff Tolerance: A debt balance <= 0.005 is treated as strictly 0.00 to prevent microscopic 
 *   floating-point residuals (e.g., 0.00000000001) from generating a spurious extra month.
 * - Externally reported monetary result values must be rounded to the nearest cent.
 */

export type PayoffStrategy = 'snowball' | 'avalanche';

export class JointDebtValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JointDebtValidationError';
  }
}

export class JointDebtCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JointDebtCalculationError';
  }
}

export interface DebtInput {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minimumPayment: number;
}

export interface JointDebtCalculatorInput {
  debts: DebtInput[];
  incomeA: number;
  incomeB: number;
  extraPayment: number;
  strategy: PayoffStrategy;
  calculationDate: string; // ISO 8601 Date String format (YYYY-MM-DD). Deterministic.
}

export interface DebtStatusEntry {
  id: string;
  startBalance: number;
  interestApplied: number;
  paymentApplied: number;
  endBalance: number;
}

export interface DebtTimelineEntry {
  month: number;
  date: string; // ISO 8601 Date String
  activeDebts: DebtStatusEntry[];
  totalPaymentThisMonth: number;
  splitA: number; // Partner A's proportional contribution this month
  splitB: number; // Partner B's proportional contribution this month
}

export interface JointDebtCalculatorResult {
  totalMonths: number;
  debtFreeDate: string; // ISO 8601 Date String
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalPaid: number;
  splitA: number; // Partner A's total lifetime contribution
  splitB: number; // Partner B's total lifetime contribution
  proportionA: number; // Partner A's income proportion
  proportionB: number; // Partner B's income proportion
  initialMonthlyDebtPayment: number;
  initialMonthlyContributionA: number;
  initialMonthlyContributionB: number;
  timeline: DebtTimelineEntry[];
}

export interface MonthlyPayoffResult {
  activeDebts: DebtStatusEntry[];
  unusedMinimumCapacity: number;
  unusedTargetCapacity: number;
  totalUnusedCapacity: number;
}

/**
 * PURE HELPER: Selects the next debt to target for extra payments.
 * - 'snowball': Targets the active debt with the smallest balance.
 * - 'avalanche': Targets the active debt with the highest APR.
 * - Ties are broken by the original input array order.
 * - Ignores already-paid debts.
 */
export function selectTargetDebt(
  currentDebts: DebtInput[],
  strategy: 'snowball' | 'avalanche'
): string | null {
  const PAYOFF_TOLERANCE = 0.005;
  const applyTolerance = (balance: number) => (balance <= PAYOFF_TOLERANCE ? 0 : balance);

  let bestDebt: DebtInput | null = null;

  for (const debt of currentDebts) {
    if (applyTolerance(debt.balance) === 0) {
      continue;
    }

    if (!bestDebt) {
      bestDebt = debt;
      continue;
    }

    if (strategy === 'snowball') {
      if (debt.balance < bestDebt.balance) {
        bestDebt = debt;
      }
    } else if (strategy === 'avalanche') {
      if (debt.apr > bestDebt.apr) {
        bestDebt = debt;
      }
    }
  }

  return bestDebt ? bestDebt.id : null;
}

/**
 * PURE HELPER: Processes exactly one month of interest and payments.
 * - Applies interest to all active debts.
 * - Applies minimum payments to all active debts.
 * - Applies any provided target capacity (extra payment + rollovers) to the target debt.
 * - Enforces payoff tolerance (balances <= 0.005 become 0).
 */
export function processOneMonth(
  currentDebts: DebtInput[],
  targetDebtId: string | null,
  targetPaymentCapacity: number
): MonthlyPayoffResult {
  const PAYOFF_TOLERANCE = 0.005;
  const applyTolerance = (balance: number) => (balance <= PAYOFF_TOLERANCE ? 0 : balance);

  const resultDebts: DebtStatusEntry[] = [];
  let remainingTargetCapacity = targetPaymentCapacity;
  let unusedMinimumCapacity = 0;

  for (const debt of currentDebts) {
    if (applyTolerance(debt.balance) === 0) {
      continue;
    }

    const interestApplied = (debt.balance * (debt.apr / 100)) / 12;
    const balanceAfterInterest = debt.balance + interestApplied;

    const minimumRequired = Math.min(debt.minimumPayment, balanceAfterInterest);
    let paymentApplied = minimumRequired;
    let currentBalance = balanceAfterInterest - paymentApplied;

    // Track any scheduled minimum payment capacity that was not needed
    unusedMinimumCapacity += (debt.minimumPayment - minimumRequired);

    if (debt.id === targetDebtId && remainingTargetCapacity > 0) {
      const amountTargetCanAbsorb = applyTolerance(currentBalance) > 0 ? currentBalance : 0;
      const extraApplied = Math.min(remainingTargetCapacity, amountTargetCanAbsorb);
      paymentApplied += extraApplied;
      currentBalance -= extraApplied;
      remainingTargetCapacity -= extraApplied;
    }

    resultDebts.push({
      id: debt.id,
      startBalance: debt.balance,
      interestApplied,
      paymentApplied,
      endBalance: applyTolerance(currentBalance)
    });
  }

  return {
    activeDebts: resultDebts,
    unusedMinimumCapacity,
    unusedTargetCapacity: remainingTargetCapacity,
    totalUnusedCapacity: unusedMinimumCapacity + remainingTargetCapacity
  };
}

/**
 * Calculates the timeline and final results for paying off pooled debts.
 * 
 * NOTE: The implementation of this algorithm is deferred to a future task.
 * 
 * @param input - The domain model containing all debts, incomes, dates, and strategies.
 * @returns The complete payoff timeline and summarized financial totals.
 * @throws Error on invalid inputs, non-amortizing scenarios, or 1200+ month safety breaches.
 */
export function calculateJointDebtPayoff(input: JointDebtCalculatorInput): JointDebtCalculatorResult {
  const { debts, incomeA, incomeB, extraPayment, strategy, calculationDate } = input;

  // 1. Debt List
  if (!debts || debts.length === 0) {
    throw new JointDebtValidationError("Debt list cannot be empty.");
  }

  // 2. Income
  if (!Number.isFinite(incomeA) || incomeA < 0) {
    throw new JointDebtValidationError("incomeA must be a finite number >= 0.");
  }
  if (!Number.isFinite(incomeB) || incomeB < 0) {
    throw new JointDebtValidationError("incomeB must be a finite number >= 0.");
  }
  if (incomeA === 0 && incomeB === 0) {
    throw new JointDebtValidationError("Both incomes cannot be zero.");
  }

  // 3. Extra Payment
  if (!Number.isFinite(extraPayment) || extraPayment < 0) {
    throw new JointDebtValidationError("extraPayment must be a finite number >= 0.");
  }

  // 4. Each Debt & 7. Duplicate Debt IDs
  const seenIds = new Set<string>();
  for (const debt of debts) {
    if (!debt.id || typeof debt.id !== 'string' || debt.id.trim() === '') {
      throw new JointDebtValidationError("Debt id cannot be empty.");
    }
    if (!debt.name || typeof debt.name !== 'string' || debt.name.trim() === '') {
      throw new JointDebtValidationError("Debt name cannot be empty.");
    }
    if (!Number.isFinite(debt.balance) || debt.balance < 0) {
      throw new JointDebtValidationError(`Debt ${debt.id} balance must be a finite number >= 0.`);
    }
    if (!Number.isFinite(debt.apr) || debt.apr < 0) {
      throw new JointDebtValidationError(`Debt ${debt.id} APR must be a finite number >= 0.`);
    }
    if (!Number.isFinite(debt.minimumPayment) || debt.minimumPayment < 0) {
      throw new JointDebtValidationError(`Debt ${debt.id} minimum payment must be a finite number >= 0.`);
    }
    if (seenIds.has(debt.id)) {
      throw new JointDebtValidationError(`Duplicate debt ID detected: ${debt.id}.`);
    }
    seenIds.add(debt.id);
  }

  // 5. Calculation Date
  if (typeof calculationDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(calculationDate)) {
    throw new JointDebtValidationError("calculationDate must be in YYYY-MM-DD format.");
  }
  const parsedDate = new Date(calculationDate);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== calculationDate) {
    throw new JointDebtValidationError("calculationDate is not a valid calendar date.");
  }

  // 6. Strategy
  if (strategy !== 'snowball' && strategy !== 'avalanche') {
    throw new JointDebtValidationError("Strategy must be 'snowball' or 'avalanche'.");
  }

  const PAYOFF_TOLERANCE = 0.005;
  const applyTolerance = (balance: number) => (balance <= PAYOFF_TOLERANCE ? 0 : balance);

  const totalIncome = incomeA + incomeB;
  const proportionA = incomeA / totalIncome;
  const proportionB = incomeB / totalIncome;

  const totalOriginalMinimums = debts.reduce((sum, d) => sum + d.minimumPayment, 0);

  let activeDebts = debts.map(d => ({ ...d })).filter(d => applyTolerance(d.balance) > 0);
  let rolloverCash = 0;

  const timeline: DebtTimelineEntry[] = [];
  let totalMonths = 0;

  const advanceMonth = (isoDate: string, monthsToAdd: number): string => {
    const [yyyy, mm, dd] = isoDate.split('-').map(Number);
    let newMonth = mm + monthsToAdd;
    let newYear = yyyy;
    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    const maxDays = new Date(Date.UTC(newYear, newMonth, 0)).getUTCDate();
    const newDay = Math.min(dd, maxDays);
    return `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
  };

  while (activeDebts.length > 0) {
    if (totalMonths >= 1200) {
      throw new JointDebtCalculationError("Maximum schedule length exceeded (1200 months).");
    }

    let totalInterestThisMonth = 0;
    for (const d of activeDebts) {
      totalInterestThisMonth += (d.balance * (d.apr / 100)) / 12;
    }

    const activeMinimums = activeDebts.reduce((sum, d) => sum + d.minimumPayment, 0);
    const paidOffMinimums = totalOriginalMinimums - activeMinimums;
    const targetPaymentCapacity = extraPayment + paidOffMinimums + rolloverCash;
    const totalBudgetThisMonth = activeMinimums + targetPaymentCapacity;

    if (totalBudgetThisMonth < totalInterestThisMonth - 0.005) {
      throw new JointDebtCalculationError("The total monthly payment is insufficient to cover the interest.");
    }

    const targetId = selectTargetDebt(activeDebts, strategy);

    const monthResult = processOneMonth(activeDebts, targetId, targetPaymentCapacity);

    let monthTotalPayment = 0;
    for (const status of monthResult.activeDebts) {
      monthTotalPayment += status.paymentApplied;
    }

    const splitA = monthTotalPayment * proportionA;
    const splitB = monthTotalPayment - splitA; // Prevent penny rounding gap

    totalMonths++;
    const currentDate = advanceMonth(calculationDate, totalMonths);

    timeline.push({
      month: totalMonths,
      date: currentDate,
      activeDebts: monthResult.activeDebts,
      totalPaymentThisMonth: monthTotalPayment,
      splitA,
      splitB
    });

    rolloverCash = monthResult.totalUnusedCapacity;

    const nextActiveDebts: typeof activeDebts = [];
    for (const status of monthResult.activeDebts) {
      if (status.endBalance > 0) {
        const original = activeDebts.find(d => d.id === status.id)!;
        nextActiveDebts.push({
          ...original,
          balance: status.endBalance
        });
      }
    }
    activeDebts = nextActiveDebts;
  }

  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  let totalPaidOverall = 0;

  for (const month of timeline) {
    totalPaidOverall += month.totalPaymentThisMonth;
    for (const debt of month.activeDebts) {
      totalInterestPaid += debt.interestApplied;
      totalPrincipalPaid += (debt.paymentApplied - debt.interestApplied);
    }
  }

  const round = (val: number) => Math.round(val * 100) / 100;
  
  const finalTotalPaid = round(totalPaidOverall);
  const finalSplitA = round(totalPaidOverall * proportionA);
  const finalSplitB = finalTotalPaid - finalSplitA; // Prevent penny rounding gap

  const rawInitialPayment = timeline.length > 0 ? timeline[0].totalPaymentThisMonth : 0;
  const initialMonthlyDebtPayment = round(rawInitialPayment);
  const initialMonthlyContributionA = round(rawInitialPayment * proportionA);
  const initialMonthlyContributionB = round(initialMonthlyDebtPayment - initialMonthlyContributionA);

  return {
    totalMonths,
    debtFreeDate: totalMonths > 0 ? timeline[timeline.length - 1].date : calculationDate,
    totalInterestPaid: round(totalInterestPaid),
    totalPrincipalPaid: round(totalPrincipalPaid),
    totalPaid: finalTotalPaid,
    splitA: finalSplitA,
    splitB: finalSplitB,
    proportionA,
    proportionB,
    initialMonthlyDebtPayment,
    initialMonthlyContributionA,
    initialMonthlyContributionB,
    timeline
  };
}
