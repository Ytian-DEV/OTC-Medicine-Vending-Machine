/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        kiosk: {
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          selected: '#F0FDFA',
          border: '#E2E8F0',
          teal: '#0D9488',
          rose: '#F43F5E',
          sky: '#0284C7',
          amber: '#D97706',
          emerald: '#10B981',
          danger: '#EF4444',
        },
      },
      keyframes: {
        'bounce-bin': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.75' },
          '70%': { transform: 'scale(1.18)', opacity: '0' },
          '100%': { transform: 'scale(1.18)', opacity: '0' },
        },
        'cash-bob': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(-2deg)' },
        },
      },
      animation: {
        'bounce-bin': 'bounce-bin 1.1s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite',
        'cash-bob': 'cash-bob 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
