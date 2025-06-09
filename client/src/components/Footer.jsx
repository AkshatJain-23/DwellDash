import { Mail, Phone, MapPin, Building2, Users, Shield, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStats } from '../contexts/StatsContext'
import DwellDashLogo from './DwellDashLogo'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { getStat, getRawStat } = useStats()

  const quickLinks = [
    { name: 'Browse PGs', href: '/properties' },
    { name: 'List Your Property', href: '/register' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const cities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Hyderabad',
    'Noida', 'Gurgaon', 'Kolkata', 'Ahmedabad', 'Kochi', 'Indore'
  ]

  // Dynamic features using live stats
  const features = [
    { icon: Shield, text: 'Zero Brokerage' },
    { icon: Star, text: 'Verified Properties' },
    { icon: Users, text: `${getStat('tenants')} Happy Tenants` },
    { icon: Building2, text: `${getStat('properties')} Properties` }
  ]

  return (
    <footer className="bg-app-secondary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <DwellDashLogo className="h-10 w-10" />
              <span className="text-2xl font-bold text-white">DwellDash</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              India's most trusted PG booking platform. Find verified accommodations with zero brokerage and complete transparency.
            </p>

            {/* Key Features with Live Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                  <feature.icon className="w-4 h-4 text-app-primary" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>


          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-app-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-app-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="text-md font-semibold mb-4 text-white">For Property Owners</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-app-primary transition-colors text-sm">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-300 hover:text-app-primary transition-colors text-sm">
                    Owner Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-app-primary transition-colors text-sm">
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Popular Cities</h3>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city, index) => (
                <Link
                  key={index}
                  to={`/properties?city=${city}`}
                  className="text-gray-300 hover:text-app-primary transition-colors text-sm py-1"
                >
                  PG in {city}
                </Link>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-semibold mb-2">Trusted Platform</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <div>✓ {getRawStat('satisfaction')}% Customer Satisfaction</div>
                <div>✓ Zero Brokerage Guarantee</div>
                <div>✓ Verified Properties Only</div>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact & Support</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-app-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Email Support</p>
                  <a href="mailto:dwelldash3@gmail.com" className="text-white hover:text-app-primary transition-colors">
                    dwelldash3@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-app-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Phone Support</p>
                  <a href="tel:+918426076800" className="text-white hover:text-app-primary transition-colors">
                    +91 84260 76800
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-app-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Office Address</p>
                  <p className="text-white">
                    Bangalore, Karnataka<br />
                    India
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-semibold mb-2">Support Hours</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>Monday - Friday: 9 AM - 7 PM</div>
                  <div>Saturday: 10 AM - 5 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} DwellDash. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-app-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-app-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/refund" className="hover:text-app-primary transition-colors">
                Refund Policy
              </Link>
              <Link to="/sitemap" className="hover:text-app-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 