import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="Terms of Service | SentraTech"
        description="Terms and conditions for using SentraTech's AI-powered customer support platform."
        keywords="terms of service, legal, SaaS, AI customer support, terms and conditions"
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
          
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-[rgb(161,161,170)] text-lg">
            Last updated: December 27, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-[rgb(218,218,218)] leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using SentraTech's platform, services, or website (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
              </p>
              <p className="mb-4">
                These Terms apply to all visitors, users, customers, and others who access or use the Service. SentraTech reserves the right to update these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="mb-4">
                SentraTech provides an AI-powered customer support platform that automates customer interactions, routes inquiries intelligently, and provides analytics and insights to improve customer service operations. The Service includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>AI-powered chatbots and automated response systems</li>
                <li>Intelligent ticket routing and prioritization</li>
                <li>Customer interaction analytics and reporting</li>
                <li>Integration capabilities with third-party systems</li>
                <li>Multi-channel support (chat, email, social media)</li>
                <li>Performance monitoring and optimization tools</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts and Registration</h2>
              <p className="mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide accurate, complete, and up-to-date information during registration</li>
                <li>Maintain the security of your password and account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
              </ul>
              <p className="mb-4">
                SentraTech reserves the right to suspend or terminate accounts that violate these Terms or engage in prohibited activities.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription Plans and Payment Terms</h2>
              <p className="mb-4">
                SentraTech offers various subscription plans with different features and usage limits. By subscribing to a paid plan, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Pay all fees associated with your chosen subscription plan</li>
                <li>Automatic renewal unless cancelled before the renewal date</li>
                <li>Payment through accepted methods (credit card, bank transfer, etc.)</li>
                <li>Compliance with usage limits specified in your plan</li>
              </ul>
              <p className="mb-4">
                <strong>Refund Policy:</strong> Fees are non-refundable except as required by law or as specified in your subscription agreement. You may cancel your subscription at any time through your account settings or by contacting our support team.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property Rights</h2>
              <p className="mb-4">
                The Service and its original content, features, and functionality are owned by SentraTech and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="mb-4">
                You are granted a limited, non-exclusive, non-transferable license to use the Service for your business purposes in accordance with these Terms. You may not:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Copy, modify, distribute, sell, or lease any part of the Service</li>
                <li>Reverse engineer or attempt to extract the source code</li>
                <li>Use the Service to develop competing products or services</li>
                <li>Remove or alter any proprietary notices or labels</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. User Data and Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <a href="/privacy-policy" className="text-[#00FF41] hover:text-[#00DD38] underline">Privacy Policy</a>, which is incorporated into these Terms by reference.
              </p>
              <p className="mb-4">
                You retain ownership of all data you provide to the Service ("Customer Data"). You grant SentraTech a license to use Customer Data solely to provide the Service and improve our AI models, subject to the privacy commitments in our Privacy Policy.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. AI and Automated Decision-Making</h2>
              <p className="mb-4">
                Our Service uses artificial intelligence and automated decision-making to route customer inquiries, generate responses, and provide insights. You acknowledge that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>AI-generated responses may not always be accurate or appropriate</li>
                <li>You have the right to human review of automated decisions upon request</li>
                <li>You can opt out of automated decision-making for specific use cases</li>
                <li>We provide transparency about our AI logic and decision criteria</li>
                <li>You remain responsible for final customer interactions and decisions</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Prohibited Use</h2>
              <p className="mb-4">You may not use the Service:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Service Availability and Support</h2>
              <p className="mb-4">
                SentraTech strives to maintain 99.9% uptime but does not guarantee uninterrupted access to the Service. We may temporarily suspend the Service for maintenance, updates, or other operational requirements.
              </p>
              <p className="mb-4">
                Support is provided according to your subscription plan. Enterprise customers receive priority support with guaranteed response times as specified in their service level agreement.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
              <p className="mb-4">
                TO THE FULLEST EXTENT PERMITTED BY LAW, SENTRATECH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
              <p className="mb-4">
                IN NO EVENT SHALL SENTRATECH'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID TO SENTRATECH IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Indemnification</h2>
              <p className="mb-4">
                You agree to defend, indemnify, and hold harmless SentraTech and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including intellectual property, privacy, or publicity rights</li>
                <li>Any claim that your Customer Data caused damage to a third party</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Termination</h2>
              <p className="mb-4">
                Either party may terminate this agreement at any time. Upon termination:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your right to use the Service will cease immediately</li>
                <li>You will receive access to export your Customer Data for 30 days</li>
                <li>SentraTech may delete your data after the export period</li>
                <li>Outstanding fees remain due and payable</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law and Dispute Resolution</h2>
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in London, UK, except where prohibited by law.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Changes to Terms</h2>
              <p className="mb-4">
                SentraTech reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:legal@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">legal@sentratech.net</a></li>
                <li><strong>Phone:</strong> <a href="tel:+447424293951" className="text-[#00FF41] hover:text-[#00DD38]">+44 7424 293 951</a></li>
                <li><strong>Address:</strong> SentraTech Ltd, London, United Kingdom</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;