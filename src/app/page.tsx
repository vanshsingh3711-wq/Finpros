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
    <main className="min-h-screen bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Editorial Hero Section */}
      <section 
        aria-label="Introduction" 
        className="bg-white border-b border-slate-200 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden"
      >
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-teal-700 to-transparent opacity-20"></div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Clear, practical <br className="hidden sm:block" />
            <span className="text-teal-700">financial tools.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            FinPros provides free, browser-based utilities to help you navigate debt, budget effectively, and make informed financial decisions with confidence.
          </p>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section aria-labelledby="tools-heading" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <header className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 id="tools-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Available Tools
            </h2>
            <p className="text-[15px] text-slate-500 mt-2 max-w-xl leading-relaxed">
              Select a calculator below to get started. All calculations are performed directly in your browser.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TOOLS_REGISTRY.map((tool) => (
            <Link 
              key={tool.id} 
              href={tool.path}
              className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              aria-label={`Open ${tool.name}`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-700 group-hover:border-teal-100/50 transition-colors mb-6">
                {/* Generic Tool Icon (Adapts per card) */}
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 mb-3 tracking-tight transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-500 text-[14px] leading-relaxed mb-8 flex-1">
                {tool.description}
              </p>
              
              <div className="mt-auto pt-5 border-t border-slate-100 flex items-center text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors uppercase tracking-widest">
                Launch tool 
                <span aria-hidden="true" className="ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-3 group-hover:translate-x-0 transition-all duration-300">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Privacy Block */}
      <section aria-labelledby="privacy-heading" className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-8 sm:p-14 text-center shadow-lg relative overflow-hidden">
          {/* Decorative Teal Glow in the dark block */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

          <div className="relative z-10 space-y-5">
            <div className="mx-auto w-14 h-14 bg-slate-800/80 rounded-full flex items-center justify-center border border-slate-700 mb-6">
              <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 id="privacy-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Browser-Based & Private
            </h2>
            <p className="text-slate-400 text-[15px] sm:text-base leading-relaxed max-w-2xl mx-auto">
              Your financial data is processed directly in your web browser. FinPros tools do not transmit your entered incomes, balances, or personal financial details to our servers for calculation.
            </p>
          </div>
        </div>
      </section>
      
    </main>
  );
}
