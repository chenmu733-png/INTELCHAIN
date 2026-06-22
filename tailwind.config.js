/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#05070a',
          800: '#0a0d12',
          700: '#11151c',
          600: '#181d26',
          500: '#222934'
        },
        neon: {
          DEFAULT: '#22e584',
          soft: '#16c474',
          glow: 'rgba(34,229,132,0.35)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px rgba(34,229,132,0.25)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
