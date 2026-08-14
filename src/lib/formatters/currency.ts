/**
 * Format a number as a USD currency string.
 * This formatter enforces the presentation layer policy for the application.
 * Note: The calculation engine is strictly currency-agnostic. All formatting
 * must remain at the UI/presentation layer.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
