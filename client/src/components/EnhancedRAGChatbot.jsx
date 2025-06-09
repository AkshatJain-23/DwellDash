import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Minimize2, Maximize2, X, MessageCircle, Loader, Sparkles, Brain, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const EnhancedRAGChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Hi! I'm DwellBot, your AI-powered assistant for DwellDash. I use advanced RAG technology to provide accurate, real-time information about PG accommodations, bookings, and our platform. How can I help you today?",
      timestamp: new Date(),
      isRAG: true
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

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

  // Load initial suggestions when component mounts
  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    try {
      const response = await axios.get('/api/chatbot/suggestions')
      if (response.data.success) {
        const allQuestions = response.data.data.flatMap(category => category.questions)
        setSuggestions(allQuestions.slice(0, 6))
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error)
      // Fallback suggestions
      setSuggestions([
        "How do I book a PG?",
        "How do I list my property?",
        "Is DwellDash free?",
        "Are properties verified?",
        "Which cities do you cover?",
        "How to contact support?"
      ])
    }
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
    const currentMessage = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      // Call the RAG-based chatbot API
      const response = await axios.post('/api/chatbot/chat', {
        message: currentMessage,
        sessionId: sessionId
      })

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.data.response,
          timestamp: new Date(),
          isRAG: true,
          responseTime: response.data.data.responseTime,
          suggestions: response.data.data.suggestions
        }

        setMessages(prev => [...prev, botMessage])
        
        // Update suggestions with new ones from the response
        if (response.data.data.suggestions && response.data.data.suggestions.length > 0) {
          setSuggestions(response.data.data.suggestions)
        }

        // Show response time in development mode
        if (process.env.NODE_ENV === 'development' && response.data.data.responseTime) {
          console.log(`DwellBot response time: ${response.data.data.responseTime}ms`)
        }
      } else {
        throw new Error(response.data.error || 'Failed to get response')
      }

    } catch (error) {
      console.error('Chatbot API error:', error)
      
      let errorMessage = "I apologize for the technical difficulty. Please try asking your question again.";
      
      if (error.response?.status === 429) {
        errorMessage = "I'm receiving too many messages right now. Please wait a moment before sending another message.";
      } else if (error.response?.data?.fallback) {
        errorMessage = error.response.data.fallback;
      }

      const errorBotMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      }

      setMessages(prev => [...prev, errorBotMessage])
      toast.error('Failed to send message')
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

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6" />
              
              {/* RAG Indicator */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
            </motion.button>
            
            {/* Floating hint */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute right-20 top-2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>AI-Powered DwellBot</span>
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, x: 100, y: 100 }}
            className={`fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden ${
              isMinimized ? 'h-16' : 'h-[550px]'
            } transition-all duration-300`}
          >
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center">
                <div className="relative w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                  {/* RAG indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Brain className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">DwellBot</h3>
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </div>
                  <p className="text-xs text-blue-100">RAG-Powered AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${
                          message.type === 'user' 
                            ? 'bg-blue-600' 
                            : 'bg-gradient-to-r from-green-500 to-blue-500'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <>
                              <Bot className="w-4 h-4 text-white" />
                              {message.isRAG && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Sparkles className="w-2 h-2 text-yellow-800" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.isError
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-white text-gray-900 shadow-md border border-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {message.responseTime && (
                              <p className="text-xs opacity-70 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {message.responseTime}ms
                              </p>
                            )}
                          </div>
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
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                          <div className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin text-blue-600" />
                            <Brain className="w-4 h-4 text-green-600 animate-pulse" />
                            <p className="text-sm text-gray-700">DwellBot is analyzing your query...</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Quick Suggestions */}
                {messages.length === 1 && suggestions.length > 0 && (
                  <div className="px-4 pb-2 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600 font-medium">Quick questions:</p>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all text-left border border-gray-200 hover:border-blue-300"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about properties, prices, locations..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                        maxLength={500}
                      />
                      {inputMessage.length > 400 && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                          {500 - inputMessage.length}
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* RAG Status Indicator */}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Brain className="w-3 h-3 text-green-600" />
                      <span>RAG-powered responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-600" />
                      <span>Fast AI inference</span>
                    </div>
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

export default EnhancedRAGChatbot 