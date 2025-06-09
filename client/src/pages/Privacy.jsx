import { motion } from 'framer-motion'
import { Calendar, Shield, Eye, Lock, Database, UserCheck, FileText, Clock, AlertCircle, Trash2 } from 'lucide-react'
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
              <section className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Last updated: October 15, 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Version 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
              <section className="py-8 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-white rounded-lg p-6 border-l-4 border-blue-600"
            >
              <div className="flex">
                                  <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Overview</h3>
                  <p className="text-gray-700">
                    We collect minimal data necessary to provide our PG accommodation services, 
                    never sell your information to third parties, and you have full control over your data.
                    Contact us at privacy@dwelldash.com for any privacy-related queries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
              <section className="py-12 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-700">Quick overview of your data protection rights with DwellDash</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Data Protection",
                description: "Your data is encrypted and stored securely"
              },
              {
                icon: Lock,
                title: "Access Control",
                description: "You control who can see your information"
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "Clear information about data usage"
              },
              {
                icon: Trash2,
                title: "Right to Delete",
                description: "Request deletion of your data anytime"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center"
              >
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start">
                                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                                          <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line ml-14">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
              <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
          <p className="text-lg mb-6">
            Our privacy team is here to help you understand how we protect your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@dwelldash.com"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Email Privacy Team
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Privacy 