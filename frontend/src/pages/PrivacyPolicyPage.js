import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <div className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#00FF41]">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your privacy is important to us. This policy outlines how SentraTech collects, uses, and protects your information.
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

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Welcome to SentraTech ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              <span className="text-[#00FF41]"> sentratech.com</span> and use our AI-powered customer support platform.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
              please do not access or use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Demo Requests:</strong> Name, email address, company name, phone number, and message</li>
              <li><strong>Newsletter Subscriptions:</strong> Email address</li>
              <li><strong>Customer Support:</strong> Any information you provide when contacting our support team</li>
              <li><strong>ROI Calculator Usage:</strong> Business metrics and calculation inputs (stored anonymously)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">2.2 Information Automatically Collected</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, and user interactions</li>
              <li><strong>Device Information:</strong> IP address (anonymized), browser type, operating system, and device identifiers</li>
              <li><strong>Cookies and Tracking:</strong> Analytics data for website optimization and user experience improvement</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process demo requests and schedule demonstrations</li>
              <li>To send newsletters and marketing communications (with your consent)</li>
              <li>To improve our website and user experience through analytics</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">4. Cookies and Tracking Technologies</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">4.1 Types of Cookies</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for website functionality (always active)</li>
              <li><strong>Analytics Cookies:</strong> Google Analytics for website performance analysis (optional)</li>
              <li><strong>Marketing Cookies:</strong> For personalized content and advertising (optional)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">4.2 Your Cookie Choices</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              You can manage your cookie preferences through our cookie banner. You may:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>Accept all cookies for the full website experience</li>
              <li>Choose which types of cookies to allow</li>
              <li>Disable non-essential cookies while maintaining core functionality</li>
              <li>Change your preferences at any time by clearing your browser data</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">5. Data Security</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Encryption:</strong> All data transmission is secured with SSL/TLS encryption</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication protocols</li>
              <li><strong>Data Minimization:</strong> We collect only the information necessary for our services</li>
              <li><strong>Regular Audits:</strong> Security practices are regularly reviewed and updated</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">6. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Google Analytics:</strong> Website usage analytics (anonymized data)</li>
              <li><strong>Supabase:</strong> Database hosting and management</li>
              <li><strong>SpaceMail:</strong> Email delivery service</li>
              <li><strong>Emergent:</strong> Platform hosting and infrastructure</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">7. Your Privacy Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Consent Withdrawal:</strong> Withdraw consent for optional data processing</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              To exercise these rights, please contact us at{' '}
              <span className="text-[#00FF41]">privacy@sentratech.com</span>
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">8. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li><strong>Demo Requests:</strong> 2 years from submission date</li>
              <li><strong>Newsletter Subscriptions:</strong> Until you unsubscribe</li>
              <li><strong>Analytics Data:</strong> 26 months (Google Analytics default)</li>
              <li><strong>Customer Support:</strong> 3 years from last interaction</li>
            </ul>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">9. International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers 
              comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">10. Updates to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
              on this page with an updated "Last Updated" date. Your continued use of our services after such modifications constitutes 
              your acknowledgment and acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#00FF41]">11. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-lg p-6">
              <ul className="text-gray-300 space-y-2">
                <li><strong>Email:</strong> <span className="text-[#00FF41]">privacy@sentratech.com</span></li>
                <li><strong>Website:</strong> <span className="text-[#00FF41]">sentratech.com</span></li>
                <li><strong>Address:</strong> SentraTech Ltd., Data Protection Officer</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;