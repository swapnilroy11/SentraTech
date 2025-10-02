import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  FileCheck, 
  Globe, 
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Key,
  Database,
  Server,
  Users,
  ExternalLink
} from 'lucide-react';

const SecurityCompliance = () => {
  const [activeTab, setActiveTab] = useState('certifications');

  const certifications = [
    {
      id: 1,
      name: 'SOC 2 Type II',
      description: 'System and Organization Controls for security, availability, and confidentiality',
      status: 'in-progress',
      icon: Shield,
      color: '#00FF41',
      progress: 85,
      expectedDate: 'Q1 2025',
      details: [
        'Security controls assessment completed',
        'Availability monitoring in place', 
        'Confidentiality protocols established',
        'Third-party audit scheduled for December 2024'
      ]
    },
    {
      id: 2,
      name: 'ISO 27001',
      description: 'International standard for information security management systems',
      status: 'in-progress',
      icon: FileCheck,
      color: '#00DDFF',
      progress: 70,
      expectedDate: 'Q2 2025',
      details: [
        'Information security policy framework created',
        'Risk assessment methodology established',
        'Security awareness training implemented',
        'Management system documentation in progress'
      ]
    },
    {
      id: 3,
      name: 'GDPR Compliance',
      description: 'General Data Protection Regulation compliance for EU data handling',
      status: 'compliant',
      icon: Globe,
      color: '#FFD700',
      progress: 100,
      expectedDate: 'Completed',
      details: [
        'Data processing agreements in place',
        'Right to erasure implemented',
        'Data portability features available',
        'Privacy by design principles followed'
      ]
    },
    {
      id: 4,
      name: 'CCPA Compliance',
      description: 'California Consumer Privacy Act compliance for US customer data',
      status: 'compliant',
      icon: Eye,
      color: '#9D4EDD',
      progress: 100,
      expectedDate: 'Completed',
      details: [
        'Consumer rights portal available',
        'Data disclosure practices documented',
        'Opt-out mechanisms implemented',
        'Third-party sharing transparency'
      ]
    },
    {
      id: 5,
      name: 'HIPAA Ready',
      description: 'Health Insurance Portability and Accountability Act readiness for healthcare',
      status: 'in-progress',
      icon: Lock,
      color: '#FF6B6B',
      progress: 60,
      expectedDate: 'Q3 2025',
      details: [
        'Administrative safeguards established',
        'Physical safeguards implemented',
        'Technical safeguards in development',
        'Business Associate Agreements prepared'
      ]
    },
    {
      id: 6,
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security Standard for payment data',
      status: 'planning',
      icon: Key,
      color: '#FF9500',
      progress: 30,
      expectedDate: 'Q4 2025',
      details: [
        'Security requirements analysis completed',
        'Network architecture review in progress',
        'Penetration testing planned',
        'Compliance roadmap established'
      ]
    }
  ];

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'All data encrypted in transit (TLS 1.3) and at rest (AES-256)',
      icon: Lock,
      status: 'active'
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'TOTP, SMS, and biometric authentication options available',
      icon: Shield,
      status: 'active'
    },
    {
      title: 'Role-Based Access Control',
      description: 'Granular permissions with principle of least privilege',
      icon: Users,
      status: 'active'
    },
    {
      title: 'Data Residency Control',
      description: 'Choose where your data is stored: US, EU, or Asia-Pacific',
      icon: Database,
      status: 'active'
    },
    {
      title: 'Audit Logging',
      description: 'Comprehensive activity logs with tamper-evident storage',
      icon: FileCheck,
      status: 'active'
    },
    {
      title: 'Network Security',
      description: 'WAF, DDoS protection, and intrusion detection systems',
      icon: Server,
      status: 'active'
    }
  ];

  const tabs = [
    { id: 'certifications', name: 'Certifications & Compliance', icon: Shield },
    { id: 'security', name: 'Security Features', icon: Lock },
    { id: 'privacy', name: 'Privacy & Data Protection', icon: Eye }
  ];

  const StatusBadge = ({ status, progress }) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
            <CheckCircle size={12} className="mr-1" />
            Compliant
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
            <Clock size={12} className="mr-1" />
            In Progress ({progress}%)
          </Badge>
        );
      case 'planning':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">
            <AlertTriangle size={12} className="mr-1" />
            Planning
          </Badge>
        );
      default:
        return null;
    }
  };

  const ProgressBar = ({ progress, color }) => (
    <div className="w-full bg-[rgb(42,42,42)] rounded-full h-2">
      <div 
        className="h-2 rounded-full transition-all duration-500"
        style={{ 
          width: `${progress}%`,
          backgroundColor: color
        }}
      />
    </div>
  );

  return (
    <section id="security" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)] relative">
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
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-[#00FF41] max-w-3xl mx-auto font-medium">
              Bank-level security with comprehensive compliance certifications
            </p>
            <p className="text-[rgb(161,161,170)] max-w-4xl mx-auto text-lg leading-relaxed">
              Your data security is our highest priority. We maintain the strictest security standards and are actively pursuing major compliance certifications.
            </p>
          </motion.div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">99.99%</div>
            <div className="text-[rgb(161,161,170)] text-sm">Security Uptime</div>
          </div>
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">AES-256</div>
            <div className="text-[rgb(161,161,170)] text-sm">Data Encryption</div>
          </div>
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">24/7</div>
            <div className="text-[rgb(161,161,170)] text-sm">Security Monitoring</div>
          </div>
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">Zero</div>
            <div className="text-[rgb(161,161,170)] text-sm">Data Breaches</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#00FF41] text-black'
                    : 'bg-[rgb(42,42,42)] text-[rgb(161,161,170)] hover:bg-[rgb(52,52,52)] hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'certifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <Card key={cert.id} className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    {/* Certification Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${cert.color}20` }}
                        >
                          <Icon size={24} style={{ color: cert.color }} />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{cert.name}</h3>
                          <StatusBadge status={cert.status} progress={cert.progress} />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[rgb(161,161,170)] text-sm leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[rgb(161,161,170)]">Progress</span>
                        <span className="text-sm font-medium" style={{ color: cert.color }}>
                          {cert.progress}%
                        </span>
                      </div>
                      <ProgressBar progress={cert.progress} color={cert.color} />
                    </div>

                    {/* Expected Date */}
                    <div className="mb-4">
                      <div className="text-sm text-[rgb(161,161,170)] mb-2">
                        {cert.status === 'compliant' ? 'Status' : 'Expected Completion'}
                      </div>
                      <div className="text-white font-medium">{cert.expectedDate}</div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {cert.details.slice(0, 2).map((detail, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[rgb(218,218,218)] text-xs">{detail}</span>
                        </div>
                      ))}
                      <div className="text-[rgb(161,161,170)] text-xs">
                        +{cert.details.length - 2} more milestones
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-[rgba(0,255,65,0.1)] rounded-xl flex items-center justify-center">
                        <Icon size={24} className="text-[#00FF41]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{feature.title}</h3>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                          <CheckCircle size={10} className="mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[rgb(161,161,170)] text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Data Protection Principles */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Data Protection Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Data Minimization</h4>
                        <p className="text-[rgb(161,161,170)] text-sm">We collect only the data necessary for service delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Purpose Limitation</h4>
                        <p className="text-[rgb(161,161,170)] text-sm">Data used only for specified, legitimate purposes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Storage Limitation</h4>
                        <p className="text-[rgb(161,161,170)] text-sm">Data retained only as long as necessary</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Transparency</h4>
                        <p className="text-[rgb(161,161,170)] text-sm">Clear communication about data processing</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">User Control</h4>
                        <p className="text-[rgb(161,161,170)] text-sm">Users can access, modify, or delete their data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 mt-1" />
                      <div>
                        <h4 className="text-white font-medium">Security by Design</h4>
                        <p className="text-[rgb(161,161,170)] text-sm">Privacy protection built into every system</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl">
                <CardContent className="p-6 text-center">
                  <FileCheck size={32} className="text-[#00FF41] mx-auto mb-4" />
                  <h4 className="text-white font-bold mb-2">Privacy Policy</h4>
                  <p className="text-[rgb(161,161,170)] text-sm mb-4">
                    Comprehensive privacy practices and data handling policies
                  </p>
                  <Button variant="outline" size="sm" className="border-[#00FF41]/30 text-[#00FF41]">
                    <ExternalLink size={14} className="mr-2" />
                    View Policy
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl">
                <CardContent className="p-6 text-center">
                  <Download size={32} className="text-[#00FF41] mx-auto mb-4" />
                  <h4 className="text-white font-bold mb-2">DPA Template</h4>
                  <p className="text-[rgb(161,161,170)] text-sm mb-4">
                    Data Processing Agreement template for enterprise customers
                  </p>
                  <Button variant="outline" size="sm" className="border-[#00FF41]/30 text-[#00FF41]">
                    <Download size={14} className="mr-2" />
                    Download DPA
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl">
                <CardContent className="p-6 text-center">
                  <Shield size={32} className="text-[#00FF41] mx-auto mb-4" />
                  <h4 className="text-white font-bold mb-2">Security Portal</h4>
                  <p className="text-[rgb(161,161,170)] text-sm mb-4">
                    Real-time security status and compliance updates
                  </p>
                  <Button variant="outline" size="sm" className="border-[#00FF41]/30 text-[#00FF41]">
                    <ExternalLink size={14} className="mr-2" />
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Trust Center CTA */}
        <div className="text-center mt-16">
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-2xl p-8 max-w-3xl mx-auto">
            <Shield size={48} className="text-[#00FF41] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Complete Trust & Transparency
            </h3>
            <p className="text-[rgb(161,161,170)] mb-6 leading-relaxed">
              Access our comprehensive Trust Center for detailed security documentation, 
              compliance reports, and real-time system status updates.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button className="bg-[#00FF41] text-black hover:bg-[#00e83a] px-6">
                <Shield size={16} className="mr-2" />
                Visit Trust Center
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(0,255,65,0.3)] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)]"
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <FileCheck size={16} className="mr-2" />
                Request Compliance Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;