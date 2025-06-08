import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { X, Send, Phone, Video, MoreVertical, Paperclip, Smile, Mic, Building2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

const WhatsAppChat = ({ isOpen, onClose, property, ownerName, ownerPhone }) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickMessages, setShowQuickMessages] = useState(false)

  const { user } = useAuth()
  const messagesEndRef = useRef(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm()

  const messageValue = watch('message')

  const quickMessageCategories = {
    "💬 General": [
      "Hello! I'm interested in this property.",
      "Is this property still available?",
      "Can we schedule a viewing?",
      "Thank you for the quick response!"
    ],
    "💰 Pricing": [
      "What are the monthly charges including all fees?",
      "What's the security deposit amount?",
      "Are there any additional charges?",
      "Is the rent negotiable?"
    ],
    "🏠 Property Details": [
      "Can you share more photos of the room and common areas?",
      "What amenities are included in the rent?",
      "What's the gender preference for this PG?",
      "Are there any age restrictions?"
    ],
    "📋 Rules & Policies": [
      "What are the house rules and timings?",
      "Are pets allowed in this PG?",
      "What's the minimum lease period?",
      "What's the notice period for vacating?"
    ],
    "🚗 Location & Facilities": [
      "What's the parking situation?",
      "Is WiFi included and what's the speed?",
      "Is food included or available separately?",
      "What's the nearest metro/bus station?"
    ],
    "📅 Visit & References": [
      "Can I visit this weekend?",
      "What time would be convenient for a visit?",
      "Can you provide references from current tenants?",
      "Can we arrange a video call tour?"
    ]
  }

  const [selectedCategory, setSelectedCategory] = useState("💬 General")

  useEffect(() => {
    if (isOpen && property) {
      loadChatHistory()
    }
  }, [isOpen, property])



  const loadChatHistory = async () => {
    try {
      // Try to load existing chat history from localStorage first
      const chatKey = `chat_${property.id}_${user?.id}`
      const savedChat = localStorage.getItem(chatKey)
      
      if (savedChat) {
        const parsedMessages = JSON.parse(savedChat)
        setMessages(parsedMessages)
      } else {
        // Initialize with a welcome message from owner if no history exists
        const welcomeMessages = [
          {
            id: 1,
            text: `Hello! Thanks for your interest in my property "${property?.title}". How can I help you?`,
            sender: 'owner',
            timestamp: new Date(),
            status: 'read'
          },
          {
            id: 2,
            text: `I'm available to answer questions about rent, amenities, viewing schedule, or anything else you'd like to know! 😊`,
            sender: 'owner',
            timestamp: new Date(Date.now() + 1000),
            status: 'read'
          }
        ]
        setMessages(welcomeMessages)
        
        // Save welcome messages to localStorage
        localStorage.setItem(chatKey, JSON.stringify(welcomeMessages))
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Fallback to welcome message
      setMessages([
        {
          id: 1,
          text: `Hello! Thanks for your interest in my property "${property?.title}". How can I help you?`,
          sender: 'owner',
          timestamp: new Date(),
          status: 'read'
        }
      ])
    }
  }

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0 && property && user) {
      const chatKey = `chat_${property.id}_${user?.id}`
      localStorage.setItem(chatKey, JSON.stringify(messages))
    }
  }, [messages, property, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const onSubmit = async (data) => {
    if (!data.message.trim()) return

    const newMessage = {
      id: Date.now(),
      text: data.message,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, newMessage])
    reset()
    setIsTyping(true)

    try {
      const response = await api.post('/messages', {
        propertyId: property.id,
        ownerId: property.ownerId,
        senderName: user.name,
        senderEmail: user.email,
        senderPhone: user.phone || '',
        message: data.message,
        propertyTitle: property.title
      })

      // Update message status to sent
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      )

      // Store conversation ID for future use
      if (response.data.conversationId) {
        console.log('Conversation ID:', response.data.conversationId)
      }

      // Generate automated owner reply after a short delay
      setTimeout(() => {
        setIsTyping(true)
        // Show typing for a bit longer for realistic feel
        setTimeout(() => {
          generateOwnerReply(data.message)
          setIsTyping(false)
        }, 800 + Math.random() * 1200) // Additional 0.8-2 seconds typing time
      }, 1000 + Math.random() * 1500) // 1-2.5 seconds initial delay

      toast.success('Message sent! The owner will respond shortly.')
    } catch (error) {
      console.error('Send message error:', error)
      setIsTyping(false)
      // Update message status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'failed' }
            : msg
        )
      )
      toast.error('Failed to send message')
    }
  }

  const generateOwnerReply = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    let reply = ""

    // Generate contextual replies based on user message
    if (lowerMessage.includes('visit') || lowerMessage.includes('viewing') || lowerMessage.includes('see')) {
      reply = `Hi! Yes, you can visit the property. I'm available for viewings on weekdays 6-8 PM and weekends 10 AM - 6 PM. What time works best for you?`
    } else if (lowerMessage.includes('rent') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('charges')) {
      reply = `The monthly rent is ₹${property.rent?.toLocaleString()}. This includes basic amenities. Security deposit is ₹${property.deposit?.toLocaleString() || (property.rent * 2)?.toLocaleString()}. Any specific questions about charges?`
    } else if (lowerMessage.includes('available') || lowerMessage.includes('vacant')) {
      reply = `Yes, the property is available for immediate move-in! The room is well-maintained and ready. Would you like to schedule a visit to see it?`
    } else if (lowerMessage.includes('amenities') || lowerMessage.includes('facilities')) {
      const amenitiesList = property.amenities?.slice(0, 4).join(', ') || 'WiFi, Security, Parking'
      reply = `We provide ${amenitiesList} and more. All amenities are well-maintained. Would you like to know about any specific facility?`
    } else if (lowerMessage.includes('food') || lowerMessage.includes('meal') || lowerMessage.includes('cooking')) {
      reply = `We provide home-cooked meals (breakfast & dinner included). Kitchen is also available for personal cooking. Meal timings are flexible for working professionals.`
    } else if (lowerMessage.includes('rules') || lowerMessage.includes('timing') || lowerMessage.includes('policy')) {
      reply = `House rules are quite reasonable - no smoking inside, visitors allowed till 9 PM, and we maintain a peaceful environment. Entry timing is 24/7 with key card access.`
    } else if (lowerMessage.includes('deposit') || lowerMessage.includes('advance')) {
      reply = `Security deposit is ₹${property.deposit?.toLocaleString() || (property.rent * 2)?.toLocaleString()} (refundable). First month rent in advance. No hidden charges!`
    } else if (lowerMessage.includes('photo') || lowerMessage.includes('picture') || lowerMessage.includes('image')) {
      reply = `I can share more photos! You can also check the detailed listing with all photos. Would you prefer to visit in person? The property looks even better in reality! 📸`
    } else if (lowerMessage.includes('location') || lowerMessage.includes('metro') || lowerMessage.includes('transport')) {
      reply = `Great location! Nearest metro is just 5 mins walk. Bus stop right outside. Easy connectivity to major IT hubs and colleges. Very convenient for daily commute.`
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('interested')) {
      reply = `Hello! Thanks for your interest in the property. I'd be happy to help you with all details. What would you like to know first - rent, amenities, or visit timing?`
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      reply = `You're welcome! Feel free to ask any other questions. I'm here to help. When would you like to visit the property?`
    } else {
      // Generic helpful reply
      const genericReplies = [
        `Thanks for your query! I'll be happy to help. Could you be more specific about what you'd like to know?`,
        `Sure! I can provide all the details you need. What specific information would help you decide?`,
        `Great question! Let me know what other details you need. I'm available for a property visit anytime.`,
        `I understand your concern. Feel free to ask anything about the property. I'm here to help!`
      ]
      reply = genericReplies[Math.floor(Math.random() * genericReplies.length)]
    }

    // Add owner reply to messages
    const ownerReply = {
      id: Date.now() + 1,
      text: reply,
      sender: 'owner',
      timestamp: new Date(),
      status: 'read'
    }

    setMessages(prev => [...prev, ownerReply])
  }

  const handleQuickMessage = (text) => {
    setValue('message', text)
    setShowQuickMessages(false)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
      case 'sent':
        return <span className="text-gray-400">✓</span>
      case 'delivered':
        return <span className="text-gray-400">✓✓</span>
      case 'read':
        return <span className="text-blue-500">✓✓</span>
      case 'failed':
        return <span className="text-red-500">!</span>
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Chat Window */}
        <div className="flex justify-center items-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-2xl max-w-md w-full h-[600px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold relative">
                  {ownerName?.charAt(0)?.toUpperCase() || 'O'}
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{ownerName || 'Property Owner'}</h3>
                  <p className="text-xs text-green-100">
                    {isTyping ? (
                      <span className="flex items-center">
                        <span className="w-1 h-1 bg-green-200 rounded-full mr-1 animate-pulse"></span>
                        typing...
                      </span>
                    ) : (
                      property?.title ? `${property.title.substring(0, 25)}${property.title.length > 25 ? '...' : ''}` : 'Online'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {ownerPhone && (
                  <button
                    onClick={() => window.open(`tel:${ownerPhone}`)}
                    className="p-2 hover:bg-green-700 rounded-full transition-colors"
                    title="Call Owner"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {/* Clear Chat Button */}
                <button
                  onClick={() => {
                    if (window.confirm('Clear chat history? This cannot be undone.')) {
                      const chatKey = `chat_${property?.id}_${getUserId()}`
                      localStorage.removeItem(chatKey)
                      setMessages([{
                        id: 1,
                        text: `Hello! Thanks for your interest in my property "${property?.title}". How can I help you?`,
                        sender: 'owner',
                        timestamp: new Date(),
                        status: 'read'
                      }])
                      toast.success('Chat history cleared')
                    }
                  }}
                  className="p-2 hover:bg-green-700 rounded-full transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-green-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-green-50 bg-opacity-30 overflow-y-auto p-4 space-y-3">
              {/* Property Card */}
              <div 
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => window.open(`/properties/${property?.id}`, '_blank')}
              >
                <div className="flex items-center space-x-3">
                  {property?.images?.[0] ? (
                    <img 
                      src={property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`}
                      alt="Property" 
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {property?.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">
                      ₹{property?.rent?.toLocaleString()}/month • {property?.city}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      Tap to view full details →
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && (
                          <span className="text-xs">
                            {getStatusIcon(message.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-lg rounded-bl-sm px-3 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Messages */}
            {showQuickMessages && (
              <div className="bg-white border-t border-gray-200 max-h-60 overflow-hidden flex flex-col">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
                  {Object.keys(quickMessageCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap px-3 py-2 text-xs font-medium transition-colors ${
                        selectedCategory === category
                          ? 'text-green-600 bg-white border-b-2 border-green-600'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {/* Messages for Selected Category */}
                <div className="p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {quickMessageCategories[selectedCategory]?.map((text, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickMessage(text)}
                        className="w-full text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 p-2 rounded transition-colors border border-gray-200 hover:border-green-300"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}



            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-3">
              <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowQuickMessages(!showQuickMessages)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Quick Messages"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    placeholder="Type a message..."
                    className="w-full resize-none border border-gray-300 rounded-full px-4 py-2 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm max-h-20"
                    rows="1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(onSubmit)()
                      }
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !messageValue?.trim()}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              {errors.message && (
                <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default WhatsAppChat 