import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Shield, Target, Award, MapPin, Star, CheckCircle, Building2, TrendingUp, Clock, Globe, Home, Eye, Phone, Mail } from 'lucide-react'
import DwellDashLogo from '../components/DwellDashLogo'
import { api } from '../utils/api'
import { Link } from 'react-router-dom'

const About = () => {
  const [stats, setStats] = useState([
    { number: "Loading...", label: "Happy Tenants" },
    { number: "Loading...", label: "Verified Properties" },
    { number: "Loading...", label: "Cities Covered" },
    { number: "Loading...", label: "Satisfaction Rate" }
  ])
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize PG accommodation discovery by creating a transparent, reliable, and user-friendly platform that connects students and professionals with verified, quality accommodations across India."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To become India's most trusted housing platform, where finding your perfect home away from home is simple, safe, and stress-free for millions of users."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every property undergoes rigorous verification including physical inspections, documentation checks, and owner verification to ensure complete safety and authenticity."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "We're not just about rooms - we're building communities. Creating lasting connections between tenants, owners, and neighbors that enrich the living experience."
    }
  ]

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Properties",
      description: "100% verified properties with physical inspections",
      stats: "Every property inspected"
    },
    {
      icon: Building2,
      title: "Zero Brokerage",
      description: "Direct contact with owners, no hidden charges",
      stats: "₹0 commission for tenants"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support and assistance",
      stats: "Available always"
    },
    {
      icon: Globe,
      title: "Pan-India Presence",
      description: "Serving major cities across India",
      stats: "50+ cities covered"
    }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      city: "Bangalore",
      rating: 5,
      text: "DwellDash made my PG hunt so easy! Found an amazing place near my office with all amenities. The verification process gave me complete confidence.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Rahul Kumar",
      role: "MBA Student",
      city: "Mumbai",
      rating: 5,
      text: "As a student, finding affordable yet quality accommodation was crucial. DwellDash's zero brokerage policy saved me thousands!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Anjali Patel",
      role: "Marketing Executive",
      city: "Pune",
      rating: 5,
      text: "The support team is fantastic! They helped me throughout the entire process. Found my perfect PG within just 2 days.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ]

  const timeline = [
    {
      year: "2023",
      title: "Foundation",
      description: "DwellDash was founded with a mission to transform PG accommodation discovery in India."
    },
    {
      year: "2023",
      title: "First Properties",
      description: "Launched with 100+ verified properties across 5 major cities including Bangalore and Mumbai."
    },
    {
      year: "2024",
      title: "Rapid Expansion",
      description: "Expanded to 25+ cities with 1000+ properties and enhanced platform features for better user experience."
    },
    {
      year: "2024",
      title: "Innovation",
      description: "Introduced AI-powered property matching and 24/7 customer support to enhance user experience."
    },
    {
      year: "2024",
      title: "Present",
      description: "Now serving 50+ cities with thousands of satisfied tenants and property owners nationwide."
    }
  ]

  // Fetch real statistics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true)
        const response = await api.get('/stats')
        
        let apiStats = response.data
        if (response.data.success && response.data.data) {
          apiStats = response.data.data
          }
        
        if (Array.isArray(apiStats) && apiStats.length > 0) {
          setStats(apiStats)
        } else {
          setStats([
            { number: "10,000+", label: "Happy Tenants" },
            { number: "5,000+", label: "Verified Properties" },
            { number: "50+", label: "Cities Covered" },
            { number: "98%", label: "Satisfaction Rate" }
          ])
        }
      } catch (error) {
        console.error('Error fetching statistics:', error)
        setStats([
          { number: "10,000+", label: "Happy Tenants" },
          { number: "5,000+", label: "Verified Properties" },
          { number: "50+", label: "Cities Covered" },
          { number: "98%", label: "Satisfaction Rate" }
        ])
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

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
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm">
                <DwellDashLogo className="h-20 w-20 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              About DwellDash
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              Revolutionizing the way students and professionals discover their perfect home away from home across India with transparency, trust, and technology.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl lg:text-4xl font-bold mb-2 ${isLoadingStats ? 'animate-pulse' : ''}`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-app-text mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-app-muted leading-relaxed">
                <p>
                  Founded in 2023, DwellDash emerged from a simple yet powerful realization: finding quality PG accommodations in India shouldn't be a nightmare filled with brokers, hidden charges, and uncertainty.
                </p>
                <p>
                  Our founding team, having personally experienced the frustrations of PG hunting across India's major cities, decided to create a platform that would completely transform this experience. We envisioned a world where transparency, trust, and technology would make finding your perfect accommodation as simple as a few clicks.
              </p>
                <p>
                  What started as a mission to help a few students and professionals has now grown into India's most trusted PG platform, serving thousands of users across 50+ cities. Every day, we're helping people find not just a place to stay, but a place to call home.
              </p>
                <p>
                  Today, we're proud to have revolutionized the PG industry with zero brokerage, 100% verified properties, and a customer-first approach that has earned us the trust of both tenants and property owners nationwide.
              </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-app-accent rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-app-text mb-8">Why We Started DwellDash</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-app-primary/10 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-app-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text mb-2">Eliminate Fraud</h4>
                    <p className="text-app-muted">Stop fake listings and fraudulent practices in the PG industry</p>
                  </div>
                    </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-app-primary/10 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-app-primary" />
                    </div>
                  <div>
                    <h4 className="font-semibold text-app-text mb-2">Zero Brokerage</h4>
                    <p className="text-app-muted">Remove unnecessary middlemen and hidden charges</p>
                  </div>
              </div>
              
                <div className="flex items-start space-x-4">
                  <div className="bg-app-primary/10 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-app-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-app-text mb-2">Better Experience</h4>
                    <p className="text-app-muted">Create a seamless, stress-free accommodation discovery journey</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
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
              Our Values & Vision
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              The core principles that guide every decision we make and drive us forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-app-primary/10 p-4 rounded-2xl">
                    <value.icon className="w-8 h-8 text-app-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-app-text">{value.title}</h3>
                </div>
                <p className="text-app-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              What Makes Us Different
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              The features and benefits that set DwellDash apart from traditional PG hunting methods
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-app-accent rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="bg-app-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-app-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-app-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-4">{feature.title}</h3>
                  <p className="text-app-muted mb-4">{feature.description}</p>
                  <div className="bg-app-primary/10 rounded-lg py-2 px-4">
                    <span className="text-app-primary font-semibold text-sm">{feature.stats}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our Journey
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              From a simple idea to India's trusted PG platform - here's how we've grown
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-app-primary/20"></div>
            
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-app-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold text-app-text">{item.title}</h3>
                    </div>
                    <p className="text-app-muted">{item.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-app-primary rounded-full border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              What Our Users Say
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Real experiences from real people who found their perfect home through DwellDash
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-app-muted mb-6 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-app-text">{testimonial.name}</h4>
                    <p className="text-app-muted text-sm">{testimonial.role}</p>
                    <p className="text-app-primary text-sm">{testimonial.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Home className="w-20 h-20 mx-auto mb-8 text-white" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
              Join thousands of satisfied tenants and property owners who trust DwellDash for their accommodation needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/properties" 
                className="inline-flex items-center bg-white text-app-primary hover:bg-app-accent transition-colors px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl"
              >
                <Home className="w-6 h-6 mr-2" />
                Find Your PG
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-app-primary transition-colors px-8 py-4 rounded-xl font-bold text-lg"
              >
                <Phone className="w-6 h-6 mr-2" />
                Contact Us
              </Link>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>+91 8426076800</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>dwelldash3@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About 