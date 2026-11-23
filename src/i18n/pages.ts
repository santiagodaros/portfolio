// Contenido de /ahora, /estado y /speaker (ES/EN).
// ES: design/prototype/index.html (#ahora, #estado-carrera, #speaker). Son borradores que Santiago revisa
// antes de publicar (docs/REDISENO.md §11). EN: traducción mía (el prototipo no traduce estas páginas).

import type { Lang } from './index';

const es = {
  back: '← Volver al inicio',
  now: {
    crumb: '/ahora',
    tag: 'Ahora',
    date: 'Actualizado en noviembre de 2026',
    title: 'En qué ando ahora',
    lead: 'Una página que actualizo cada mes con lo que estoy estudiando, construyendo y aprendiendo. La idea viene del movimiento /now.',
    items: [
      { title: 'Estudiando', text: 'SC-100, Cybersecurity Architect, para rendirla antes de fin de año. Después, IA y datos en Azure.' },
      { title: 'Construyendo', text: 'Este sitio y su blog, y dashboards de monitoreo con alertas por mail.' },
      { title: 'Preparando', text: 'Una nueva sesión para Microsoft Speakers Hub en Español y el próximo webinar con demo en vivo.' },
      { title: 'Aprendiendo', text: 'Inglés, para trabajar y dar charlas en inglés, y producto: cómo decidir qué construir y qué no.' },
      { title: 'Empezando', text: 'La Licenciatura en Gestión de Tecnología de la Información en la UADE, en marzo de 2027.' },
    ],
  },
  status: {
    crumb: 'Estado',
    tag: 'Página de estado',
    date: 'Actualizada en noviembre de 2026',
    title: 'Estado de Santiago Da Ros',
    banner: 'Todos los sistemas principales operativos',
    rows: [
      { name: 'Azure e identidad', state: 'Operativo', tone: 'ok', note: '6 certificaciones activas' },
      { name: 'Producto', state: 'Operativo', tone: 'ok', note: '5 herramientas en uso' },
      { name: 'Blog', state: 'Operativo', tone: 'ok', note: 'Un artículo por semana' },
      { name: 'Charlas', state: 'Operativo', tone: 'ok', note: 'Próxima sesión en 2027' },
      { name: 'SC-100', state: 'Mantenimiento programado', tone: 'maint', note: 'Examen antes de fin de año' },
    ],
    resolved: {
      title: 'Incidentes resueltos',
      items: [
        {
          time: 'Octubre 2026',
          title: 'Primer hackatón, con un día de plazo',
          text: 'Causa: no había producto. Solución: Belo Business, construida en equipo sobre la API de Belo y presentada en vivo. Yo propuse el rendimiento en USDT hasta el vencimiento y armé el motor de reglas.',
        },
        {
          time: '2026',
          title: 'Licencias pagas sin asignar en toda la cartera',
          text: 'Causa: la información estaba repartida en más de 200 tenants. Solución: el Portal de operaciones CSP, en solo lectura y en producción.',
        },
      ],
    },
    planned: {
      title: 'Mantenimientos programados',
      items: [
        {
          time: 'Diciembre 2026',
          title: 'Examen SC-100',
          text: 'Impacto esperado: ninguno. Después de la ventana, el componente de seguridad sube de nivel.',
        },
        {
          time: 'Marzo 2027',
          title: 'Comienzo de la licenciatura en la UADE',
          text: 'Los jueves tienen capacidad reducida.',
        },
      ],
    },
  },
  speaker: {
    crumb: 'Speaker kit',
    tag: 'Speaker kit',
    meta: 'Para organizadores de eventos y comunidades',
    title: 'Santiago Da Ros como speaker',
    lead: 'Todo lo que necesitás para presentarme en tu evento: bio, fotos, temas y formatos. Charlas en español; en inglés, a coordinar.',
    shortBioTitle: 'Bio corta',
    shortBio:
      'Santiago Da Ros es Cloud & Product Engineer en una consultora partner de Microsoft en Buenos Aires. Construye productos internos y automatizaciones sobre Azure para clientes corporativos de Latinoamérica, y escribe cada semana para líderes de IT de la región.',
    longBioTitle: 'Bio larga',
    longBio:
      'Santiago Da Ros es Cloud & Product Engineer en una consultora partner de Microsoft en Buenos Aires. Construye productos internos y automatizaciones sobre Azure para clientes corporativos de Latinoamérica, y escribe cada semana para líderes de IT de la región. Trabaja en identidad, gobernanza, FinOps y recuperación ante desastres, y diseñó una prueba automatizada de recuperación ante desastres que hoy usa su equipo. Tiene seis certificaciones de Microsoft, entre ellas AZ-305 y AZ-400, y habló en Fabric Day con la comunidad Microsoft Speakers Hub en Español. Sus charlas muestran el trabajo funcionando, con demos en vivo.',
    copyBio: 'Copiar bio',
    copied: 'Copiado',
    copyFail: 'Seleccioná y copiá',
    photosTitle: 'Fotos',
    photos: [
      { file: 'retrato', download: 'santiago-da-ros-retrato.jpg', alt: 'Retrato de Santiago Da Ros', label: 'Retrato · descargar' },
      { file: 'hero', download: 'santiago-da-ros-charla.jpg', alt: 'Santiago presentando con un micrófono', label: 'Charla · descargar' },
      { file: 'pitch', download: 'santiago-da-ros-escenario.jpg', alt: 'Santiago en un escenario frente a una pantalla', label: 'Escenario · descargar' },
      { file: 'build', download: 'santiago-da-ros-taller.jpg', alt: 'Santiago trabajando en un hackatón', label: 'Taller · descargar' },
    ],
    topicsTitle: 'Temas',
    topics: [
      {
        title: 'Recuperación ante desastres con una prueba real',
        text: 'Cómo validar un plan de DR sin miedo, con Site Recovery, automatización y evidencia para auditoría. Demo en vivo de una caída y su recuperación.',
      },
      {
        title: 'Gobernanza de Azure como código',
        text: 'Azure Policy, EPAC, Lighthouse y GitHub Actions para gobernar varios tenants desde un repositorio, sin secretos.',
      },
      {
        title: 'FinOps con KQL: el ahorro que nadie reclama',
        text: 'Consultas de Resource Graph para encontrar gasto oculto y convertirlo en un reporte que alguien lea.',
      },
      {
        title: 'IA en operaciones cloud, con revisión humana',
        text: 'Agentes, skills e integraciones MCP aplicados al trabajo diario de un equipo de infraestructura.',
      },
    ],
    formatsTitle: 'Formatos',
    formats: [
      'Charla de 30 a 45 minutos con demo en vivo.',
      'Taller práctico de 90 minutos con laboratorio en Azure.',
      'Panel o entrevista sobre carrera cloud y producto.',
    ],
    contactTitle: 'Contacto',
    email: 'Escribirme por email',
  },
};

const en: typeof es = {
  back: '← Back home',
  now: {
    crumb: '/now',
    tag: 'Now',
    date: 'Updated in November 2026',
    title: "What I'm up to now",
    lead: "A page I update every month with what I'm studying, building and learning. The idea comes from the /now movement.",
    items: [
      { title: 'Studying', text: 'SC-100, Cybersecurity Architect, to take it before the end of the year. Then AI and data on Azure.' },
      { title: 'Building', text: 'This site and its blog, and monitoring dashboards with email alerts.' },
      { title: 'Preparing', text: 'A new session for Microsoft Speakers Hub en Español and the next webinar with a live demo.' },
      { title: 'Learning', text: 'English, to work and give talks in English, and product: how to decide what to build and what not to.' },
      { title: 'Starting', text: "The B.Sc. in IT Management at UADE, in March 2027." },
    ],
  },
  status: {
    crumb: 'Status',
    tag: 'Status page',
    date: 'Updated in November 2026',
    title: 'Santiago Da Ros status',
    banner: 'All major systems operational',
    rows: [
      { name: 'Azure and identity', state: 'Operational', tone: 'ok', note: '6 active certifications' },
      { name: 'Product', state: 'Operational', tone: 'ok', note: '5 tools in use' },
      { name: 'Blog', state: 'Operational', tone: 'ok', note: 'One article a week' },
      { name: 'Talks', state: 'Operational', tone: 'ok', note: 'Next session in 2027' },
      { name: 'SC-100', state: 'Scheduled maintenance', tone: 'maint', note: 'Exam before the end of the year' },
    ],
    resolved: {
      title: 'Resolved incidents',
      items: [
        {
          time: 'October 2026',
          title: 'First hackathon, with one day to deliver',
          text: "Cause: there was no product. Fix: Belo Business, built as a team on Belo's API and presented live. I proposed the USDT yield until the due date and built the rules engine.",
        },
        {
          time: '2026',
          title: 'Paid licenses left unassigned across the whole portfolio',
          text: 'Cause: the information was scattered across more than 200 tenants. Fix: the CSP operations portal, read-only and in production.',
        },
      ],
    },
    planned: {
      title: 'Scheduled maintenance',
      items: [
        {
          time: 'December 2026',
          title: 'SC-100 exam',
          text: 'Expected impact: none. After the window, the security component levels up.',
        },
        {
          time: 'March 2027',
          title: 'Start of the B.Sc. at UADE',
          text: 'Thursdays run at reduced capacity.',
        },
      ],
    },
  },
  speaker: {
    crumb: 'Speaker kit',
    tag: 'Speaker kit',
    meta: 'For event and community organizers',
    title: 'Santiago Da Ros as a speaker',
    lead: 'Everything you need to introduce me at your event: bio, photos, topics and formats. Talks in Spanish; in English, to be arranged.',
    shortBioTitle: 'Short bio',
    shortBio:
      'Santiago Da Ros is a Cloud & Product Engineer at a Microsoft partner consultancy in Buenos Aires. They build internal products and automations on Azure for enterprise clients across Latin America, and write every week for IT leaders in the region.',
    longBioTitle: 'Long bio',
    longBio:
      'Santiago Da Ros is a Cloud & Product Engineer at a Microsoft partner consultancy in Buenos Aires. They build internal products and automations on Azure for enterprise clients across Latin America, and write every week for IT leaders in the region. They work on identity, governance, FinOps and disaster recovery, and designed an automated disaster recovery test that their team uses today. They hold six Microsoft certifications, including AZ-305 and AZ-400, and spoke at Fabric Day with the Microsoft Speakers Hub en Español community. Their talks show the work running, with live demos.',
    copyBio: 'Copy bio',
    copied: 'Copied',
    copyFail: 'Select and copy',
    photosTitle: 'Photos',
    photos: [
      { file: 'retrato', download: 'santiago-da-ros-retrato.jpg', alt: 'Portrait of Santiago Da Ros', label: 'Portrait · download' },
      { file: 'hero', download: 'santiago-da-ros-charla.jpg', alt: 'Santiago presenting with a microphone', label: 'Talk · download' },
      { file: 'pitch', download: 'santiago-da-ros-escenario.jpg', alt: 'Santiago on a stage in front of a screen', label: 'Stage · download' },
      { file: 'build', download: 'santiago-da-ros-taller.jpg', alt: 'Santiago working at a hackathon', label: 'Workshop · download' },
    ],
    topicsTitle: 'Topics',
    topics: [
      {
        title: 'Disaster recovery with a real test',
        text: 'How to validate a DR plan without fear, with Site Recovery, automation and audit evidence. Live demo of an outage and its recovery.',
      },
      {
        title: 'Azure governance as code',
        text: 'Azure Policy, EPAC, Lighthouse and GitHub Actions to govern several tenants from one repository, with no secrets.',
      },
      {
        title: 'FinOps with KQL: the savings nobody claims',
        text: 'Resource Graph queries to find hidden spend and turn it into a report someone actually reads.',
      },
      {
        title: 'AI in cloud operations, with human review',
        text: "Agents, skills and MCP integrations applied to an infrastructure team's daily work.",
      },
    ],
    formatsTitle: 'Formats',
    formats: [
      'A 30 to 45 minute talk with a live demo.',
      'A 90-minute hands-on workshop with an Azure lab.',
      'A panel or interview about cloud and product careers.',
    ],
    contactTitle: 'Contact',
    email: 'Email me',
  },
};

export const pagesText = { es, en };

export function pageLang(lang: Lang) {
  return pagesText[lang];
}
