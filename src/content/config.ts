import { defineCollection, z } from 'astro:content';
import { AREAS } from '../lib/areas';

// lang is required on every entry (not just on routes) so the same
// collection can hold ES and EN posts side by side once translations exist —
// launch ships es-only, but the schema is bilingual-ready from day one.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string(),
    series: z.string().optional(),
    lang: z.enum(['es', 'en']),
    // Shared key linking an article to its translation in the other
    // language, e.g. both posts of a pair set translationKey: "backup-rpo-rto".
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    /** Portada de la tarjeta destacada y del artículo (ruta en /public). */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    /** Portada de código para artículos sin imagen (bloque oscuro con el fragmento). */
    coverCode: z.string().optional(),
    /** Si el artículo se publicó antes en otro sitio (p. ej. LinkedIn), su URL original. */
    canonical: z.string().url().optional(),
    /** Post de LinkedIn donde se comenta el artículo. */
    linkedin: z.string().url().optional(),
    /** Área técnica (filtro del hub /comunidad y CSV). */
    area: z.enum(AREAS),
    /** Alcance, solo en rangos (p. ej. "1.000–2.000 lecturas"). */
    reach: z.string().optional(),
    /** Caja "Probado en": cuándo y con qué servicios se verificó lo que cuenta el artículo. Sin dato, no se muestra. */
    tested: z.object({ date: z.coerce.date(), services: z.array(z.string()).min(1) }).optional(),
    /** ids de las charlas (colección talks) donde se contó el artículo; activan el cierre "lo conté en esta charla". */
    talks: z.array(z.string()).default([]),
    references: z
      .array(
        z.object({
          title: z.string(),
          source: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
  }),
});

const series = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    lang: z.enum(['es', 'en']),
  }),
});

// Posts de LinkedIn que se listan en el blog ("Post en LinkedIn ↗"). Un archivo por post.
// Si `articleSlug` está, el índice lleva a la versión extendida en el sitio en vez de a LinkedIn.
const linkedin = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    summary: z.string(),
    url: z.string().url(),
    articleSlug: z.string().optional(),
    area: z.enum(AREAS),
    /** Alcance, solo en rangos. */
    reach: z.string().optional(),
  }),
});

const langEnum = z.enum(['es', 'en']);
const link = z.object({ label: z.string(), url: z.string().url() });

// Charlas y webinars (próximos y anteriores). Un archivo por charla e idioma: `<id>.es.json` y `<id>.en.json`.
// Alimentan el hub /comunidad, /charlas/<id>, la home, el speaker kit y /ahora.
const talks = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    lang: langEnum,
    status: z.enum(['past', 'upcoming']),
    format: z.enum(['talk', 'webinar']),
    title: z.string(),
    /** Una o dos líneas, para tarjetas y listas. */
    summary: z.string(),
    /** Abstract de la página de la charla. Sin dato, no se muestra. */
    abstract: z.string().optional(),
    /** Evento donde se dio. Un webinar propio no lo lleva. */
    event: z.string().optional(),
    eventUrl: z.string().url().optional(),
    community: link.optional(),
    /** Fecha; sin ella, la charla es "a confirmar". `datePrecision` dice qué parte de la fecha se conoce. */
    date: z.coerce.date().optional(),
    datePrecision: z.enum(['day', 'month', 'year']).default('day'),
    /** Texto cuando la fecha no está definida (p. ej. "fecha a confirmar"). */
    dateNote: z.string().optional(),
    /** Línea de meta de la tarjeta (fecha · formato). */
    meta: z.string().optional(),
    /** Idioma en el que se da la charla. */
    talkLanguage: langEnum.default('es'),
    /** Nivel de la sesión (p. ej. "200"). */
    level: z.string().optional(),
    /** Duración (p. ej. "45 min (35 + 10 de preguntas)"). */
    duration: z.string().optional(),
    /** Enfoque de la sesión (p. ej. "Sesión conceptual con casos reales"). */
    approach: z.string().optional(),
    area: z.enum(AREAS).optional(),
    /** Imagen de /public/img/<image>.webp (16:9). */
    image: z.string().optional(),
    recording: z.string().url().optional(),
    /** PDF de las slides: ruta en /public o URL. */
    slides: z.string().optional(),
    demoRepo: z.string().url().optional(),
    /** id del proyecto (colección projects) que se mostró en la charla. */
    project: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Slugs (en español) de los artículos relacionados. */
    related: z.array(z.string()).default([]),
    /** Dato pendiente: nota interna, no se muestra. Se avisa en el build. */
    todo: z.string().optional(),
  }),
});

// Contribuciones que no salen de otra colección: repos, recursos, foros, newsletter, comunidad.
// Los artículos (blog), los posts (linkedin) y las charlas (talks) se suman solos en src/lib/contributions.ts.
// Un archivo por contribución e idioma; las que existen en los dos comparten `group`.
const contributions = defineCollection({
  type: 'data',
  schema: z.object({
    date: z.coerce.date(),
    datePrecision: z.enum(['day', 'month', 'year']).default('day'),
    type: z.enum(['talk', 'article', 'post', 'repo', 'forum', 'newsletter', 'community']),
    title: z.string(),
    /** URL externa o ruta del sitio (empieza con /). */
    url: z.string(),
    area: z.enum(AREAS),
    language: langEnum,
    group: z.string().optional(),
    /** Alcance, solo en rangos. */
    reach: z.string().optional(),
    event: z.string().optional(),
    /** Foros: cantidad de respuestas del mes (una entrada agregada por mes). */
    count: z.number().int().positive().optional(),
  }),
});

const kpi = z.object({ value: z.string(), label: z.string() });

// Proyectos de la home. Un archivo por proyecto e idioma: `<id>.es.json` y `<id>.en.json`.
// `id` es compartido entre idiomas y arma el hash del modal (#p-<id>).
// Solo se cuenta el qué y el porqué: nada de código ni datos de clientes.
const projects = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    lang: z.enum(['es', 'en']),
    /** Orden visual: el destacado primero, después el mosaico. */
    order: z.number(),
    /** lg: tarjeta alta (7/12 y 5/12 de ancho), md: 4/12, wide: fila completa. */
    size: z.enum(['lg', 'md', 'wide']),
    featured: z.boolean().default(false),
    kind: z.string(),
    status: z.string(),
    statusTone: z.enum(['live', 'plan']).default('live'),
    title: z.string(),
    summary: z.string(),
    /** Tecnologías, en la tarjeta. */
    tags: z.array(z.string()),
    /** Métrica de la tarjeta del mosaico. */
    metric: kpi.optional(),
    // Modal
    lead: z.string(),
    kpis: z.array(kpi),
    problem: z.string(),
    idea: z.string(),
    change: z.string(),
    role: z.string(),
    /** Etiquetas temáticas, al pie del modal. */
    topics: z.array(z.string()).default([]),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url(), primary: z.boolean().default(false) }))
      .default([]),
    note: z.string(),
    /** Ilustración decorativa de la tarjeta (no lleva datos reales). */
    mini: z
      .discriminatedUnion('type', [
        z.object({
          type: z.literal('terminal'),
          lines: z.array(
            z.object({ mark: z.string(), tone: z.enum(['ok', 'mut']), text: z.string(), dim: z.string().optional() })
          ),
        }),
        z.object({ type: z.literal('notes'), items: z.array(z.object({ title: z.string(), meta: z.string() })) }),
        z.object({ type: z.literal('checks'), items: z.array(z.object({ text: z.string(), done: z.boolean() })) }),
        z.object({
          type: z.literal('graph'),
          top: z.string().optional(),
          core: z.string(),
          leaves: z.array(z.string()),
        }),
      ])
      .optional(),
    /** Esquema animado del proyecto destacado. */
    flow: z
      .object({
        ariaLabel: z.string(),
        inLabel: z.string(),
        sources: z.array(z.string()),
        coreTitle: z.string(),
        coreItems: z.array(z.string()),
        badge: z.string(),
        outLabel: z.string(),
        outputs: z.array(z.string()),
        note: z.string(),
      })
      .optional(),
  }),
});

export const collections = { blog, series, linkedin, projects, talks, contributions };
