/** @type {import('tailwindcss').Config} */
export default {
    content: ["index.html", "./src/**/*.jsx"],
    theme: {
      extend: {
      colors: {
        'movilsource': {
          DEFAULT: '#FF6B00',
          50: '#FFE5D6',
          100: '#FFD8C2',
          200: '#FFBD99',
          300: '#FFA270',
          400: '#FF8847',
          500: '#FF6B00', // Color principal
          600: '#D65900',
          700: '#AD4700',
          800: '#853500',
          900: '#5C2400',
        }
      }
    }
    },
    plugins: [],
  };