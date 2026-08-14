import * as React from 'react';
import { formatCurrency } from '../../../lib/formatters/currency';
import { JointDebtCalculatorResult } from '../../../lib/calculations/jointDebtCalculator';
import { Card, CardContent } from '../../ui/Card';

export interface ResultsSummaryProps {
  result: JointDebtCalculatorResult;
}

export function ResultsSummary({ result }: ResultsSummaryProps) {

  const formatDate = (isoDate: string) => {
    try {
      // Create date safely appending time to avoid timezone offset shifts for YYYY-MM-DD
      const date = new Date(`${isoDate}T12:00:00Z`);
      if (Number.isNaN(date.getTime())) return isoDate;

      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(date);
    } catch {
      return isoDate; 
    }
  };

  return (
    <Card className="w-full border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-8 sm:p-10">
        <h2 className="sr-only">Payoff Summary</h2>
        
        {/* Hero Metric: Debt-Free Date */}
        <div className="flex flex-col items-center text-center pb-10">
          <span 
            className="inline-flex items-center text-xs font-bold text-teal-700 uppercase tracking-widest mb-4 bg-teal-50 px-3.5 py-1.5 rounded-md border border-teal-100/50 shadow-sm"
            id="debt-free-date-label"
          >
            Estimated Debt-Free Date
          </span>
          <span 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight"
            aria-labelledby="debt-free-date-label"
          >
            {formatDate(result.debtFreeDate)}
          </span>
        </div>

        {/* Supporting Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-8 border-t border-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
          
          {/* Time to Payoff */}
          <div className="flex flex-col space-y-2 py-5 md:py-0 md:px-4">
            <span 
              className="text-[12px] font-bold text-slate-500 uppercase tracking-widest"
              id="time-to-payoff-label"
            >
              Time to Payoff
            </span>
            <span 
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight"
              aria-labelledby="time-to-payoff-label"
            >
              {result.totalMonths} {result.totalMonths === 1 ? 'month' : 'months'}
            </span>
          </div>

          {/* Total Interest */}
          <div className="flex flex-col space-y-2 py-5 md:py-0 md:px-4">
            <span 
              className="text-[12px] font-bold text-slate-500 uppercase tracking-widest"
              id="total-interest-label"
            >
              Total Interest
            </span>
            <span 
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight"
              aria-labelledby="total-interest-label"
            >
              {formatCurrency(result.totalInterestPaid)}
            </span>
          </div>

          {/* Total Amount Paid */}
          <div className="flex flex-col space-y-2 py-5 md:py-0 md:px-4">
            <span 
              className="text-[12px] font-bold text-slate-500 uppercase tracking-widest"
              id="total-paid-label"
            >
              Total Amount Paid
            </span>
            <span 
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight"
              aria-labelledby="total-paid-label"
            >
              {formatCurrency(result.totalPaid)}
            </span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}