/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        brand: {
          50: '#F6F6F6',
          100: '#E8F8F4',
          200: '#C7FFD8',
          300: '#A8EFEA',
          400: '#98DED9',
          500: '#6BCBCC',
          600: '#45A7AC',
          700: '#297486',
          800: '#161D6F',
          900: '#0E134F',
          950: '#080A2E',
        },
        gray: {
          50: '#F5F6F9',
          100: '#EAEDF4',
          200: '#D1D8E6',
          300: '#AEBBD1',
          400: '#8A9DBA',
          500: '#697E9E',
          600: '#506282',
          700: '#3D4B66',
          800: '#2B354C',
          900: '#1A2133',
        },
      },
    },
  },
  plugins: [],
}
