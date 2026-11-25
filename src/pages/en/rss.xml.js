import rss from '@astrojs/rss';
import { getPublishedArticles } from '@/lib/blog';
import { fechaDeSalida } from '@/lib/publicacion';

export async function GET(context) {
  const articles = await getPublishedArticles('en');
  return rss({
    title: 'Santiago Da Ros — Blog',
    description: 'Technical notes on Cloud infrastructure, governance, automation and FinOps.',
    site: context.site,
    items: articles.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: fechaDeSalida(entry.data),
      link: `/en/articulos/${entry.slug}/`,
      categories: entry.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
