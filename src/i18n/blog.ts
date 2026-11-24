// Textos del blog (ES/EN). Fuente: design/prototype/index.html y su objeto EN.
// Los que el prototipo no traduce (marcados con "mío") los redacté yo y quedan para revisión en el PR.

import type { Lang } from './index';

const es = {
  home: {
    eyebrow: 'Blog',
    title: 'Notas de trabajo sobre Azure',
    note: 'Primero una versión corta en LinkedIn; cuando el tema lo pide, la versión extendida acá.',
    seeAll: 'Ver todo el blog',
  },
  index: {
    backHome: '← Volver al inicio',
    crumb: 'Blog',
    title: 'Blog',
    lead: 'Publico primero una versión corta en LinkedIn y, cuando el tema lo pide, la versión extendida acá.',
    note: '',
  },
  kinds: {
    article: 'Artículo',
    post: 'Post en LinkedIn ↗',
  },
  extendedLink: 'Versión extendida →',
  featuredMeta: (min: number) => `Versión extendida · ${min} min`,
  article: {
    back: '← Volver a los artículos',
    readTime: (min: number) => `${min} min de lectura`,
    updated: 'actualizado',
    authorName: 'Santiago Da Ros',
    authorRole: 'Cloud Engineer en Readymind. De cloud al producto.',
    comment: 'Comentar en LinkedIn ↗',
    edit: 'Editar en GitHub ↗',
    toc: 'En este artículo',
    series: 'Serie',
    seriesPart: (n: number) => `Parte ${n}`,
    tested: 'Probado en',
    testedServices: 'Servicios',
    talkTitle: 'Lo conté en esta charla',
    talkText: 'Si preferís verlo en vivo, está en esta charla.',
    talkBtn: 'Ver la charla →',
    subscribe: 'Recibir el próximo',
    subscribeBtn: 'Suscribirme al newsletter',
    next: 'Siguiente',
    references: 'Referencias',
    copy: 'Copiar',
    copied: 'Copiado',
    copyFail: 'Seleccioná y copiá',
    calloutLabels: { tip: 'tip', warning: 'atención', danger: 'riesgo' },
    takeaway: 'takeaway',
  },
  tags: {} as Record<string, string>,
};

const en: typeof es = {
  home: {
    eyebrow: 'Blog',
    title: 'Working notes on Azure',
    note: 'A short version on LinkedIn first; when the topic calls for it, the extended version here. In Spanish.',
    seeAll: 'See the whole blog',
  },
  index: {
    backHome: '← Back home',
    crumb: 'Blog',
    title: 'Blog',
    lead: 'I publish a short version on LinkedIn first and, when the topic calls for it, the extended version here.',
    // mío
    note: 'The LinkedIn posts and some articles are in Spanish. More English versions are on the way.',
  },
  kinds: {
    article: 'Article',
    // mío
    post: 'LinkedIn post ↗',
  },
  // mío
  extendedLink: 'Extended version →',
  featuredMeta: (min: number) => `Extended version · ${min} min`,
  article: {
    back: '← Back to the articles',
    // mío
    readTime: (min: number) => `${min} min read`,
    updated: 'updated',
    authorName: 'Santiago Da Ros',
    authorRole: 'Cloud Engineer at Readymind. From cloud to product.',
    comment: 'Comment on LinkedIn ↗',
    edit: 'Edit on GitHub ↗',
    toc: 'In this article',
    series: 'Series',
    seriesPart: (n: number) => `Part ${n}`,
    tested: 'Tested on',
    testedServices: 'Services',
    talkTitle: 'I covered this in a talk',
    talkText: 'If you would rather see it live, it is in this talk.',
    talkBtn: 'See the talk →',
    subscribeBtn: 'Subscribe to the newsletter',
    subscribe: 'Get the next one',
    next: 'Next',
    references: 'References',
    // mío
    copy: 'Copy',
    copied: 'Copied',
    copyFail: 'Select and copy',
    calloutLabels: { tip: 'tip', warning: 'warning', danger: 'danger' },
    takeaway: 'takeaway',
  },
  // Etiquetas de los posts de LinkedIn (IA → AI, Identidad → Identity, Almacenamiento → Storage: del prototipo; el resto, mío)
  tags: {
    IA: 'AI',
    Identidad: 'Identity',
    Almacenamiento: 'Storage',
    Estrategia: 'Strategy',
    Consultoría: 'Consulting',
  },
};

export const blogText = { es, en };

export function tagLabel(tag: string, lang: Lang): string {
  return blogText[lang].tags[tag] ?? tag;
}
