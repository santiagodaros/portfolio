// Interruptores de Daruma (src/data/daruma/live.json).
// `interview`: el modo entrevista está apagado hasta que Santiago reescriba las 5 respuestas con sus palabras.
// Apagado, no existe en ningún lado: ni el comando, ni el chip del perfil, ni las menciones en la ayuda,
// las sugerencias o la página /daruma.
import live from '../../data/daruma/live.json';

export const INTERVIEW: boolean = (live as { interview?: boolean }).interview === true;

const CMD = /^\/(entrevista|interview)$/;

/** Quita el modo entrevista de un texto o de un objeto de textos (ayuda, comandos, sugerencias, tablas). */
export function withoutInterview<T>(data: T): T {
  if (INTERVIEW) return data;
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return v.replace(/<b>\/(entrevista|interview)<\/b>,\s*/g, '');
    if (Array.isArray(v)) {
      return v
        .filter((x) => !(Array.isArray(x) && typeof x[0] === 'string' && CMD.test(x[0])))
        .map(walk);
    }
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(data) as T;
}
