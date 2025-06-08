import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [viewMode, setViewMode] = useState(() => {
    // Default view mode based on user role, with localStorage preference
    const savedViewMode = localStorage.getItem('viewMode')
    return savedViewMode || 'default'
  })

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  // Save view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Reset view mode to default on login
      setViewMode('default')
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Reset view mode to default on registration
      setViewMode('default')
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('viewMode')
    setToken(null)
    setUser(null)
    setViewMode('default')
    delete api.defaults.headers.common['Authorization']
  }

  const toggleViewMode = () => {
    if (user?.role === 'owner') {
      setViewMode(prev => prev === 'tenant' ? 'default' : 'tenant')
    }
  }

  // Determine effective role based on view mode
  const getEffectiveRole = () => {
    if (user?.role === 'owner' && viewMode === 'tenant') {
      return 'tenant'
    }
    return user?.role
  }

  // Check if user should see tenant features
  const isBrowsingAsTenant = () => {
    return user?.role === 'owner' && viewMode === 'tenant'
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    viewMode,
    toggleViewMode,
    getEffectiveRole,
    isBrowsingAsTenant
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 