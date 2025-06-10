import { useState } from 'react'
import { Bed } from 'lucide-react'

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = "", 
  fallbackIcon: FallbackIcon = Bed,
  onError,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = (e) => {
    console.error('🚨 Image failed to load:', src)
    console.error('🚨 Error details:', e.target.error)
    console.error('🚨 Full URL attempted:', e.target.src)
    setImageError(true)
    setIsLoading(false)
    if (onError) onError(e)
  }

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', src)
    setIsLoading(false)
    setImageError(false)
  }

  // If there's no src or image failed to load, show fallback
  if (!src || imageError) {
    console.log('🔄 Showing fallback for:', src, 'Error:', imageError, 'No src:', !src)
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <FallbackIcon className="w-12 h-12 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
        {...props}
      />
    </div>
  )
}

export default ImageWithFallback 