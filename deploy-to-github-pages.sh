#!/bin/bash

# Build script for GitHub Pages deployment
echo "Building HandyDevTools for GitHub Pages..."

# Navigate to client directory and build
cd client
echo "Building static files..."
npx vite build

# Create deployment files
echo "Creating deployment structure..."
cd ..
mkdir -p github-pages-deploy
cp -r dist/public/* github-pages-deploy/

# Create GitHub Pages configuration
echo "Creating GitHub Pages files..."

# Create .nojekyll file to prevent Jekyll processing
touch github-pages-deploy/.nojekyll

# Create README for the deployment
cat > github-pages-deploy/README.md << EOL
# HandyDevTools

A comprehensive collection of 40+ developer tools for encoding/decoding, formatting, conversion, and text manipulation.

## Features

- **40+ Developer Tools** - All working client-side
- **No Backend Required** - Pure static site
- **Modern React UI** - With dark/light theme toggle
- **Mobile Responsive** - Works on all devices
- **JSONPath Search** - Real-time JSON querying
- **Fast Performance** - No server dependencies

## Tools Include

- JSON Format/Validate with JSONPath search
- Base64 Encoder/Decoder
- JWT Debugger
- URL Encoder/Decoder
- UUID Generator
- Regex Tester
- Hash Generator
- Color Converter
- Unix Time Converter
- And many more...

## Deployment

This is a static site deployed on GitHub Pages.

EOL

echo "✅ Build complete!"
echo ""
echo "📁 Files ready for GitHub Pages deployment in: github-pages-deploy/"
echo ""
echo "🚀 To deploy:"
echo "1. Create a new GitHub repository"
echo "2. Upload the contents of 'github-pages-deploy/' folder to your repository"
echo "3. Enable GitHub Pages in repository settings"
echo "4. Your tools will be available at: https://yourusername.github.io/repository-name/"
echo ""
echo "🔗 Alternative: Use GitHub Actions for automatic deployment (see static-build.md)"