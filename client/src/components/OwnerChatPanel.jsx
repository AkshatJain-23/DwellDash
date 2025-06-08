import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MessageCircle, Send, User, Phone, Mail, Clock, Eye, ArrowLeft, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

const OwnerChatPanel = ({ ownerId, ownerName }) => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
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
    if (ownerId) {
      fetchConversations()
      fetchStats()
    }
  }, [ownerId])

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
      const response = await api.get(`/messages/conversations/owner/${ownerId}`)
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
      toast.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get(`/messages/stats/${ownerId}`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchConversationDetails = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`)
      setSelectedConversation(response.data)
      
      // Mark messages as read
      await api.patch(`/messages/conversations/${conversationId}/read`, {
        readerId: ownerId
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
    } catch (error) {
      console.error('Failed to fetch conversation details:', error)
      toast.error('Failed to load conversation')
    }
  }

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    
    if (!data.message.trim() || !selectedConversation) {
      console.log('Form validation failed:', { message: data.message, conversation: selectedConversation })
      return
    }

    setSending(true)
    console.log('Sending reply to conversation:', selectedConversation.id)
    
    try {
      await api.post('/messages/reply', {
        conversationId: selectedConversation.id,
        ownerId: ownerId,
        ownerName: ownerName,
        message: data.message
      })

      // Add message to local state immediately
      const newMessage = {
        id: Date.now().toString() + '_local',
        text: data.message,
        sender: 'owner',
        senderName: ownerName,
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
      toast.success('Reply sent!')
    } catch (error) {
      console.error('Failed to send reply:', error)
      toast.error('Failed to send reply')
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

  const quickReplies = [
    "Thank you for your interest in the property!",
    "The property is available for viewing. When would you like to visit?",
    "Please call me at your convenience to discuss the details.",
    "I'll share the property photos and details shortly.",
    "The security deposit is one month's rent in advance.",
    "All amenities mentioned in the listing are available.",
    "Yes, the property is still available for rent.",
    "I can arrange a video call tour if you prefer."
  ]

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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedConversation ? (
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : null}
            <MessageCircle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-semibold">
                {selectedConversation ? 'Chat with Tenant' : 'Messages & Chats'}
              </h2>
              {selectedConversation && (
                <p className="text-blue-100 text-sm">
                  {selectedConversation.tenantName} • {selectedConversation.propertyTitle}
                </p>
              )}
            </div>
          </div>
          {!selectedConversation && (
            <div className="flex gap-4 text-sm">
              <div className="text-blue-100">
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

      {!selectedConversation ? (
        // Conversations List
        <div className="max-h-96 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600">Messages from interested tenants will appear here</p>
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
                    conversation.unreadCount > 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => fetchConversationDetails(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.tenantName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
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
                            {conversation.lastMessage.sender === 'owner' ? 'You: ' : ''}
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
          {/* Tenant Info */}
          <div className="bg-gray-50 border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedConversation.tenantName}</h4>
                  <p className="text-sm text-gray-600">{selectedConversation.tenantEmail}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedConversation.tenantEmail}`}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                </a>
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
                className={`flex ${message.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
                  message.sender === 'owner'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`flex items-center justify-end mt-1 text-xs ${
                    message.sender === 'owner' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatMessageTime(message.timestamp)}</span>
                    {message.sender === 'owner' && (
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
                    // Use setValue from react-hook-form to properly set the value
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
                placeholder="Type your reply..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  )
}

export default OwnerChatPanel 