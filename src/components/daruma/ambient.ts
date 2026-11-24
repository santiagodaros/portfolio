// Vida propia de Daruma: parpadeo, latido, inactividad (prueba de failover y sueño), cambio de tema,
// vuelta a la pestaña, saludo según la hora, datos vivos y novedades para quien vuelve.
import { S, V, UI, card, muted, quiet, bubble, esc, face, firstVisit, flash, fmtDate, hideBub, hooks, ls, loadIdx, once, panel, root, say, saveV } from './core';
import { clearLean, nudge } from './physics';
import { hiKey } from './tour';

let idleT = 0;
let sleepT = 0;

function activity() {
  clearTimeout(idleT);
  clearTimeout(sleepT);
  if (root.classList.contains('sleep')) {
    root.classList.remove('sleep');
    face('big', 1500);
    flash('ping', 1200);
    say(UI.wake, null, { force: true });
  }
  idleT = window.setTimeout(selfTest, 30000);
  sleepT = window.setTimeout(goSleep, 70000);
}
function selfTest() {
  if (panel.classList.contains('on')) return;
  if (say(UI.selfTest[0])) {
    setTimeout(() => {
      nudge(9);
      flash('beat', 1150);
    }, 900);
    setTimeout(() => {
      bubble(UI.selfTest[1]);
      face('big', 1500);
    }, 2600);
  }
}
function goSleep() {
  if (panel.classList.contains('on') || S.tour) return;
  hideBub();
  root.classList.add('sleep');
  face('flat');
  clearLean();
}

/** Aviso de novedades para quien vuelve. Solo la primera página de la visita y nunca si llegó por un link directo. */
async function returning() {
  if (V.ret) return;
  V.ret = 1;
  saveV();
  const last = ls.get('dmLast');
  ls.set('dmLast', new Date().toISOString().slice(0, 10));
  if (!last || firstVisit()) return;
  try {
    const idx = await loadIdx();
    const nuevos = idx.content.filter((c) => c.d.length === 10 && c.d > last);
    if (!nuevos.length) return;
    const r = UI.returning;
    const n0 = nuevos[0];
    const txt = nuevos.length === 1 ? r.one.replace('{t}', esc(n0.t)).replace('{k}', UI.kinds[n0.k]).replace('{d}', fmtDate(n0.d)) : r.many.replace('{n}', String(nuevos.length)).replace('{t}', esc(n0.t));
    setTimeout(() => {
      if (muted || quiet() || panel.classList.contains('on') || S.tour) return;
      bubble(`<span class="dm__tag">${r.tag}</span>${txt}`, { t: r.act, h: n0.h });
      flash('ping', 1200);
      face('big', 1500);
    }, 1500);
  } catch {
    /* sin índice, sin novedades */
  }
}

export function initAmbient(opts: { deep: boolean }) {
  hooks.activity = activity;
  addEventListener('scroll', activity, { passive: true });
  addEventListener('keydown', activity);
  activity();

  // Parpadeo aleatorio (2,4 a 6 s, a veces doble) y latido en la panza cada ~9 s
  (function blink() {
    setTimeout(() => {
      if (!root.classList.contains('sleep')) {
        flash('blink', 130);
        if (Math.random() < 0.25) setTimeout(() => flash('blink', 120), 220);
      }
      blink();
    }, 2400 + Math.random() * 3600);
  })();
  setInterval(() => {
    if (!root.classList.contains('sleep')) flash('beat', 1150);
  }, 9000);

  // Cambio de tema claro/oscuro
  new MutationObserver(() => {
    const dark = document.documentElement.dataset.theme === 'dark';
    say(dark ? UI.theme.dark : UI.theme.light);
    flash('ping', 1200);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Volver a la pestaña después de más de 20 s
  let hidAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hidAt = Date.now();
    else if (hidAt && Date.now() - hidAt > 20000) once('back', UI.back);
  });

  // Saludo según la hora (no en la primera visita, que tiene bienvenida, ni con link directo)
  setTimeout(() => {
    if (opts.deep || firstVisit() || V.hi || S.tour || card.classList.contains('on')) return;
    if (say(`${UI.hi[hiKey()]} ${UI.greet}`)) {
      V.hi = 1;
      saveV();
    }
  }, 4000);

  // Dato vivo: próxima charla (una vez por visita)
  setTimeout(() => {
    loadIdx()
      .then((idx) => {
        const n = idx.nextTalk;
        const txt = n.date
          ? UI.live.days.replace('{n}', String(Math.ceil((new Date(n.date).getTime() - Date.now()) / 864e5))).replace('{t}', n.t)
          : UI.live.tbd.replace('{t}', n.t).replace('{where}', n.where);
        once('live', txt, { t: UI.live.act, h: 'charlas' });
      })
      .catch(() => {});
  }, 60000);

  if (!opts.deep && !firstVisit()) setTimeout(returning, 300);
}
