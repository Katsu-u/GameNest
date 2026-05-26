import tailwindPlugin from 'tailwindcss/plugin'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#08111f',
          surface: 'rgba(16, 30, 52, 0.82)',
          'surface-strong': '#12223a',
        },
        text: {
          primary: '#f3f7fb',
          muted: '#9dafc6',
        },
        accent: {
          DEFAULT: '#58f0a7',
          warm: '#ffb454',
        },
        border: 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        sans: ['Trebuchet MS', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        'dark': '0 24px 80px rgba(0, 0, 0, 0.32)',
      },
      backgroundImage: {
        'gradient-dark': `
          radial-gradient(circle at 15% 10%, rgba(88, 240, 167, 0.22), transparent 28rem),
          radial-gradient(circle at 85% 0%, rgba(255, 180, 84, 0.18), transparent 26rem),
          linear-gradient(135deg, #08111f 0%, #0c1728 55%, #101d2f 100%)
        `,
      },
    },
  },
  plugins: [
    tailwindPlugin(function({ addUtilities }) {
      addUtilities({
        '.glass': {
          '@apply bg-opacity-10 backdrop-blur-sm': {},
        },
      })
    }),
  ],
}
