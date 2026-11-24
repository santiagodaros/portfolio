// Física de tentempié y mirada. Resorte con amortiguación; requestAnimationFrame solo mientras se mueve.
import { RM, V, UI, btn, hooks, root, saveV, say, shadow, face, close, open, panel } from './core';

let ang = 0;
let vel = 0;
let target = 0;
let lean = 0;
let running = false;
let held = false;
let mx = -1;
let my = -1;
let raf = 0;

const pupil = btn.querySelector('.dm-pupil') as SVGElement;
const glint = btn.querySelector('.dm-glint') as SVGElement;

function loop() {
  const goal = held ? target : target || lean;
  if (held) {
    ang += (goal - ang) * 0.35;
    vel = 0;
  } else {
    vel = vel * 0.9 + (goal - ang) * 0.055;
    ang += vel;
  }
  btn.style.transform = `rotate(${ang.toFixed(2)}deg)`;
  shadow.style.transform = `translateX(${(ang * 0.25).toFixed(1)}px) scaleX(${(1 - Math.min(Math.abs(ang), 90) / 260).toFixed(3)})`;
  if (!held && Math.abs(goal - ang) < 0.08 && Math.abs(vel) < 0.03) {
    running = false;
    return;
  }
  requestAnimationFrame(loop);
}
export function kick() {
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}
/** Un empujoncito (no hace nada con movimiento reducido). */
export function nudge(dv: number) {
  if (RM) return;
  vel += dv;
  kick();
}
/** Lo tumba a un ángulo y lo sostiene ahí (caída simulada, caos). */
export function hold(t: number) {
  held = true;
  target = t;
  kick();
}
export function release(v: number) {
  held = false;
  target = 0;
  if (RM) {
    ang = 0;
    vel = 0;
  } else vel = v;
  kick();
}
export function clearLean() {
  lean = 0;
  kick();
}

/** Mira (y se inclina) hacia un punto de la pantalla. */
export function aim(x: number, y: number) {
  mx = x;
  my = y;
  look();
}
export function resetEyes() {
  pupil.removeAttribute('transform');
  glint.removeAttribute('transform');
}
function look() {
  raf = 0;
  if (root.classList.contains('sleep')) return;
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height * 0.42;
  const dx = mx - cx;
  const dy = my - cy;
  const d = Math.hypot(dx, dy) || 1;
  const k = Math.min(d / 90, 1) * 2.4;
  const ox = (dx / d) * k;
  const oy = (dy / d) * k;
  pupil.setAttribute('transform', `translate(${ox.toFixed(2)} ${oy.toFixed(2)})`);
  glint.setAttribute('transform', `translate(${(ox * 0.8).toFixed(2)} ${(oy * 0.8).toFixed(2)})`);
  const nl = d < 320 && !RM ? Math.max(-7, Math.min(7, dx / 34)) : 0;
  if (Math.abs(nl - lean) > 0.3) {
    lean = nl;
    kick();
  }
}

export function initPhysics() {
  // Sin mouse no hay mirada que siga el cursor (celular)
  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      mx = e.clientX;
      my = e.clientY;
      hooks.activity();
      if (!raf) raf = requestAnimationFrame(look);
    },
    { passive: true }
  );

  // Empujar o hacer clic
  let downX = 0;
  let dragged = false;
  btn.addEventListener('pointerdown', (e) => {
    downX = e.clientX;
    dragged = false;
    btn.setPointerCapture(e.pointerId);
  });
  btn.addEventListener('pointermove', (e) => {
    if (!btn.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - downX;
    if (Math.abs(dx) > 5) {
      dragged = true;
      held = true;
      target = Math.max(-80, Math.min(80, dx * 0.9));
      root.classList.add('surprised');
      face('o');
      kick();
    }
  });
  const drop = (count: boolean) => {
    if (!held) return;
    held = false;
    if (RM) {
      ang = 0;
      vel = 0;
      target = 0;
    } else {
      vel = (target - ang) * 0.2;
      target = 0;
    }
    root.classList.remove('surprised');
    kick();
    if (!count) return;
    V.pushes++;
    saveV();
    const m = (UI.pushes as Record<string, string>)[String(V.pushes)];
    setTimeout(() => {
      face('big', 1600);
      if (m) say(m, null, { force: true, user: true });
    }, 700);
  };
  btn.addEventListener('pointerup', () => drop(true));
  // Un gesto cancelado por el sistema también lo suelta (si no, queda inclinado y el rAF no termina)
  btn.addEventListener('pointercancel', () => drop(false));
  btn.addEventListener('lostpointercapture', () => drop(false));
  btn.addEventListener('click', (e) => {
    if (dragged) {
      dragged = false;
      return;
    }
    if (panel.classList.contains('on')) close();
    else open(e.detail === 0);
  });
}
