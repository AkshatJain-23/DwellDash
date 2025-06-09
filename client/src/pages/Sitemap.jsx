import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Home, Building2, Users, Phone, Shield, FileText, RefreshCcw, 
  MapPin, Search, Plus, Settings, Star, Info, Calendar, CreditCard,
  UserPlus, LogIn, Key, Menu, MessageSquare, HelpCircle
} from 'lucide-react'
import DwellDashLogo from '../components/DwellDashLogo'

const Sitemap = () => {
  const sitemapSections = [
    {
      title: "Main Pages",
      icon: Home,
      color: "bg-blue-500",
      links: [
        { name: "Home", url: "/", icon: Home, description: "Main landing page with featured properties and services" },
        { name: "Properties", url: "/properties", icon: Building2, description: "Browse all available PG accommodations" },
        { name: "About Us", url: "/about", icon: Info, description: "Learn about DwellDash mission and team" },
        { name: "Contact", url: "/contact", icon: Phone, description: "Get in touch with our support team" }
      ]
    },
    {
      title: "User Account",
      icon: Users,
      color: "bg-green-500",
      links: [
        { name: "Login", url: "/login", icon: LogIn, description: "Sign in to your account" },
        { name: "Register", url: "/register", icon: UserPlus, description: "Create a new account" },
        { name: "Reset Password", url: "/reset-password", icon: Key, description: "Reset your forgotten password" },
        { name: "Dashboard", url: "/dashboard", icon: Settings, description: "Manage your bookings and profile" }
      ]
    },
    {
      title: "Property Management",
      icon: Building2,
      color: "bg-orange-500",
      links: [
        { name: "Add Property", url: "/add-property", icon: Plus, description: "List your PG accommodation" },
        { name: "Edit Property", url: "/edit-property", icon: Settings, description: "Modify your property details" },
        { name: "Property Details", url: "/property/:id", icon: Building2, description: "View detailed property information" }
      ]
    },
    {
      title: "Legal & Policies",
      icon: Shield,
      color: "bg-purple-500",
      links: [
        { name: "Privacy Policy", url: "/privacy", icon: Shield, description: "How we protect your personal information" },
        { name: "Terms of Service", url: "/terms", icon: FileText, description: "Terms and conditions of using DwellDash" },
        { name: "Refund Policy", url: "/refund", icon: RefreshCcw, description: "Refund terms and cancellation policies" }
      ]
    },
    {
      title: "Features & Services",
      icon: Star,
      color: "bg-red-500",
      links: [
        { name: "Search Properties", url: "/properties?search=", icon: Search, description: "Advanced property search with filters" },
        { name: "City-wise Listings", url: "/properties?city=", icon: MapPin, description: "Properties by specific cities" },
        { name: "Featured Properties", url: "/#featured", icon: Star, description: "Highlighted premium accommodations" },
        { name: "Zero Brokerage", url: "/#features", icon: Shield, description: "No hidden charges or broker fees" }
      ]
    },
    {
      title: "Support & Help",
      icon: HelpCircle,
      color: "bg-teal-500",
      links: [
        { name: "Customer Support", url: "/contact", icon: MessageSquare, description: "24/7 customer service assistance" },
        { name: "FAQ", url: "/contact#faq", icon: HelpCircle, description: "Frequently asked questions" },
        { name: "Live Chat", url: "/#chat", icon: MessageSquare, description: "Instant help through chatbot" },
        { name: "Phone Support", url: "tel:+918426076800", icon: Phone, description: "Call us at +91 84260 76800" }
      ]
    }
  ]

  const quickStats = [
    { number: "8,000+", label: "Verified PGs", icon: Building2 },
    { number: "50,000+", label: "Happy Tenants", icon: Users },
    { number: "25+", label: "Cities", icon: MapPin },
    { number: "0%", label: "Brokerage", icon: Shield }
  ]

  const popularCities = [
    "Bangalore", "Mumbai", "Delhi", "Pune", "Chennai", "Hyderabad",
    "Noida", "Gurgaon", "Kolkata", "Ahmedabad", "Kochi", "Indore"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Menu className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Sitemap
              </h1>
            </div>
            <p className="text-xl text-gray-700 mb-6">
              Complete navigation guide to all pages and features on DwellDash
            </p>
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sitemap */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sitemapSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`${section.color} px-6 py-4`}>
                  <div className="flex items-center text-white">
                    <section.icon className="w-6 h-6 mr-3" />
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <link.icon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          {link.url.startsWith('http') || link.url.startsWith('tel:') ? (
                            <a
                              href={link.url}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                              target={link.url.startsWith('http') ? '_blank' : '_self'}
                              rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                              {link.name}
                            </a>
                          ) : (
                            <Link
                              to={link.url}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {link.name}
                            </Link>
                          )}
                          <p className="text-gray-600 text-sm mt-1">{link.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Cities
            </h2>
            <p className="text-gray-600 text-lg">
              Find PG accommodations in these major cities across India
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/properties?city=${city}`}
                  className="block p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors group"
                >
                  <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    PG in {city}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Our support team is here to help you navigate through DwellDash
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="mailto:dwelldash3@gmail.com"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Email Support</div>
              <div className="text-sm text-blue-100">dwelldash3@gmail.com</div>
            </a>
            <a
              href="tel:+918426076800"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Phone Support</div>
              <div className="text-sm text-blue-100">+91 84260 76800</div>
            </a>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <HelpCircle className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Help Center</div>
              <div className="text-sm text-blue-100">Visit our contact page</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sitemap 