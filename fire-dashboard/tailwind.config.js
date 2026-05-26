/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: '#0a0e17',
        card: '#111827',
        'card-border': '#1e293b',
        ink: '#f1f5f9',
        muted: '#94a3b8',
        emerald: { brand: '#10b981' },
        amber: { brand: '#f59e0b' },
        blue: { brand: '#3b82f6' },
      },
      boxShadow: {
        glow: '0 8px 32px rgba(16,185,129,0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
