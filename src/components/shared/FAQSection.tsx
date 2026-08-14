import * as React from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  items,
  className = '',
}: FAQSectionProps) {
  if (!items || items.length === 0) return null;

  // Generate strict schema.org FAQPage JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // Safely escape characters that could prematurely close the script tag
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <section className={`w-full max-w-4xl mx-auto ${className}`.trim()}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />
      
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all duration-200 open:border-slate-300 open:shadow-md"
          >
            <summary className="flex cursor-pointer items-start justify-between p-6 sm:p-8 text-base font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 rounded-2xl transition-colors">
              <span className="pr-6 leading-snug">{item.question}</span>
              <span className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 group-open:text-teal-700 group-open:rotate-180 transition-all duration-300 mt-0.5">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 text-[15px] text-slate-600 leading-relaxed">
              <div className="border-t border-slate-100 pt-5">
                {item.answer}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}