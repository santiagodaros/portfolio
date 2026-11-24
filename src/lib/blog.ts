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

export async function getTranslation(entry: BlogEntry): Promise<BlogEntry | undefined> {
  if (!entry.data.translationKey) return undefined;
  const otherLang = entry.data.lang === 'es' ? 'en' : 'es';
  const candidates = await getPublishedArticles(otherLang);
  return candidates.find((a) => a.data.translationKey === entry.data.translationKey);
}

/** Ruta del artículo en su idioma. */
export function articleHref(entry: BlogEntry): string {
  return entry.data.lang === 'es' ? `/articulos/${entry.slug}` : `/en/articulos/${entry.slug}`;
}

export type IndexItem = {
  kind: 'article' | 'post';
  title: string;
  summary: string;
  date: Date;
  tag: string;
  href: string;
  external: boolean;
  /** El título está en español aunque el sitio esté en inglés. */
  inSpanish: boolean;
  minutes?: number;
  /** Solo en posts de LinkedIn: la versión extendida en el sitio (link secundario). */
  extended?: { href: string };
};

/**
 * Entradas del índice del blog: artículos del sitio + posts de LinkedIn.
 * - El artículo y su post de LinkedIn son dos entradas, cada una con su fecha. El post con `articleSlug`
 *   suma un link secundario a la versión extendida.
 * - En inglés también se listan los artículos que solo existen en español (sin traducción).
 * - Los artículos van primero (más nuevos arriba) y después todo lo demás por fecha.
 */
export async function getBlogIndex(lang: 'es' | 'en'): Promise<IndexItem[]> {
  const [own, es, posts] = await Promise.all([
    getPublishedArticles(lang),
    getPublishedArticles('es'),
    getCollection('linkedin'),
  ]);
  const spanishOnly =
    lang === 'en'
      ? es.filter((a) => !own.some((o) => o.data.translationKey && o.data.translationKey === a.data.translationKey))
      : [];
  const articles = [...own, ...spanishOnly];

  const articleItems: IndexItem[] = articles
    .map((a) => ({
      kind: 'article',
      title: a.data.title,
      summary: a.data.description,
      date: a.data.date,
      tag: a.data.category,
      href: articleHref(a),
      external: false,
      inSpanish: a.data.lang !== lang,
      minutes: getReadingTime(a.body),
    }));

  const postItems: IndexItem[] = await Promise.all(
    posts.map(async (p) => {
      let extended: IndexItem['extended'];
      if (p.data.articleSlug) {
        const spanish = es.find((e) => e.slug === p.data.articleSlug);
        const target = (lang === 'en' && spanish ? await getTranslation(spanish) : undefined) ?? spanish;
        if (target) extended = { href: articleHref(target) };
      }
      return {
        kind: 'post' as const,
        title: p.data.title,
        summary: p.data.summary,
        date: p.data.date,
        tag: p.data.tag,
        href: p.data.url,
        external: true,
        inSpanish: lang === 'en',
        extended,
      };
    })
  );

  const byDateDesc = (a: IndexItem, b: IndexItem) => b.date.valueOf() - a.date.valueOf();
  return [...articleItems.sort(byDateDesc), ...postItems.sort(byDateDesc)];
}

/** Siguiente artículo del sitio (cíclico). Sin siguiente si hay uno solo. */
export async function getNextArticle(entry: BlogEntry): Promise<BlogEntry | undefined> {
  const articles = await getPublishedArticles(entry.data.lang);
  if (articles.length < 2) return undefined;
  const i = articles.findIndex((a) => a.slug === entry.slug);
  return articles[(i + 1) % articles.length];
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
