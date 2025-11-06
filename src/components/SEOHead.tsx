import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

export const SEOHead = ({ 
  title, 
  description, 
  canonical, 
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  ogType = "website",
  structuredData 
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonical);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);
    
    // Update canonical link
    updateCanonical(canonical);
    
    // Inject structured data
    if (structuredData) {
      injectStructuredData(structuredData);
    }
  }, [title, description, canonical, ogImage, ogType, structuredData]);
  
  return null;
};

const updateMetaTag = (attribute: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonical = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

const injectStructuredData = (data: object) => {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.textContent = JSON.stringify(data);
  } else {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
};
