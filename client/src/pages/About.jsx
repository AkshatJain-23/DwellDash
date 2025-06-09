import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Shield, Target, Award, MapPin, CheckCircle, Star, Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  const [stats] = useState([
    { number: "50,000+", label: "Happy Tenants", icon: Users, color: "text-app-success" },
    { number: "8,000+", label: "Verified Properties", icon: Building2, color: "text-app-primary" },
    { number: "25+", label: "Cities Covered", icon: MapPin, color: "text-app-secondary" },
    { number: "4.8/5", label: "Average Rating", icon: Star, color: "text-app-warning" }
  ])

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize PG accommodation discovery by connecting students and professionals with verified, quality living spaces across India.",
      color: "bg-app-primary"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every property undergoes rigorous verification. Zero brokerage, complete transparency, and secure transactions guaranteed.",
      color: "bg-app-success"
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Building more than accommodations - we create communities where people connect, grow, and thrive together.",
      color: "bg-app-warning"
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Maintaining the highest standards in property quality, customer service, and platform security across all touchpoints.",
      color: "bg-app-secondary"
    }
  ]

  const milestones = [
    { year: "2023", title: "Founded", description: "DwellDash launched with a vision to transform PG hunting", achievement: "Platform Launch" },
    { year: "2023", title: "First 1,000", description: "Reached our first 1,000 happy tenants across 5 cities", achievement: "1K Tenants" },
    { year: "2024", title: "Major Expansion", description: "Expanded to 25+ cities with 8,000+ verified properties", achievement: "25 Cities" },
    { year: "2024", title: "50K+ Community", description: "Built India's largest PG community with 50,000+ members", achievement: "50K Users" }
  ]

  const team = [
    {
      name: "Akshat Jain",
      role: "Founder & CEO",
      description: "Visionary leader with expertise in PropTech and a passion for solving India's housing challenges.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sarah Chen",
      role: "Co-Founder & CTO",
      description: "Tech innovator focused on creating seamless digital experiences for modern property seekers.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Rahul Sharma",
      role: "Head of Operations",
      description: "Operations excellence expert ensuring quality standards across all our platform services.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-app-primary/10 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About <span className="text-orange-400">DwellDash</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
              India's most trusted PG booking platform, revolutionizing how students and professionals find their perfect home away from home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center px-6 py-3 bg-app-primary/20 rounded-full text-app-primary font-semibold">
                <Shield className="w-5 h-5 mr-2" />
                Zero Brokerage
              </span>
              <span className="inline-flex items-center px-6 py-3 bg-app-success/20 rounded-full text-app-success font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Verified Properties
              </span>
              <span className="inline-flex items-center px-6 py-3 bg-app-warning/20 rounded-full text-app-warning font-semibold">
                <Star className="w-5 h-5 mr-2" />
                4.8+ Rating
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8">
                Our <span className="text-orange-600">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  DwellDash was born from personal frustration with India's broken PG ecosystem. Our founders experienced firsthand the challenges of finding quality accommodations - hidden charges, unverified properties, and endless broker calls.
                </p>
                <p>
                  In 2023, we decided to build the platform we wished existed. A place where trust comes first, transparency is guaranteed, and finding your perfect home is actually enjoyable.
                </p>
                <p>
                  Today, we're proud to have revolutionized PG discovery for over 50,000 Indians, proving that technology can solve real housing challenges when built with genuine care.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/properties"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Explore Properties
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-app-text mb-6">Our Journey</h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-app-primary rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-app-text">{milestone.title}</h4>
                        <p className="text-app-muted text-sm mt-1">{milestone.description}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-app-success/10 text-app-success text-xs rounded-full font-medium">
                          {milestone.achievement}
                        </span>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-app-text mb-6">
              Our <span className="text-app-primary">Values</span>
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-app-accent rounded-2xl p-8 h-full border border-app-border hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${value.color} text-white mb-6`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-app-text mb-4">{value.title}</h3>
                  <p className="text-app-muted leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-app-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-app-text mb-6">
              Meet Our <span className="text-app-primary">Team</span>
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              The passionate individuals working tirelessly to transform India's PG ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-app-primary/20"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-app-text mb-2">{member.name}</h3>
                  <p className="text-app-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-app-muted leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
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
              Join 50,000+ students and professionals who've found their ideal home with DwellDash
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/properties" 
                className="inline-flex items-center px-8 py-4 bg-white text-app-primary rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                to="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-app-primary transition-colors"
              >
                List Your Property
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About 