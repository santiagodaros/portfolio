// Textos de la paleta de comandos (⌘K / Ctrl+K), ES/EN.
// Fuente: la función cmds() del prototipo. Marcados con "mío": no estaban en el prototipo.

const es = {
  aria: 'Paleta de comandos',
  inputLabel: 'Buscar',
  placeholder: 'Buscá un proyecto, un artículo o un comando',
  navigate: 'para moverte',
  open: 'para abrir',
  empty: 'Sin resultados. Probá con “caída”, “KQL” o “speaker”.',
  groups: { sections: 'Secciones', projects: 'Proyectos', articles: 'Artículos', pages: 'Páginas', actions: 'Acciones' },
  sections: { projects: 'Proyectos', experience: 'Experiencias', stack: 'Stack', blog: 'Blog', talks: 'Charlas', about: 'Sobre mí' },
  allPosts: 'Todo el blog',
  guide: 'Guía: las 10 consultas de KQL',
  now: 'Ahora: en qué ando',
  status: 'Página de estado',
  speaker: 'Speaker kit',
  daruma: 'Daruma, la guía del sitio',
  tour: 'Recorrido guiado con Daruma',
  outage: 'Simular una caída',
  theme: 'Cambiar el tema',
  lang: 'Read in English',
  kql: 'Descargar las consultas .kql',
  subscribe: 'Suscribirme al newsletter',
  contact: 'Escribirme',
};

const en: typeof es = {
  aria: 'Command palette',
  inputLabel: 'Search',
  // mío
  placeholder: 'Search for a project, an article or a command',
  // mío
  navigate: 'to navigate',
  open: 'to open',
  empty: 'No results. Try “outage”, “KQL” or “speaker”.',
  groups: { sections: 'Sections', projects: 'Projects', articles: 'Articles', pages: 'Pages', actions: 'Actions' },
  sections: { projects: 'Projects', experience: 'Experience', stack: 'Stack', blog: 'Blog', talks: 'Talks', about: 'About' },
  allPosts: 'All posts',
  guide: 'Guide: 10 KQL queries',
  now: 'Now',
  status: 'Status page',
  speaker: 'Speaker kit',
  daruma: 'Daruma, the site guide',
  tour: 'Guided tour with Daruma',
  outage: 'Simulate an outage',
  theme: 'Toggle theme',
  lang: 'Leer en español',
  kql: 'Download the .kql queries',
  subscribe: 'Subscribe to the newsletter',
  contact: 'Contact me',
};

export const paletteText = { es, en };
