import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
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
        background: '#05070B',
        surface: 'rgba(10, 15, 26, 0.65)',
        primary: '#FFFFFF',
        accent: '#C5A880',
        neutral: 'rgba(175, 190, 215, 0.65)',
        'alert-green': 'rgba(175, 190, 215, 0.4)',
        'alert-yellow': 'rgba(175, 190, 215, 0.65)',
        'alert-orange': '#C5A880',
        'alert-red': '#C5A880',
        text: '#FFFFFF',
        'text-muted': 'rgba(175, 190, 215, 0.65)',
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