/** @type {import('tailwindcss').Config} */
// Tailwind tokens are mapped onto the "Teranga" palette (see src/styles/teranga-base.css)
// so any utility-class color used in a page harmonizes with the design system.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — terracotta
        orange: {
          50: '#FBE7DA',   // terra-tint
          100: '#F3D9C6',  // terra-soft
          200: '#E9C2A6',
          300: '#DD9B72',
          400: '#CE6E3E',
          500: '#C0451A',  // terra
          600: '#9B340F',  // terra-deep
          700: '#86290B',
          800: '#6B2209',
          900: '#561C09',
        },
        brand: { DEFAULT: '#C0451A', 50: '#FBE7DA', 100: '#F3D9C6', 500: '#C0451A', 600: '#9B340F', 700: '#86290B' },
        // Warm neutrals — sand surfaces / espresso ink
        gray: {
          50: '#FBF5E9',   // cream
          100: '#F6EEDD',  // cream-2
          200: '#E8DABC',  // hairline-2
          300: '#DCC9A6',  // hairline
          400: '#927F66',  // ink-3
          500: '#927F66',  // ink-3
          600: '#5C4A36',  // ink-2
          700: '#5C4A36',  // ink-2
          800: '#241405',  // ink
          900: '#241405',  // ink
        },
        // Semantic — mapped to Teranga accents
        success: { 50: '#E4F0E7', 100: '#CFE3D6', 500: '#1F5D44', 600: '#1A4F3A', 700: '#163F2F' },
        warning: { 50: '#FBEFD2', 100: '#F6E2BC', 500: '#D38A1E', 600: '#A9690E', 700: '#8A560B' },
        danger:  { 50: '#F8E2DD', 100: '#F1D2CC', 500: '#A02118', 600: '#7d180f', 700: '#651209' },
        info:    { 50: '#E6E9F4', 100: '#D4DAEC', 500: '#3B4E8C', 600: '#324277', 700: '#293560' },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Bricolage Grotesque', 'Hanken Grotesk', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(60,32,8,.06), 0 1px 3px rgba(60,32,8,.08)',
        card: '0 1px 0 rgba(255,255,255,.6) inset, 0 8px 22px -10px rgba(60,32,8,.38), 0 2px 6px -2px rgba(60,32,8,.18)',
        'card-hover': '0 18px 40px -14px rgba(60,32,8,.46), 0 4px 12px -4px rgba(60,32,8,.22)',
        lift: '0 18px 40px -14px rgba(60,32,8,.46)',
        brand: '0 10px 22px -8px rgba(192,69,26,.55)',
        'brand-sm': '0 6px 14px -6px rgba(192,69,26,.5)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
        'zoom-in': 'zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { 'from': { opacity: '0' }, 'to': { opacity: '1' } },
        slideUp: { 'from': { transform: 'translateY(12px)', opacity: '0' }, 'to': { transform: 'translateY(0)', opacity: '1' } },
        slideInFromBottom: { 'from': { transform: 'translateY(10px)', opacity: '0' }, 'to': { transform: 'translateY(0)', opacity: '1' } },
        zoomIn: { 'from': { transform: 'scale(0.96)', opacity: '0' }, 'to': { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
