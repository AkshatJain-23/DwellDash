import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Home, Search, Building2, Users, Info, Phone, FileText, 
  Shield, HelpCircle, Map, Star, Settings, UserPlus, 
  BookOpen, MessageCircle, TrendingUp, Award, Globe,
  ChevronRight, ExternalLink
} from 'lucide-react'

const Sitemap = () => {
  const sitemapSections = [
    {
      category: "Main Pages",
      icon: Home,
      color: "bg-blue-100 text-blue-600",
      pages: [
        { name: "Home", path: "/", description: "Welcome page with search and featured properties" },
        { name: "Properties", path: "/properties", description: "Browse all available PG accommodations" },
        { name: "About Us", path: "/about", description: "Learn about DwellDash's mission and values" },
        { name: "Contact", path: "/contact", description: "Get in touch with our support team" }
      ]
    },
    {
      category: "Property Search",
      icon: Search,
      color: "bg-green-100 text-green-600",
      pages: [
        { name: "Search Properties", path: "/properties", description: "Advanced search with filters" },
        { name: "Property Details", path: "/property/:id", description: "Detailed property information and photos" },
        { name: "Bangalore PGs", path: "/properties?city=Bangalore", description: "PG accommodations in Bangalore" },
        { name: "Mumbai PGs", path: "/properties?city=Mumbai", description: "PG accommodations in Mumbai" },
        { name: "Delhi PGs", path: "/properties?city=Delhi", description: "PG accommodations in Delhi" },
        { name: "Pune PGs", path: "/properties?city=Pune", description: "PG accommodations in Pune" },
        { name: "Chennai PGs", path: "/properties?city=Chennai", description: "PG accommodations in Chennai" },
        { name: "Hyderabad PGs", path: "/properties?city=Hyderabad", description: "PG accommodations in Hyderabad" }
      ]
    },
    {
      category: "User Account",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      pages: [
        { name: "Login", path: "/login", description: "Sign in to your account" },
        { name: "Register", path: "/register", description: "Create a new account" },
        { name: "Dashboard", path: "/dashboard", description: "User dashboard (requires login)" },
        { name: "Profile Settings", path: "/profile", description: "Manage your profile information" },
        { name: "Saved Properties", path: "/saved", description: "View your saved properties" },
        { name: "Booking History", path: "/bookings", description: "View your booking history" }
      ]
    },
    {
      category: "Property Owners",
      icon: Building2,
      color: "bg-orange-100 text-orange-600",
      pages: [
        { name: "List Your Property", path: "/register", description: "Register to list your PG property" },
        { name: "Owner Dashboard", path: "/dashboard", description: "Manage your properties and bookings" },
        { name: "Add Property", path: "/add-property", description: "Add a new property listing" },
        { name: "Edit Property", path: "/edit-property/:id", description: "Edit existing property details" },
        { name: "Property Analytics", path: "/analytics", description: "View property performance metrics" },
        { name: "Owner Support", path: "/contact?subject=property-listing", description: "Get help with property listing" }
      ]
    },
    {
      category: "Support & Help",
      icon: HelpCircle,
      color: "bg-red-100 text-red-600",
      pages: [
        { name: "Help Center", path: "/help", description: "Comprehensive help and FAQ section" },
        { name: "Contact Support", path: "/contact", description: "Contact our support team" },
        { name: "Live Chat", path: "/contact", description: "Chat with our AI assistant DwellBot" },
        { name: "Report Issues", path: "/contact?subject=safety", description: "Report safety or security concerns" },
        { name: "Technical Support", path: "/contact?subject=technical", description: "Get help with technical issues" },
        { name: "Billing Support", path: "/contact?subject=billing", description: "Billing and payment assistance" }
      ]
    },
    {
      category: "Legal & Policies",
      icon: Shield,
      color: "bg-gray-100 text-gray-600",
      pages: [
        { name: "Privacy Policy", path: "/privacy", description: "Our privacy policy and data handling practices" },
        { name: "Terms of Service", path: "/terms", description: "Terms and conditions of using DwellDash" },
        { name: "Cookie Policy", path: "/cookies", description: "Information about cookies and tracking" },
        { name: "Refund Policy", path: "/refunds", description: "Our refund and cancellation policy" },
        { name: "Safety Guidelines", path: "/safety", description: "Safety tips and guidelines for users" }
      ]
    },
    {
      category: "Resources",
      icon: BookOpen,
      color: "bg-yellow-100 text-yellow-600",
      pages: [
        { name: "Blog", path: "/blog", description: "Latest news, tips, and guides" },
        { name: "City Guides", path: "/guides", description: "Living guides for different cities" },
        { name: "PG Tips", path: "/tips", description: "Tips for finding and living in PGs" },
        { name: "Student Resources", path: "/students", description: "Resources specifically for students" },
        { name: "Working Professional Guides", path: "/professionals", description: "Guides for working professionals" }
      ]
    },
    {
      category: "Company",
      icon: Info,
      color: "bg-indigo-100 text-indigo-600",
      pages: [
        { name: "About DwellDash", path: "/about", description: "Our story, mission, and team" },
        { name: "Careers", path: "/careers", description: "Join our team" },
        { name: "Press & Media", path: "/press", description: "Press releases and media kit" },
        { name: "Partner with Us", path: "/partners", description: "Partnership opportunities" },
        { name: "Investor Relations", path: "/investors", description: "Information for investors" }
      ]
    }
  ]

  const externalLinks = [
    { name: "Facebook", url: "#", icon: ExternalLink },
    { name: "Twitter", url: "#", icon: ExternalLink },
    { name: "LinkedIn", url: "#", icon: ExternalLink },
    { name: "Instagram", url: "#", icon: ExternalLink }
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
            <Map className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Site Map
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Navigate through all pages and sections of DwellDash. Find exactly what you're looking for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 bg-app-accent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-app-text mb-6 text-center">Quick Navigation</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {sitemapSections.map((section, index) => (
                <a
                  key={section.category}
                  href={`#${section.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-app-border"
                >
                  <section.icon className="w-4 h-4 text-app-primary" />
                  <span className="font-medium text-app-text">{section.category}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {sitemapSections.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                id={section.category.toLowerCase().replace(/\s+/g, '-')}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-app-border overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-app-accent p-6 border-b">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${section.color}`}>
                      <section.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-app-text">{section.category}</h3>
                      <p className="text-app-muted">
                        {section.pages.length} page{section.pages.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pages List */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.pages.map((page, pageIndex) => (
                      <motion.div
                        key={page.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: pageIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        {page.path.includes(':') || page.path.includes('?') ? (
                          <div className="flex items-start space-x-3 p-4 rounded-lg bg-app-accent/50 border border-app-border/50">
                            <ChevronRight className="w-4 h-4 text-app-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-app-text group-hover:text-app-primary transition-colors">
                                {page.name}
                              </h4>
                              <p className="text-sm text-app-muted mt-1">{page.description}</p>
                              <p className="text-xs text-app-muted/70 mt-1 font-mono">{page.path}</p>
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={page.path}
                            className="flex items-start space-x-3 p-4 rounded-lg bg-app-accent/50 hover:bg-app-accent border border-app-border/50 hover:border-app-primary/30 transition-all duration-200"
                          >
                            <ChevronRight className="w-4 h-4 text-app-primary mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-app-text group-hover:text-app-primary transition-colors">
                                {page.name}
                              </h4>
                              <p className="text-sm text-app-muted mt-1">{page.description}</p>
                              <p className="text-xs text-app-muted/70 mt-1 font-mono">{page.path}</p>
                            </div>
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* External Links */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-app-text mb-6">External Links</h2>
            <p className="text-app-muted mb-8 max-w-2xl mx-auto">
              Connect with us on social media and stay updated with the latest news.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {externalLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-app-border group"
                >
                  <link.icon className="w-6 h-6 text-app-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-app-text text-center">{link.name}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Phone className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Our support team is here to help you navigate and find exactly what you need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/help"
                className="bg-white text-app-primary px-8 py-4 rounded-xl font-bold hover:bg-app-accent transition-colors inline-flex items-center justify-center"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Help Center
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-app-primary px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Sitemap 