import { motion } from 'framer-motion'
import { Calendar, Shield, AlertCircle, CreditCard, Clock, RefreshCcw } from 'lucide-react'
import DwellDashLogo from '../components/DwellDashLogo'

const Refund = () => {
  const sections = [
    {
      title: "1. Refund Policy Overview",
      content: `DwellDash is committed to providing transparent and fair refund policies for all bookings made through our platform. This policy outlines the terms and conditions under which refunds may be issued for PG accommodation bookings.`
    },
    {
      title: "2. Booking Cancellation Timeline",
      content: `Our refund eligibility is based on the timing of your cancellation:
      • 7+ days before move-in: Full refund (100% of amount paid)
      • 3-7 days before move-in: Partial refund (50% of amount paid)
      • Less than 3 days before move-in: No refund (0% of amount paid)
      • After move-in: No refund, subject to monthly notice period`
    },
    {
      title: "3. Security Deposit Refund",
      content: `Security deposits are fully refundable upon checkout, subject to:
      • Property inspection by the owner/manager
      • Deduction of any damages or missing items
      • Proper notice period given as per agreement
      • Return of all keys, access cards, and property items
      • Settlement of any outstanding dues (electricity, maintenance, etc.)`
    },
    {
      title: "4. Emergency Circumstances",
      content: `In case of genuine emergencies or unforeseen circumstances, exceptions may be considered:
      • Medical emergencies (with valid documentation)
      • Job loss or transfer (with official documentation)
      • Family emergencies (case-by-case basis)
      • Force majeure events (natural disasters, government restrictions)
      
      All emergency refund requests must be submitted with supporting documentation within 48 hours of the incident.`
    },
    {
      title: "5. Property-Related Issues",
      content: `Refunds may be issued if the property doesn't match the listing:
      • Misrepresented amenities or facilities
      • Safety or hygiene concerns not disclosed
      • Property unavailable despite confirmed booking
      • Significant differences from photos/description
      
      Such issues must be reported within 24 hours of check-in for refund consideration.`
    },
    {
      title: "6. Processing Fees and Charges",
      content: `Refund amounts may be subject to:
      • Payment gateway charges (2-3% of transaction amount)
      • Platform convenience fees (non-refundable)
      • Administrative processing fees for cancellations
      • Bank transfer charges for refund processing
      
      The exact deduction will be communicated at the time of refund processing.`
    },
    {
      title: "7. Refund Processing Timeline",
      content: `Once approved, refunds will be processed as follows:
      • Credit/Debit Card: 5-7 business days
      • Net Banking: 3-5 business days
      • UPI/Digital Wallets: 1-3 business days
      • Bank Transfer: 7-10 business days
      
      Processing times may vary depending on your bank or payment provider.`
    },
    {
      title: "8. Refund Request Process",
      content: `To request a refund:
      1. Login to your DwellDash account
      2. Go to 'My Bookings' section
      3. Select the booking for cancellation
      4. Fill out the cancellation form with reason
      5. Upload any supporting documents if applicable
      6. Submit the request for review
      
      You will receive email confirmation and updates on your request status.`
    },
    {
      title: "9. Non-Refundable Items",
      content: `The following are non-refundable under any circumstances:
      • Platform convenience fees
      • Third-party service charges
      • Promotional discount amounts
      • Booking confirmation fees
      • Late payment charges or penalties`
    },
    {
      title: "10. Monthly Rental Refunds",
      content: `For monthly PG accommodations:
      • Minimum 30-day notice required for move-out
      • Pro-rated refunds not available for partial months
      • Advance rent paid is adjusted against notice period
      • Security deposit refund as per Section 3
      • No refund for the month of giving notice`
    },
    {
      title: "11. Dispute Resolution",
      content: `If you disagree with a refund decision:
      • Submit an appeal within 15 days of the decision
      • Provide additional documentation if available
      • Request for escalation to senior management
      • All disputes will be resolved within 30 business days
      • Final decisions will be communicated via email`
    },
    {
      title: "12. Owner Cancellation Policy",
      content: `If a property owner cancels your confirmed booking:
      • Full refund of all amounts paid (100%)
      • Additional compensation for inconvenience caused
      • Priority assistance in finding alternative accommodation
      • Expedited refund processing (within 48 hours)
      • No deduction of any fees or charges`
    },
    {
      title: "13. Policy Updates",
      content: `DwellDash reserves the right to update this refund policy. Changes will be:
      • Communicated via email to all registered users
      • Posted on the website with effective date
      • Applied to new bookings after the effective date
      • Not applied retrospectively to existing bookings`
    },
    {
      title: "14. Contact for Refund Queries",
      content: `For refund-related queries or assistance:
      • Email: dwelldash3@gmail.com
      • Phone: +91 84260 76800
      • Support Hours: Monday-Friday, 9 AM - 7 PM
      • Average response time: 24-48 hours
      • Refund status can be tracked through your account dashboard`
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <RefreshCcw className="w-12 h-12 text-green-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Refund Policy
              </h1>
            </div>
            <p className="text-xl text-gray-700 mb-6">
              Transparent and fair refund terms for all DwellDash bookings and services.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Effective Date: October 15, 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Version 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex">
                <Shield className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Guarantee</h3>
                  <p className="text-gray-700">
                    We stand behind our refund policy with transparency and fairness. 
                    All eligible refunds are processed within the stated timelines. 
                    For urgent refund queries, contact us at dwelldash3@gmail.com or +91 84260 76800.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Refund Guide */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Quick Refund Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">7+</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Days Before</h3>
              <p className="text-gray-600 text-sm">Full Refund (100%)</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 font-bold text-xl">3-7</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Days Before</h3>
              <p className="text-gray-600 text-sm">Partial Refund (50%)</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">&lt;3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Days Before</h3>
              <p className="text-gray-600 text-sm">No Refund (0%)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with a Refund?</h2>
          <p className="text-lg mb-6">
            Our refund support team is ready to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:dwelldash3@gmail.com"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Email Refund Support
            </a>
            <a
              href="tel:+918426076800"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Call +91 84260 76800
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Refund 