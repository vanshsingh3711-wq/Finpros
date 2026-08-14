import * as React from 'react';
import { PayoffStrategy } from '../../../lib/calculations/jointDebtCalculator';
import { ToggleGroup, ToggleGroupOption } from '../../ui/ToggleGroup';

export interface PayoffStrategySelectorProps {
  value: PayoffStrategy;
  onChange: (value: PayoffStrategy) => void;
  error?: string;
}

const STRATEGY_OPTIONS: ToggleGroupOption[] = [
  { value: 'snowball', label: 'Snowball' },
  { value: 'avalanche', label: 'Avalanche' },
];

const STRATEGY_DESCRIPTIONS: Record<PayoffStrategy, string> = {
  snowball: 'Pay off the smallest balance first.',
  avalanche: 'Pay off the highest APR first.',
};

export function PayoffStrategySelector({
  value,
  onChange,
  error,
}: PayoffStrategySelectorProps) {
  return (
    <div className="w-full">
      <ToggleGroup
        label="Payoff strategy"
        options={STRATEGY_OPTIONS}
        value={value}
        onChange={(val) => onChange(val as PayoffStrategy)}
        error={error}
        hint={STRATEGY_DESCRIPTIONS[value]}
      />
    </div>
  );
}
