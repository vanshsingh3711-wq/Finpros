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
    description: 'When real affiliate partners are configured, users will be directed to loans that simplify payments and reduce total interest costs.',
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
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToolSchema tool={toolData} />
      
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Joint Debt Payoff Calculator for Couples – Split Debt Fairly
          </h1>
          <div className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed space-y-4 text-left bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
            <p>
              Navigating debt together can be challenging. This tool helps couples create a clear, unified plan to become debt-free. By entering your household incomes and shared debts, the calculator determines a fair, proportional split so each partner contributes according to their financial means.
            </p>
            <p>
              You can explore two popular payoff strategies: the <strong>Snowball method</strong> (paying off the smallest balance first for quick wins) or the <strong>Avalanche method</strong> (targeting the highest interest rate first to save money). 
            </p>
            <p className="text-sm text-slate-500 italic pt-2 border-t border-slate-100">
              Note: This tool combines the debts you enter to generate an estimated payoff timeline. Results are estimates based solely on the inputs provided and assume fixed minimum payments and interest rates. This tool is for educational purposes and does not constitute personalized financial or legal advice.
            </p>
          </div>
        </header>

        <section aria-label="Calculator tool">
          <JointDebtCalculator />
        </section>

        <section aria-label="Recommendations" className="pt-12 border-t border-slate-200 space-y-4">
          <AffiliateCTA 
            title="Placeholder Recommendations"
            description="These are general recommendations. Real affiliate integrations are pending."
            offers={OFFERS} 
          />
          <AffiliateDisclosure />
        </section>

        <section aria-label="Frequently Asked Questions" className="pt-8">
          <FAQSection items={FAQS} />
        </section>
      </div>
    </main>
  );
}
