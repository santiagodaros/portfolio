// Contenido de la home (ES/EN). Fuente: design/prototype/index.html y su objeto EN.
// Los textos que el prototipo no traduce (alt de imágenes, aria-labels, la línea de
// certificaciones Fundamentals) están traducidos acá y quedan marcados para revisión en el PR.

import type { Lang } from './index';

const es = {
  hero: {
    eyebrow: 'Cloud & Product Engineer · Buenos Aires',
    titlePre: 'De cloud al ',
    titleEm: 'producto',
    lead: 'Diseño, construyo y opero herramientas sobre Azure en Readymind: algunas las usa mi equipo cada día y otras llegan a clientes corporativos.',
    emailBtn: 'Escribirme por email',
    cvBtn: 'Descargar CV',
    facts: [
      { value: '204', label: 'clientes en un portal en producción' },
      { value: '5', label: 'herramientas internas en un año' },
      { value: '6', label: 'certificaciones de Microsoft' },
    ],
    photoAlt: 'Santiago Da Ros presentando con un micrófono',
  },
  pulse: {
    label: 'Región primaria · latido normal',
    button: 'Simular una caída',
    sim: {
      noHeartbeat: 'Región primaria · sin latido',
      detecting: 'Región primaria sin respuesta. Detectando la caída…',
      // {n} = cantidad de secciones de la página, contada al momento de correr el simulacro
      failing: 'Failover a la región secundaria: levantando {n} secciones en orden',
      failingMeta: 'grupo 1 → 2 → 3',
      recovered: 'Recuperado en la región secundaria. No se perdió nada.',
      rto: 'RTO {rto} s · RPO 0',
      secondary: 'Región secundaria · latido normal',
    },
  },
  projects: {
    eyebrow: 'Proyectos',
    title: 'Lo que construí este año',
    note: 'Construidas con mi equipo en Readymind, partner de Microsoft, más un proyecto open source propio. Muestro qué resuelven y qué cambiaron; el código y los datos de clientes quedan adentro.',
    more: 'Ver el proyecto →',
    close: 'Cerrar',
    sections: { problem: 'El problema', idea: 'La idea', change: 'Qué cambió', role: 'Mi rol' },
  },
  guide: {
    eyebrow: 'Guía gratuita',
    title: 'Las 10 consultas de KQL que corro en toda auditoría',
    text: 'Huérfanos, backups faltantes, puertos abiertos, costos y más. Solo lectura, listas para copiar.',
    read: 'Leer la guía',
    download: 'Descargar .kql',
    sample: ['// 03. VMs sin Azure Backup', 'resources', '| where type == "microsoft.compute/', '  virtualmachines"', '| join kind = leftouter (…)', '| where isempty(vault)'],
  },
  how: {
    eyebrow: 'Cómo trabajo',
    title: 'Construyo la herramienta y opero la nube donde corre',
    note: 'Uso IA para ir más rápido. Cada cambio lo reviso yo.',
    pillars: [
      {
        n: 'Producto',
        title: 'Del problema a la herramienta',
        text: 'Relevo cómo se hace hoy la tarea y quién la sufre, diseño la solución y la dejo en manos del equipo.',
        tags: ['React', 'Next.js', 'PostgreSQL'],
      },
      {
        n: 'Plataforma',
        title: 'Azure seguro por defecto',
        text: 'Identidad, redes, infraestructura como código y CI/CD. Solo lectura cuando alcanza, menor privilegio y cero secretos en el código.',
        tags: ['Terraform', 'Entra ID', 'GitHub Actions'],
      },
      {
        n: 'IA en el flujo',
        title: 'Agentes con revisión propia',
        text: 'Claude Code con skills propias e integraciones MCP para automatizar, investigar y construir. Cada cambio pasa por mi revisión.',
        tags: ['Claude Code', 'MCP', 'Skills'],
      },
    ],
  },
  experience: {
    eyebrow: 'Experiencias',
    title: 'Mi primer hackatón',
    note: 'Un día para armar un producto en equipo y presentarlo frente al jurado.',
    captionMeta: 'Octubre de 2026 · Buenos Aires',
    caption: 'Agentic Banking Buildathon de Belo',
    kicker: 'Primer hackatón',
    heading: 'Belo Business: la tarjeta corporativa que rinde hasta el vencimiento',
    text: 'En equipo construimos sobre la API de Belo una plataforma para que una empresa controle sus tarjetas y sus gastos. Un copiloto prepara cada pago y una persona lo revisa y lo autoriza.',
    role: [
      {
        label: 'La idea:',
        text: 'lo que gastás con la tarjeta queda invertido en USDT hasta el día antes del vencimiento. Un agente compra y vende los dólares por detrás para pagar el resumen con el rendimiento ganado.',
      },
      {
        label: 'Mi parte:',
        text: 'esa idea y el motor de reglas que decide qué gasto pasa, cuál se frena y cuál va a revisión.',
      },
      { label: 'La demo:', text: 'la presenté en vivo ante el jurado y los demás equipos.' },
    ],
    tags: ['API de Belo', 'MCP', 'USDT', 'Agentes con aprobación humana'],
    pitchAlt: 'Santiago presentando el producto del equipo frente a una pantalla',
    buildAlt: 'Santiago trabajando con su equipo durante el hackatón',
    screenAlt: 'Pantalla de apertura del Hackathon agentic banking de Belo, octubre de 2026',
  },
  stack: {
    eyebrow: 'Stack',
    title: 'Tecnologías y certificaciones',
    note: 'Agrupado por para qué lo uso.',
    groups: [
      {
        title: 'Cloud e identidad',
        items: [
          { text: 'Azure', badge: 'principal' },
          { text: 'Entra ID y Conditional Access' },
          { text: 'Azure Arc y Lighthouse' },
          { text: 'Site Recovery y Backup' },
        ],
      },
      {
        title: 'Infraestructura como código y CI/CD',
        items: [
          { text: 'Terraform' },
          { text: 'GitHub Actions' },
          { text: 'Azure DevOps' },
          { text: 'Docker y Container Apps' },
        ],
      },
      {
        title: 'Producto y datos',
        items: [
          { text: 'TypeScript, React y Next.js' },
          { text: 'PostgreSQL y PostgREST' },
          { text: 'Supabase y Vercel' },
          { text: 'Python y SQL' },
        ],
      },
      {
        title: 'Automatización e IA',
        items: [
          { text: 'PowerShell y Azure Automation' },
          { text: 'Claude Code' },
          { text: 'Servidores MCP' },
          { text: 'KQL y Resource Graph' },
        ],
      },
    ],
    certsTitle: 'Certificaciones de Microsoft',
    verifyHint: 'verificar en Microsoft Learn',
    inProgress: 'En curso',
    certsNote: 'Cada una se verifica en Microsoft Learn.',
  },
  about: {
    eyebrow: 'Sobre mí',
    title: 'Empecé en infraestructura y terminé construyendo producto',
    p1: 'Trabajo en una consultora partner de Microsoft con cuentas corporativas de varios países. Empecé en infraestructura y hoy paso buena parte del tiempo construyendo las herramientas que el equipo usa con los clientes.',
    p2: 'Publico cada semana en LinkedIn para líderes de IT de Latinoamérica: bajo lo complejo a decisiones concretas.',
    cvBtn: 'Descargar CV',
    photoAlt: 'Retrato de Santiago Da Ros en la oficina de Readymind',
    timeline: [
      {
        time: 'Octubre 2026',
        title: 'Agentic Banking Buildathon · Belo',
        text: 'Primer hackatón: Belo Business, la idea de rendimiento en USDT, el motor de reglas y la demo en vivo.',
      },
      {
        time: 'Octubre 2025 – hoy',
        title: 'Cloud Engineer · Readymind',
        text: 'Cuentas corporativas, herramientas internas y preventa técnica. Acompaño a un trainee.',
      },
      {
        time: 'Mayo – octubre 2025',
        title: 'Programa de formación Cloud · Readymind',
        text: 'Infraestructura en Azure, automatización y datos.',
      },
      {
        time: '2027',
        title: 'Lic. en Gestión de Tecnología de la Información · UADE',
        text: 'Antes, Ciencias de la Computación en la UBA.',
      },
    ],
  },
};

const en: typeof es = {
  hero: {
    eyebrow: 'Cloud & Product Engineer · Buenos Aires',
    titlePre: 'From cloud to ',
    titleEm: 'product',
    lead: 'I design, build and run tools on Azure at Readymind: some my team uses every day, others reach enterprise clients.',
    emailBtn: 'Email me',
    cvBtn: 'Download CV',
    facts: [
      { value: '204', label: 'clients in a production portal' },
      { value: '5', label: 'internal tools in one year' },
      { value: '6', label: 'Microsoft certifications' },
    ],
    photoAlt: 'Santiago Da Ros presenting with a microphone',
  },
  pulse: {
    label: 'Primary region · healthy heartbeat',
    button: 'Simulate an outage',
    sim: {
      noHeartbeat: 'Primary region · no heartbeat',
      detecting: 'Primary region not responding. Detecting the outage…',
      failing: 'Failing over to the secondary region: bringing up {n} sections in order',
      failingMeta: 'group 1 → 2 → 3',
      recovered: 'Recovered in the secondary region. Nothing was lost.',
      rto: 'RTO {rto} s · RPO 0',
      secondary: 'Secondary region · healthy heartbeat',
    },
  },
  projects: {
    eyebrow: 'Projects',
    title: 'What I built this year',
    note: 'Built with my team at Readymind, a Microsoft partner, plus an open source project of my own. I show what they solve and what they changed; code and client data stay inside.',
    more: 'See the project →',
    close: 'Close',
    sections: { problem: 'The problem', idea: 'The idea', change: 'What changed', role: 'My role' },
  },
  guide: {
    eyebrow: 'Free guide',
    title: 'The 10 KQL queries I run in every audit',
    text: 'Orphans, missing backups, open ports, costs and more. Read-only, ready to copy.',
    read: 'Read the guide',
    download: 'Download .kql',
    sample: ['// 03. VMs without Azure Backup', 'resources', '| where type == "microsoft.compute/', '  virtualmachines"', '| join kind = leftouter (…)', '| where isempty(vault)'],
  },
  how: {
    eyebrow: 'How I work',
    title: 'I build the tool and run the cloud it lives on',
    note: 'I use AI to move faster. I review every change myself.',
    pillars: [
      {
        n: 'Product',
        title: 'From problem to tool',
        text: 'I map how the task is done today and who suffers it, design the solution and hand it to the team.',
        tags: ['React', 'Next.js', 'PostgreSQL'],
      },
      {
        n: 'Platform',
        title: 'Secure-by-default Azure',
        text: 'Identity, networking, infrastructure as code and CI/CD. Read-only when enough, least privilege and zero secrets in code.',
        tags: ['Terraform', 'Entra ID', 'GitHub Actions'],
      },
      {
        n: 'AI in the workflow',
        title: 'Agents with my own review',
        text: 'Claude Code with custom skills and MCP integrations to automate, research and build. Every change goes through my review.',
        tags: ['Claude Code', 'MCP', 'Skills'],
      },
    ],
  },
  experience: {
    eyebrow: 'Experience',
    title: 'My first hackathon',
    note: 'One day to build a product as a team and pitch it to the judges.',
    captionMeta: 'October 2026 · Buenos Aires',
    caption: "Belo's Agentic Banking Buildathon",
    kicker: 'First hackathon',
    heading: 'Belo Business: the corporate card that earns until the due date',
    text: "As a team we built, on Belo's API, a platform for a company to control its cards and spend. A copilot prepares each payment and a person reviews and approves it.",
    role: [
      {
        label: 'The idea:',
        text: 'what you spend on the card stays invested in USDT until the day before the due date. An agent buys and sells the dollars behind the scenes to pay the statement with the yield earned.',
      },
      {
        label: 'My part:',
        text: 'that idea and the rules engine that decides which expense passes, which is blocked and which goes to review.',
      },
      { label: 'The demo:', text: 'I presented it live to the judges and the other teams.' },
    ],
    tags: ['Belo API', 'MCP', 'USDT', 'Agents with human approval'],
    pitchAlt: "Santiago presenting the team's product in front of a screen",
    buildAlt: 'Santiago working with the team during the hackathon',
    screenAlt: "Opening screen of Belo's agentic banking hackathon, October 2026",
  },
  stack: {
    eyebrow: 'Stack',
    title: 'Technologies and certifications',
    note: 'Grouped by what I use it for.',
    groups: [
      {
        title: 'Cloud and identity',
        items: [
          { text: 'Azure', badge: 'primary' },
          { text: 'Entra ID and Conditional Access' },
          { text: 'Azure Arc and Lighthouse' },
          { text: 'Site Recovery and Backup' },
        ],
      },
      {
        title: 'Infrastructure as code and CI/CD',
        items: [
          { text: 'Terraform' },
          { text: 'GitHub Actions' },
          { text: 'Azure DevOps' },
          { text: 'Docker and Container Apps' },
        ],
      },
      {
        title: 'Product and data',
        items: [
          { text: 'TypeScript, React and Next.js' },
          { text: 'PostgreSQL and PostgREST' },
          { text: 'Supabase and Vercel' },
          { text: 'Python and SQL' },
        ],
      },
      {
        title: 'Automation and AI',
        items: [
          { text: 'PowerShell and Azure Automation' },
          { text: 'Claude Code' },
          { text: 'MCP servers' },
          { text: 'KQL and Resource Graph' },
        ],
      },
    ],
    certsTitle: 'Microsoft certifications',
    verifyHint: 'verify on Microsoft Learn',
    inProgress: 'In progress',
    certsNote: 'Each one is verifiable on Microsoft Learn.',
  },
  about: {
    eyebrow: 'About',
    title: 'I started in infrastructure and ended up building product',
    p1: 'I work at a Microsoft partner consultancy with enterprise accounts across several countries. I started in infrastructure and now spend much of my time building the tools the team uses with clients.',
    p2: 'I publish weekly on LinkedIn for IT leaders in Latin America: I turn complexity into concrete decisions.',
    cvBtn: 'Download CV',
    photoAlt: 'Portrait of Santiago Da Ros at the Readymind office',
    timeline: [
      {
        time: 'October 2026',
        title: 'Agentic Banking Buildathon · Belo',
        text: 'First hackathon: Belo Business, the USDT yield idea, the rules engine and the live demo.',
      },
      {
        time: 'October 2025 – today',
        title: 'Cloud Engineer · Readymind',
        text: 'Enterprise accounts, internal tools and technical presales. I mentor a trainee.',
      },
      {
        time: 'May – October 2025',
        title: 'Cloud training program · Readymind',
        text: 'Azure infrastructure, automation and data.',
      },
      {
        time: '2027',
        title: 'B.Sc. in IT Management · UADE',
        text: 'Previously, Computer Science at UBA.',
      },
    ],
  },
};

export const home = { es, en } satisfies Record<Lang, typeof es>;

/** Certificaciones de Microsoft del rol (6) + SC-100 en curso. Los links son de verificación en Learn. */
export const certs = [
  {
    code: 'AZ-305',
    level: 'Expert',
    name: 'Azure Solutions Architect',
    badge: 'az305',
    url: 'https://learn.microsoft.com/api/credentials/share/es-es/SantiagoDaRos-6508/52B2C739515C753F?sharingId=51E475397D223B51',
  },
  {
    code: 'AZ-400',
    level: 'Expert',
    name: 'DevOps Engineer',
    badge: 'az400',
    url: 'https://learn.microsoft.com/api/credentials/share/es-es/SantiagoDaRos-6508/B197406E6B136315?sharingId=51E475397D223B51',
  },
  {
    code: 'AZ-700',
    level: 'Associate',
    name: 'Network Engineer',
    badge: 'az700',
    url: 'https://learn.microsoft.com/api/credentials/share/es-es/SantiagoDaRos-6508/C0139EE975EA1CB8?sharingId=51E475397D223B51',
  },
  {
    code: 'SC-300',
    level: 'Associate',
    name: 'Identity and Access Administrator',
    badge: 'sc300',
    url: 'https://learn.microsoft.com/es-es/users/santiagodaros-6508/credentials/fbbbbe9c2857a9c9',
  },
  {
    code: 'AZ-104',
    level: 'Associate',
    name: 'Azure Administrator',
    badge: 'az104',
    url: 'https://learn.microsoft.com/api/credentials/share/es-es/SantiagoDaRos-6508/19D30964F4E0E0D5?sharingId=51E475397D223B51',
  },
  {
    code: 'AZ-800/801',
    level: 'Associate',
    name: 'Windows Server Hybrid Administrator',
    badge: 'az800',
    url: 'https://learn.microsoft.com/api/credentials/share/es-es/SantiagoDaRos-6508/809D828790013ACB?sharingId=51E475397D223B51',
  },
] as const;

export const certInProgress = {
  code: 'SC-100',
  name: 'Cybersecurity Architect',
  badge: 'sc100',
} as const;
