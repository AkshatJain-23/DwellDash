import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, HelpCircle, Phone, Mail, MessageCircle, Clock,
  ChevronDown, ChevronRight, Users, Building2, CreditCard,
  Shield, Settings, BookOpen, Video, FileText, ExternalLink,
  Check, Star, TrendingUp, Award, Zap, Heart, Globe
} from 'lucide-react'

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    { id: 'general', name: 'General', icon: HelpCircle, color: 'bg-blue-100 text-blue-600' },
    { id: 'search', name: 'Property Search', icon: Search, color: 'bg-green-100 text-green-600' },
    { id: 'booking', name: 'Booking & Payment', icon: CreditCard, color: 'bg-purple-100 text-purple-600' },
    { id: 'account', name: 'Account & Profile', icon: Users, color: 'bg-orange-100 text-orange-600' },
    { id: 'safety', name: 'Safety & Security', icon: Shield, color: 'bg-red-100 text-red-600' },
    { id: 'owners', name: 'Property Owners', icon: Building2, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'technical', name: 'Technical Support', icon: Settings, color: 'bg-gray-100 text-gray-600' }
  ]

  const faqData = {
    general: [
      {
        question: "What is DwellDash?",
        answer: "DwellDash is India's leading platform for finding and booking PG (Paying Guest) accommodations. We connect students and working professionals with verified, quality PG properties across major cities like Bangalore, Mumbai, Delhi, Pune, Chennai, and Hyderabad."
      },
      {
        question: "How does DwellDash work?",
        answer: "It's simple! Search for PGs in your preferred location, filter by amenities and budget, view detailed property information with photos, contact property owners directly, and book your ideal PG. All properties are verified for quality and safety."
      },
      {
        question: "Is DwellDash free to use?",
        answer: "Yes! DwellDash is completely free for tenants. We charge zero brokerage fees. Our revenue comes from partnering with property owners who want to list their properties on our platform."
      },
      {
        question: "Which cities does DwellDash operate in?",
        answer: "We currently operate in 6 major Indian cities: Bangalore, Mumbai, Delhi, Pune, Chennai, and Hyderabad. We're rapidly expanding to cover more cities based on demand."
      },
      {
        question: "How are properties verified?",
        answer: "Every property goes through our strict verification process including document verification, physical inspection, safety checks, and owner background verification. We ensure all amenities listed are available and accurate."
      }
    ],
    search: [
      {
        question: "How do I search for PGs?",
        answer: "Use our search bar on the homepage or properties page. Enter your preferred city, area, or landmark. Then use filters to narrow down by budget, gender preference, amenities, room type, and more."
      },
      {
        question: "Can I save properties for later?",
        answer: "Yes! Click the heart icon on any property to save it to your favorites. You can view all saved properties in your account dashboard. You need to be logged in to save properties."
      },
      {
        question: "How accurate are the property photos?",
        answer: "All photos are taken during our verification process and are updated regularly. If you find any discrepancies, please report them immediately. We ensure photos accurately represent the current state of properties."
      },
      {
        question: "Can I filter by specific amenities?",
        answer: "Absolutely! Our advanced filters allow you to search by WiFi, AC, laundry, parking, gym, food, security, and many other amenities. You can select multiple amenities to find properties that match all your requirements."
      },
      {
        question: "What if I can't find PGs in my preferred area?",
        answer: "Try expanding your search radius or searching for nearby areas. You can also set up alerts for new properties in your preferred area. Contact our support team for personalized assistance in finding suitable options."
      }
    ],
    booking: [
      {
        question: "How do I book a PG?",
        answer: "After finding your preferred PG, click 'Contact Owner' to get owner details. You can call or message them directly. Once you visit and decide, you can book directly with the owner. No platform booking fees!"
      },
      {
        question: "What documents do I need?",
        answer: "Typically you'll need: Valid ID proof (Aadhaar/PAN), Address proof, College ID/Office ID, Recent passport-size photos, and Security deposit. Specific requirements may vary by property."
      },
      {
        question: "Is there a security deposit?",
        answer: "Most PGs require a security deposit, typically 1-3 months' rent. This is refundable when you move out, subject to property condition. The exact amount is specified in each property listing."
      },
      {
        question: "Can I get a refund if I cancel?",
        answer: "Refund policies vary by property owner. Most offer partial refunds if cancelled before moving in. Once you've moved in, refund terms depend on the agreement with the owner. Always clarify before booking."
      },
      {
        question: "What payment methods are accepted?",
        answer: "Most owners accept cash, bank transfer, UPI, or cheques. Some may accept credit/debit cards. Payment methods are typically discussed directly with the property owner during booking."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click 'Register' in the top navigation, fill in your details (name, email, phone), verify your email and phone number, and you're ready to go! Creating an account allows you to save properties, contact owners, and manage your bookings."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Login' then 'Forgot Password'. Enter your registered email address and we'll send you a password reset link. Follow the instructions in the email to create a new password."
      },
      {
        question: "How do I update my profile information?",
        answer: "Go to your Dashboard after logging in, click on 'Profile Settings', and update any information you need to change. Don't forget to save your changes!"
      },
      {
        question: "Can I change my registered phone number?",
        answer: "Yes, go to Profile Settings and update your phone number. You'll need to verify the new number via OTP. This ensures account security and helps owners contact you reliably."
      },
      {
        question: "How do I delete my account?",
        answer: "We're sorry to see you go! Contact our support team at dwelldash3@gmail.com with your account details. We'll process your deletion request within 48 hours while ensuring your data is securely removed."
      }
    ],
    safety: [
      {
        question: "How does DwellDash ensure safety?",
        answer: "We verify all properties and owners, conduct background checks, ensure proper safety measures (CCTV, security), maintain emergency contacts, and have a 24/7 support system for any safety concerns."
      },
      {
        question: "What if I face issues with my PG?",
        answer: "Contact our support team immediately at +91 8426076800. We're available 24/7 for safety concerns. We'll mediate with the owner and help resolve issues. Your safety is our top priority."
      },
      {
        question: "Are female-only PGs available?",
        answer: "Yes! Many properties are exclusively for women, ensuring a safe and comfortable environment. Use our gender filter to find women-only accommodations with enhanced security features."
      },
      {
        question: "What safety features should I look for?",
        answer: "Look for: 24/7 security, CCTV surveillance, secure entry systems, well-lit common areas, emergency contacts, proper fire safety measures, and female security guards for women's PGs."
      },
      {
        question: "How do I report suspicious activity?",
        answer: "Contact us immediately at +91 8426076800 or email dwelldash3@gmail.com. For emergencies, call local police (100) first, then inform us. We take all safety reports seriously and act promptly."
      }
    ],
    owners: [
      {
        question: "How can I list my property on DwellDash?",
        answer: "Register as a property owner, verify your identity and property documents, provide detailed property information and photos, and our team will review and activate your listing within 24-48 hours."
      },
      {
        question: "What are the charges for listing?",
        answer: "Basic listing is free! We offer premium packages with enhanced visibility and marketing support. Contact our business team for detailed pricing and partnership options."
      },
      {
        question: "How do I manage bookings and tenant inquiries?",
        answer: "Use your Owner Dashboard to view inquiries, manage property details, track occupancy, communicate with prospective tenants, and access booking analytics. You have full control over your listings."
      },
      {
        question: "What support do you provide to owners?",
        answer: "We provide marketing support, tenant verification assistance, legal guidance, pricing recommendations, property photography, and dedicated account management for premium partners."
      },
      {
        question: "How do I update my property information?",
        answer: "Log into your Owner Dashboard, select the property you want to update, make changes to details, amenities, photos, or pricing, and save. Updates are reflected immediately on the platform."
      }
    ],
    technical: [
      {
        question: "The website is loading slowly. What should I do?",
        answer: "Try refreshing the page, clearing your browser cache, checking your internet connection, or using a different browser. If issues persist, contact our technical support team."
      },
      {
        question: "I can't upload photos. How do I fix this?",
        answer: "Ensure photos are in JPG/PNG format, under 5MB each, and you have a stable internet connection. Try using a different browser or device. Contact support if the problem continues."
      },
      {
        question: "How do I enable location services?",
        answer: "When prompted, click 'Allow' for location access. In browser settings, ensure location permissions are enabled for DwellDash. This helps us show nearby properties and improve search results."
      },
      {
        question: "I'm not receiving email notifications.",
        answer: "Check your spam/junk folder, ensure dwelldash3@gmail.com is not blocked, verify your email address in profile settings, and check notification preferences in your account dashboard."
      }
    ]
  }

  const quickActions = [
    {
      title: "Contact Support",
      description: "Speak with our support team",
      icon: Phone,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      action: () => window.open('tel:+918426076800'),
      link: "+91 8426076800"
    },
    {
      title: "Email Us",
      description: "Send us an email",
      icon: Mail,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      action: () => window.open('mailto:dwelldash3@gmail.com'),
      link: "dwelldash3@gmail.com"
    },
    {
      title: "Live Chat",
      description: "Chat with DwellBot",
      icon: MessageCircle,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      action: () => {
        // Trigger chatbot
        window.dispatchEvent(new CustomEvent('openChatbot'))
      },
      link: "Chat Now"
    },
    {
      title: "24/7 Support",
      description: "We're always here to help",
      icon: Clock,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      action: null,
      link: "Round the Clock"
    }
  ]

  const helpResources = [
    {
      title: "Getting Started Guide",
      description: "New to DwellDash? Learn the basics",
      icon: BookOpen,
      link: "/guides/getting-started"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: Video,
      link: "/tutorials"
    },
    {
      title: "Safety Guidelines",
      description: "Stay safe while using DwellDash",
      icon: Shield,
      link: "/safety"
    },
    {
      title: "Property Owner Guide",
      description: "Learn how to list your property",
      icon: Building2,
      link: "/guides/owners"
    },
    {
      title: "Terms & Conditions",
      description: "Our terms of service",
      icon: FileText,
      link: "/terms"
    },
    {
      title: "Privacy Policy",
      description: "How we protect your data",
      icon: Shield,
      link: "/privacy"
    },
    {
      title: "Site Map",
      description: "Navigate all pages and sections",
      icon: Globe,
      link: "/sitemap"
    }
  ]

  const filteredFaqs = faqData[activeCategory]?.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

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
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Find answers to your questions, get support, and learn how to make the most of DwellDash.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-app-text bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 focus:outline-none placeholder-gray-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-app-accent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-app-text mb-8 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${action.color}`}
                  onClick={action.action}
                >
                  <action.icon className="w-8 h-8 text-app-primary mb-4" />
                  <h3 className="font-bold text-app-text mb-2">{action.title}</h3>
                  <p className="text-app-muted text-sm mb-3">{action.description}</p>
                  <p className="text-app-primary font-semibold text-sm">{action.link}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg border border-app-border sticky top-8"
              >
                <div className="p-6 border-b">
                  <h3 className="font-bold text-app-text">Categories</h3>
                </div>
                <div className="p-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-app-primary text-white'
                          : 'hover:bg-app-accent text-app-text'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Main Content - FAQs */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-xl shadow-lg border border-app-border">
                  <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold text-app-text mb-2">
                      {categories.find(cat => cat.id === activeCategory)?.name} FAQs
                    </h3>
                    <p className="text-app-muted">
                      {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  
                  <div className="p-6">
                    {filteredFaqs.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 text-app-muted mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-app-text mb-2">No results found</h3>
                        <p className="text-app-muted">Try adjusting your search or browse different categories.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border border-app-border rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                              className="w-full flex items-center justify-between p-4 bg-app-accent hover:bg-app-accent/70 transition-colors"
                            >
                              <h4 className="font-semibold text-app-text text-left">{faq.question}</h4>
                              <ChevronDown 
                                className={`w-5 h-5 text-app-primary transition-transform ${
                                  expandedFaq === index ? 'rotate-180' : ''
                                }`} 
                              />
                            </button>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-white border-t"
                              >
                                <p className="text-app-muted leading-relaxed">{faq.answer}</p>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Resources */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-app-text mb-12 text-center">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpResources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg border border-app-border hover:shadow-xl transition-all duration-200 group"
                >
                  <Link to={resource.link} className="block p-6">
                    <resource.icon className="w-12 h-12 text-app-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-app-text mb-2 group-hover:text-app-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-app-muted mb-4">{resource.description}</p>
                    <div className="flex items-center text-app-primary font-medium">
                      <span>Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or concerns.
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
            
            <div className="mt-8 text-gray-200">
              <p className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                Available 24/7 • Average response time: 5 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HelpCenter 