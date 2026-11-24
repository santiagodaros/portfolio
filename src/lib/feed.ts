// Tarjetas de la sección Comunidad (home y /comunidad). Es una sola lista visual que junta charlas (próximas y
// anteriores), artículos, posts, código y lo demás; la home la muestra resumida y el hub completa.
import { getContributions, tabTypes, typeLabel, type ContributionType, type TabId } from './contributions';
import { getPastTalks, getUpcomingTalks, talkDateLabel, talkHref, formatPartialDate } from './talks';
import { getUpcomingArticles } from './blog';
import type { Area } from './areas';
import type { Lang } from '../i18n';

export type FeedKind = ContributionType;

export type FeedItem = {
  key: string;
  kind: FeedKind;
  /** Pestaña a la que pertenece (los recursos de comunidad solo aparecen en "Todo"). */
  tab?: TabId;
  /** Etiqueta del tipo: "Charla", "Webinar", "Artículo"… */
  label: string;
  title: string;
  summary?: string;
  href: string;
  external: boolean;
  dateLabel: string;
  /** Para ordenar; sin fecha, al final. */
  sort: number;
  area?: Area;
  /** Portada con imagen; sin ella, la tarjeta arma una tipográfica. */
  image?: { src: string; width: number; height: number };
  upcoming?: boolean;
  inSpanish: boolean;
  reach?: string;
  event?: string;
  count?: number;
  extendedHref?: string;
  recording?: string;
};

const tabOf = (kind: FeedKind): TabId | undefined =>
  (Object.keys(tabTypes) as TabId[]).find((id) => (tabTypes[id] as readonly ContributionType[]).includes(kind));

/** Todas las tarjetas en `lang`: primero las charlas próximas; después, por fecha, lo más nuevo arriba. */
export async function getFeedItems(lang: Lang): Promise<FeedItem[]> {
  const [contributions, upcoming, past] = await Promise.all([getContributions(lang), getUpcomingTalks(lang), getPastTalks(lang)]);
  const items: FeedItem[] = [];

  const talk = (t: (typeof past)[number], isUpcoming: boolean): FeedItem => ({
    key: `talk:${t.id}`,
    kind: 'talk',
    tab: 'charlas',
    label: typeLabel({ type: 'talk', format: t.format }, lang),
    title: t.title,
    summary: t.summary,
    href: talkHref(t.id, lang),
    external: false,
    dateLabel: talkDateLabel(t, lang),
    sort: isUpcoming ? Number.MAX_SAFE_INTEGER : (t.date?.valueOf() ?? 0),
    area: t.area,
    image: t.image ? { src: `/img/${t.image}.webp`, width: 1280, height: 720 } : undefined,
    upcoming: isUpcoming,
    inSpanish: t.talkLanguage === 'es' && lang === 'en',
    event: t.event,
    recording: t.recording,
  });
  upcoming.forEach((t) => items.push(talk(t, true)));
  past.forEach((t) => items.push(talk(t, false)));

  for (const c of contributions) {
    if (c.type === 'talk') continue; // ya están arriba, con las que no tienen fecha
    items.push({
      key: c.key,
      kind: c.type,
      tab: tabOf(c.type),
      label: typeLabel(c, lang),
      title: c.title,
      summary: c.summary,
      href: c.href,
      external: c.external,
      dateLabel: formatPartialDate(c.date, c.datePrecision, lang),
      sort: c.date.valueOf(),
      area: c.area,
      image: c.image,
      inSpanish: c.inSpanish,
      reach: c.reach,
      event: c.event,
      count: c.count,
      extendedHref: c.extendedHref,
    });
  }

  // Las próximas primero (la más cercana arriba); el resto, lo más nuevo primero
  const up = items.filter((i) => i.upcoming).sort((a, b) => a.sort - b.sort);
  const rest = items.filter((i) => !i.upcoming).sort((a, b) => b.sort - a.sort);
  return [...up, ...rest];
}

/** Artículos programados (tarjeta "Próximamente"): solo en español. */
export async function getSoonArticles(lang: Lang) {
  return lang === 'es' ? getUpcomingArticles() : [];
}
