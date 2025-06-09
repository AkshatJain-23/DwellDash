import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, Headphones, Star, CheckCircle, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "dwelldash3@gmail.com",
      subtext: "24/7 Email Support",
      color: "bg-app-primary"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 84260 76800",
      subtext: "Mon-Sat 9:00 AM - 8:00 PM",
      color: "bg-app-success"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Available Now",
      subtext: "Instant Help Available",
      color: "bg-app-warning"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      details: "Always Here",
      subtext: "Round the Clock Service",
      color: "bg-app-secondary"
    }
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Message sent successfully! We\'ll respond within 24 hours.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-accent">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-app-secondary to-app-secondary/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Get in <span className="text-app-primary">Touch</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
              Need help finding your perfect PG? Have questions about our platform? Our dedicated support team is here to assist you 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center px-6 py-3 bg-app-success/20 rounded-full text-app-success font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                24/7 Support
              </span>
              <span className="inline-flex items-center px-6 py-3 bg-app-primary/20 rounded-full text-app-primary font-semibold">
                <Star className="w-5 h-5 mr-2" />
                Expert Help
              </span>
              <span className="inline-flex items-center px-6 py-3 bg-app-warning/20 rounded-full text-app-warning font-semibold">
                <MessageCircle className="w-5 h-5 mr-2" />
                Instant Response
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Choose Your Preferred <span className="text-app-primary">Contact Method</span>
            </h2>
            <p className="text-xl text-app-muted max-w-2xl mx-auto">
              Multiple ways to reach us - pick what works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-app-accent rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-app-border">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${info.color} text-white mb-6`}>
                    <info.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-2">{info.title}</h3>
                  <p className="text-app-primary font-semibold mb-2">{info.details}</p>
                  <p className="text-app-muted text-sm">{info.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-app-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">Send us a Message</h2>
                <p className="text-xl text-app-muted">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-app-text mb-3">
                      First Name *
                    </label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      type="text"
                      className="w-full px-4 py-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-colors text-lg"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-app-text mb-3">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      className="w-full px-4 py-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-colors text-lg"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-app-text mb-3">
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
                    className="w-full px-4 py-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-colors text-lg"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-app-text mb-3">
                    Subject *
                  </label>
                  <select
                    {...register('subject', { required: 'Please select a subject' })}
                    className="w-full px-4 py-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-colors text-lg"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Assistance</option>
                    <option value="property">Property Listing</option>
                    <option value="support">Technical Support</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-app-text mb-3">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="w-full px-4 py-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-colors resize-none text-lg"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-8 py-4 bg-app-primary text-white rounded-xl font-bold text-lg hover:bg-app-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-app-primary to-app-primary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Find Your Perfect PG?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Don't wait! Start browsing thousands of verified PG accommodations today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="inline-flex items-center px-8 py-4 bg-white text-app-primary rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-app-primary transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
