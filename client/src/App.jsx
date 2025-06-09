import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ImageTest from './pages/ImageTest'
import ProtectedRoute from './components/ProtectedRoute'
import EnhancedRAGChatbot from './components/EnhancedRAGChatbot'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-light-highlight dark:bg-dark-surface flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/image-test" element={<ImageTest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
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
          </Routes>
        </main>
        <Footer />
        <EnhancedRAGChatbot />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 