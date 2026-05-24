import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#f0f4f8',
        surface: 'rgba(255,255,255,0.6)',
        surfaceDark: 'rgba(200,215,230,0.4)',
        border: 'rgba(255,255,255,0.8)',
        primary: '#0066cc',
        secondary: '#00a8e8',
        'alert-green': '#00c896',
        'alert-yellow': '#f5a623',
        'alert-orange': '#ff6b35',
        'alert-red': '#e8334a',
        text: '#1a2332',
        'text-muted': '#5a7a99',
      },
      borderRadius: {
        glass: '1.25rem',
        btn: '0.5rem',
        chip: '9999px',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config