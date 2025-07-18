import { useEffect } from 'react';
import { getToolById } from '@/lib/tools-config';

interface SEOHeadProps {
  toolId?: string;
}

export function SEOHead({ toolId }: SEOHeadProps) {
  useEffect(() => {
    if (!toolId) return;

    const tool = getToolById(toolId);
    if (!tool) return;

    // Update document title
    document.title = `${tool.name} - Free Online Tool | HandyDevTools`;

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', `${tool.description}. Free online ${tool.name.toLowerCase()} tool. Fast, secure, and client-side processing.`);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${tool.name} - Free Online Tool | HandyDevTools`);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', `${tool.description}. Free online ${tool.name.toLowerCase()} tool.`);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://www.shivasaxena.com/handy-dev-tools/#/tool/${toolId}`);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', `${tool.name} - Free Online Tool | HandyDevTools`);
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', `${tool.description}. Free online ${tool.name.toLowerCase()} tool.`);
    }

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', `https://www.shivasaxena.com/handy-dev-tools/#/tool/${toolId}`);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://www.shivasaxena.com/handy-dev-tools/#/tool/${toolId}`);
    }

    // Add structured data for the specific tool
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "url": `https://www.shivasaxena.com/handy-dev-tools/#/tool/${toolId}`,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "HandyDevTools"
      },
      "isPartOf": {
        "@type": "WebApplication",
        "name": "HandyDevTools",
        "url": "https://www.shivasaxena.com/handy-dev-tools/"
      }
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [toolId]);

  return null;
}
