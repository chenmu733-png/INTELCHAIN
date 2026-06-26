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
          950: '#02030a',
          900: '#05070a',
          850: '#08091f',
          800: '#0a0d12',
          700: '#11151c',
          600: '#181d26',
          500: '#222934'
        },
        neon: {
          DEFAULT: '#00f7a6',
          bright: '#22e584',
          soft: '#16c474',
          glow: 'rgba(0,247,166,0.35)',
          dark: '#00cc88'
        },
        crypto: {
          btc: '#f7931a',
          eth: '#627eea',
          sol: '#9945ff',
          bnb: '#f3ba2f',
          xrp: '#23292f',
          ada: '#0033ad',
          doge: '#ba9f33',
          polygon: '#8247e5'
        },
        accent: {
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
          cyan: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,247,166,0.25)',
        'glow-lg': '0 0 40px rgba(0,247,166,0.35)',
        'glow-sm': '0 0 12px rgba(0,247,166,0.15)',
        card: '0 4px 12px rgba(0,0,0,0.25)',
        'card-hover': '0 12px 24px rgba(0,247,166,0.1)'
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(0,247,166,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(0,247,166,0.4)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'slide-in': {
          'from': { opacity: '0', transform: 'translateX(-10px)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: []
};
