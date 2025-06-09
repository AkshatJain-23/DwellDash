import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Shield, Users, Star, Building2, Wifi, Car, Utensils, Phone, Filter, Heart, Eye, CheckCircle, TrendingUp, Home as HomeIcon, Bed } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant } = useAuth()

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
    { name: 'Delhi', count: '500+', price: '₹8,000-15,000', image: '🏛️' },
    { name: 'Mumbai', count: '800+', price: '₹12,000-25,000', image: '🏙️' },
    { name: 'Bangalore', count: '1200+', price: '₹7,000-18,000', image: '🌆' },
    { name: 'Chennai', count: '400+', price: '₹6,000-12,000', image: '🏖️' },
    { name: 'Pune', count: '600+', price: '₹8,000-16,000', image: '🎓' },
    { name: 'Hyderabad', count: '350+', price: '₹7,000-14,000', image: '💎' }
  ]

  const featuredProperties = [
    {
      id: 1,
      title: "Premium PG in Koramangala",
      location: "Koramangala, Bangalore",
      price: "₹12,000",
      type: "Private Room",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop",
      amenities: ["WiFi", "Food", "AC", "Laundry"],
      verified: true
    },
    {
      id: 2,
      title: "Deluxe PG near IT Park",
      location: "Gachibowli, Hyderabad",
      price: "₹10,500",
      type: "Shared Room",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      amenities: ["WiFi", "Food", "Gym", "Security"],
      verified: true
    },
    {
      id: 3,
      title: "Luxury PG in Andheri",
      location: "Andheri West, Mumbai",
      price: "₹18,000",
      type: "Private Room",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
      amenities: ["WiFi", "Food", "AC", "Housekeeping"],
      verified: true
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Zero Brokerage',
      description: 'Connect directly with property owners. No brokerage fees.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: CheckCircle,
      title: 'Verified Properties',
      description: 'All properties are verified through our quality checks.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Users,
      title: '50,000+ Happy Tenants',
      description: 'Join thousands who found their perfect home with us.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Best Market Prices',
      description: 'Compare prices and get the best deals in your area.',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="relative bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Heading */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Your Perfect <span className="text-blue-600">PG</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover verified PG accommodations with zero brokerage. Over 3000+ properties across major cities.
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white border rounded-lg shadow-lg p-6 mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Location Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by city, area..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="private">Private Room</option>
                      <option value="shared">Shared Room</option>
                      <option value="dormitory">Dormitory</option>
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Budget</option>
                      <option value="5000-10000">₹5,000 - ₹10,000</option>
                      <option value="10000-15000">₹10,000 - ₹15,000</option>
                      <option value="15000-20000">₹15,000 - ₹20,000</option>
                      <option value="20000+">₹20,000+</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-colors"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search PGs
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">3000+</div>
                <div className="text-sm text-gray-600">Verified PGs</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Happy Tenants</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">25+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">Zero</div>
                <div className="text-sm text-gray-600">Brokerage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Hand-picked premium PG accommodations</p>
            </div>
            <Link to="/properties" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {property.verified && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{property.title}</h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{property.price}</div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {property.type}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{property.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Cities</h2>
            <p className="text-gray-600">Explore PG accommodations in popular cities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, index) => (
              <div
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{city.image}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{city.name}</h3>
                      <p className="text-gray-600">{city.count} Properties</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Price Range</div>
                  <div className="font-semibold text-gray-900">{city.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DwellDash?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding your perfect PG accommodation simple, transparent, and hassle-free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <HomeIcon className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream PG?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students and professionals who found their perfect accommodation through DwellDash
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/properties" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Properties
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 