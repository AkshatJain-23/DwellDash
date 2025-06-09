import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Shield, Users, Star, Building2, Wifi, Car, Utensils, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleBrowseProperties = () => {
    // If user is owner in Owner Mode, redirect to dashboard
    if (user?.role === 'owner' && !isBrowsingAsTenant()) {
      navigate('/dashboard')
    } else {
      navigate('/properties')
    }
  }

  const handleCityClick = (cityName) => {
    // If user is owner in Owner Mode, redirect to dashboard
    if (user?.role === 'owner' && !isBrowsingAsTenant()) {
      navigate('/dashboard')
    } else {
      navigate(`/properties?city=${cityName}`)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'All our PG listings are verified and safe for students and professionals.'
    },
    {
      icon: Users,
      title: 'Large Community',
      description: 'Join thousands of satisfied tenants who found their perfect PG through us.'
    },
    {
      icon: MapPin,
      title: 'Prime Locations',
      description: 'PGs located near colleges, IT parks, and major commercial areas.'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'We ensure all properties meet our quality standards and safety requirements.'
    }
  ]

  const popularCities = [
    { name: 'Delhi', count: '500+ PGs', image: '🏛️' },
    { name: 'Mumbai', count: '800+ PGs', image: '🏙️' },
    { name: 'Bangalore', count: '1200+ PGs', image: '🌆' },
    { name: 'Chennai', count: '400+ PGs', image: '🏖️' },
    { name: 'Pune', count: '600+ PGs', image: '🎓' },
    { name: 'Hyderabad', count: '350+ PGs', image: '💎' }
  ]

  const amenities = [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Car, name: 'Parking' },
    { icon: Utensils, name: 'Meals' },
    { icon: Shield, name: 'Security' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-light-secondary via-light-primary to-light-accent dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 text-gray-800 dark:text-white transition-colors duration-300">
        <div className="absolute inset-0 bg-light-primary dark:bg-black opacity-10 dark:opacity-30"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="text-sm font-semibold tracking-wider uppercase text-gray-600 dark:text-gray-300">
                Find Your Perfect
              </span>
              <span className="block text-gray-700 dark:text-gray-200">PG Accommodation</span>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-200">
              Your ultimate destination for hassle-free PG accommodation search. 
              Discover comfortable and affordable rooms across multiple cities with verified listings and instant booking.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  placeholder="Search by location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-light-secondary dark:focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-light-secondary hover:bg-light-primary dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-4 rounded-full flex items-center transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex flex-row gap-4">
                <Link 
                  to="/properties" 
                  className="btn bg-white dark:bg-gray-700 text-light-secondary dark:text-white hover:bg-light-highlight dark:hover:bg-gray-600 px-6 py-3 rounded-full font-semibold"
                >
                  Browse All Properties
                </Link>
                <Link 
                  to="/about" 
                  className="btn bg-white dark:bg-gray-700 text-light-secondary dark:text-white hover:bg-light-highlight dark:hover:bg-gray-600 px-6 py-3 rounded-full font-semibold"
                >
                  Learn More
                </Link>
              </div>
              <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-light-secondary dark:hover:text-gray-800 px-6 py-3 rounded-full font-semibold">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              POPULAR DESTINATIONS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Cities for PG Accommodation
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Discover popular destinations with verified PG listings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCities.map((city, index) => (
              <div
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className="bg-light-highlight dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-light-primary dark:hover:bg-gray-700"
              >
                <div className="text-4xl mb-3">{city.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{city.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{city.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light-primary dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-white dark:bg-gray-700 text-light-secondary dark:text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              WHY CHOOSE US
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DwellDash?
            </h2>
            <p className="text-xl text-gray-900">
              We make finding your perfect PG simple, safe, and stress-free
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-light-accent dark:bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-light-secondary dark:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              AMENITIES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Facilities & Services
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Enjoy modern amenities designed for your comfort and convenience
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => (
              <div key={amenity.name} className="text-center">
                <div className="w-16 h-16 bg-light-accent dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="w-8 h-8 text-light-secondary dark:text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{amenity.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-secondary dark:bg-blue-800 text-white transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-6 text-light-highlight dark:text-blue-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect PG?
          </h2>
          <p className="text-xl mb-8 text-white dark:text-blue-100">
            Join thousands of students and professionals who found their ideal accommodation through DwellDash
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/properties" 
              className="btn bg-white dark:bg-gray-200 text-light-secondary dark:text-gray-800 hover:bg-light-highlight dark:hover:bg-gray-100 px-8 py-3 rounded-full font-semibold"
            >
              Explore Properties
            </Link>
            <Link 
              to="/register" 
              className="btn bg-white dark:bg-gray-200 text-light-secondary dark:text-gray-800 hover:bg-light-highlight dark:hover:bg-gray-100 px-8 py-3 rounded-full font-semibold"
            >
              Sign Up Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 