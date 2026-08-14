import React from 'react';
import { JointDebtCalculatorResult } from '../../../lib/calculations/jointDebtCalculator';
import { formatCurrency } from '../../../lib/formatters/currency';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';

export interface ContributionSplitProps {
  result: JointDebtCalculatorResult;
}

export function ContributionSplit({ result }: ContributionSplitProps) {
  // Convert decimal proportions to clean integer percentages for presentation
  const percentA = Math.round(result.proportionA * 100);
  const percentB = Math.round(result.proportionB * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Fair Contribution Split</CardTitle>
        <CardDescription>
          The split is based on each partner's share of combined income.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Total Initial Monthly Payment */}
        <div className="mb-8 pb-8 border-b border-slate-100 flex flex-col items-center text-center">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Initial Monthly Payment</span>
          <span className="text-4xl font-bold text-slate-900 tracking-tight">{formatCurrency(result.initialMonthlyDebtPayment)}</span>
        </div>

        {/* Partner Splits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Partner A */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">Partner A</h3>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {formatCurrency(result.initialMonthlyContributionA)}
            </div>
            <div className="text-sm text-slate-500 mb-6 font-medium">
              initial monthly contribution
            </div>
            <div className="mt-auto">
              <span className="inline-flex bg-white px-3 py-1.5 rounded text-sm font-semibold text-slate-700 border border-slate-200">
                {percentA}% of combined income
              </span>
            </div>
          </div>

          {/* Partner B */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">Partner B</h3>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {formatCurrency(result.initialMonthlyContributionB)}
            </div>
            <div className="text-sm text-slate-500 mb-6 font-medium">
              initial monthly contribution
            </div>
            <div className="mt-auto">
              <span className="inline-flex bg-white px-3 py-1.5 rounded text-sm font-semibold text-slate-700 border border-slate-200">
                {percentB}% of combined income
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Totals Section */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Total contributed over payoff
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="flex flex-col py-2">
              <span className="text-slate-500 text-sm font-medium mb-1">Partner A</span>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(result.splitA)}</span>
            </div>
            <div className="flex flex-col py-2 border-t border-slate-200 md:border-t-0 md:border-l md:border-slate-200">
              <span className="text-slate-500 text-sm font-medium mb-1">Partner B</span>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(result.splitB)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
