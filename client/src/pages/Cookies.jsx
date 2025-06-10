import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Cookie, Settings, Eye, Shield, Info, CheckCircle } from 'lucide-react'

const Cookies = () => {
  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for basic website functionality and security",
      examples: ["Authentication", "Security", "Form submissions", "Shopping cart"],
      optional: false,
      icon: Shield,
      color: "bg-red-100 text-red-600"
    },
    {
      name: "Performance Cookies",
      description: "Help us understand how visitors interact with our website",
      examples: ["Page views", "Navigation patterns", "Error tracking", "Loading times"],
      optional: true,
      icon: Eye,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Functional Cookies",
      description: "Remember your preferences and personalize your experience",
      examples: ["Language preferences", "Location settings", "Saved searches", "Theme choices"],
      optional: true,
      icon: Settings,
      color: "bg-green-100 text-green-600"
    },
    {
      name: "Marketing Cookies",
      description: "Used to deliver relevant advertisements and measure campaign effectiveness",
      examples: ["Ad targeting", "Campaign tracking", "Social media integration", "Retargeting"],
      optional: true,
      icon: Info,
      color: "bg-purple-100 text-purple-600"
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
            <Cookie className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Learn how DwellDash uses cookies and similar technologies to improve your browsing experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cookie Types */}
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
              Types of Cookies We Use
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              We use different types of cookies to provide and improve our services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${cookie.color} mr-4`}>
                      <cookie.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-app-text">{cookie.name}</h3>
                  </div>
                  {!cookie.optional && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                      Required
                    </span>
                  )}
                  {cookie.optional && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                
                <p className="text-app-muted mb-4">{cookie.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-app-text">Examples:</h4>
                  <ul className="space-y-1">
                    {cookie.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center text-sm text-app-muted">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Settings className="w-16 h-16 text-app-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-app-text mb-6">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-xl text-app-muted mb-8">
              You have control over how we use cookies on your device.
            </p>
            
            <div className="bg-white rounded-xl shadow-lg border border-app-border p-8 text-left">
              <h3 className="text-xl font-bold text-app-text mb-6">How to Control Cookies:</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-app-text mb-2">Browser Settings</h4>
                  <p className="text-app-muted">
                    Most browsers allow you to control cookies through their settings. You can usually find these options in the 'Privacy' or 'Security' section of your browser preferences.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-app-text mb-2">Cookie Banner</h4>
                  <p className="text-app-muted">
                    When you first visit our website, you'll see a cookie banner where you can accept or decline optional cookies. You can change these preferences at any time.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-app-text mb-2">Third-Party Cookies</h4>
                  <p className="text-app-muted">
                    Some cookies are set by third-party services we use. You can opt out of these through the respective service providers or through browser settings.
                  </p>
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
              Questions About Our Cookie Policy?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Contact us if you have any questions about how we use cookies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-app-primary px-8 py-4 rounded-xl font-bold hover:bg-app-accent transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/privacy"
                className="border-2 border-white text-white hover:bg-white hover:text-app-primary px-8 py-4 rounded-xl font-bold transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Cookies 