import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS_REGISTRY } from '../lib/constants/tools';

export const metadata: Metadata = {
  title: 'FinPros – Free Consumer Finance Tools',
  description: 'Explore free, easy-to-use financial calculators and utilities designed to help you navigate debt, savings, and personal finance with confidence.',
  alternates: {
    canonical: '/',
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section 
        aria-label="Introduction" 
        className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Clear, practical financial tools.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            FinPros provides free, browser-based utilities to help you navigate debt, budget effectively, and make informed financial decisions.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section aria-labelledby="tools-heading" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <header className="text-center md:text-left">
          <h2 id="tools-heading" className="text-2xl font-bold text-slate-900">
            Available Tools
          </h2>
          <p className="text-slate-600 mt-2">
            Select a calculator below to get started. More tools will be added over time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_REGISTRY.map((tool) => (
            <Link 
              key={tool.id} 
              href={tool.path}
              className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Open ${tool.name}`}
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 mb-2">
                {tool.name}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Launch tool 
                <span aria-hidden="true" className="ml-1 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section aria-labelledby="privacy-heading" className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 id="privacy-heading" className="text-xl font-semibold text-slate-900">
            Browser-Based & Private
          </h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto">
            Your financial data is processed directly in your web browser. FinPros tools do not transmit your entered incomes, balances, or personal financial details to our servers for calculation.
          </p>
        </div>
      </section>
    </main>
  );
}
