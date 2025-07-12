/** @type {import('tailwindcss').Config} */
const { DesignSystem } = require('./constants/DesignSystem');

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
        // Premium Design System Colors
        primary: DesignSystem.colors.primary,
        destructive: DesignSystem.colors.destructive,
        'bg-primary': DesignSystem.colors.background.primary,
        'bg-secondary': DesignSystem.colors.background.secondary,
        'bg-tertiary': DesignSystem.colors.background.tertiary,
        'text-primary': DesignSystem.colors.text.primary,
        'text-secondary': DesignSystem.colors.text.secondary,
        'text-tertiary': DesignSystem.colors.text.tertiary,
        'text-inverse': DesignSystem.colors.text.inverse,
        success: DesignSystem.colors.status.success,
        warning: DesignSystem.colors.status.warning,
        info: DesignSystem.colors.status.info,
        error: DesignSystem.colors.status.error,
        'border-light': DesignSystem.colors.border.light,
        'border-medium': DesignSystem.colors.border.medium,
        'border-dark': DesignSystem.colors.border.dark,
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'inter-regular': ['Inter-Regular', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'inter-semibold': ['Inter-SemiBold', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'inter-bold': ['Inter-Bold', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xs': [`${DesignSystem.typography.sizes.xs}px`, { lineHeight: `${DesignSystem.typography.sizes.xs * DesignSystem.typography.lineHeights.normal}px` }],
        'sm': [`${DesignSystem.typography.sizes.sm}px`, { lineHeight: `${DesignSystem.typography.sizes.sm * DesignSystem.typography.lineHeights.normal}px` }],
        'base': [`${DesignSystem.typography.sizes.base}px`, { lineHeight: `${DesignSystem.typography.sizes.base * DesignSystem.typography.lineHeights.relaxed}px` }],
        'lg': [`${DesignSystem.typography.sizes.lg}px`, { lineHeight: `${DesignSystem.typography.sizes.lg * DesignSystem.typography.lineHeights.normal}px` }],
        'xl': [`${DesignSystem.typography.sizes.xl}px`, { lineHeight: `${DesignSystem.typography.sizes.xl * DesignSystem.typography.lineHeights.normal}px` }],
        '2xl': [`${DesignSystem.typography.sizes['2xl']}px`, { lineHeight: `${DesignSystem.typography.sizes['2xl'] * DesignSystem.typography.lineHeights.tight}px` }],
        '3xl': [`${DesignSystem.typography.sizes['3xl']}px`, { lineHeight: `${DesignSystem.typography.sizes['3xl'] * DesignSystem.typography.lineHeights.tight}px` }],
        '4xl': [`${DesignSystem.typography.sizes['4xl']}px`, { lineHeight: `${DesignSystem.typography.sizes['4xl'] * DesignSystem.typography.lineHeights.tight}px` }],
      },
      spacing: {
        'xs': `${DesignSystem.spacing.xs}px`,
        'sm': `${DesignSystem.spacing.sm}px`,
        'md': `${DesignSystem.spacing.md}px`,
        'lg': `${DesignSystem.spacing.lg}px`,
        'xl': `${DesignSystem.spacing.xl}px`,
        '2xl': `${DesignSystem.spacing['2xl']}px`,
        '3xl': `${DesignSystem.spacing['3xl']}px`,
        '4xl': `${DesignSystem.spacing['4xl']}px`,
        '5xl': `${DesignSystem.spacing['5xl']}px`,
        '6xl': `${DesignSystem.spacing['6xl']}px`,
      },
      borderRadius: {
        'sm': `${DesignSystem.components.borderRadius.sm}px`,
        'md': `${DesignSystem.components.borderRadius.md}px`,
        'lg': `${DesignSystem.components.borderRadius.lg}px`,
        'xl': `${DesignSystem.components.borderRadius.xl}px`,
        '2xl': `${DesignSystem.components.borderRadius['2xl']}px`,
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