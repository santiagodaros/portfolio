// Modo entrevista: 5 preguntas típicas, con las respuestas de Santiago.
// Las respuestas son BORRADORES: Santiago las reescribe con sus palabras y entonces se quita la etiqueta ("draft").
import { chips, dataFor, msg, type Json } from './core';

const contact = () => import('./contact');
let D: Json;

export async function interview(i?: number) {
  D ??= await dataFor('interview');
  if (i == null) msg(D.intro);
  else msg(D.says.replace('{a}', D.items[i].a) + (D.draft ? `<span class="dm__draft">${D.draft}</span>` : ''));
  chips(
    D.items
      .map((x: { q: string }, j: number) => (j === i ? null : { t: x.q, fn: () => void interview(j) }))
      .filter(Boolean)
      .concat([
        { t: D.cv, href: 'cv', dl: 1, go: 1 },
        { t: D.mail, fn: () => void contact().then((m) => m.mailto('recruiter')) },
      ])
  );
}
