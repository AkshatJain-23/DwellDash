import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Send, Mail, Phone, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

const ContactOwnerModal = ({ isOpen, onClose, property }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Send message to property owner
      await api.post('/messages', {
        propertyId: property.id,
        ownerId: property.ownerId,
        senderName: data.name,
        senderEmail: data.email,
        senderPhone: data.phone,
        message: data.message,
        propertyTitle: property.title
      })

      toast.success('Message sent successfully! The owner will contact you soon.')
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again or call directly.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Property Owner
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Send a message about "{property.title}"
              </p>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="input pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[+]?[0-9\s\-\(\)]{10,15}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      type="tel"
                      className="input pl-10"
                      placeholder="+91 8426076800"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: { value: 1, message: 'Message cannot be empty' }
                    })}
                    rows={4}
                    className="input"
                    placeholder="Hi, I'm interested in this property. When can I visit? What are the terms and conditions?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* Quick Message Templates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Templates
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => register('message').onChange({
                        target: { value: "Hi, I'm interested in this property. When can I visit? Please share more details about the terms and amenities." }
                      })}
                      className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border text-gray-600"
                    >
                      💬 General inquiry about property visit
                    </button>
                    <button
                      type="button"
                      onClick={() => register('message').onChange({
                        target: { value: "Hi, I'm looking for accommodation from [DATE]. Is this property available? What are the rent and deposit details?" }
                      })}
                      className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border text-gray-600"
                    >
                      📅 Availability and pricing inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => register('message').onChange({
                        target: { value: "Hi, I'd like to know more about the amenities, house rules, and nearby facilities. Can we schedule a call?" }
                      })}
                      className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border text-gray-600"
                    >
                      🏠 Amenities and facilities inquiry
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default ContactOwnerModal 