import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Search, Filter, MapPin, IndianRupee, Users, Bed, Wifi, Car, Utensils, Shield, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import CityInput from '../components/CityInput'
import WhatsAppChat from '../components/WhatsAppChat'
import PropertyCard from '../components/PropertyCard'
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
    biometric: '👆',
    rooftop: '🏠',
    gaming: '🎮',
    library: '📚',
    balcony: '🌿',
    'beach-access': '🏖️'
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

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {properties.length} of {pagination.totalCount} properties
            </div>
            {properties.length > 0 && (
              <div className="text-sm text-gray-500">
                💡 Click any property to expand details, or use "View Full Details" for complete information
              </div>
            )}
          </div>
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
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onWhatsAppChat={handleWhatsAppChat}
                amenityIcons={amenityIcons}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams)
                    newParams.set('page', page.toString())
                    setSearchParams(newParams)
                  }}
                  className={`px-3 py-2 text-sm rounded-md ${
                    page === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* WhatsApp Chat */}
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