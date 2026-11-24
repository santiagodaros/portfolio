// Punto de entrada de Daruma. Se carga en idle desde Daruma.astro.
// Módulos: core (estado y avisos), physics, modes, tour, facts y ambient; el chat se baja al abrir el panel y
// las herramientas, la entrevista, el contacto y el caos, al usarlos por primera vez.
import { S, UI, V, askForm, body, close, dialogOpen, esc, firstVisit, hooks, isHome, loadUI, msg, muted, onDialog, panel, root, card, saveV, setMuted, emit, loadIdx, replayDialogs } from './core';
import { initPhysics } from './physics';
import { initModes } from './modes';
import { initTour, welcome } from './tour';
import { initAmbient } from './ambient';

const chat = () => import('./chat');

async function boot() {
  try {
    await loadUI();
  } catch {
    return; // sin datos no hay guía: el sitio funciona igual
  }

  // ¿Llegó por un link directo (otra página que no es la home, o un modal por hash)? Entonces no hay bienvenida ni saludo.
  if (!V.started) {
    V.started = 1;
    if (!isHome || /^#p-/.test(location.hash)) V.deep = 1;
    saveV();
  }
  const deep = !!V.deep;

  applyMobile();
  root.hidden = false;
  hooks.home = () => void chat().then((m) => m.ready().then(m.home, () => msg(UI.errors.data)));
  initPhysics();
  initModes();
  initTour();
  initAmbient({ deep });
  if (isHome) void import('./facts').then((m) => m.initFacts());
  void import('./reading').then((m) => m.initReading());
  void loadIdx().catch(() => null);
  // Prepara el chat sin bloquear nada
  const prefetch = () => void chat();
  if ('requestIdleCallback' in window) requestIdleCallback(prefetch, { timeout: 4000 });
  else setTimeout(prefetch, 2500);

  /* panel */
  (document.getElementById('dmClose') as HTMLElement).onclick = () => close();
  (document.getElementById('dmRestart') as HTMLElement).onclick = () => {
    body.innerHTML = '';
    hooks.home?.();
  };
  const mb = document.getElementById('dmMute') as HTMLElement;
  if (muted) mb.textContent = UI.chrome.unmute;
  mb.onclick = () => {
    setMuted(!muted);
    if (muted) emit('daruma_mute', { how: 'boton' });
  };
  document.getElementById('dmHow')?.addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const i = askForm.querySelector('input') as HTMLInputElement;
    const v = i.value.trim();
    if (!v) return;
    i.value = '';
    msg(esc(v), true);
    void chat().then((m) => m.reply(v));
  });

  // Escribir "caos" fuera de un campo de texto
  let seq = '';
  addEventListener('keydown', (e) => {
    if (/input|textarea|select/i.test((e.target as HTMLElement).tagName || '') || e.key.length !== 1) return;
    seq = (seq + e.key.toLowerCase()).slice(-4);
    if (seq === 'caos') void import('./chaos').then((m) => m.chaos());
  });

  /* primera visita: bienvenida (si llegó por un link directo, espera a que vuelva a la home) */
  if (isHome && firstVisit() && !new URLSearchParams(location.search).has('daruma')) {
    if (dialogOpen()) {
      const off = (d: HTMLDialogElement, open: boolean) => {
        if (open || !firstVisit()) return;
        setTimeout(() => !dialogOpen() && void welcome(), 1200);
      };
      onDialog(off);
    } else {
      const fromSite = !!document.referrer && new URL(document.referrer).origin === location.origin;
      setTimeout(() => !dialogOpen() && !S.tour && firstVisit() && void welcome(), fromSite || deep ? 1200 : 1600);
    }
  }

  avoidInit();
  replayDialogs();
}

/* ───────── celular: sin mouse, sin mirada ───────── */
const MOB = matchMedia('(max-width: 720px), (hover: none) and (pointer: coarse)');
function applyMobile() {
  root.classList.toggle('m', MOB.matches);
  card.classList.toggle('m', MOB.matches);
}
MOB.addEventListener?.('change', applyMobile);

/* ───────── nunca tapa un botón de acción ───────── */
// Si Daruma quedaría sobre un botón o campo del sitio, se corre hacia la izquierda hasta dejarlo libre.
function avoid() {
  if (panel.classList.contains('on') || S.tour || root.hidden) return;
  const mobile = root.classList.contains('m');
  const w = mobile ? 58 : 74;
  const h = mobile ? 66 : 84;
  const base = mobile ? 12 : 26;
  const offs = mobile ? [0, 72, 144] : [0, 96, 192];
  const targets = [...document.querySelectorAll<HTMLElement>('a.btn, button.btn, .nl__row button, .nl__row input, [data-open-palette]')].filter((el) => !root.contains(el));
  const rects = targets.map((el) => el.getBoundingClientRect()).filter((r) => r.width && r.bottom > innerHeight - h - 40 && r.top < innerHeight && r.right > innerWidth - 360);
  for (const off of offs) {
    const r = innerWidth - base - off;
    const box = { l: r - w - 10, r: r + 10, t: innerHeight - 18 - h - 10, b: innerHeight };
    const hit = rects.some((t) => t.left < box.r && t.right > box.l && t.top < box.b && t.bottom > box.t);
    if (!hit || off === offs[offs.length - 1]) {
      root.style.setProperty('--dm-x', off + 'px');
      return;
    }
  }
}
function avoidInit() {
  let t = 0;
  const later = () => {
    clearTimeout(t);
    t = window.setTimeout(avoid, 220);
  };
  addEventListener('scroll', later, { passive: true });
  addEventListener('resize', later);
  onDialog(() => setTimeout(avoid, 450));
  later();
}

void boot();
