import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="Privacy Policy | SentraTech"
        description="Learn how SentraTech protects your privacy and handles your personal data in compliance with GDPR and CCPA."
        keywords="privacy policy, GDPR, CCPA, data protection, personal information, AI privacy"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#00FF41] hover:text-[#00DD38] transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-[rgb(161,161,170)] text-lg">
            Last updated: December 27, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-[rgb(218,218,218)] leading-relaxed">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <p className="mb-4">
                SentraTech Ltd ("SentraTech," "we," "us," or "our") is committed to protecting your privacy and ensuring transparency in how we collect, use, and protect your personal information. This Privacy Policy explains our practices regarding personal data when you use our AI-powered customer support platform and website (collectively, the "Service").
              </p>
              <p className="mb-4">
                This Privacy Policy complies with the European Union's General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable data protection laws. By using our Service, you agree to the collection and use of information as described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">1.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, company name, phone number, job title</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by third-party payment processors)</li>
                <li><strong>Customer Support Data:</strong> Messages, tickets, chat logs, and other communications with our support team</li>
                <li><strong>Platform Usage Data:</strong> Customer service interactions, chatbot conversations, ticket content managed through our platform</li>
                <li><strong>Communication Preferences:</strong> Marketing preferences, newsletter subscriptions, notification settings</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">1.2 Information We Collect Automatically</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Technical Information:</strong> IP address, browser type, device information, operating system, referring URLs</li>
                <li><strong>Usage Analytics:</strong> Pages viewed, features used, time spent on platform, user interactions and navigation patterns</li>
                <li><strong>Performance Metrics:</strong> Platform response times, error rates, feature adoption metrics</li>
                <li><strong>Location Data:</strong> General location information based on IP address (country/region level)</li>
                <li><strong>Cookies and Tracking:</strong> See our Cookie Policy for detailed information about cookies and tracking technologies</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">1.3 Information from Third Parties</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Integration Data:</strong> Information from platforms you connect to our Service (CRM, helpdesk, etc.)</li>
                <li><strong>Business Information:</strong> Publicly available business information to enhance our Service</li>
                <li><strong>Analytics Providers:</strong> Aggregated usage statistics and performance metrics from third-party analytics services</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">2.1 Service Provision and Performance</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide, operate, and maintain our AI-powered customer support platform</li>
                <li>Process customer support requests and route them intelligently</li>
                <li>Generate automated responses and provide AI-driven insights</li>
                <li>Enable integrations with your existing business systems</li>
                <li>Provide analytics, reporting, and business intelligence features</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">2.2 AI and Machine Learning</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Train and improve our AI models to provide better automated responses</li>
                <li>Analyze customer interactions to enhance sentiment analysis capabilities</li>
                <li>Develop predictive insights for customer support optimization</li>
                <li>Improve natural language processing and understanding</li>
                <li><strong>Important:</strong> Your data is used to improve AI models in aggregate and anonymized form only</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">2.3 Business Operations</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Process payments and manage billing</li>
                <li>Communicate with you about your account, updates, and important notices</li>
                <li>Provide customer support and technical assistance</li>
                <li>Conduct research and development to improve our Service</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">2.4 Marketing and Communications (With Your Consent)</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Send you marketing materials about our products and services</li>
                <li>Provide personalized content and recommendations</li>
                <li>Invite you to events, webinars, and product demonstrations</li>
                <li>Conduct surveys to improve our Service</li>
                <li><strong>Note:</strong> You can opt out of marketing communications at any time</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Legal Basis for Processing (GDPR)</h2>
              <p className="mb-4">We process your personal data based on the following legal grounds:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you've subscribed to</li>
                <li><strong>Legitimate Interest:</strong> Improving our Service, fraud prevention, direct marketing to existing customers</li>
                <li><strong>Consent:</strong> Marketing communications, optional cookies, data analysis for AI improvement</li>
                <li><strong>Legal Obligation:</strong> Compliance with applicable laws, tax requirements, and regulatory obligations</li>
                <li><strong>Vital Interests:</strong> Protecting the safety and security of our users and Service</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. How We Share Your Information</h2>
              <p className="mb-4">
                <strong>We do not sell your personal information to third parties.</strong> We may share your information in the following limited circumstances:
              </p>

              <h3 className="text-xl font-medium text-white mb-3">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Cloud hosting providers (AWS, Google Cloud) for data storage and processing</li>
                <li>Payment processors for billing and subscription management</li>
                <li>Analytics providers for usage insights and performance monitoring</li>
                <li>Email service providers for transactional and marketing communications</li>
                <li>Customer support tools for ticket management and communication</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">4.2 Business Transfers</h3>
              <p className="mb-4">
                In the event of a merger, acquisition, or sale of business assets, your information may be transferred as part of the transaction. We will notify you of any such change and provide options regarding your data.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">4.3 Legal Requirements</h3>
              <p className="mb-4">
                We may disclose your information if required to do so by law or in response to valid legal processes, such as court orders, subpoenas, or government investigations.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">4.4 Protection of Rights</h3>
              <p className="mb-4">
                We may share information to protect our rights, property, safety, or the rights and safety of our users or the public, including fraud prevention and security investigations.
              </p>
            </section>

            {/* AI and Automated Decision Making */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. AI and Automated Decision-Making</h2>
              <p className="mb-4">
                Our Service uses artificial intelligence and automated decision-making systems to provide enhanced customer support capabilities. Here's how we handle this transparently:
              </p>

              <h3 className="text-xl font-medium text-white mb-3">5.1 Automated Processing Activities</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Ticket Routing:</strong> AI algorithms automatically route customer inquiries to appropriate departments or agents</li>
                <li><strong>Response Generation:</strong> AI suggests or generates automated responses to common customer questions</li>
                <li><strong>Sentiment Analysis:</strong> Automated analysis of customer emotions and satisfaction levels</li>
                <li><strong>Prioritization:</strong> AI determines urgency and priority of customer support requests</li>
                <li><strong>Performance Analytics:</strong> Automated analysis of support team performance and customer satisfaction metrics</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">5.2 Your Rights Regarding Automated Decisions</h3>
              <p className="mb-4">Under GDPR Article 22, you have specific rights regarding automated decision-making:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Right to Human Review:</strong> You can request human intervention in any automated decision that significantly affects you</li>
                <li><strong>Right to Explanation:</strong> You can ask for information about the logic, criteria, and data used in automated decisions</li>
                <li><strong>Right to Challenge:</strong> You can contest automated decisions and request manual review</li>
                <li><strong>Opt-out Options:</strong> You can opt out of certain automated processing where technically feasible</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">5.3 Safeguards and Human Oversight</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Regular testing and monitoring of AI systems for accuracy and bias</li>
                <li>Human oversight and review of significant automated decisions</li>
                <li>Ability to escalate to human agents when automated systems are insufficient</li>
                <li>Continuous improvement of AI models based on feedback and performance</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
              <p className="mb-4">
                We implement comprehensive security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Encryption:</strong> Data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Multi-factor authentication and role-based access to personal data</li>
                <li><strong>Infrastructure Security:</strong> Cloud infrastructure with enterprise-grade security controls</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                <li><strong>Employee Training:</strong> Regular privacy and security training for all staff</li>
                <li><strong>Incident Response:</strong> Established procedures for security incident management</li>
                <li><strong>Data Minimization:</strong> We collect and retain only the data necessary for our purposes</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p className="mb-4">We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for 3 years after account closure</li>
                <li><strong>Customer Support Data:</strong> Retained for 7 years for quality assurance and legal compliance</li>
                <li><strong>Financial Records:</strong> Retained for 7 years as required by tax and accounting regulations</li>
                <li><strong>Marketing Data:</strong> Retained until you opt out or for 3 years of inactivity</li>
                <li><strong>Technical Logs:</strong> Retained for 12 months for security and performance monitoring</li>
                <li><strong>AI Training Data:</strong> Anonymized data may be retained indefinitely for AI model improvement</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Your Privacy Rights</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">8.1 GDPR Rights (EU Users)</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Right of Access:</strong> Request information about how we process your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data in certain circumstances</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we process your personal data</li>
                <li><strong>Right to Data Portability:</strong> Receive your personal data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for processing at any time</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">8.2 CCPA Rights (California Users)</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Right to Know:</strong> Information about what personal information we collect, use, disclose, and sell</li>
                <li><strong>Right to Delete:</strong> Request deletion of personal information we've collected</li>
                <li><strong>Right to Correct:</strong> Correct inaccurate personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of personal information (Note: We do not sell personal information)</li>
                <li><strong>Right to Non-Discrimination:</strong> Equal service and pricing regardless of privacy choices</li>
                <li><strong>Right to Limit Sensitive Information:</strong> Limit use of sensitive personal information</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">8.3 How to Exercise Your Rights</h3>
              <p className="mb-4">To exercise any of these rights, contact us:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:privacy@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">privacy@sentratech.net</a></li>
                <li><strong>Privacy Portal:</strong> Available in your account settings</li>
                <li><strong>Phone:</strong> <a href="tel:+447424293951" className="text-[#00FF41] hover:text-[#00DD38]">+44 7424 293 951</a></li>
              </ul>
              <p className="mb-4">
                We will respond to verified requests within 30 days (GDPR) or 45 days (CCPA). Identity verification may be required for security purposes.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <p className="mb-4">
                SentraTech is based in the United Kingdom. Your personal information may be transferred to and processed in countries outside your jurisdiction, including the United States and European Union, where our service providers operate.
              </p>
              <p className="mb-4">
                When we transfer personal data internationally, we ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>EU Standard Contractual Clauses (SCCs) for transfers outside the EEA</li>
                <li>Adequacy decisions by the European Commission where available</li>
                <li>Data Processing Agreements with appropriate security measures</li>
                <li>Regular assessment of third-country data protection standards</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p className="mb-4">
                Our Service is not designed for or directed at children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information promptly.
              </p>
              <p className="mb-4">
                If you believe we have collected information from a child under 16, please contact us immediately at <a href="mailto:privacy@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">privacy@sentratech.net</a>.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Post the updated Privacy Policy on our website with the effective date</li>
                <li>Notify you by email of material changes if you have provided your email address</li>
                <li>Provide prominent notice on our Service for significant changes</li>
                <li>Obtain your consent for changes that materially expand how we use your personal information</li>
              </ul>
              <p className="mb-4">
                Your continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
              <p className="mb-4">
                If you have questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-white mb-4">SentraTech Ltd - Data Protection Officer</h3>
                <ul className="list-none space-y-2">
                  <li><strong>Email:</strong> <a href="mailto:privacy@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">privacy@sentratech.net</a></li>
                  <li><strong>Phone:</strong> <a href="tel:+447424293951" className="text-[#00FF41] hover:text-[#00DD38]">+44 7424 293 951</a></li>
                  <li><strong>Address:</strong> SentraTech Ltd, London, United Kingdom</li>
                  <li><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours</li>
                </ul>
              </div>

              <p className="mb-4">
                <strong>For EU users:</strong> If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.
              </p>

              <p className="mb-4">
                <strong>For California users:</strong> You may also contact the California Attorney General's office regarding CCPA compliance.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;