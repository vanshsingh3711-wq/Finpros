import * as React from 'react';
import { formatCurrency } from '../../../lib/formatters/currency';
import { JointDebtCalculatorResult } from '../../../lib/calculations/jointDebtCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle as="h2" className="text-slate-900">Payoff Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-1.5">
            <span 
              className="text-sm font-semibold text-slate-500 uppercase tracking-wider"
              id="debt-free-date-label"
            >
              Debt-free Date
            </span>
            <span 
              className="text-3xl font-bold text-slate-900"
              aria-labelledby="debt-free-date-label"
            >
              {formatDate(result.debtFreeDate)}
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            <span 
              className="text-sm font-semibold text-slate-500 uppercase tracking-wider"
              id="time-to-payoff-label"
            >
              Time to Payoff
            </span>
            <span 
              className="text-3xl font-bold text-slate-900"
              aria-labelledby="time-to-payoff-label"
            >
              {result.totalMonths} {result.totalMonths === 1 ? 'month' : 'months'}
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            <span 
              className="text-sm font-semibold text-slate-500 uppercase tracking-wider"
              id="total-interest-label"
            >
              Total Interest
            </span>
            <span 
              className="text-3xl font-bold text-slate-900"
              aria-labelledby="total-interest-label"
            >
              {formatCurrency(result.totalInterestPaid)}
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            <span 
              className="text-sm font-semibold text-slate-500 uppercase tracking-wider"
              id="total-paid-label"
            >
              Total Amount Paid
            </span>
            <span 
              className="text-3xl font-bold text-slate-900"
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
