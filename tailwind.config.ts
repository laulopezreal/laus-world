import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        accentSoft: 'var(--color-accent-soft)',
        border: 'var(--color-border)'
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      transitionTimingFunction: {
        smooth: 'var(--ease-smooth)'
      },
      transitionDuration: {
        450: '450ms'
      }
    }
  },
  plugins: []
} satisfies Config;
