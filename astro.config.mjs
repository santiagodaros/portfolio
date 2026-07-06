import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://portfolio-green-nine-94.vercel.app',
  integrations: [tailwind()],
});
