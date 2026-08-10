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
        text: {
          50: 'var(--text-50)', 100: 'var(--text-100)', 200: 'var(--text-200)', 300: 'var(--text-300)',
          400: 'var(--text-400)', 500: 'var(--text-500)', 600: 'var(--text-600)', 700: 'var(--text-700)',
          800: 'var(--text-800)', 900: 'var(--text-900)', 950: 'var(--text-950)',
        },
        background: {
          50: 'var(--background-50)', 100: 'var(--background-100)', 200: 'var(--background-200)', 300: 'var(--background-300)',
          400: 'var(--background-400)', 500: 'var(--background-500)', 600: 'var(--background-600)', 700: 'var(--background-700)',
          800: 'var(--background-800)', 900: 'var(--background-900)', 950: 'var(--background-950)',
        },
        primary: {
          50: 'var(--primary-50)', 100: 'var(--primary-100)', 200: 'var(--primary-200)', 300: 'var(--primary-300)',
          400: 'var(--primary-400)', 500: 'var(--primary-500)', 600: 'var(--primary-600)', 700: 'var(--primary-700)',
          800: 'var(--primary-800)', 900: 'var(--primary-900)', 950: 'var(--primary-950)',
        },
        secondary: {
          50: 'var(--secondary-50)', 100: 'var(--secondary-100)', 200: 'var(--secondary-200)', 300: 'var(--secondary-300)',
          400: 'var(--secondary-400)', 500: 'var(--secondary-500)', 600: 'var(--secondary-600)', 700: 'var(--secondary-700)',
          800: 'var(--secondary-800)', 900: 'var(--secondary-900)', 950: 'var(--secondary-950)',
        },
        accent: {
          50: 'var(--accent-50)', 100: 'var(--accent-100)', 200: 'var(--accent-200)', 300: 'var(--accent-300)',
          400: 'var(--accent-400)', 500: 'var(--accent-500)', 600: 'var(--accent-600)', 700: 'var(--accent-700)',
          800: 'var(--accent-800)', 900: 'var(--accent-900)', 950: 'var(--accent-950)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        label: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        'Mono-Stat': ['var(--font-mono-stat)', 'ui-monospace', 'monospace'],
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