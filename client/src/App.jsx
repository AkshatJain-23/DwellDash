import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EnhancedRAGChatbot from './components/EnhancedRAGChatbot'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Conversations from './pages/Conversations'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ResetPassword from './pages/ResetPassword'
import Sitemap from './pages/Sitemap'
import HelpCenter from './pages/HelpCenter'
import Safety from './pages/Safety'
import GettingStarted from './pages/GettingStarted'
import Tutorials from './pages/Tutorials'
import Blog from './pages/Blog'
import Cookies from './pages/Cookies'
import Refunds from './pages/Refunds'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-app-highlight flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/guides/getting-started" element={<GettingStarted />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/add-property" element={
                <ProtectedRoute>
                  <AddProperty />
                </ProtectedRoute>
              } />
              <Route path="/edit-property/:id" element={
                <ProtectedRoute>
                  <EditProperty />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/conversations" element={
                <ProtectedRoute>
                  <Conversations />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <EnhancedRAGChatbot />
        </div>
    </AuthProvider>
  )
}

export default App 