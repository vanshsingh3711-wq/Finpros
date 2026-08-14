export interface FinanceToolRegistryEntry {
  /** Unique identifier for the tool */
  id: string;
  /** Short name for navigation and UI, e.g. "Joint Debt Calculator" */
  name: string;
  /** Full SEO title for the page, e.g. "Joint Debt Payoff Calculator for Couples..." */
  title?: string;
  /** SEO meta description and ToolSchema description */
  description: string;
  /** Canonical route path */
  path: string;
  /** Optional icon identifier for the homepage grid */
  icon?: string;
}

export const TOOLS_REGISTRY: FinanceToolRegistryEntry[] = [
  {
    id: 'joint-debt',
    name: 'Joint Debt Payoff Calculator',
    title: 'Joint Debt Payoff Calculator for Couples – Split Debt Fairly',
    description: 'Calculate how to split debt fairly based on your incomes. Compare snowball and avalanche payoff strategies and see your estimated debt-free timeline.',
    path: '/joint-debt-calculator',
  }
];

export function getToolById(id: string): FinanceToolRegistryEntry | undefined {
  return TOOLS_REGISTRY.find(tool => tool.id === id);
}
