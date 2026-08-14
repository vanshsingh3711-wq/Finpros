import React from 'react';
import { JointDebtCalculatorResult } from '../../../lib/calculations/jointDebtCalculator';
import { formatCurrency } from '../../../lib/formatters/currency';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';

export interface PayoffChartProps {
  result: JointDebtCalculatorResult;
}

export function PayoffChart({ result }: PayoffChartProps) {
  const { timeline, totalMonths, debtFreeDate } = result;

  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle as="h2">Payoff Timeline</CardTitle>
          <CardDescription>No timeline data available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 1. Prepare raw data points (Month 0 to Month N)
  // Derive Month 0 from the start balances of the first month's timeline entry
  const initialBalance = timeline[0].activeDebts.reduce((sum, d) => sum + d.startBalance, 0);
  
  const points = [
    { month: 0, date: 'Start', balance: initialBalance }
  ];

  for (const t of timeline) {
    points.push({
      month: t.month,
      date: t.date,
      balance: t.activeDebts.reduce((sum, d) => sum + d.endBalance, 0)
    });
  }

  // 2. Downsample for visual rendering to avoid overloading the DOM/SVG
  // Keep the accessible table fully intact, but reduce visual SVG nodes for performance.
  const visualPoints = [];
  const TARGET_POINTS = 50;
  
  visualPoints.push(points[0]);
  const step = Math.ceil(points.length / TARGET_POINTS);
  
  for (let i = step; i < points.length - 1; i += step) {
    visualPoints.push(points[i]);
  }
  if (points.length > 1) {
    visualPoints.push(points[points.length - 1]);
  }

  // 3. Construct SVG paths
  const maxMonth = visualPoints[visualPoints.length - 1].month;
  const maxBalance = visualPoints[0].balance; // Because balance strictly decreases

  const pathData = visualPoints.map((p) => {
    const x = maxMonth === 0 ? 0 : (p.month / maxMonth) * 100;
    const y = maxBalance === 0 ? 100 : 100 - (p.balance / maxBalance) * 100;
    return `${x},${y}`;
  });

  const polylinePoints = pathData.join(' ');
  const polygonPoints = `0,100 ${polylinePoints} 100,100`;

  const monthText = totalMonths === 1 ? 'month' : 'months';

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Payoff Timeline</CardTitle>
        <CardDescription>
          Estimated total remaining balance over the course of your payoff strategy.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Accessible Data Table (Screen Readers Only) */}
        <div className="sr-only">
          <table aria-label="Payoff Timeline Data">
            <thead>
              <tr>
                <th>Month</th>
                <th>Date</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.month}>
                  <td>Month {p.month}</td>
                  <td>{p.date}</td>
                  <td>{formatCurrency(p.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Visual Chart Presentation */}
        <div className="flex h-64 mt-4" aria-hidden="true">
          {/* Y-Axis Labels */}
          <div className="w-24 flex-shrink-0 flex flex-col justify-between items-end pr-3 text-xs font-medium text-slate-500 py-1">
            <span>{formatCurrency(maxBalance)}</span>
            <span>{formatCurrency(maxBalance / 2)}</span>
            <span>{formatCurrency(0)}</span>
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 relative border-l border-b border-slate-200">
            {/* 50% Horizontal Grid Line */}
            <div className="absolute inset-x-0 top-1/2 border-t border-slate-100 border-dashed" />
            
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full overflow-visible" 
              preserveAspectRatio="none"
            >
              <polygon 
                points={polygonPoints} 
                fill="#f8fafc" // slate-50
                stroke="none"
              />
              <polyline 
                points={polylinePoints} 
                fill="none" 
                stroke="#0f172a" // slate-900
                strokeWidth="2.5" 
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        
        {/* X-Axis Labels */}
        <div className="flex ml-24 mt-3 justify-between text-xs font-medium text-slate-500" aria-hidden="true">
          <span>Start</span>
          <span>{debtFreeDate} ({totalMonths} {monthText})</span>
        </div>
      </CardContent>
    </Card>
  );
}
