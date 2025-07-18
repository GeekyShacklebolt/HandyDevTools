import { toolCategories } from './tools-config';
import fs from 'fs';
import path from 'path';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export function generateSitemap(): string {
  const baseUrl = 'https://www.shivasaxena.com/handy-dev-tools';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const urls: SitemapUrl[] = [
    // Homepage
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    }
  ];

  // Add individual tool pages
  toolCategories.forEach(category => {
    category.tools.forEach(tool => {
      urls.push({
        loc: `${baseUrl}/#/tool/${tool.id}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: getToolPriority(tool.id)
      });
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

function getToolPriority(toolId: string): string {
  // Higher priority for popular tools
  const highPriorityTools = [
    'json-format',
    'jwt-debugger',
    'sql-formatter',
    'beautify-minify',
    'regex-tester',
    'unix-time',
    'base64-string'
  ];

  return highPriorityTools.includes(toolId) ? '0.9' : '0.8';
}

// Function to get actual file modification dates
export function getFileLastModified(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Function to update sitemap with actual modification dates
export function updateSitemapWithRealDates(): void {
  const sitemapPath = path.join(process.cwd(), 'client/public/sitemap.xml');
  const sitemapContent = generateSitemap();

  try {
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log('✅ Sitemap updated with current dates');
  } catch (error) {
    console.error('❌ Failed to update sitemap:', error);
  }
}
