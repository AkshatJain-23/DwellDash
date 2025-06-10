import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Play, Video, Clock, Users, Search, Eye, 
  Phone, Calendar, CheckCircle, Star, BookOpen,
  ArrowRight, Home, MessageCircle
} from 'lucide-react'

const Tutorials = () => {
  const videoTutorials = [
    {
      id: 1,
      title: "How to Search for PGs on DwellDash",
      description: "Learn how to use our search filters to find the perfect PG accommodation",
      duration: "3:24",
      difficulty: "Beginner",
      views: "15.2K",
      category: "Search",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop",
      videoUrl: "#", // Placeholder for actual video
      topics: ["Search filters", "Location search", "Price range", "Amenity filters"]
    },
    {
      id: 2,
      title: "Creating Your DwellDash Profile",
      description: "Complete your profile setup for better recommendations and faster bookings",
      duration: "2:15",
      difficulty: "Beginner",
      views: "12.8K",
      category: "Profile",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      videoUrl: "#",
      topics: ["Account creation", "Profile completion", "Verification", "Preferences"]
    },
    {
      id: 3,
      title: "Property Verification & Safety Checks",
      description: "Learn how to identify verified properties and conduct safety checks",
      duration: "4:12",
      difficulty: "Intermediate",
      views: "9.6K",
      category: "Safety",
      thumbnail: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=225&fit=crop",
      videoUrl: "#",
      topics: ["Verification badges", "Safety checklist", "Red flags", "Documentation"]
    },
    {
      id: 4,
      title: "Contacting Property Owners",
      description: "Best practices for communicating with property owners and scheduling visits",
      duration: "3:48",
      difficulty: "Beginner",
      views: "11.3K",
      category: "Communication",
      thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=225&fit=crop",
      videoUrl: "#",
      topics: ["Contact methods", "Scheduling visits", "Questions to ask", "Negotiation"]
    },
    {
      id: 5,
      title: "Property Visit & Evaluation Guide",
      description: "What to look for during property visits and how to evaluate PGs effectively",
      duration: "5:32",
      difficulty: "Intermediate",
      views: "8.9K",
      category: "Evaluation",
      thumbnail: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=225&fit=crop",
      videoUrl: "#",
      topics: ["Visit preparation", "Inspection checklist", "Amenity verification", "Decision making"]
    },
    {
      id: 6,
      title: "Booking Process & Documentation",
      description: "Step-by-step guide to booking your PG and completing necessary paperwork",
      duration: "4:05",
      difficulty: "Advanced",
      views: "7.4K",
      category: "Booking",
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop",
      videoUrl: "#",
      topics: ["Booking process", "Legal documents", "Payment methods", "Agreement signing"]
    }
  ]

  const categories = [
    { name: "All", count: videoTutorials.length },
    { name: "Search", count: videoTutorials.filter(v => v.category === "Search").length },
    { name: "Profile", count: videoTutorials.filter(v => v.category === "Profile").length },
    { name: "Safety", count: videoTutorials.filter(v => v.category === "Safety").length },
    { name: "Communication", count: videoTutorials.filter(v => v.category === "Communication").length },
    { name: "Evaluation", count: videoTutorials.filter(v => v.category === "Evaluation").length },
    { name: "Booking", count: videoTutorials.filter(v => v.category === "Booking").length }
  ]

  const quickGuides = [
    {
      title: "5-Minute Quick Start",
      description: "Get started with DwellDash in just 5 minutes",
      steps: ["Create account", "Set preferences", "Start searching", "Contact owners"],
      icon: Clock,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Safety Checklist",
      description: "Essential safety points to verify before booking",
      steps: ["Verify owner identity", "Check property documents", "Inspect safety features", "Read agreement carefully"],
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Expert Tips",
      description: "Pro tips from experienced PG hunters",
      steps: ["Compare multiple properties", "Visit during different times", "Check reviews carefully", "Negotiate terms"],
      icon: Star,
      color: "bg-purple-100 text-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-app-secondary to-app-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Video className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Video Tutorials
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Watch our comprehensive video guides to master DwellDash and find your perfect PG accommodation faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="py-12 bg-app-accent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-app-text mb-8 text-center">Quick Reference Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickGuides.map((guide, index) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-app-border p-6"
                >
                  <div className={`w-12 h-12 ${guide.color} rounded-lg flex items-center justify-center mb-4`}>
                    <guide.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-app-text mb-3">{guide.title}</h3>
                  <p className="text-app-muted text-sm mb-4">{guide.description}</p>
                  <ol className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start text-sm">
                        <span className="flex-shrink-0 w-5 h-5 bg-app-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-app-muted">{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-6">
              Video Tutorial Library
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Step-by-step video guides covering everything from basic search to advanced booking strategies.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="px-6 py-3 bg-white border border-app-border rounded-lg hover:bg-app-accent transition-colors"
              >
                <span className="font-medium text-app-text">{category.name}</span>
                <span className="ml-2 px-2 py-1 bg-app-primary text-white text-xs rounded-full">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTutorials.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Video Thumbnail */}
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <Play className="w-6 h-6 text-app-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                  <div className="absolute top-4 left-4 bg-app-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {video.category}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="font-bold text-app-text mb-3 line-clamp-2 group-hover:text-app-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-app-muted text-sm mb-4 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-app-muted mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{video.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.topics.slice(0, 3).map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-2 py-1 bg-app-accent text-app-text text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-app-primary text-white py-3 rounded-lg font-semibold hover:bg-app-primary/90 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 text-app-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-6">
              More Tutorials Coming Soon!
            </h2>
            <p className="text-xl text-app-muted mb-8 max-w-2xl mx-auto">
              We're constantly creating new video content to help you make the most of DwellDash. 
              Subscribe to our updates to be notified of new tutorials.
            </p>
            
            <div className="bg-white rounded-xl shadow-lg border border-app-border p-6 max-w-md mx-auto">
              <h3 className="font-bold text-app-text mb-4">Upcoming Topics:</h3>
              <ul className="text-left space-y-2 text-app-muted">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Advanced search techniques
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Property photography tips
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Negotiation strategies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Moving day checklist
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Home className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Apply What You've Learned?
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Use your new knowledge to find and book the perfect PG accommodation on DwellDash.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="bg-white text-app-primary px-8 py-4 rounded-xl font-bold hover:bg-app-accent transition-colors inline-flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Searching
              </Link>
              <Link
                to="/guides/getting-started"
                className="border-2 border-white text-white hover:bg-white hover:text-app-primary px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Getting Started Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Tutorials 