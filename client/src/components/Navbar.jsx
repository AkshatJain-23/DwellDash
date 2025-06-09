import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, Home, Plus, User, LogOut, Eye, Users } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
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
    <nav className="navbar navbar-expand-lg bg-white dark:bg-dark-primary shadow-lg border-b border-gray-200 dark:border-dark-highlight transition-colors duration-300">
      <div className="container-fluid max-w-7xl mx-auto px-3 px-sm-4 px-lg-5">
        <div className="d-flex justify-content-between align-items-center w-100" style={{ minHeight: '4rem' }}>
          {/* Logo and brand */}
          <div className="d-flex align-items-center">
            <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
              <DwellDashLogo 
                className="h-10 w-10 me-2" 
              />
              <span className="text-xl font-bold text-gray-900 dark:text-dark-text">DwellDash</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <ul className="flex items-center space-x-6 mb-0">
              {/* Only show Properties link if user is not in Owner Mode */}
              {(!user || user.role !== 'owner' || isBrowsingAsTenant()) && (
                <li>
                  <Link
                    to="/properties"
                    className="text-gray-900 dark:text-dark-text hover:text-light-secondary dark:hover:text-dark-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors font-semibold"
                  >
                    Home
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/about"
                  className="text-gray-900 dark:text-dark-text hover:text-light-secondary dark:hover:text-dark-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors font-semibold"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-900 dark:text-dark-text hover:text-light-secondary dark:hover:text-dark-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors font-semibold"
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex items-center ml-3">
              <ThemeToggle />
            
              {isAuthenticated ? (
                <div className="flex items-center ml-3 space-x-4">
                {/* View Mode Toggle for Owners */}
                {user?.role === 'owner' && (
                  <button
                    onClick={handleViewModeToggle}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isBrowsingAsTenant() 
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title={isBrowsingAsTenant() ? 'Switch to Owner View' : 'Browse as Tenant'}
                  >
                    {isBrowsingAsTenant() ? (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Tenant View</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Owner View</span>
                      </>
                    )}
                  </button>
                )}

                {user?.role === 'owner' && !isBrowsingAsTenant() && (
                  <Link
                    to="/add-property"
                    className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Property
                  </Link>
                )}
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium font-semibold"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                    {isBrowsingAsTenant() && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
                        as Tenant
                      </span>
                    )}
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/dashboard"
                        onClick={closeProfileDropdown}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                </div>
              ) : (
                <div className="flex items-center ml-3 space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Get Started
                </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 border-0 p-1"
              type="button"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {/* Only show Properties link if user is not in Owner Mode */}
              {(!user || user.role !== 'owner' || isBrowsingAsTenant()) && (
                <Link
                  to="/properties"
                  className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                  onClick={closeMobileMenu}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Home
                </Link>
              )}
              <Link
                to="/about"
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  {/* View Mode Toggle for Mobile */}
                  {user?.role === 'owner' && (
                    <button
                      onClick={handleViewModeToggle}
                      className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center font-semibold ${
                        isBrowsingAsTenant() 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {isBrowsingAsTenant() ? (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Switch to Owner View
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Browse as Tenant
                        </>
                      )}
                    </button>
                  )}
                  
                  <Link
                    to="/dashboard"
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Dashboard
                    {isBrowsingAsTenant() && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
                        as Tenant
                      </span>
                    )}
                  </Link>
                  {user?.role === 'owner' && !isBrowsingAsTenant() && (
                    <Link
                      to="/add-property"
                      className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                      onClick={closeMobileMenu}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Property
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium font-semibold"
                    onClick={closeMobileMenu}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 