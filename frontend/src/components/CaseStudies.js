import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  Clock, 
  Heart, 
  Zap, 
  BarChart3, 
  Users,
  Building2,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CaseStudies = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const { t } = useLanguage();

  // Realistic fictional case studies for SMBs in Bangladesh and UK
  const caseStudies = [
    {
      id: 1,
      company: "MedCare Solutions Ltd",
      location: "Dhaka, Bangladesh",
      industry: "Healthcare",
      companySize: "150 employees",
      flag: "🇧🇩",
      logo: "MC",
      description: "Leading healthcare provider serving 50,000+ patients across Dhaka with multiple clinics and telemedicine services.",
      challenge: "Managing 800+ daily patient inquiries across phone, WhatsApp, and email with only 6 staff members, causing 45-minute wait times and patient frustration.",
      
      // Key metrics - before/after
      metrics: {
        costReduction: { before: "৳45,000/month", after: "৳18,000/month", improvement: "60%" },
        responseTime: { before: "45 min", after: "2.3 min", improvement: "95%" },
        satisfaction: { before: "68%", after: "94%", improvement: "26%" },
        automationRate: { before: "10%", after: "78%", improvement: "68%" },
        businessIntelligence: { before: "Manual reports", after: "Real-time dashboards", improvement: "100%" },
        analytics: { before: "No tracking", after: "Full patient journey analytics", improvement: "New capability" }
      },
      
      results: [
        "Automated appointment booking reduced staff workload by 70%",
        "AI-powered symptom triage improved patient flow efficiency",
        "Prescription refill requests handled automatically via WhatsApp",
        "Patient satisfaction scores increased from 68% to 94%",
        "Revenue increased by 35% through better capacity utilization"
      ],
      
      implementation: "6 weeks",
      testimonial: {
        quote: "SentraTech transformed our patient communication. We now handle 3x more inquiries with the same team, and our patients love the instant responses.",
        author: "Dr. Rashida Ahmed",
        position: "Chief Medical Officer"
      }
    },
    
    {
      id: 2,
      company: "TeleConnect Mobile Ltd",
      location: "Chittagong, Bangladesh", 
      industry: "Telecom",
      companySize: "280 employees",
      flag: "🇧🇩",
      logo: "TC",
      description: "Regional telecom provider serving 200,000+ subscribers with mobile and internet services across Chittagong division.",
      challenge: "Processing 2,000+ daily customer complaints about billing, network issues, and service requests with outdated manual systems causing customer churn.",
      
      metrics: {
        costReduction: { before: "৳85,000/month", after: "৳32,000/month", improvement: "62%" },
        responseTime: { before: "25 min", after: "1.8 min", improvement: "93%" },
        satisfaction: { before: "71%", after: "91%", improvement: "20%" },
        automationRate: { before: "15%", after: "82%", improvement: "67%" },
        businessIntelligence: { before: "Weekly reports", after: "Live network analytics", improvement: "Real-time insights" },
        analytics: { before: "Basic call logs", after: "Predictive churn analysis", improvement: "85% churn reduction" }
      },
      
      results: [
        "Bill payment queries resolved instantly via SMS/WhatsApp integration",
        "Network status updates automated based on real-time monitoring",
        "Service activation requests processed without human intervention",
        "Customer churn reduced by 85% through proactive issue resolution",
        "Support costs reduced by 62% while improving service quality"
      ],
      
      implementation: "8 weeks",
      testimonial: {
        quote: "The AI system predicts network issues before customers even call. Our CSAT scores are the highest in Bangladesh telecom industry.",
        author: "Md. Kamrul Hassan",
        position: "Head of Customer Experience"
      }
    },
    
    {
      id: 3,
      company: "ShopSmart E-commerce",
      location: "London, UK",
      industry: "E-commerce",
      companySize: "95 employees", 
      flag: "🇬🇧",
      logo: "SS",
      description: "Fast-growing online marketplace specializing in sustainable products, serving 75,000+ UK customers with same-day delivery in London.",
      challenge: "Managing order inquiries, returns, and delivery updates during peak seasons with limited customer service team causing delayed responses.",
      
      metrics: {
        costReduction: { before: "£8,500/month", after: "£3,200/month", improvement: "62%" },
        responseTime: { before: "18 min", after: "90 sec", improvement: "92%" },
        satisfaction: { before: "79%", after: "96%", improvement: "17%" },
        automationRate: { before: "20%", after: "85%", improvement: "65%" },
        businessIntelligence: { before: "Basic dashboards", after: "AI-powered insights", improvement: "Revenue +40%" },
        analytics: { before: "Google Analytics only", after: "Full customer journey tracking", improvement: "Conversion +25%" }
      },
      
      results: [
        "Order tracking and delivery updates automated via WhatsApp/SMS",
        "Returns and refunds processed instantly through intelligent workflows", 
        "Product recommendations increased sales by 40% through AI insights",
        "Peak season (Black Friday) handled without additional staff",
        "Customer lifetime value increased by 55% through better engagement"
      ],
      
      implementation: "5 weeks",
      testimonial: {
        quote: "During Black Friday, we processed 10x our normal volume seamlessly. SentraTech's AI handled everything while our team focused on strategy.",
        author: "Sarah Mitchell",
        position: "Operations Director"  
      }
    },
    
    {
      id: 4,
      company: "FinanceFirst Banking",
      location: "Sylhet, Bangladesh",
      industry: "Financial Services",
      companySize: "320 employees",
      flag: "🇧🇩",
      logo: "FF",
      description: "Regional banking institution serving 100,000+ customers with digital banking and microfinance services across northeastern Bangladesh.",
      challenge: "Handling 1,500+ daily customer inquiries about loans, account issues, and digital banking with limited support staff causing long wait times.",
      
      metrics: {
        costReduction: { before: "৳95,000/month", after: "৳35,000/month", improvement: "63%" },
        responseTime: { before: "35 min", after: "1.5 min", improvement: "96%" },
        satisfaction: { before: "74%", after: "93%", improvement: "19%" },
        automationRate: { before: "12%", after: "80%", improvement: "68%" },
        businessIntelligence: { before: "Monthly reports", after: "Real-time fraud detection", improvement: "95% fraud reduction" },
        analytics: { before: "Manual tracking", after: "Predictive loan analytics", improvement: "40% approval rate increase" }
      },
      
      results: [
        "Loan application status updates automated via SMS integration",
        "Account balance inquiries resolved instantly through AI chatbot",
        "Digital banking onboarding streamlined with AI assistance", 
        "Fraud detection improved with real-time transaction monitoring",
        "Customer acquisition increased by 45% through better service"
      ],
      
      implementation: "7 weeks",
      testimonial: {
        quote: "SentraTech revolutionized our customer service. We now detect fraud in real-time and our customers get instant responses 24/7.",
        author: "Mohammad Hasan",
        position: "Head of Digital Banking"
      }
    },
    
    {
      id: 5,
      company: "EduTech Learning Hub",
      location: "Manchester, UK",
      industry: "Education Technology", 
      companySize: "120 employees",
      flag: "🇬🇧",
      logo: "EL",
      description: "Online education platform serving 25,000+ students across UK with personalized learning experiences and certification programs.",
      challenge: "Managing student inquiries, technical support, and course guidance with overwhelmed support team during peak enrollment periods.",
      
      metrics: {
        costReduction: { before: "£12,000/month", after: "£4,500/month", improvement: "62%" },
        responseTime: { before: "22 min", after: "2 min", improvement: "91%" },
        satisfaction: { before: "81%", after: "97%", improvement: "16%" },
        automationRate: { before: "18%", after: "88%", improvement: "70%" },
        businessIntelligence: { before: "Basic analytics", after: "Learning path optimization", improvement: "30% completion rate" },
        analytics: { before: "Course completion only", after: "Full learning journey tracking", improvement: "Engagement +55%" }
      },
      
      results: [
        "Course enrollment and payment queries handled automatically",
        "Technical troubleshooting resolved through intelligent help system",
        "Personalized learning recommendations increased engagement by 55%",
        "Student retention improved by 40% through proactive support",
        "Peak enrollment periods managed without additional staff"
      ],
      
      implementation: "5 weeks",
      testimonial: {
        quote: "Our students love the instant help and personalized guidance. SentraTech helped us scale from 10,000 to 25,000 students seamlessly.",
        author: "Emma Thompson",
        position: "Student Success Director"
      }
    },
    
    {
      id: 6,
      company: "GreenLogistics Transport",
      location: "Birmingham, UK",
      industry: "Logistics & Transport",
      companySize: "180 employees",
      flag: "🇬🇧", 
      logo: "GL",
      description: "Eco-friendly logistics company serving 500+ business clients with sustainable delivery solutions across UK metropolitan areas.",
      challenge: "Coordinating delivery schedules, tracking inquiries, and customer communications while scaling operations across multiple cities.",
      
      metrics: {
        costReduction: { before: "£15,000/month", after: "£5,800/month", improvement: "61%" },
        responseTime: { before: "28 min", after: "1.8 min", improvement: "94%" },
        satisfaction: { before: "77%", after: "95%", improvement: "18%" },
        automationRate: { before: "25%", after: "85%", improvement: "60%" },
        businessIntelligence: { before: "Basic delivery tracking", after: "Predictive route optimization", improvement: "25% efficiency gain" },
        analytics: { before: "Manual reporting", after: "Real-time fleet analytics", improvement: "Carbon footprint -30%" }
      },
      
      results: [
        "Delivery tracking and updates automated via WhatsApp integration",
        "Route optimization reduced fuel consumption by 30%", 
        "Customer communications streamlined across multiple channels",
        "Peak delivery periods handled with 25% improved efficiency",
        "Client satisfaction increased leading to 50% more repeat business"
      ],
      
      implementation: "6 weeks", 
      testimonial: {
        quote: "SentraTech helped us maintain our green mission while scaling rapidly. Our clients love the real-time tracking and our drivers love the optimized routes.",
        author: "James Wilson",
        position: "Operations Manager"
      }
    }
  ];

  const MetricCard = ({ title, before, after, improvement, icon: Icon, color }) => (
    <div className="bg-[rgb(26,28,30)] rounded-xl p-4 border border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon size={20} style={{ color }} />
          <span className="text-white font-medium text-sm">{title}</span>
        </div>
        <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
          +{improvement}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[rgb(161,161,170)]">Before:</span>
          <span className="text-red-400">{before}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[rgb(161,161,170)]">After:</span>
          <span style={{ color }}>{after}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="case-studies" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)] relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-5xl font-bold text-white mb-6 font-rajdhani">
              Real Results from Real Businesses
            </h2>
            <p className="text-xl text-[#00FF41] max-w-3xl mx-auto font-medium">
              See how SMBs in Bangladesh and UK transformed their customer support with SentraTech
            </p>
            <p className="text-[rgb(161,161,170)] max-w-4xl mx-auto text-lg leading-relaxed">
              From healthcare providers to e-commerce platforms, discover how businesses reduced costs by 60%+ while improving customer satisfaction.
            </p>
          </motion.div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {caseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                rotateY: 2,
                transition: { 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className="h-full"
            >
              <Card 
                className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-xl overflow-hidden cursor-pointer h-full group
                           hover:border-[#00FF41] hover:shadow-2xl hover:shadow-[rgba(0,255,65,0.25)] 
                           hover:bg-[rgb(28,30,32)] transition-all duration-400 ease-out transform-gpu
                           will-change-transform backdrop-blur-sm"
                onClick={() => setSelectedCase(caseStudy)}
              >
                <CardContent className="p-6">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#00FF41] text-black rounded-xl flex items-center justify-center font-bold">
                        {caseStudy.logo}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{caseStudy.company}</h3>
                        <div className="flex items-center space-x-2 text-sm text-[rgb(161,161,170)]">
                          <MapPin size={14} />
                          <span>{caseStudy.location} {caseStudy.flag}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Industry & Size */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className="bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30">
                      {caseStudy.industry}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-[rgb(161,161,170)]">
                      <Building2 size={14} />
                      <span>{caseStudy.companySize}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[rgb(161,161,170)] text-sm leading-relaxed mb-6">
                    {caseStudy.description}
                  </p>

                  {/* Key Metrics Preview */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center p-3 bg-[rgba(0,255,65,0.1)] rounded-lg border border-[rgba(0,255,65,0.2)]">
                      <div className="text-2xl font-bold text-[#00FF41]">
                        {caseStudy.metrics.costReduction.improvement}
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">Cost Reduction</div>
                    </div>
                    <div className="text-center p-3 bg-[rgba(0,255,65,0.1)] rounded-lg border border-[rgba(0,255,65,0.2)]">
                      <div className="text-2xl font-bold text-[#00FF41]">
                        {caseStudy.metrics.satisfaction.improvement}
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">Satisfaction ↗</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="outline" 
                    className="w-full border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10"
                  >
                    View Full Case Study
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Case Study Modal */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedCase(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[rgb(17,17,19)] border border-[rgba(0,255,65,0.3)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-[rgb(17,17,19)] border-b border-[rgba(255,255,255,0.1)] p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[#00FF41] text-black rounded-xl flex items-center justify-center font-bold text-xl">
                      {selectedCase.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCase.company}</h2>
                      <div className="flex items-center space-x-4 text-[rgb(161,161,170)]">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{selectedCase.location} {selectedCase.flag}</span>
                        </div>
                        <Badge className="bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30">
                          {selectedCase.industry}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCase(null)}
                    className="text-[rgb(161,161,170)] hover:text-white"
                  >
                    <X size={24} />
                  </Button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-8">
                  {/* Challenge */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">The Challenge</h3>
                    <p className="text-[rgb(161,161,170)] leading-relaxed">
                      {selectedCase.challenge}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">Results & Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <MetricCard
                        title="Cost Reduction"
                        before={selectedCase.metrics.costReduction.before}
                        after={selectedCase.metrics.costReduction.after}
                        improvement={selectedCase.metrics.costReduction.improvement}
                        icon={TrendingUp}
                        color="#00FF41"
                      />
                      <MetricCard
                        title="Response Time"
                        before={selectedCase.metrics.responseTime.before}
                        after={selectedCase.metrics.responseTime.after}
                        improvement={selectedCase.metrics.responseTime.improvement}
                        icon={Clock}
                        color="#00DDFF"
                      />
                      <MetricCard
                        title="Customer Satisfaction"
                        before={selectedCase.metrics.satisfaction.before}
                        after={selectedCase.metrics.satisfaction.after}
                        improvement={selectedCase.metrics.satisfaction.improvement}
                        icon={Heart}
                        color="#FF6B6B"
                      />
                      <MetricCard
                        title="Automation Rate"
                        before={selectedCase.metrics.automationRate.before}
                        after={selectedCase.metrics.automationRate.after}
                        improvement={selectedCase.metrics.automationRate.improvement}
                        icon={Zap}
                        color="#FFD700"
                      />
                      <MetricCard
                        title="Business Intelligence"
                        before={selectedCase.metrics.businessIntelligence.before}
                        after={selectedCase.metrics.businessIntelligence.after}
                        improvement={selectedCase.metrics.businessIntelligence.improvement}
                        icon={BarChart3}
                        color="#9D4EDD"
                      />
                      <MetricCard
                        title="Analytics & Insights"
                        before={selectedCase.metrics.analytics.before}
                        after={selectedCase.metrics.analytics.after}
                        improvement={selectedCase.metrics.analytics.improvement}
                        icon={Users}
                        color="#00FF99"
                      />
                    </div>
                  </div>

                  {/* Key Results */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Key Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCase.results.map((result, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[#00FF41] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-[rgb(218,218,218)]">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implementation */}
                  <div className="bg-[rgb(26,28,30)] rounded-xl p-6 border border-[rgba(0,255,65,0.2)]">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar size={20} className="text-[#00FF41]" />
                      <h3 className="text-lg font-bold text-white">Implementation Timeline</h3>
                    </div>
                    <p className="text-[#00FF41] font-semibold text-lg">
                      {selectedCase.implementation} to full deployment
                    </p>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-xl p-6">
                    <blockquote className="text-lg text-white leading-relaxed mb-4 italic">
                      "{selectedCase.testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#00FF41] text-black rounded-full flex items-center justify-center font-bold">
                        {selectedCase.testimonial.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{selectedCase.testimonial.author}</div>
                        <div className="text-[rgb(161,161,170)] text-sm">{selectedCase.testimonial.position}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CaseStudies;