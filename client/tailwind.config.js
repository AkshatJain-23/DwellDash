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
        // Dark theme colors (existing gray palette)
        primary: {
          50: '#f5f5f5',
          100: '#eeeeee',
          200: '#d1d0d0',
          300: '#b8b8b8',
          400: '#988686',
          500: '#7a6e6e',
          600: '#5c4e4e',
          700: '#4a3e3e',
          800: '#3a2f2f',
          900: '#2a2020',
          950: '#000000',
        },
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#d1d0d0',
          300: '#b8b8b8',
          400: '#988686',
          500: '#7a6e6e',
          600: '#5c4e4e',
          700: '#4a3e3e',
          800: '#3a2f2f',
          900: '#2a2020',
        },
        accent: {
          light: '#d1d0d0',
          medium: '#988686',
          dark: '#5c4e4e',
          black: '#000000'
        },
        // Light theme colors (aqua/mint palette)
        light: {
          primary: '#B3EBF2',    // Light aqua
          secondary: '#85D1DB',   // Medium aqua
          accent: '#B6F2D1',     // Light mint
          highlight: '#C9FDF2',   // Very light mint
          text: '#1a1a1a',       // Dark text for light mode
          surface: '#ffffff',     // White surfaces
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