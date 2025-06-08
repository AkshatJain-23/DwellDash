import { useState, useRef, useEffect } from 'react'
import { POPULAR_CITIES } from '../utils/constants'
import { ChevronDown } from 'lucide-react'

const CityInput = ({ 
  value = '', 
  onChange, 
  placeholder = "Enter city name...",
  className = "",
  error,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredCities, setFilteredCities] = useState(POPULAR_CITIES)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (value) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities(POPULAR_CITIES)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  const handleCitySelect = (city) => {
    onChange(city)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={`input pr-8 ${className}`}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredCities.length > 0 ? (
            <>
              {value && !POPULAR_CITIES.some(city => city.toLowerCase() === value.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleCitySelect(value)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-200"
                >
                  <span className="font-medium">"{value}"</span>
                  <span className="text-sm text-gray-500 ml-2">(Use custom city)</span>
                </button>
              )}
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                Popular Cities
              </div>
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {city}
                </button>
              ))}
            </>
          ) : value ? (
            <button
              type="button"
              onClick={() => handleCitySelect(value)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
            >
              <span className="font-medium">"{value}"</span>
              <span className="text-sm text-gray-500 ml-2">(Use this city)</span>
            </button>
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No cities found
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default CityInput 