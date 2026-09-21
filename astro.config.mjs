import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://portfolio-santiagodaros.vercel.app',
  integrations: [tailwind(), mdx(), sitemap()],
});
