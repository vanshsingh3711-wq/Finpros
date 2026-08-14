# FinPros

A scalable personal-finance platform for simple, trustworthy financial calculators.
Live: [https://finpros.online](https://finpros.online/)

## Overview

FinPros is a consumer personal-finance platform built around focused calculators that help users understand everyday financial decisions.

The first tool is the Joint Debt Payoff Calculator, designed for couples who want to understand:
- how long their combined debt may take to pay off
- how much interest they may pay
- the difference between snowball and avalanche strategies
- how monthly debt contributions can be split proportionally based on income

FinPros is designed as a multi-tool platform from the beginning. New finance calculators can be added without rewriting the shared site architecture.

## ✨ Current Tool

### Joint Debt Payoff Calculator

Users can enter:
- Partner A monthly income
- Partner B monthly income
- Multiple debts
  - Current balance
  - APR
  - Minimum monthly payment
  - Extra monthly payment
- Payoff strategies:
  - Snowball — smallest balance first
  - Avalanche — highest APR first

The calculator provides:
- Estimated months to debt-free
- Estimated debt-free date
- Total interest paid
- Total amount paid
- Partner contribution proportions
- Initial monthly contribution
- Lifetime contribution totals
- Month-by-month payoff timeline
- Remaining-debt visualization

*Results are estimates based on the information entered and are not financial advice.*

## 🏗️ Architecture

FinPros separates UI, state, validation, and financial calculations.

User Input ↓ Draft State ↓ Validation / Parsing ↓ Pure Financial Engine ↓ Structured Result ↓ UI Presentation

The financial engine contains no React UI logic and can be tested independently.

### Project Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── joint-debt-calculator/
│   │   └── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/
│   ├── ui/
│   ├── shared/
│   └── calculators/
│       └── joint-debt/
└── lib/
    ├── calculations/
    ├── constants/
    └── formatters/
```

## 🧩 Scalable Tool Registry

All public finance tools are defined through:
`src/lib/constants/tools.ts`

The homepage and sitemap consume this registry.

Adding a future calculator should require:
1. Add the tool to `TOOLS_REGISTRY`
2. Build its isolated calculation/UI modules
3. Add its route

Shared infrastructure does not need to be rewritten.

## 🧮 Financial Engine

The Joint Debt calculation engine lives at:
`src/lib/calculations/jointDebtCalculator.ts`

It handles:
- monthly interest
- minimum payments
- extra payments
- rollover capacity
- snowball targeting
- avalanche targeting
- debt-free scheduling
- date progression
- partner contribution calculations
- timeline accounting
- input validation
- non-amortizing debt detection
- safety limits

The React UI never reimplements these calculations.

## ✅ Testing

FinPros uses Vitest for financial and domain testing.

The Joint Debt calculator currently has 43 passing tests/invariants covering:
- payoff calculations
- multiple debts
- snowball
- avalanche
- rollover
- partner contribution splits
- zero APR
- zero minimum payments
- invalid inputs
- non-amortizing scenarios
- date transitions
- deterministic results
- rounding tolerance
- timeline accounting
- financial invariants

Run tests:
```bash
npx vitest run
```

## 🛠️ Tech Stack

- Next.js — App Router
- React
- TypeScript
- Tailwind CSS
- Vitest
- Vercel

The current calculator architecture uses:
- client-side calculations
- no database
- no calculation backend
- no persistent financial-input storage
- no required production environment variables

## 🎨 Design Direction

FinPros uses a calm, premium consumer-finance visual system.

### Core palette

| Role | Color |
|---|---|
| Deep Navy | `#0F172A` |
| Warm Off-White | `#F8FAFC` |
| White | `#FFFFFF` |
| FinPros Teal | `#0F766E` |
| Soft Teal | `#CCFBF1` |
| Slate | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#15803D` |
| Error | `#B91C1C` |

The visual goal is:
*calm · trustworthy · modern · premium · accessible*

## 🔍 SEO

FinPros includes:
- canonical metadata
- metadataBase
- robots.txt
- sitemap.xml
- SoftwareApplication JSON-LD
- FAQPage JSON-LD
- registry-driven sitemap generation

Production domain:
`https://finpros.online`

## 🔒 Data & Privacy

Calculations currently happen in the browser.

The application does not intentionally persist financial inputs to:
- localStorage
- sessionStorage
- IndexedDB
- cookies
- a database

The project avoids making absolute privacy claims and aims to describe its data handling accurately.

## 💰 Monetization

FinPros includes shared infrastructure for future affiliate monetization.
Affiliate content is intentionally secondary to the core calculator experience.

*Current offers are placeholders and should not be presented as real endorsements until actual partnerships and destinations are configured.*

## 🚀 Development

Install dependencies:
```bash
npm install
```

Run locally:
```bash
npm run dev
```

Lint:
```bash
npm run lint
```

Test:
```bash
npx vitest run
```

Production build:
```bash
npm run build
```

## ☁️ Deployment

FinPros is designed for zero-configuration Vercel deployment.

There is currently:
- no custom server
- no runtime filesystem dependency
- no required environment variables
- no vercel.json requirement

## 📌 Current Status

### Completed
- ✅ Scalable Next.js architecture
- ✅ TypeScript migration
- ✅ Shared UI foundation
- ✅ Joint Debt calculation engine
- ✅ 43 financial tests/invariants
- ✅ Calculator state boundary
- ✅ Responsive calculator components
- ✅ Results visualization
- ✅ SEO infrastructure
- ✅ Sitemap + robots
- ✅ Registry-driven homepage
- ✅ Vercel deployment readiness
- ✅ Static accessibility audit
- ✅ Privacy/data-storage audit
- ✅ Production build and lint

### Outstanding
- ⏳ Real browser/device QA
- ⏳ Final visual QA on mobile and desktop
- ⏳ Production smoke testing after deployment

*Browser/device QA has not yet been completed in the current development environment.*

## 🗺️ Future Tools

FinPros is designed to grow into a larger finance-tool platform.

Potential future tools:
- Mortgage Calculator
- Loan Payment Calculator
- Compound Interest Calculator
- Budget Calculator
- Retirement Calculator
- Investment Calculator
- Debt-to-Income Calculator

Each calculator should have its own isolated calculation engine and UI while reusing FinPros' shared infrastructure.

## 📄 License

Add the project's chosen license before making the repository public.
