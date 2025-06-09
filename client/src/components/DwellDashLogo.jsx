const DwellDashLogo = ({ className = "h-8 w-auto" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main building structure */}
      <rect
        x="10"
        y="15"
        width="80"
        height="35"
        rx="2"
        className="fill-blue-600"
      />
      
      {/* Roof */}
      <path
        d="M5 20 L50 5 L95 20 L90 15 L50 2 L10 15 Z"
        className="fill-blue-500"
      />
      
      {/* Windows - Left side */}
      <rect x="20" y="25" width="8" height="8" rx="1" className="fill-gray-800" />
      <rect x="32" y="25" width="8" height="8" rx="1" className="fill-gray-800" />
      
      {/* Door */}
      <rect x="44" y="30" width="12" height="20" rx="1" className="fill-gray-800" />
      
      {/* Windows - Right side */}
      <rect x="60" y="25" width="8" height="8" rx="1" className="fill-gray-800" />
      <rect x="72" y="25" width="8" height="8" rx="1" className="fill-gray-800" />
      
      {/* Decorative elements - Left */}
      <rect x="10" y="35" width="8" height="2" rx="1" className="fill-blue-400" />
      <rect x="5" y="40" width="10" height="2" rx="1" className="fill-blue-400" />
      <rect x="8" y="45" width="6" height="2" rx="1" className="fill-blue-400" />
      
      {/* Decorative elements - Right */}
      <rect x="82" y="35" width="8" height="2" rx="1" className="fill-blue-400" />
      <rect x="85" y="40" width="10" height="2" rx="1" className="fill-blue-400" />
      <rect x="86" y="45" width="6" height="2" rx="1" className="fill-blue-400" />
      
      {/* Chimney */}
      <rect
        x="65"
        y="8"
        width="6"
        height="12"
        rx="1"
        className="fill-blue-600"
      />
      
      {/* Smoke particles */}
      <circle cx="68" cy="22" r="1" className="fill-blue-500" />
      <circle cx="70" cy="19" r="1" className="fill-blue-500" />
      <circle cx="67" cy="16" r="1" className="fill-blue-500" />
      <circle cx="69" cy="13" r="1" className="fill-blue-500" />
    </svg>
  )
}

export default DwellDashLogo 