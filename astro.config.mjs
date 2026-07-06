import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://portfolio-santiagodaros.vercel.app',
  integrations: [tailwind()],
});
