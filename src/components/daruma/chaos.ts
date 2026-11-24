// Chaos engineering de la página: las tarjetas visibles se caen y Daruma narra el incidente paso a paso
// (detección, declaración, failover) antes de levantarlas en tres grupos, con el orden de un plan real
// (identidad, bases de datos, aplicaciones). Con prefers-reduced-motion, solo la narración, sin animación.
// Esc la saltea y deja todo en pie al instante.
import { RM, S, UI, bubble, close, dialogOpen, face, flash, hideBub } from './core';
import { hold, release } from './physics';

const SELECTOR = 'main .sol, main .feature, main .post, main .post--feat, main .talk, main .fc, main .certs, main .hero__photo, main .facts > div, main.reader .prose > *';
/** Pausa entre comentarios mientras todo está caído, y entre grupos al levantarse (ms): lo justo para leer una línea. */
const GAP_DOWN = 2800;
const GAP_UP = 1800;

export type Stage = 'start' | 'failover' | 'done';
/** `stage` avisa en qué momento está (la barra de incidente de la home lo usa para seguir a Daruma); `ms` en `failover` es lo que falta para terminar. */
export type Hooks = { stage?: (s: Stage, ms?: number) => void };

/** Devuelve false si ya hay un incidente en curso. */
export function chaos(h: Hooks = {}): boolean {
  if (S.chaos) return false;
  S.chaos = true;
  close();
  hideBub();
  if (dialogOpen()) (document.querySelector('dialog[open]') as HTMLDialogElement).close();
  const c = UI.chaos;
  const t0 = performance.now();
  const els = RM
    ? []
    : ([...document.querySelectorAll(SELECTOR)] as HTMLElement[])
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.bottom > 0 && r.top < innerHeight * 1.5;
        })
        .slice(0, 40);
  els.forEach((e, i) => {
    e.classList.add('chaos-fall');
    e.style.transform = `translateY(${innerHeight * 0.7}px) rotate(${(i % 2 ? 1 : -1) * (8 + ((i * 3) % 14))}deg)`;
    e.style.opacity = '.15';
  });
  if (!RM) hold(-84);

  h.stage?.('start');
  const groups = [0, 1, 2].map((k) => els.filter((_, i) => i % 3 === k));
  const timers: number[] = [];
  const at = (ms: number, fn: () => void) => void timers.push(window.setTimeout(fn, ms));
  const say = (s: { log: string; say: string }, skip = false) =>
    bubble(`<span class="dm__tag">${c.tag}</span><span class="dm__line">${s.log}</span><span class="dm__say">${s.say}</span>${skip ? `<span class="dm__skip">${c.skip}</span>` : ''}`);
  const raise = (gr: HTMLElement[]) =>
    gr.forEach((e) => {
      e.classList.remove('chaos-fall');
      e.classList.add('chaos-up');
      e.style.transform = '';
      e.style.opacity = '';
    });

  let over = false;
  function finish() {
    if (over) return;
    over = true;
    timers.forEach(clearTimeout);
    removeEventListener('keydown', onKey);
    h.stage?.('done');
    groups.forEach(raise);
    release(-5);
    face('big', 2000);
    flash('beat', 1150);
    const secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
    bubble(`<span class="dm__tag">${c.tag}</span>${c.done.replace('{s}', String(secs))}`, { t: c.act, h: 'p-failover' });
    setTimeout(() => {
      els.forEach((e) => e.classList.remove('chaos-up'));
      S.chaos = false;
    }, 1200);
  }
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish();
  addEventListener('keydown', onKey);

  // Primero todo caído y Daruma explicando qué pasa; después cada grupo vuelve con su comentario.
  const upAt = c.steps.length * GAP_DOWN;
  const total = upAt + c.up.length * GAP_UP + 600;
  c.steps.forEach((s, i) =>
    at(i * GAP_DOWN, () => {
      if (i === c.steps.length - 1) h.stage?.('failover', total - i * GAP_DOWN);
      say(s, i === 0);
    })
  );
  c.up.forEach((s, k) =>
    at(upAt + k * GAP_UP, () => {
      raise(groups[k] || []);
      say(s);
    })
  );
  at(total, finish);
  return true;
}
