import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your tools configuration
const { toolCategories } = await import('./tools-data.js');

const baseUrl = 'https://www.shivasaxena.com/handy-dev-tools';

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

// Add tool pages with clean URLs
toolCategories.forEach(category => {
  category.tools.forEach(tool => {
    sitemap += `
  <url>
    <loc>${baseUrl}/tool/${tool.id}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });
});

sitemap += `
</urlset>`;

// Write sitemap to public directory
const publicPath = path.join(__dirname, '../client/public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!');
