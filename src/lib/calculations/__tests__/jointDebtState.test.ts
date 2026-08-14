import { describe, it, expect } from 'vitest';
import { 
  JointDebtDraftState,
  parseJointDebtState,
  createEmptyDebtDraft
} from '../jointDebtState';

describe('Joint Debt State Boundary', () => {
  
  const createValidDraft = (): JointDebtDraftState => ({
    debts: [
      {
        id: '1',
        name: 'Debt 1',
        balance: '1000',
        apr: '5.5',
        minimumPayment: '100'
      }
    ],
    incomeA: '60000',
    incomeB: '40000',
    extraPayment: '200',
    strategy: 'snowball',
    calculationDate: '2026-08-14'
  });

  it('successfully parses a valid complete draft state into numeric engine inputs', () => {
    const draft = createValidDraft();
    const result = parseJointDebtState(draft);

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
    
    expect(result.data).toBeDefined();
    expect(result.data?.incomeA).toBe(60000);
    expect(result.data?.incomeB).toBe(40000);
    expect(result.data?.extraPayment).toBe(200);
    expect(result.data?.strategy).toBe('snowball');
    expect(result.data?.calculationDate).toBe('2026-08-14');
    
    expect(result.data?.debts.length).toBe(1);
    expect(result.data?.debts[0].balance).toBe(1000);
    expect(result.data?.debts[0].apr).toBe(5.5);
    expect(result.data?.debts[0].minimumPayment).toBe(100);
  });

  it('rejects an empty or malformed date', () => {
    const draft = createValidDraft();
    draft.calculationDate = '';
    
    let result = parseJointDebtState(draft);
    expect(result.success).toBe(false);
    expect(result.errors?.calculationDate).toBeDefined();

    draft.calculationDate = '2026-02-30'; // Invalid calendar date
    result = parseJointDebtState(draft);
    expect(result.success).toBe(false);
    expect(result.errors?.calculationDate).toBeDefined();
  });

  it('rejects negative numbers and empty strings for global fields', () => {
    const draft = createValidDraft();
    draft.incomeA = '-500';
    draft.incomeB = '';
    draft.extraPayment = 'abc'; // Invalid number
    
    const result = parseJointDebtState(draft);
    expect(result.success).toBe(false);
    
    expect(result.errors?.incomeA).toBeDefined();
    expect(result.errors?.incomeB).toBeDefined();
    expect(result.errors?.extraPayment).toBeDefined();
  });

  it('rejects if both partners have zero income', () => {
    const draft = createValidDraft();
    draft.incomeA = '0';
    draft.incomeB = '0';
    
    const result = parseJointDebtState(draft);
    expect(result.success).toBe(false);
    expect(result.errors?.general).toContain('Both incomes cannot be zero');
  });

  it('rejects an empty debt list', () => {
    const draft = createValidDraft();
    draft.debts = [];
    
    const result = parseJointDebtState(draft);
    expect(result.success).toBe(false);
    expect(result.errors?.general).toContain('add at least one debt');
  });

  it('validates individual debt fields and surfaces localized errors by debt ID', () => {
    const draft = createValidDraft();
    draft.debts.push({
      id: '2',
      name: '  ', // empty
      balance: '-100', // negative
      apr: '', // missing
      minimumPayment: 'text' // invalid
    });
    
    const result = parseJointDebtState(draft);
    expect(result.success).toBe(false);
    
    const debtErrors = result.errors?.debts?.['2'];
    expect(debtErrors).toBeDefined();
    expect(debtErrors?.name).toBeDefined();
    expect(debtErrors?.balance).toBeDefined();
    expect(debtErrors?.apr).toBeDefined();
    expect(debtErrors?.minimumPayment).toBeDefined();
    
    // First debt should not have errors
    expect(result.errors?.debts?.['1']).toBeUndefined();
  });

  it('creates an empty debt draft structure', () => {
    const empty = createEmptyDebtDraft('test-id');
    expect(empty.id).toBe('test-id');
    expect(empty.name).toBe('');
    expect(empty.balance).toBe('');
    expect(empty.apr).toBe('');
    expect(empty.minimumPayment).toBe('');
  });
});
