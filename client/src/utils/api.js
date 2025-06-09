import axios from 'axios'

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    title: "Comfortable PG for Working Professionals in Koramangala",
    description: "Spacious and well-furnished PG accommodation perfect for working professionals. Located in the heart of Koramangala with easy access to IT companies, restaurants, and shopping centers.",
    rent: 15000,
    deposit: 30000,
    city: "Bangalore",
    address: "123 Koramangala 5th Block, Near Forum Mall, Bangalore, Karnataka 560095",
    propertyType: "single-room",
    gender: "any",
    amenities: ["wifi", "ac", "meals", "laundry", "parking", "security"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=600&fit=crop&crop=center"
    ],
    contactPhone: "+91 98765 43210",
    availableFrom: "2024-01-15",
    ownerId: "1",
    createdAt: "2025-06-07T11:06:13.969Z",
    isActive: true
  },
  {
    id: "2",
    title: "Premium Ladies PG in Bandra West",
    description: "Exclusive ladies-only PG accommodation in prime Bandra West location. Features include fully furnished rooms, 24/7 security, housekeeping services, and home-cooked meals.",
    rent: 25000,
    deposit: 50000,
    city: "Mumbai",
    address: "456 Bandra West, Near Linking Road, Mumbai, Maharashtra 400050",
    propertyType: "shared-room",
    gender: "female",
    amenities: ["wifi", "ac", "meals", "laundry", "security", "housekeeping"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop&crop=center"
    ],
    contactPhone: "+91 98765 43211",
    availableFrom: "2024-02-01",
    ownerId: "1",
    createdAt: "2025-06-07T11:06:13.969Z",
    isActive: true
  },
  {
    id: "3",
    title: "Budget-Friendly PG for Students in Lajpat Nagar",
    description: "Affordable PG accommodation designed for students and young professionals. Located near Delhi University and metro station. Perfect for economical housing options.",
    rent: 8000,
    deposit: 16000,
    city: "Delhi",
    address: "789 Lajpat Nagar II, Near Metro Station, New Delhi, Delhi 110024",
    propertyType: "shared-room",
    gender: "male",
    amenities: ["wifi", "meals", "study-area", "security"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e5b0cb26?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center"
    ],
    contactPhone: "+91 98765 43212",
    availableFrom: "2024-01-20",
    ownerId: "1",
    createdAt: "2025-06-07T11:06:13.969Z",
    isActive: true
  },
  {
    id: "4",
    title: "Luxury PG with Swimming Pool in Anna Nagar",
    description: "Premium PG accommodation with world-class amenities including swimming pool, gym, and recreational facilities. Located in upscale Anna Nagar with easy access to IT corridor.",
    rent: 20000,
    deposit: 40000,
    city: "Chennai",
    address: "321 Anna Nagar West, Near Express Avenue Mall, Chennai, Tamil Nadu 600040",
    propertyType: "single-room",
    gender: "any",
    amenities: ["wifi", "ac", "meals", "gym", "swimming-pool", "parking", "security"],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop&crop=center"
    ],
    contactPhone: "+91 98765 43213",
    availableFrom: "2024-02-15",
    ownerId: "1",
    createdAt: "2025-06-07T11:06:13.969Z",
    isActive: true
  },
  {
    id: "5",
    title: "Modern PG for IT Professionals in Hinjewadi",
    description: "State-of-the-art PG facility designed specifically for IT professionals working in Hinjewadi IT Park. Features include high-speed internet, power backup, and shuttle service.",
    rent: 12000,
    deposit: 24000,
    city: "Pune",
    address: "654 Hinjewadi Phase 1, Near Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057",
    propertyType: "single-room",
    gender: "any",
    amenities: ["wifi", "ac", "meals", "shuttle", "power-backup", "parking"],
    images: [
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center"
    ],
    contactPhone: "+91 98765 43214",
    availableFrom: "2024-01-10",
    ownerId: "1",
    createdAt: "2025-06-07T11:06:13.969Z",
    isActive: true
  },
  {
    id: "6",
    title: "Cozy PG for Girls in Jubilee Hills",
    description: "Safe and comfortable PG accommodation exclusively for girls in the prestigious Jubilee Hills area. Features include CCTV surveillance, biometric access, and nutritious meals.",
    rent: 18000,
    deposit: 36000,
    city: "Hyderabad",
    address: "987 Jubilee Hills, Near GVK One Mall, Hyderabad, Telangana 500033",
    propertyType: "single-room",
    gender: "female",
    amenities: ["wifi", "ac", "meals", "security", "cctv", "biometric"],
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop&crop=center"
    ],
    contactPhone: "+91 98765 43215",
    availableFrom: "2024-02-10",
    ownerId: "1",
    createdAt: "2025-06-07T11:06:13.969Z",
    isActive: true
  }
]

// Mock users storage
let mockUsers = [
  {
    id: "1",
    name: "Demo Owner",
    email: "owner@demo.com",
    role: "owner",
    phone: "+91 98765 43210",
    createdAt: "2025-06-07T11:06:13.969Z"
  },
  {
    id: "2", 
    name: "Demo Tenant",
    email: "tenant@demo.com", 
    role: "tenant",
    phone: "+91 98765 43211",
    createdAt: "2025-06-07T11:06:13.969Z"
  }
]

// Check if we're in development or if backend is available
const isBackendAvailable = () => {
  return import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== '/api'
}

// Mock JWT token generation
const generateMockToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }
  // In a real app, this would be a proper JWT. For demo, we'll use base64
  return btoa(JSON.stringify(payload))
}

// Parse mock token
const parseMockToken = (token) => {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

// Mock API functions
const mockAPI = {
  get: (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url.startsWith('/properties')) {
          const urlParams = new URLSearchParams(url.split('?')[1] || '')
          let filteredProperties = [...mockProperties]
          
          // Apply filters
          const search = urlParams.get('search')
          const city = urlParams.get('city')
          const minRent = urlParams.get('minRent')
          const maxRent = urlParams.get('maxRent')
          const propertyType = urlParams.get('propertyType')
          const gender = urlParams.get('gender')
          
          if (search) {
            const searchTerm = search.toLowerCase()
            filteredProperties = filteredProperties.filter(property => 
              property.title.toLowerCase().includes(searchTerm) ||
              property.description.toLowerCase().includes(searchTerm) ||
              property.address.toLowerCase().includes(searchTerm)
            )
          }
          
          if (city) {
            filteredProperties = filteredProperties.filter(property => 
              property.city.toLowerCase() === city.toLowerCase()
            )
          }
          
          if (minRent) {
            filteredProperties = filteredProperties.filter(property => 
              property.rent >= parseInt(minRent)
            )
          }
          
          if (maxRent) {
            filteredProperties = filteredProperties.filter(property => 
              property.rent <= parseInt(maxRent)
            )
          }
          
          if (propertyType) {
            filteredProperties = filteredProperties.filter(property => 
              property.propertyType === propertyType
            )
          }
          
          if (gender) {
            filteredProperties = filteredProperties.filter(property => 
              property.gender === gender || property.gender === 'any'
            )
          }
          
          if (url.includes('/properties/owner/my-properties')) {
            // Owner's properties
            const token = localStorage.getItem('token')
            if (!token) {
              reject({ response: { status: 401, data: { error: 'No token provided' } } })
              return
            }
            
            const decoded = parseMockToken(token)
            if (!decoded) {
              reject({ response: { status: 401, data: { error: 'Invalid token' } } })
              return
            }
            
            const ownerProperties = mockProperties.filter(p => p.ownerId === decoded.userId)
            resolve({ data: ownerProperties })
          } else if (url.includes('/properties/') && !url.includes('?')) {
            // Single property request
            const propertyId = url.split('/properties/')[1]
            const property = mockProperties.find(p => p.id === propertyId)
            resolve({ data: property })
          } else {
            // Properties list
            resolve({
              data: {
                properties: filteredProperties,
                totalCount: filteredProperties.length,
                currentPage: 1,
                totalPages: Math.ceil(filteredProperties.length / 12)
              }
            })
          }
        } else if (url === '/auth/me') {
          // Get current user
          const token = localStorage.getItem('token')
          if (!token) {
            reject({ response: { status: 401, data: { error: 'No token provided' } } })
            return
          }
          
          const decoded = parseMockToken(token)
          if (!decoded) {
            reject({ response: { status: 401, data: { error: 'Invalid token' } } })
            return
          }
          
          const user = mockUsers.find(u => u.id === decoded.userId)
          if (!user) {
            reject({ response: { status: 404, data: { error: 'User not found' } } })
            return
          }
          
          resolve({
            data: {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
              }
            }
          })
        } else if (url === '/stats') {
          resolve({
            data: [
              { number: "50+", label: "Happy Tenants" },
              { number: "25+", label: "Verified Properties" },
              { number: "6", label: "Cities Covered" },
              { number: "95%", label: "Satisfaction Rate" }
            ]
          })
        } else {
          resolve({ data: [] })
        }
      }, 300) // Simulate network delay
    })
  },
  
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/auth/register') {
          // Mock registration
          const { name, email, password, role, phone } = data
          
          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === email)
          if (existingUser) {
            reject({ response: { status: 400, data: { error: 'User already exists' } } })
            return
          }
          
          // Create new user
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            role,
            phone: phone || '',
            createdAt: new Date().toISOString()
          }
          
          mockUsers.push(newUser)
          
          // Generate token
          const token = generateMockToken(newUser)
          
          resolve({
            data: {
              token,
              user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone
              }
            }
          })
        } else if (url === '/auth/login') {
          // Mock login
          const { email, password } = data
          
          // Find user
          const user = mockUsers.find(u => u.email === email)
          if (!user) {
            reject({ response: { status: 400, data: { error: 'Invalid credentials' } } })
            return
          }
          
          // In a real app, we'd check password hash
          // For demo, accept any password
          
          // Generate token
          const token = generateMockToken(user)
          
          resolve({
            data: {
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
              }
            }
          })
        } else {
          reject(new Error('Backend not available. Please deploy the server for full functionality.'))
        }
      }, 500) // Simulate network delay for auth operations
    })
  },
  
  put: () => Promise.reject(new Error('Backend not available. Please deploy the server to edit properties.')),
  delete: () => Promise.reject(new Error('Backend not available. Please deploy the server to delete properties.'))
}

export const api = isBackendAvailable() ? axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
}) : mockAPI

// Only add interceptors for real axios instance
if (isBackendAvailable()) {
// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
}

export default api 