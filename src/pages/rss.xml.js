import rss from '@astrojs/rss';
import { getPublishedArticles } from '@/lib/blog';
import { fechaDeSalida } from '@/lib/publicacion';

export async function GET(context) {
  const articles = await getPublishedArticles('es');
  return rss({
    title: 'Santiago Da Ros — Blog',
    description: 'Notas técnicas sobre infraestructura Cloud, governance, automatización y FinOps.',
    site: context.site,
    items: articles.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: fechaDeSalida(entry.data),
      link: `/articulos/${entry.slug}/`,
      categories: entry.data.tags,
    })),
    customData: '<language>es</language>',
  });
}
