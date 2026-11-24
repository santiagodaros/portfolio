// Datos estructurados (schema.org) compartidos: la persona, con sus perfiles, y cada artículo.
import { getProfiles } from '../data/profiles';
import type { BlogEntry, SeriesInfo } from './blog';
import { getReadingTime } from './blog';
import type { Lang } from '../i18n';

export const knowsAbout = [
  'Microsoft Azure',
  'Azure Site Recovery',
  'Azure Backup',
  'Azure Policy',
  'Microsoft Entra ID',
  'Azure Resource Graph',
  'Kusto Query Language (KQL)',
  'Terraform',
  'FinOps',
  'PowerShell',
  'TypeScript',
];

/** Identificador de la persona dentro del sitio: los artículos y la home apuntan al mismo nodo. */
export const personId = (site: URL | string) => new URL('/#santiago', site).toString();

/** Perfiles públicos que ya tienen URL (los que no, no se publican). */
export const sameAs = () => getProfiles(['linkedin', 'github', 'youtube', 'learn', 'sessionize', 'qa']).map((p) => p.url);

export function personJsonLd(lang: Lang, site: URL | string) {
  return {
    '@type': 'Person',
    '@id': personId(site),
    name: 'Santiago Da Ros',
    alternateName: 'Santiago Lucas Da Ros',
    jobTitle: 'Cloud Engineer',
    address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
    url: new URL(lang === 'es' ? '/' : '/en/', site).toString(),
    image: new URL('/og.png', site).toString(),
    knowsAbout,
    sameAs: sameAs(),
  };
}

export function articleJsonLd(entry: BlogEntry, pageUrl: string, site: URL | string, series?: SeriesInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.data.title,
    description: entry.data.description,
    datePublished: entry.data.date.toISOString(),
    dateModified: (entry.data.updated ?? entry.data.date).toISOString(),
    inLanguage: entry.data.lang,
    mainEntityOfPage: entry.data.canonical ?? pageUrl,
    url: pageUrl,
    image: new URL(`/og/${entry.slug}.png`, site).toString(),
    articleSection: entry.data.category,
    keywords: entry.data.tags.join(', ') || undefined,
    timeRequired: `PT${getReadingTime(entry.body)}M`,
    author: { '@id': personId(site) },
    publisher: { '@id': personId(site) },
    isPartOf: series ? { '@type': 'CreativeWorkSeries', name: series.name } : undefined,
  };
}
