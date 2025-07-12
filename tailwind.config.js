/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Actions
        primary: {
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#409CFF',
          500: '#0A84FF',
          600: '#0066CC',
          700: '#004C99',
          800: '#003366',
          900: '#001A33',
        },
        
        // Destructive/Urgent
        destructive: {
          50: '#FFE6E6',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF4D4D',
          500: '#FF453A',
          600: '#CC3629',
          700: '#99281F',
          800: '#661A14',
          900: '#330D0A',
        },
        
        // Background colors
        'bg-primary': '#F2F2F7',
        'bg-secondary': '#FFFFFF',
        'bg-tertiary': '#F8F9FA',
        
        // Text colors
        'text-primary': '#1C1C1E',
        'text-secondary': '#8A8A8E',
        'text-tertiary': '#AEAEB2',
        'text-inverse': '#FFFFFF',
        
        // Status colors
        success: '#30D158',
        warning: '#FF9F0A',
        info: '#FFD60A',
        error: '#FF453A',
        
        // Border colors
        'border-light': '#E5E5EA',
        'border-medium': '#D1D1D6',
        'border-dark': '#8E8E93',
      },
      
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'inter-regular': ['Inter-Regular', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'inter-semibold': ['Inter-SemiBold', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'inter-bold': ['Inter-Bold', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['12px', { lineHeight: '16.8px' }],
        'sm': ['14px', { lineHeight: '19.6px' }],
        'base': ['16px', { lineHeight: '25.6px' }],
        'lg': ['18px', { lineHeight: '25.2px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '28.8px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '43.2px' }],
      },
      
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '64px',
      },
      
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      
      boxShadow: {
        'premium-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'premium-md': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'premium-lg': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        'premium-xl': '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
      },
      
      backdropBlur: {
        'glass': '20px',
      },
      
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}