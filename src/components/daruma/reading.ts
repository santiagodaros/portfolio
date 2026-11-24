// Dentro de los artículos y los proyectos: aviso de contexto la primera vez, retomar la lectura donde quedó
// y una invitación a preguntar al terminar. El progreso se guarda por artículo en localStorage (dmRead-<slug>).
import { IDX, UI, V, bubble, body, curOverlay, isArticlePage, loadIdx, ls, msg, muted, onDialog, open, saveV } from './core';

const askAbout = async (text: string) => {
  const chat = await import('./chat');
  await chat.ready();
  body.innerHTML = '';
  msg(text);
  chat.suggest();
  open(); // con el cuerpo ya escrito, no se arma el menú de inicio
};

export async function initReading() {
  const r = UI.read;

  // Proyectos: aviso de contexto la primera vez que se abre cada modal
  onDialog((d, isOpen) => {
    if (!isOpen || !d.classList.contains('pmodal')) return;
    const key = 'ctx-' + d.id;
    if (V.seen[key] || muted) return;
    V.seen[key] = 1;
    saveV();
    setTimeout(() => d.open && bubble(r.ctxProject, { t: r.ask, fn: () => void askAbout(r.askProject) }), 1500);
  });

  if (!isArticlePage) return;
  const slug = location.pathname.replace(/\/+$/, '').split('/').pop() as string;
  const key = 'dmRead-' + slug;
  const idx = await loadIdx().catch(() => null);
  if (!idx) return;
  const id = curOverlay();

  const progress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? scrollY / max : 0;
  };
  // Guarda el avance (con pausa) para poder retomar
  let saveT = 0;
  addEventListener(
    'scroll',
    () => {
      clearTimeout(saveT);
      saveT = window.setTimeout(() => ls.set(key, progress().toFixed(2)), 300);
    },
    { passive: true }
  );

  // Al volver: entre 12% y 90% ofrece seguir donde dejó; si no, el aviso de contexto
  const p = +(ls.get(key) || 0);
  if (!muted) {
    if (p > 0.12 && p < 0.9) {
      if (id) V.seen['ctx-' + id] = 1;
      saveV();
      setTimeout(
        () =>
          bubble(r.resume.replace('{p}', String(Math.round(p * 100))), {
            t: r.resumeAct,
            fn: () => scrollTo({ top: p * (document.documentElement.scrollHeight - innerHeight), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }),
          }),
        900
      );
    } else if (id && !V.seen['ctx-' + id]) {
      V.seen['ctx-' + id] = 1;
      saveV();
      setTimeout(() => bubble(r.ctxArticle, { t: r.ask, fn: () => void askAbout(r.askArticle) }), 1500);
    }
  }

  // Al terminar (el pie del artículo a la vista): "¿Te quedó alguna duda?" + el siguiente recomendado
  const end = document.querySelector('.reader__end');
  if (end) {
    new IntersectionObserver(
      (es, io) =>
        es.forEach((e) => {
          if (!e.isIntersecting || V.seen['end-' + id] || muted) return;
          V.seen['end-' + id] = 1;
          saveV();
          io.disconnect();
          const next = IDX?.articles.find((a) => a.id === id)?.next;
          bubble(`<span class="dm__tag">${r.doneTag}</span>${r.done}${next ? r.next.replace('{t}', next.title.replace(/</g, '&lt;')) : ''}`, { t: r.ask, fn: () => void askAbout(r.doneAsk) });
        }),
      { threshold: 0.3 }
    ).observe(end);
  }
}
