// Modos con accesorio según dónde esté el visitante:
// builder (laptop), guardia (auriculares), speaker (micrófono), lectura (anteojos).
import { UI, isHome, onDialog, root } from './core';
import { nudge } from './physics';

type Mode = 'builder' | 'guardia' | 'speaker' | 'lectura';

// De 20 a 7 h el modo por defecto es guardia
const night = (() => {
  const h = new Date().getHours();
  return h >= 20 || h < 7;
})();
const fallback = (): Mode => (night ? 'guardia' : 'builder');

let cur: Mode | null = null;
export function setMode(m: Mode | null) {
  const next = m || fallback();
  if (next === cur) return;
  const first = cur === null;
  cur = next;
  root.setAttribute('data-mode', next);
  const label = document.querySelector('#dmMode span');
  if (label) label.textContent = UI.modes[next];
  if (!first) nudge(4);
}

const SECTION_MODE: Record<string, Mode | null> = {
  proyectos: 'builder',
  experiencias: 'builder',
  comunidad: 'lectura',
  newsletter: 'lectura',
  contacto: null,
  stack: null,
};
/** Modos de los modales de proyecto: los de DR van en guardia. */
const DR_PROJECTS = ['p-failover', 'p-drlive', 'p-backups'];

/** Modo según la página (artículos y guía: lectura; speaker kit: speaker). */
function pageMode(): Mode | null {
  const p = location.pathname.replace(/\/+$/, '');
  // Charlas (pestaña del hub y página de cada charla) y speaker kit: micrófono
  if (/\/(speaker|charlas(\/.*)?|talks(\/.*)?|comunidad\/charlas|community\/talks)$/.test(p)) return 'speaker';
  // Lectura: artículos, posts, hub, newsletter y guía KQL
  if (/\/(articulos|comunidad|community|newsletter|resources\/kql|recursos\/kql)(\/|$)/.test(p)) return 'lectura';
  return null;
}

export function initModes() {
  setMode(pageMode());
  if (isHome) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting && !document.querySelector('dialog[open]')) setMode(SECTION_MODE[(e.target as HTMLElement).id] ?? null);
        }),
      { threshold: 0.35 }
    );
    Object.keys(SECTION_MODE).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const hero = document.querySelector('.hero');
    if (hero) io.observe(hero);
  }
  onDialog((d, open) => {
    if (!d.classList.contains('pmodal')) return;
    if (open) return setMode(DR_PROJECTS.includes(d.id) ? 'guardia' : 'builder');
    // Al cerrar vuelve al modo de la sección que quedó a la vista
    const sec = document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('section[id]');
    setMode(isHome ? (SECTION_MODE[sec?.id ?? ''] ?? null) : pageMode());
  });
}
