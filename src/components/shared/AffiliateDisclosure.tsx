import * as React from 'react';

export interface AffiliateDisclosureProps {
  /** 
   * Optional custom disclosure text.
   * Defaults to a standard FTC-compliant disclosure.
   */
  text?: string;
  className?: string;
}

export function AffiliateDisclosure({
  text = 'Disclosure: Some links on FinPros may be affiliate links, which means we may earn a commission at no additional cost to you.',
  className = '',
}: AffiliateDisclosureProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-4 ${className}`.trim()}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 max-w-2xl mx-auto">
        <svg 
          className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[13px] text-slate-500 leading-relaxed text-center sm:text-left">
          {text}
        </p>
      </div>
    </div>
  );
}