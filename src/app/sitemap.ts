import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '../lib/constants/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://finpros.online';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    }
  ];

  TOOLS_REGISTRY.forEach(tool => {
    // Ensure path doesn't result in double slashes, though registry paths typically start with /
    const path = tool.path.startsWith('/') ? tool.path : `/${tool.path}`;
    sitemapEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return sitemapEntries;
}
