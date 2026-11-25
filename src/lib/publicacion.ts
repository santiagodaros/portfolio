// Publicación programada. Un artículo (o un post) con `publishAt` en el futuro no existe todavía: no se genera
// su página, no entra al RSS, al sitemap, al hub ni a Daruma, y en su lugar se muestra la tarjeta "Próximamente".
// El sitio es estático, así que "ahora" es el momento del build: un deploy programado (ver
// .github/workflows/rebuild-semanal.yml) lo regenera a la hora de salida y el artículo pasa a publicado.

/** "Ahora" para decidir qué está publicado. `PREVIEW_NOW` (ISO) solo sirve para probar los dos estados en local. */
export function ahora(): Date {
  const forzado = (typeof process !== 'undefined' ? process.env.PREVIEW_NOW : undefined) ?? import.meta.env.PREVIEW_NOW;
  return forzado ? new Date(forzado) : new Date();
}

type Programable = { draft?: boolean; publishAt?: Date };

/** Ya salió: no es borrador y su fecha de publicación (si tiene) ya pasó. */
export function estaPublicado(data: Programable): boolean {
  return !data.draft && (!data.publishAt || data.publishAt <= ahora());
}

/** Cuándo salió: la hora programada si la tiene (`date` es solo el día, y como medianoche UTC caería un día antes en Argentina). */
export function fechaDeSalida(data: { date: Date; publishAt?: Date }): Date {
  return data.publishAt ?? data.date;
}

/** Está programado para más adelante: se muestra como "Próximamente". */
export function esProximo(data: Programable): boolean {
  return !data.draft && !!data.publishAt && data.publishAt > ahora();
}
