/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          light: '#fdfaf4',
          dark: '#252220',
        },
        accent: {
          DEFAULT: '#c4713a',
          soft: '#f0dbc8',
          dark: '#d4836a',
        },
        bg: {
          light: '#f5f0e8',
          dark: '#1a1814',
        },
      },
      animation: {
        'page-turn-next': 'pageTurnNext 0.4s ease',
        'page-turn-prev': 'pageTurnPrev 0.4s ease',
        'fade-in': 'fadeIn 0.5s ease',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        pageTurnNext: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'rotateY(-90deg)', opacity: '0.3' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        pageTurnPrev: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'rotateY(90deg)', opacity: '0.3' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
