// Núcleo compartido de Daruma: referencias al DOM, estado por visita, avisos con freno, panel,
// datos por idioma, enlaces y analítica. Los demás módulos (physics, modes, tour, facts, chat…) se apoyan acá.
import { track } from '@vercel/analytics';
import type { DarumaIndex } from '../../lib/daruma-index';
import { esc, sanitize } from './text';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = any;
export type Lang = 'es' | 'en';
export type Act = { t: string; h?: string; fn?: () => void };
export type Chip = { t: string; href?: string; dl?: 1; go?: 1; fn?: () => void };

export const lang: Lang = document.documentElement.lang === 'en' ? 'en' : 'es';
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const HOME = lang === 'es' ? '/' : '/en/';

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
export const root = byId<HTMLDivElement>('dm');
export const btn = byId<HTMLButtonElement>('dmBtn');
export const panel = byId<HTMLDivElement>('dmPanel');
export const body = byId<HTMLDivElement>('dmBody');
export const bub = byId<HTMLDivElement>('dmBubble');
export const shadow = byId<HTMLSpanElement>('dmShadow');
export const askForm = byId<HTMLFormElement>('dmAsk');
export const spot = byId<HTMLDivElement>('dmSpot');
export const card = byId<HTMLDivElement>('dmTour');
const mouth = btn.querySelector('.dm-mouth') as SVGPathElement;

/** Dónde estamos: la home tiene secciones; los artículos, el speaker kit, la guía y /daruma son páginas de lectura. */
export const isHome = !!document.getElementById('proyectos');
export const isReader = !!document.querySelector('main.reader');
export const isArticlePage = !!document.querySelector('[data-article]');

/* ───────── almacenamiento ───────── */
export const ls = {
  get(k: string) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* sin almacenamiento: sigue funcionando sin recordar */
    }
  },
  del(k: string) {
    try {
      localStorage.removeItem(k);
    } catch {
      /* igual */
    }
  },
};

/** Estado de la visita (dura lo que la pestaña): los límites son "por visita" aunque el sitio tenga varias páginas. */
interface Visit {
  said: number;
  last: number;
  closes: number;
  seen: Record<string, 1>;
  factN: number;
  factSeen: Record<string, 1>;
  factLast: number;
  pushes: number;
  falls: number;
  started?: 1;
  deep?: 1;
  hi?: 1;
  ret?: 1;
  pick: number;
}
const blank = (): Visit => ({ said: 0, last: 0, closes: 0, seen: {}, factN: 0, factSeen: {}, factLast: 0, pushes: 0, falls: 0, pick: Math.floor(Math.random() * 1000) });
function loadVisit(): Visit {
  try {
    const raw = sessionStorage.getItem('dmVisit');
    if (raw) return { ...blank(), ...JSON.parse(raw) };
  } catch {
    /* sin sessionStorage */
  }
  return blank();
}
export const V: Visit = loadVisit();
export const saveV = () => {
  try {
    sessionStorage.setItem('dmVisit', JSON.stringify(V));
  } catch {
    /* igual */
  }
};

export let muted = ls.get('dmMuted') === '1';
export function setMuted(v: boolean) {
  muted = v;
  if (v) ls.set('dmMuted', '1');
  else ls.del('dmMuted');
  const mb = document.getElementById('dmMute');
  if (mb) mb.textContent = v ? UI.chrome.unmute : UI.chrome.mute;
}

/** Estado compartido entre módulos. */
export const S = { tour: false, chaos: false };
/** Ganchos para evitar importaciones circulares. */
export const hooks: { activity: () => void; home?: () => void } = { activity: () => {} };

export const firstVisit = () => ls.get('dmSeen') === null;
export const markSeen = () => ls.set('dmSeen', '1');

/* ───────── datos por idioma ───────── */
export let UI: Json = null;
export async function dataFor<T = Json>(name: string): Promise<T> {
  const m = await import(`../../data/daruma/${name}.${lang}.json`);
  return m.default as T;
}
export async function loadUI() {
  UI = await dataFor('ui');
  return UI;
}

let idxP: Promise<DarumaIndex> | null = null;
export let IDX: DarumaIndex | null = null;
/** Índice del sitio, generado en el build (proyectos, artículos, charlas, KQL, enlaces). */
export function loadIdx(): Promise<DarumaIndex> {
  if (!idxP) {
    idxP = fetch(`/daruma-index.${lang}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((j: DarumaIndex) => (IDX = j));
    idxP.catch(() => {
      idxP = null;
    });
  }
  return idxP;
}

/* ───────── enlaces ───────── */
const strip = (p: string) => p.replace(/\/+$/, '') || '/';
const onHome = () => strip(location.pathname) === strip(HOME);
const HUB = lang === 'es' ? '/comunidad/' : '/en/community/';
const FALLBACK: Record<string, string> = { proyectos: '#proyectos', experiencias: '#experiencias', stack: '#stack', comunidad: HUB, blog: HUB + (lang === 'es' ? 'articulos/' : 'articles/'), charlas: HUB + (lang === 'es' ? 'charlas/' : 'talks/'), posts: HUB + 'posts/', newsletter: '#newsletter', 'sobre-mi': '#sobre-mi', contacto: '#contacto' };
/** Resuelve una clave de enlace (art-rto, p-portal, speaker, charlas…) a una URL real. */
export function href(key: string): string {
  let u = (IDX && IDX.links[key]) || FALLBACK[key] || key;
  // En la home, los enlaces a la propia home son solo el hash (así el modal y el scroll no recargan)
  if (u.startsWith(HOME + '#') && onHome()) u = u.slice(HOME.length);
  return u;
}
export function openProject(id: string) {
  const link = document.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`);
  if (link) link.click();
  else location.href = `${HOME}#${id}`;
}
/** Navega a una clave de enlace. En la home, los proyectos abren su modal. */
export function go(key: string) {
  if (key.startsWith('p-') && onHome()) return openProject(key);
  const u = href(key);
  if (u.startsWith('#')) location.hash = u;
  else location.href = u;
}

/* ───────── analítica ───────── */
export function emit(ev: string, data?: Record<string, string | number | boolean>) {
  try {
    if (import.meta.env.DEV) console.info('[daruma:analytics]', ev, data ?? '');
    track(ev, data);
  } catch {
    /* la analítica nunca rompe nada */
  }
}
export { sanitize, esc };

/* ───────── cara y destellos ───────── */
const MOUTH: Record<string, string> = {
  smile: 'M44 58q6 4 12 0',
  big: 'M43 57q7 7 14 0',
  o: 'M50 58m-2.6 0a2.6 3 0 1 0 5.2 0a2.6 3 0 1 0 -5.2 0',
  flat: 'M45 59h10',
  wry: 'M44 59q6 2 12 -2',
};
let faceT = 0;
export function face(m: keyof typeof MOUTH, ms?: number) {
  mouth.setAttribute('d', MOUTH[m]);
  clearTimeout(faceT);
  if (ms) faceT = window.setTimeout(() => mouth.setAttribute('d', MOUTH.smile), ms);
}
export function flash(c: string, ms: number) {
  root.classList.remove(c);
  void root.offsetWidth;
  root.classList.add(c);
  setTimeout(() => root.classList.remove(c), ms);
}

/* ───────── superposiciones ───────── */
/** Hay un <dialog> abierto (modal de proyecto o paleta de comandos). */
export const dialogOpen = () => !!document.querySelector('dialog[open]');
/** Daruma no habla solo cuando hay un modal abierto o se está leyendo una página de lectura. */
export const quiet = () => dialogOpen() || isReader;

/** Id del proyecto del modal abierto, o del artículo de la página. */
export function curOverlay(): string | null {
  const d = document.querySelector<HTMLDialogElement>('dialog.pmodal[open]');
  if (d) return d.id;
  if (isArticlePage && IDX) {
    const here = strip(location.pathname);
    return IDX.articles.find((a) => strip(a.href) === here)?.id ?? null;
  }
  return null;
}

type DlgCb = (d: HTMLDialogElement, open: boolean) => void;
const dlgCbs: DlgCb[] = [];
export const onDialog = (cb: DlgCb) => dlgCbs.push(cb);
/** Avisa a los suscriptores de los modales que ya estaban abiertos al cargar (link directo a un proyecto). */
export const replayDialogs = () => document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => dlgCbs.forEach((cb) => cb(d, true)));
new MutationObserver((ms) => {
  for (const m of ms) {
    const d = m.target as HTMLDialogElement;
    if (d.tagName !== 'DIALOG') continue;
    const was = m.oldValue !== null;
    const is = d.hasAttribute('open');
    if (was !== is) dlgCbs.forEach((cb) => cb(d, is));
  }
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'], attributeOldValue: true });

// Un <dialog> modal deja el resto de la página inerte (y Daruma queda debajo): mientras está abierto,
// Daruma se muda adentro del modal para poder avisar y recibir clics.
onDialog((d, open) => {
  if (!d.classList.contains('pmodal')) return;
  if (open) {
    if (panel.classList.contains('on')) close();
    setTimeout(() => d.open && d.appendChild(root), 380);
  } else document.body.appendChild(root);
});

/* ───────── avisos con freno ───────── */
let bubT = 0;
export function hideBub() {
  bub.classList.remove('on');
}
export function bubble(text: string, act?: Act) {
  bub.innerHTML = `<button class="dm__x" type="button" aria-label="${esc(UI.chrome.closeBubble)}">×</button>${text}${act ? `<br><button class="act" type="button">${esc(act.t)} →</button>` : ''}`;
  bub.classList.add('on');
  face('o', 500);
  (bub.querySelector('.dm__x') as HTMLElement).onclick = () => {
    hideBub();
    V.closes++;
    saveV();
    if (V.closes === 2 && !muted) {
      setMuted(true);
      emit('daruma_mute', { how: 'avisos' });
      setTimeout(() => {
        bubble(UI.muted);
        face('wry', 2200);
      }, 350);
    }
  };
  const a = bub.querySelector('.act') as HTMLElement | null;
  if (a && act)
    a.onclick = () => {
      hideBub();
      if (act.h) go(act.h);
      if (act.fn) act.fn();
    };
  const dur = Math.max(4200, (bub.textContent || '').length * 70);
  clearTimeout(bubT);
  bubT = window.setTimeout(hideBub, dur);
  const pause = () => clearTimeout(bubT);
  const resume = () => {
    clearTimeout(bubT);
    bubT = window.setTimeout(hideBub, 2500);
  };
  bub.onmouseenter = pause;
  bub.onmouseleave = resume;
  bub.onfocusin = pause;
  bub.onfocusout = resume;
}
/** Habla solo si no molesta: máx. 7 por visita, separados 16 s, y nunca con el panel, el recorrido o un modal abiertos. */
export function say(text: string, act?: Act | null, o: { force?: boolean; user?: boolean } = {}) {
  if (panel.classList.contains('on') || S.tour || quiet()) return false;
  if (muted && !o.user) return false;
  if (!o.force) {
    if (V.said >= 7 || Date.now() - V.last < 16000) return false;
    V.said++;
  }
  V.last = Date.now();
  saveV();
  bubble(text, act || undefined);
  return true;
}
export function once(key: string, text: string, act?: Act | null) {
  if (V.seen[key]) return;
  if (say(text, act)) {
    V.seen[key] = 1;
    saveV();
  }
}

/* ───────── panel ───────── */
export function msg(html: string, me?: boolean) {
  const d = document.createElement('div');
  d.className = 'dm__msg' + (me ? ' me' : '');
  d.innerHTML = html;
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
  return d;
}
export function chips(list: Chip[]) {
  const w = document.createElement('div');
  w.className = 'dm__chips';
  list.forEach((c) => {
    let el: HTMLElement;
    if (c.href) {
      const a = document.createElement('a');
      a.href = href(c.href);
      if (c.dl) a.setAttribute('download', '');
      a.addEventListener('click', () => close());
      el = a;
    } else {
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', () => {
        w.remove();
        msg(esc(c.t), true);
        setTimeout(() => c.fn && c.fn(), 260);
      });
      el = b;
    }
    el.className = 'dm__chip' + (c.go ? ' go' : '');
    el.textContent = c.t;
    w.appendChild(el);
  });
  body.appendChild(w);
  body.scrollTop = body.scrollHeight;
}
export function typing() {
  const t = document.createElement('div');
  t.className = 'dm__msg dm__typing';
  t.innerHTML = '<i></i><i></i><i></i>';
  body.appendChild(t);
  body.scrollTop = body.scrollHeight;
  return t;
}

export const fmtDate = (d: string) => new Date(d.length === 10 ? d + 'T12:00:00' : d).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', { day: 'numeric', month: 'short' });

/** Barra de datos vivos del panel (próxima charla y lo último publicado). */
export async function renderStatus() {
  const el = document.getElementById('dmStatus');
  if (!el || el.childElementCount) return;
  try {
    const idx = await loadIdx();
    const t = idx.nextTalk;
    const last = idx.content.find((c) => c.d.length === 10) || idx.content[0];
    el.innerHTML =
      (t ? `<span>${esc(UI.status.next)} <b>${esc(t.t)}</b> · ${t.date ? fmtDate(t.date) : esc(UI.status.tbd)}</span>` : '') +
      (last ? `<span>${esc(UI.status.last)} <b>${esc(last.t)}</b>${last.d.length === 10 ? ' · ' + fmtDate(last.d) : ''}</span>` : '');
  } catch {
    /* sin índice, sin barra */
  }
}

export function open(fromKeyboard = false) {
  hooks.activity();
  panel.classList.add('on');
  btn.setAttribute('aria-expanded', 'true');
  hideBub();
  face('big', 1200);
  emit('daruma_open');
  renderStatus();
  if (!body.children.length) hooks.home?.();
  if (fromKeyboard) (askForm.querySelector('input') as HTMLInputElement).focus({ preventScroll: true });
}
export function close() {
  const hadFocus = panel.contains(document.activeElement);
  panel.classList.remove('on');
  btn.setAttribute('aria-expanded', 'false');
  if (hadFocus) btn.focus({ preventScroll: true });
}
