// Ruta de la página /daruma en cada idioma. Va acá y no en src/i18n/index.ts para no mezclarse con otros cambios.
import type { Lang } from '../../i18n';

export function darumaPath(lang: Lang): string {
  return lang === 'es' ? '/daruma' : '/en/daruma';
}
