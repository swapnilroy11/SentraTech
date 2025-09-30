export const translations = {
  en: {
    // Company Slogan
    nav: {
      features: "Beyond",
      pricing: "Better", 
      about: "Boundless",
      contact: "Contact"
    },
    
    // Hero Section
    hero: {
      title: "Customer Support as a Growth Engine, Powered by AI + BI",
      subtitle: "Transform your customer service into a competitive advantage with our sub-50ms AI routing platform. Reduce costs by 40-60% while improving satisfaction.",
      cta: "Request a Demo",
      secondaryCta: "Explore Docs"
    },
    
    // Features Section
    features: {
      title: "Intelligent Automation",
      subtitle: "Built for Scale",
      description: "Experience next-generation customer support that adapts, learns, and grows with your business needs.",
      items: {
        omnichannel: {
          title: "Omnichannel AI",
          description: "Unified customer experience across all touchpoints with context-aware routing"
        },
        automation: {
          title: "70% Automation",
          description: "Intelligent automation that handles routine queries while escalating complex issues"
        },
        analytics: {
          title: "BI Dashboards",
          description: "Real-time insights and predictive analytics for data-driven decision making"
        },
        satisfaction: {
          title: "96% Satisfaction",
          description: "Industry-leading customer satisfaction through personalized support experiences"
        },
        global: {
          title: "Global Scale",
          description: "Enterprise-grade infrastructure supporting millions of interactions worldwide"
        },
        security: {
          title: "Enterprise Security",
          description: "SOC2 compliant with end-to-end encryption and advanced threat protection"
        }
      }
    },
    
    // Customer Journey
    journey: {
      title: "Customer Journey Timeline",
      subtitle: "From first contact to resolution - experience our intelligent workflow in action",
      stages: {
        contact: {
          title: "Inbound Contact",
          subtitle: "Multi-channel customer inquiry received",
          description: "Customer reaches out through preferred channel with automated acknowledgment and intelligent routing based on context, priority, and agent availability.",
          features: ["Instant acknowledgment", "Smart channel routing", "Priority detection"]
        },
        triage: {
          title: "AI Triage",
          subtitle: "Intelligent analysis and categorization",
          description: "Advanced AI analyzes inquiry content, customer history, and sentiment to determine optimal resolution path and resource allocation.",
          features: ["Sentiment analysis", "Intent recognition", "Automated categorization"]
        },
        engagement: {
          title: "Smart Engagement",
          subtitle: "Personalized interaction strategy",
          description: "System deploys appropriate resolution strategy - from automated responses to expert human intervention based on complexity assessment.",
          features: ["Personalized responses", "Expert matching", "Context preservation"]
        },
        augmentation: {
          title: "AI Augmentation",
          subtitle: "Enhanced human capabilities",
          description: "Human agents receive real-time AI assistance with suggested responses, knowledge base access, and predictive insights for optimal outcomes.",
          features: ["Real-time suggestions", "Knowledge integration", "Predictive insights"]
        },
        analytics: {
          title: "Real-time Analytics",
          subtitle: "Continuous optimization insights",
          description: "System captures interaction data, measures satisfaction, and identifies optimization opportunities for continuous improvement.",
          features: ["Performance tracking", "Satisfaction measurement", "Optimization insights"]
        },
        outcome: {
          title: "Optimized Outcome",
          subtitle: "Resolution and continuous learning",
          description: "Successful resolution with follow-up automation and machine learning integration to improve future interactions and processes.",
          features: ["Automated follow-up", "Learning integration", "Process improvement"]
        }
      }
    },
    
    // ROI Calculator
    roi: {
      title: "ROI Calculator",
      subtitle: "See Your Potential Savings",
      description: "Calculate the impact of AI-powered customer support on your bottom line",
      inputs: {
        monthlyVolume: "Monthly Support Volume",
        avgHandlingTime: "Average Handling Time (minutes)",
        avgAgentCost: "Average Agent Cost ($/hour)",
        currentSatisfaction: "Current Customer Satisfaction (%)"
      },
      results: {
        title: "Your ROI Analysis",
        monthlySavings: "Monthly Savings",
        annualSavings: "Annual Savings",
        efficiencyGain: "Efficiency Gain",
        satisfactionIncrease: "Satisfaction Increase",
        paybackPeriod: "Payback Period"
      },
      cta: "Get Detailed Analysis"
    },
    
    // Testimonials
    testimonials: {
      title: "Trusted by Industry Leaders",
      subtitle: "See how leading companies transform their customer support with SentraTech",
      items: [
        {
          text: "SentraTech reduced our response time by 75% while maintaining 98% customer satisfaction. The AI routing is incredibly intelligent.",
          author: "Sarah Chen",
          role: "VP of Customer Success",
          company: "TechFlow Solutions"
        },
        {
          text: "We've seen a 60% reduction in operational costs and our team can focus on high-value interactions. Game-changing platform.",
          author: "Michael Rodriguez", 
          role: "Head of Operations",
          company: "Global Dynamics"
        },
        {
          text: "The analytics insights have revolutionized how we approach customer support. Data-driven decisions at every level.",
          author: "Emily Watson",
          role: "Chief Technology Officer", 
          company: "InnovateCore"
        }
      ]
    },
    
    // Pricing
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that scales with your business needs",
      plans: {
        starter: {
          name: "Starter",
          price: "$99",
          period: "/month",
          description: "Perfect for small teams getting started",
          features: [
            "Up to 1,000 monthly interactions",
            "Basic AI routing",
            "Email & chat support",
            "Standard analytics",
            "5 agent seats included"
          ],
          cta: "Start Free Trial"
        },
        professional: {
          name: "Professional", 
          price: "$299",
          period: "/month",
          description: "Advanced features for growing businesses",
          features: [
            "Up to 10,000 monthly interactions",
            "Advanced AI + sentiment analysis",
            "Omnichannel support",
            "Custom dashboards",
            "15 agent seats included",
            "Priority support"
          ],
          cta: "Start Free Trial",
          popular: "Most Popular"
        },
        enterprise: {
          name: "Enterprise",
          price: "Custom",
          period: "",
          description: "Tailored solutions for large organizations",
          features: [
            "Unlimited interactions", 
            "Full AI suite + custom models",
            "White-label options",
            "Advanced security & compliance",
            "Unlimited agent seats",
            "Dedicated success manager"
          ],
          cta: "Contact Sales"
        }
      }
    },
    
    // Contact/CTA Section
    contact: {
      title: "Ready to Transform Your Customer Support?",
      subtitle: "Join 500+ companies already using SentraTech to deliver exceptional customer experiences",
      form: {
        title: "Request a Demo",
        fields: {
          name: "Full Name",
          email: "Work Email", 
          company: "Company Name",
          role: "Your Role",
          phone: "Phone Number (Optional)",
          employees: "Company Size",
          message: "Tell us about your needs"
        },
        placeholders: {
          name: "Enter your full name",
          email: "your.email@company.com", 
          company: "Your company name",
          role: "e.g., VP Customer Success",
          phone: "+1 (555) 123-4567",
          message: "What challenges are you looking to solve?"
        },
        button: "Request Demo",
        sending: "Sending...",
        success: "Demo request sent successfully!",
        error: "Please fill in all required fields"
      },
      trust: {
        uptime: "99.9% Platform Uptime",
        security: "SOC2 Type II Certified", 
        support: "24/7 Expert Support",
        integration: "50+ Platform Integrations"
      }
    },
    
    // Footer
    footer: {
      tagline: "AI-Powered Customer Support Excellence",
      copyright: "© 2024 SentraTech. All rights reserved.",
      links: {
        product: "Product",
        company: "Company", 
        resources: "Resources",
        legal: "Legal"
      }
    },
    
    // Floating Navigation
    floatingNav: {
      title: "Quick Navigation",
      items: {
        home: "Home",
        features: "Beyond",
        journey: "Customer Journey", 
        roi: "ROI Calculator",
        testimonials: "Testimonials",
        pricing: "Better",
        contact: "Contact"
      },
      footer: "SentraTech Navigation"
    }
  }

  // Bengali language support completely removed
};