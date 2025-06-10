import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Play, Pause, ChevronLeft, ChevronRight, Search, MapPin, 
  CheckCircle, Phone, Star, Shield, Users, Building2, 
  MessageCircle, Heart, ArrowRight
} from 'lucide-react'

const DemoModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const demoSlides = [
    {
      id: 1,
      title: "Welcome to DwellDash",
      subtitle: "India's Most Trusted PG Platform",
      description: "Discover verified PG accommodations with zero brokerage across 50+ cities in India.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
      features: ["Zero Brokerage", "100% Verified", "50+ Cities", "24/7 Support"]
    },
    {
      id: 2,
      title: "Search & Filter",
      subtitle: "Find Your Perfect Match",
      description: "Use our advanced search filters to find PGs that match your budget, location preferences, and amenities.",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop",
      features: ["Location Filter", "Budget Range", "Amenity Selection", "Instant Results"],
      showDemo: "search"
    },
    {
      id: 3,
      title: "Browse Verified Properties",
      subtitle: "Quality Assured Listings",
      description: "Every property is physically verified by our team. View detailed photos, amenities, and authentic reviews.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
      features: ["Physical Verification", "Detailed Photos", "Real Reviews", "Owner Contact"],
      showDemo: "property"
    },
    {
      id: 4,
      title: "Direct Contact with Owners",
      subtitle: "No Middlemen, No Brokerage",
      description: "Connect directly with property owners, schedule visits, and negotiate terms without any brokerage fees.",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop",
      features: ["Direct Contact", "Free Calls", "Schedule Visits", "Negotiate Terms"],
      showDemo: "contact"
    },
    {
      id: 5,
      title: "Book Your Perfect PG",
      subtitle: "Secure & Hassle-Free",
      description: "Complete the booking process with confidence. Our support team is available 24/7 to assist you.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop",
      features: ["Secure Booking", "24/7 Support", "Move-in Assistance", "Happy Living"]
    }
  ]

  useEffect(() => {
    if (!isPlaying || !isOpen) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % demoSlides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isPlaying, isOpen, demoSlides.length])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const SearchDemo = () => (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-4 mb-3">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1">
          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm">Bangalore</span>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
          ₹8,000-15,000
        </div>
      </div>
      <button className="w-full bg-app-primary text-white py-2 rounded-lg font-semibold flex items-center justify-center">
        <Search className="w-4 h-4 mr-2" />
        Search PGs
      </button>
    </div>
  )

  const PropertyDemo = () => (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="font-semibold">4.8</span>
          <span className="text-gray-500 text-sm ml-1">(127 reviews)</span>
        </div>
        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="flex-1 bg-app-primary text-white py-2 rounded-lg text-sm font-semibold">
          View Details
        </button>
        <button className="p-2 border border-gray-300 rounded-lg">
          <Heart className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )

  const ContactDemo = () => (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <div className="font-semibold">Rajesh Kumar</div>
          <div className="text-sm text-gray-500">Property Owner</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-green-500 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center">
          <Phone className="w-4 h-4 mr-1" />
          Call Now
        </button>
        <button className="bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center">
          <MessageCircle className="w-4 h-4 mr-1" />
          Chat
        </button>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        Avg. response time: 2 minutes
      </div>
    </div>
  )

  const renderDemoComponent = (demoType) => {
    switch (demoType) {
      case 'search':
        return <SearchDemo />
      case 'property':
        return <PropertyDemo />
      case 'contact':
        return <ContactDemo />
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-app-text">DwellDash Demo</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-app-primary text-white hover:bg-app-primary/90 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-sm text-gray-500">
                  {isPlaying ? 'Auto-playing' : 'Paused'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
              >
                {/* Left Side - Content */}
                <div className="p-8 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-sm font-semibold text-app-primary mb-2">
                      Step {currentSlide + 1} of {demoSlides.length}
                    </div>
                    <h3 className="text-3xl font-bold text-app-text mb-3">
                      {demoSlides[currentSlide].title}
                    </h3>
                    <h4 className="text-xl text-app-muted mb-4">
                      {demoSlides[currentSlide].subtitle}
                    </h4>
                    <p className="text-app-muted mb-6 leading-relaxed">
                      {demoSlides[currentSlide].description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {demoSlides[currentSlide].features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Interactive Component */}
                    {demoSlides[currentSlide].showDemo && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {renderDemoComponent(demoSlides[currentSlide].showDemo)}
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Right Side - Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={demoSlides[currentSlide].image}
                    alt={demoSlides[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer - Progress & Navigation */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              {/* Progress Dots */}
              <div className="flex space-x-2">
                {demoSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-app-primary scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-app-muted hover:text-app-text transition-colors"
                >
                  Close Demo
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onClose()
                    window.location.href = '/properties'
                  }}
                  className="bg-app-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-app-primary/90 transition-colors flex items-center"
                >
                  Start Searching
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
              <motion.div
                className="bg-app-primary h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSlide + 1) / demoSlides.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DemoModal 