import { motion } from 'framer-motion'
import { Calendar, Shield, AlertCircle, FileText } from 'lucide-react'
import DwellDashLogo from '../components/DwellDashLogo'

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using DwellDash ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: "2. Services Description",
      content: `DwellDash is an online platform that connects property owners with individuals seeking paying guest (PG) accommodations. We facilitate the discovery, listing, and booking of PG accommodations across India.`
    },
    {
      title: "3. User Registration and Accounts",
      content: `To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and all activities under your account.`
    },
    {
      title: "4. User Responsibilities",
      content: `As a user of DwellDash, you agree to:
      • Provide accurate and truthful information in all listings and communications
      • Comply with all applicable laws and regulations
      • Respect the rights and property of other users
      • Not use the Platform for any illegal or unauthorized purpose
      • Not interfere with or disrupt the Platform's functionality`
    },
    {
      title: "5. Property Listings",
      content: `Property owners are responsible for ensuring their listings are accurate, complete, and comply with all local laws and regulations. DwellDash reserves the right to remove listings that violate these terms or applicable laws. Property owners must have legal authority to rent the listed properties.`
    },
    {
      title: "6. Booking and Payments",
      content: `All bookings are subject to availability and confirmation by the property owner. Payment terms are established between users and property owners. DwellDash may facilitate payment processing but is not responsible for payment disputes between parties.`
    },
    {
      title: "7. Verification and Safety",
      content: `While DwellDash strives to verify property listings and user information, we cannot guarantee the accuracy of all information provided by users. Users are encouraged to verify information independently and exercise caution when meeting or transacting with other users.`
    },
    {
      title: "8. Prohibited Uses",
      content: `You may not use DwellDash to:
      • Post false, misleading, or fraudulent listings
      • Harass, threaten, or discriminate against other users
      • Violate any local, state, national, or international law
      • Transmit viruses or malicious code
      • Collect user information without consent
      • Use the Platform for commercial purposes outside of legitimate PG rentals`
    },
    {
      title: "9. Intellectual Property",
      content: `The Platform and its original content, features, and functionality are owned by DwellDash and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`
    },
    {
      title: "10. Privacy and Data Protection",
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, to understand our practices regarding the collection and use of your personal information.`
    },
    {
      title: "11. Disclaimers",
      content: `DwellDash provides the Platform "as is" without warranties of any kind. We do not warrant that the Platform will be error-free or uninterrupted. Users acknowledge that they use the Platform at their own risk.`
    },
    {
      title: "12. Limitation of Liability",
      content: `DwellDash shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Platform. Our total liability shall not exceed the amount paid by you to DwellDash in the 12 months preceding the claim.`
    },
    {
      title: "13. Indemnification",
      content: `You agree to indemnify and hold harmless DwellDash from any claims, damages, losses, costs, and expenses arising from your use of the Platform or violation of these terms.`
    },
    {
      title: "14. Termination",
      content: `DwellDash may terminate or suspend your account and access to the Platform immediately, without prior notice, for conduct that violates these terms or is harmful to other users or the Platform.`
    },
    {
      title: "15. Governing Law",
      content: `These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.`
    },
    {
      title: "16. Changes to Terms",
      content: `DwellDash reserves the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the Platform constitutes acceptance of the updated terms.`
    },
    {
      title: "17. Contact Information",
      content: `If you have any questions about these Terms and Conditions, please contact us at legal@dwelldash.com or through our contact page.`
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-accent-black transition-colors duration-300">
      {/* Header */}
      <section className="bg-light-primary dark:bg-primary-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <DwellDashLogo className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-700 dark:text-accent-light mb-6">
              Please read these terms carefully before using DwellDash
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-accent-light">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Last updated: January 15, 2024</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span>Version 1.2</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-light-accent dark:bg-accent-dark transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-accent-black rounded-lg p-6 border-l-4 border-light-secondary dark:border-accent-light"
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-light-secondary dark:text-accent-light mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Important Notice</h3>
                <p className="text-gray-700 dark:text-accent-light">
                  By using DwellDash, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. 
                  If you do not agree with any part of these terms, you must not use our platform.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white dark:bg-accent-black transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-light-highlight dark:bg-primary-900 rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-700 dark:text-accent-light leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-light-secondary dark:bg-accent-dark transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Questions About Our Terms?
            </h3>
            <p className="text-white opacity-90 mb-6">
              Our legal team is here to help. Contact us if you need clarification on any of these terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-light-secondary dark:text-accent-dark px-6 py-3 rounded-lg font-semibold hover:bg-light-highlight dark:hover:bg-accent-light transition-colors"
              >
                Contact Legal Team
              </a>
              <a
                href="/privacy"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-light-secondary dark:hover:text-accent-dark transition-colors"
              >
                View Privacy Policy
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Terms 