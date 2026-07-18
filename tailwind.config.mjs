// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: '#f5f5f7',
        'text-primary': '#1a1a1a',
        'text-secondary': '#6b6b6b',
        accent: '#b8860b',
        'accent-light': '#c9a84c',
        'nav-active': '#fdf8ed',
        border: '#e5e5e5',
        cream: '#fdf8ed',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        content: '960px',
      },
    },
  },
  plugins: [],
};
