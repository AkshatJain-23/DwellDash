import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Search, Filter, MapPin, IndianRupee, Users, Bed, Wifi, Car, Utensils, Shield, Mail, Info, Phone, User, Bath, X, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import CityInput from '../components/CityInput'
import WhatsAppChat from '../components/WhatsAppChat'
import { POPULAR_CITIES, PROPERTY_TYPES, GENDER_PREFERENCES } from '../utils/constants'
import { useAuth } from '../contexts/AuthContext'
import FavoriteButton from '../components/FavoriteButton'

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
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [propertyDetailsData, setPropertyDetailsData] = useState(null)
  const [loadingPropertyDetails, setLoadingPropertyDetails] = useState(false)

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

  const handlePropertyClick = async (property, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      setLoadingPropertyDetails(true)
      const response = await api.get(`/properties/${property.id}`)
      setPropertyDetailsData(response.data)
      setShowPropertyDetails(true)
    } catch (error) {
      console.error('Failed to fetch property details:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoadingPropertyDetails(false)
    }
  }

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="w-4 h-4" />
    if (amenity.toLowerCase().includes('parking')) return <Car className="w-4 h-4" />
    if (amenity.toLowerCase().includes('food') || amenity.toLowerCase().includes('meal')) return <Utensils className="w-4 h-4" />
    if (amenity.toLowerCase().includes('security')) return <Shield className="w-4 h-4" />
    if (amenity.toLowerCase().includes('bathroom')) return <Bath className="w-4 h-4" />
    return <Bed className="w-4 h-4" />
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
                <div className="property-card cursor-pointer">
                  {/* Property Image - Clickable for details */}
                  <div 
                    className="h-48 bg-gray-200 rounded-t-lg relative overflow-hidden hover:opacity-90 transition-opacity"
                    onClick={(e) => handlePropertyClick(property, e)}
                  >
                    <ImageWithFallback
                      src={property.images && property.images.length > 0 ? 
                        (property.images[0].startsWith('http') ? property.images[0] : property.images[0]) 
                        : null}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      fallbackIcon={Bed}
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <button
                        onClick={(e) => handlePropertyClick(property, e)}
                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <div className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-white transition-all">
                        <FavoriteButton 
                          propertyId={property.id} 
                          className=""
                          size="w-4 h-4"
                        />
                      </div>
                    </div>
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
                    <div 
                      className="flex items-start justify-between mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={(e) => handlePropertyClick(property, e)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {property.title}
                      </h3>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.city}</span>
                    </div>

                    <p 
                      className="text-gray-600 text-sm mb-3 line-clamp-2 cursor-pointer hover:text-gray-800 transition-colors"
                      onClick={(e) => handlePropertyClick(property, e)}
                    >
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handlePropertyClick(property, e)}
                        disabled={loadingPropertyDetails}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        {loadingPropertyDetails ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                        View Details
                      </button>

                      {/* Chat with Owner Button - Show if user is not the owner OR if owner is browsing as tenant */}
                      {(user?.id !== property.ownerId || isBrowsingAsTenant()) ? (
                        user ? (
                          <button
                            onClick={(e) => handleWhatsAppChat(property, e)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.924 15.386a1 1 0 0 0-.217-.324l-3.004-3.004a1 1 0 0 0-1.414 0L15.56 12.79a.25.25 0 0 1-.354 0L12.79 10.374a.25.25 0 0 1 0-.354l.732-.732a1 1 0 0 0 0-1.414L10.518 4.87a1 1 0 0 0-1.414 0L7.69 6.284a3 3 0 0 0-.879 2.121v.001a21.496 21.496 0 0 0 6.862 15.518a3 3 0 0 0 4.243 0l1.414-1.414a1 1 0 0 0 .217-.324L20.924 15.386z"/>
                            </svg>
                            Chat
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            Login to Chat
                          </button>
                        )
                      ) : (
                        <div className="flex-1 bg-blue-100 text-blue-800 font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          Your Property
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      <AnimatePresence>
        {showPropertyDetails && propertyDetailsData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPropertyDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
                <button
                  onClick={() => setShowPropertyDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Property Images */}
              <div className="h-64 bg-gray-200 relative">
                <ImageWithFallback
                  src={propertyDetailsData.images && propertyDetailsData.images.length > 0 ? 
                    (propertyDetailsData.images[0].startsWith('http') ? propertyDetailsData.images[0] : propertyDetailsData.images[0]) 
                    : null}
                  alt={propertyDetailsData.title}
                  className="w-full h-full object-cover"
                  fallbackIcon={Bed}
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                  {propertyDetailsData.gender === 'any' ? 'Co-living' : propertyDetailsData.gender}
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
                  {propertyDetailsData.images?.length || 1} Photo{propertyDetailsData.images?.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                {/* Title and Location */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{propertyDetailsData.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{propertyDetailsData.fullAddress || propertyDetailsData.address || `${propertyDetailsData.area || propertyDetailsData.city}, ${propertyDetailsData.city}`}</span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-6">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(propertyDetailsData.rent)}
                  </span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                {/* Property Type Tags */}
                <div className="flex gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {propertyDetailsData.propertyType?.replace('-', ' ') || 'flat'}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {propertyDetailsData.gender === 'any' ? 'Co-living' : propertyDetailsData.gender}
                  </span>
                </div>

                {/* Description */}
                {propertyDetailsData.description && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{propertyDetailsData.description}</p>
                  </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner Contact */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Owner Contact</h4>
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <User className="w-4 h-4 mr-3" />
                          <span className="font-medium">{propertyDetailsData.ownerName || 'Owner Name Not Available'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Phone className="w-4 h-4 mr-3" />
                          {propertyDetailsData.contactNumber || propertyDetailsData.contactPhone ? (
                            <a 
                              href={`tel:${propertyDetailsData.contactNumber || propertyDetailsData.contactPhone}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {propertyDetailsData.contactNumber || propertyDetailsData.contactPhone}
                            </a>
                          ) : (
                            <span className="text-gray-500">No contact available</span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Mail className="w-4 h-4 mr-3" />
                          {propertyDetailsData.ownerEmail && propertyDetailsData.ownerEmail !== 'No email available' && propertyDetailsData.ownerEmail !== 'No email' ? (
                            <a 
                              href={`mailto:${propertyDetailsData.ownerEmail}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {propertyDetailsData.ownerEmail}
                            </a>
                          ) : (
                            <span className="text-gray-500">No email available</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-gray-600 text-sm mb-3">
                          Sign in to view owner contact details
                        </p>
                        <Link
                          to="/login"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Login to view contacts →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Property Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="font-medium capitalize">{propertyDetailsData.propertyType?.replace('-', ' ') || 'flat'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender Preference</p>
                        <p className="font-medium capitalize">{propertyDetailsData.gender === 'any' ? 'Co-living' : propertyDetailsData.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{propertyDetailsData.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-medium">{propertyDetailsData.area || propertyDetailsData.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {propertyDetailsData.amenities && propertyDetailsData.amenities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyDetailsData.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          {getAmenityIcon(amenity)}
                          <span className="ml-2 capitalize">{amenity.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Link
                    to={`/property/${propertyDetailsData.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Full Details
                  </Link>
                  
                  {(user?.id !== propertyDetailsData.ownerId || isBrowsingAsTenant()) && (
                    user ? (
                      <button
                        onClick={() => {
                          setShowPropertyDetails(false)
                          handleWhatsAppChat(propertyDetailsData, { preventDefault: () => {}, stopPropagation: () => {} })
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.924 15.386a1 1 0 0 0-.217-.324l-3.004-3.004a1 1 0 0 0-1.414 0L15.56 12.79a.25.25 0 0 1-.354 0L12.79 10.374a.25.25 0 0 1 0-.354l.732-.732a1 1 0 0 0 0-1.414L10.518 4.87a1 1 0 0 0-1.414 0L7.69 6.284a3 3 0 0 0-.879 2.121v.001a21.496 21.496 0 0 0 6.862 15.518a3 3 0 0 0 4.243 0l1.414-1.414a1 1 0 0 0 .217-.324L20.924 15.386z"/>
                        </svg>
                        Chat with Owner
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowPropertyDetails(false)
                          navigate('/login')
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Login to Chat
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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