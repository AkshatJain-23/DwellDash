import { motion } from 'framer-motion'
import { Calendar, Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react'
import DwellDashLogo from '../components/DwellDashLogo'

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: `We collect information you provide directly to us, such as when you create an account, list a property, or contact us. This includes:

Personal Information:
• Name, email address, phone number
• Profile pictures and identification documents
• Property details and photos
• Communication records and reviews

Automatically Collected Information:
• Device information and IP address
• Usage data and preferences
• Location information (with your consent)
• Cookies and similar tracking technologies`
    },
    {
      title: "2. How We Use Your Information",
      icon: Eye,
      content: `We use the information we collect to:

• Provide and maintain our services
• Process transactions and send confirmations
• Communicate with you about your account and our services
• Verify your identity and prevent fraud
• Improve and personalize your experience
• Send marketing communications (with your consent)
• Comply with legal obligations
• Resolve disputes and enforce our terms`
    },
    {
      title: "3. Information Sharing and Disclosure",
      icon: UserCheck,
      content: `We may share your information in the following circumstances:

With Other Users:
• Property details with potential tenants
• Contact information for bookings
• Reviews and ratings

With Service Providers:
• Payment processors
• Identity verification services
• Email and SMS providers
• Analytics and marketing services

For Legal Reasons:
• To comply with legal obligations
• To protect our rights and safety
• To investigate fraud or security issues`
    },
    {
      title: "4. Data Security",
      icon: Lock,
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• Encryption of sensitive data in transit and at rest
• Regular security assessments and updates
• Access controls and authentication requirements
• Secure data centers and infrastructure
• Employee training on data protection
• Incident response procedures

However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      title: "5. Your Rights and Choices",
      icon: Shield,
      content: `You have the following rights regarding your personal information:

Access and Portability:
• Request access to your personal data
• Request a copy of your data in a portable format

Correction and Updates:
• Update your account information at any time
• Request correction of inaccurate information

Deletion:
• Request deletion of your account and personal data
• Note: Some information may be retained for legal compliance

Marketing Communications:
• Opt-out of marketing emails at any time
• Manage notification preferences in your account settings`
    },
    {
      title: "6. Cookies and Tracking Technologies",
      icon: Eye,
      content: `We use cookies and similar technologies to:

• Maintain your login session
• Remember your preferences
• Analyze usage patterns
• Provide personalized content
• Improve our services

Types of Cookies:
• Essential cookies (necessary for site functionality)
• Analytics cookies (to understand usage patterns)
• Marketing cookies (for targeted advertising)

You can control cookies through your browser settings, but disabling certain cookies may affect site functionality.`
    },
    {
      title: "7. Third-Party Services",
      icon: Database,
      content: `Our platform integrates with third-party services that have their own privacy policies:

Payment Processors:
• We use secure payment gateways that comply with PCI DSS standards
• Payment information is processed directly by these providers

Map Services:
• Location data may be processed by mapping service providers
• Used to display property locations and directions

Social Media:
• Integration with social platforms for login and sharing
• Subject to respective platform privacy policies

We recommend reviewing the privacy policies of these third-party services.`
    },
    {
      title: "8. International Data Transfers",
      icon: Shield,
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers, including:

• Adequacy decisions by relevant authorities
• Standard contractual clauses
• Binding corporate rules
• Explicit consent when required

We take steps to ensure your data receives an adequate level of protection in all jurisdictions where it is processed.`
    },
    {
      title: "9. Data Retention",
      icon: FileText,
      content: `We retain your personal information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain business records

Retention Periods:
• Account information: Until account deletion plus 3 years
• Transaction records: 7 years for financial compliance
• Communication logs: 2 years for customer service
• Marketing data: Until withdrawal of consent

When we no longer need your information, we securely delete or anonymize it.`
    },
    {
      title: "10. Children's Privacy",
      icon: Shield,
      content: `DwellDash is not intended for use by children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can take appropriate action.`
    },
    {
      title: "11. Changes to This Privacy Policy",
      icon: FileText,
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of material changes by:

• Posting the updated policy on our website
• Sending email notifications to registered users
• Displaying prominent notices on our platform

Your continued use of our services after the effective date of the updated policy constitutes acceptance of the changes.`
    },
    {
      title: "12. Contact Information",
      icon: UserCheck,
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Email: privacy@dwelldash.com
Phone: +91 98765 43210
Address: Plot No. 123, Cyber City, Sector 39, Gurgaon, Haryana 122001

Data Protection Officer: dpo@dwelldash.com

We will respond to your inquiries within 30 days and work with you to resolve any privacy-related concerns.`
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-700 dark:text-accent-light mb-6">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-accent-light">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Last updated: January 15, 2024</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 bg-light-accent dark:bg-accent-dark transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Privacy at a Glance</h2>
            <p className="text-white opacity-90">Key principles that guide our data practices</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: "Secure by Design",
                description: "We use industry-standard encryption and security measures to protect your data."
              },
              {
                icon: UserCheck,
                title: "You're in Control",
                description: "Access, update, or delete your personal information at any time."
              },
              {
                icon: Shield,
                title: "Transparent Practices",
                description: "We clearly explain what data we collect and how we use it."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-accent-black rounded-lg p-6 text-center"
              >
                <item.icon className="w-12 h-12 text-light-secondary dark:text-accent-light mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-700 dark:text-accent-light">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
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
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-light-accent dark:bg-accent-light rounded-lg flex items-center justify-center mr-4 mt-1">
                    <section.icon className="w-5 h-5 text-light-secondary dark:text-accent-dark" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-700 dark:text-accent-light leading-relaxed whitespace-pre-line ml-14">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-light-secondary dark:bg-accent-dark transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Have Privacy Questions?
            </h3>
            <p className="text-white opacity-90 mb-6">
              Our privacy team is here to help. Contact us if you have any questions about how we handle your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-light-secondary dark:text-accent-dark px-6 py-3 rounded-lg font-semibold hover:bg-light-highlight dark:hover:bg-accent-light transition-colors"
              >
                Contact Privacy Team
              </a>
              <a
                href="/terms"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-light-secondary dark:hover:text-accent-dark transition-colors"
              >
                View Terms of Service
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Privacy 