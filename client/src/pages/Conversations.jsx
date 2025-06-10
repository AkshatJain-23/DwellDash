import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OwnerChatPanel from '../components/OwnerChatPanel'
import TenantChatPanel from '../components/TenantChatPanel'

const Conversations = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Conversations</h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'owner' 
              ? 'Chat with interested tenants about your properties' 
              : 'Your conversations with property owners'
            }
          </p>
        </div>

        {/* Chat Component Based on User Role */}
        {user.role === 'owner' ? (
          <OwnerChatPanel 
            ownerId={user.id} 
            ownerName={user.name} 
          />
        ) : (
          <TenantChatPanel 
            tenantId={user.id} 
            tenantEmail={user.email} 
            tenantName={user.name} 
          />
        )}
      </div>
    </div>
  )
}

export default Conversations 