// Objetivo del año (el segundo ojo de Daruma): (charlas + artículos hechos) / (metas de charlas + artículos).
// Se calcula en el build desde la colección `contributions`; las metas están en src/data/daruma/live.json.
import { getCollection } from 'astro:content';
import live from '../data/daruma/live.json';

export async function getGoal() {
  const all = await getCollection('contributions');
  const count = (kind: 'talk' | 'article') => all.filter((c) => c.data.kind === kind && c.data.goal).length;
  const talks = { done: count('talk'), goal: live.goal.talks };
  const articles = { done: count('article'), goal: live.goal.articles };
  const pct = Math.round(((talks.done + articles.done) / (talks.goal + articles.goal)) * 100);
  return { year: live.goal.year, talks, articles, pct };
}
