/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#002391',  // Màu chủ đạo
          600: '#001f7a',
          700: '#001b63',
          800: '#00174c',
          900: '#001335'
        },
        blue: {
          500: '#002391',
          600: '#001f7a',
          700: '#001b63',
          800: '#00174c'
        }
      }
    },
  },
  plugins: [],
}