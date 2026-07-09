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
        background: '#0B0D0F',
        surface: 'rgba(18,20,24,0.72)',
        surfaceDark: 'rgba(10,12,14,0.88)',
        border: 'rgba(242,240,234,0.10)',
        primary: '#C9A227',
        secondary: '#B8A58A',
        'alert-green': '#86B48C',
        'alert-yellow': '#C9A227',
        'alert-orange': '#B77A43',
        'alert-red': '#A85F4A',
        text: '#F2F0EA',
        'text-muted': '#B8B1A5',
      },
      fontFamily: {
        display: ['var(--font-serif)', 'Georgia', 'serif'],
        body: ['var(--font-sans)', 'Rethink Sans', 'system-ui', 'sans-serif'],
        label: ['var(--font-sans)', 'Rethink Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        'Mono-Stat': ['var(--font-mono-stat)', 'Space Grotesk', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        glass: '1.25rem',
        btn: '0.5rem',
        chip: '9999px',
      },
      scale: {
        101: '1.01',
      },
      transitionTimingFunction: {
        'ease-emil': 'cubic-bezier(0.16, 1, 0.3, 1)',
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
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