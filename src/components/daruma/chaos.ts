// Chaos engineering de la página: las tarjetas visibles se caen, Daruma registra el incidente
// y las levanta en tres grupos. Con prefers-reduced-motion, solo el registro, sin animación.
import { RM, S, UI, bubble, close, dialogOpen, face, flash, hideBub } from './core';
import { hold, release } from './physics';

const SELECTOR = 'main .sol, main .feature, main .post, main .post--feat, main .talk, main .certs, main .hero__photo, main .facts > div, main.reader .prose > *';

export function chaos() {
  if (S.chaos) return;
  S.chaos = true;
  close();
  hideBub();
  if (dialogOpen()) (document.querySelector('dialog[open]') as HTMLDialogElement).close();
  const c = UI.chaos;
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
  const log = [`<span class="dm__tag">${c.tag}</span>${c.start}`];
  bubble(log[0]);
  const groups = [0, 1, 2].map((k) => els.filter((_, i) => i % 3 === k));
  groups.forEach((gr, k) =>
    setTimeout(() => {
      gr.forEach((e) => {
        e.classList.remove('chaos-fall');
        e.classList.add('chaos-up');
        e.style.transform = '';
        e.style.opacity = '';
      });
      log.push(c.up.replace(/\{k\}/g, String(k + 1)));
      bubble(log.join('<br>'));
    }, 1400 + k * 900)
  );
  setTimeout(() => {
    release(-5);
    face('big', 2000);
    flash('beat', 1150);
    bubble(`${log.join('<br>')}<br>${c.done}`, { t: c.act, h: 'p-failover' });
    setTimeout(() => {
      els.forEach((e) => e.classList.remove('chaos-up'));
      S.chaos = false;
    }, 1200);
  }, 1400 + 3 * 900);
}
