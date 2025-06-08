import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Mail, Send, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', {
        email: data.email
      })

      if (response.data.success) {
        setEmailSent(true)
        setSentEmail(data.email)
        
        // Store token in localStorage for development testing
        if (response.data.resetToken) {
          localStorage.setItem('dev_reset_token', response.data.resetToken)
        }
        
        toast.success('Password reset link sent to your email!')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      const message = error.response?.data?.error || 'Failed to send reset email. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setEmailSent(false)
    setSentEmail('')
    onClose()
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
          onClick={handleClose}
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
                  {emailSent ? 'Check Your Email' : 'Reset Password'}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {emailSent ? (
                /* Success State */
                <div className="text-center">
                  <div className="mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Password Reset Link Sent!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-medium text-gray-900 mb-4">
                    {sentEmail}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Next steps:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Check your email inbox</li>
                      <li>• Click the reset link in the email</li>
                      <li>• Create a new password</li>
                      <li>• Sign in with your new password</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500">
                    Didn't receive the email? Check your spam folder or try again in a few minutes.
                  </p>
                  
                  {/* Development mode: Show reset link directly */}
                  {process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-800 font-medium mb-2">
                        🔧 Development Mode - Direct Reset Link:
                      </p>
                      <a
                        href={`/reset-password?token=${localStorage.getItem('dev_reset_token')}`}
                        className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click here to reset password directly
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit(onSubmit)}>
                  <p className="text-gray-600 mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
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
                        placeholder="Enter your email address"
                        autoFocus
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Make sure to check your spam folder if you don't see the email in your inbox.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
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
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer for success state */}
            {emailSent && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setEmailSent(false)
                      setSentEmail('')
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ← Try different email
                  </button>
                  <button
                    onClick={handleClose}
                    className="btn-primary"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default ForgotPasswordModal 