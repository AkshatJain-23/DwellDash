import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, MessageCircle, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

const NotificationSystem = ({ user }) => {
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      checkForNewMessages()
      // Poll for new messages every 5 seconds
      const interval = setInterval(checkForNewMessages, 5000)
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      return () => clearInterval(interval)
    }
  }, [user])

  const checkForNewMessages = async () => {
    try {
      console.log('🔔 Checking for notifications for user:', user)
      
      const endpoint = user?.role === 'owner' 
        ? `/messages/conversations/owner/${user.id}`
        : `/messages/conversations/tenant/${encodeURIComponent(user.email)}`
      
      console.log('🔔 API endpoint:', endpoint)
      
      const response = await api.get(endpoint)
      const conversations = response.data
      
      console.log('🔔 Got conversations:', conversations.length)

      // Check for unread messages and create notifications
      const newNotifications = []
      const allRecentNotifications = []

      conversations.forEach(conv => {
        const unreadMessages = conv.messages?.filter(msg => 
          msg.status !== 'read' && 
          ((user?.role === 'owner' && msg.sender === 'tenant') ||
           (user?.role === 'tenant' && msg.sender === 'owner'))
        ) || []
        
        if (unreadMessages.length > 0) {
          console.log('🔔 Found unread messages in conversation:', conv.propertyTitle, 'Count:', unreadMessages.length)
        }

        // Create notifications for recent unread messages (last 30 minutes)
        unreadMessages.forEach(msg => {
          const messageTime = new Date(msg.timestamp || msg.createdAt)
          const now = new Date()
          const timeDiff = (now - messageTime) / (1000 * 60) // minutes

          if (timeDiff <= 30) { // Show notifications for messages from last 30 minutes
            const existingNotification = notifications.find(n => n.messageId === msg.id)
            
            const notification = {
              id: `msg-${msg.id}`,
              messageId: msg.id,
              type: 'message',
              title: user?.role === 'owner' ? 'New Message from Tenant' : 'New Message from Owner',
              message: msg.text?.length > 50 ? msg.text.substring(0, 50) + '...' : (msg.text || 'New message'),
              senderName: msg.senderName || 'User',
              propertyTitle: conv.propertyTitle,
              timestamp: new Date(msg.timestamp || msg.createdAt),
              conversationId: conv.id
            }

            allRecentNotifications.push(notification)

            if (!existingNotification) {
              newNotifications.push(notification)
            }
          }
        })
      })

      // Update notifications to show all recent unread messages (not just new ones)
      setNotifications(allRecentNotifications.slice(0, 10)) // Keep only last 10
      
      // Update count to match what's actually displayed
      setUnreadCount(allRecentNotifications.length)

      // Show toast only for truly new notifications (from last 5 minutes)
      const veryRecentNotifications = newNotifications.filter(notif => {
        const timeDiff = (new Date() - new Date(notif.timestamp)) / (1000 * 60)
        return timeDiff <= 5
      })

      if (veryRecentNotifications.length > 0) {
        const latestNotification = veryRecentNotifications[0]
        
        // Show toast notification
        toast.success(
          `${latestNotification.title}: ${latestNotification.message}`,
          { 
            duration: 6000,
            style: {
              background: '#10B981',
              color: '#fff',
              fontWeight: '500'
            }
          }
        )
        
        // Play notification sound (if browser allows)
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjeS2vHNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBj');
          audio.volume = 0.3;
          audio.play().catch(() => {}); // Ignore if audio fails
        } catch (error) {
          // Ignore audio errors
        }
        
        // Browser notification (if permission granted)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(latestNotification.title, {
            body: latestNotification.message,
            icon: '/favicon.ico',
            tag: 'dwelldash-chat'
          });
        }
      }

    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId)
    if (notification && notification.messageId) {
      try {
        // Mark the actual message as read in the backend
        const endpoint = user?.role === 'owner' 
          ? `/messages/conversations/${notification.conversationId}/read`
          : `/messages/conversations/${notification.conversationId}/read`
        
        await api.patch(endpoint, {
          readerId: user?.role === 'owner' ? user.id : user.email
        })
      } catch (error) {
        console.error('Failed to mark message as read:', error)
      }
    }

    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId)
      setUnreadCount(updated.length)
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read
      for (const notification of notifications) {
        if (notification.messageId) {
          const endpoint = user?.role === 'owner' 
            ? `/messages/conversations/${notification.conversationId}/read`
            : `/messages/conversations/${notification.conversationId}/read`
          
          await api.patch(endpoint, {
            readerId: user?.role === 'owner' ? user.id : user.email
          });
        }
      }
      
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const openConversation = (notification) => {
    // Mark the notification as read first
    markAsRead(notification.id)
    setShowNotifications(false)
    
    // Navigate to dashboard
    navigate('/dashboard')
    
    // Show success message with conversation details
    toast.success(
      `Opening conversation about "${notification.propertyTitle}"...`,
      {
        duration: 3000,
        style: {
          background: '#3B82F6',
          color: '#fff'
        }
      }
    )
    
    // Try to scroll to the chat section after navigation
    setTimeout(() => {
      const chatSection = document.querySelector('[data-role="chat-panel"]') || 
                         document.querySelector('.chat-panel') ||
                         document.querySelector('#messages-section')
      
      if (chatSection) {
        chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      
      // Show additional guidance
      toast.info('Look for the Messages or Chat section in your dashboard', {
        duration: 4000,
        style: {
          background: '#6B7280',
          color: '#fff'
        }
      })
    }, 1500)
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${unreadCount > 0 ? 'animate-pulse' : ''}`}
      >
        <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-red-500' : ''}`} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Mark All Read
                    </button>
                    <button
                      onClick={clearAllNotifications}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              {notification.propertyTitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openConversation(notification)}
                            className="flex-shrink-0 p-1 hover:bg-blue-100 rounded-full transition-colors text-blue-600"
                            title="Open conversation"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            title="Dismiss notification"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem 