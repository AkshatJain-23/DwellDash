import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { api } from '../utils/api'
import { ArrowLeft, Upload, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageWithFallback from '../components/ImageWithFallback'
import CityInput from '../components/CityInput'
import { CITIES, PROPERTY_TYPES, GENDER_PREFERENCES, AMENITIES } from '../utils/constants'

const EditProperty = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedImages, setSelectedImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm()

  const availableAmenities = AMENITIES

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/properties/${id}`)
      const property = response.data
      
      // Populate form with existing data
      reset({
        title: property.title,
        description: property.description,
        rent: property.rent,
        deposit: property.deposit || 0,
        city: property.city,
        address: property.address,
        propertyType: property.propertyType,
        gender: property.gender,
        availableFrom: property.availableFrom?.split('T')[0], // Format date for input
        contactPhone: property.contactPhone
      })
      
      setSelectedAmenities(property.amenities || [])
      setExistingImages(property.images || [])
    } catch (error) {
      console.error('Failed to fetch property:', error)
      toast.error('Failed to load property details')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (selectedImages.length + files.length + existingImages.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setSelectedImages([...selectedImages, ...files])
  }

  const removeNewImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      
      // Append form data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
      
      // Append amenities
      formData.append('amenities', selectedAmenities.join(','))
      
      // Append new images
      selectedImages.forEach(image => {
        formData.append('images', image)
      })

      const response = await api.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Property updated successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to update property:', error)
      const message = error.response?.data?.error || 'Failed to update property'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-2">Update your property details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 5, message: 'Title must be at least 5 characters' }
                  })}
                  type="text"
                  className="input"
                  placeholder="e.g., Comfortable PG for Working Professionals in Koramangala"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 20, message: 'Description must be at least 20 characters' }
                  })}
                  rows={4}
                  className="input"
                  placeholder="Describe your property, amenities, location benefits, etc."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  {...register('rent', {
                    required: 'Rent is required',
                    min: { value: 1000, message: 'Rent must be at least ₹1,000' }
                  })}
                  type="number"
                  className="input"
                  placeholder="15000"
                />
                {errors.rent && (
                  <p className="mt-1 text-sm text-red-600">{errors.rent.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (₹)
                </label>
                <input
                  {...register('deposit', { min: 0 })}
                  type="number"
                  className="input"
                  placeholder="30000"
                />
                {errors.deposit && (
                  <p className="mt-1 text-sm text-red-600">{errors.deposit.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Controller
                  name="city"
                  control={control}
                  rules={{ 
                    required: 'City is required',
                    minLength: { value: 2, message: 'City name must be at least 2 characters' }
                  }}
                  render={({ field }) => (
                    <CityInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Enter city name (e.g., Delhi, Mumbai, Bangalore)"
                      error={errors.city?.message}
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  {...register('propertyType', { required: 'Property type is required' })}
                  className="input"
                >
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  {...register('address', {
                    required: 'Address is required',
                    minLength: { value: 10, message: 'Address must be at least 10 characters' }
                  })}
                  rows={2}
                  className="input"
                  placeholder="123 Street Name, Area, City, State, PIN Code"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference *
                </label>
                <select
                  {...register('gender', { required: 'Gender preference is required' })}
                  className="input"
                >
                  <option value="">Select Preference</option>
                  {GENDER_PREFERENCES.map((preference) => (
                    <option key={preference.value} value={preference.value}>
                      {preference.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From *
                </label>
                <input
                  {...register('availableFrom', { required: 'Available date is required' })}
                  type="date"
                  className="input"
                />
                {errors.availableFrom && (
                  <p className="mt-1 text-sm text-red-600">{errors.availableFrom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  {...register('contactPhone', {
                    required: 'Contact phone is required',
                    pattern: {
                      value: /^[+]?[0-9\s\-\(\)]{10,15}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  type="tel"
                  className="input"
                                      placeholder="+91 8426076800"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableAmenities.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{amenity.replace('-', ' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <ImageWithFallback
                        src={image}
                        alt={`Current ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add More Images (Max 10 total)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* New Image Preview */}
            {selectedImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">New Images to Add</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <ImageWithFallback
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating Property...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProperty 