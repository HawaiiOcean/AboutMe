// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: '#f8f9fb',
        'text-primary': '#1a1a1a',
        'text-secondary': '#5f6368',
        accent: '#9b7a2e',
        'accent-light': '#b8943a',
        'accent-subtle': '#ede4d3',
        'nav-active': '#fdf8ed',
        border: '#e8eaed',
        cream: '#fdf8ed',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'Noto Serif SC', 'serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        content: '960px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-scale': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.8)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-up': 'fade-up 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-scale': 'fade-scale 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'pulse-dot': 'pulse-dot 1.2s ease-out 1',
      },
    },
  },
  plugins: [],
};
