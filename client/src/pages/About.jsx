import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Shield, Target, Award, MapPin } from 'lucide-react'
import DwellDashLogo from '../components/DwellDashLogo'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const About = () => {
  const [stats, setStats] = useState([
    { number: "Loading...", label: "Happy Tenants" },
    { number: "Loading...", label: "Verified Properties" },
    { number: "Loading...", label: "Cities Covered" },
    { number: "Loading...", label: "Satisfaction Rate" }
  ])
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make finding the perfect PG accommodation simple, safe, and stress-free for students and working professionals across India."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every property is verified and vetted to ensure our users find safe, clean, and reliable accommodations."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in building communities, not just finding rooms. Creating connections that last beyond your stay."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Our rigorous quality standards ensure that every listed property meets our high standards for comfort and amenities."
    }
  ]

  // Fetch real statistics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true)
        const response = await api.get('/stats')
        
        if (response.data.success) {
          setStats(response.data.data)
          
          // Show a subtle notification about real data (optional)
          if (response.data.rawData) {
            console.log('Platform Statistics:', response.data.rawData)
          }
        } else {
          throw new Error('Failed to fetch statistics')
        }
      } catch (error) {
        console.error('Error fetching statistics:', error)
        
        // Fallback to static stats on error
        setStats([
          { number: "Growing", label: "Happy Tenants" },
          { number: "Expanding", label: "Verified Properties" },
          { number: "Multiple", label: "Cities Covered" },
          { number: "High", label: "Satisfaction Rate" }
        ])
        
        toast.error('Failed to load latest statistics')
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  const team = [
    {
      name: "Akshat Jain",
      role: "Founder & CEO",
      description: "Former tech executive with 10+ years experience in PropTech and a passion for solving housing challenges."
    },
    {
      name: "Akshat Jain",
      role: "Co-Founder & CTO",
      description: "Tech innovator focused on creating seamless digital experiences for property seekers and owners."
    },
    {
      name: "Akshat Jain",
      role: "Head of Operations",
      description: "Operations expert ensuring quality standards and smooth experiences across all our services."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
              <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white">
          <div className="absolute inset-0 bg-blue-500 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <DwellDashLogo className="h-20 w-20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              About DwellDash
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
              Revolutionizing the way students and professionals find their perfect home away from home across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2023, DwellDash was born out of personal experiences with the challenges of finding quality PG accommodations in India's major cities. Our founders, having faced these struggles themselves, decided to create a platform that would eliminate the hassles and uncertainties of the traditional PG hunting process.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What started as a simple idea to connect PG seekers with quality accommodations has grown into India's most trusted platform for PG rentals, helping thousands find their perfect home away from home.
              </p>
              <p className="text-lg text-gray-700">
                Today, we're proud to serve students, working professionals, and property owners across 50+ cities, maintaining our commitment to quality, safety, and exceptional user experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-blue-100 rounded-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={`text-3xl font-bold text-blue-600 mb-2 ${
                      isLoadingStats ? 'animate-pulse' : ''
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-700">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Real-time data indicator */}
              {!isLoadingStats && (
                <div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center"
                >
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Live Statistics
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
              <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-700">
              Our core values that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-700">
              The passionate people behind DwellDash
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                                  className="bg-blue-50 rounded-lg p-6 text-center"
              >
                                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
              <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MapPin className="w-16 h-16 mx-auto mb-6 text-light-highlight" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the DwellDash Community
            </h2>
            <p className="text-xl mb-8 text-white">
              Whether you're looking for accommodation or want to list your property, we're here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/properties" 
                className="btn bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Find Your PG
              </Link>
              <Link 
                to="/contact" 
                className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About 