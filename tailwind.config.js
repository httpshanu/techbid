/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070f',
          surface: '#0d1326',
          border: '#1f2b48',
          accent: '#00f0ff',
          gold: '#ffd700',
          crimson: '#ff0055',
          emerald: '#00ff9d',
          purple: '#b026ff',
        },
      },
      fontFamily: {
        cyber: ['Rajdhani', 'Outfit', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'holo-shimmer': 'holoShimmer 3s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: 0.9, filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: 0.4, filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.2))' },
        },
        holoShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
