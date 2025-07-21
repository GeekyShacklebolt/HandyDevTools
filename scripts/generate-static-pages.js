import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your tools configuration
const { toolCategories } = await import('./tools-data.js');

// Read the base HTML template
const baseHtmlPath = path.join(__dirname, '../client/index.html');
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

// Create the dist directory if it doesn't exist
const distPath = path.join(__dirname, '../dist/public');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Copy the main index.html
fs.writeFileSync(path.join(distPath, 'index.html'), baseHtml);

// Generate tool pages with clean URLs (/tool/tool-id/index.html)
toolCategories.forEach(category => {
  category.tools.forEach(tool => {
    const toolHtml = baseHtml
      .replace(
        '<title>HandyDevTools - 30+ Essential Developer Tools | Free Online Tools</title>',
        `<title>${tool.name} - HandyDevTools | Free Online Developer Tools</title>`
      )
      .replace(
        /<meta name="description"[^>]*>/,
        `<meta name="description" content="${tool.description} - Free online developer tool. ${tool.description}" />`
      )
      .replace(
        /<meta property="og:title"[^>]*>/,
        `<meta property="og:title" content="${tool.name} - HandyDevTools" />`
      )
      .replace(
        /<meta property="og:description"[^>]*>/,
        `<meta property="og:description" content="${tool.description} - Free online developer tool." />`
      )
      .replace(
        /<meta property="og:url"[^>]*>/,
        `<meta property="og:url" content="https://www.shivasaxena.com/handy-dev-tools/tool/${tool.id}/" />`
      )
      .replace(
        /<meta property="twitter:title"[^>]*>/,
        `<meta property="twitter:title" content="${tool.name} - HandyDevTools" />`
      )
      .replace(
        /<meta property="twitter:description"[^>]*>/,
        `<meta property="twitter:description" content="${tool.description} - Free online developer tool." />`
      )
      .replace(
        /<meta property="twitter:url"[^>]*>/,
        `<meta property="twitter:url" content="https://www.shivasaxena.com/handy-dev-tools/tool/${tool.id}/" />`
      )
      .replace(
        /<link rel="canonical"[^>]*>/,
        `<link rel="canonical" href="https://www.shivasaxena.com/handy-dev-tools/tool/${tool.id}/" />`
      );

    // Create the tool directory for clean URLs
    const toolDir = path.join(distPath, 'tool', tool.id);
    if (!fs.existsSync(toolDir)) {
      fs.mkdirSync(toolDir, { recursive: true });
    }

    // Write the tool HTML file as index.html in the tool directory
    fs.writeFileSync(path.join(toolDir, 'index.html'), toolHtml);

    console.log(`Generated: /tool/${tool.id}/index.html`);
  });
});

console.log('Static pages generated successfully!');
