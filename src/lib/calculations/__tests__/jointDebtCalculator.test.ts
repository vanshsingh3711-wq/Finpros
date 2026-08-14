import { describe, it, expect } from 'vitest';
import { 
  calculateJointDebtPayoff, 
  JointDebtCalculatorInput, 
  JointDebtValidationError,
  JointDebtCalculationError
} from '../jointDebtCalculator';

// Helper to create a base standard input for testing
const createBaseInput = (): JointDebtCalculatorInput => ({
  debts: [],
  incomeA: 60000,
  incomeB: 40000,
  extraPayment: 0,
  strategy: 'snowball',
  calculationDate: '2026-08-14'
});

describe('Joint Debt Payoff Calculator', () => {
  
  describe('1. BASIC PAYOFF', () => {
    it('calculates a simple 1-month deterministic payoff correctly', () => {
      // 1000 balance, 0% APR, 1000 min payment -> exactly 1 month
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt 1', balance: 1000, apr: 0, minimumPayment: 1000 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      
      expect(result.totalMonths).toBe(1);
      expect(result.totalInterestPaid).toBe(0);
      expect(result.totalPaid).toBe(1000);
      expect(result.debtFreeDate).toBe('2026-09-14'); // 1 month from calculationDate
    });
  });

  describe('2. MULTIPLE DEBTS', () => {
    it('eventually pays off all debts and correctly zeroes out the balances', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        debts: [
          { id: 'd1', name: 'Debt 1', balance: 500, apr: 0, minimumPayment: 250 },
          { id: 'd2', name: 'Debt 2', balance: 1000, apr: 0, minimumPayment: 250 }
        ]
      };
      
      const result = calculateJointDebtPayoff(input);
      const lastMonth = result.timeline[result.timeline.length - 1];
      
      expect(result.totalMonths).toBeGreaterThan(0);
      expect(lastMonth.activeDebts.length).toBeGreaterThan(0);
      expect(lastMonth.activeDebts.every(d => d.endBalance === 0)).toBe(true);
    });
  });

  describe('3. SNOWBALL STRATEGY', () => {
    it('targets the smallest balance first', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        strategy: 'snowball',
        extraPayment: 100, // Extra payment should go to smallest balance
        debts: [
          { id: 'd1', name: 'Big', balance: 10000, apr: 5, minimumPayment: 100 },
          { id: 'd2', name: 'Small', balance: 1000, apr: 5, minimumPayment: 100 }
        ]
      };
      
      const result = calculateJointDebtPayoff(input);
      const month1 = result.timeline[0];
      
      const bigDebt = month1.activeDebts.find(d => d.id === 'd1');
      const smallDebt = month1.activeDebts.find(d => d.id === 'd2');
      
      // Small debt should receive min (100) + extra (100)
      expect(smallDebt?.paymentApplied).toBe(200);
      // Big debt should receive min (100) only
      expect(bigDebt?.paymentApplied).toBe(100);
    });
  });

  describe('4. AVALANCHE STRATEGY', () => {
    it('targets the highest APR first regardless of balance', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        strategy: 'avalanche',
        extraPayment: 100,
        debts: [
          { id: 'd1', name: 'High APR', balance: 10000, apr: 20, minimumPayment: 100 },
          { id: 'd2', name: 'Low APR', balance: 1000, apr: 5, minimumPayment: 100 }
        ]
      };
      
      const result = calculateJointDebtPayoff(input);
      const month1 = result.timeline[0];
      
      const highApr = month1.activeDebts.find(d => d.id === 'd1');
      const lowApr = month1.activeDebts.find(d => d.id === 'd2');
      
      // High APR receives min (100) + extra (100)
      expect(highApr?.paymentApplied).toBe(200);
      // Low APR receives min (100) only
      expect(lowApr?.paymentApplied).toBe(100);
    });
  });

  describe('5. ROLLOVER', () => {
    it('rolls the paid-off debts minimum payment into the next target', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        debts: [
          { id: 'd1', name: 'Almost Done', balance: 100, apr: 0, minimumPayment: 100 },
          { id: 'd2', name: 'Next', balance: 1000, apr: 0, minimumPayment: 100 }
        ]
      };
      
      const result = calculateJointDebtPayoff(input);
      const month2 = result.timeline[1];
      
      // In month 2, d1 is paid off. Its 100 min payment should roll to d2.
      // So d2 receives 100 (own min) + 100 (d1 min rollover) = 200
      const nextDebt = month2.activeDebts.find(d => d.id === 'd2');
      expect(nextDebt?.paymentApplied).toBe(200);
    });
  });

  describe('6. PARTNER SPLIT', () => {
    it('calculates strict proportional splits', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 60000,
        incomeB: 40000,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 0, minimumPayment: 100 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      const month1 = result.timeline[0];
      
      // 100 total payment. 60% A, 40% B
      expect(month1.splitA).toBe(60);
      expect(month1.splitB).toBe(40);
    });

    it('handles a zero-income partner correctly', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 0,
        incomeB: 50000,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 0, minimumPayment: 100 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      const month1 = result.timeline[0];
      
      expect(month1.splitA).toBe(0);
      expect(month1.splitB).toBe(100);
    });
  });

  describe('7. ZERO COMBINED INCOME', () => {
    it('rejects the input if both partners have zero income', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 0,
        incomeB: 0,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 0, minimumPayment: 100 }]
      };
      
      expect(() => calculateJointDebtPayoff(input)).toThrow(JointDebtValidationError);
    });
  });

  describe('8. INVALID INPUTS', () => {
    it('rejects an empty debt list', () => {
      expect(() => calculateJointDebtPayoff({ ...createBaseInput(), debts: [] })).toThrow(JointDebtValidationError);
    });
    
    it('rejects negative incomes', () => {
      expect(() => calculateJointDebtPayoff({ ...createBaseInput(), incomeA: -1 })).toThrow(JointDebtValidationError);
    });

    it('rejects negative balances', () => {
      expect(() => calculateJointDebtPayoff({
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt', balance: -100, apr: 0, minimumPayment: 100 }]
      })).toThrow(JointDebtValidationError);
    });

    it('rejects negative APR', () => {
      expect(() => calculateJointDebtPayoff({
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt', balance: 100, apr: -5, minimumPayment: 100 }]
      })).toThrow(JointDebtValidationError);
    });

    it('rejects negative minimum payment', () => {
      expect(() => calculateJointDebtPayoff({
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt', balance: 100, apr: 0, minimumPayment: -10 }]
      })).toThrow(JointDebtValidationError);
    });

    it('rejects negative extra payment', () => {
      expect(() => calculateJointDebtPayoff({ ...createBaseInput(), extraPayment: -50 })).toThrow(JointDebtValidationError);
    });

    it('rejects malformed dates', () => {
      expect(() => calculateJointDebtPayoff({ ...createBaseInput(), calculationDate: 'invalid-date' })).toThrow(JointDebtValidationError);
    });
  });

  describe('9. ZERO APR', () => {
    it('processes a 0% APR debt without generating interest', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 0, minimumPayment: 100 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      expect(result.totalInterestPaid).toBe(0);
      expect(result.totalPaid).toBe(1000);
    });
  });

  describe('10. ZERO MINIMUM PAYMENT', () => {
    it('can pay off a debt with zero minimum payment using extra payments', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        extraPayment: 200,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 0, minimumPayment: 0 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      expect(result.totalMonths).toBe(5); // 1000 / 200 = 5
    });
  });

  describe('11. NON-AMORTIZING CASE', () => {
    it('identifies and rejects a mathematically non-amortizing scenario', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt', balance: 100000, apr: 24, minimumPayment: 10 }] // Interest = 2000/mo, payment = 10
      };
      
      expect(() => calculateJointDebtPayoff(input)).toThrow(JointDebtCalculationError);
    });
  });

  describe('12. DATE DETERMINISM', () => {
    it('produces identical timelines for identical inputs regardless of environment state', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        calculationDate: '2026-01-01',
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 0, minimumPayment: 500 }]
      };
      
      const result1 = calculateJointDebtPayoff(input);
      const result2 = calculateJointDebtPayoff(input);
      
      expect(result1.debtFreeDate).toEqual(result2.debtFreeDate);
      expect(result1.timeline).toEqual(result2.timeline);
    });
  });

  describe('13. ROUNDING / TOLERANCE', () => {
    it('does not create extra months for microscopic residual balances', () => {
      // Simulate a scenario where floating point math leaves 0.00000001
      // We will ensure that after normal math, the timeline ends correctly.
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        debts: [{ id: 'd1', name: 'Debt', balance: 1000.001, apr: 0, minimumPayment: 1000 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      // The extra 0.001 is below the 0.005 threshold and should vanish, taking 1 month.
      expect(result.totalMonths).toBe(1);
    });
  });

  describe('14. MAXIMUM SCHEDULE SAFETY', () => {
    it('enforces the 1200 month limit defensive safeguard', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        // A balance that amortizes so slowly it would take > 100 years
        debts: [{ id: 'd1', name: 'Debt', balance: 1000000, apr: 0, minimumPayment: 1 }] 
      };
      
      expect(() => calculateJointDebtPayoff(input)).toThrow(JointDebtCalculationError);
    });
  });

  describe('15. TIMELINE ACCOUNTING', () => {
    it('preserves the fundamental accounting equation in the result timeline', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        extraPayment: 50,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 10, minimumPayment: 100 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      
      // Verify Total Paid = Principal + Interest
      expect(result.totalPaid).toBeCloseTo(result.totalPrincipalPaid + result.totalInterestPaid, 2);
      
      // Verify Total Paid matches the sum of partner contributions
      expect(result.totalPaid).toBeCloseTo(result.splitA + result.splitB, 2);

      // Verify each month adheres to accounting rules
      result.timeline.forEach(month => {
        month.activeDebts.forEach(debt => {
          const expectedEnd = debt.startBalance + debt.interestApplied - debt.paymentApplied;
          expect(debt.endBalance).toBeCloseTo(expectedEnd, 2);
        });
        
        expect(month.totalPaymentThisMonth).toBeCloseTo(month.splitA + month.splitB, 2);
      });
    });

    it('records a fully paid debt in its final month without generating a ghost month', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        extraPayment: 0,
        debts: [{ id: 'd1', name: 'Debt', balance: 100, apr: 0, minimumPayment: 100 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      
      // Should take exactly 1 month
      expect(result.totalMonths).toBe(1);
      expect(result.timeline.length).toBe(1);
      
      const finalMonth = result.timeline[0];
      expect(finalMonth.activeDebts.length).toBe(1);
      
      const debt = finalMonth.activeDebts[0];
      expect(debt.startBalance).toBe(100);
      expect(debt.paymentApplied).toBe(100);
      expect(debt.endBalance).toBe(0);
    });
  });

  describe('16. MONTHLY HELPER MECHANICS (processOneMonth)', () => {
    // Need to import processOneMonth. We will use a dynamic import to access it 
    // since it's exported but not explicitly typed in the main imports at the top
    it('correctly calculates unused minimum capacity and total rollover capacity without losing funds', async () => {
      const { processOneMonth } = await import('../jointDebtCalculator');
      
      const debts = [
        { id: 'A', name: 'Debt A', balance: 50, apr: 0, minimumPayment: 100 },
        { id: 'B', name: 'Debt B', balance: 5000, apr: 0, minimumPayment: 100 }
      ];
      
      const targetCapacity = 200;
      const result = processOneMonth(debts, 'A', targetCapacity);
      
      const debtA = result.activeDebts.find(d => d.id === 'A')!;
      expect(debtA.paymentApplied).toBe(50);
      expect(debtA.endBalance).toBe(0);
      
      const debtB = result.activeDebts.find(d => d.id === 'B')!;
      expect(debtB.paymentApplied).toBe(100);
      expect(debtB.endBalance).toBe(4900);
      
      expect(result.unusedMinimumCapacity).toBe(50);
      expect(result.unusedTargetCapacity).toBe(200);
      expect(result.totalUnusedCapacity).toBe(250);
      
      const scheduledMin = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
      const totalApplied = result.activeDebts.reduce((sum, d) => sum + d.paymentApplied, 0);
      expect(scheduledMin + targetCapacity).toBe(totalApplied + result.totalUnusedCapacity);
    });

    it('returns unused minimum capacity even for non-target debts that are paid off', async () => {
      const { processOneMonth } = await import('../jointDebtCalculator');
      
      const debts = [
        { id: 'Target', name: 'Target Debt', balance: 1000, apr: 0, minimumPayment: 100 },
        { id: 'NonTarget', name: 'Non Target', balance: 50, apr: 0, minimumPayment: 100 }
      ];
      
      const targetCapacity = 200;
      const result = processOneMonth(debts, 'Target', targetCapacity);
      
      const targetDebt = result.activeDebts.find(d => d.id === 'Target')!;
      expect(targetDebt.paymentApplied).toBe(300);
      
      const nonTarget = result.activeDebts.find(d => d.id === 'NonTarget')!;
      expect(nonTarget.paymentApplied).toBe(50);
      
      expect(result.unusedMinimumCapacity).toBe(50);
      expect(result.unusedTargetCapacity).toBe(0);
      expect(result.totalUnusedCapacity).toBe(50);
      
      const scheduledMin = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
      const totalApplied = result.activeDebts.reduce((sum, d) => sum + d.paymentApplied, 0);
      expect(scheduledMin + targetCapacity).toBe(totalApplied + result.totalUnusedCapacity);
    });
  });

  describe('17. TARGET SELECTION (selectTargetDebt)', () => {
    it('selects the smallest balance for snowball', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 5000, apr: 10, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 1000, apr: 5, minimumPayment: 100 },
        { id: '3', name: 'C', balance: 10000, apr: 20, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'snowball')).toBe('2');
    });

    it('ignores paid-off debts for snowball', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 5000, apr: 10, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 0, apr: 5, minimumPayment: 100 },
        { id: '3', name: 'C', balance: 10000, apr: 20, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'snowball')).toBe('1');
    });

    it('uses original input order for snowball ties', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 5000, apr: 10, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 1000, apr: 5, minimumPayment: 100 },
        { id: '3', name: 'C', balance: 1000, apr: 20, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'snowball')).toBe('2');
    });

    it('selects the highest APR for avalanche', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 5000, apr: 10, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 1000, apr: 5, minimumPayment: 100 },
        { id: '3', name: 'C', balance: 10000, apr: 20, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'avalanche')).toBe('3');
    });

    it('ignores paid-off debts for avalanche', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 5000, apr: 10, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 1000, apr: 5, minimumPayment: 100 },
        { id: '3', name: 'C', balance: 0, apr: 20, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'avalanche')).toBe('1');
    });

    it('uses original input order for avalanche ties', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 5000, apr: 20, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 1000, apr: 5, minimumPayment: 100 },
        { id: '3', name: 'C', balance: 10000, apr: 20, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'avalanche')).toBe('1');
    });

    it('returns null if no active debts remain', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '1', name: 'A', balance: 0, apr: 10, minimumPayment: 100 },
        { id: '2', name: 'B', balance: 0, apr: 5, minimumPayment: 100 }
      ];
      expect(selectTargetDebt(debts, 'snowball')).toBeNull();
      expect(selectTargetDebt(debts, 'avalanche')).toBeNull();
    });

    it('does not mutate the input array', async () => {
      const { selectTargetDebt } = await import('../jointDebtCalculator');
      const debts = [
        { id: '2', name: 'B', balance: 1000, apr: 5, minimumPayment: 100 },
        { id: '1', name: 'A', balance: 5000, apr: 10, minimumPayment: 100 }
      ];
      const originalCopy = JSON.parse(JSON.stringify(debts));
      selectTargetDebt(debts, 'snowball');
      selectTargetDebt(debts, 'avalanche');
      expect(debts).toEqual(originalCopy);
    });
  });
  describe('18. PARTNER CONTRIBUTION CONTRACT', () => {
    it('maintains correct contribution accounting invariants', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 60000,
        incomeB: 40000,
        extraPayment: 200,
        debts: [{ id: 'd1', name: 'Debt', balance: 5000, apr: 10, minimumPayment: 150 }]
      };
      
      const result = calculateJointDebtPayoff(input);
      
      // Proportions sum to 1
      expect(result.proportionA + result.proportionB).toBeCloseTo(1, 5);
      expect(result.proportionA).toBe(0.6);
      expect(result.proportionB).toBe(0.4);
      
      // Initial monthly amounts sum to the total initial payment
      expect(result.initialMonthlyContributionA + result.initialMonthlyContributionB).toBeCloseTo(result.initialMonthlyDebtPayment, 2);
      
      // Lifetime splits sum to the overall total paid
      expect(result.splitA + result.splitB).toBeCloseTo(result.totalPaid, 2);
    });

    it('handles zero-income edge cases accurately for proportions', () => {
      const inputA: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 0,
        incomeB: 40000,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 5, minimumPayment: 100 }]
      };
      
      const resultA = calculateJointDebtPayoff(inputA);
      expect(resultA.proportionA).toBe(0);
      expect(resultA.proportionB).toBe(1);
      
      const inputB: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 60000,
        incomeB: 0,
        debts: [{ id: 'd1', name: 'Debt', balance: 1000, apr: 5, minimumPayment: 100 }]
      };
      
      const resultB = calculateJointDebtPayoff(inputB);
      expect(resultB.proportionA).toBe(1);
      expect(resultB.proportionB).toBe(0);
    });
  });

  describe('19. PROPERTY & INVARIANT TESTING', () => {
    it('maintains strict mathematical invariants across a complex multi-year payoff', () => {
      const input: JointDebtCalculatorInput = {
        ...createBaseInput(),
        incomeA: 55000,
        incomeB: 45000,
        extraPayment: 325.50,
        calculationDate: '2024-02-29', // Leap year start
        debts: [
          { id: 'd1', name: 'Credit Card', balance: 14500.75, apr: 22.99, minimumPayment: 350 },
          { id: 'd2', name: 'Car Loan', balance: 22400.00, apr: 5.49, minimumPayment: 415.25 },
          { id: 'd3', name: 'Student Loan', balance: 45000.50, apr: 6.8, minimumPayment: 250 }
        ]
      };
      
      const result = calculateJointDebtPayoff(input);
      
      // Property 1: Totals never negative
      expect(result.totalMonths).toBeGreaterThan(0);
      expect(result.totalInterestPaid).toBeGreaterThanOrEqual(0);
      expect(result.totalPrincipalPaid).toBeGreaterThanOrEqual(0);
      expect(result.totalPaid).toBeGreaterThan(0);
      
      // Property 2: Balances never negative and end balance never exceeds accounting result
      let prevDate = new Date(input.calculationDate);
      
      result.timeline.forEach((month, idx) => {
        month.activeDebts.forEach(debt => {
          expect(debt.startBalance).toBeGreaterThan(0);
          expect(debt.endBalance).toBeGreaterThanOrEqual(0);
          expect(debt.interestApplied).toBeGreaterThanOrEqual(0);
          expect(debt.paymentApplied).toBeGreaterThanOrEqual(0);
          
          // Payment never exceeds available balance + interest (with slight float tolerance)
          expect(debt.paymentApplied).toBeLessThanOrEqual(debt.startBalance + debt.interestApplied + 0.01);
        });

        // Property 3: Timeline dates strictly progress by one month
        const currDate = new Date(month.date);
        expect(currDate.getTime()).toBeGreaterThan(prevDate.getTime());
        prevDate = currDate;
      });

      // Property 4: All debts are strictly zero at final payoff
      const finalMonth = result.timeline[result.timeline.length - 1];
      finalMonth.activeDebts.forEach(debt => {
        expect(debt.endBalance).toBe(0);
      });
      
      // Property 5: No timeline month exists after payoff
      // (If all are 0, there shouldn't be a next month)
      const secondToLast = result.timeline[result.timeline.length - 2];
      const anyStillActive = secondToLast.activeDebts.some(d => d.endBalance > 0);
      expect(anyStillActive).toBe(true);
    });
  });
});
