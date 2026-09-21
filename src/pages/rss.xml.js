import rss from '@astrojs/rss';
import { getPublishedArticles } from '@/lib/blog';

export async function GET(context) {
  const articles = await getPublishedArticles('es');
  return rss({
    title: 'Santiago Da Ros — Blog',
    description: 'Notas técnicas sobre infraestructura Cloud, governance, automatización y FinOps.',
    site: context.site,
    items: articles.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/articulos/${entry.slug}/`,
      categories: entry.data.tags,
    })),
    customData: '<language>es</language>',
  });
}
