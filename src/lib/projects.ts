import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Project = CollectionEntry<'projects'>['data'];

/** Proyectos de un idioma, en orden visual (el destacado primero). */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection('projects', (e) => e.data.lang === lang);
  return entries.map((e) => e.data).sort((a, b) => a.order - b.order);
}

/** Hash del modal de un proyecto: #p-<id>. */
export function projectHash(id: string): string {
  return `p-${id}`;
}
