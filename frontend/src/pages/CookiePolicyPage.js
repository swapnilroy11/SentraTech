import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const CookiePolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="Cookie Policy | SentraTech"
        description="Learn about how SentraTech uses cookies and tracking technologies to improve your experience with our AI-powered customer support platform."
        keywords="cookie policy, cookies, tracking, GDPR, privacy, web analytics"
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
          
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
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
                This Cookie Policy explains how SentraTech Ltd ("SentraTech," "we," "us," or "our") uses cookies and similar tracking technologies when you visit our website and use our AI-powered customer support platform (the "Service").
              </p>
              <p className="mb-4">
                This policy should be read together with our <a href="/privacy-policy" className="text-[#00FF41] hover:text-[#00DD38] underline">Privacy Policy</a>, which provides additional information about how we collect, use, and protect your personal information.
              </p>
            </section>

            {/* What Are Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used by website owners to make their websites work more efficiently and to provide information to the owners of the site.
              </p>
              <p className="mb-4">
                Cookies can be "persistent" (they remain on your device until deleted or they expire) or "session" cookies (they are deleted when you close your browser). Cookies can also be "first-party" (set by the website you're visiting) or "third-party" (set by a different website).
              </p>
            </section>

            {/* How We Use Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">
                We use cookies for several purposes to enhance your experience with our Service:
              </p>

              <h3 className="text-xl font-medium text-white mb-3">2.1 Essential Cookies</h3>
              <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-lg p-4 mb-4">
                <p className="mb-2"><strong>Purpose:</strong> These cookies are strictly necessary for the operation of our Service.</p>
                <p className="mb-2"><strong>Legal Basis:</strong> Legitimate interest (essential for service functionality)</p>
                <p className="mb-2"><strong>Consent Required:</strong> No (essential cookies)</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Session management and user authentication</li>
                  <li>Security features and fraud prevention</li>
                  <li>Platform functionality and user interface preferences</li>
                  <li>Load balancing and performance optimization</li>
                  <li>Form submission and data validation</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-white mb-3">2.2 Performance and Analytics Cookies</h3>
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg p-4 mb-4">
                <p className="mb-2"><strong>Purpose:</strong> These cookies help us understand how visitors interact with our Service.</p>
                <p className="mb-2"><strong>Legal Basis:</strong> Consent</p>
                <p className="mb-2"><strong>Consent Required:</strong> Yes</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Google Analytics for website usage statistics</li>
                  <li>Performance monitoring and error tracking</li>
                  <li>Feature usage analytics and A/B testing</li>
                  <li>User journey analysis and conversion tracking</li>
                  <li>Platform performance metrics</li>
                </ul>
                <p className="mt-3 text-sm text-[rgb(161,161,170)]">
                  <strong>Data Retention:</strong> Analytics data is retained for 26 months, then automatically deleted.
                </p>
              </div>

              <h3 className="text-xl font-medium text-white mb-3">2.3 Functional Cookies</h3>
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg p-4 mb-4">
                <p className="mb-2"><strong>Purpose:</strong> These cookies enable enhanced functionality and personalization.</p>
                <p className="mb-2"><strong>Legal Basis:</strong> Consent or legitimate interest</p>
                <p className="mb-2"><strong>Consent Required:</strong> Yes (for non-essential functionality)</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Language and region preferences</li>
                  <li>User interface customization</li>
                  <li>Chat widget functionality and history</li>
                  <li>Form auto-completion and saved preferences</li>
                  <li>Accessibility settings</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-white mb-3">2.4 Marketing and Advertising Cookies</h3>
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg p-4 mb-4">
                <p className="mb-2"><strong>Purpose:</strong> These cookies are used to make advertising messages more relevant to you.</p>
                <p className="mb-2"><strong>Legal Basis:</strong> Consent</p>
                <p className="mb-2"><strong>Consent Required:</strong> Yes</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Retargeting and remarketing campaigns</li>
                  <li>Social media integration and sharing</li>
                  <li>Interest-based advertising</li>
                  <li>Campaign effectiveness measurement</li>
                  <li>Cross-platform user tracking (where consented)</li>
                </ul>
                <p className="mt-3 text-sm text-[rgb(161,161,170)]">
                  <strong>Note:</strong> We do not sell personal information to third parties for advertising purposes.
                </p>
              </div>
            </section>

            {/* Third Party Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Third-Party Cookies and Services</h2>
              <p className="mb-4">
                We work with trusted third-party service providers who may set cookies on our Service. These include:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[rgb(63,63,63)] mb-4">
                  <thead className="bg-[rgb(38,40,42)]">
                    <tr>
                      <th className="border border-[rgb(63,63,63)] p-3 text-left text-white">Service</th>
                      <th className="border border-[rgb(63,63,63)] p-3 text-left text-white">Purpose</th>
                      <th className="border border-[rgb(63,63,63)] p-3 text-left text-white">Type</th>
                      <th className="border border-[rgb(63,63,63)] p-3 text-left text-white">More Info</th>
                    </tr>
                  </thead>
                  <tbody className="text-[rgb(218,218,218)]">
                    <tr>
                      <td className="border border-[rgb(63,63,63)] p-3">Google Analytics</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Website analytics and performance</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Analytics</td>
                      <td className="border border-[rgb(63,63,63)] p-3">
                        <a href="https://policies.google.com/privacy" className="text-[#00FF41] hover:text-[#00DD38]">Privacy Policy</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[rgb(63,63,63)] p-3">Stripe</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Payment processing</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Essential</td>
                      <td className="border border-[rgb(63,63,63)] p-3">
                        <a href="https://stripe.com/privacy" className="text-[#00FF41] hover:text-[#00DD38]">Privacy Policy</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[rgb(63,63,63)] p-3">Intercom</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Customer support chat</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Functional</td>
                      <td className="border border-[rgb(63,63,63)] p-3">
                        <a href="https://www.intercom.com/legal/privacy" className="text-[#00FF41] hover:text-[#00DD38]">Privacy Policy</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[rgb(63,63,63)] p-3">HubSpot</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Marketing automation</td>
                      <td className="border border-[rgb(63,63,63)] p-3">Marketing</td>
                      <td className="border border-[rgb(63,63,63)] p-3">
                        <a href="https://legal.hubspot.com/privacy-policy" className="text-[#00FF41] hover:text-[#00DD38]">Privacy Policy</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Cookie Consent */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Cookie Consent and Your Choices</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">4.1 Consent Mechanism</h3>
              <p className="mb-4">
                When you first visit our website, we display a cookie consent banner that allows you to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Accept All Cookies:</strong> Consent to all cookie categories</li>
                <li><strong>Reject All:</strong> Only essential cookies will be used</li>
                <li><strong>Customize Preferences:</strong> Choose which types of cookies to allow</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">4.2 Managing Your Cookie Preferences</h3>
              <p className="mb-4">You can change your cookie preferences at any time by:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Clicking the "Cookie Preferences" link in our website footer</li>
                <li>Clearing your browser cookies (this will reset all preferences)</li>
                <li>Using your browser's privacy settings to block specific cookies</li>
                <li>Contacting us at <a href="mailto:privacy@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">privacy@sentratech.net</a></li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">4.3 Browser Cookie Controls</h3>
              <p className="mb-4">Most browsers allow you to control cookies through their settings:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
              
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200">
                  <strong>Important:</strong> Disabling essential cookies may affect the functionality of our Service, including the ability to log in, access account features, or complete transactions.
                </p>
              </div>
            </section>

            {/* AI and Automated Processing */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies and AI Processing</h2>
              <p className="mb-4">
                Some cookies collect data that may be used in our AI-powered features:
              </p>

              <h3 className="text-xl font-medium text-white mb-3">5.1 AI-Enhanced Features</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Personalized Recommendations:</strong> Usage patterns to suggest relevant features</li>
                <li><strong>Intelligent Routing:</strong> Historical data to improve customer support routing</li>
                <li><strong>Predictive Analytics:</strong> Aggregated usage data for performance insights</li>
                <li><strong>Behavioral Analysis:</strong> Anonymous patterns to improve user experience</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">5.2 Your Rights Regarding AI Processing</h3>
              <p className="mb-4">
                Under GDPR Article 22, you have rights regarding automated decision-making:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Right to know when automated processing affects you</li>
                <li>Right to request human intervention in automated decisions</li>
                <li>Right to challenge automated decisions</li>
                <li>Right to opt out of profiling and automated decision-making</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookie Data Security</h2>
              <p className="mb-4">
                We protect cookie data through various security measures:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Encryption:</strong> All cookies containing personal data are encrypted</li>
                <li><strong>Secure Transmission:</strong> Cookies are transmitted over HTTPS connections only</li>
                <li><strong>Access Controls:</strong> Limited access to cookie data based on business need</li>
                <li><strong>Regular Audits:</strong> Periodic review of cookie usage and data handling</li>
                <li><strong>Third-Party Monitoring:</strong> Regular assessment of third-party cookie compliance</li>
              </ul>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. International Data Transfers</h2>
              <p className="mb-4">
                Some of our third-party cookie providers may transfer data internationally. We ensure appropriate safeguards:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>EU Standard Contractual Clauses (SCCs) where applicable</li>
                <li>Adequacy decisions by data protection authorities</li>
                <li>Privacy Shield certification (where still valid)</li>
                <li>Regular assessment of third-country data protection standards</li>
              </ul>
            </section>

            {/* Updates and Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Updates to This Cookie Policy</h2>
              <p className="mb-4">
                We may update this Cookie Policy periodically to reflect:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Changes in our use of cookies or tracking technologies</li>
                <li>Updates to legal requirements or industry standards</li>
                <li>New features or services that require different cookies</li>
                <li>Changes to third-party services or providers</li>
              </ul>
              <p className="mb-4">
                We will notify you of material changes by updating the "Last updated" date and, where required by law, seeking fresh consent for new cookie types.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Cookie Policy or our use of cookies, please contact us:
              </p>
              
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-white mb-4">SentraTech - Privacy Team</h3>
                <ul className="list-none space-y-2">
                  <li><strong>Email:</strong> <a href="mailto:privacy@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">privacy@sentratech.net</a></li>
                  <li><strong>Subject Line:</strong> Cookie Policy Inquiry</li>
                  <li><strong>Phone:</strong> <a href="tel:+447424293951" className="text-[#00FF41] hover:text-[#00DD38]">+44 7424 293 951</a></li>
                  <li><strong>Address:</strong> SentraTech Ltd, London, United Kingdom</li>
                </ul>
              </div>

              <p className="mb-4">
                For EU users, you also have the right to lodge a complaint with your local data protection authority if you believe our cookie practices violate your privacy rights.
              </p>
            </section>

            {/* Additional Resources */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Additional Resources</h2>
              <p className="mb-4">
                For more information about cookies and online privacy:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><a href="https://www.allaboutcookies.org/" className="text-[#00FF41] hover:text-[#00DD38]">All About Cookies</a> - Comprehensive information about cookies</li>
                <li><a href="https://youronlinechoices.eu/" className="text-[#00FF41] hover:text-[#00DD38]">Your Online Choices</a> - EU digital advertising preferences</li>
                <li><a href="https://optout.networkadvertising.org/" className="text-[#00FF41] hover:text-[#00DD38]">NAI Opt-Out</a> - Network Advertising Initiative opt-out</li>
                <li><a href="/privacy-policy" className="text-[#00FF41] hover:text-[#00DD38]">SentraTech Privacy Policy</a> - Our comprehensive privacy practices</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;