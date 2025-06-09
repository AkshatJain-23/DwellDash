import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { ArrowLeft, MapPin, IndianRupee, Calendar, Phone, Mail, Users, Bed, Wifi, Car, Utensils, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import WhatsAppChat from '../components/WhatsAppChat'
import { useAuth } from '../contexts/AuthContext'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant, toggleViewMode } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/properties/${id}`)
      setProperty(response.data)
    } catch (error) {
      console.error('Failed to fetch property:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/properties" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.address}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="h-96 bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <>
                    <ImageWithFallback
                      src={property.images[currentImageIndex].startsWith('http') ? property.images[currentImageIndex] : `http://localhost:5000${property.images[currentImageIndex]}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Bed className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {property.images && property.images.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-16 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <ImageWithFallback
                          src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this PG</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity) => {
                  const IconComponent = amenityIcons[amenity]
                  return (
                    <div key={amenity} className="flex items-center">
                      {typeof IconComponent === 'string' ? (
                        <span className="mr-3 text-lg">{IconComponent}</span>
                      ) : IconComponent ? (
                        <IconComponent className="w-5 h-5 mr-3 text-green-600" />
                      ) : null}
                      <span className="text-gray-700 capitalize">
                        {amenity.replace('-', ' ')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(property.rent)}
                  </span>
                </div>
                <span className="text-gray-500">per month</span>
                {property.deposit > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    Security Deposit: {formatPrice(property.deposit)}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">
                    {property.propertyType.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Gender Preference</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                    property.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {property.gender === 'any' ? 'Co-living' : property.gender}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available From</span>
                  <span className="font-medium">
                    {formatDate(property.availableFrom)}
                  </span>
                </div>
              </div>

              {/* Contact Information - Show if user is not the owner OR if owner is browsing as tenant */}
              {(user?.id !== property.ownerId || isBrowsingAsTenant()) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
                  
                  <div className="space-y-3">
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="w-full btn-primary flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call {property.contactPhone}
                    </a>
                    
                    <button 
                      onClick={() => {
                        if (!user) {
                          navigate('/login')
                          return
                        }
                        setIsWhatsAppChatOpen(true)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.924 15.386a1 1 0 0 0-.217-.324l-3.004-3.004a1 1 0 0 0-1.414 0L15.56 12.79a.25.25 0 0 1-.354 0L12.79 10.374a.25.25 0 0 1 0-.354l.732-.732a1 1 0 0 0 0-1.414L10.518 4.87a1 1 0 0 0-1.414 0L7.69 6.284a3 3 0 0 0-.879 2.121v.001a21.496 21.496 0 0 0 6.862 15.518a3 3 0 0 0 4.243 0l1.414-1.414a1 1 0 0 0 .217-.324L20.924 15.386z"/>
                      </svg>
                      Chat with Owner
                    </button>
                  </div>

                  <div className="mt-4 text-center text-xs text-gray-500">
                    Please mention DwellDash when contacting
                  </div>
                </div>
              )}

              {/* Owner Notice - Show if user is the owner AND not browsing as tenant */}
              {user?.id === property.ownerId && !isBrowsingAsTenant() && (
                <div className="border-t pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Your Property</h3>
                    <p className="text-sm text-blue-700">
                      This is your property listing. You can edit or manage it from your dashboard.
                    </p>
                    <Link 
                      to="/dashboard" 
                      className="inline-block mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}

              {/* Tenant View Notice - Show if owner is browsing their own property as tenant */}
              {user?.id === property.ownerId && isBrowsingAsTenant() && (
                <div className="border-t pt-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-amber-800 mb-2">👀 Tenant View Mode</h3>
                    <p className="text-sm text-amber-700 mb-2">
                      You're viewing your own property as a tenant would. You can contact yourself to test the experience!
                    </p>
                    <div className="flex gap-2">
                      <Link 
                        to="/dashboard" 
                        className="text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors"
                      >
                        Manage Property
                      </Link>
                      <button 
                        onClick={toggleViewMode} 
                        className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                      >
                        Switch to Owner View
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Safety Tips</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Visit the property before making any payment</li>
                <li>• Verify the owner's identity</li>
                <li>• Read the agreement carefully</li>
                <li>• Keep copies of all documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat - Show if user is authenticated and (not the owner OR if owner is browsing as tenant) */}
      {property && user && (user?.id !== property.ownerId || isBrowsingAsTenant()) && (
        <WhatsAppChat
          isOpen={isWhatsAppChatOpen}
          onClose={() => setIsWhatsAppChatOpen(false)}
          property={property}
          ownerName={property.ownerName || 'Property Owner'}
          ownerPhone={property.contactPhone}
        />
      )}
    </div>
  )
}

export default PropertyDetail 