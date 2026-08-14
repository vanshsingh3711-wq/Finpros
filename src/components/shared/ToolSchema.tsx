import * as React from 'react';
import { FinanceToolRegistryEntry } from '../../lib/constants/tools';

export interface ToolSchemaProps {
  tool: FinanceToolRegistryEntry;
  /** Optional base URL for absolute paths (default: https://finpros.online) */
  baseUrl?: string;
  /** Schema.org application category (default: FinanceApplication) */
  applicationCategory?: string;
  /** Schema.org operating system requirement (default: Any) */
  operatingSystem?: string;
}

export function ToolSchema({
  tool,
  baseUrl = 'https://finpros.online',
  applicationCategory = 'FinanceApplication',
  operatingSystem = 'Any',
}: ToolSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${baseUrl.replace(/\/$/, '')}${tool.path}`,
    applicationCategory,
    operatingSystem,
  };

  // Safely escape characters (e.g. `<`) that could prematurely close the script tag
  // when using dangerouslySetInnerHTML, even though the metadata is application-controlled.
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd }}
    />
  );
}
