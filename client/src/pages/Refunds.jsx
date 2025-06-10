import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Phone, Mail } from 'lucide-react'

const Refunds = () => {
  const refundScenarios = [
    {
      scenario: "Property Not as Described",
      eligible: true,
      timeframe: "Within 24 hours of visit",
      refundAmount: "100% refund",
      description: "If the property significantly differs from the listing or photos",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      scenario: "Safety Concerns",
      eligible: true,
      timeframe: "Immediately",
      refundAmount: "100% refund",
      description: "If you discover safety issues or feel unsafe at the property",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      scenario: "Owner Cancellation",
      eligible: true,
      timeframe: "Automatic",
      refundAmount: "100% refund + ₹500 compensation",
      description: "If the property owner cancels your confirmed booking",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      scenario: "Change of Plans (Before Move-in)",
      eligible: true,
      timeframe: "48+ hours before move-in",
      refundAmount: "50% refund",
      description: "If you need to cancel due to personal reasons before moving in",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      scenario: "Change of Plans (After Move-in)",
      eligible: false,
      timeframe: "N/A",
      refundAmount: "No refund",
      description: "Cancellation after moving in due to personal reasons",
      icon: XCircle,
      color: "bg-red-100 text-red-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-app-secondary to-app-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <CreditCard className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Refund Policy
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Transparent refund terms designed to protect both tenants and property owners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 bg-app-accent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-app-text mb-6">Important Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-app-border">
                <Clock className="w-8 h-8 text-app-primary mx-auto mb-3" />
                <h3 className="font-bold text-app-text mb-2">Processing Time</h3>
                <p className="text-app-muted text-sm">Refunds processed within 5-7 business days</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-app-border">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-app-text mb-2">Fair Policy</h3>
                <p className="text-app-muted text-sm">Designed to be fair to both tenants and owners</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-app-border">
                <Phone className="w-8 h-8 text-app-primary mx-auto mb-3" />
                <h3 className="font-bold text-app-text mb-2">24/7 Support</h3>
                <p className="text-app-muted text-sm">Our team is always here to help with disputes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Refund Scenarios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-6">
              Refund Scenarios
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Understanding when you're eligible for refunds and how much you can expect to receive.
            </p>
          </motion.div>

          <div className="space-y-6">
            {refundScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.scenario}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border p-6"
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-xl ${scenario.color} mr-6 flex-shrink-0`}>
                    <scenario.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-app-text">{scenario.scenario}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        scenario.eligible 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {scenario.eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                    <p className="text-app-muted mb-4">{scenario.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-app-text">Timeframe:</span>
                        <p className="text-app-muted">{scenario.timeframe}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-app-text">Refund Amount:</span>
                        <p className="text-app-muted">{scenario.refundAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-app-text mb-8">How to Request a Refund</h2>
            
            <div className="bg-white rounded-xl shadow-lg border border-app-border p-8">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-app-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-app-text mb-2">Contact Support</h3>
                    <p className="text-app-muted">Reach out to our support team via phone (+91 8426076800) or email (dwelldash3@gmail.com) with your booking details and reason for refund.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-app-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-app-text mb-2">Provide Documentation</h3>
                    <p className="text-app-muted">Submit any relevant photos, communications, or documentation that supports your refund request.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-app-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-app-text mb-2">Review Process</h3>
                    <p className="text-app-muted">Our team will review your case within 24 hours and determine eligibility based on our policy.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-app-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-app-text mb-2">Refund Processing</h3>
                    <p className="text-app-muted">If approved, your refund will be processed to the original payment method within 5-7 business days.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Need Help with a Refund?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Our support team is here to help you with any refund-related questions or requests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+918426076800"
                className="bg-white text-app-primary px-8 py-4 rounded-xl font-bold hover:bg-app-accent transition-colors inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call +91 8426076800
              </a>
              <a
                href="mailto:dwelldash3@gmail.com"
                className="border-2 border-white text-white hover:bg-white hover:text-app-primary px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Refunds 