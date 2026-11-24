// Herramientas de DR (se cargan al usarlas): costo de una caída, RPO real y consultas KQL de la guía.
import { IDX, body, chips, dataFor, emit, esc, lang, loadIdx, msg, type Chip, type Json } from './core';
import { norm } from './text';

let D: Json;
const load = async () => (D ??= await dataFor('tools'));
const contact = () => import('./contact');

const money = (n: number) => `${D.money} ${Math.round(n).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')}`;

function form(html: string, onSubmit: (f: HTMLFormElement) => void) {
  const f = document.createElement('form');
  f.className = 'dm__form';
  f.innerHTML = `${html}<button class="dm__chip go" type="submit" style="justify-self:start">${D.cost.btn}</button>`;
  body.appendChild(f);
  body.scrollTop = body.scrollHeight;
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmit(f);
    (f.querySelector('button') as HTMLButtonElement).disabled = true;
  });
}

/** Ingreso por hora × RTO, más el ahorro si se baja el RTO a la mitad (estimación lineal). */
export async function calcCost() {
  await load();
  emit('daruma_tool', { tool: 'costo' });
  const c = D.cost;
  msg(c.intro);
  form(
    `<label>${c.rev}<input name="r" type="number" min="0" step="100" value="10000" required></label><label>${c.rto}<input name="h" type="number" min="0.25" step="0.25" value="4" required></label>`,
    (f) => {
      const r = +(f.elements.namedItem('r') as HTMLInputElement).value;
      const h = +(f.elements.namedItem('h') as HTMLInputElement).value;
      const cost = r * h;
      msg(c.result.replace('{h}', String(h)).replace('{c}', money(cost)).replace('{s}', money(cost / 2)));
      chips([
        { t: c.readRto, href: 'art-rto', go: 1 },
        { t: c.calcRpo, fn: calcRpo },
        { t: c.mail, fn: () => void contact().then((m) => m.subscribeForm(undefined, 'tool')) },
      ]);
    }
  );
}

/** RPO = frecuencia del backup (el doble si no se verifica). RTO: desconocido, desactualizado o medido. */
export async function calcRpo() {
  await load();
  await loadIdx().catch(() => null);
  emit('daruma_tool', { tool: 'rpo' });
  const c = D.rpo;
  const sel = (name: string, q: string, o: string[][]) => `<label>${q}<select name="${name}">${o.map((x) => `<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label>`;
  msg(c.intro);
  form(sel('f', c.q1, c.q1o) + sel('t', c.q2, c.q2o) + sel('v', c.q3, c.q3o), (f) => {
    const val = (n: string) => (f.elements.namedItem(n) as HTMLSelectElement).value;
    const fr = +val('f');
    const t = val('t');
    const v = val('v');
    const rpo = v === 'n' ? fr * 2 : fr;
    const rp = rpo < 1 ? c.minutes : c.upTo.replace('{h}', String(rpo));
    const rto = t === 'n' ? c.rtoNone : t === 'v' ? c.rtoOld : c.rtoOk;
    const art = IDX?.articles.find((a) => a.id === 'art-rto');
    const src = art
      ? c.source.replace('{t}', esc(art.title.split(':')[0])).replace('{d}', new Date(art.date + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }))
      : '';
    msg(c.result.replace('{rp}', rp).replace('{why}', v === 'n' ? c.why : '').replace('{rto}', rto) + src);
    chips([
      { t: c.readArticle, href: 'art-rto', go: 1 },
      { t: c.calcCost, fn: calcCost },
      { t: c.mail, fn: () => void contact().then((m) => m.subscribeForm(undefined, 'tool')) },
    ]);
  });
}

/** Consulta de la guía KQL, lista para copiar. */
export async function kql(term: string) {
  await load();
  const idx = await loadIdx();
  const profile = await dataFor('profile');
  emit('daruma_tool', { tool: 'kql' });
  const k = D.kql;
  const list = idx.kql;
  const q = norm(term);
  const show = (x: { t: string; code: string }) => {
    msg(`<b>${esc(x.t)}</b>${k.source.replace('{t}', esc(idx.guideTitle))}`);
    const pre = document.createElement('pre');
    pre.className = 'dm__code';
    pre.textContent = x.code;
    const b = document.createElement('button');
    b.className = 'dm__copy';
    b.type = 'button';
    b.textContent = k.copy;
    b.onclick = () => {
      navigator.clipboard.writeText(x.code).then(
        () => (b.textContent = k.copied),
        () => (b.textContent = k.copyFail)
      );
    };
    pre.prepend(b);
    body.appendChild(pre);
    body.scrollTop = body.scrollHeight;
    chips([{ t: k.other, fn: () => void kql('') }, { t: k.guideFull, href: 'guia-kql' }]);
  };
  if (!q) {
    msg(k.intro);
    const o: Chip[] = list.slice(0, 6).map((x) => ({ t: x.t, fn: () => show(x) }));
    o.push({ t: k.guide, href: 'guia-kql' });
    return chips(o);
  }
  const key = (profile.kqlSyn as Record<string, string>)[q.split(' ')[0]] || q;
  const hit = list.filter((x) => norm(x.t).indexOf(key) > -1)[0];
  if (hit) return show(hit);
  msg(k.notFound.replace('{q}', esc(term)));
  return kql('');
}
