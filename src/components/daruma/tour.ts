// Recorrido guiado con spotlight, bienvenida de la primera visita y mini recorridos por perfil.
import { HOME, RM, S, UI, V, saveV, btn, bubble, card, close, dialogOpen, dataFor, emit, face, flash, go, hideBub, isHome, markSeen, onDialog, open, openProject, root, spot, type Json } from './core';
import { aim, clearLean, nudge } from './physics';

type Step = { sel: string; up?: string; title: string; text: string; act?: { t: string; h: string } };

let TD: Json | null = null;
const loadTour = async () => (TD ??= await dataFor('tour'));

const T = { on: false, steps: [] as Step[], i: 0, paused: false, el: null as Element | null, kind: 'full', shown: 0 };

/** Arranca un recorrido con los pasos dados (los que no existen en la página se salteen). */
export async function tour(steps: Step[], kind = 'mini') {
  await loadTour();
  if (dialogOpen()) (document.querySelector('dialog[open]') as HTMLDialogElement).close();
  hideBub();
  close();
  T.on = true;
  S.tour = true;
  T.steps = steps;
  T.i = 0;
  T.paused = false;
  T.kind = kind;
  T.shown = 0;
  spot.classList.add('on');
  emit('daruma_tour_start', { kind, steps: steps.length });
  show();
  track();
}

/** Recorrido completo (en el celular, la versión corta de 6 pasos). */
export async function startTour() {
  // El recorrido recorre la home: desde otra página se va para allá y arranca ahí
  if (!isHome) {
    location.href = `${HOME}?daruma=tour`;
    return;
  }
  await loadTour();
  const mobile = root.classList.contains('m');
  const steps: Step[] = mobile ? TD.mobile.map((i: number) => TD.full[i]) : TD.full;
  tour(steps, mobile ? 'full-mobile' : 'full');
}
export async function startMini(name: 'evento' | 'dr' | 'leer') {
  if (!isHome) {
    location.href = `${HOME}?daruma=${name}`;
    return;
  }
  await loadTour();
  tour(TD[name], name);
}
(window as unknown as { darumaTour: () => void }).darumaTour = () => void startTour();

function show() {
  const st = T.steps[T.i];
  let el = document.querySelector(st.sel);
  if (el && st.up) el = el.closest(st.up) || el;
  // Una tarjeta del feed puede estar escondida (límite de la home, otra pestaña, filtro): se pide que se muestre.
  if (el && !el.getClientRects().length) el.dispatchEvent(new CustomEvent('feed:reveal', { bubbles: true }));
  if (!el || !el.getClientRects().length) return next();
  T.el = el;
  T.shown++;
  const r = el.getBoundingClientRect();
  el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: r.height > innerHeight * 0.65 ? 'start' : 'center' });
  const n = T.steps.length;
  const last = T.i === n - 1;
  const u = TD.ui;
  card.innerHTML =
    `<div class="dm-tour__k">${n > 1 ? u.step.replace('{i}', T.i + 1).replace('{n}', n) : u.one}</div><h4>${st.title}</h4><p>${st.text}</p>` +
    (st.act ? `<div class="dm-tour__act"><button class="dm__chip" type="button" data-t="act">${st.act.t} →</button></div>` : '') +
    (n > 1 ? `<div class="dm-tour__bar"><i style="width:${((T.i + 1) / n) * 100}%"></i></div>` : '<div style="height:12px"></div>') +
    `<div class="dm-tour__nav"><button class="lnk" type="button" data-t="end">${last ? u.close : u.exit}</button>` +
    (T.i > 0 ? `<button class="dm__chip" type="button" data-t="prev">${u.prev}</button>` : '') +
    `<button class="dm__chip go" type="button" data-t="next">${last ? (n > 1 ? u.finish : u.ok) : u.next}</button></div>`;
  card.classList.add('on');
  (card.querySelector('[data-t="next"]') as HTMLElement).focus({ preventScroll: true });
  face('o', 400);
  flash('beat', 1150);
  nudge(3);
}

function next() {
  if (T.i < T.steps.length - 1) {
    T.i++;
    show();
  } else endTour(false);
}

function endTour(early: boolean) {
  T.on = false;
  S.tour = false;
  card.classList.remove('on');
  spot.classList.remove('on');
  clearLean();
  if (!early && T.shown) emit('daruma_tour_complete', { kind: T.kind });
  btn.focus({ preventScroll: true });
  setTimeout(() => {
    bubble(early ? TD.ui.early : TD.ui.done);
    face('big', 1500);
  }, 300);
}

card.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-t]');
  if (!t) return;
  const k = t.dataset.t;
  if (k === 'next') next();
  if (k === 'prev') {
    T.i = Math.max(0, T.i - 1);
    show();
  }
  if (k === 'end') endTour(T.i < T.steps.length - 1);
  if (k === 'act') {
    const a = T.steps[T.i].act!;
    if (a.h.startsWith('p-')) {
      // "Abrir el detalle" pausa el recorrido y lo retoma al cerrar el modal
      T.paused = true;
      card.classList.remove('on');
      spot.classList.remove('on');
      openProject(a.h);
    } else {
      T.on = false;
      S.tour = false;
      card.classList.remove('on');
      spot.classList.remove('on');
      go(a.h);
    }
  }
});

function track() {
  if (!T.on) return;
  if (!T.paused && T.el) {
    const r = T.el.getBoundingClientRect();
    const pad = 10;
    const top = Math.max(8, r.top - pad);
    const bot = Math.min(innerHeight - 8, r.bottom + pad);
    spot.style.top = top + 'px';
    spot.style.left = Math.max(8, r.left - pad) + 'px';
    spot.style.width = Math.min(innerWidth - 16, r.width + pad * 2) + 'px';
    spot.style.height = Math.max(0, bot - top) + 'px';
    // Daruma mira y se inclina hacia lo que señala
    aim(r.left + r.width / 2, r.top + Math.min(r.height, innerHeight) / 2);
  }
  requestAnimationFrame(track);
}

/* ───────── bienvenida ───────── */
export async function welcome() {
  if (dialogOpen() || S.tour) return;
  await loadTour();
  markSeen();
  V.hi = 1; // la bienvenida hace de saludo
  saveV();
  root.classList.remove('enter');
  void root.offsetWidth;
  root.classList.add('enter');
  setTimeout(() => {
    root.classList.remove('enter');
    nudge(7);
    flash('ping', 1200);
    face('big', 1600);
    const w = TD.welcome;
    const k = (UI.hi as Record<string, string>)[hiKey()].replace(/\..*/, '');
    card.classList.toggle('sheet', root.classList.contains('m'));
    card.innerHTML =
      `<div class="dm-tour__k">${k}</div><h4>${w.title}</h4><p>${w.text}</p><div style="height:14px"></div>` +
      `<div class="dm-tour__nav"><button class="lnk" type="button" data-w="no">${w.no}</button><button class="dm__chip" type="button" data-w="find">${w.find}</button><button class="dm__chip go" type="button" data-w="tour">${w.tour}</button></div>`;
    card.classList.add('on');
    // Si la persona ya está navegando con el teclado (p. ej. sobre "Saltar al contenido"), no le sacamos el foco:
    // un Enter apretado justo ahora lanzaría el recorrido sin querer.
    const active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) {
      (card.querySelector('[data-w="tour"]') as HTMLElement).focus({ preventScroll: true });
    }
  }, 700);
}
export function hiKey() {
  const h = new Date().getHours();
  return h < 6 ? 'night' : h < 12 ? 'morning' : h < 20 ? 'afternoon' : 'evening';
}
card.addEventListener('click', (e) => {
  const w = (e.target as HTMLElement).closest<HTMLElement>('[data-w]');
  if (!w) return;
  card.classList.remove('on', 'sheet');
  const k = w.dataset.w;
  if (k !== 'tour') btn.focus({ preventScroll: true });
  if (k === 'tour') void startTour();
  if (k === 'find') open(true);
  if (k === 'no') setTimeout(() => bubble(TD.welcome.dismissed), 250);
});

/* ───────── pausa y reanudación con los modales; atajos ───────── */
export function initTour() {
  onDialog((d, isOpen) => {
    if (!d.classList.contains('pmodal') || !T.on) return;
    if (isOpen) {
      T.paused = true;
      card.classList.remove('on');
      spot.classList.remove('on');
    } else if (T.paused) {
      T.paused = false;
      spot.classList.add('on');
      card.classList.add('on');
      T.el?.scrollIntoView({ block: 'center' });
      bubble(TD.ui.resume);
    }
  });
  addEventListener('keydown', (e) => {
    const typing = /input|textarea|select/i.test((e.target as HTMLElement).tagName || '');
    if (T.on && !T.paused) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' && T.i > 0) {
        e.preventDefault();
        T.i--;
        show();
      } else if (e.key === 'Escape') endTour(true);
    } else if (e.key === 'Escape' && card.classList.contains('on') && !T.on) {
      // La tarjeta de bienvenida también se cierra con Esc
      card.classList.remove('on', 'sheet');
      btn.focus({ preventScroll: true });
    } else if (e.key === '?' && !typing && !dialogOpen()) void startTour();
  });
  // Llegada desde otra página con "?daruma=tour"
  const want = isHome ? new URLSearchParams(location.search).get('daruma') : null;
  if (want === 'tour' || want === 'evento' || want === 'dr' || want === 'leer') {
    history.replaceState(null, '', location.pathname + location.hash);
    markSeen();
    setTimeout(() => (want === 'tour' ? void startTour() : void startMini(want)), 700);
  }
}
