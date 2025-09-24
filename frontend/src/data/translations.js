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
  },
  
  bn: {
    // Company Slogan (কোম্পানির স্লোগান)
    nav: {
      features: "অতিক্রম", // Beyond
      pricing: "উৎকৃষ্ট", // Better  
      about: "সীমাহীন", // Boundless
      contact: "যোগাযোগ"
    },
    
    // Hero Section (হিরো সেকশন)
    hero: {
      title: "AI + BI দ্বারা চালিত গ্রাহক সহায়তা একটি বৃদ্ধির ইঞ্জিন হিসেবে",
      subtitle: "আমাদের সাব-৫০এমএস AI রাউটিং প্ল্যাটফর্মের সাথে আপনার গ্রাহক সেবাকে প্রতিযোগিতামূলক সুবিধায় রূপান্তরিত করুন। সন্তুষ্টি বৃদ্ধি করার সাথে সাথে খরচ ৪০-৬০% কমান।",
      cta: "ডেমো অনুরোধ করুন",
      secondaryCta: "ডকুমেন্টেশন দেখুন"
    },
    
    // Features Section (বৈশিষ্ট্য বিভাগ)
    features: {
      title: "বুদ্ধিমান অটোমেশন",
      subtitle: "স্কেলের জন্য নির্মিত",
      description: "পরবর্তী প্রজন্মের গ্রাহক সহায়তা অনুভব করুন যা আপনার ব্যবসার প্রয়োজন অনুযায়ী খাপ খায়, শেখে এবং বৃদ্ধি পায়।",
      items: {
        omnichannel: {
          title: "সর্বমুখী AI",
          description: "প্রসঙ্গ-সচেতন রাউটিং সহ সকল স্পর্শবিন্দুতে একীভূত গ্রাহক অভিজ্ঞতা"
        },
        automation: {
          title: "৭০% অটোমেশন",
          description: "বুদ্ধিমান অটোমেশন যা নিয়মিত প্রশ্ন পরিচালনা করে জটিল বিষয়গুলি উর্ধ্বতন করে"
        },
        analytics: {
          title: "BI ড্যাশবোর্ড",
          description: "ডেটা-চালিত সিদ্ধান্ত গ্রহণের জন্য রিয়েল-টাইম অন্তর্দৃষ্টি এবং পূর্বাভাস বিশ্লেষণ"
        },
        satisfaction: {
          title: "৯৬% সন্তুষ্টি",
          description: "ব্যক্তিগতকৃত সহায়তা অভিজ্ঞতার মাধ্যমে শিল্প-নেতৃস্থানীয় গ্রাহক সন্তুষ্টি"
        },
        global: {
          title: "বিশ্বব্যাপী স্কেল",
          description: "বিশ্বব্যাপী লক্ষ লক্ষ ইন্টারঅ্যাকশন সমর্থনকারী এন্টারপ্রাইজ-গ্রেড অবকাঠামো"
        },
        security: {
          title: "এন্টারপ্রাইজ নিরাপত্তা",
          description: "এন্ড-টু-এন্ড এনক্রিপশন এবং উন্নত হুমকি সুরক্ষা সহ SOC2 সম্মত"
        }
      }
    },
    
    // Customer Journey (গ্রাহক যাত্রা)
    journey: {
      title: "গ্রাহক যাত্রার টাইমলাইন",
      subtitle: "প্রথম যোগাযোগ থেকে সমাধান পর্যন্ত - আমাদের বুদ্ধিমান কর্মপ্রবাহ কার্যকরভাবে অনুভব করুন",
      stages: {
        contact: {
          title: "ইনবাউন্ড যোগাযোগ",
          subtitle: "বহু-চ্যানেল গ্রাহক অনুসন্ধান প্রাপ্ত",
          description: "গ্রাহক পছন্দের চ্যানেলের মাধ্যমে যোগাযোগ করেন স্বয়ংক্রিয় স্বীকৃতি এবং প্রসঙ্গ, অগ্রাধিকার এবং এজেন্ট উপলব্ধতার ভিত্তিতে বুদ্ধিমান রাউটিং সহ।",
          features: ["তাৎক্ষণিক স্বীকৃতি", "স্মার্ট চ্যানেল রাউটিং", "অগ্রাধিকার সনাক্তকরণ"]
        },
        triage: {
          title: "AI ট্রাইএজ",
          subtitle: "বুদ্ধিমান বিশ্লেষণ এবং শ্রেণীকরণ",
          description: "উন্নত AI অনুসন্ধানের বিষয়বস্তু, গ্রাহকের ইতিহাস এবং অনুভূতি বিশ্লেষণ করে সর্বোত্তম সমাধান পথ এবং সম্পদ বরাদ্দ নির্ধারণ করে।",
          features: ["অনুভূতি বিশ্লেষণ", "অভিপ্রায় স্বীকৃতি", "স্বয়ংক্রিয় শ্রেণীকরণ"]
        },
        engagement: {
          title: "স্মার্ট এনগেজমেন্ট",
          subtitle: "ব্যক্তিগতকৃত ইন্টারঅ্যাকশন কৌশল",
          description: "জটিলতা মূল্যায়নের ভিত্তিতে সিস্টেম উপযুক্ত সমাধান কৌশল প্রয়োগ করে - স্বয়ংক্রিয় প্রতিক্রিয় থেকে বিশেষজ্ঞ মানবিক হস্তক্ষেপ পর্যন্ত।",
          features: ["ব্যক্তিগতকৃত প্রতিক্রিয়া", "বিশেষজ্ঞ ম্যাচিং", "প্রসঙ্গ সংরক্ষণ"]
        },
        augmentation: {
          title: "AI অগমেন্টেশন",
          subtitle: "উন্নত মানবিক সক্ষমতা",
          description: "মানব এজেন্টরা সর্বোত্তম ফলাফলের জন্য প্রস্তাবিত প্রতিক্রিয়া, জ্ঞানভান্ডার অ্যাক্সেস এবং পূর্বাভাস অন্তর্দৃষ্টি সহ রিয়েল-টাইম AI সহায়তা পান।",
          features: ["রিয়েল-টাইম পরামর্শ", "জ্ঞান একীকরণ", "পূর্বাভাস অন্তর্দৃষ্টি"]
        },
        analytics: {
          title: "রিয়েল-টাইম অ্যানালিটিক্স",
          subtitle: "ক্রমাগত অপ্টিমাইজেশন অন্তর্দৃষ্টি",
          description: "সিস্টেম ইন্টারঅ্যাকশন ডেটা ক্যাপচার করে, সন্তুষ্টি পরিমাপ করে এবং ক্রমাগত উন্নতির জন্য অপ্টিমাইজেশন সুযোগ চিহ্নিত করে।",
          features: ["কর্মক্ষমতা ট্র্যাকিং", "সন্তুষ্টি পরিমাপ", "অপ্টিমাইজেশন অন্তর্দৃষ্টি"]
        },
        outcome: {
          title: "অপ্টিমাইজড ফলাফল",
          subtitle: "সমাধান এবং ক্রমাগত শিক্ষা",
          description: "ফলো-আপ অটোমেশন এবং ভবিষ্যতের ইন্টারঅ্যাকশন এবং প্রক্রিয়া উন্নত করার জন্য মেশিন লার্নিং ইন্টিগ্রেশন সহ সফল সমাধান।",
          features: ["স্বয়ংক্রিয় ফলো-আপ", "শিক্ষা একীকরণ", "প্রক্রিয়া উন্নতি"]
        }
      }
    },
    
    // ROI Calculator (ROI ক্যালকুলেটর)
    roi: {
      title: "ROI ক্যালকুলেটর",
      subtitle: "আপনার সম্ভাব্য সঞ্চয় দেখুন",
      description: "AI-চালিত গ্রাহক সহায়তার আপনার লাভের উপর প্রভাব গণনা করুন",
      inputs: {
        monthlyVolume: "মাসিক সহায়তা ভলিউম",
        avgHandlingTime: "গড় পরিচালনা সময় (মিনিট)",
        avgAgentCost: "গড় এজেন্ট খরচ ($/ঘন্টা)",
        currentSatisfaction: "বর্তমান গ্রাহক সন্তুষ্টি (%)"
      },
      results: {
        title: "আপনার ROI বিশ্লেষণ",
        monthlySavings: "মাসিক সঞ্চয়",
        annualSavings: "বার্ষিক সঞ্চয়",
        efficiencyGain: "দক্ষতা লাভ",
        satisfactionIncrease: "সন্তুষ্টি বৃদ্ধি",
        paybackPeriod: "পেব্যাক পিরিয়ড"
      },
      cta: "বিস্তারিত বিশ্লেষণ পান"
    },
    
    // Testimonials (প্রশংসাপত্র)
    testimonials: {
      title: "শিল্প নেতাদের দ্বারা বিশ্বস্ত",
      subtitle: "দেখুন কিভাবে শীর্ষস্থানীয় কোম্পানিগুলি SentraTech দিয়ে তাদের গ্রাহক সহায়তা রূপান্তরিত করে",
      items: [
        {
          text: "SentraTech আমাদের প্রতিক্রিয়ার সময় ৭৫% কমিয়েছে ৯৮% গ্রাহক সন্তুষ্টি বজায় রেখে। AI রাউটিং অবিশ্বাস্যভাবে বুদ্ধিমান।",
          author: "সারাহ চেন",
          role: "গ্রাহক সাফল্যের ভিপি",
          company: "টেকফ্লো সলিউশনস"
        },
        {
          text: "আমরা পরিচালনা খরচে ৬০% হ্রাস দেখেছি এবং আমাদের দল উচ্চ-মূল্যের ইন্টারঅ্যাকশনে ফোকাস করতে পারে। গেম-চেঞ্জিং প্ল্যাটফর্ম।",
          author: "মাইকেল রদ্রিগেজ", 
          role: "অপারেশনস প্রধান",
          company: "গ্লোবাল ডায়নামিক্স"
        },
        {
          text: "অ্যানালিটিক্স অন্তর্দৃষ্টি আমাদের গ্রাহক সহায়তার দৃষ্টিভঙ্গিতে বিপ্লব এনেছে। প্রতিটি স্তরে ডেটা-চালিত সিদ্ধান্ত।",
          author: "এমিলি ওয়াটসন",
          role: "প্রধান প্রযুক্তি কর্মকর্তা", 
          company: "ইনোভেটকোর"
        }
      ]
    },
    
    // Pricing (মূল্য নির্ধারণ)
    pricing: {
      title: "সহজ, স্বচ্ছ মূল্য নির্ধারণ",
      subtitle: "আপনার ব্যবসার প্রয়োজন অনুযায়ী স্কেল করে এমন পরিকল্পনা বেছে নিন",
      plans: {
        starter: {
          name: "স্টার্টার",
          price: "$৯৯",
          period: "/মাস",
          description: "শুরু করা ছোট দলের জন্য নিখুঁত",
          features: [
            "মাসিক ১,০০০ পর্যন্ত ইন্টারঅ্যাকশন",
            "বেসিক AI রাউটিং",
            "ইমেইল এবং চ্যাট সহায়তা",
            "স্ট্যান্ডার্ড অ্যানালিটিক্স",
            "৫টি এজেন্ট সিট অন্তর্ভুক্ত"
          ],
          cta: "ফ্রি ট্রায়াল শুরু করুন"
        },
        professional: {
          name: "প্রফেশনাল", 
          price: "$২৯৯",
          period: "/মাস",
          description: "ক্রমবর্ধমান ব্যবসার জন্য উন্নত বৈশিষ্ট্য",
          features: [
            "মাসিক ১০,০০০ পর্যন্ত ইন্টারঅ্যাকশন",
            "উন্নত AI + অনুভূতি বিশ্লেষণ",
            "সর্বমুখী সহায়তা",
            "কাস্টম ড্যাশবোর্ড",
            "১৫টি এজেন্ট সিট অন্তর্ভুক্ত",
            "অগ্রাধিকার সহায়তা"
          ],
          cta: "ফ্রি ট্রায়াল শুরু করুন",
          popular: "সবচেয়ে জনপ্রিয়"
        },
        enterprise: {
          name: "এন্টারপ্রাইজ",
          price: "কাস্টম",
          period: "",
          description: "বড় সংস্থার জন্য কাস্টমাইজড সমাধান",
          features: [
            "সীমাহীন ইন্টারঅ্যাকশন", 
            "সম্পূর্ণ AI স্যুট + কাস্টম মডেল",
            "হোয়াইট-লেবেল অপশন",
            "উন্নত নিরাপত্তা এবং সম্মতি",
            "সীমাহীন এজেন্ট সিট",
            "নিবেদিত সাফল্য ম্যানেজার"
          ],
          cta: "বিক্রয়ের সাথে যোগাযোগ করুন"
        }
      }
    },
    
    // Contact/CTA Section (যোগাযোগ/CTA বিভাগ)
    contact: {
      title: "আপনার গ্রাহক সহায়তা রূপান্তরিত করতে প্রস্তুত?",
      subtitle: "ইতিমধ্যে ব্যতিক্রমী গ্রাহক অভিজ্ঞতা প্রদানের জন্য SentraTech ব্যবহারকারী ৫০০+ কোম্পানিতে যোগ দিন",
      form: {
        title: "একটি ডেমো অনুরোধ করুন",
        fields: {
          name: "পূর্ণ নাম",
          email: "কর্মক্ষেত্রের ইমেইল", 
          company: "কোম্পানির নাম",
          role: "আপনার ভূমিকা",
          phone: "ফোন নম্বর (ঐচ্ছিক)",
          employees: "কোম্পানির আকার",
          message: "আপনার প্রয়োজন সম্পর্কে বলুন"
        },
        placeholders: {
          name: "আপনার পূর্ণ নাম লিখুন",
          email: "your.email@company.com", 
          company: "আপনার কোম্পানির নাম",
          role: "যেমন, ভিপি গ্রাহক সাফল্য",
          phone: "+৮৮ (০১৭) ১২৩-৪৫৬৭",
          message: "আপনি কোন চ্যালেঞ্জ সমাধান করতে চান?"
        },
        button: "ডেমো অনুরোধ করুন",
        sending: "পাঠানো হচ্ছে...",
        success: "ডেমো অনুরোধ সফলভাবে পাঠানো হয়েছে!",
        error: "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন"
      },
      trust: {
        uptime: "৯৯.৯% প্ল্যাটফর্ম আপটাইম",
        security: "SOC2 টাইপ II সার্টিফাইড", 
        support: "২৪/৭ বিশেষজ্ঞ সহায়তা",
        integration: "৫০+ প্ল্যাটফর্ম ইন্টিগ্রেশন"
      }
    },
    
    // Footer (ফুটার)
    footer: {
      tagline: "AI-চালিত গ্রাহক সহায়তা উৎকর্ষতা",
      copyright: "© ২০২৪ SentraTech। সকল অধিকার সংরক্ষিত।",
      links: {
        product: "পণ্য",
        company: "কোম্পানি", 
        resources: "সম্পদ",
        legal: "আইনি"
      }
    },
    
    // Floating Navigation (ফ্লোটিং নেভিগেশন)
    floatingNav: {
      title: "দ্রুত নেভিগেশন",
      items: {
        home: "হোম",
        features: "অতিক্রম", // Beyond
        journey: "গ্রাহক যাত্রা", 
        roi: "ROI ক্যালকুলেটর",
        testimonials: "প্রশংসাপত্র",
        pricing: "উৎকৃষ্ট", // Better
        contact: "যোগাযোগ"
      },
      footer: "SentraTech নেভিগেশন"
    }
  }
};