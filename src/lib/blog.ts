import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

const WORDS_PER_MINUTE = 200;

export async function getPublishedArticles(lang: 'es' | 'en'): Promise<BlogEntry[]> {
  const entries = await getCollection(
    'blog',
    (entry) => entry.data.lang === lang && (!entry.data.draft || import.meta.env.DEV)
  );
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getFeaturedArticle(lang: 'es' | 'en'): Promise<BlogEntry | undefined> {
  const articles = await getPublishedArticles(lang);
  return articles.find((a) => a.data.featured) ?? articles[0];
}

export async function getRelatedArticles(entry: BlogEntry, limit = 3): Promise<BlogEntry[]> {
  const articles = await getPublishedArticles(entry.data.lang);
  const scored = articles
    .filter((a) => a.slug !== entry.slug)
    .map((a) => {
      const sharedTags = a.data.tags.filter((t) => entry.data.tags.includes(t)).length;
      const sameCategory = a.data.category === entry.data.category ? 1 : 0;
      return { entry: a, score: sharedTags * 2 + sameCategory };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

export async function getTranslation(entry: BlogEntry): Promise<BlogEntry | undefined> {
  if (!entry.data.translationKey) return undefined;
  const otherLang = entry.data.lang === 'es' ? 'en' : 'es';
  const candidates = await getPublishedArticles(otherLang);
  return candidates.find((a) => a.data.translationKey === entry.data.translationKey);
}

export async function getSeriesWithCount(lang: 'es' | 'en') {
  const [seriesEntries, articles] = await Promise.all([
    getCollection('series', (e) => e.data.lang === lang),
    getPublishedArticles(lang),
  ]);
  return seriesEntries.map((s) => ({
    slug: s.id,
    data: s.data,
    count: articles.filter((a) => a.data.series === s.id).length,
  }));
}

// Reading time is estimated from the raw MDX source (entry.body): close
// enough for a listing/header, doesn't need the fully rendered word count.
export function getReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date: Date, lang: 'es' | 'en'): string {
  // Frontmatter dates parse as UTC midnight; force UTC here too so the
  // displayed day doesn't shift backward in timezones behind UTC.
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
