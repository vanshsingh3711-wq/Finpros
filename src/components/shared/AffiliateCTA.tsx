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
      className={`w-full max-w-4xl mx-auto space-y-6 ${className}`.trim()}
      aria-labelledby="affiliate-cta-heading"
    >
      <div className="text-center">
        <h2 id="affiliate-cta-heading" className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-slate-500">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
        {offers.map((offer, index) => {
          const rel = offer.external ? "noopener noreferrer" : undefined;
          const target = offer.external ? "_blank" : undefined;

          return (
            <Card 
              key={index} 
              className="flex flex-col h-full bg-slate-50/50 border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                  {offer.description}
                </p>
                <div className="mt-auto">
                  {offer.href ? (
                    <a
                      href={offer.href}
                      target={target}
                      rel={rel}
                      className="inline-flex w-full sm:w-auto items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 h-10 px-6 text-sm"
                    >
                      {offer.label}
                    </a>
                  ) : (
                    <div className="text-sm font-medium text-slate-500 italic">
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
