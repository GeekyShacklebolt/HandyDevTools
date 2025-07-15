# Static Build for GitHub Pages

## Quick Setup for GitHub Pages

Your HandyDevTools app is already configured to work as a static site! Here's how to deploy it:

### Method 1: Direct Build and Upload

1. **Build the static files:**
   ```bash
   cd client
   npm run build
   ```
   This creates a `dist` folder with all static files.

2. **Upload to GitHub:**
   - Create a new repository on GitHub
   - Upload the contents of the `dist` folder to the repository
   - Enable GitHub Pages in repository settings, pointing to the root directory

### Method 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: package-lock.json
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: |
        cd client
        npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/public
```

### Files to Include in Your Repository

Copy these essential files to your GitHub repository:

```
/
├── client/
│   ├── src/
│   ├── index.html
│   └── package.json (client-specific if separated)
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── components.json
└── .github/workflows/deploy.yml
```

### Current Features (All Client-Side)

✅ **40+ Developer Tools** - All working client-side
✅ **No Backend Required** - Pure static site
✅ **Modern React UI** - With dark/light theme
✅ **Mobile Responsive** - Works on all devices
✅ **Fast Performance** - No server dependencies
✅ **JSONPath Search** - Real-time JSON querying
✅ **All Tools Working** - Base64, JWT, JSON, Regex, etc.

### Deployment Notes

- The app uses client-side routing with Wouter
- All tools process data locally in the browser
- No server or database required
- Works perfectly on GitHub Pages, Netlify, Vercel, etc.
- Small bundle size and fast loading

### Live Demo URL
After deployment, your tools will be available at:
`https://yourusername.github.io/repository-name/`

The current build is already optimized for static hosting!