// SentraTech SEO Manager Component
// Dynamic meta tag management for optimal search engine optimization

import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SEO_PAGES, { SITE_CONFIG, BREADCRUMB_CONFIG } from '../config/seoConfig';

const SEOManager = ({ 
  customTitle, 
  customDescription, 
  customKeywords, 
  customImage,
  customSchema,
  noIndex = false 
}) => {
  const location = useLocation();
  
  // Get page-specific SEO config
  const getPageConfig = () => {
    const path = location.pathname;
    const pageKey = path === '/' ? 'home' : 
                   path === '/features' ? 'features' :
                   path === '/pricing' ? 'pricing' :
                   path === '/security' ? 'security' :
                   path === '/case-studies' ? 'caseStudies' :
                   path === '/roi-calculator' ? 'roiCalculator' :
                   path === '/demo-request' ? 'demoRequest' :
                   path === '/privacy-policy' ? 'privacyPolicy' :
                   path === '/terms-of-service' ? 'termsOfService' :
                   'home'; // fallback
    
    return SEO_PAGES[pageKey] || SEO_PAGES.home;
  };

  const pageConfig = getPageConfig();
  
  // Use custom values or fall back to page config
  const title = customTitle || pageConfig.title;
  const description = customDescription || pageConfig.description;
  const keywords = customKeywords || pageConfig.keywords?.join(', ') || '';
  const canonical = `${SITE_CONFIG.siteUrl}${pageConfig.canonical || location.pathname}`;
  const ogImage = customImage || pageConfig.openGraph?.image || `${SITE_CONFIG.siteUrl}${SITE_CONFIG.assets.ogImage}`;
  
  // Generate breadcrumb structured data
  const generateBreadcrumbSchema = () => {
    const breadcrumbs = BREADCRUMB_CONFIG[location.pathname] || BREADCRUMB_CONFIG['/'];
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${SITE_CONFIG.siteUrl}${item.url}`
      }))
    };
  };

  // Analytics tracking for page views
  useEffect(() => {
    // Track page view for SEO analytics
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: location.pathname,
        content_group1: 'Marketing Pages'
      });
    }
  }, [location.pathname, title]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots and Indexing */}
      <meta name="robots" content={noIndex || pageConfig.robots?.includes('noindex') ? 'noindex, follow' : 'index, follow'} />
      <meta name="googlebot" content={noIndex ? 'noindex, follow' : 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageConfig.openGraph?.type || 'website'} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={pageConfig.openGraph?.title || title} />
      <meta property="og:description" content={pageConfig.openGraph?.description || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_CONFIG.siteName} - ${pageConfig.openGraph?.title || title}`} />
      <meta property="og:site_name" content={SITE_CONFIG.siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={pageConfig.openGraph?.title || title} />
      <meta property="twitter:description" content={pageConfig.openGraph?.description || description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:image:alt" content={`${SITE_CONFIG.siteName} - ${title}`} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={SITE_CONFIG.companyName} />
      <meta name="publisher" content={SITE_CONFIG.companyName} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_CONFIG.companyName}`} />
      
      {/* Language and Location */}
      <meta name="language" content={SITE_CONFIG.defaultLanguage} />
      <meta name="geo.region" content={SITE_CONFIG.defaultCountry} />
      <meta name="geo.placename" content={SITE_CONFIG.contact.address.city} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Preload Critical Resources */}
      <link rel="preload" href="/fonts/rajdhani-v15-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Page-Specific Schema */}
      {(pageConfig.schema || customSchema) && (
        <script type="application/ld+json">
          {JSON.stringify(customSchema || pageConfig.schema)}
        </script>
      )}
      
      {/* Breadcrumb Schema */}
      {BREADCRUMB_CONFIG[location.pathname] && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema())}
        </script>
      )}
      
      {/* Website Schema (Global) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": SITE_CONFIG.siteName,
          "url": SITE_CONFIG.siteUrl,
          "description": "AI-powered customer support platform with 70% automation rate",
          "publisher": {
            "@type": "Organization",
            "name": SITE_CONFIG.companyName,
            "logo": `${SITE_CONFIG.siteUrl}${SITE_CONFIG.assets.logo}`
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOManager;