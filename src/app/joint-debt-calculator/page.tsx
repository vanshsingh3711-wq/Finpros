import React from 'react';
import { Metadata } from 'next';
import { JointDebtCalculator } from '../../components/calculators/joint-debt/JointDebtCalculator';
import { FAQSection } from '../../components/shared/FAQSection';
import { AffiliateCTA } from '../../components/shared/AffiliateCTA';
import { AffiliateDisclosure } from '../../components/shared/AffiliateDisclosure';
import { ToolSchema } from '../../components/shared/ToolSchema';
import { TOOLS_REGISTRY } from '../../lib/constants/tools';

export const metadata: Metadata = {
  title: 'Joint Debt Payoff Calculator for Couples – Split Debt Fairly',
  description: 'Calculate how to split debt fairly based on your incomes. Compare snowball and avalanche payoff strategies and see your estimated debt-free timeline.',
  alternates: {
    canonical: '/joint-debt-calculator',
  }
};

const toolData = TOOLS_REGISTRY.find(t => t.id === 'joint-debt') || {
  id: 'joint-debt',
  name: 'Joint Debt Payoff Calculator',
  description: 'Calculate joint debt responsibilities.',
  path: '/joint-debt-calculator'
};

const FAQS = [
  {
    question: "How should couples split debt payments fairly?",
    answer: "A common method is proportional splitting based on income. If one partner earns 60% of the household income, they contribute 60% of the total monthly debt payment. This calculator uses this proportional model to ensure both partners contribute a fair share according to their means."
  },
  {
    question: "What is the difference between debt snowball and debt avalanche?",
    answer: "The Debt Snowball strategy focuses on paying off the smallest balance first, giving you quick psychological wins. The Debt Avalanche strategy targets the debt with the highest interest rate (APR) first, which mathematically saves you the most money in interest over time."
  },
  {
    question: "Does the calculator combine both partners' debts?",
    answer: "Yes. You enter all household debts into a single list. The calculation engine combines these debts and treats them as a shared responsibility, calculating a single unified payoff timeline and total interest cost."
  },
  {
    question: "How is each partner's contribution calculated?",
    answer: "The tool takes each partner's monthly take-home income and calculates their percentage of the total household income. It then applies this percentage to the total required monthly debt payment to determine a fair monthly contribution for each person."
  },
  {
    question: "Does paying more each month reduce interest?",
    answer: "Yes. Any extra payment entered into the calculator is applied directly to the principal balance of the targeted debt. Paying down the principal faster directly reduces the amount of interest that accrues over the lifetime of the loan."
  }
];

const OFFERS = [
  {
    title: 'Placeholder: Debt Consolidation',
    description: 'When real affiliate partners are configured, users will be directed to loans.',
    label: 'Explore Consolidation Options (Coming Soon)'
  },
  {
    title: 'Placeholder: High-Yield Savings',
    description: 'When real affiliate partners are configured, this will direct users to savings accounts to help build an emergency fund.',
    label: 'View Savings Accounts (Coming Soon)'
  }
];

export default function JointDebtCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-teal-100 selection:text-teal-900">
      <ToolSchema tool={toolData} />
      
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Editorial Header Section */}
        <header className="text-center space-y-8 mt-4">
          
          {/* Trust/Category Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold tracking-widest uppercase shadow-sm">
              <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Free Calculator
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15]">
            Joint Debt Payoff Calculator for Couples
          </h1>
          
          <p className="text-slate-600 max-w-2xl mx-auto text-[15px] sm:text-base leading-relaxed">
            Create a clear, unified plan to become debt-free. Enter your incomes and shared debts to calculate a fair split and find your fastest payoff timeline.
          </p>
        </header>

        {/* Core Application Layer */}
        <section aria-label="Calculator tool" className="scroll-mt-8">
          <JointDebtCalculator />
        </section>

        {/* Resources & Monetization Layer */}
        <div className="space-y-16 pt-12 border-t border-slate-200">
          <section aria-label="Recommendations" className="space-y-6">
            <AffiliateCTA 
              title="Placeholder Recommendations"
              description="These are general recommendations. Real affiliate integrations are pending."
              offers={OFFERS} 
            />
            <AffiliateDisclosure />
          </section>

          <section aria-label="Frequently Asked Questions">
            <FAQSection items={FAQS} />
          </section>
        </div>

      </div>
    </main>
  );
}
