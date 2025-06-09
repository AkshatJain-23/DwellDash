import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import { Plus, Edit, Trash2, Eye, Building, Users, IndianRupee, MapPin, Bed, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import MessagesPanel from '../components/MessagesPanel'
import OwnerChatPanel from '../components/OwnerChatPanel'
import TenantChatPanel from '../components/TenantChatPanel'
import UserSettings from '../components/UserSettings'

const Dashboard = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0
  })

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchOwnerProperties()
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
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

                {/* Messages Section */}
                <OwnerChatPanel ownerId={user?.id} ownerName={user?.name} />

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
                                  to={`/property/${property.id}`}
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
              // Tenant Dashboard
              <>
                {/* Tenant Chat Section */}
                <TenantChatPanel 
                  tenantId={user?.id} 
                  tenantEmail={user?.email} 
                  tenantName={user?.name} 
                />

                {/* Tenant Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to DwellDash!</h2>
                    <p className="text-gray-600 mb-6">
                      Find your perfect PG accommodation with our comprehensive listings
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/properties" className="btn-primary">
                        Browse Properties
                      </Link>
                      <Link to="/properties?search=" className="btn-outline">
                        Search by Location
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UserSettings />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 