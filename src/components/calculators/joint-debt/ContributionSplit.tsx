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
      <CardHeader className="pb-8 text-center border-b border-slate-100 mb-8">
        <CardTitle as="h2" className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Fair Contribution Split
        </CardTitle>
        <CardDescription className="text-[15px] text-slate-500 mt-2">
          The split is proportionally based on each partner&apos;s share of the combined household income.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Total Initial Monthly Payment */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Total Monthly Payment
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {formatCurrency(result.initialMonthlyDebtPayment)}
          </span>
          <span className="mt-4 text-[13px] text-slate-500 font-medium bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            Combined initial commitment
          </span>
        </div>

        {/* Partner Splits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          
          {/* Partner A */}
          <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden transition-all hover:border-slate-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest">Partner A</h3>
              {/* Signature Teal Accent for the "Fair Share" metric */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100/50">
                {percentA}% Share
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1.5 tracking-tight tabular-nums">
              {formatCurrency(result.initialMonthlyContributionA)}
            </div>
            <div className="text-[13px] text-slate-500 font-medium">
              initial monthly contribution
            </div>
          </div>

          {/* Partner B */}
          <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden transition-all hover:border-slate-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest">Partner B</h3>
              {/* Signature Teal Accent for the "Fair Share" metric */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100/50">
                {percentB}% Share
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1.5 tracking-tight tabular-nums">
              {formatCurrency(result.initialMonthlyContributionB)}
            </div>
            <div className="text-[13px] text-slate-500 font-medium">
              initial monthly contribution
            </div>
          </div>
          
        </div>

        {/* Lifetime Totals Section */}
        <div className="pt-8 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">
            Total Contributed Over Payoff
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col py-2">
              <span className="text-slate-500 text-[13px] font-medium mb-1.5">Partner A Lifetime Total</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums tracking-tight">
                {formatCurrency(result.splitA)}
              </span>
            </div>
            <div className="flex flex-col py-2">
              <span className="text-slate-500 text-[13px] font-medium mb-1.5">Partner B Lifetime Total</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums tracking-tight">
                {formatCurrency(result.splitB)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
