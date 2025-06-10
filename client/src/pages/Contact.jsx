import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle, 
  HelpCircle, ChevronDown, ChevronUp, CheckCircle,
  Building, Users, Shield, Star, Headphones, Zap
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import IntegratedChatbot from '../components/IntegratedChatbot'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 8426076800",
      subtext: "24/7 Customer Support",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email Us", 
      details: "dwelldash3@gmail.com",
      subtext: "Response within 2 hours",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Chat with DwellBot",
      subtext: "Instant assistance available",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Multiple Locations",
      subtext: "50+ cities across India",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ]

  const quickSupport = [
    {
      icon: Building,
      title: "Property Owners",
      description: "List your property and start earning",
      action: "List Property"
    },
    {
      icon: Users,
      title: "Tenants",
      description: "Find your perfect PG accommodation",
      action: "Browse PGs"
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Report safety concerns or issues",
      action: "Report Issue"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "App or website related issues",
      action: "Get Help"
    }
  ]

  const faqs = [
    {
      question: "How do I book a PG through DwellDash?",
      answer: "Simply browse our verified properties, contact the owner directly through our platform, schedule a visit, and book your preferred accommodation. No brokerage fees!"
    },
    {
      question: "Are all properties on DwellDash verified?",
      answer: "Yes! Every property undergoes a rigorous verification process including physical inspections, documentation checks, and owner verification to ensure authenticity and safety."
    },
    {
      question: "Is there any brokerage or commission charge?",
      answer: "No, DwellDash operates on a zero brokerage model for tenants. You can contact property owners directly without any hidden charges or commission fees."
    },
    {
      question: "What if I face issues with my accommodation?",
      answer: "Our 24/7 customer support team is here to help. You can reach out via phone, email, or chat for immediate assistance with any concerns or disputes."
    },
    {
      question: "How can I list my property on DwellDash?",
      answer: "Property owners can easily list their PG by registering on our platform, providing property details, uploading photos, and completing our verification process. It's completely free!"
    },
    {
      question: "What cities does DwellDash cover?",
      answer: "We currently serve 50+ major cities across India including Bangalore, Mumbai, Delhi, Pune, Chennai, Hyderabad, and many more. Check our website for the complete list."
    }
  ]

  const offices = [
    {
      city: "Bangalore",
      address: "Tech Park, Whitefield, Bangalore, Karnataka 560037",
      phone: "+91 8426076800",
      email: "bangalore@dwelldash.com",
      hours: "24/7 Support Available"
    },
    {
      city: "Mumbai",
      address: "Business District, Andheri East, Mumbai, Maharashtra 400069",
      phone: "+91 8426076800",
      email: "mumbai@dwelldash.com",
      hours: "24/7 Support Available"
    },
    {
      city: "Delhi",
      address: "Connaught Place, New Delhi, Delhi 110001",
      phone: "+91 8426076800",
      email: "delhi@dwelldash.com",
      hours: "24/7 Support Available"
    }
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Message sent successfully! We\'ll get back to you within 2 hours.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-app-secondary via-app-secondary/90 to-app-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-app-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              Need help finding your perfect PG or want to list your property? Our dedicated support team is here to assist you 24/7.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold mb-2">24/7</div>
                <div className="text-gray-300">Support Available</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold mb-2">&lt;2hrs</div>
                <div className="text-gray-300">Response Time</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold mb-2">50+</div>
                <div className="text-gray-300">Cities Covered</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold mb-2">98%</div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-app-text mb-6">
              How Can We Help You?
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Choose your preferred way to get in touch with our support team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className="bg-app-accent rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`${info.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <info.icon className={`w-8 h-8 ${info.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-2">{info.title}</h3>
                  <p className="text-app-text font-semibold mb-2">{info.details}</p>
                  <p className="text-app-muted text-sm">{info.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Support Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-app-accent rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-app-text mb-8 text-center">Quick Support Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickSupport.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="bg-app-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-app-primary" />
                  </div>
                  <h4 className="font-semibold text-app-text mb-2">{item.title}</h4>
                  <p className="text-app-muted text-sm mb-4">{item.description}</p>
                  <button className="text-app-primary font-medium text-sm hover:underline">
                    {item.action} →
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Chatbot */}
      <section className="py-20 bg-app-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-app-primary/10 p-3 rounded-xl">
                  <Send className="w-6 h-6 text-app-primary" />
                </div>
                <h2 className="text-2xl font-bold text-app-text">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-app-text">
                      First Name *
                    </label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      type="text"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-app-primary focus:ring-app-primary transition-colors"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-app-text">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-app-primary focus:ring-app-primary transition-colors"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-app-text">
                    Email Address *
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-app-primary focus:ring-app-primary transition-colors"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-app-text">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-app-primary focus:ring-app-primary transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-app-text">
                    Subject *
                  </label>
                  <select
                    {...register('subject', { required: 'Subject is required' })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-app-primary focus:ring-app-primary transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="property-search">Finding a PG</option>
                    <option value="property-listing">Listing My Property</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="safety">Safety & Security</option>
                    <option value="partnership">Partnership Opportunities</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-app-text">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={5}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-app-primary focus:ring-app-primary transition-colors"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-6 bg-app-primary hover:bg-app-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* AI Chatbot */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-app-text">Chat with DwellBot</h3>
                </div>
                <p className="text-app-muted mb-6">
                  Get instant answers from our AI assistant about properties, bookings, pricing, and more. Available 24/7!
                </p>
                <IntegratedChatbot />
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h4 className="text-xl font-bold text-app-text mb-6">Emergency Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <Phone className="w-6 h-6 text-green-600 mr-4" />
                    <div>
                      <h5 className="font-semibold text-app-text">24/7 Helpline</h5>
                      <p className="text-green-600 font-medium">+91 8426076800</p>
                      <p className="text-sm text-app-muted">For urgent matters & emergencies</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Mail className="w-6 h-6 text-blue-600 mr-4" />
                    <div>
                      <h5 className="font-semibold text-app-text">Priority Support</h5>
                      <p className="text-blue-600 font-medium">dwelldash3@gmail.com</p>
                      <p className="text-sm text-app-muted">Response within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-app-text mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-app-muted">
              Find quick answers to common questions about DwellDash
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-app-accent rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-app-text">{faq.question}</h3>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-app-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-app-primary" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-app-muted leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-app-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-app-text mb-6">
              Visit Our Offices
            </h2>
            <p className="text-xl text-app-muted">
              Meet our team in person at any of our office locations across India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-2xl font-bold text-app-text mb-6">{office.city} Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-app-primary mt-0.5 flex-shrink-0" />
                    <p className="text-app-muted">{office.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-app-primary flex-shrink-0" />
                    <p className="text-app-muted">{office.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-app-primary flex-shrink-0" />
                    <p className="text-app-muted">{office.email}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-app-primary flex-shrink-0" />
                    <p className="text-app-muted">{office.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact 