import { getCollection } from 'astro:content';
import type { Lang } from '../i18n';

export type TalkData = Awaited<ReturnType<typeof getCollection<'talks'>>>[number]['data'];

/** Todas las charlas de un idioma, sin ordenar. */
async function allTalks(lang: Lang): Promise<TalkData[]> {
  const entries = await getCollection('talks', (e) => e.data.lang === lang);
  return entries.map((e) => e.data);
}

/** Anteriores: la más reciente primero (las que solo tienen el año, al final de su año). */
export async function getPastTalks(lang: Lang): Promise<TalkData[]> {
  const talks = (await allTalks(lang)).filter((t) => t.status === 'past');
  return talks.sort((a, b) => (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0));
}

/** Próximas: la más cercana primero; las que no tienen fecha, al final. */
export async function getUpcomingTalks(lang: Lang): Promise<TalkData[]> {
  const talks = (await allTalks(lang)).filter((t) => t.status === 'upcoming');
  return talks.sort((a, b) => (a.date?.valueOf() ?? Infinity) - (b.date?.valueOf() ?? Infinity));
}

export async function getTalk(id: string, lang: Lang): Promise<TalkData | undefined> {
  return (await allTalks(lang)).find((t) => t.id === id);
}

/** Ids de todas las charlas (iguales en los dos idiomas). */
export async function getTalkIds(): Promise<string[]> {
  const entries = await getCollection('talks', (e) => e.data.lang === 'es');
  return entries.map((e) => e.data.id);
}

/** Ruta de la página de la charla, sin barra final. */
export function talkHref(id: string, lang: Lang): string {
  return lang === 'es' ? `/charlas/${id}` : `/en/talks/${id}`;
}

export type DatePrecision = 'day' | 'month' | 'year';

/** Fecha en el idioma de la página, con el detalle que se conoce: "12 de noviembre de 2026", "noviembre de 2026" o "2026". */
export function formatPartialDate(date: Date, precision: DatePrecision, lang: Lang): string {
  const locale = lang === 'es' ? 'es-AR' : 'en-US';
  if (precision === 'year') return String(date.getUTCFullYear());
  const opts: Intl.DateTimeFormatOptions =
    precision === 'month'
      ? { month: 'long', year: 'numeric', timeZone: 'UTC' }
      : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
  return new Intl.DateTimeFormat(locale, opts).format(date);
}

/** Fecha de la charla para mostrar: la que se conoce, o la nota ("Fecha a confirmar"). */
export function talkDateLabel(t: TalkData, lang: Lang): string {
  if (t.date) return formatPartialDate(t.date, t.datePrecision, lang);
  return t.dateNote ?? '';
}

/** Para schema.org/Event hace falta el día exacto: sin él no se publica el Event. */
export function hasExactDate(t: TalkData): t is TalkData & { date: Date } {
  return Boolean(t.date) && t.datePrecision === 'day';
}
