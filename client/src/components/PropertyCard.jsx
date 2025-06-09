import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, IndianRupee, Users, Bed, Eye, Star, Calendar, ArrowRight, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageWithFallback from './ImageWithFallback'
import { useAuth } from '../contexts/AuthContext'

const PropertyCard = ({ property, index, onWhatsAppChat, amenityIcons }) => {
  const navigate = useNavigate()
  const { user, isBrowsingAsTenant } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
      month: 'short',
      day: 'numeric'
    })
  }

  const handleCardClick = (e) => {
    // Don't expand if user clicked on a button or link
    if (e.target.closest('button') || e.target.closest('a')) {
      return
    }
    setIsExpanded(true)
  }

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`)
  }

  const handleContactOwner = (e) => {
    e.stopPropagation()
    onWhatsAppChat(property, e)
  }

  const canContact = user?.id !== property.ownerId || isBrowsingAsTenant()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="property-card cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Property Image */}
        <div className="h-48 bg-gray-200 rounded-t-lg relative overflow-hidden">
          <ImageWithFallback
            src={property.images && property.images.length > 0 ? 
              (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`) 
              : null}
            alt={property.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
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
          
          {/* Featured Badge (for future verification system) */}
          {property.isFeatured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}
          
          {/* Verified Badge (for future verification system) */}
          {property.isVerified && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✓ Verified
              </span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-md font-medium shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Quick View
            </button>
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
              className="flex-1 btn-outline flex items-center justify-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            
            {canContact ? (
              <button
                onClick={handleContactOwner}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.924 15.386a1 1 0 0 0-.217-.324l-3.004-3.004a1 1 0 0 0-1.414 0L15.56 12.79a.25.25 0 0 1-.354 0L12.79 10.374a.25.25 0 0 1 0-.354l.732-.732a1 1 0 0 0 0-1.414L10.518 4.87a1 1 0 0 0-1.414 0L7.69 6.284a3 3 0 0 0-.879 2.121v.001a21.496 21.496 0 0 0 6.862 15.518a3 3 0 0 0 4.243 0l1.414-1.414a1 1 0 0 0 .217-.324L20.924 15.386z"/>
                </svg>
                Contact
              </button>
            ) : (
              <div className="flex-1 bg-blue-100 text-blue-800 font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Your Property
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Images and Details */}
                <div className="lg:col-span-2">
                  {/* Image Gallery */}
                  <div className="mb-6">
                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                      {property.images && property.images.length > 0 ? (
                        <>
                          <ImageWithFallback
                            src={property.images[currentImageIndex].startsWith('http') ? 
                              property.images[currentImageIndex] : 
                              `http://localhost:5000${property.images[currentImageIndex]}`}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          {property.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                              <div className="flex space-x-2">
                                {property.images.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full ${
                                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bed className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {property.images && property.images.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto">
                        {property.images.map((image, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                              idx === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                            }`}
                          >
                            <ImageWithFallback
                              src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                              alt={`${property.title} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About this PG</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>

                  {/* All Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
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
                <div>
                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center mb-4">
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
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3 mb-6">
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

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{property.city}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleViewDetails}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      View Full Details
                    </button>
                    
                    {canContact && (
                      <>
                        <a
                          href={`tel:${property.contactPhone}`}
                          className="w-full btn-outline flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call Owner
                        </a>
                        
                        <button
                          onClick={handleContactOwner}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.924 15.386a1 1 0 0 0-.217-.324l-3.004-3.004a1 1 0 0 0-1.414 0L15.56 12.79a.25.25 0 0 1-.354 0L12.79 10.374a.25.25 0 0 1 0-.354l.732-.732a1 1 0 0 0 0-1.414L10.518 4.87a1 1 0 0 0-1.414 0L7.69 6.284a3 3 0 0 0-.879 2.121v.001a21.496 21.496 0 0 0 6.862 15.518a3 3 0 0 0 4.243 0l1.414-1.414a1 1 0 0 0 .217-.324L20.924 15.386z"/>
                          </svg>
                          Chat with Owner
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PropertyCard 