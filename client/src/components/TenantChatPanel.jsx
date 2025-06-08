import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MessageCircle, Send, User, Phone, Mail, Clock, Eye, ArrowLeft, CheckCheck, Building } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

const TenantChatPanel = ({ tenantId, tenantEmail, tenantName }) => {
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
    } catch (error) {
      console.error('Failed to fetch conversation details:', error)
      toast.error('Failed to load conversation')
    }
  }

  const onSubmit = async (data) => {
    if (!data.message.trim() || !selectedConversation) {
      return
    }

    setSending(true)
    
    try {
      // Use existing tenant reply endpoint if available, otherwise use regular reply
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

  const quickReplies = [
    "Thank you for the information!",
    "When can I schedule a visit?",
    "Is the property still available?",
    "What are the nearby amenities?",
    "Can you share more photos?",
    "What's included in the rent?",
    "Are there any additional charges?",
    "I'm interested. Please call me."
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
    <div className="bg-white rounded-lg shadow-sm mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
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
                  <p className="text-sm text-gray-600">{selectedConversation.propertyTitle}</p>
                </div>
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

export default TenantChatPanel 