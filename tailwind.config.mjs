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
        // LEGACY (diseño anterior): serif ahora es Geist. Se borra en la fase 4.
        serif: ['var(--display)'],
      },
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        tonal: 'var(--tonal)',
        ok: 'var(--ok)',
        surface: {
          DEFAULT: 'var(--surface)',
          // LEGACY: 1–4 del diseño anterior, mapeadas a los tokens nuevos.
          1: 'var(--bg)',
          2: 'var(--card)',
          3: 'var(--surface)',
          4: 'var(--surface)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          hover: 'var(--accent-hover)',
          // LEGACY
          dim: 'rgb(var(--accent-rgb) / <alpha-value>)',
          soft: 'var(--tonal)',
        },
        // LEGACY (se borran en la fase 4)
        tgreen: 'var(--ok)',
        border: {
          DEFAULT: 'var(--line)',
          hover: 'var(--line)',
        },
        text: {
          primary: 'var(--ink)',
          secondary: 'var(--muted)',
          muted: 'var(--muted)',
        },
      },
    },
  },
  plugins: [],
};
