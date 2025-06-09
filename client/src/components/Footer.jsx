import { Mail, Phone, MapPin } from 'lucide-react'
import DwellDashLogo from './DwellDashLogo'

const Footer = () => {
  return (
    <footer className="bg-light-highlight dark:bg-dark-primary text-gray-800 dark:text-dark-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <DwellDashLogo 
                className="h-10 w-10" 
              />
              <span className="text-xl font-bold text-gray-800 dark:text-dark-text">DwellDash</span>
            </div>
            <p className="text-gray-700 dark:text-dark-accent mb-4 max-w-md">
              Find the perfect PG accommodation across India. We connect students and professionals with verified, affordable, and comfortable paying guest options.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-700 dark:text-dark-accent">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">All major cities in India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-dark-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-700 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/properties" className="text-gray-700 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text transition-colors">
                  Properties
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-700 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text transition-colors">
                  List Your PG
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-700 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-700 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-dark-text">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 dark:text-dark-accent">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">dwelldash3@gmail.com</span>
              </li>
              <li className="flex items-center text-gray-700 dark:text-dark-accent">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2 text-gray-800 dark:text-dark-text">Popular Cities</h4>
              <div className="flex flex-wrap gap-2">
                {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'].map((city) => (
                  <span
                    key={city}
                    className="text-xs bg-gray-200 dark:bg-dark-surface text-gray-800 dark:text-dark-text px-2 py-1 rounded"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-dark-highlight mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-dark-accent text-sm">
              © 2024 DwellDash. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-600 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/contact" className="text-gray-600 dark:text-dark-accent hover:text-gray-900 dark:hover:text-dark-text text-sm transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 