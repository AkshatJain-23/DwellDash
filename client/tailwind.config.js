/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors (aqua/mint palette)
        light: {
          primary: '#B3EBF2',    // Light aqua
          secondary: '#85D1DB',   // Medium aqua
          accent: '#B6F2D1',     // Light mint
          highlight: '#C9FDF2',   // Very light mint
          text: '#1a1a1a',       // Dark text for light mode
          surface: '#ffffff',     // White surfaces
        },
        // Dark theme colors (sophisticated gray/black palette)
        dark: {
          primary: '#000000',     // Pure black
          secondary: '#D1D0D0',   // Light gray
          accent: '#988686',      // Medium gray
          highlight: '#5C4E4E',   // Dark gray
          text: '#f7fafc',        // Light text for dark mode
          surface: '#1a1a1a',     // Dark surface
        }
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