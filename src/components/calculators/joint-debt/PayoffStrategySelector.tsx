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
  snowball: 'Focuses extra payments on the smallest balance first for quick psychological wins.',
  avalanche: 'Targets the highest interest rate first to mathematically save you the most money.',
};

export function PayoffStrategySelector({
  value,
  onChange,
  error,
}: PayoffStrategySelectorProps) {
  return (
    <div className="w-full">
      <ToggleGroup
        // Omitted the visual `label` prop to prevent duplication with the parent's header,
        // but included aria-label to ensure screen readers retain full context.
        aria-label="Target Method"
        options={STRATEGY_OPTIONS}
        value={value}
        onChange={(val) => onChange(val as PayoffStrategy)}
        error={error}
        hint={STRATEGY_DESCRIPTIONS[value]}
      />
    </div>
  );
}