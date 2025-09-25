import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <div className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#00FF41]">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Please read these Terms of Service carefully before using SentraTech's AI-powered customer support platform.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-lg">
            <p className="text-sm text-gray-400 mb-0">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Agreement */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing and using SentraTech's website and services ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              These Terms apply to all visitors, users, and others who access or use our Service.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If you do not agree to all the terms and conditions of this agreement, then you may not access the Service or use any services.
            </p>
          </section>

          {/* Services Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">2. Description of Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SentraTech provides an AI-powered customer support platform that includes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>Omnichannel customer support automation with 70% automation rate</li>
              <li>Real-time business intelligence dashboards and analytics</li>
              <li>AI-powered sentiment analysis and customer insights</li>
              <li>Multi-language support and global coverage capabilities</li>
              <li>Enterprise-grade security and compliance features</li>
              <li>Integration capabilities with existing business systems</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">3. User Responsibilities and Conduct</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">3.1 Acceptable Use</h3>
            <p className="text-gray-300 leading-relaxed mb-4">You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>Violate any applicable federal, state, local, or international law or regulation</li>
              <li>Impersonate or attempt to impersonate SentraTech, its employees, or other users</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>Use the Service to transmit malicious code, viruses, or other harmful materials</li>
              <li>Attempt to gain unauthorized access to any part of the Service or systems</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">3.2 Account Security</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you create an account with us, you are responsible for maintaining the security of your account and password. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">4. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">4.1 Our Content</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of SentraTech 
              and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">4.2 Your Content</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              You retain ownership of any content you submit to our Service. By submitting content, you grant us a non-exclusive, 
              worldwide, royalty-free license to use, display, and distribute your content in connection with the Service.
            </p>
          </section>

          {/* Privacy and Data */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">5. Privacy and Data Protection</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
              to understand our practices regarding the collection and use of your information.
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>We collect and process data in accordance with applicable privacy laws</li>
              <li>We implement industry-standard security measures to protect your data</li>
              <li>You have rights regarding your personal data as outlined in our Privacy Policy</li>
              <li>We do not sell your personal information to third parties</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">6. Service Availability and Modifications</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">6.1 Service Uptime</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We strive to maintain 99.9% service uptime, but we do not guarantee uninterrupted access to the Service. 
              We may temporarily suspend the Service for maintenance, updates, or other operational reasons.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">6.2 Modifications</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We reserve the right to modify or discontinue the Service (or any part thereof) at any time with or without notice. 
              We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          {/* Pricing and Payment */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">7. Pricing and Payment Terms</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">7.1 Service Plans</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Starter Plan:</strong> $399/month - Basic features for small teams</li>
              <li><strong>Growth Plan:</strong> $1,299/month - Advanced features for growing businesses</li>
              <li><strong>Enterprise Plan:</strong> Custom pricing - Full platform capabilities</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">7.2 Payment Terms</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>Payment is due in advance on a monthly or annual basis</li>
              <li>Annual subscriptions receive a 20% discount</li>
              <li>30-day free trial available for new customers</li>
              <li>Refunds are subject to our refund policy</li>
            </ul>
          </section>

          {/* Limitations of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">8. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">8.1 Service Disclaimers</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, whether express or implied, 
              including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">8.2 Limitation of Liability</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              In no event shall SentraTech, its directors, employees, partners, agents, suppliers, or affiliates be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">9. Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to defend, indemnify, and hold harmless SentraTech and its licensee and licensors, and their employees, 
              contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, 
              liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">10. Termination</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
              under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If you wish to terminate your account, you may simply discontinue using the Service or contact our support team.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">11. Governing Law and Jurisdiction</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which SentraTech operates, 
              without regard to its conflict of law provisions. Any disputes arising under these Terms will be subject to 
              the exclusive jurisdiction of the courts in that jurisdiction.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">12. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
              we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material 
              change will be determined at our sole discretion.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">13. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-lg p-6">
              <ul className="text-gray-300 space-y-2">
                <li><strong>Email:</strong> <span className="text-[#00FF41]">legal@sentratech.com</span></li>
                <li><strong>Support:</strong> <span className="text-[#00FF41]">support@sentratech.com</span></li>
                <li><strong>Website:</strong> <span className="text-[#00FF41]">sentratech.com</span></li>
                <li><strong>Address:</strong> SentraTech Ltd., Legal Department</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;