// Datos del newsletter que se completan a mano.
// `frequency` en null: todavía no hay frecuencia definida y la página no la muestra. Se completa cuando se decida.
// Las ediciones públicas se cargan como contribuciones de tipo "newsletter" (src/content/contributions/).
export const newsletterConfig: { frequency: { es: string | null; en: string | null } } = {
  // TODO(newsletter): frecuencia real (p. ej. "Cada dos semanas"). No inventar.
  frequency: { es: null, en: null },
};
