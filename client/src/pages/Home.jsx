import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, MapPin, Shield, Users, Star, Building2, Wifi, Car, Utensils, Phone, 
  Filter, Heart, Eye, CheckCircle, TrendingUp, Home as HomeIcon, Bed, Award, 
  Clock, ArrowRight, ChevronLeft, ChevronRight, Play, Zap, Target, Globe,
  MessageCircle, BookOpen, Calendar, Key, Verified, ThumbsUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import useStats from '../hooks/useStats'
import { api } from '../utils/api'
import DemoModal from '../components/DemoModal'
import FavoriteButton from '../components/FavoriteButton'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [propertiesLoading, setPropertiesLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant } = useAuth()
  const { stats, loading: statsLoading } = useStats()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCityClick = (cityName) => {
    if (user?.role === 'owner' && !isBrowsingAsTenant()) {
      navigate('/dashboard')
    } else {
      navigate(`/properties?city=${cityName}`)
    }
  }

  const cities = [
    { name: 'Bangalore', count: '2,500+', price: '₹8,000-20,000', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop', popular: true },
    { name: 'Mumbai', count: '1,800+', price: '₹12,000-35,000', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=300&h=200&fit=crop', popular: true },
    { name: 'Delhi', count: '1,200+', price: '₹8,000-25,000', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop', popular: true },
    { name: 'Pune', count: '900+', price: '₹7,000-18,000', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop', popular: false },
    { name: 'Chennai', count: '700+', price: '₹6,000-15,000', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop', popular: false },
    { name: 'Hyderabad', count: '650+', price: '₹7,000-16,000', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', popular: false }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      city: "Bangalore",
      rating: 5,
      text: "DwellDash made my PG hunt so easy! Found an amazing place near my office with all amenities. The zero brokerage policy saved me ₹15,000!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Rahul Kumar",
      role: "MBA Student",
      city: "Mumbai",
      rating: 5,
      text: "As a student, finding affordable accommodation was crucial. The verification process gave me complete confidence in my choice.",
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

  const howItWorks = [
    {
      step: 1,
      icon: Search,
      title: "Search & Filter",
      description: "Browse thousands of verified PG listings with advanced filters for location, budget, and amenities."
    },
    {
      step: 2,
      icon: Eye,
      title: "Visit & Verify",
      description: "Schedule visits, view detailed photos, and get authentic reviews from current tenants."
    },
    {
      step: 3,
      icon: Key,
      title: "Book Direct",
      description: "Contact owners directly, negotiate terms, and book your perfect PG with zero brokerage."
    }
  ]

  const trustIndicators = [
    {
      icon: Shield,
      title: "100% Verified",
      description: "Every property physically inspected",
      count: "8,000+ Properties"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join thousands of satisfied users",
      count: "50,000+ Happy Tenants"
    },
    {
      icon: Award,
      title: "Zero Brokerage",
      description: "Direct contact with property owners",
      count: "₹0 Commission"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      count: "Always Available"
    }
  ]

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setPropertiesLoading(true)
        console.log('🏠 Fetching properties from API...')
        const response = await api.get('/properties?limit=6&sort=rent&order=desc')
        console.log('🏠 API Response:', response.data)
        
        const transformedProperties = response.data.properties.map(property => {
          const imageUrl = property.images && property.images.length > 0 ? 
                 property.images[0] :
                 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';
          
          console.log('🏠 Property:', property.title, 'Images:', property.images, 'Final URL:', imageUrl);
          
          return {
          id: property.id,
          title: property.title,
          location: `${property.address.split(',').slice(0, 2).join(', ')}`,
          price: `₹${property.rent.toLocaleString()}`,
          originalPrice: property.deposit ? `₹${(property.rent * 1.2).toLocaleString()}` : null,
          type: property.propertyType === 'single-room' ? 'Private Room' : 
                property.propertyType === 'shared-room' ? 'Shared Room' : 'PG Room',
          rating: 4.2 + Math.random() * 0.8,
          reviews: Math.floor(Math.random() * 200) + 50,
            image: imageUrl,
          amenities: property.amenities?.slice(0, 4) || ['WiFi', 'Security'],
          verified: true,
          featured: Math.random() > 0.5,
          distance: ['500m from Metro', '1.2 km from IT park', '800m from Station', '1 km from Mall'][Math.floor(Math.random() * 4)]
          }
        })
        
        setFeaturedProperties(transformedProperties)
      } catch (error) {
        console.error('Error fetching featured properties:', error)
        setFeaturedProperties([])
      } finally {
        setPropertiesLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-app-secondary via-app-secondary/90 to-app-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-app-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-app-accent/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  Find Your Perfect <span className="text-app-accent">PG</span> <br />
                  <span className="text-4xl lg:text-5xl text-gray-200">Without Brokerage</span>
                </h1>
                <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
                  Discover verified PG accommodations across India. Direct contact with owners, zero hidden charges, and 24/7 support.
                </p>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-200">100% Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <span className="text-gray-200">Zero Brokerage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-purple-400" />
                    <span className="text-gray-200">24/7 Support</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/properties"
                    className="bg-app-primary hover:bg-app-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center"
                  >
                    <Search className="w-6 h-6 mr-2" />
                    Explore Properties
                  </Link>
                  <button 
                    onClick={() => setIsDemoOpen(true)}
                    className="border-2 border-white text-white hover:bg-white hover:text-app-secondary px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Watch Demo
                  </button>
                </div>
              </motion.div>

              {/* Right Content - Enhanced Search */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold mb-6 text-center">Start Your Search</h3>
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Location Search */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Where do you want to stay?</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="City, locality, landmarks..."
                        className="w-full pl-12 pr-4 py-4 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary text-app-text bg-white/90 backdrop-blur-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Budget & Type */}
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-semibold mb-2">Budget Range</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full py-3 px-4 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-app-primary text-app-text bg-white/90 backdrop-blur-sm"
                    >
                      <option value="">Any Budget</option>
                        <option value="5000-10000">₹5K - ₹10K</option>
                        <option value="10000-15000">₹10K - ₹15K</option>
                        <option value="15000-25000">₹15K - ₹25K</option>
                        <option value="25000+">₹25K+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full py-3 px-4 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-app-primary text-app-text bg-white/90 backdrop-blur-sm"
                      >
                        <option value="">Any Type</option>
                        <option value="single-room">Private Room</option>
                        <option value="shared-room">Shared Room</option>
                        <option value="pg">Full PG</option>
                    </select>
                    </div>
                  </div>

                  {/* Search Button */}
                    <button
                      type="submit"
                      className="w-full bg-app-primary hover:bg-app-primary/90 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                    <Search className="w-6 h-6 mr-2" />
                      Search PGs
                    </button>
              </form>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Trusted by Thousands Across India
            </h2>
            <p className="text-xl text-app-muted max-w-2xl mx-auto">
              Join the growing community of satisfied tenants and property owners
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-app-accent to-white shadow-lg hover:shadow-xl transition-all duration-300 border border-app-border group"
              >
                <div className="text-4xl lg:text-5xl font-bold text-app-primary mb-3 group-hover:scale-110 transition-transform">
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-300 h-12 w-20 mx-auto rounded"></div>
                  ) : (
                    stat.number
                  )}
                </div>
                <div className="text-app-text font-semibold text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-app-accent">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Why Choose DwellDash?
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Experience the most trusted and transparent PG booking platform in India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-app-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-app-primary/20 transition-colors">
                  <indicator.icon className="w-10 h-10 text-app-primary" />
                </div>
                <h3 className="text-xl font-bold text-app-text mb-3">{indicator.title}</h3>
                <p className="text-app-muted mb-3">{indicator.description}</p>
                <div className="bg-app-accent rounded-lg py-2 px-4">
                  <span className="text-app-primary font-bold">{indicator.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-app-muted max-w-2xl mx-auto">
              Find your perfect PG in just 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center mb-16 last:mb-0"
              >
                <div className={`flex-1 ${index % 2 === 1 ? 'order-2' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'text-right pl-8' : 'text-left pr-8'}`}>
                    <div className="bg-app-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto lg:mx-0">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-app-text mb-4">{step.title}</h3>
                    <p className="text-app-muted text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 mx-8">
                  <div className="bg-app-accent w-20 h-20 rounded-full flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-app-primary" />
                  </div>
                </div>
                
                <div className={`flex-1 ${index % 2 === 0 ? 'order-2' : ''}`}>
                  {/* Spacer for alternating layout */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities - Enhanced */}
      <section className="py-16 bg-app-accent">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Explore PGs in Popular Cities
            </h2>
            <p className="text-app-muted text-lg max-w-2xl mx-auto">
              Discover thousands of verified PG accommodations in India's major cities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                onClick={() => handleCityClick(city.name)}
                className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {city.popular && (
                  <div className="absolute top-4 left-4 z-10 bg-app-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm opacity-90">{city.count} Properties Available</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center text-app-muted">
                      <Building2 className="w-5 h-5 mr-2" />
                      {city.count} PGs
                    </span>
                    <span className="font-bold text-app-primary text-lg">{city.price}</span>
                  </div>
                  <button className="w-full bg-app-primary text-white py-3 rounded-lg font-semibold hover:bg-app-primary/90 transition-colors flex items-center justify-center">
                    Explore {city.name} PGs <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Enhanced */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center flex-1"
            >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Featured Properties
            </h2>
            <p className="text-app-muted text-lg max-w-2xl mx-auto">
                Hand-picked premium PG accommodations with best amenities and prime locations
              </p>
            </motion.div>
            
            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={scrollLeft}
                className="p-3 rounded-full bg-app-accent hover:bg-app-primary hover:text-white transition-all duration-300 shadow-lg"
                disabled={propertiesLoading}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 rounded-full bg-app-accent hover:bg-app-primary hover:text-white transition-all duration-300 shadow-lg"
                disabled={propertiesLoading}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced Properties Carousel */}
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            >
              {propertiesLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-none w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-app-border animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-8 bg-gray-300 rounded w-24"></div>
                        <div className="h-10 bg-gray-300 rounded w-28"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : featuredProperties.length === 0 ? (
                <div className="flex-none w-full text-center py-12">
                  <Bed className="w-16 h-16 text-app-muted mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-app-text mb-2">No Properties Available</h3>
                  <p className="text-app-muted">Check back later for new property listings.</p>
                </div>
              ) : (
                featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex-none w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-app-border group"
              >
                <div className="relative">
                  {property.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-app-warning text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                      <FavoriteButton 
                        propertyId={property.id} 
                        className=""
                        size="w-5 h-5"
                      />
                    </div>
                  </div>
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.verified && (
                    <div className="absolute bottom-4 left-4 bg-app-success text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Verified className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-app-text line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-app-warning">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="font-semibold">{property.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-app-muted mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span 
                        key={amenity}
                        className="px-3 py-1 bg-app-accent text-app-text text-sm rounded-full font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-app-text">{property.price}</span>
                      <span className="text-app-muted text-sm">/month</span>
                    </div>
                    <Link
                      to={`/property/${property.id}`}
                      className="bg-app-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-app-primary/90 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center bg-app-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-app-secondary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-app-accent">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              What Our Users Say
            </h2>
            <p className="text-app-muted text-lg max-w-2xl mx-auto">
              Real experiences from people who found their perfect home through DwellDash
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
          </div>

              <p className="text-app-text text-xl italic mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-app-text text-lg">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-app-muted">{testimonials[currentTestimonial].role}</p>
                  <p className="text-app-primary font-semibold">{testimonials[currentTestimonial].city}</p>
                </div>
              </div>
              </motion.div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-app-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-app-secondary to-app-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <HomeIcon className="w-20 h-20 mx-auto mb-8 text-white" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied tenants who found their ideal accommodation through DwellDash. Zero brokerage, verified properties, and 24/7 support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/properties"
                className="bg-white text-app-primary px-10 py-4 rounded-xl font-bold hover:bg-app-accent transition-colors inline-flex items-center justify-center shadow-xl hover:shadow-2xl"
              >
                <Search className="w-6 h-6 mr-2" />
                Start Searching
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-app-primary px-10 py-4 rounded-xl font-bold transition-colors inline-flex items-center justify-center"
              >
                <Users className="w-6 h-6 mr-2" />
                Join Community
              </Link>
            </div>


          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
    </div>
  )
}

export default Home 