/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      zIndex: {
        '100': '100',
        '101': '101',
        '999': '999',
      },
      minHeight: {
        '20': '5rem',
      },
      maxHeight: {
        '150': '37.5rem',
      },
      height: {
        '125': '31.25rem',
      },
      minWidth: {
        '22.5': '5.625rem',
      }
    },
  },
  plugins: [],
};