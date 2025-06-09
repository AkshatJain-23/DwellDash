import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Shield, Users, Star, Building2, Wifi, Car, Utensils, Phone, Filter, Heart, Eye, CheckCircle, TrendingUp, Home as HomeIcon, Bed, Award, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import useStats from '../hooks/useStats'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
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
    { name: 'Delhi', count: '1,200+', price: '₹8,000-25,000', image: 'https://images.unsplash.com/photo-1562979314-bee7453d14c8?w=300&h=200&fit=crop', popular: true },
    { name: 'Pune', count: '900+', price: '₹7,000-18,000', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop', popular: false },
    { name: 'Chennai', count: '700+', price: '₹6,000-15,000', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop', popular: false },
    { name: 'Hyderabad', count: '650+', price: '₹7,000-16,000', image: 'https://images.unsplash.com/photo-1588417201232-3c8ad880c0f8?w=300&h=200&fit=crop', popular: false }
  ]

  const featuredProperties = [
    {
      id: 1,
      title: "Premium PG near Koramangala",
      location: "Koramangala 5th Block, Bangalore",
      price: "₹15,000",
      originalPrice: "₹18,000",
      type: "Private Room",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Food", "AC", "Laundry"],
      verified: true,
      featured: true,
      distance: "1.2 km from IT park"
    },
    {
      id: 2,
      title: "Modern PG for Working Professionals",
      location: "Whitefield, Bangalore",
      price: "₹12,500",
      originalPrice: "₹14,000",
      type: "Shared Room",
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Food", "Gym", "Security"],
      verified: true,
      featured: false,
      distance: "800m from Metro"
    },
    {
      id: 3,
      title: "Luxury PG with Premium Amenities",
      location: "Andheri West, Mumbai",
      price: "₹22,000",
      originalPrice: "₹25,000",
      type: "Private Room",
      rating: 4.9,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Food", "AC", "Housekeeping"],
      verified: true,
      featured: true,
      distance: "500m from Station"
    }
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
                  {statsLoading ? '...' : stat.count}
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
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-4">
              Featured Properties
            </h2>
            <p className="text-app-muted text-lg max-w-2xl mx-auto">
              Hand-picked premium PG accommodations with best amenities and locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-app-border group"
              >
                <div className="relative">
                  {property.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-app-warning text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-app-muted hover:text-app-primary" />
                    </button>
                  </div>
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.verified && (
                    <div className="absolute bottom-4 left-4 bg-app-success text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-app-text line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-app-warning">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="font-semibold">{property.rating}</span>
                      <span className="text-app-muted text-sm ml-1">({property.reviews})</span>
                    </div>
                  </div>

                  <p className="text-app-muted mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>

                  <p className="text-sm text-app-muted mb-3">{property.distance}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span 
                        key={amenity}
                        className="px-3 py-1 bg-app-accent text-app-text text-sm rounded-full font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-3 py-1 bg-app-accent text-app-muted text-sm rounded-full">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-app-text">{property.price}</span>
                        <span className="text-app-muted text-sm ml-1">/month</span>
                      </div>
                      {property.originalPrice && (
                        <div className="text-app-muted text-sm line-through">{property.originalPrice}</div>
                      )}
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
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center bg-app-secondary text-white px-8 py-3 rounded-xl font-semibold hover:bg-app-secondary/90 transition-colors"
            >
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
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
                Join DwellDash
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 