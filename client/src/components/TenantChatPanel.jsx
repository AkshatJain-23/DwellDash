import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MessageCircle, Send, User, Phone, Mail, Clock, Eye, ArrowLeft, CheckCheck, Building, Info, MapPin, IndianRupee, Bed, Bath, Wifi, Car, Utensils, Shield, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import ImageWithFallback from './ImageWithFallback'

const TenantChatPanel = ({ tenantId, tenantEmail, tenantName }) => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState(null)
  const [loadingProperty, setLoadingProperty] = useState(false)
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadConversations: 0
  })
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm()

  const messageValue = watch('message')

  useEffect(() => {
    if (tenantEmail) {
      fetchConversations()
      fetchStats()
    }
  }, [tenantEmail])

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/messages/conversations/tenant/${encodeURIComponent(tenantEmail)}`)
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
      // Show empty state instead of error for tenants
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get(`/messages/tenant-stats/${encodeURIComponent(tenantEmail)}`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats({ totalConversations: 0, unreadConversations: 0 })
    }
  }

  const fetchConversationDetails = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`)
      setSelectedConversation(response.data)
      
      // Mark messages as read
      await api.patch(`/messages/conversations/${conversationId}/read`, {
        readerId: tenantEmail
      })
      
      // Update local conversation list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
      
      // Update stats
      fetchStats()

      // Clear any related notifications (they will be refreshed in the next poll cycle)
      // This helps ensure notifications disappear when user opens the chat
      
    } catch (error) {
      console.error('Failed to fetch conversation details:', error)
      toast.error('Failed to load conversation')
    }
  }

  const fetchPropertyDetails = async (propertyId) => {
    try {
      setLoadingProperty(true)
      const response = await api.get(`/properties/${propertyId}`)
      setPropertyDetails(response.data)
      setShowPropertyDetails(true)
    } catch (error) {
      console.error('Failed to fetch property details:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoadingProperty(false)
    }
  }

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    
    if (!data.message.trim() || !selectedConversation) {
      console.log('Form validation failed:', { message: data.message, conversation: selectedConversation })
      return
    }

    setSending(true)
    console.log('Sending message to conversation:', selectedConversation.id)
    
    try {
      await api.post('/messages/reply', {
        conversationId: selectedConversation.id,
        tenantEmail: tenantEmail,
        tenantName: tenantName,
        message: data.message,
        sender: 'tenant'
      })

      // Add message to local state immediately
      const newMessage = {
        id: Date.now().toString() + '_tenant_local',
        text: data.message,
        sender: 'tenant',
        senderName: tenantName,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }

      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessageAt: new Date().toISOString()
      }))

      // Update conversation in list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: newMessage,
                lastMessageAt: new Date().toISOString()
              }
            : conv
        ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      )

      reset()
      toast.success('Message sent!')
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const quickReplies = [
    "I'm very interested in this property!",
    "When can I schedule a visit?",
    "What's included in the rent?",
    "Are there any additional charges?",
    "I'm interested. Please call me at your convenience to discuss the details."
  ]

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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden" data-role="chat-panel" id="messages-section">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedConversation ? (
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : null}
              <MessageCircle className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedConversation ? 'Chat with Owner' : 'My Conversations'}
                </h2>
                {selectedConversation && (
                  <p className="text-green-100 text-sm">
                    {selectedConversation.ownerName} • {selectedConversation.propertyTitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedConversation && (
                <button
                  onClick={() => fetchPropertyDetails(selectedConversation.propertyId)}
                  disabled={loadingProperty}
                  className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                  title="View Property Details"
                >
                  {loadingProperty ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Property Details</span>
                </button>
              )}
              {!selectedConversation && (
                <div className="flex gap-4 text-sm">
                  <div className="text-green-100">
                    Total: <span className="font-medium text-white">{stats.totalConversations}</span>
                  </div>
                  {stats.unreadConversations > 0 && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      {stats.unreadConversations} unread
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {!selectedConversation ? (
          // Conversations List
          <div className="max-h-96 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600">Start chatting with property owners to see your conversations here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      conversation.unreadCount > 0 ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                    }`}
                    onClick={() => fetchConversationDetails(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.ownerName}
                          </h3>
                          <div className="flex items-center gap-2">
                            {conversation.unreadCount > 0 && (
                              <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                                {conversation.unreadCount}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-2">
                          Property: {conversation.propertyTitle}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-700 truncate">
                            <span className="font-medium">
                              {conversation.lastMessage.sender === 'tenant' ? 'You: ' : ''}
                            </span>
                            {conversation.lastMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Chat Interface
          <div className="h-96 flex flex-col">
            {/* Owner Info */}
            <div className="bg-gray-50 border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedConversation.ownerName}</h4>
                    <p className="text-sm text-gray-600 line-clamp-1">{selectedConversation.propertyTitle}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedConversation.ownerEmail}`}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4 text-green-600" />
                  </a>
                  {selectedConversation.ownerPhone && (
                    <a
                      href={`tel:${selectedConversation.ownerPhone}`}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                      title="Call Owner"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {selectedConversation.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'tenant' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    message.sender === 'tenant'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-900 shadow-sm border'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className={`flex items-center justify-end mt-1 text-xs ${
                      message.sender === 'tenant' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatMessageTime(message.timestamp)}</span>
                      {message.sender === 'tenant' && (
                        <CheckCheck className="w-3 h-3 ml-1" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="border-t bg-white px-4 py-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickReplies.slice(0, 4).map((reply, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setValue('message', reply)
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }}
                    className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {reply.length > 30 ? reply.substring(0, 30) + '...' : reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <input
                  {...register('message', { required: 'Message is required' })}
                  ref={(e) => {
                    register('message').ref(e)
                    inputRef.current = e
                  }}
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(onSubmit)()
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !messageValue?.trim()}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={sending ? "Sending..." : "Send message"}
                  onClick={(e) => {
                    console.log('Send button clicked', { messageValue, sending })
                  }}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              {errors.message && (
                <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      <AnimatePresence>
        {showPropertyDetails && propertyDetails && (
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
                  src={propertyDetails.images && propertyDetails.images.length > 0 ? 
                    (propertyDetails.images[0].startsWith('http') ? propertyDetails.images[0] : propertyDetails.images[0]) 
                    : null}
                  alt={propertyDetails.title}
                  className="w-full h-full object-cover"
                  fallbackIcon={Building}
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                  {propertyDetails.gender === 'any' ? 'Co-living' : propertyDetails.gender}
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
                  {propertyDetails.images?.length || 1} Photo{propertyDetails.images?.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                {/* Title and Location */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{propertyDetails.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{propertyDetails.fullAddress || propertyDetails.address || `${propertyDetails.area || propertyDetails.city}, ${propertyDetails.city}`}</span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-6">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(propertyDetails.rent)}
                  </span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                {/* Property Type Tags */}
                <div className="flex gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {propertyDetails.propertyType?.replace('-', ' ') || 'flat'}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {propertyDetails.gender === 'any' ? 'Co-living' : propertyDetails.gender}
                  </span>
                </div>

                {/* Description */}
                {propertyDetails.description && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{propertyDetails.description}</p>
                  </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner Contact */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Owner Contact</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <User className="w-4 h-4 mr-3" />
                        <span className="font-medium">{propertyDetails.ownerName || 'Owner Name Not Available'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-3" />
                        {propertyDetails.contactNumber || propertyDetails.contactPhone ? (
                          <a 
                            href={`tel:${propertyDetails.contactNumber || propertyDetails.contactPhone}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {propertyDetails.contactNumber || propertyDetails.contactPhone}
                          </a>
                        ) : (
                          <span className="text-gray-500">No contact available</span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-4 h-4 mr-3" />
                        {propertyDetails.ownerEmail && propertyDetails.ownerEmail !== 'No email available' && propertyDetails.ownerEmail !== 'No email' ? (
                          <a 
                            href={`mailto:${propertyDetails.ownerEmail}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {propertyDetails.ownerEmail}
                          </a>
                        ) : (
                          <span className="text-gray-500">No email available</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Property Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="font-medium capitalize">{propertyDetails.propertyType?.replace('-', ' ') || 'flat'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender Preference</p>
                        <p className="font-medium capitalize">{propertyDetails.gender === 'any' ? 'Co-living' : propertyDetails.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{propertyDetails.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-medium">{propertyDetails.area || propertyDetails.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {propertyDetails.amenities && propertyDetails.amenities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyDetails.amenities.map((amenity, index) => (
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
                  <button
                    onClick={() => setShowPropertyDetails(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Chat
                  </button>
                  
                  <a
                    href={`mailto:${propertyDetails.ownerEmail}?subject=Inquiry about ${propertyDetails.title}&body=Hi ${propertyDetails.ownerName}, I'm interested in your property: ${propertyDetails.title}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Owner
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TenantChatPanel