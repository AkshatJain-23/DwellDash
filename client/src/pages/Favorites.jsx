import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Heart, MapPin, IndianRupee, Users, Bed, Trash2, ArrowLeft, Info, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import { useAuth } from '../contexts/AuthContext'
import WhatsAppChat from '../components/WhatsAppChat'

const Favorites = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isWhatsAppChatOpen, setIsWhatsAppChatOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchFavorites()
  }, [user, navigate])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await api.get('/favorites/properties')
      setFavorites(response.data)
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (propertyId) => {
    try {
      await api.delete(`/favorites/remove/${propertyId}`)
      setFavorites(favorites.filter(fav => fav.property.id !== propertyId))
      toast.success('Property removed from favorites')
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      toast.error('Failed to remove from favorites')
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
      month: 'short',
      day: 'numeric'
    })
  }

  const handleWhatsAppChat = (property, e) => {
    e.preventDefault()
    e.stopPropagation()
    
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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to="/properties" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Properties
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-8 h-8 mr-3 text-red-500" />
                  My Favorites
                </h1>
                <p className="text-gray-600 mt-1">
                  Properties you've saved for later viewing
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing properties and click the heart icon to save your favorites for later!
            </p>
            <Link
              to="/properties"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Bed className="w-5 h-5" />
              Browse Properties
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Property Image */}
                  <div className="relative">
                    <Link to={`/property/${favorite.property.id}`}>
                      <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                        <ImageWithFallback
                          src={favorite.property.images && favorite.property.images.length > 0 ? 
                            favorite.property.images[0] : null}
                          alt={favorite.property.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          fallbackIcon={Bed}
                        />
                      </div>
                    </Link>
                    
                    {/* Remove from favorites button */}
                    <button
                      onClick={() => removeFavorite(favorite.property.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors group"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current group-hover:text-red-600" />
                    </button>

                    {/* Property type badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        favorite.property.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                        favorite.property.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {favorite.property.gender === 'any' ? 'Co-living' : favorite.property.gender}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <Link to={`/property/${favorite.property.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {favorite.property.title}
                      </h3>
                    </Link>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{favorite.property.city}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {favorite.property.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(favorite.property.rent)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/month</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {favorite.property.propertyType?.replace('-', ' ')}
                      </div>
                    </div>

                    {/* Date added */}
                    <div className="text-xs text-gray-500 mb-4">
                      Saved on {formatDate(favorite.addedAt)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/property/${favorite.property.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Info className="w-4 h-4" />
                        View Details
                      </Link>

                      <button
                        onClick={(e) => handleWhatsAppChat(favorite.property, e)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>

                      <button
                        onClick={() => removeFavorite(favorite.property.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* WhatsApp Chat */}
      {selectedProperty && user && (
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

export default Favorites 