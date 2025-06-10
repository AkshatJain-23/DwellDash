import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Calendar, User, ArrowRight, Search, 
  Eye, Heart, Share2, Tag, Clock, TrendingUp,
  Home, MessageCircle, Filter
} from 'lucide-react'

const Blog = () => {
  const featuredPost = {
    id: 1,
    title: "The Ultimate Guide to Finding Your Perfect PG in 2024",
    excerpt: "Everything you need to know about finding, evaluating, and booking the ideal PG accommodation in India's major cities. From search strategies to safety tips.",
    author: "DwellDash Team",
    date: "March 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    category: "Guide",
    views: "15.2K",
    likes: "342"
  }

  const blogPosts = [
    {
      id: 2,
      title: "Top 10 Safety Tips for PG Living",
      excerpt: "Essential safety guidelines every PG resident should follow to ensure a secure and comfortable living experience.",
      author: "Priya Sharma",
      date: "March 12, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=200&fit=crop",
      category: "Safety",
      views: "8.9K",
      likes: "156"
    },
    {
      id: 3,
      title: "Budget-Friendly PG Options in Bangalore",
      excerpt: "Discover affordable PG accommodations in Bangalore without compromising on essential amenities and safety.",
      author: "Rahul Gupta",
      date: "March 10, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=200&fit=crop",
      category: "City Guide",
      views: "12.3K",
      likes: "298"
    },
    {
      id: 4,
      title: "How to Negotiate PG Rent Like a Pro",
      excerpt: "Learn effective negotiation strategies to get the best deal on your PG accommodation while maintaining good relationships.",
      author: "Anjali Verma",
      date: "March 8, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop",
      category: "Tips",
      views: "6.7K",
      likes: "189"
    },
    {
      id: 5,
      title: "Student Life: Managing PG Expenses",
      excerpt: "Practical tips for students to manage their PG expenses effectively while maintaining a comfortable lifestyle.",
      author: "Vikash Kumar",
      date: "March 5, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      category: "Student Life",
      views: "9.1K",
      likes: "234"
    },
    {
      id: 6,
      title: "PG vs Flat: Making the Right Choice",
      excerpt: "Compare the pros and cons of PG accommodations versus renting a flat to make an informed decision.",
      author: "Sneha Patel",
      date: "March 3, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=200&fit=crop",
      category: "Guide",
      views: "11.5K",
      likes: "267"
    },
    {
      id: 7,
      title: "Mumbai PG Living: What to Expect",
      excerpt: "A comprehensive guide to PG life in Mumbai, including costs, areas, and what makes the city unique for residents.",
      author: "Arjun Singh",
      date: "March 1, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=200&fit=crop",
      category: "City Guide",
      views: "7.8K",
      likes: "145"
    }
  ]

  const categories = [
    { name: "All Posts", count: blogPosts.length + 1, color: "bg-gray-100 text-gray-600" },
    { name: "Guide", count: 2, color: "bg-blue-100 text-blue-600" },
    { name: "Safety", count: 1, color: "bg-red-100 text-red-600" },
    { name: "City Guide", count: 2, color: "bg-green-100 text-green-600" },
    { name: "Tips", count: 1, color: "bg-purple-100 text-purple-600" },
    { name: "Student Life", count: 1, color: "bg-orange-100 text-orange-600" }
  ]

  const popularTags = [
    "PG Tips", "Safety", "Budget", "Bangalore", "Mumbai", "Delhi", 
    "Student Life", "Working Professional", "Negotiation", "First Time"
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
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              DwellDash Blog
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Expert insights, practical tips, and comprehensive guides to help you navigate the world of PG accommodations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-app-accent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-app-border focus:ring-2 focus:ring-app-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`px-4 py-2 rounded-lg ${category.color} font-medium transition-colors hover:shadow-md`}
                  >
                    {category.name} ({category.count})
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-app-text mb-8 flex items-center">
              <TrendingUp className="w-8 h-8 text-app-primary mr-3" />
              Featured Article
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl border border-app-border overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-app-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </div>
                </div>
                
                <div className="p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-app-text mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-app-muted mb-6 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6 text-sm text-app-muted">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="bg-app-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-app-primary/90 transition-colors flex items-center">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    
                    <div className="flex items-center space-x-4 text-app-muted">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{featuredPost.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{featuredPost.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-app-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-app-text mb-6">
              Latest Articles
            </h2>
            <p className="text-xl text-app-muted max-w-3xl mx-auto">
              Stay updated with the latest tips, guides, and insights about PG living and accommodation hunting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-app-border overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-app-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-app-text mb-3 line-clamp-2 group-hover:text-app-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-app-muted text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-app-muted mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-app-primary font-semibold hover:text-app-secondary transition-colors flex items-center">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                    
                    <div className="flex items-center space-x-3 text-xs text-app-muted">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-app-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-app-primary/90 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-app-text mb-8">Popular Topics</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {popularTags.map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-app-accent border border-app-border rounded-full text-app-text hover:bg-app-primary hover:text-white transition-colors"
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-app-secondary to-app-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest PG tips, city guides, and accommodation insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-app-text border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <button className="bg-white text-app-primary px-6 py-3 rounded-lg font-bold hover:bg-app-accent transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Blog 