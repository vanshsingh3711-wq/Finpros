import * as React from 'react';
import { Card, CardContent } from '../ui/Card';

export interface AffiliateOffer {
  title: string;
  description: string;
  href?: string;
  label: string;
  /** Set to true to open in a new tab securely */
  external?: boolean;
}

export interface AffiliateCTAProps {
  title?: string;
  description?: string;
  offers: AffiliateOffer[];
  className?: string;
}

export function AffiliateCTA({
  title = 'Want to pay it off faster?',
  description = 'Consider these options to help accelerate your financial journey.',
  offers,
  className = '',
}: AffiliateCTAProps) {
  if (!offers || offers.length === 0) return null;

  return (
    <section 
      className={`w-full max-w-4xl mx-auto space-y-8 ${className}`.trim()}
      aria-labelledby="affiliate-cta-heading"
    >
      {/* Editorial Header */}
      <div className="flex flex-col">
        <h2 id="affiliate-cta-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-[15px] text-slate-500 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Offer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer, index) => {
          const rel = offer.external ? "noopener noreferrer" : undefined;
          const target = offer.external ? "_blank" : undefined;

          return (
            <Card 
              key={index} 
              className="flex flex-col h-full bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-teal-700 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-8 flex-1">
                  {offer.description}
                </p>
                <div className="mt-auto">
                  {offer.href ? (
                    <a
                      href={offer.href}
                      target={target}
                      rel={rel}
                      className="inline-flex w-full justify-center items-center gap-2 h-11 px-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 transition-all"
                    >
                      {offer.label}
                      {/* External Link Icon */}
                      {offer.external && (
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </a>
                  ) : (
                    <div className="inline-flex w-full justify-center items-center h-11 px-5 text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg cursor-not-allowed">
                      {offer.label}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}