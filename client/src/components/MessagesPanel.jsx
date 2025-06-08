import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, MessageCircle, Eye, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

const MessagesPanel = ({ ownerId }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0
  })

  useEffect(() => {
    if (ownerId) {
      fetchMessages()
      fetchStats()
    }
  }, [ownerId])

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/owner/${ownerId}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get(`/messages/stats/${ownerId}`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch message stats:', error)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      await api.patch(`/messages/${messageId}/read`)
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true, status: 'read' } : msg
      ))
      setStats(prev => ({
        ...prev,
        unreadMessages: Math.max(0, prev.unreadMessages - 1)
      }))
    } catch (error) {
      console.error('Failed to mark message as read:', error)
      toast.error('Failed to update message status')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </h2>
          <div className="flex gap-4 text-sm">
            <div className="text-gray-600">
              Total: <span className="font-medium text-gray-900">{stats.totalMessages}</span>
            </div>
            {stats.unreadMessages > 0 && (
              <div className="text-red-600">
                Unread: <span className="font-medium">{stats.unreadMessages}</span>
              </div>
            )}
            {stats.todayMessages > 0 && (
              <div className="text-green-600">
                Today: <span className="font-medium">{stats.todayMessages}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Messages from interested tenants will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !message.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{message.senderName}</h3>
                        {!message.isRead && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{message.propertyTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(message.sentAt)}</p>
                    {!message.isRead && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Mark read
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{message.message}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <a
                    href={`mailto:${message.senderEmail}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="w-4 h-4" />
                    {message.senderEmail}
                  </a>
                  <a
                    href={`tel:${message.senderPhone}`}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800"
                  >
                    <Phone className="w-4 h-4" />
                    {message.senderPhone}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesPanel 