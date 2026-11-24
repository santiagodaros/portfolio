import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Páginas que existen en los dos idiomas con rutas distintas: [es, en].
// Alimentan los <xhtml:link hreflang> del sitemap (las páginas ya declaran sus hreflang en el <head>).
// Si se agrega una traducción de un artículo, sumar su par acá.
const translated = [
  ['/', '/en/'],
  ['/comunidad/', '/en/community/'],
  ['/charlas/dr-no-probado/', '/en/talks/dr-no-probado/'],
  ['/charlas/sre-microsoft-fabric/', '/en/talks/sre-microsoft-fabric/'],
  ['/charlas/punta-del-iceberg/', '/en/talks/punta-del-iceberg/'],
  ['/comunidad/charlas/', '/en/community/talks/'],
  ['/comunidad/articulos/', '/en/community/articles/'],
  ['/comunidad/posts/', '/en/community/posts/'],
  ['/comunidad/codigo/', '/en/community/code/'],
  ['/comunidad/foros/', '/en/community/forums/'],
  ['/comunidad/newsletter/', '/en/community/newsletter/'],
  ['/ahora/', '/en/now/'],
  ['/estado/', '/en/status/'],
  ['/speaker/', '/en/speaker/'],
  ['/recursos/kql/', '/en/resources/kql/'],
  ['/articulos/backup-no-es-continuidad-rpo-rto/', '/en/articulos/backup-is-not-continuity-the-rpo-rto-gap/'],
];

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://portfolio-santiagodaros.vercel.app',
  // El índice del blog ahora es la pestaña Artículos del hub de comunidad. En Vercel manda el 301 de vercel.json.
  redirects: {
    '/articulos': '/comunidad/articulos/',
    '/en/articulos': '/en/community/articles/',
  },
  integrations: [
    mdx(),
    sitemap({
      // Las páginas de gracias del newsletter son noindex
      filter: (page) => !/\/(gracias|en\/thanks)\/?$/.test(page),
      serialize(item) {
        const { origin, pathname } = new URL(item.url);
        const pair = translated.find(([es, en]) => pathname === es || pathname === en);
        if (pair) {
          item.links = [
            { url: origin + pair[0], lang: 'es' },
            { url: origin + pair[1], lang: 'en' },
          ];
        }
        return item;
      },
    }),
  ],
});
