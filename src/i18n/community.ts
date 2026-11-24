// Textos de /comunidad (hub), de las páginas de charla, de la sección de la home y de /newsletter (ES/EN).
// ES: redactado a partir de docs del plan MVP. EN: traducción mía, para revisión en el PR.

import type { Lang } from './index';
import type { TabId } from '../lib/contributions';

/** Slug de cada pestaña del hub en cada idioma (ES: /comunidad/charlas, EN: /en/community/talks). */
export const tabSlugs: Record<Lang, Record<TabId, string>> = {
  es: { charlas: 'charlas', articulos: 'articulos', posts: 'posts', codigo: 'codigo', foros: 'foros', newsletter: 'newsletter' },
  en: { charlas: 'talks', articulos: 'articles', posts: 'posts', codigo: 'code', foros: 'forums', newsletter: 'newsletter' },
};

export const communityPaths = {
  es: { hub: '/comunidad', csv: '/comunidad/contribuciones.csv', newsletter: '/newsletter' },
  en: { hub: '/en/community', csv: '/en/community/contributions.csv', newsletter: '/en/newsletter' },
} as const;

/** Ruta del hub o de una de sus pestañas, con barra final. */
export function hubHref(lang: Lang, tab?: TabId): string {
  const base = communityPaths[lang].hub;
  return tab ? `${base}/${tabSlugs[lang][tab]}/` : `${base}/`;
}

const es = {
  hub: {
    back: '← Volver al inicio',
    crumb: 'Comunidad',
    metaTitle: 'Comunidad — Santiago Da Ros',
    metaDescription:
      'Charlas, artículos, posts y código sobre Azure, infraestructura y resiliencia: contribuciones públicas con fecha, link y área.',
    title: 'Lo que comparto con la comunidad Azure',
    lead: 'Charlas, artículos, posts y código sobre Azure, infraestructura y resiliencia. Cada entrada tiene fecha y link a donde se puede ver.',
    countersTitle: 'Últimos 12 meses',
    counters: {
      talks: 'charlas y webinars',
      articles: 'artículos',
      posts: 'posts',
      repos: 'repositorios',
      forumAnswers: 'respuestas en foros',
    },
    profilesTitle: 'Perfiles',
    tabsAria: 'Secciones de la comunidad',
    tabs: { all: 'Todo', charlas: 'Charlas y webinars', articulos: 'Artículos', posts: 'Posts', codigo: 'Código', foros: 'Foros', newsletter: 'Newsletter' },
    tabMeta: {
      charlas: { title: 'Charlas y webinars — Comunidad', description: 'Charlas y webinars de Santiago Da Ros: próximas y anteriores, con grabación y detalle.' },
      articulos: { title: 'Artículos — Comunidad', description: 'Notas técnicas sobre infraestructura cloud, resiliencia, gobernanza y FinOps en Azure.' },
      posts: { title: 'Posts — Comunidad', description: 'Posts de LinkedIn sobre Azure, recuperación ante desastres, identidad y operaciones.' },
      codigo: { title: 'Código — Comunidad', description: 'Repositorios abiertos de Santiago Da Ros.' },
      foros: { title: 'Foros — Comunidad', description: 'Respuestas en foros de la comunidad Microsoft, por mes.' },
      newsletter: { title: 'Newsletter — Comunidad', description: 'Ediciones públicas del newsletter.' },
    },
    areaFilter: 'Área',
    allAreas: 'Todas',
    csv: 'Descargar CSV',
    csvNote: 'Todas las contribuciones, con fecha, tipo, título, link y área.',
    empty: 'No hay entradas en esta área.',
    upcoming: 'Próximas',
    previous: 'Anteriores',
    noUpcoming: 'No hay charlas confirmadas por ahora.',
    inSpanish: 'en español',
    extendedLink: 'Versión extendida →',
    watch: 'Ver grabación ↗',
    details: 'Ver el detalle →',
    reach: 'Alcance',
    answers: (n: number) => (n === 1 ? '1 respuesta' : `${n} respuestas`),
  },
  talk: {
    back: '← Volver a las charlas',
    upcomingTag: 'Próxima charla',
    pastTag: 'Charla anterior',
    webinarTag: 'Webinar',
    event: 'Evento',
    date: 'Fecha',
    format: 'Formato',
    formats: { talk: 'Charla', webinar: 'Webinar' },
    language: 'Idioma',
    languages: { es: 'Español', en: 'Inglés' },
    abstract: 'Abstract',
    recording: 'Grabación',
    watch: 'Ver en YouTube ↗',
    slides: 'Slides',
    slidesLink: 'Descargar las slides (PDF)',
    demo: 'Repositorio de la demo',
    demoLink: 'Ver en GitHub ↗',
    project: 'Proyecto que se mostró',
    projectLink: 'Ver el proyecto →',
    related: 'Artículos relacionados',
    community: 'Comunidad',
    pendingAbstract: 'El abstract se publica cuando se confirme la fecha.',
  },
  home: {
    eyebrow: 'Comunidad',
    title: 'Lo que comparto con la comunidad Azure',
    note: 'Artículos, charlas, posts y código. Primero una versión corta en LinkedIn; cuando el tema lo pide, la versión extendida acá.',
    featured: 'Artículo destacado',
    nextTalk: 'Próxima charla',
    lastTalk: 'Última charla',
    countersTitle: 'Últimos 12 meses',
    seeAll: 'Ver toda la comunidad →',
    seeTalks: 'Ver todas las charlas →',
    seeArticles: 'Ver todos los artículos →',
    recentPosts: 'Últimos posts',
    watch: 'Ver grabación ↗',
  },
};

const en: typeof es = {
  hub: {
    back: '← Back home',
    crumb: 'Community',
    metaTitle: 'Community — Santiago Da Ros',
    metaDescription:
      'Talks, articles, posts and code on Azure, infrastructure and resilience: public contributions with a date, a link and an area.',
    title: 'What I share with the Azure community',
    lead: 'Talks, articles, posts and code on Azure, infrastructure and resilience. Every entry has a date and a link to where you can see it.',
    countersTitle: 'Last 12 months',
    counters: {
      talks: 'talks and webinars',
      articles: 'articles',
      posts: 'posts',
      repos: 'repositories',
      forumAnswers: 'forum answers',
    },
    profilesTitle: 'Profiles',
    tabsAria: 'Community sections',
    tabs: { all: 'All', charlas: 'Talks and webinars', articulos: 'Articles', posts: 'Posts', codigo: 'Code', foros: 'Forums', newsletter: 'Newsletter' },
    tabMeta: {
      charlas: { title: 'Talks and webinars — Community', description: "Santiago Da Ros's talks and webinars: upcoming and past, with recordings and details." },
      articulos: { title: 'Articles — Community', description: 'Technical notes on cloud infrastructure, resilience, governance and FinOps on Azure.' },
      posts: { title: 'Posts — Community', description: 'LinkedIn posts on Azure, disaster recovery, identity and operations.' },
      codigo: { title: 'Code — Community', description: "Santiago Da Ros's open repositories." },
      foros: { title: 'Forums — Community', description: 'Answers in Microsoft community forums, by month.' },
      newsletter: { title: 'Newsletter — Community', description: 'Public newsletter issues.' },
    },
    areaFilter: 'Area',
    allAreas: 'All',
    csv: 'Download CSV',
    csvNote: 'Every contribution, with date, type, title, link and area.',
    empty: 'There are no entries in this area.',
    upcoming: 'Upcoming',
    previous: 'Past',
    noUpcoming: 'No confirmed talks for now.',
    inSpanish: 'in Spanish',
    extendedLink: 'Extended version →',
    watch: 'Watch the recording ↗',
    details: 'See the details →',
    reach: 'Reach',
    answers: (n: number) => (n === 1 ? '1 answer' : `${n} answers`),
  },
  talk: {
    back: '← Back to the talks',
    upcomingTag: 'Next talk',
    pastTag: 'Past talk',
    webinarTag: 'Webinar',
    event: 'Event',
    date: 'Date',
    format: 'Format',
    formats: { talk: 'Talk', webinar: 'Webinar' },
    language: 'Language',
    languages: { es: 'Spanish', en: 'English' },
    abstract: 'Abstract',
    recording: 'Recording',
    watch: 'Watch on YouTube ↗',
    slides: 'Slides',
    slidesLink: 'Download the slides (PDF)',
    demo: 'Demo repository',
    demoLink: 'View on GitHub ↗',
    project: 'Project shown',
    projectLink: 'See the project →',
    related: 'Related articles',
    community: 'Community',
    pendingAbstract: 'The abstract will be published once the date is confirmed.',
  },
  home: {
    eyebrow: 'Community',
    title: 'What I share with the Azure community',
    note: 'Articles, talks, posts and code. A short version on LinkedIn first; when the topic calls for it, the extended version here.',
    featured: 'Featured article',
    nextTalk: 'Next talk',
    lastTalk: 'Latest talk',
    countersTitle: 'Last 12 months',
    seeAll: 'See the whole community →',
    seeTalks: 'See all talks →',
    seeArticles: 'See all articles →',
    recentPosts: 'Latest posts',
    watch: 'Watch the recording ↗',
  },
};

export const communityText = { es, en };
