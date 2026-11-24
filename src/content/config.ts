import { defineCollection, z } from 'astro:content';

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

// Lo que Santiago comparte con la comunidad (charlas y artículos extendidos). Alimenta el segundo ojo de
// Daruma ("Objetivo 2027") y la lista de novedades para quien vuelve. Un archivo por contribución.
// `date`: AAAA, AAAA-MM o AAAA-MM-DD (alcanza con lo que se sabe). Sin día exacto no dispara "novedad".
const contributions = defineCollection({
  type: 'data',
  schema: z.object({
    kind: z.enum(['talk', 'article']),
    title: z.string(),
    date: z
      .string()
      .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
      .optional(),
    /** Si suma al objetivo del año. */
    goal: z.boolean().default(true),
  }),
});

export const collections = { blog, series, linkedin, projects, contributions };
