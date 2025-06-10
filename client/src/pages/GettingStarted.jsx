import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, Filter, Eye, Phone, Calendar, Key, 
  User, Shield, Star, MapPin, Heart, MessageCircle,
  CheckCircle, ArrowRight, Home, PlayCircle, BookOpen
} from 'lucide-react'

const GettingStarted = () => {
  const steps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up for free to access all features and save your favorite properties",
      icon: User,
      color: "bg-blue-100 text-blue-600",
      details: [
        "Click 'Register' in the top navigation",
        "Fill in your basic details (name, email, phone)",
        "Verify your email and phone number",
        "Complete your profile for better recommendations"
      ],
      tips: "Pro tip: Complete your profile to get personalized property recommendations!"
    },
    {
      step: 2,
      title: "Search for Properties",
      description: "Use our powerful search and filter tools to find PGs that match your needs",
      icon: Search,
      color: "bg-green-100 text-green-600",
      details: [
        "Enter your preferred city, area, or landmark",
        "Set your budget range using the price filter",
        "Select gender preference (Male/Female/Co-ed)",
        "Choose amenities that matter to you (WiFi, AC, Food, etc.)",
        "Filter by room type (Single, Double, Triple occupancy)"
      ],
      tips: "Use specific landmarks or metro stations for more accurate location-based results!"
    },
    {
      step: 3,
      title: "Browse & Compare",
      description: "View detailed property information, photos, and reviews to make informed decisions",
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
      details: [
        "Browse through property listings with high-quality photos",
        "Read detailed descriptions and amenity lists",
        "Check property ratings and user reviews",
        "Compare multiple properties side by side",
        "Save properties you like for future reference"
      ],
      tips: "Look for the 'Verified' badge - these properties have been personally inspected by our team!"
    },
    {
      step: 4,
      title: "Contact Property Owners",
      description: "Connect directly with property owners to ask questions and schedule visits",
      icon: Phone,
      color: "bg-orange-100 text-orange-600",
      details: [
        "Click 'Contact Owner' on any property page",
        "Get verified owner contact details instantly",
        "Call or message owners directly through the platform",
        "Ask about availability, pricing, and specific requirements",
        "Schedule property visits at convenient times"
      ],
      tips: "Prepare a list of questions beforehand to make the most of your conversation with owners!"
    },
    {
      step: 5,
      title: "Visit & Verify",
      description: "Schedule property visits to see the accommodation in person before booking",
      icon: Calendar,
      color: "bg-red-100 text-red-600",
      details: [
        "Schedule visits during daytime for better visibility",
        "Check all amenities mentioned in the listing",
        "Inspect room condition, cleanliness, and safety features",
        "Meet current tenants to get first-hand experiences",
        "Verify the exact location and nearby facilities"
      ],
      tips: "Visit multiple properties to compare and negotiate better deals!"
    },
    {
      step: 6,
      title: "Book Your Perfect PG",
      description: "Finalize your booking with complete documentation and move in safely",
      icon: Key,
      color: "bg-yellow-100 text-yellow-600",
      details: [
        "Negotiate rent and security deposit with the owner",
        "Get a written rental agreement",
        "Verify all terms and conditions clearly",
        "Make payments through secure, documented methods",
        "Get receipts for all transactions"
      ],
      tips: "Always get a written agreement and keep records of all payments for your protection!"
    }
  ]

  const features = [
    {
      title: "Zero Brokerage",
      description: "Connect directly with property owners without any middleman charges",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Verified Properties",
      description: "All properties are personally verified by our team for authenticity",
      icon: CheckCircle,
      color: "text-blue-600"
    },
    {
      title: "Smart Filters",
      description: "Find exactly what you need with our advanced search and filter options",
      icon: Filter,
      color: "text-purple-600"
    },
    {
      title: "24/7 Support",
      description: "Get help anytime with our round-the-clock customer support team",
      icon: MessageCircle,
      color: "text-orange-600"
    }
  ]

  const faqs = [
    {
      question: "Is DwellDash free to use?",
      answer: "Yes! DwellDash is completely free for tenants. We don't charge any brokerage or service fees. You connect directly with property owners."
    },
    {
      question: "How do I know if a property is genuine?",
      answer: "Look for the 'Verified' badge on listings. These properties have been personally inspected by our team. We also verify owner identities and property documents."
    },
    {
      question: "Can I visit properties before booking?",
      answer: "Absolutely! We highly recommend visiting properties in person before making any booking decisions. Contact owners through our platform to schedule visits."
    },
    {
      question: "What if I face issues with my PG?",
      answer: "Contact our 24/7 support team immediately. We'll help mediate with the property owner and resolve any issues. Your safety and satisfaction are our priorities."
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
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Getting Started Guide
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              New to DwellDash? Follow this step-by-step guide to find your perfect PG accommodation quickly and safely.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 bg-app-accent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-app-text mb-6">Quick Start Options</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="bg-app-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-app-primary/90 transition-colors inline-flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Searching Now
              </Link>
              <Link
                to="/register"
                className="border-2 border-app-primary text-app-primary hover:bg-app-primary hover:text-white px-8 py-3 rounded-lg font-bold transition-colors inline-flex items-center justify-center"
              >
                <User className="w-5 h-5 mr-2" />
                Create Account First
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step by Step Guide */}
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
              Step-by-Step Guide
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Follow these 6 simple steps to find and book your ideal PG accommodation.
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step.color} mr-4 font-bold text-lg`}>
                      {step.step}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-app-text">{step.title}</h3>
                  </div>
                  
                  <p className="text-lg text-app-muted mb-6">{step.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-app-muted">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-app-accent p-4 rounded-lg border-l-4 border-app-primary">
                    <p className="text-app-text font-medium">{step.tips}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-32 h-32 ${step.color} rounded-3xl flex items-center justify-center`}>
                    <step.icon className="w-16 h-16" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-6">
              Why Choose DwellDash?
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              We've designed DwellDash to make your PG search experience simple, safe, and successful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border p-6"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-app-text mb-3">{feature.title}</h3>
                <p className="text-app-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-6">
              Quick Answers
            </h2>
            <p className="text-xl text-app-muted">
              Common questions from new users like you.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border p-6"
              >
                <h3 className="text-lg font-bold text-app-text mb-3">{faq.question}</h3>
                <p className="text-app-muted">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Home className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Your PG Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              You now have all the knowledge you need. Start searching for your perfect PG today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="bg-white text-app-primary px-8 py-4 rounded-xl font-bold hover:bg-app-accent transition-colors inline-flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Searching
              </Link>
              <Link
                to="/help"
                className="border-2 border-white text-white hover:bg-white hover:text-app-primary px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Need More Help?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default GettingStarted 