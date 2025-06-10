import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const FavoriteButton = ({ propertyId, className = "", size = "w-5 h-5" }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && propertyId) {
      checkFavoriteStatus()
    }
  }, [user, propertyId])

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get(`/favorites/check/${propertyId}`)
      setIsFavorite(response.data.isFavorited)
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please login to save favorites')
      navigate('/login')
      return
    }

    if (loading) return

    setLoading(true)
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${propertyId}`)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await api.post(`/favorites/${propertyId}`)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update favorites'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-200 ${className} ${
        loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
      }`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`${size} transition-all duration-200 ${
          isFavorite 
            ? 'text-red-500 fill-current' 
            : 'text-gray-400 hover:text-red-500'
        }`} 
      />
    </button>
  )
}

export default FavoriteButton 