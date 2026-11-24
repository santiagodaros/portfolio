// Índice que Daruma lee en el navegador. Se arma en el build desde las colecciones y el contenido del sitio,
// así que las respuestas nunca quedan desactualizadas respecto de lo publicado (no hay datos duplicados).
// Lo sirven /daruma-index.es.json y /daruma-index.en.json.

import { getCollection } from 'astro:content';
import { getProjects, projectHash } from './projects';
import { articleHref, getPublishedArticles, type BlogEntry } from './blog';
import { kqlQueries } from '../data/kql';
import { home as homeText } from '../i18n/home';
import { homePath, paths, type Lang } from '../i18n';
import { darumaPath } from '../components/daruma/paths';
import live from '../data/daruma/live.json';
import { getGoal } from './daruma-goal';

/** Ids estables de los artículos (los usan el glosario y los recorridos). Clave: translationKey o slug. */
const ARTICLE_IDS: Record<string, string> = {
  'backup-rpo-rto': 'art-rto',
  'almacenamiento-inteligente-archivar-datos-viejos': 'art-archivo',
};

const articleId = (a: BlogEntry) => {
  const key = a.data.translationKey ?? a.slug;
  return ARTICLE_IDS[key] ?? `art-${key}`;
};

/** Texto plano de un fragmento de MDX/Markdown. */
function plain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sections(body: string) {
  return body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf('\n');
      return { h: plain(chunk.slice(0, nl)), text: plain(chunk.slice(nl + 1)).slice(0, 1400) };
    });
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export async function buildIndex(lang: Lang) {
  const home = homePath(lang);
  const p = paths[lang];
  const [projects, own, spanish, posts, contributions] = await Promise.all([
    getProjects(lang),
    getPublishedArticles(lang),
    getPublishedArticles('es'),
    getCollection('linkedin'),
    getCollection('contributions'),
  ]);

  // En inglés también cuentan los artículos que solo existen en español (como en el índice del blog)
  const articlesSrc =
    lang === 'en'
      ? [...own, ...spanish.filter((a) => !own.some((o) => o.data.translationKey && o.data.translationKey === a.data.translationKey))]
      : own;
  const articles = await Promise.all(
    articlesSrc.map(async (a, i) => {
      const next = articlesSrc.length > 1 ? articlesSrc[(i + 1) % articlesSrc.length] : null;
      return {
        id: articleId(a),
        title: a.data.title,
        lead: a.data.description,
        href: articleHref(a),
        date: isoDay(a.data.date),
        sections: sections(a.body),
        next: next ? { title: next.data.title, href: articleHref(next) } : null,
      };
    })
  );

  const links: Record<string, string> = {
    proyectos: `${home}#proyectos`,
    experiencias: `${home}#experiencias`,
    stack: `${home}#stack`,
    blog: `${home}#blog`,
    charlas: `${home}#charlas`,
    newsletter: `${home}#newsletter`,
    'sobre-mi': `${home}#sobre-mi`,
    contacto: '#contacto',
    speaker: p.speaker,
    'guia-kql': p.kql,
    daruma: darumaPath(lang),
    cv: p.cv,
    blogAll: p.blog,
  };
  projects.forEach((x) => (links[projectHash(x.id)] = `${home}#${projectHash(x.id)}`));
  articles.forEach((a) => (links[a.id] = a.href));

  const talks = homeText[lang].talks.items.map((t) => ({ t: t.title, url: t.url, text: t.text, tags: t.tags }));

  const postItems = posts
    .filter((x) => !x.data.articleSlug)
    .map((x) => ({
      t: x.data.title,
      tag: x.data.tag,
      summary: x.data.summary,
      href: x.data.url,
      date: isoDay(x.data.date),
    }));

  const talkContribs = contributions.filter((c) => c.data.kind === 'talk');
  const content = [
    ...articles.map((a) => ({ t: a.title, d: a.date, h: a.id, k: 'article' })),
    ...postItems.map((x) => ({ t: x.t, d: x.date, h: 'blog', k: 'post' })),
    ...talkContribs.filter((c) => c.data.date).map((c) => ({ t: c.data.title, d: c.data.date as string, h: 'charlas', k: 'talk' })),
  ].sort((a, b) => (a.d < b.d ? 1 : -1));

  const goal = await getGoal();

  return {
    lang,
    links,
    projects: projects.map((x) => ({
      id: projectHash(x.id),
      title: x.title,
      lead: x.lead,
      kpis: x.kpis.map((k) => `${k.value} ${k.label}`),
      stack: x.tags,
      sec: { problem: x.problem, idea: x.idea, change: x.change, role: x.role },
    })),
    articles,
    posts: postItems,
    talks,
    kql: kqlQueries[lang].map((q) => ({ t: q.title, desc: q.desc, code: q.query })),
    guideTitle: homeText[lang].guide.title,
    content,
    goal,
    nextTalk: { t: live.nextTalk.title, where: live.nextTalk.where[lang], date: live.nextTalk.date },
  };
}

export type DarumaIndex = Awaited<ReturnType<typeof buildIndex>>;
