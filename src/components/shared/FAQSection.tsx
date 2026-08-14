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
      
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 tracking-tight">
        {title}
      </h2>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-xl border border-slate-200 bg-white shadow-sm open:bg-slate-50 transition-colors"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 md:p-6 text-base font-semibold text-slate-900 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-xl">
              <span className="pr-4">{item.question}</span>
              <span className="flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-slate-600 leading-relaxed text-base">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
