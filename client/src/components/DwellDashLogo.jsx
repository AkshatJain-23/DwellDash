const DwellDashLogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House base */}
      <path
        d="M15 75V45L50 15L85 45V75H70V55H60V75H40V55H30V75H15Z"
        className="fill-light-secondary dark:fill-accent-light"
        fillOpacity="0.9"
      />
      
      {/* Roof accent */}
      <path
        d="M20 50L50 20L80 50L75 45L50 20L25 45L20 50Z"
        className="fill-light-primary dark:fill-accent-medium"
        fillOpacity="0.8"
      />
      
      {/* Door */}
      <rect
        x="45"
        y="60"
        width="10"
        height="15"
        className="fill-gray-800 dark:fill-gray-200"
      />
      
      {/* Windows */}
      <rect
        x="32"
        y="40"
        width="6"
        height="6"
        className="fill-gray-800 dark:fill-gray-200"
      />
      <rect
        x="62"
        y="40"
        width="6"
        height="6"
        className="fill-gray-800 dark:fill-gray-200"
      />
      
      {/* Dash elements - representing speed/efficiency */}
      <g className="opacity-80">
        <rect x="10" y="35" width="8" height="2" rx="1" className="fill-light-accent dark:fill-accent-light" />
        <rect x="5" y="40" width="10" height="2" rx="1" className="fill-light-accent dark:fill-accent-light" />
        <rect x="8" y="45" width="6" height="2" rx="1" className="fill-light-accent dark:fill-accent-light" />
      </g>
      
      <g className="opacity-80">
        <rect x="82" y="35" width="8" height="2" rx="1" className="fill-light-accent dark:fill-accent-light" />
        <rect x="85" y="40" width="10" height="2" rx="1" className="fill-light-accent dark:fill-accent-light" />
        <rect x="86" y="45" width="6" height="2" rx="1" className="fill-light-accent dark:fill-accent-light" />
      </g>
      
      {/* Chimney */}
      <rect
        x="65"
        y="25"
        width="4"
        height="8"
        className="fill-light-secondary dark:fill-accent-medium"
      />
      
      {/* Smoke dashes */}
      <g className="opacity-70">
        <circle cx="68" cy="22" r="1" className="fill-light-primary dark:fill-accent-light" />
        <circle cx="70" cy="19" r="1" className="fill-light-primary dark:fill-accent-light" />
        <circle cx="67" cy="16" r="1" className="fill-light-primary dark:fill-accent-light" />
        <circle cx="69" cy="13" r="1" className="fill-light-primary dark:fill-accent-light" />
      </g>
    </svg>
  )
}

export default DwellDashLogo 