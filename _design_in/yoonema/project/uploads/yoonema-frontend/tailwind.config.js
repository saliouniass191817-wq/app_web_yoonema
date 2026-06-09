/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Yoonema orange (identité conservée, ramp complète)
        orange: {
          50: '#FFF4ED',
          100: '#FFE6D5',
          200: '#FFC9AA',
          300: '#FFA474',
          400: '#FF7E45',
          500: '#FF6B35',
          600: '#F1500F',
          700: '#C83C0B',
          800: '#9E3210',
          900: '#7F2C11',
        },
        brand: {
          DEFAULT: '#FF6B35',
          50: '#FFF4ED',
          100: '#FFE6D5',
          500: '#FF6B35',
          600: '#F1500F',
          700: '#C83C0B',
        },
        // Neutres légèrement froids (surfaces, panneaux, texte)
        gray: {
          50: '#F7F8FA',
          100: '#EEF1F5',
          200: '#E2E6EC',
          300: '#CBD2DC',
          400: '#9AA4B2',
          500: '#6B7585',
          600: '#505968',
          700: '#3A4250',
          800: '#262C38',
          900: '#1A1A2E',
        },
        success: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#039855', 700: '#027A48' },
        warning: { 50: '#FFFAEB', 100: '#FEF0C7', 500: '#F79009', 600: '#DC6803', 700: '#B54708' },
        danger:  { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04438', 600: '#D92D20', 700: '#B42318' },
        info:    { 50: '#EFF8FF', 100: '#D1E9FF', 500: '#2E90FA', 600: '#1570EF', 700: '#175CD3' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
        card: '0 1px 3px rgba(16, 24, 40, 0.06), 0 4px 12px rgba(16, 24, 40, 0.05)',
        'card-hover': '0 8px 24px rgba(16, 24, 40, 0.10), 0 2px 6px rgba(16, 24, 40, 0.06)',
        lift: '0 12px 32px rgba(16, 24, 40, 0.14)',
        brand: '0 6px 18px rgba(255, 107, 53, 0.30)',
        'brand-sm': '0 2px 8px rgba(255, 107, 53, 0.25)',
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
        'shimmer': 'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn: { 'from': { opacity: '0' }, 'to': { opacity: '1' } },
        slideUp: {
          'from': { transform: 'translateY(12px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          'from': { transform: 'translateY(10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          'from': { transform: 'scale(0.96)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
