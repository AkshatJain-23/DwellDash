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
      <section className="relative bg-gradient-to-br from-light-secondary via-light-primary to-light-accent dark:from-accent-black dark:via-primary-900 dark:to-primary-800 text-gray-800 dark:text-white transition-colors duration-300">
        <div className="absolute inset-0 bg-light-primary dark:bg-black opacity-10 dark:opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-gray-700 dark:text-accent-light">PG Accommodation</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700 dark:text-primary-200">
              Discover comfortable, affordable, and verified PG options across India. 
              Your home away from home is just a click away.
            </p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto bg-white rounded-full shadow-lg p-2 flex"
            >
              <input
                type="text"
                placeholder="Search by city, area, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 text-gray-700 bg-transparent outline-none text-lg"
              />
              <button
                type="submit"
                className="bg-light-secondary hover:bg-light-primary dark:bg-accent-dark dark:hover:bg-accent-medium text-white px-8 py-4 rounded-full flex items-center transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              {/* Show different buttons based on user role and view mode */}
              {user?.role === 'owner' && !isBrowsingAsTenant() ? (
                <button 
                  onClick={handleBrowseProperties}
                  className="btn bg-white dark:bg-white text-light-secondary dark:text-accent-dark hover:bg-light-highlight dark:hover:bg-accent-light px-6 py-3 rounded-full font-semibold"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={handleBrowseProperties}
                  className="btn bg-white dark:bg-white text-light-secondary dark:text-accent-dark hover:bg-light-highlight dark:hover:bg-accent-light px-6 py-3 rounded-full font-semibold"
                >
                  Browse All Properties
                </button>
              )}
              
              {!user && (
                <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-light-secondary dark:hover:text-accent-dark px-6 py-3 rounded-full font-semibold">
                  List Your PG
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-white dark:bg-accent-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Cities
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200">
              Explore PG accommodations in top cities across India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-light-highlight dark:bg-primary-900 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-light-primary dark:hover:bg-accent-dark"
                onClick={() => handleCityClick(city.name)}
              >
                <div className="text-4xl mb-3">{city.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{city.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{city.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light-primary dark:bg-primary-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose DwellDash?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200">
              We make finding your perfect PG simple, safe, and stress-free
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-accent-dark rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-light-accent dark:bg-accent-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-light-secondary dark:text-accent-dark" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white dark:bg-accent-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Amenities
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200">
              Enjoy world-class facilities at affordable prices
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-light-accent dark:bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="w-8 h-8 text-light-secondary dark:text-accent-dark" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{amenity.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-secondary dark:bg-accent-dark text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Building2 className="w-16 h-16 mx-auto mb-6 text-light-highlight dark:text-accent-light" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect PG?
            </h2>
            <p className="text-xl mb-8 text-white dark:text-primary-200">
              Join thousands of happy tenants who found their ideal accommodation through DwellDash
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Show different CTA buttons based on user role and view mode */}
              {user?.role === 'owner' && !isBrowsingAsTenant() ? (
                <button
                  onClick={handleBrowseProperties}
                  className="btn bg-white text-light-secondary dark:text-accent-dark hover:bg-light-highlight dark:hover:bg-accent-light px-8 py-3 rounded-full font-semibold"
                >
                  Manage Properties
                </button>
              ) : (
                <button
                  onClick={handleBrowseProperties}
                  className="btn bg-white text-light-secondary dark:text-accent-dark hover:bg-light-highlight dark:hover:bg-accent-light px-8 py-3 rounded-full font-semibold"
                >
                  Start Searching
                </button>
              )}
              
              {!user && (
                <Link
                  to="/register"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-full font-semibold"
                >
                  List Your Property
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 