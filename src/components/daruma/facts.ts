// Comentarios atados al contenido de la home: avisos al llegar a una sección, frase al pasar el mouse por un
// proyecto y datos técnicos cuando el visitante deja de scrollear. Todo con freno (ver say() en core).
import { S, V, bubble, dataFor, face, flash, muted, panel, quiet, root, saveV, once, type Json } from './core';
import { aim } from './physics';

export async function initFacts() {
  const D: Json = await dataFor('facts');

  /* secciones: un aviso al entrar en cada una */
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const s = D.sec[(e.target as HTMLElement).id];
        if (s) once('s-' + (e.target as HTMLElement).id, s[0], s[1]);
      }),
    { threshold: 0.4 }
  );
  Object.keys(D.sec).forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  /* hover de 0,9 s sobre un proyecto */
  let hoverEl: Element | null = null;
  let hoverT = 0;
  const projOf = (n: Element | null) => n && n.closest('a[href^="#p-"], [data-project-open]');
  const idOf = (el: Element) => (el.getAttribute('href') || '#' + (el as HTMLElement).dataset.projectOpen).slice(1);
  document.addEventListener('mouseover', (e) => {
    const el = projOf(e.target as Element);
    if (el === hoverEl) return;
    clearTimeout(hoverT);
    hoverEl = el;
    if (!el) return;
    const id = idOf(el);
    if (D.hover[id]) hoverT = window.setTimeout(() => once('h-' + id, D.hover[id]), 900);
  });

  /* datos al frenar el scroll */
  const pick = (k: string): string => {
    const f = D.facts[k];
    return Array.isArray(f) ? f[V.pick % f.length] : f;
  };
  function target() {
    const mid = innerHeight / 2;
    let best: { k: string; r: DOMRect } | null = null;
    let bd = 1e9;
    Object.keys(D.facts).forEach((k) => {
      let el: Element | null = k.startsWith('p-') ? document.querySelector(`[data-project-open="${k}"]`) || document.querySelector(`a[href="#${k}"]`) : document.getElementById(k);
      if (!el) return;
      if (k.startsWith('p-')) el = el.closest('article,.sol') || el;
      const r = el.getBoundingClientRect();
      if (r.bottom < 80 || r.top > innerHeight - 80) return;
      let d = Math.abs((r.top + Math.min(r.bottom, innerHeight)) / 2 - mid);
      if (k.startsWith('p-')) d -= 60;
      if (d < bd) {
        bd = d;
        best = { k, r };
      }
    });
    return best as { k: string; r: DOMRect } | null;
  }
  function onStop() {
    if (muted || S.tour || quiet() || panel.classList.contains('on')) return;
    if (V.factN >= (root.classList.contains('m') ? 2 : 4) || Date.now() - V.factLast < 20000) return;
    const t = target();
    if (!t || V.factSeen[t.k]) return;
    // No en todas las paradas: después de la primera, se saltea ~40%
    if (V.factN > 0 && Math.random() < 0.4) {
      V.factSeen[t.k] = 1;
      saveV();
      return;
    }
    V.factSeen[t.k] = 1;
    V.factN++;
    V.factLast = V.last = Date.now();
    saveV();
    aim(t.r.left + t.r.width / 2, t.r.top + t.r.height / 2);
    flash('ping', 1200);
    face('o', 500);
    const act = t.k.startsWith('p-') ? { t: D.projAct, h: t.k } : D.act[t.k];
    bubble(`<span class="dm__tag">${D.tag}</span>${pick(t.k)}`, act);
  }
  let stopT = 0;
  addEventListener(
    'scroll',
    () => {
      clearTimeout(stopT);
      stopT = window.setTimeout(onStop, 1300);
    },
    { passive: true }
  );
}
