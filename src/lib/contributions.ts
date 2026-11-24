// Lista unificada de contribuciones a la comunidad. Es la única fuente del hub /comunidad, los contadores,
// el CSV, la home y /estado. Mezcla, sin duplicar datos:
//  - charlas anteriores (colección `talks`),
//  - artículos (colección `blog`) y posts de LinkedIn (colección `linkedin`),
//  - lo demás (repos, recursos, foros, newsletter, comunidad) de la colección `contributions`.
import { getCollection } from 'astro:content';
import { getPublishedArticles, articleHref, type BlogEntry } from './blog';
import { getPastTalks, getUpcomingTalks, talkHref, type DatePrecision } from './talks';
import type { Area } from './areas';
import type { Lang } from '../i18n';

export type ContributionType = 'talk' | 'article' | 'post' | 'repo' | 'forum' | 'newsletter' | 'community';

export type Contribution = {
  /** Identidad estable, igual en los dos idiomas. */
  key: string;
  type: ContributionType;
  /** talk: charla o webinar, para la etiqueta. */
  format?: 'talk' | 'webinar';
  date: Date;
  datePrecision: DatePrecision;
  title: string;
  /** Destino al hacer click: página del sitio o URL externa. */
  href: string;
  external: boolean;
  /** Prueba pública (URL absoluta) para el CSV: grabación, post, repo, artículo. */
  proof: string;
  area: Area;
  /** Idioma del contenido que se muestra. */
  language: Lang;
  /** El contenido está en español aunque la página esté en inglés. */
  inSpanish: boolean;
  reach?: string;
  event?: string;
  /** Foros: respuestas del mes. */
  count?: number;
  /** Posts con versión extendida en el sitio. */
  extendedHref?: string;
};

const SITE = 'https://portfolio-santiagodaros.vercel.app';
const abs = (u: string) => (u.startsWith('/') ? SITE + u : u);

/** Pestañas del hub → tipos que muestran. */
export const tabTypes = {
  charlas: ['talk'],
  articulos: ['article'],
  posts: ['post'],
  codigo: ['repo'],
  foros: ['forum'],
  newsletter: ['newsletter'],
} as const satisfies Record<string, readonly ContributionType[]>;
export type TabId = keyof typeof tabTypes;

/** Contribuciones tal como se muestran en `lang`: una por contribución, en ese idioma si existe. */
export async function getContributions(lang: Lang): Promise<Contribution[]> {
  const [talksLang, talksEs, articlesLang, articlesEs, posts, manual] = await Promise.all([
    getPastTalks(lang),
    getPastTalks('es'),
    getPublishedArticles(lang),
    getPublishedArticles('es'),
    getCollection('linkedin'),
    getCollection('contributions'),
  ]);
  const out: Contribution[] = [];

  // Charlas anteriores
  for (const es of talksEs) {
    const t = talksLang.find((x) => x.id === es.id) ?? es;
    if (!t.date) continue;
    out.push({
      key: `talk:${t.id}`,
      type: 'talk',
      format: t.format,
      date: t.date,
      datePrecision: t.datePrecision,
      title: t.title,
      href: talkHref(t.id, lang),
      external: false,
      proof: t.recording ?? abs(talkHref(t.id, 'es')),
      area: (t.area ?? es.area) as Area,
      language: t.talkLanguage,
      inSpanish: t.talkLanguage === 'es' && lang === 'en',
      event: t.event,
    });
  }

  // Artículos (en inglés también los que solo existen en español)
  const articleFor = (es: BlogEntry): BlogEntry =>
    lang === 'es' ? es : (articlesLang.find((a) => es.data.translationKey && a.data.translationKey === es.data.translationKey) ?? es);
  for (const es of articlesEs) {
    const a = articleFor(es);
    out.push({
      key: `article:${es.data.translationKey ?? es.slug}`,
      type: 'article',
      date: es.data.date,
      datePrecision: 'day',
      title: a.data.title,
      href: articleHref(a),
      external: false,
      proof: abs(articleHref(es)),
      area: es.data.area,
      language: a.data.lang,
      inSpanish: a.data.lang !== lang,
      reach: es.data.reach,
    });
  }

  // Posts de LinkedIn (siempre en español); si tienen versión extendida, link secundario
  for (const p of posts) {
    const spanish = p.data.articleSlug ? articlesEs.find((e) => e.slug === p.data.articleSlug) : undefined;
    out.push({
      key: `post:${p.id}`,
      type: 'post',
      date: p.data.date,
      datePrecision: 'day',
      title: p.data.title,
      href: p.data.url,
      external: true,
      proof: p.data.url,
      area: p.data.area,
      language: 'es',
      inSpanish: lang === 'en',
      reach: p.data.reach,
      extendedHref: spanish ? articleHref(articleFor(spanish)) : undefined,
    });
  }

  // Lo demás: una entrada por idioma; las que comparten `group` son la misma contribución
  const groups = new Map<string, typeof manual>();
  for (const m of manual) {
    const k = m.data.group ?? m.id;
    groups.set(k, [...(groups.get(k) ?? []), m]);
  }
  for (const [k, entries] of groups) {
    const pick = entries.find((e) => e.data.language === lang) ?? entries[0];
    const canonical = entries.find((e) => e.data.language === 'es') ?? entries[0];
    const d = pick.data;
    out.push({
      key: `${d.type}:${k}`,
      type: d.type,
      date: canonical.data.date,
      datePrecision: canonical.data.datePrecision,
      title: d.title,
      href: d.url,
      external: !d.url.startsWith('/'),
      proof: abs(canonical.data.url),
      area: d.area,
      language: d.language,
      inSpanish: d.language === 'es' && lang === 'en',
      reach: d.reach,
      event: d.event,
      count: d.count,
    });
  }

  return out.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

/** Ventana de "los últimos 12 meses" contada desde el día del build. */
export function windowStart(now = new Date()): Date {
  const d = new Date(now);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d;
}

export function inLastYear(c: Contribution, now = new Date()): boolean {
  const start = windowStart(now);
  // Con solo el año, se cuenta si el año cae dentro de la ventana
  if (c.datePrecision === 'year') return c.date.getUTCFullYear() >= start.getUTCFullYear();
  return c.date >= start && c.date <= now;
}

export type Counters = { talks: number; articles: number; posts: number; repos: number; forumAnswers: number; total: number };

/** Contadores de los últimos 12 meses, calculados desde la colección. */
export function countLastYear(items: Contribution[], now = new Date()): Counters {
  const recent = items.filter((c) => inLastYear(c, now));
  const count = (t: ContributionType) => recent.filter((c) => c.type === t).length;
  return {
    talks: count('talk'),
    articles: count('article'),
    posts: count('post'),
    repos: count('repo'),
    forumAnswers: recent.filter((c) => c.type === 'forum').reduce((n, c) => n + (c.count ?? 1), 0),
    total: recent.length,
  };
}

/** Clave del mes para la línea de tiempo; las fechas con solo el año van aparte ("2026"). */
export function monthKey(c: Contribution): string {
  const y = c.date.getUTCFullYear();
  if (c.datePrecision === 'year') return `${y}-00`;
  return `${y}-${String(c.date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key: string, lang: Lang): string {
  const [y, m] = key.split('-');
  if (m === '00') return y;
  const label = new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(Number(y), Number(m) - 1, 1))
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// ── CSV ──
const csvHeaders = {
  es: ['fecha', 'tipo', 'titulo', 'url', 'area', 'idioma'],
  en: ['date', 'type', 'title', 'url', 'area', 'language'],
} as const;

export const typeLabels = {
  es: { talk: 'Charla', webinar: 'Webinar', article: 'Artículo', post: 'Post', repo: 'Repositorio', forum: 'Foro', newsletter: 'Newsletter', community: 'Recurso' },
  en: { talk: 'Talk', webinar: 'Webinar', article: 'Article', post: 'Post', repo: 'Repository', forum: 'Forum', newsletter: 'Newsletter', community: 'Resource' },
} as const;

export function typeLabel(c: Pick<Contribution, 'type' | 'format'>, lang: Lang): string {
  const l = typeLabels[lang];
  return c.type === 'talk' && c.format === 'webinar' ? l.webinar : l[c.type];
}

function isoDate(c: Contribution): string {
  const iso = c.date.toISOString().slice(0, 10);
  if (c.datePrecision === 'year') return iso.slice(0, 4);
  if (c.datePrecision === 'month') return iso.slice(0, 7);
  return iso;
}

export const csvFileName = { es: 'contribuciones-santiago-da-ros.csv', en: 'contributions-santiago-da-ros.csv' } as const;

const cell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

/** CSV de todas las contribuciones (una fila por contribución, en español como idioma de origen). UTF-8 con BOM para Excel. */
export function buildCsv(items: Contribution[], lang: Lang, areaLabel: (a: Area) => string): string {
  const rows = items.map((c) =>
    [isoDate(c), typeLabel(c, lang), c.title, c.proof, areaLabel(c.area), c.language].map(cell).join(',')
  );
  return '﻿' + [csvHeaders[lang].join(','), ...rows].join('\r\n') + '\r\n';
}

/** Pestañas del hub que tienen contenido. Una pestaña sin entradas no se muestra ni genera ruta. */
export async function getAvailableTabs(): Promise<TabId[]> {
  const [items, upcoming] = await Promise.all([getContributions('es'), getUpcomingTalks('es')]);
  return (Object.keys(tabTypes) as TabId[]).filter(
    (id) => items.some((c) => (tabTypes[id] as readonly ContributionType[]).includes(c.type)) || (id === 'charlas' && upcoming.length > 0)
  );
}
