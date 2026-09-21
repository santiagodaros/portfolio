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
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
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

export const collections = { blog, series };
