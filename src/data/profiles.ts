// Perfiles públicos de Santiago. Un perfil con `url: null` todavía no tiene dato: no se muestra en ningún lado
// (hub /comunidad, footer, speaker kit, JSON-LD) hasta que se complete acá.
import { contact } from '../i18n';

export type ProfileId = 'linkedin' | 'github' | 'youtube' | 'learn' | 'sessionize' | 'qa';

export const profiles: Record<ProfileId, { label: string; url: string | null }> = {
  linkedin: { label: 'LinkedIn', url: contact.linkedin },
  github: { label: 'GitHub', url: contact.github },
  // TODO(perfil): URL del canal de YouTube de Santiago (los videos de las charlas ya están enlazados).
  youtube: { label: 'YouTube', url: null },
  // La ruta sale de los links de credenciales ya publicados (src/i18n/home.ts). Confirmar que sea el perfil público.
  learn: { label: 'Microsoft Learn', url: 'https://learn.microsoft.com/es-es/users/santiagodaros-6508/' },
  // TODO(perfil): URL del perfil de Sessionize.
  sessionize: { label: 'Sessionize', url: null },
  // TODO(perfil): URL del perfil de Microsoft Q&A.
  qa: { label: 'Microsoft Q&A', url: null },
};

/** Los perfiles que ya tienen URL, en el orden pedido. */
export function getProfiles(ids: ProfileId[]): { id: ProfileId; label: string; url: string }[] {
  return ids.flatMap((id) => {
    const p = profiles[id];
    return p.url ? [{ id, label: p.label, url: p.url }] : [];
  });
}
