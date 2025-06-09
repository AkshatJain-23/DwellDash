import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RAGChatbot from './components/RAGChatbot'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <AuthProvider>
      <Router>
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
          <RAGChatbot />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App 