import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { estaPublicado } from '../../lib/publicacion';

const entries = await getCollection('blog', (e) => estaPublicado(e.data));
const pages = Object.fromEntries(entries.map((entry) => [entry.slug, entry.data]));

// Mismo lenguaje visual que public/og.png: fondo claro, Geist, cobalto y el logo.
export const { getStaticPaths, GET } = OGImageRoute({
  param: 'slug',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[238, 240, 243]],
    border: { color: [31, 45, 230], width: 16, side: 'inline-start' },
    padding: 72,
    logo: { path: './src/assets/og-logo.png', size: [108, 72] },
    font: {
      title: {
        families: ['Geist'],
        weight: 'Medium',
        color: [11, 12, 14],
        size: 60,
        lineHeight: 1.15,
      },
      description: {
        families: ['Geist'],
        weight: 'Normal',
        color: [93, 100, 112],
        size: 30,
        lineHeight: 1.45,
      },
    },
    fonts: ['./node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'],
  }),
});
