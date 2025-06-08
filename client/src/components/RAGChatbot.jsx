import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Minimize2, Maximize2, X, MessageCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const RAGChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm DwellBot, your AI assistant. I can help you with questions about PG accommodations, bookings, property listings, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // DwellDash Knowledge Base for RAG
  const knowledgeBase = [
    {
      topic: "property_listing",
      content: "To list your property on DwellDash: 1) Register as a property owner, 2) Complete your profile verification, 3) Add property details including photos, amenities, and pricing, 4) Set availability and booking preferences, 5) Submit for verification. Our team reviews listings within 24-48 hours."
    },
    {
      topic: "booking_process",
      content: "Booking a PG through DwellDash: 1) Search properties by location and preferences, 2) View detailed listings with photos and amenities, 3) Contact property owner directly through our platform, 4) Schedule a visit if needed, 5) Complete booking through our secure payment system."
    },
    {
      topic: "verification",
      content: "All properties on DwellDash undergo strict verification: 1) Document verification (ownership/legal authority), 2) Physical property inspection, 3) Amenity confirmation, 4) Safety and cleanliness standards check, 5) Owner background verification. We ensure all listings meet our quality standards."
    },
    {
      topic: "pricing_fees",
      content: "DwellDash pricing: For tenants - completely FREE to search and book. For property owners - small commission (2-3%) only charged after successful bookings. No upfront fees, no hidden charges. We only succeed when you do."
    },
    {
      topic: "support_help",
        content: "Get support: 1) Use this chat for instant help, 2) Email us at dwelldash3@gmail.com, 3) Call +91 98765 43210 (Mon-Sat 9AM-8PM), 4) Visit our offices in Gurgaon, Bangalore, or Mumbai. Average response time: 2 hours for urgent issues."
    },
    {
      topic: "safety_security",
      content: "Safety measures: 1) All properties verified and inspected, 2) Secure payment processing, 3) 24/7 customer support, 4) Background checks on property owners, 5) Review and rating system, 6) Emergency contact system. Your safety is our priority."
    },
    {
      topic: "amenities_facilities",
      content: "Common amenities on DwellDash: WiFi, AC, meals, laundry, parking, security, gym, study room, recreational areas. Filter properties by specific amenities you need. All listed amenities are verified during our inspection process."
    },
    {
      topic: "locations_cities",
      content: "DwellDash operates in 50+ cities across India including Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Gurgaon, Noida, Kolkata, Ahmedabad, and more. Expanding to new cities regularly based on demand."
    },
    {
      topic: "payment_methods",
      content: "Payment options: UPI, net banking, credit/debit cards, digital wallets. All payments are secure and processed through PCI DSS compliant gateways. Rental payments can be monthly, quarterly, or as agreed with property owner."
    },
    {
      topic: "cancellation_policy",
      content: "Cancellation policy: 1) Free cancellation up to 7 days before move-in, 2) 50% refund for cancellations 3-7 days before, 3) No refund for cancellations within 3 days, 4) Emergency exceptions considered case-by-case. Full terms available on booking page."
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  // Simple RAG implementation - find relevant knowledge
  const findRelevantKnowledge = (query) => {
    const queryLower = query.toLowerCase()
    const relevantItems = knowledgeBase.filter(item => {
      const topicKeywords = item.topic.split('_')
      const contentWords = item.content.toLowerCase()
      return topicKeywords.some(keyword => queryLower.includes(keyword)) ||
             queryLower.split(' ').some(word => contentWords.includes(word))
    })
    return relevantItems.slice(0, 2) // Get top 2 relevant items
  }

  // Simulate AI response using RAG
  const generateResponse = async (userMessage) => {
    const relevantKnowledge = findRelevantKnowledge(userMessage)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    let response = ""

    if (relevantKnowledge.length > 0) {
      // Use relevant knowledge to generate response
      const context = relevantKnowledge.map(item => item.content).join(' ')
      
      // Simple response generation based on keywords
      const queryLower = userMessage.toLowerCase()
      
      if (queryLower.includes('list') || queryLower.includes('property') || queryLower.includes('owner')) {
        response = relevantKnowledge.find(item => item.topic === 'property_listing')?.content ||
                  "To list your property, register as an owner and follow our simple verification process. Would you like me to guide you through the steps?"
      } else if (queryLower.includes('book') || queryLower.includes('rent') || queryLower.includes('find')) {
        response = relevantKnowledge.find(item => item.topic === 'booking_process')?.content ||
                  "Finding and booking a PG is easy on DwellDash! Search by location, view verified properties, and book securely. Need help with specific area?"
      } else if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('fee')) {
        response = relevantKnowledge.find(item => item.topic === 'pricing_fees')?.content ||
                  "DwellDash is completely free for tenants! Property owners pay a small commission only after successful bookings. No hidden fees!"
      } else if (queryLower.includes('safe') || queryLower.includes('secure') || queryLower.includes('trust')) {
        response = relevantKnowledge.find(item => item.topic === 'safety_security')?.content ||
                  "Safety is our top priority! All properties are verified, owners are background-checked, and we have 24/7 support."
      } else if (queryLower.includes('payment') || queryLower.includes('pay')) {
        response = relevantKnowledge.find(item => item.topic === 'payment_methods')?.content ||
                  "We accept UPI, cards, net banking, and digital wallets. All payments are secure and PCI DSS compliant."
      } else if (queryLower.includes('cancel') || queryLower.includes('refund')) {
        response = relevantKnowledge.find(item => item.topic === 'cancellation_policy')?.content ||
                  "You can cancel with full refund up to 7 days before move-in. Check our cancellation policy for detailed terms."
      } else if (queryLower.includes('contact') || queryLower.includes('support') || queryLower.includes('help')) {
        response = relevantKnowledge.find(item => item.topic === 'support_help')?.content ||
                  "I'm here to help! You can also email dwelldash3@gmail.com or call +91 98765 43210. What specific help do you need?"
      } else if (queryLower.includes('cities') || queryLower.includes('location') || queryLower.includes('where')) {
        response = relevantKnowledge.find(item => item.topic === 'locations_cities')?.content ||
                  "We're available in 50+ cities including Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, and more. Which city are you looking for?"
      } else {
        // General response using first relevant knowledge
        response = relevantKnowledge[0]?.content || 
                  "I'd be happy to help you with that! Could you please provide more specific details about what you're looking for?"
      }
    } else {
      // Fallback responses for unmatched queries
      const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
      const thanks = ['thank', 'thanks', 'appreciate']
      const goodbye = ['bye', 'goodbye', 'see you', 'farewell', 'take care']
      
      // Check for completely irrelevant topics
      const irrelevantTopics = [
        'weather', 'food', 'movie', 'music', 'sports', 'politics', 'news', 'joke', 'game', 
        'recipe', 'travel', 'health', 'fitness', 'fashion', 'entertainment', 'celebrity',
        'technology', 'programming', 'code', 'software', 'hardware', 'science', 'math',
        'history', 'geography', 'literature', 'philosophy', 'religion', 'relationship',
        'dating', 'marriage', 'family', 'education', 'job', 'career', 'investment',
        'stock', 'cryptocurrency', 'bitcoin', 'shopping', 'product', 'review'
      ]
      
      const isIrrelevant = irrelevantTopics.some(topic => queryLower.includes(topic))
      
      if (greetings.some(greeting => queryLower.includes(greeting))) {
        response = "Hello! Welcome to DwellDash. I'm here to help you with PG accommodations, property listings, bookings, and any questions about our platform. What would you like to know?"
      } else if (thanks.some(thank => queryLower.includes(thank))) {
        response = "You're welcome! I'm glad I could help. Is there anything else you'd like to know about DwellDash?"
      } else if (goodbye.some(bye => queryLower.includes(bye))) {
        response = "Thank you for using DwellDash! Have a great day, and feel free to reach out whenever you need help with PG accommodations. Take care! 😊"
      } else if (isIrrelevant) {
        response = "Thank you for your question! While I'd love to help with that, I'm specifically designed to assist with DwellDash services. \n\nI can help you with finding PG accommodations, listing properties, pricing information, safety features, and general platform questions. What would you like to know more about?"
      } else {
        response = "I understand you're asking about something specific to DwellDash. I can help you with:\n\n• Finding and booking PG accommodations\n• Listing your property\n• Payment and pricing information\n• Safety and verification process\n• Platform features and support\n\nWhat would you like to know more about?"
      }
    }

    return response
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await generateResponse(inputMessage)
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      toast.error('Sorry, I encountered an error. Please try again.')
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try asking your question again, or contact our support team at dwelldash3@gmail.com.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "How do I list my property?",
    "How to book a PG?",
    "What are your fees?",
    "Is DwellDash safe?",
    "Which cities do you cover?",
    "How can I contact support?"
  ]

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-light-secondary dark:bg-accent-dark rounded-full shadow-lg flex items-center justify-center text-white hover:bg-light-primary dark:hover:bg-accent-medium transition-colors z-50"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, x: 100, y: 100 }}
            className={`fixed bottom-6 right-6 w-96 bg-white dark:bg-accent-dark rounded-lg shadow-2xl z-50 border border-gray-200 dark:border-accent-medium ${
              isMinimized ? 'h-16' : 'h-[500px]'
            } transition-all duration-300`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-accent-medium bg-light-secondary dark:bg-accent-black rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-light-accent dark:bg-accent-light rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-light-secondary dark:text-accent-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">DwellBot</h3>
                  <p className="text-sm text-white opacity-80">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-light-secondary dark:bg-accent-light' 
                            : 'bg-light-accent dark:bg-accent-dark'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-light-secondary dark:text-accent-light" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-light-secondary dark:bg-accent-light text-white'
                            : 'bg-gray-100 dark:bg-accent-black text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-light-accent dark:bg-accent-dark rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-light-secondary dark:text-accent-light" />
                        </div>
                        <div className="bg-gray-100 dark:bg-accent-black rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Loader className="w-4 h-4 animate-spin text-light-secondary dark:text-accent-light" />
                            <p className="text-sm text-gray-900 dark:text-white">DwellBot is thinking...</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-600 dark:text-accent-light mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickQuestions.slice(0, 3).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(question)}
                          className="text-xs bg-light-highlight dark:bg-accent-medium text-gray-700 dark:text-white px-2 py-1 rounded hover:bg-light-secondary hover:text-white dark:hover:bg-accent-light transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-accent-medium">
                  <div className="flex space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about DwellDash..."
                      className="flex-1 border border-gray-300 dark:border-accent-medium rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-light-secondary dark:focus:ring-accent-light dark:bg-accent-black dark:text-white"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-light-secondary dark:bg-accent-dark text-white p-2 rounded-lg hover:bg-light-primary dark:hover:bg-accent-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default RAGChatbot 