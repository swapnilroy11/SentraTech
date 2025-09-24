// Mock data for SentraTech landing page
export const mockData = {
  // Hero Section Data
  hero: {
    headline: "Customer Support as a Growth Engine, Powered by AI + BI",
    subheadline: "Transform your customer service into a competitive advantage with our sub-50ms AI routing platform. Reduce costs by 40-60% while improving satisfaction.",
    ctaText: "Request a Demo",
    secondaryCtaText: "Explore Docs",
    chatGreeting: "Hi, I'm Sentra—how can I help you today?"
  },

  // Features Data - using translation keys
  features: [
    {
      id: 1,
      key: "omnichannel",
      icon: "MessageSquare",
      stats: "5+ channels integrated"
    },
    {
      id: 2,
      key: "automation",
      icon: "Zap",
      stats: "<50ms routing time"
    },
    {
      id: 3,
      key: "analytics",
      icon: "BarChart3",
      stats: "20+ KPI metrics"
    },
    {
      id: 4,
      key: "satisfaction",
      icon: "Heart",
      stats: "99.5% accuracy"
    },
    {
      id: 5,
      key: "global",
      icon: "Globe",
      stats: "15+ languages"
    },
    {
      id: 6,
      key: "security",
      icon: "Shield",
      stats: "100% audit coverage"
    }
  ],

  // Journey Steps
  journeySteps: [
    {
      id: 1,
      title: "Inbound Call/Message",
      description: "Customer initiates contact through any channel",
      icon: "Phone"
    },
    {
      id: 2,
      title: "AI Triage",
      description: "Sub-50ms intelligent routing decision",
      icon: "Brain"
    },
    {
      id: 3,
      title: "Omnichannel Engagement",
      description: "Seamless experience across all touchpoints",
      icon: "Network"
    },
    {
      id: 4,
      title: "Human Augmentation",
      description: "AI-assisted agents for complex scenarios",
      icon: "Users"
    },
    {
      id: 5,
      title: "Analytics & BI",
      description: "Real-time insights and performance tracking",
      icon: "TrendingUp"
    },
    {
      id: 6,
      title: "Outcome & Feedback",
      description: "Continuous improvement through data analysis",
      icon: "Award"
    }
  ],

  // How It Works Steps
  howItWorks: [
    {
      id: 1,
      title: "Engage",
      description: "Multi-channel customer contact capture",
      details: "Seamlessly capture customer interactions across voice, chat, email, SMS, and social media channels with unified experience tracking."
    },
    {
      id: 2,
      title: "Automate", 
      description: "AI-powered intelligent routing",
      details: "Our proprietary sub-50ms decision engine routes interactions to the optimal combination of AI automation and human expertise."
    },
    {
      id: 3,
      title: "Augment",
      description: "Human + AI collaboration",
      details: "AI-assisted agents handle complex scenarios with real-time suggestions, knowledge base integration, and compliance monitoring."
    },
    {
      id: 4,
      title: "Optimize",
      description: "Continuous performance improvement",
      details: "Advanced analytics and BI provide actionable insights for reducing AHT, improving CSAT, and predicting customer churn."
    }
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      company: "TeleGlobal Corp",
      author: "Sarah Chen",
      position: "VP Customer Operations",
      content: "SentraTech reduced our average handle time by 35% while improving customer satisfaction scores. The sub-50ms routing is game-changing.",
      rating: 5,
      logo: "/api/placeholder/120/60",
      stats: "35% AHT reduction"
    },
    {
      id: 2,
      company: "HealthFirst Systems",
      author: "Dr. Michael Rodriguez",
      position: "Chief Digital Officer",
      content: "HIPAA compliance built-in from day one saved us months of implementation. The audit trails are comprehensive and reliable.",
      rating: 5,
      logo: "/api/placeholder/120/60",
      stats: "100% compliance audit"
    },
    {
      id: 3,
      company: "FinanceForward Inc",
      author: "Lisa Thompson",
      position: "Director of Customer Experience",
      content: "The cost savings are remarkable - 60% reduction compared to our previous BPO while delivering superior customer experience.",
      rating: 5,
      logo: "/api/placeholder/120/60",
      stats: "60% cost reduction"
    }
  ],

  // Pricing Tiers
  pricing: [
    {
      id: 1,
      name: "Starter",
      price: 399,
      period: "month",
      description: "Perfect for growing businesses",
      features: [
        "Up to 10,000 interactions/month",
        "Basic AI automation",
        "Core analytics dashboard",
        "Email support",
        "Standard compliance"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      id: 2,
      name: "Growth",
      price: 1299,
      period: "month", 
      description: "Full omnichannel experience",
      features: [
        "Up to 50,000 interactions/month",
        "Full omnichannel integration",
        "Advanced BI dashboards",
        "24/7 priority support",
        "Enhanced compliance suite"
      ],
      cta: "Request Demo",
      popular: true
    },
    {
      id: 3,
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Unlimited scale and customization",
      features: [
        "Unlimited interactions",
        "Custom AI training",
        "Dedicated success manager",
        "White-label options", 
        "Enterprise-grade SLAs"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ],

  // KPI Stats
  stats: [
    { id: 1, value: "50", suffix: "ms", label: "Average Response Time" },
    { id: 2, value: "70", suffix: "%", label: "Automation Rate" }, 
    { id: 3, value: "99.9", suffix: "%", label: "Platform Uptime" },
    { id: 4, value: "60", suffix: "%", label: "Cost Reduction" }
  ],

  // Chat Messages
  chatMessages: [
    { id: 1, text: "Hi there! How can I help you today?", sender: "bot", timestamp: new Date() },
    { id: 2, text: "I'm interested in learning more about your platform", sender: "user", timestamp: new Date() },
    { id: 3, text: "Great! I'd be happy to show you around. What's your primary use case?", sender: "bot", timestamp: new Date() }
  ]
};

// API endpoints for mock data
export const mockApi = {
  // Simulate API calls with delays
  getStats: () => new Promise(resolve => setTimeout(() => resolve(mockData.stats), 500)),
  getChatMessages: () => new Promise(resolve => setTimeout(() => resolve(mockData.chatMessages), 300)),
  sendChatMessage: (message) => new Promise(resolve => 
    setTimeout(() => resolve({
      id: Date.now(),
      text: `Thanks for your message: "${message}". A specialist will contact you soon!`,
      sender: "bot",
      timestamp: new Date()
    }), 800)
  ),
  submitContact: (formData) => new Promise(resolve => 
    setTimeout(() => resolve({ success: true, id: Date.now() }), 1000)
  )
};