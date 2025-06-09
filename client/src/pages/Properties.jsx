import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Search, Filter, MapPin, IndianRupee, Users, Bed, Wifi, Car, Utensils, Shield, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import CityInput from '../components/CityInput'
import WhatsAppChat from '../components/WhatsAppChat'
import { POPULAR_CITIES, PROPERTY_TYPES, GENDER_PREFERENCES } from '../utils/constants'
import { useAuth } from '../contexts/AuthContext'

const Properties = () => {
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    propertyType: searchParams.get('propertyType') || '',
    gender: searchParams.get('gender') || '',
    amenities: searchParams.get('amenities') || ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isWhatsAppChatOpen, setIsWhatsAppChatOpen] = useState(false)

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    meals: Utensils,
    security: Shield,
    ac: '❄️',
    laundry: '🧺',
    gym: '💪',
    'swimming-pool': '🏊',
    'power-backup': '🔋',
    shuttle: '🚌',
    housekeeping: '🧹',
    'study-area': '📚',
    cctv: '📹',
    biometric: '👆'
  }

  useEffect(() => {
    fetchProperties()
  }, [searchParams])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams)
      const response = await api.get(`/properties?${params.toString()}`)
      setProperties(response.data.properties)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      })
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v)
    })
    setSearchParams(newSearchParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    handleFilterChange('search', filters.search)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minRent: '',
      maxRent: '',
      propertyType: '',
      gender: '',
      amenities: ''
    })
    setSearchParams({})
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleWhatsAppChat = (property, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      navigate('/login')
      return
    }
    
    setSelectedProperty(property)
    setIsWhatsAppChatOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect PG</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by city, area, or landmark..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-10 w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-4 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <CityInput
                    value={filters.city}
                    onChange={(value) => handleFilterChange('city', value)}
                    placeholder="Enter city name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent</label>
                  <input
                    type="number"
                    placeholder="₹ 5,000"
                    value={filters.minRent}
                    onChange={(e) => handleFilterChange('minRent', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent</label>
                  <input
                    type="number"
                    placeholder="₹ 50,000"
                    value={filters.maxRent}
                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="input"
                  >
                    <option value="">All Types</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="input"
                  >
                    <option value="">Any</option>
                    {GENDER_PREFERENCES.map((preference) => (
                      <option key={preference.value} value={preference.value}>
                        {preference.value === 'any' ? 'Co-living (Any)' : preference.label.replace(' Only', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all filters
                </button>
                <div className="text-sm text-gray-600">
                  {pagination.totalCount} properties found
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Bed className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/properties/${property.id}`} className="block">
                  <div className="property-card">
                    {/* Property Image */}
                    <div className="h-48 bg-gray-200 rounded-t-lg relative overflow-hidden">
                      <ImageWithFallback
                        src={property.images && property.images.length > 0 ? 
                          (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`) 
                          : null}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        fallbackIcon={Bed}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                          property.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {property.gender === 'any' ? 'Co-living' : property.gender}
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {property.title}
                        </h3>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.city}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {formatPrice(property.rent)}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">/month</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {property.propertyType.replace('-', ' ')}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities?.slice(0, 4).map((amenity) => {
                          const IconComponent = amenityIcons[amenity]
                          return (
                            <div
                              key={amenity}
                              className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600"
                            >
                              {typeof IconComponent === 'string' ? (
                                <span className="mr-1">{IconComponent}</span>
                              ) : IconComponent ? (
                                <IconComponent className="w-3 h-3 mr-1" />
                              ) : null}
                              {amenity.replace('-', ' ')}
                            </div>
                          )
                        })}
                        {property.amenities?.length > 4 && (
                          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600">
                            +{property.amenities.length - 4} more
                          </div>
                        )}
                      </div>

                      {/* Chat with Owner Button - Show if user is not the owner OR if owner is browsing as tenant */}
                      {(user?.id !== property.ownerId || isBrowsingAsTenant()) ? (
                        <button
                          onClick={(e) => handleWhatsAppChat(property, e)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.924 15.386a1 1 0 0 0-.217-.324l-3.004-3.004a1 1 0 0 0-1.414 0L15.56 12.79a.25.25 0 0 1-.354 0L12.79 10.374a.25.25 0 0 1 0-.354l.732-.732a1 1 0 0 0 0-1.414L10.518 4.87a1 1 0 0 0-1.414 0L7.69 6.284a3 3 0 0 0-.879 2.121v.001a21.496 21.496 0 0 0 6.862 15.518a3 3 0 0 0 4.243 0l1.414-1.414a1 1 0 0 0 .217-.324L20.924 15.386z"/>
                          </svg>
                          Chat with Owner
                        </button>
                      ) : (
                        <div className="w-full bg-blue-100 text-blue-800 font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          Your Property
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Chat - Show if user is authenticated and (not the owner OR if owner is browsing as tenant) */}
      {selectedProperty && user && (user?.id !== selectedProperty.ownerId || isBrowsingAsTenant()) && (
        <WhatsAppChat
          isOpen={isWhatsAppChatOpen}
          onClose={() => {
            setIsWhatsAppChatOpen(false)
            setSelectedProperty(null)
          }}
          property={selectedProperty}
          ownerName={selectedProperty.ownerName || 'Property Owner'}
          ownerPhone={selectedProperty.contactPhone}
        />
      )}
    </div>
  )
}

export default Properties 