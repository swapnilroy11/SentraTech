// SentraTech SEO Configuration Management System
// Centralized SEO settings for optimal search engine optimization

const SITE_CONFIG = {
  siteName: "SentraTech",
  siteUrl: "https://sentratech.com",
  companyName: "SentraTech Ltd.",
  defaultLanguage: "en",
  defaultCountry: "US",
  
  // Social Media Profiles
  socialProfiles: {
    linkedin: "https://www.linkedin.com/company/sentratechltd/",
    twitter: "https://twitter.com/sentratech",
    facebook: "https://facebook.com/sentratech"
  },
  
  // Brand Assets
  assets: {
    logo: "/logo512.png",
    ogImage: "/og-sentratech.jpg",
    twitterCard: "/twitter-card-sentratech.jpg",
    favicon: "/favicon.ico"
  },
  
  // Contact Information
  contact: {
    email: "contact@sentratech.com",
    phone: "+1-800-SENTRA-1",
    address: {
      streetAddress: "123 Innovation Drive",
      city: "San Francisco",
      region: "CA",
      postalCode: "94105",
      country: "US"
    }
  }
};

// Primary Keywords by Category
const KEYWORDS = {
  primary: [
    "AI customer support",
    "automated customer service",
    "AI chatbot platform",
    "BPO automation",
    "customer support AI"
  ],
  
  secondary: [
    "business process outsourcing",
    "customer experience automation",
    "AI-powered help desk",
    "multi-channel support platform",
    "customer service software"
  ],
  
  longtail: [
    "AI customer support platform for enterprise",
    "automated customer service with 70% efficiency",
    "real-time customer support analytics",
    "omnichannel customer service automation",
    "AI chatbot with sentiment analysis"
  ],
  
  industry: [
    "enterprise customer support",
    "SaaS customer service",
    "e-commerce support automation",
    "retail customer experience",
    "fintech customer support"
  ]
};

// Page-Specific SEO Configurations
export const SEO_PAGES = {
  home: {
    title: "AI Customer Support Platform | 70% Automation | SentraTech",
    description: "Transform customer service with SentraTech's AI platform. 70% automation rate, sub-50ms response times, and intelligent analytics. Start your free trial today.",
    keywords: [
      ...KEYWORDS.primary,
      "AI customer support platform",
      "automated customer service software",
      "customer experience automation"
    ],
    canonical: "/",
    
    openGraph: {
      title: "SentraTech - AI-Powered Customer Support Platform",
      description: "Revolutionize your customer service with 70% automation, sub-50ms response times, and intelligent business analytics.",
      image: `${SITE_CONFIG.siteUrl}${SITE_CONFIG.assets.ogImage}`,
      type: "website"
    },
    
    schema: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SITE_CONFIG.companyName,
      "url": SITE_CONFIG.siteUrl,
      "logo": `${SITE_CONFIG.siteUrl}${SITE_CONFIG.assets.logo}`,
      "description": "AI-powered customer support platform with 70% automation rate and enterprise-grade analytics",
      "foundingDate": "2023",
      "sameAs": Object.values(SITE_CONFIG.socialProfiles),
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": SITE_CONFIG.contact.phone,
        "contactType": "Customer Service",
        "email": SITE_CONFIG.contact.email
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": SITE_CONFIG.contact.address.streetAddress,
        "addressLocality": SITE_CONFIG.contact.address.city,
        "addressRegion": SITE_CONFIG.contact.address.region,
        "postalCode": SITE_CONFIG.contact.address.postalCode,
        "addressCountry": SITE_CONFIG.contact.address.country
      }
    }
  },

  features: {
    title: "AI Customer Support Features | Omnichannel Platform | SentraTech",
    description: "Discover SentraTech's powerful features: omnichannel support, AI sentiment analysis, real-time analytics, and seamless integrations. See how we achieve 70% automation.",
    keywords: [
      ...KEYWORDS.secondary,
      "omnichannel customer support",
      "AI sentiment analysis",
      "real-time customer analytics",
      "customer support features"
    ],
    canonical: "/features",
    
    openGraph: {
      title: "Advanced AI Customer Support Features - SentraTech",
      description: "Explore omnichannel support, sentiment analysis, real-time analytics, and seamless integrations that power 70% automation rates.",
      image: `${SITE_CONFIG.siteUrl}/features-og-image.jpg`,
      type: "website"
    },
    
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SentraTech Customer Support Platform",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Comprehensive AI-powered customer support platform with omnichannel capabilities",
      "features": [
        "Omnichannel Support",
        "AI Sentiment Analysis",
        "Real-time Analytics",
        "Multi-language Support",
        "API Integrations",
        "Automated Routing"
      ],
      "offers": {
        "@type": "Offer",
        "category": "SoftwareAsAService"
      }
    }
  },

  pricing: {
    title: "AI Customer Support Pricing Plans | Start $399/month | SentraTech",
    description: "Transparent pricing for AI customer support. Starter $399/mo, Growth $1,299/mo, Enterprise custom. 30-day free trial. No setup fees. Cancel anytime.",
    keywords: [
      "AI customer support pricing",
      "customer service software cost",
      "automated support pricing",
      "BPO software pricing",
      "customer support subscription"
    ],
    canonical: "/pricing",
    
    openGraph: {
      title: "SentraTech Pricing - AI Customer Support Plans",
      description: "Flexible pricing plans starting at $399/month. 30-day free trial with all features included.",
      image: `${SITE_CONFIG.siteUrl}/pricing-og-image.jpg`,
      type: "website"
    },
    
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "SentraTech Customer Support Platform",
      "description": "AI-powered customer support platform with enterprise-grade features",
      "brand": {
        "@type": "Brand",
        "name": SITE_CONFIG.companyName
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Starter Plan",
          "price": "399",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${SITE_CONFIG.siteUrl}/pricing`,
          "description": "Perfect for small to medium businesses"
        },
        {
          "@type": "Offer", 
          "name": "Growth Plan",
          "price": "1299",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${SITE_CONFIG.siteUrl}/pricing`,
          "description": "Advanced features for growing businesses"
        },
        {
          "@type": "Offer",
          "name": "Enterprise Plan",
          "price": "0",
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${SITE_CONFIG.siteUrl}/pricing`,
          "description": "Custom enterprise solutions with dedicated support"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "247",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  },

  security: {
    title: "Enterprise Security & Compliance | SOC2, GDPR | SentraTech",
    description: "Enterprise-grade security for customer support. SOC2 Type II, GDPR compliance, end-to-end encryption, and 99.99% uptime SLA. Trust & safety first.",
    keywords: [
      "enterprise customer support security",
      "SOC2 compliance customer service",
      "GDPR customer support platform",
      "secure customer data platform",
      "encrypted customer communications"
    ],
    canonical: "/security",
    
    openGraph: {
      title: "Enterprise Security & Compliance - SentraTech",
      description: "SOC2 Type II certified, GDPR compliant, with enterprise-grade security for your customer data.",
      image: `${SITE_CONFIG.siteUrl}/security-og-image.jpg`,
      type: "website"
    }
  },

  caseStudies: {
    title: "Customer Success Stories | AI Support Case Studies | SentraTech",
    description: "Real results from SentraTech customers: 60% cost reduction, 4.2min faster resolution, 96% customer satisfaction. Read detailed case studies.",
    keywords: [
      "AI customer support case studies",
      "customer service success stories",
      "automated support results",
      "customer experience improvements",
      "BPO transformation cases"
    ],
    canonical: "/case-studies",
    
    openGraph: {
      title: "Customer Success Stories - SentraTech Case Studies", 
      description: "See how companies achieved 60% cost reduction and 96% customer satisfaction with SentraTech's AI platform.",
      image: `${SITE_CONFIG.siteUrl}/case-studies-og-image.jpg`,
      type: "website"
    }
  },

  roiCalculator: {
    title: "ROI Calculator | Calculate AI Support Savings | SentraTech",
    description: "Calculate potential savings with AI customer support automation. Input your current costs and see projected ROI, cost reduction, and efficiency gains.",
    keywords: [
      "AI customer support ROI calculator",
      "customer service cost savings",
      "support automation ROI",
      "customer support efficiency calculator",
      "BPO cost reduction tool"
    ],
    canonical: "/roi-calculator",
    
    openGraph: {
      title: "ROI Calculator - Calculate AI Support Savings",
      description: "Discover how much you can save with AI-powered customer support automation.",
      image: `${SITE_CONFIG.siteUrl}/roi-calculator-og-image.jpg`,
      type: "website"
    },
    
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "SentraTech ROI Calculator",
      "description": "Calculate potential return on investment for AI customer support automation",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "permissions": "browser"
    }
  },

  demoRequest: {
    title: "Request Demo | See AI Customer Support in Action | SentraTech",
    description: "Book a personalized demo of SentraTech's AI customer support platform. See 70% automation in action. Free 30-minute consultation with our experts.",
    keywords: [
      "AI customer support demo",
      "customer service platform demo",
      "automated support demonstration",
      "SentraTech product demo",
      "customer support consultation"
    ],
    canonical: "/demo-request",
    
    openGraph: {
      title: "Request Demo - SentraTech AI Customer Support",
      description: "See our AI-powered platform in action. Book a free demo and discover 70% automation capabilities.",
      image: `${SITE_CONFIG.siteUrl}/demo-og-image.jpg`,
      type: "website"
    }
  },

  privacyPolicy: {
    title: "Privacy Policy | Data Protection | SentraTech",
    description: "SentraTech's privacy policy outlines how we collect, use, and protect your personal information. GDPR compliant data handling practices.",
    keywords: [
      "SentraTech privacy policy",
      "data protection policy",
      "GDPR compliance",
      "customer data privacy",
      "information security policy"
    ],
    canonical: "/privacy-policy",
    robots: "noindex, follow"
  },

  termsOfService: {
    title: "Terms of Service | Legal Agreement | SentraTech", 
    description: "SentraTech terms of service and legal agreement for using our AI customer support platform. Service terms, user responsibilities, and policies.",
    keywords: [
      "SentraTech terms of service",
      "service agreement",
      "platform terms",
      "user agreement",
      "legal terms"
    ],
    canonical: "/terms-of-service",
    robots: "noindex, follow"
  }
};

// Breadcrumb configurations
export const BREADCRUMB_CONFIG = {
  "/": [
    { name: "Home", url: "/" }
  ],
  "/features": [
    { name: "Home", url: "/" },
    { name: "Features", url: "/features" }
  ],
  "/pricing": [
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" }
  ],
  "/security": [
    { name: "Home", url: "/" },
    { name: "Security", url: "/security" }
  ],
  "/case-studies": [
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" }
  ],
  "/roi-calculator": [
    { name: "Home", url: "/" },
    { name: "ROI Calculator", url: "/roi-calculator" }
  ],
  "/demo-request": [
    { name: "Home", url: "/" },
    { name: "Request Demo", url: "/demo-request" }
  ]
};

// Export configurations
export { SITE_CONFIG, KEYWORDS };
export default SEO_PAGES;