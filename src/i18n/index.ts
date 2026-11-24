// Textos compartidos del sitio (nav, footer, tema) y helpers de idioma.
// Cada componente recibe `lang` por props y lee de acá, sin toggle en el
// cliente: el idioma lo define la ruta (/ y /en/...).

export type Lang = 'es' | 'en';

export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

/** Ruta de la home en cada idioma. */
export function homePath(lang: Lang): string {
  return lang === 'es' ? '/' : '/en/';
}

/** Rutas reales por idioma de las páginas del sitio. */
export const paths = {
  es: {
    blog: '/comunidad/articulos',
    kql: '/recursos/kql',
    now: '/ahora',
    status: '/estado',
    speaker: '/speaker',
    cv: '/cv-es.pdf',
  },
  en: {
    blog: '/en/community/articles',
    kql: '/en/resources/kql',
    now: '/en/now',
    status: '/en/status',
    speaker: '/en/speaker',
    cv: '/cv-en.pdf',
  },
} as const;

export const contact = {
  linkedin: 'https://www.linkedin.com/in/santiagodaros/',
  github: 'https://github.com/santiagodaros',
} as const;

const ui = {
  es: {
    homeAria: 'Santiago Da Ros, inicio',
    skip: 'Saltar al contenido',
    mainNavAria: 'Principal',
    menuAria: 'Menú',
    menuOpen: 'Abrir el menú',
    menuClose: 'Cerrar el menú',
    searchAria: 'Buscar en el sitio (⌘K)',
    searchTitle: 'Buscar · ⌘K',
    switchLangAria: 'EN · Switch to English',
    switchLangText: 'EN',
    themeToDark: 'Cambiar a tema oscuro',
    themeToLight: 'Cambiar a tema claro',
    cta: 'Escribime',
    nav: {
      projects: 'Proyectos',
      experience: 'Experiencias',
      stack: 'Stack',
      blog: 'Blog',
      talks: 'Charlas',
      community: 'Comunidad',
      newsletter: 'Newsletter',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    footer: {
      title: '¿Hablamos?',
      text: 'Escribime si querés hablar de cloud, de producto o de una charla para tu comunidad.',
      emailBtn: 'Escribirme por email',
      groups: {
        work: 'Trabajo',
        content: 'Contenido',
        about: 'Sobre mí',
        contact: 'Contacto',
      },
      kql: 'Guía KQL',
      career: 'Trayectoria',
      cv: 'CV',
      now: 'Ahora',
      status: 'Estado',
      speaker: 'Speaker kit',
      email: 'Email',
      legal: 'Los nombres de productos son marcas de sus dueños',
    },
  },
  en: {
    homeAria: 'Santiago Da Ros, home',
    skip: 'Skip to content',
    mainNavAria: 'Main',
    menuAria: 'Menu',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    searchAria: 'Search the site (⌘K)',
    searchTitle: 'Search · ⌘K',
    switchLangAria: 'ES · Ver en español',
    switchLangText: 'ES',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    cta: 'Contact',
    nav: {
      projects: 'Projects',
      experience: 'Experience',
      stack: 'Stack',
      blog: 'Blog',
      talks: 'Talks',
      community: 'Community',
      newsletter: 'Newsletter',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      title: "Let's talk?",
      text: 'Write to me about cloud, product or a talk for your community.',
      emailBtn: 'Email me',
      groups: {
        work: 'Work',
        content: 'Content',
        about: 'About',
        contact: 'Contact',
      },
      kql: 'KQL guide',
      career: 'Career',
      cv: 'CV',
      now: 'Now',
      status: 'Status',
      speaker: 'Speaker kit',
      email: 'Email',
      legal: 'Product names are trademarks of their owners',
    },
  },
} as const;

export function useUi(lang: Lang) {
  return ui[lang];
}
