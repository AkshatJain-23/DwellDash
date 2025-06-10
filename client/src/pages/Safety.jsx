import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Shield, AlertTriangle, Phone, Mail, Eye, Lock, 
  UserCheck, CameraOff, Bell, MapPin, Clock, 
  CheckCircle, XCircle, Info, ArrowRight, Home
} from 'lucide-react'

const Safety = () => {
  const safetyTips = [
    {
      category: "Property Verification",
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
      tips: [
        "Always verify property photos match reality during physical visits",
        "Check if the property has proper legal documentation",
        "Ensure the property owner's identity is verified",
        "Look for DwellDash verification badge on listings",
        "Ask for previous tenant references if possible"
      ]
    },
    {
      category: "Physical Safety",
      icon: Shield,
      color: "bg-blue-100 text-blue-600",
      tips: [
        "Check for 24/7 security guards and CCTV surveillance",
        "Ensure proper fire safety equipment is available",
        "Verify emergency exits are clearly marked and accessible",
        "Look for well-lit common areas and entrance",
        "Check if the neighborhood is safe, especially for late hours"
      ]
    },
    {
      category: "Online Safety",
      icon: Lock,
      color: "bg-purple-100 text-purple-600",
      tips: [
        "Never share personal documents over unencrypted channels",
        "Use DwellDash's secure messaging system for communication",
        "Don't share bank account details until final booking",
        "Be cautious of deals that seem too good to be true",
        "Report suspicious profiles or listings immediately"
      ]
    },
    {
      category: "Financial Safety",
      icon: CameraOff,
      color: "bg-orange-100 text-orange-600",
      tips: [
        "Always get receipts for all payments made",
        "Don't pay large sums without visiting the property",
        "Use secure payment methods with transaction records",
        "Read and understand the rental agreement completely",
        "Keep records of all communications and agreements"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Safety Guidelines
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Your safety is our priority. Follow these comprehensive guidelines to ensure a secure and pleasant PG experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Safety Tips */}
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
              Essential Safety Tips
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Follow these guidelines to protect yourself throughout your PG search and stay experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyTips.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border p-6"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-xl ${category.color} mr-4`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-app-text">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-app-muted">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-app-text mb-6">
              Emergency Support
            </h2>
            <p className="text-xl text-app-muted mb-8">
              If you face any safety concerns, contact us immediately. We're available 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+918426076800"
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency: +91 8426076800
              </a>
              <a
                href="mailto:dwelldash3@gmail.com"
                className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center justify-center"
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

export default Safety