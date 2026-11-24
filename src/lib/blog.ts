import { getCollection, type CollectionEntry } from 'astro:content';
import { estaPublicado, esProximo } from './publicacion';

export type BlogEntry = CollectionEntry<'blog'>;

const WORDS_PER_MINUTE = 200;

/** Artículos publicados (los programados para más adelante todavía no existen). En desarrollo también se ven los borradores. */
export async function getPublishedArticles(lang: 'es' | 'en'): Promise<BlogEntry[]> {
  const entries = await getCollection(
    'blog',
    (entry) => entry.data.lang === lang && (estaPublicado(entry.data) || (import.meta.env.DEV && !entry.data.publishAt))
  );
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Artículos programados para más adelante, el más próximo primero. Solo en español: todavía no tienen versión en inglés. */
export async function getUpcomingArticles(): Promise<BlogEntry[]> {
  const entries = await getCollection('blog', (entry) => entry.data.lang === 'es' && esProximo(entry.data));
  return entries.sort((a, b) => a.data.publishAt!.valueOf() - b.data.publishAt!.valueOf());
}

/** Posts de LinkedIn ya publicados y con link. */
export async function getPublishedPosts() {
  return getCollection('linkedin', (p) => estaPublicado(p.data) && !!p.data.url);
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
    getPublishedPosts(),
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
        href: p.data.url!,
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

// El tiempo de lectura se estima sobre la fuente MDX (entry.body): se sacan imports, etiquetas JSX/HTML,
// URLs de los links y símbolos de markdown, y se redondea hacia arriba (nunca promete menos de lo que lleva).
export function getReadingTime(body: string): number {
  const text = body
    .replace(/^(import|export) .*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\(https?:\/\/[^)]+\)/g, ' ')
    .replace(/[#>*`|_~-]+/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export type SeriesInfo = { name: string; description: string; parts: BlogEntry[] };

/** La serie de un artículo (colección series) y sus artículos publicados, del primero al último. */
export async function getSeriesInfo(entry: BlogEntry): Promise<SeriesInfo | undefined> {
  if (!entry.data.series) return undefined;
  const series = (await getCollection('series')).find((s) => s.id === entry.data.series);
  if (!series) return undefined;
  const parts = (await getPublishedArticles(entry.data.lang))
    .filter((a) => a.data.series === entry.data.series)
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  return { name: series.data.name, description: series.data.description, parts };
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
