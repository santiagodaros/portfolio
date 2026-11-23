/** @type {import('tailwindcss').Config} */
// Los tokens viven como variables CSS en src/styles/global.css (claro y [data-theme="dark"]).
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--text)'],
        display: ['var(--display)'],
        mono: ['var(--mono)'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        tonal: 'var(--tonal)',
        ok: 'var(--ok)',
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          hover: 'var(--accent-hover)',
        },
      },
    },
  },
  plugins: [],
};
