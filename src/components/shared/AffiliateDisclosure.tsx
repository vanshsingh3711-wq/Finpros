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
    <div className={`w-full max-w-4xl mx-auto px-4 py-6 ${className}`.trim()}>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center max-w-2xl mx-auto">
        {text}
      </p>
    </div>
  );
}
