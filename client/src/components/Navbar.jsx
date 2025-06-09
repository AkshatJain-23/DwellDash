import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, Home, Plus, User, LogOut, Eye, Users, Building2, Search, Heart } from 'lucide-react'
import DwellDashLogo from './DwellDashLogo'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated, viewMode, toggleViewMode, isBrowsingAsTenant } = useAuth()
  const navigate = useNavigate()
  const profileDropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
    setIsProfileDropdownOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false)
  }

  const handleViewModeToggle = () => {
    toggleViewMode()
    closeMobileMenu()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b border-app-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 text-decoration-none">
              <DwellDashLogo className="h-8 w-8" />
              <span className="text-2xl font-bold text-app-secondary">DwellDash</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {(!user || user.role !== 'owner' || isBrowsingAsTenant()) && (
                <Link
                  to="/properties"
                  className="flex items-center space-x-1 text-app-text hover:text-app-primary px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse PGs</span>
                </Link>
              )}
              <Link
                to="/about"
                className="text-app-text hover:text-app-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-app-text hover:text-app-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Owner specific actions */}
                {user?.role === 'owner' && !isBrowsingAsTenant() && (
                  <Link
                    to="/add-property"
                    className="hidden md:flex items-center space-x-2 bg-app-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-app-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>List Property</span>
                  </Link>
                )}

                {/* View Mode Toggle for Owners */}
                {user?.role === 'owner' && (
                  <button
                    onClick={handleViewModeToggle}
                    className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isBrowsingAsTenant() 
                        ? 'bg-app-primary/10 text-app-primary border border-app-primary' 
                        : 'bg-app-accent text-app-text hover:bg-app-border'
                    }`}
                    title={isBrowsingAsTenant() ? 'Switch to Owner View' : 'Browse as Tenant'}
                  >
                    {isBrowsingAsTenant() ? (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Tenant Mode</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Owner Mode</span>
                      </>
                    )}
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 text-app-text hover:text-app-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-app-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user?.name}</span>
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-app-border rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-app-border">
                        <p className="text-sm font-semibold text-app-text">{user?.name}</p>
                        <p className="text-xs text-app-muted">{user?.email}</p>
                        {isBrowsingAsTenant() && (
                          <span className="inline-block mt-1 text-xs bg-app-primary/10 text-app-primary px-2 py-1 rounded-full">
                            Browsing as Tenant
                          </span>
                        )}
                      </div>
                      
                      <Link
                        to="/dashboard"
                        onClick={closeProfileDropdown}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-app-text hover:bg-app-accent transition-colors"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      {user?.role === 'tenant' && (
                        <Link
                          to="/favorites"
                          onClick={closeProfileDropdown}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-app-text hover:bg-app-accent transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Favorites</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-app-border mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-app-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-app-text hover:text-app-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-app-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-app-primary/90 transition-colors shadow-sm"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-app-text hover:bg-app-accent transition-colors"
              type="button"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-app-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {(!user || user.role !== 'owner' || isBrowsingAsTenant()) && (
                <Link
                  to="/properties"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 text-app-text hover:text-app-primary hover:bg-app-accent px-3 py-2 rounded-lg text-base font-medium transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span>Browse PGs</span>
                </Link>
              )}
              
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="block text-app-text hover:text-app-primary hover:bg-app-accent px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                About
              </Link>
              
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block text-app-text hover:text-app-primary hover:bg-app-accent px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <div className="pt-4 border-t border-app-border">
                  {/* View Mode Toggle for Mobile */}
                  {user?.role === 'owner' && (
                    <button
                      onClick={handleViewModeToggle}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-base font-medium transition-colors mb-2 ${
                        isBrowsingAsTenant() 
                          ? 'bg-app-primary/10 text-app-primary' 
                          : 'bg-app-accent text-app-text'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        {isBrowsingAsTenant() ? (
                          <>
                            <Users className="w-5 h-5" />
                            <span>Tenant Mode</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5" />
                            <span>Owner Mode</span>
                          </>
                        )}
                      </span>
                    </button>
                  )}

                  {user?.role === 'owner' && !isBrowsingAsTenant() && (
                    <Link
                      to="/add-property"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-2 bg-app-primary text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-app-primary/90 transition-colors mb-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>List Property</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 text-app-text hover:text-app-primary hover:bg-app-accent px-3 py-2 rounded-lg text-base font-medium transition-colors"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left text-app-muted hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-base font-medium transition-colors mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-app-border space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block text-app-text hover:text-app-primary hover:bg-app-accent px-3 py-2 rounded-lg text-base font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block bg-app-primary text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-app-primary/90 transition-colors text-center"
                  >
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 