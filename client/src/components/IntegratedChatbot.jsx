import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const IntegratedChatbot = () => {
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
      topic: "pricing_fees",
      content: "DwellDash pricing: For tenants - completely FREE to search and book. For property owners - small commission (2-3%) only charged after successful bookings. No upfront fees, no hidden charges."
    },
    {
      topic: "safety_security",
      content: "Safety measures: All properties verified and inspected, secure payment processing, 24/7 customer support, background checks on property owners, review and rating system."
    },
    {
      topic: "locations_cities",
      content: "DwellDash operates in 50+ cities across India including Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Gurgaon, Noida, Kolkata, Ahmedabad, and more."
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simple RAG implementation
  const generateResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    const queryLower = userMessage.toLowerCase()
    let response = ""

    // Check for DwellDash-related queries first
    if (queryLower.includes('list') || queryLower.includes('property') || queryLower.includes('owner')) {
      response = "To list your property on DwellDash: 1) Register as a property owner, 2) Complete verification, 3) Add property details with photos and pricing, 4) Submit for review. Our team reviews listings within 24-48 hours."
    } else if (queryLower.includes('book') || queryLower.includes('rent') || queryLower.includes('find')) {
      response = "Finding a PG is easy! 1) Search by location and preferences, 2) View detailed listings with photos, 3) Contact property owners directly, 4) Schedule visits, 5) Book securely through our platform."
    } else if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('fee')) {
      response = "DwellDash is completely FREE for tenants! Property owners pay a small commission (2-3%) only after successful bookings. No upfront fees or hidden charges."
    } else if (queryLower.includes('safe') || queryLower.includes('secure') || queryLower.includes('trust')) {
      response = "Safety is our priority! All properties are verified, owners undergo background checks, we have secure payments, 24/7 support, and a review system."
    } else if (queryLower.includes('cities') || queryLower.includes('location') || queryLower.includes('where')) {
      response = "We operate in 50+ cities including Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Gurgaon, Noida, Kolkata, Ahmedabad, and more. Which city are you looking for?"
    } else if (queryLower.includes('contact') || queryLower.includes('support') || queryLower.includes('help')) {
              response = "You can reach us via email at dwelldash3@gmail.com, call +91 98765 43210 (Mon-Sat 9AM-8PM), or visit our offices. I'm also here to help with any questions!"
    } else {
      // Handle common conversational patterns and irrelevant topics
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
        response = "I can help you with finding PG accommodations, listing properties, pricing information, safety features, and general platform questions. What would you like to know more about?"
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
    "Is DwellDash safe?"
  ]

  return (
    <div className="bg-white dark:bg-accent-dark rounded-lg shadow-lg border border-gray-200 dark:border-accent-medium h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-accent-medium bg-light-secondary dark:bg-accent-black rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-light-accent dark:bg-accent-light rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-light-secondary dark:text-accent-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-white">DwellBot</h3>
            <p className="text-sm text-white opacity-80">AI Assistant • Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div className="px-4 pb-2 border-t border-gray-200 dark:border-accent-medium">
          <p className="text-xs text-gray-600 dark:text-accent-light mb-2 mt-2">Try asking:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-xs bg-light-highlight dark:bg-accent-medium text-gray-700 dark:text-white px-3 py-2 rounded hover:bg-light-secondary hover:text-white dark:hover:bg-accent-light transition-colors text-left"
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
            className="bg-light-secondary dark:bg-accent-dark text-white px-4 py-2 rounded-lg hover:bg-light-primary dark:hover:bg-accent-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntegratedChatbot 