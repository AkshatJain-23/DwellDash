/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional real estate platform colors (NoBroker/MagicBricks inspired)
        'app-primary': '#FF6B35',      // Orange-red primary (trust/action)
        'app-secondary': '#004D76',    // Deep blue (professional/trust)
        'app-accent': '#F8F9FA',       // Light gray (clean background)
        'app-highlight': '#FFFFFF',    // Pure white (cards/surfaces)
        'app-text': '#2C3E50',         // Dark blue-gray (readability)
        'app-surface': '#FFFFFF',      // White surfaces
        'app-success': '#27AE60',      // Green (verified/success)
        'app-warning': '#F39C12',      // Orange (alerts/featured)
        'app-border': '#E1E8ED',       // Light border
        'app-muted': '#95A5A6',        // Muted text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 