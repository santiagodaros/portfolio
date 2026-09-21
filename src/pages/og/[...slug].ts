import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const entries = await getCollection('blog', (e) => !e.data.draft);
const pages = Object.fromEntries(entries.map((entry) => [entry.slug, entry.data]));

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'slug',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[11, 11, 13]],
    border: { color: [185, 166, 251], width: 20, side: 'inline-start' },
    padding: 72,
    font: {
      title: {
        families: ['Newsreader'],
        weight: 'SemiBold',
        color: [242, 240, 236],
        size: 64,
        lineHeight: 1.25,
      },
      description: {
        families: ['JetBrains Mono'],
        weight: 'Normal',
        color: [157, 155, 163],
        size: 32,
        lineHeight: 1.5,
      },
    },
    fonts: [
      './node_modules/@fontsource/newsreader/files/newsreader-latin-600-normal.woff2',
      './node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',
    ],
  }),
});
