// Objetivo del año (el segundo ojo de Daruma): (charlas + artículos hechos) / (metas de charlas + artículos).
// Se calcula en el build desde la lista unificada de contribuciones (src/lib/contributions.ts: charlas, artículos,
// posts y lo cargado a mano), así que no hay que tocar nada al publicar. Las metas están en src/data/daruma/live.json.
import { getContributions } from './contributions';
import live from '../data/daruma/live.json';

let memo: ReturnType<typeof compute> | null = null;
async function compute() {
  const all = await getContributions('es');
  const count = (type: 'talk' | 'article') => all.filter((c) => c.type === type).length;
  const talks = { done: count('talk'), goal: live.goal.talks };
  const articles = { done: count('article'), goal: live.goal.articles };
  const pct = Math.round(((talks.done + articles.done) / (talks.goal + articles.goal)) * 100);
  return { year: live.goal.year, talks, articles, pct };
}
export const getGoal = () => (memo ??= compute());
