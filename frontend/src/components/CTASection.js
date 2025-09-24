import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Rocket, ArrowRight, CheckCircle, Clock, 
  Users, Zap, Calendar, Send, Sparkles
} from 'lucide-react';
import { mockApi } from '../data/mock';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    callVolume: '',
    useCase: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await mockApi.submitContact(formData);
      setIsSubmitted(true);
      setFormData({
        name: '', email: '', company: '', phone: '', 
        message: '', callVolume: '', useCase: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#00FF41]/5 to-[#00DDFF]/5">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto bg-[rgb(26,28,30)] border-2 border-[#00FF41] rounded-3xl p-12 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#00FF41]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00FF41]/50">
                <CheckCircle size={40} className="text-[#00FF41]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Thank You!
              </h3>
              <p className="text-[rgb(218,218,218)] text-lg leading-relaxed">
                Your demo request has been received. Our team will contact you within 24 hours 
                to schedule a personalized demonstration of our AI-powered platform.
              </p>
            </div>
            
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="bg-[#00FF41] text-[rgb(17,17,19)] hover:bg-[#00e83a] rounded-xl px-6"
            >
              Submit Another Request
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(38,40,42)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Rocket className="mr-2" size={14} />
            Get Started Today
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Ready to Transform</span>
            <br />
            <span className="text-[#00FF41]">Your Customer Support?</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Join industry leaders who trust SentraTech to deliver exceptional customer experiences 
            while reducing costs and improving efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Side - Benefits & Social Proof */}
          <div className="space-y-8">
            {/* Key Benefits */}
            <Card className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(38,40,42)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl text-white flex items-center space-x-3">
                  <Sparkles size={24} className="text-[#00FF41]" />
                  <span>What You'll Get</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-[rgb(17,17,19)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="p-2 bg-[#00FF41]/20 rounded-lg border border-[#00FF41]/50 flex-shrink-0">
                    <Zap size={20} className="text-[#00FF41]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Sub-50ms AI Routing</h4>
                    <p className="text-[rgb(218,218,218)] text-sm">
                      Lightning-fast decision engine that optimizes every customer interaction in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[rgb(17,17,19)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="p-2 bg-[#00DDFF]/20 rounded-lg border border-[#00DDFF]/50 flex-shrink-0">
                    <Users size={20} className="text-[#00DDFF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">70% Automation Rate</h4>
                    <p className="text-[rgb(218,218,218)] text-sm">
                      Intelligent automation handles routine inquiries while humans focus on complex issues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[rgb(17,17,19)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="p-2 bg-[rgb(192,192,192)]/20 rounded-lg border border-[rgb(192,192,192)]/50 flex-shrink-0">
                    <CheckCircle size={20} className="text-[rgb(192,192,192)]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Full Compliance Suite</h4>
                    <p className="text-[rgb(218,218,218)] text-sm">
                      Built-in GDPR, HIPAA, and PCI compliance with immutable audit trails.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Process */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <Calendar size={20} className="text-[#00DDFF]" />
                  <span>What Happens Next?</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[#DAFF01] text-[rgb(17,17,19)] rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-white font-semibold">Schedule Your Demo</div>
                    <div className="text-[rgb(161,161,170)] text-sm">30-minute personalized walkthrough</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[#00DDFF] text-[rgb(17,17,19)] rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-white font-semibold">Custom ROI Analysis</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Tailored cost-benefit assessment</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[rgb(192,192,192)] text-[rgb(17,17,19)] rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="text-white font-semibold">Implementation Plan</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Step-by-step integration roadmap</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Contact Form */}
          <Card className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(38,40,42)] border-2 border-[#DAFF01] rounded-3xl p-8">
            <CardHeader className="p-0 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#DAFF01]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#DAFF01]/50">
                  <Rocket size={32} className="text-[#DAFF01]" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Request Your Demo
                </CardTitle>
                <p className="text-[rgb(218,218,218)]">
                  See our platform in action with your data
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Work Email *"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Company Name *"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      required
                      className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Monthly Call Volume (e.g., 50,000)"
                    value={formData.callVolume}
                    onChange={(e) => handleInputChange('callVolume', e.target.value)}
                    className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl"
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Tell us about your current customer support challenges..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold py-4 rounded-xl transform hover:scale-105 transition-all duration-200 font-rajdhani"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[rgb(17,17,19)] border-t-transparent rounded-full animate-spin"></div>
                      <span>Scheduling Demo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send size={20} />
                      <span>Schedule My Demo</span>
                      <ArrowRight size={20} />
                    </div>
                  )}
                </Button>

                <p className="text-[rgb(161,161,170)] text-xs text-center">
                  By submitting this form, you agree to our privacy policy. 
                  No spam, unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
              <div className="text-lg font-bold text-[#00FF41] font-rajdhani">24hrs</div>
              <div className="text-[rgb(161,161,170)] text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00DDFF] mb-1">99.9%</div>
              <div className="text-[rgb(161,161,170)] text-sm">Platform Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[rgb(192,192,192)] mb-1">SOC2</div>
              <div className="text-[rgb(161,161,170)] text-sm">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00FF41] mb-1 font-rajdhani">30-day</div>
              <div className="text-[rgb(161,161,170)] text-sm">Free Trial</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;