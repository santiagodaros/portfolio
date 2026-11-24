// Utilidades de texto: normalización, tolerancia a errores de tipeo y privacidad de lo que se registra.

/** Minúsculas, sin acentos ni signos. */
export function norm(t: string): string {
  return (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\- ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Distancia de Levenshtein; corta en 9 si el largo difiere en más de una letra. */
export function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 9;
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** ¿La pregunta (ya normalizada) contiene el alias? Tolera un error de una letra en palabras de 5 o más. */
export function has(q: string, alias: string): boolean {
  const a = norm(alias);
  if ((' ' + q + ' ').indexOf(' ' + a) > -1) return true;
  if (a.indexOf(' ') < 0 && a.length >= 5) {
    const ws = q.split(' ');
    for (let i = 0; i < ws.length; i++) if (lev(ws[i], a) <= 1) return true;
  }
  return false;
}

export function any(q: string, list: string[]): string | null {
  for (let i = 0; i < list.length; i++) if (has(q, list[i])) return list[i];
  return null;
}

/** Escapa texto del visitante o del contenido antes de insertarlo como HTML. */
export function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Lo que se registra va sin datos personales: mails, links, teléfonos y números de 4 dígitos o más. */
export function sanitize(t: string): string {
  return String(t)
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[mail]')
    .replace(/https?:\/\/\S+/g, '[link]')
    .replace(/\+?\d[\d\s().-]{5,}\d/g, '[número]')
    .replace(/\b\d{4,}\b/g, '[número]')
    .slice(0, 120);
}
