import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, Play, Users, Target, Zap, DollarSign, TrendingUp, Award, Globe, Calendar, ArrowRight, CheckCircle, Briefcase, Code, BarChart3 } from 'lucide-react';

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef(null);

  const slides = [
    // Slide 1: Introduction - Company
    {
      id: 1,
      title: "SentraTech",
      type: "intro",
      content: {
        logo: "🤖",
        tagline: "Transforming Customer Support with AI-Powered Automation",
        subtitle: "Pre-Seed Funding Opportunity",
        contact: "Swapnil Roy, CEO & Founder",
        email: "swapnil.roy@sentratech.net",
        stage: "Pre-Seed • $2.5M • Q1 2025"
      }
    },

    // Slide 2: Problem & Solution Scenario
    {
      id: 2,
      title: "The $75B Customer Support Crisis",
      type: "problem-solution",
      content: {
        problems: [
          {
            icon: "💰",
            stat: "$75B",
            desc: "Annually wasted on inefficient customer support operations"
          },
          {
            icon: "🔄",
            stat: "65%",
            desc: "Of support tickets are repetitive and could be automated"
          },
          {
            icon: "⏰",
            stat: "6-18 months",
            desc: "Typical implementation time for legacy solutions"
          },
          {
            icon: "😤",
            stat: "Poor CX",
            desc: "Due to slow response times and inconsistent quality"
          }
        ],
        solution: {
          title: "Our AI-First Solution",
          features: [
            "AI-powered ticket automation & intelligent routing",
            "2-week deployment vs 6-month traditional implementations", 
            "70% cost reduction through intelligent automation",
            "Real-time insights with advanced analytics dashboard"
          ]
        }
      }
    },

    // Slide 3: Market Size/Possibilities
    {
      id: 3,
      title: "Massive Market Opportunity",
      type: "market",
      content: {
        markets: [
          {
            type: "TAM",
            title: "Total Addressable Market",
            value: "$95B",
            desc: "Global customer service software and AI automation market",
            growth: "Growing 15% CAGR"
          },
          {
            type: "SAM", 
            title: "Immediate Addressable Market",
            value: "$12B",
            desc: "Mid-market companies with 100+ support agents seeking AI automation",
            growth: "Early adopters ready"
          },
          {
            type: "SOM",
            title: "Early Adoption Opportunity", 
            value: "$850M",
            desc: "Companies currently evaluating AI customer support solutions",
            growth: "Our target segment"
          }
        ],
        marketDrivers: [
          "AI adoption accelerating post-ChatGPT",
          "Remote work increasing support ticket volume",
          "Customer expectations for instant responses",
          "Economic pressure to reduce operational costs"
        ]
      }
    },

    // Slide 4: Competitive Advantage/Unique Features
    {
      id: 4,
      title: "Competitive Advantages",
      type: "competitive",
      content: {
        competitors: [
          { name: "Zendesk", weakness: "Legacy architecture, slow AI adoption" },
          { name: "Intercom", weakness: "High cost, limited automation" },
          { name: "Freshworks", weakness: "Basic AI, complex setup" },
          { name: "ServiceNow", weakness: "Enterprise-only, 6+ month implementation" }
        ],
        advantages: [
          {
            icon: "🚀",
            title: "AI-First Architecture",
            desc: "Built from ground up for AI automation, not retrofitted"
          },
          {
            icon: "⚡",
            title: "Rapid Deployment",
            desc: "2-week implementation vs industry standard 6 months"
          },
          {
            icon: "💡",
            title: "Intelligent Learning",
            desc: "Continuously improves accuracy with proprietary ML algorithms"
          },
          {
            icon: "🔧",
            title: "No-Code Configuration",
            desc: "Business users can configure without IT involvement"
          },
          {
            icon: "📊",
            title: "Real-Time Analytics",
            desc: "Advanced insights and performance tracking dashboard"
          },
          {
            icon: "💰",
            title: "Cost-Effective",
            desc: "70% cost reduction vs traditional solutions"
          }
        ]
      }
    },

    // Slide 5: Technology Strategy
    {
      id: 5,
      title: "Technology Architecture",
      type: "technology",
      content: {
        architecture: [
          {
            layer: "AI/ML Engine",
            components: ["Natural Language Processing", "Intent Classification", "Automated Response Generation", "Sentiment Analysis"],
            tech: "Python, TensorFlow, Transformers"
          },
          {
            layer: "Integration Layer", 
            components: ["CRM Connectors", "Ticketing System APIs", "Communication Channels", "Webhook Management"],
            tech: "FastAPI, REST APIs, GraphQL"
          },
          {
            layer: "Analytics Platform",
            components: ["Real-time Dashboards", "Performance Metrics", "Predictive Analytics", "Custom Reports"],
            tech: "React, D3.js, MongoDB"
          },
          {
            layer: "Infrastructure",
            components: ["Cloud Hosting", "Auto-scaling", "Security & Compliance", "Data Pipeline"],
            tech: "AWS, Docker, Kubernetes"
          }
        ],
        keyFeatures: [
          "Multi-language support (8+ languages)",
          "Enterprise-grade security & compliance",
          "99.9% uptime SLA with auto-scaling",
          "Real-time learning and adaptation"
        ]
      }
    },

    // Slide 6: Business Strategy
    {
      id: 6,
      title: "Go-to-Market Strategy",
      type: "business",
      content: {
        strategy: {
          phase1: {
            title: "Phase 1: Pilot & Validation (Q1-Q2 2025)",
            goals: ["10 enterprise pilot customers", "Product-market fit validation", "Customer success stories"],
            tactics: ["Direct sales to warm network", "Industry conference participation", "Content marketing & thought leadership"]
          },
          phase2: {
            title: "Phase 2: Scale & Expand (Q3-Q4 2025)",
            goals: ["First paying customers", "$500K ARR target", "Team scaling to 15 members"],
            tactics: ["Inbound marketing engine", "Partner channel development", "Customer referral program"]
          },
          phase3: {
            title: "Phase 3: Market Leadership (2026)",
            goals: ["Series A funding", "Market expansion", "Advanced AI capabilities"],
            tactics: ["Thought leadership", "Strategic partnerships", "International expansion"]
          }
        },
        targetCustomers: [
          "Mid-market companies (500-5000 employees)",
          "High support ticket volume (1000+ monthly)",
          "Currently using legacy support tools",
          "Technology-forward decision makers"
        ]
      }
    },

    // Slide 7: Financial Strategy
    {
      id: 7,
      title: "Financial Projections & Revenue Model",
      type: "financial",
      content: {
        revenueModel: {
          primary: "SaaS Subscription Model",
          tiers: [
            { name: "Starter", price: "$299/month", desc: "Up to 500 tickets/month, basic automation" },
            { name: "Growth", price: "$899/month", desc: "Up to 2,000 tickets/month, advanced AI features" },
            { name: "Enterprise", price: "$2,499/month", desc: "Unlimited tickets, custom integrations, dedicated support" }
          ]
        },
        projections: [
          { year: "2025", revenue: "$150K", customers: 8, arr: "$150K" },
          { year: "2026", revenue: "$800K", customers: 35, arr: "$800K" },
          { year: "2027", revenue: "$2.8M", customers: 120, arr: "$2.8M" },
          { year: "2028", revenue: "$8.5M", customers: 300, arr: "$8.5M" }
        ],
        keyMetrics: [
          { metric: "Customer LTV", value: "$75K", note: "Average customer lifetime value" },
          { metric: "CAC", value: "$8K", note: "Customer acquisition cost" },
          { metric: "LTV/CAC Ratio", value: "9.4x", note: "Strong unit economics" },
          { metric: "Gross Margin", value: "85%", note: "Typical SaaS margins" }
        ]
      }
    },

    // Slide 8: Management Team
    {
      id: 8,
      title: "World-Class Team",
      type: "team",
      content: {
        founders: [
          {
            name: "Swapnil Roy",
            title: "CEO & Co-Founder",
            background: "AI Product Strategy, Enterprise Software, Team Leadership",
            experience: "10+ years building enterprise software products",
            education: "Computer Science, Business Strategy"
          },
          {
            name: "Lead AI Engineer",
            title: "Co-Founder & CTO", 
            background: "Machine Learning, NLP, Distributed Systems Architecture",
            experience: "Senior ML Engineer at top tech company",
            education: "PhD in AI/ML, Published researcher"
          },
          {
            name: "Senior Full-Stack Engineer",
            title: "Head of Engineering",
            background: "Scalable Backend Systems, Frontend Architecture, DevOps",
            experience: "Tech lead at high-growth SaaS startup",
            education: "Software Engineering, Cloud Architecture"
          }
        ],
        advisors: [
          "Former Head of AI at enterprise customer support company",
          "VP Sales at leading SaaS customer support platform", 
          "Former CXO at Fortune 500 with large support operations"
        ],
        teamStrength: "Deep expertise in AI/ML, enterprise software, and customer support domain"
      }
    },

    // Slide 9: What We Need - Funding & Support
    {
      id: 9,
      title: "Investment Opportunity",
      type: "funding",
      content: {
        ask: {
          amount: "$2.5M",
          stage: "Pre-Seed",
          timeline: "Q1 2025",
          structure: "SAFE/Convertible Note"
        },
        useOfFunds: [
          { category: "Production Infrastructure", percentage: 40, amount: "$1.0M", desc: "AWS deployment, security, scaling" },
          { category: "Enterprise Pilot Customers", percentage: 25, amount: "$625K", desc: "Customer success, implementation" },
          { category: "Technical Team Expansion", percentage: 20, amount: "$500K", desc: "AI/ML engineers, DevOps" },
          { category: "Go-to-Market", percentage: 15, amount: "$375K", desc: "Sales, marketing, partnerships" }
        ],
        milestones: [
          "10 enterprise pilot customers by Q2 2025",
          "Production-ready platform deployment",
          "First paying customers by Q4 2025",
          "$500K ARR target by end of 2025",
          "Series A fundraising readiness by Q1 2026"
        ],
        investorProfile: [
          "Experience with B2B SaaS and AI startups",
          "Network in enterprise customer support market",
          "Hands-on approach to supporting portfolio companies",
          "Understanding of pre-seed to Series A scaling"
        ]
      }
    },

    // Slide 10: Vision & Next Steps
    {
      id: 10,
      title: "The Future of Customer Support",
      type: "vision",
      content: {
        vision: "To become the global leader in AI-powered customer support automation, enabling businesses to deliver exceptional customer experiences while reducing operational costs by 70%.",
        whyNow: [
          "AI technology has reached commercial viability post-ChatGPT",
          "Economic pressure driving automation adoption",
          "Customer expectations for instant, personalized support",
          "First-mover advantage in AI-first customer support"
        ],
        nextSteps: [
          {
            timeline: "Next 30 Days",
            actions: ["Complete pre-seed fundraising", "Finalize pilot customer agreements", "Production deployment planning"]
          },
          {
            timeline: "Next 90 Days", 
            actions: ["Launch pilot programs", "Team expansion", "Product iteration based on feedback"]
          },
          {
            timeline: "Next 12 Months",
            actions: ["Scale to 50+ customers", "Series A fundraising", "Market expansion strategy"]
          }
        ],
        cta: {
          title: "Join Us in Transforming Customer Support",
          subtitle: "Ready to be part of the AI revolution in customer service?",
          contact: "swapnil.roy@sentratech.net"
        }
      }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (deckRef.current.requestFullscreen) {
        deckRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const downloadDeck = () => {
    // Create a simple text version for download
    const deckContent = slides.map((slide, index) => {
      return `
SLIDE ${index + 1}: ${slide.title}
${JSON.stringify(slide.content, null, 2)}
${'='.repeat(50)}
      `;
    }).join('\n');

    const blob = new Blob([deckContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SentraTech-Pitch-Deck.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case 'intro':
        return (
          <div className="text-center h-full flex flex-col justify-center">
            <div className="text-8xl mb-8">{slide.content.logo}</div>
            <h1 className="text-6xl font-bold text-white mb-4">{slide.title}</h1>
            <p className="text-2xl text-[#00FF41] mb-8">{slide.content.tagline}</p>
            <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-2xl px-8 py-6 inline-block mb-8">
              <p className="text-xl text-white font-semibold">{slide.content.stage}</p>
            </div>
            <div className="text-lg text-[rgb(161,161,170)]">
              <p className="mb-2">{slide.content.contact}</p>
              <p className="text-[#00FF41]">{slide.content.email}</p>
            </div>
          </div>
        );

      case 'problem-solution':
        return (
          <div className="h-full">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-red-400 mr-3">⚠️</span>
                  The Problem
                </h3>
                <div className="space-y-4">
                  {slide.content.problems.map((problem, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <span className="text-2xl">{problem.icon}</span>
                      <div>
                        <div className="text-2xl font-bold text-red-400">{problem.stat}</div>
                        <div className="text-[rgb(218,218,218)]">{problem.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-[#00FF41] mr-3">✅</span>
                  {slide.content.solution.title}
                </h3>
                <div className="space-y-3">
                  {slide.content.solution.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="text-[#00FF41] mt-1 flex-shrink-0" size={20} />
                      <span className="text-[rgb(218,218,218)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="h-full">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {slide.content.markets.map((market, index) => (
                <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 text-center">
                  <div className="text-sm text-[#00FF41] font-semibold mb-2">{market.type}</div>
                  <div className="text-4xl font-bold text-white mb-2">{market.value}</div>
                  <div className="text-lg font-semibold text-white mb-3">{market.title}</div>
                  <div className="text-[rgb(161,161,170)] text-sm mb-2">{market.desc}</div>
                  <div className="text-[#00FF41] text-sm font-medium">{market.growth}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Market Drivers</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {slide.content.marketDrivers.map((driver, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <TrendingUp className="text-[#00FF41]" size={20} />
                    <span className="text-[rgb(218,218,218)]">{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'competitive':
        return (
          <div className="h-full">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Current Market Players</h3>
                <div className="space-y-3">
                  {slide.content.competitors.map((comp, index) => (
                    <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                      <div className="font-semibold text-white">{comp.name}</div>
                      <div className="text-[rgb(161,161,170)] text-sm">{comp.weakness}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Our Competitive Advantages</h3>
                <div className="grid gap-3">
                  {slide.content.advantages.map((advantage, index) => (
                    <div key={index} className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">{advantage.icon}</span>
                        <div>
                          <div className="font-semibold text-white text-sm">{advantage.title}</div>
                          <div className="text-[rgb(218,218,218)] text-xs">{advantage.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'technology':
        return (
          <div className="h-full">
            <div className="space-y-4 mb-6">
              {slide.content.architecture.map((layer, index) => (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-[#00FF41] text-lg">{layer.layer}</h4>
                    <span className="text-xs text-[rgb(161,161,170)] bg-[rgb(26,28,30)] px-2 py-1 rounded">{layer.tech}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {layer.components.map((component, idx) => (
                      <span key={idx} className="text-sm text-[rgb(218,218,218)]">• {component}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">Key Technical Features</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {slide.content.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Code className="text-[#00FF41]" size={16} />
                    <span className="text-sm text-[rgb(218,218,218)]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="h-full">
            <div className="space-y-6">
              {Object.entries(slide.content.strategy).map(([phase, details], index) => (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6">
                  <h4 className="font-bold text-[#00FF41] text-lg mb-4">{details.title}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-semibold text-white text-sm mb-2">Goals</h5>
                      {details.goals.map((goal, idx) => (
                        <div key={idx} className="text-xs text-[rgb(218,218,218)] mb-1">• {goal}</div>
                      ))}
                    </div>
                    <div className="md:col-span-2">
                      <h5 className="font-semibold text-white text-sm mb-2">Tactics</h5>
                      {details.tactics.map((tactic, idx) => (
                        <div key={idx} className="text-xs text-[rgb(218,218,218)] mb-1">• {tactic}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-xl p-4 mt-6">
              <h4 className="font-bold text-white mb-3">Target Customer Profile</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {slide.content.targetCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Target className="text-[#00FF41]" size={16} />
                    <span className="text-sm text-[rgb(218,218,218)]">{customer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="h-full">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6">
                <h4 className="font-bold text-[#00FF41] text-lg mb-4">Revenue Model</h4>
                <p className="text-white font-semibold mb-4">{slide.content.revenueModel.primary}</p>
                <div className="space-y-3">
                  {slide.content.revenueModel.tiers.map((tier, index) => (
                    <div key={index} className="border border-[rgb(63,63,63)] rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{tier.name}</span>
                        <span className="text-[#00FF41] font-bold">{tier.price}</span>
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">{tier.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6">
                <h4 className="font-bold text-[#00FF41] text-lg mb-4">Financial Projections</h4>
                <div className="space-y-3">
                  {slide.content.projections.map((proj, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-[rgb(63,63,63)] pb-2">
                      <span className="text-white font-semibold">{proj.year}</span>
                      <div className="text-right">
                        <div className="text-[#00FF41] font-bold">{proj.revenue}</div>
                        <div className="text-xs text-[rgb(161,161,170)]">{proj.customers} customers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">Key Metrics</h4>
              <div className="grid md:grid-cols-4 gap-4">
                {slide.content.keyMetrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-[#00FF41]">{metric.value}</div>
                    <div className="text-sm text-white font-semibold">{metric.metric}</div>
                    <div className="text-xs text-[rgb(161,161,170)]">{metric.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="h-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Founding Team</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {slide.content.founders.map((founder, index) => (
                  <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                    <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users size={24} className="text-[#00FF41]" />
                    </div>
                    <h4 className="font-bold text-white text-center mb-1">{founder.name}</h4>
                    <p className="text-[#00FF41] text-sm text-center mb-2">{founder.title}</p>
                    <p className="text-xs text-[rgb(218,218,218)] text-center mb-2">{founder.background}</p>
                    <p className="text-xs text-[rgb(161,161,170)] text-center">{founder.experience}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">Strategic Advisors</h4>
              <div className="space-y-2">
                {slide.content.advisors.map((advisor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="text-[#00FF41]" size={16} />
                    <span className="text-sm text-[rgb(218,218,218)]">{advisor}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#00FF41]/30">
                <p className="text-sm text-[rgb(218,218,218)]">
                  <strong className="text-white">Team Strength:</strong> {slide.content.teamStrength}
                </p>
              </div>
            </div>
          </div>
        );

      case 'funding':
        return (
          <div className="h-full">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Investment Ask</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-[#00FF41] mb-2">{slide.content.ask.amount}</div>
                  <div className="text-lg text-white">{slide.content.ask.stage}</div>
                  <div className="text-sm text-[rgb(161,161,170)]">{slide.content.ask.timeline} • {slide.content.ask.structure}</div>
                </div>
              </div>
              
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6">
                <h4 className="font-bold text-white mb-4">Use of Funds</h4>
                <div className="space-y-3">
                  {slide.content.useOfFunds.map((fund, index) => (
                    <div key={index} className="border border-[rgb(63,63,63)] rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white text-sm">{fund.category}</span>
                        <span className="text-[#00FF41] font-bold">{fund.percentage}%</span>
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)] mb-1">{fund.desc}</div>
                      <div className="text-xs text-[rgb(218,218,218)]">{fund.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                <h4 className="font-bold text-white mb-3">18-Month Milestones</h4>
                <div className="space-y-2">
                  {slide.content.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="text-[#00FF41]" size={16} />
                      <span className="text-sm text-[rgb(218,218,218)]">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                <h4 className="font-bold text-white mb-3">Ideal Investor Profile</h4>
                <div className="space-y-2">
                  {slide.content.investorProfile.map((profile, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Briefcase className="text-[#00FF41]" size={16} />
                      <span className="text-sm text-[rgb(218,218,218)]">{profile}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-lg text-[rgb(218,218,218)] max-w-4xl mx-auto leading-relaxed">
                {slide.content.vision}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6">
                <h4 className="font-bold text-[#00FF41] text-lg mb-4">Why Now?</h4>
                <div className="space-y-3">
                  {slide.content.whyNow.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Zap className="text-[#00FF41] mt-1" size={16} />
                      <span className="text-sm text-[rgb(218,218,218)]">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6">
                <h4 className="font-bold text-[#00FF41] text-lg mb-4">Next Steps</h4>
                <div className="space-y-4">
                  {slide.content.nextSteps.map((step, index) => (
                    <div key={index}>
                      <div className="font-semibold text-white text-sm mb-2">{step.timeline}</div>
                      <div className="space-y-1">
                        {step.actions.map((action, idx) => (
                          <div key={idx} className="text-xs text-[rgb(218,218,218)] flex items-center space-x-2">
                            <ArrowRight size={12} className="text-[#00FF41]" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-r from-[#00FF41]/10 to-[#00DD38]/10 border border-[#00FF41]/30 rounded-2xl p-6">
              <h4 className="text-2xl font-bold text-white mb-2">{slide.content.cta.title}</h4>
              <p className="text-lg text-[rgb(218,218,218)] mb-4">{slide.content.cta.subtitle}</p>
              <a 
                href={`mailto:${slide.content.cta.contact}?subject=Investment Inquiry - SentraTech Pre-Seed`}
                className="inline-flex items-center px-8 py-3 bg-[#00FF41] text-black font-semibold rounded-xl hover:bg-[#00DD38] transition-colors duration-200"
              >
                Let's Talk
                <ArrowRight className="ml-2" size={20} />
              </a>
            </div>
          </div>
        );

      default:
        return <div className="text-white">Slide content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(18,20,22)] text-white">
      {/* Header Controls */}
      <div className="sticky top-0 z-50 bg-[rgb(18,20,22)]/95 border-b border-[rgb(63,63,63)] px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">SentraTech Pitch Deck</h1>
            <span className="text-[rgb(161,161,170)]">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadDeck}
              className="flex items-center space-x-2 px-4 py-2 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg hover:bg-[rgb(48,50,52)] transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00FF41] text-black rounded-lg hover:bg-[#00DD38] transition-colors"
            >
              <Play size={16} />
              <span>Present</span>
            </button>
          </div>
        </div>
        
        {/* Slide Navigation */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-[#00FF41]' : 'bg-[rgb(63,63,63)] hover:bg-[rgb(83,83,83)]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Slide Container */}
      <div ref={deckRef} className="relative">
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-8">
          <div className="w-full max-w-7xl">
            {/* Slide Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">
                {slides[currentSlide].title}
              </h2>
              <div className="w-24 h-1 bg-[#00FF41] mx-auto rounded-full"></div>
            </div>

            {/* Slide Content */}
            <div className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(18,20,22)] border border-[rgb(63,63,63)] rounded-3xl p-8 min-h-[500px]">
              {renderSlideContent(slides[currentSlide])}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-full flex items-center justify-center hover:bg-[rgb(48,50,52)] transition-colors"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-full flex items-center justify-center hover:bg-[rgb(48,50,52)] transition-colors"
        >
          <ChevronRight className="text-white" size={24} />
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgb(63,63,63)] px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-[rgb(161,161,170)] text-sm">
            © 2024 SentraTech - Confidential
          </div>
          <div className="text-[rgb(161,161,170)] text-sm">
            swapnil.roy@sentratech.net
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeck;