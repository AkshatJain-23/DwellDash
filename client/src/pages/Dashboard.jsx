import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import { Plus, Edit, Trash2, Eye, Building, Users, IndianRupee, MapPin, Bed, Heart, Search, Clock, TrendingUp, MessageCircle, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'

const Dashboard = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [favoriteProperties, setFavoriteProperties] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [tenantStats, setTenantStats] = useState({
    totalFavorites: 0,
    totalSearches: 0,
    messagesCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0
  })

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchOwnerProperties()
    } else if (user?.role === 'tenant') {
      fetchTenantData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchOwnerProperties = async () => {
    setLoading(true)
    try {
      const response = await api.get('/properties/owner/my-properties')
      setProperties(response.data)
      setStats({
        totalProperties: response.data.length,
        activeProperties: response.data.filter(p => p.isActive).length,
        totalViews: response.data.reduce((total, p) => total + (p.views || 0), 0)
      })
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      toast.error('Failed to load your properties')
    } finally {
      setLoading(false)
    }
  }

  const fetchTenantData = async () => {
    setLoading(true)
    try {
      // Fetch favorites
      const favoritesResponse = await api.get('/favorites')
      console.log('📊 Dashboard: Favorites response received');
      console.log('Favorites count:', favoritesResponse.data.length);
      
      if (favoritesResponse.data.length > 0) {
        console.log('First favorite structure:', favoritesResponse.data[0]);
        console.log('First favorite property:', favoritesResponse.data[0].property);
        
        // Map the favorites to extract property data
        const favoritePropertiesData = favoritesResponse.data.map(fav => {
          const property = fav.property;
          console.log(`Property ID mapping: _id=${property._id}, id=${property.id}`);
          return {
            ...property,
            id: property.id || property._id, // Fallback to _id if id is not available
            _id: property._id // Keep the original _id for reference
          };
        });
        
        console.log('Mapped favorite properties:', favoritePropertiesData.map(p => ({ 
          title: p.title, 
          id: p.id, 
          _id: p._id 
        })));
        
        setFavoriteProperties(favoritePropertiesData);
      } else {
        setFavoriteProperties([]);
      }
      
      // Fetch recent searches from localStorage
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      setRecentSearches(searches.slice(0, 5)) // Show last 5 searches
      
      // Fetch messages count (conversations where user participated)
      let messagesCount = 0
      try {
        const conversationsResponse = await api.get('/conversations')
        messagesCount = conversationsResponse.data.length
      } catch (error) {
        console.log('Messages data not available')
      }
      
      setTenantStats({
        totalFavorites: favoritesResponse.data.length,
        totalSearches: searches.length,
        messagesCount: messagesCount
      })
      
    } catch (error) {
      console.error('Failed to fetch tenant data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      await api.delete(`/properties/${propertyId}`)
      setProperties(properties.filter(p => p.id !== propertyId))
      toast.success('Property deleted successfully')
    } catch (error) {
      console.error('Failed to delete property:', error)
      toast.error('Failed to delete property')
    }
  }

  const handleRemoveFromFavorites = async (propertyId) => {
    try {
      console.log('🗑️ Dashboard: Attempting to remove property from favorites');
      console.log('Property ID received:', propertyId);
      console.log('Property ID type:', typeof propertyId);
      
      // Try to find the property in our current favorites to get the correct ID
      const targetProperty = favoriteProperties.find(p => p.id === propertyId || p._id === propertyId);
      if (targetProperty) {
        console.log('Found target property:', targetProperty.title);
        console.log('Target property _id:', targetProperty._id);
        console.log('Target property id:', targetProperty.id);
      } else {
        console.log('⚠️ Target property not found in current favorites');
        console.log('Available favorites:', favoriteProperties.map(p => ({ id: p.id, _id: p._id, title: p.title })));
      }
      
      // Try with the MongoDB _id first (more reliable), then fallback to the provided ID
      const idToUse = targetProperty?._id || propertyId;
      console.log('Using ID for removal:', idToUse);
      
      await api.delete(`/favorites/${idToUse}`)
      
      // Filter using both id and _id to be safe
      setFavoriteProperties(favoriteProperties.filter(p => p.id !== propertyId && p._id !== propertyId))
      setTenantStats(prev => ({ ...prev, totalFavorites: prev.totalFavorites - 1 }))
      toast.success('Removed from favorites')
      
      console.log('✅ Successfully removed from favorites');
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
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

  const saveSearch = (query) => {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const newSearch = {
      query,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
    const updatedSearches = [newSearch, ...searches.filter(s => s.query !== query)].slice(0, 10)
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {user?.role === 'owner' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeProperties}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Properties Section */}
            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
                  <Link
                    to="/add-property"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {properties.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first property listing</p>
                    <Link to="/add-property" className="btn-primary">
                      Add Your First Property
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {properties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-48 bg-gray-200 relative">
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
                              property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {property.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                          
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.city}</span>
                          </div>

                          <div className="flex items-center mb-4">
                            <IndianRupee className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(property.rent)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/month</span>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/properties/${property.id}`}
                              className="btn-outline flex-1 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                            
                            <Link
                              to={`/edit-property/${property.id}`}
                              className="btn-outline flex-1 flex items-center justify-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="btn border border-red-300 text-red-700 hover:bg-red-50 flex-1 flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Enhanced Tenant Dashboard
          <>
            {/* Tenant Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Favorite Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{tenantStats.totalFavorites}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Searches</p>
                    <p className="text-2xl font-bold text-gray-900">{tenantStats.totalSearches}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Conversations</p>
                    <p className="text-2xl font-bold text-gray-900">{tenantStats.messagesCount}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/properties"
                  className="flex items-center justify-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                  <Search className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Browse Properties</span>
                </Link>
                
                <Link
                  to="/properties?favorites=true"
                  className="flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                >
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-700">View Favorites</span>
                </Link>
                
                <Link
                  to="/conversations"
                  className="flex items-center justify-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Messages</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Favorite Properties */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Favorite Properties</h2>
                    <Link to="/properties?favorites=true" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {favoriteProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">No favorite properties yet</p>
                      <Link to="/properties" className="btn-primary">
                        Start Browsing
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {favoriteProperties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex gap-4 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={property.images && property.images.length > 0 ? 
                                (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`) 
                                : null}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              fallbackIcon={Bed}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{property.city}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-green-600">{formatPrice(property.rent)}/month</span>
                              <div className="flex gap-2">
                                <Link
                                  to={`/properties/${property.id}`}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => handleRemoveFromFavorites(property.id)}
                                  className="text-red-600 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Searches */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
                </div>
                
                <div className="p-6">
                  {recentSearches.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">No recent searches</p>
                      <Link to="/properties" className="btn-primary">
                        Start Searching
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentSearches.map((search) => (
                        <div key={search.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{search.query || 'All Properties'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{new Date(search.timestamp).toLocaleDateString()}</span>
                            <Link
                              to={`/properties?search=${encodeURIComponent(search.query || '')}`}
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => saveSearch(search.query)}
                            >
                              Search Again
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">💡 Tips for Finding Your Perfect PG</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Save properties to favorites for easy comparison</li>
                    <li>• Use specific location searches to find PGs near your workplace/college</li>
                    <li>• Contact property owners directly through our chat feature</li>
                    <li>• Check multiple photos and read descriptions carefully</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard 