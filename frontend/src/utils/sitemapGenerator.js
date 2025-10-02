// SentraTech Dynamic Sitemap Generator
// Generates XML sitemap for optimal search engine crawling

import { SITE_CONFIG } from '../config/seoConfig';

/**
 * Generate sitemap.xml content
 */
export const generateSitemap = () => {
  const baseUrl = SITE_CONFIG.siteUrl;
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Define all pages with their priorities and update frequencies
  const pages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/features',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/pricing',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/case-studies',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/security',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/roi-calculator',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/demo-request',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/privacy-policy',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      url: '/terms-of-service',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    }
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = () => {
  const baseUrl = SITE_CONFIG.siteUrl;
  
  return `# SentraTech Robots.txt
# Allow all crawlers to access marketing pages

User-agent: *
Allow: /
Allow: /features
Allow: /pricing
Allow: /case-studies
Allow: /security
Allow: /roi-calculator
Allow: /demo-request

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Disallow tracking and analytics
Disallow: /analytics/
Disallow: /tracking/

# Special rules for specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay (optional - be respectful)
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Host (preferred domain)
Host: ${baseUrl.replace('https://', '').replace('http://', '')}`;
};

/**
 * Save sitemap and robots.txt to public directory
 */
export const saveSEOFiles = async () => {
  try {
    const sitemap = generateSitemap();
    const robotsTxt = generateRobotsTxt();
    
    // In a real application, these would be saved to the public directory
    // For now, we'll log them and they can be manually saved
    console.log('Generated Sitemap:', sitemap);
    console.log('Generated Robots.txt:', robotsTxt);
    
    return {
      sitemap,
      robotsTxt,
      success: true
    };
  } catch (error) {
    console.error('Error generating SEO files:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generateSitemap,
  generateRobotsTxt,
  saveSEOFiles
};