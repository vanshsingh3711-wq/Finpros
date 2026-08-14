import React from 'react';
import { JointDebtCalculatorResult } from '../../../lib/calculations/jointDebtCalculator';
import { formatCurrency } from '../../../lib/formatters/currency';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';

export interface PayoffChartProps {
  result: JointDebtCalculatorResult;
}

export function PayoffChart({ result }: PayoffChartProps) {
  const { timeline, totalMonths, debtFreeDate } = result;

  // Empty State with Premium Styling
  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center py-12">
          <CardTitle as="h2" className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Payoff Timeline
          </CardTitle>
          <CardDescription className="text-[15px] text-slate-500 mt-2">
            No timeline data available. Please check your inputs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 1. Prepare raw data points (Month 0 to Month N)
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
  const maxBalance = visualPoints[0].balance; 

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
      <CardHeader className="pb-8 text-center border-b border-slate-100 mb-8">
        <CardTitle as="h2" className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Payoff Timeline
        </CardTitle>
        <CardDescription className="text-[15px] text-slate-500 mt-2">
          Estimated total remaining balance over the course of your payoff strategy.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
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
        <div className="flex h-56 sm:h-80 mt-4" aria-hidden="true">
          
          {/* Y-Axis Labels */}
          <div className="w-16 sm:w-24 flex-shrink-0 flex flex-col justify-between items-end pr-3 sm:pr-4 text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-400 py-1 tabular-nums">
            <span>{formatCurrency(maxBalance)}</span>
            <span>{formatCurrency(maxBalance / 2)}</span>
            <span>{formatCurrency(0)}</span>
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 relative border-l border-b border-slate-200">
            {/* 50% Horizontal Grid Line */}
            <div className="absolute inset-x-0 top-1/2 border-t border-slate-200 border-dashed opacity-70" />
            
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full overflow-visible" 
              preserveAspectRatio="none"
            >
              <polygon 
                points={polygonPoints} 
                fill="#CCFBF1" // teal-100
                opacity="0.3"
                stroke="none"
              />
              <polyline 
                points={polylinePoints} 
                fill="none" 
                stroke="#0F766E" // teal-700
                strokeWidth="2.5" 
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        
        {/* X-Axis Labels */}
        <div className="flex ml-16 sm:ml-24 mt-3 sm:mt-4 justify-between items-start text-[10px] sm:text-xs font-medium" aria-hidden="true">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-1.5">
            Start
          </span>
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-[13px] font-bold text-teal-700 bg-teal-50 border border-teal-100/50 shadow-sm">
              {debtFreeDate}
            </span>
            <span className="text-slate-500 font-medium text-[13px] mt-1.5 pr-1">
              ({totalMonths} {monthText})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
