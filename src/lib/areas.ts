// Áreas técnicas de las contribuciones (filtro del hub /comunidad y columna "área" del CSV).
export const AREAS = ['dr', 'governance', 'identity', 'finops', 'ai-ops'] as const;
export type Area = (typeof AREAS)[number];

export const areaLabels = {
  es: {
    dr: 'Recuperación ante desastres',
    governance: 'Gobernanza',
    identity: 'Identidad',
    finops: 'FinOps',
    'ai-ops': 'IA en operaciones',
  },
  en: {
    dr: 'Disaster recovery',
    governance: 'Governance',
    identity: 'Identity',
    finops: 'FinOps',
    'ai-ops': 'AI in operations',
  },
} as const satisfies Record<'es' | 'en', Record<Area, string>>;

/** Etiqueta corta para chips y botones de filtro. */
export const areaShort = {
  es: { dr: 'DR', governance: 'Gobernanza', identity: 'Identidad', finops: 'FinOps', 'ai-ops': 'IA' },
  en: { dr: 'DR', governance: 'Governance', identity: 'Identity', finops: 'FinOps', 'ai-ops': 'AI' },
} as const satisfies Record<'es' | 'en', Record<Area, string>>;
