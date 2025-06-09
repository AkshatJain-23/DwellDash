import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Shield, Users, Star, Building2, Wifi, Car, Utensils, Phone, Filter, Heart, Eye, CheckCircle, TrendingUp, Home as HomeIcon, Bed, Award, Clock, ArrowRight, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useStats } from '../contexts/StatsContext'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [imageErrors, setImageErrors] = useState({})
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [propertiesLoading, setPropertiesLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef(null)
  const autoScrollRef = useRef(null)
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant } = useAuth()
  const { stats, loading: statsLoading } = useStats()

  // Handle image loading errors
  const handleImageError = (imageKey, fallbackUrl) => {
    setImageErrors(prev => ({
      ...prev,
      [imageKey]: fallbackUrl
    }))
  }

  // Fetch real properties from backend
  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (featuredProperties.length > 0) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % Math.max(1, featuredProperties.length - 2)
          scrollToIndex(nextIndex)
          return nextIndex
        })
      }, 4000) // Auto-scroll every 4 seconds

      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current)
        }
      }
    }
  }, [featuredProperties.length])

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 350 // Approximate card width + gap
      const scrollPosition = index * cardWidth
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollLeft = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const scrollRight = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
    const maxIndex = Math.max(0, featuredProperties.length - 3)
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const fetchFeaturedProperties = async () => {
    try {
      setPropertiesLoading(true)
      // Fetch properties with limit to get featured ones
      const response = await api.get('/properties?limit=6')
      
      if (response.data && response.data.properties) {
        // Add featured flag and format data for display
        const formattedProperties = response.data.properties.map(property => ({
          ...property,
          featured: Math.random() > 0.5, // Randomly mark some as featured
          verified: true, // All properties from backend are verified
          distance: generateRandomDistance(), // Generate realistic distance
          reviews: Math.floor(Math.random() * 200) + 50 // Generate review count
        }))
        setFeaturedProperties(formattedProperties)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      toast.error('Failed to load featured properties')
      // Keep empty array on error
      setFeaturedProperties([])
    } finally {
      setPropertiesLoading(false)
    }
  }

  // Generate realistic distance for properties
  const generateRandomDistance = () => {
    const distances = [
      "500m from Metro",
      "1.2 km from IT park", 
      "800m from Station",
      "2 km from City Center",
      "1.5 km from Mall",
      "600m from Hospital",
      "900m from University",
      "1.8 km from Airport"
    ]
    return distances[Math.floor(Math.random() * distances.length)]
  }

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price).replace('₹', '₹')
  }

  // Calculate original price for discount display
  const calculateOriginalPrice = (currentPrice) => {
    const discountPercent = Math.floor(Math.random() * 20) + 10 // 10-30% discount
    return Math.floor(currentPrice * (100 + discountPercent) / 100)
  }

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
    { name: 'Bangalore', count: '2,500+', price: '₹8,000-20,000', image: 'https://picsum.photos/400/200?random=1', popular: true },
    { name: 'Mumbai', count: '1,800+', price: '₹12,000-35,000', image: 'https://picsum.photos/400/200?random=2', popular: true },
    { name: 'Delhi', count: '1,200+', price: '₹8,000-25,000', image: 'https://picsum.photos/400/200?random=3', popular: true },
    { name: 'Pune', count: '900+', price: '₹7,000-18,000', image: 'https://picsum.photos/400/200?random=4', popular: false },
    { name: 'Chennai', count: '700+', price: '₹6,000-15,000', image: 'https://picsum.photos/400/200?random=5', popular: false },
    { name: 'Hyderabad', count: '650+', price: '₹7,000-16,000', image: 'https://picsum.photos/400/200?random=6', popular: false }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Zero Brokerage',
      description: 'Direct contact with owners. No hidden charges.',
      color: 'text-app-success'
    },
    {
      icon: CheckCircle,
      title: 'Verified Properties',
      description: 'Every property verified by our quality team.',
      color: 'text-app-primary'
    },
    {
      icon: Users,
      title: '50,000+ Happy Tenants',
      description: 'Join thousands who found their perfect home.',
      color: 'text-app-secondary'
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'Compare prices and get the best deals.',
      color: 'text-app-warning'
    }
  ]

  return (
    <div className="min-h-screen bg-app-accent">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-app-secondary to-app-secondary/90 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              Find Your Perfect <span className="text-app-primary">PG</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl mb-8 text-gray-200"
            >
              Discover verified PG accommodations with zero brokerage. Over 8,000+ properties across India.
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-5xl mx-auto"
            >
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Location Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-app-text mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-app-muted" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by city, locality, landmarks..."
                        className="w-full pl-12 pr-4 py-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary text-app-text font-medium"
                      />
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-semibold text-app-text mb-2">Budget</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full py-4 px-4 border-2 border-app-border rounded-xl focus:ring-2 focus:ring-app-primary focus:border-app-primary text-app-text font-medium"
                    >
                      <option value="">Any Budget</option>
                      <option value="5000-10000">₹5,000 - ₹10,000</option>
                      <option value="10000-15000">₹10,000 - ₹15,000</option>
                      <option value="15000-25000">₹15,000 - ₹25,000</option>
                      <option value="25000+">₹25,000+</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-app-primary hover:bg-app-primary/90 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search PGs
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
            </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-app-accent border border-app-border hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl lg:text-4xl font-bold text-app-primary mb-2">
                  {statsLoading ? '...' : stat.number}
                  </div>
                <div className="text-app-text font-semibold">{stat.label}</div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-app-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Explore PGs in Popular Cities
            </h2>
            <p className="text-app-muted text-lg max-w-2xl mx-auto">
              Discover thousands of verified PG accommodations in India's major cities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCityClick(city.name)}
                className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {city.popular && (
                  <div className="absolute top-4 left-4 z-10 bg-app-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={imageErrors[`city-${city.name}`] || city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={() => handleImageError(`city-${city.name}`, `https://via.placeholder.com/400x200/FF6B35/ffffff?text=${encodeURIComponent(city.name)}`)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-app-text mb-2">{city.name}</h3>
                  <div className="flex justify-between items-center text-app-muted mb-3">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {city.count} PGs
                    </span>
                    <span className="font-semibold text-app-primary">{city.price}</span>
                  </div>
                  <button className="flex items-center text-app-primary font-semibold hover:text-app-primary/80">
                    Explore PGs <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl lg:text-4xl font-bold text-app-text mb-4"
            >
              Featured Properties
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-app-muted text-lg max-w-2xl mx-auto"
            >
              Real properties from verified owners - available for booking now
            </motion.p>
          </div>
          
          {propertiesLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-app-border animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                      <div className="h-9 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl w-28"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="relative">
              {/* Navigation Arrows */}
              <motion.button
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all duration-300 ${
                  currentIndex === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-app-primary hover:bg-app-primary hover:text-white hover:shadow-xl'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                onClick={scrollRight}
                disabled={currentIndex >= featuredProperties.length - 3}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all duration-300 ${
                  currentIndex >= featuredProperties.length - 3 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-app-primary hover:bg-app-primary hover:text-white hover:shadow-xl'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              {/* Scrolling Container */}
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
                style={{ 
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {featuredProperties.map((property, index) => {
                  const originalPrice = calculateOriginalPrice(property.rent)
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: 100, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        y: -15,
                        scale: 1.03,
                        rotateY: 3,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }}
                      className="flex-shrink-0 w-80 relative group"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* Floating Card Container */}
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-app-border/50 hover:border-app-primary/20 transform-gpu h-full">
                        {/* Enhanced Shadow Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                        
                        <div className="relative">
                          {/* Badges */}
                          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            {property.featured && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className="bg-gradient-to-r from-app-warning to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                              >
                                ⭐ Featured
                              </motion.div>
                            )}
                            {property.verified && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                                className="bg-gradient-to-r from-app-success to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verified
                              </motion.div>
                            )}
                          </div>

                          {/* Heart Button */}
                          <div className="absolute top-4 right-4 z-20">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 group/heart"
                            >
                              <Heart className="w-5 h-5 text-app-muted group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-all duration-300" />
                            </motion.button>
                          </div>

                          {/* Property Image */}
                          <div className="h-48 bg-gray-200 relative overflow-hidden">
                            {property.images && property.images.length > 0 ? (
                              <img 
                                src={imageErrors[`property-${property.id}`] || (
                                  property.images[0].startsWith('http') 
                                    ? property.images[0] 
                                    : `http://localhost:5000${property.images[0]}`
                                )} 
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={() => handleImageError(`property-${property.id}`, `https://picsum.photos/400/300?random=${property.id}`)}
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-app-primary/10 to-app-secondary/10">
                                <div className="text-center">
                                  <Bed className="w-12 h-12 text-app-primary mx-auto mb-2" />
                                  <p className="text-app-primary font-semibold text-sm">PG Property</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 relative">
                          {/* Floating Effect Background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>
                          
                          <div className="relative z-10">
                            {/* Title and Rating */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-app-text line-clamp-2 group-hover:text-app-primary transition-colors duration-300">
                                {property.title}
                              </h3>
                              <motion.div 
                                className="flex items-center text-app-warning ml-2 flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Star className="w-4 h-4 fill-current mr-1" />
                                <span className="font-semibold">4.{Math.floor(Math.random() * 3) + 6}</span>
                                <span className="text-app-muted text-sm ml-1">({property.reviews || Math.floor(Math.random() * 200) + 50})</span>
                              </motion.div>
                            </div>

                            {/* Location */}
                            <motion.p 
                              className="text-app-muted mb-2 flex items-center"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <MapPin className="w-4 h-4 mr-1 text-app-primary" />
                              {property.city}
                            </motion.p>

                            {/* Distance */}
                            <p className="text-sm text-app-muted mb-4 pl-5">{property.distance}</p>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {property.amenities?.slice(0, 3).map((amenity, amenityIndex) => (
                                <motion.span 
                                  key={amenity}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + amenityIndex * 0.1 + 0.5 }}
                                  whileHover={{ scale: 1.05 }}
                                  className="px-3 py-1 bg-gradient-to-r from-app-accent to-blue-50 text-app-text text-sm rounded-full font-medium border border-app-border/30 hover:border-app-primary/30 hover:shadow-sm transition-all duration-300"
                                >
                                  {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                                </motion.span>
                              ))}
                              {property.amenities?.length > 3 && (
                                <motion.span 
                                  className="px-3 py-1 bg-app-primary/10 text-app-primary text-sm rounded-full font-medium border border-app-primary/20"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  +{property.amenities.length - 3} more
                                </motion.span>
                              )}
                            </div>

                            {/* Price and CTA */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <motion.span 
                                    className="text-2xl font-bold text-app-text group-hover:text-app-primary transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {formatPrice(property.rent)}
                                  </motion.span>
                                  <span className="text-app-muted text-sm ml-1">/month</span>
                                </div>
                                {originalPrice > property.rent && (
                                  <motion.div 
                                    className="text-app-muted text-sm line-through"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.6 }}
                                  >
                                    {formatPrice(originalPrice)}
                                  </motion.div>
                                )}
                              </div>
                              
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Link
                                  to={`/property/${property.id}`}
                                  className="bg-app-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-app-primary/90 transition-colors"
                                >
                                  View Details
                                </Link>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Scroll Indicators */}
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: Math.max(1, featuredProperties.length - 2) }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      scrollToIndex(index)
                      if (autoScrollRef.current) {
                        clearInterval(autoScrollRef.current)
                      }
                    }}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentIndex === index 
                        ? 'bg-app-primary scale-125' 
                        : 'bg-gray-300 hover:bg-app-primary/50'
                    }`}
                  />
            ))}
          </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Building2 className="w-16 h-16 text-app-muted mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-app-text mb-2">No Properties Found</h3>
              <p className="text-app-muted mb-6">Be the first to list a property on our platform!</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/add-property"
                  className="inline-flex items-center bg-gradient-to-r from-app-primary to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-app-primary/90 hover:to-blue-600/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  List Your Property
                </Link>
              </motion.div>
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/properties"
                className="inline-flex items-center bg-gradient-to-r from-app-secondary to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-app-secondary/90 hover:to-blue-700/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View All Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-app-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Why Choose DwellDash?
            </h2>
            <p className="text-app-muted text-lg max-w-2xl mx-auto">
              Experience the best in PG accommodation with our trusted platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-app-border"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-app-accent flex items-center justify-center`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-app-text mb-3">{feature.title}</h3>
                <p className="text-app-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-secondary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Find Your Perfect PG?
          </h2>
            <p className="text-xl mb-8 text-gray-200">
              Join thousands of happy tenants who found their ideal accommodation through DwellDash
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/properties" 
                className="bg-app-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-app-primary/90 transition-colors inline-flex items-center justify-center"
            >
                <Search className="w-5 h-5 mr-2" />
                Browse Properties
            </Link>
            <Link 
              to="/register" 
                className="bg-white text-app-secondary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
                <Users className="w-5 h-5 mr-2" />
                Join Now
            </Link>
          </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 