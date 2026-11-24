// Chat sin IA: entiende tema (proyecto, concepto, artículo, perfil) y pregunta (stack, problema, idea,
// resultado, rol), responde con lo publicado en el sitio y, si no sabe, lo dice. Incluye comandos, búsqueda en
// todo el contenido, sugerencias mientras se escribe y "¿Te sirvió?". Las herramientas pesadas se cargan al usarlas.
import { IDX, RM, UI, V, askForm, body, chips, close, curOverlay, dataFor, emit, esc, face, flash, hooks, loadIdx, msg, root, saveV, typing, sanitize, href, type Chip, type Json } from './core';
import { any, lev, norm } from './text';
import { hold, release } from './physics';
import { startMini, startTour } from './tour';

type Proj = { id: string; title: string; lead: string; kpis: string[]; stack: string[]; sec: Record<string, string> };
type Item = { t: string; k: string; h: string; n: string; ext?: boolean; kt?: string };

let G: Json;
let P: Json;
let KB: Record<string, Proj> = {};
let ctx: string | null = null;
let SUG: string[][] = [];
let SEARCH: Item[] = [];
let readyP: Promise<void> | null = null;

const tools = () => import('./tools');
const contact = () => import('./contact');
const interviewMod = () => import('./interview');
const chaosMod = () => import('./chaos');

const rx: Record<string, RegExp> = {};
const re = (k: string) => (rx[k] ||= new RegExp(P.intents[k]));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clean = (raw: string) => sanitize(raw).toLowerCase().replace(/\s+/g, ' ').trim();

/** Carga el índice, el glosario y el perfil, y arma lo que se deriva de ellos (una sola vez). */
export function ready(): Promise<void> {
  readyP ||= (async () => {
    const [idx, g, p] = await Promise.all([loadIdx(), dataFor('glossary'), dataFor('profile')]);
    G = g;
    P = p;
    KB = Object.fromEntries(idx.projects.map((x) => [x.id, x]));
    buildSearch();
    buildSuggestions();
    bindSuggestions();
  })();
  readyP.catch(() => {
    readyP = null;
  });
  return readyP;
}

/* ───────── menú principal ───────── */
export function home() {
  const h = UI.home;
  const o: Chip[] = [
    { t: h.tour, fn: () => { close(); void startTour(); }, go: 1 },
    { t: h.event, fn: () => { emit('daruma_intent', { profile: 'evento' }); R.evento(); } },
    { t: h.profile, fn: () => { emit('daruma_intent', { profile: 'perfil' }); R.perfil(); } },
    { t: h.dr, fn: () => { emit('daruma_intent', { profile: 'dr' }); R.dr(); } },
    { t: h.read, fn: () => { emit('daruma_intent', { profile: 'leer' }); R.leer(); } },
    { t: h.tools, fn: () => R.tools() },
    { t: h.eyes, fn: () => R.ojos() },
    { t: h.fall, fn: () => R.caida() },
  ];
  msg(h.intro);
  chips(o);
}
hooks.home = () => {
  ready().then(home, () => msg(UI.errors.data));
};

export const R = {
  evento() {
    close();
    void startMini('evento');
  },
  dr() {
    close();
    void startMini('dr');
  },
  leer() {
    close();
    void startMini('leer');
  },
  perfil() {
    const r = UI.r;
    msg(r.profile);
    chips([
      { t: r.interviewMode, fn: () => void interviewMod().then((m) => m.interview()), go: 1 },
      { t: r.cv, href: 'cv', dl: 1 },
      { t: r.projects, href: 'proyectos' },
      { t: r.mail, fn: () => void contact().then((m) => m.mailto('recruiter')) },
    ]);
  },
  ojos() {
    const r = UI.r;
    const g = IDX!.goal;
    msg(r.eyes.replace('{pct}', String(g.pct)) + goalHTML());
    chips([{ t: r.know, href: 'daruma', go: 1 }, { t: r.talks, href: 'charlas' }, { t: UI.home.menu, fn: home }]);
  },
  tools() {
    const r = UI.r;
    msg(r.toolsIntro);
    chips([
      { t: r.toolCost, fn: () => void tools().then((m) => m.calcCost()) },
      { t: r.toolRpo, fn: () => void tools().then((m) => m.calcRpo()) },
      { t: r.toolKql, fn: () => void tools().then((m) => m.kql('')) },
      { t: UI.home.menu, fn: home },
    ]);
  },
  caida() {
    fall();
  },
};

function goalHTML() {
  const g = IDX!.goal;
  const row = (label: string, d: { done: number; goal: number }) =>
    `<div class="dm__goal-row"><span>${label}</span><b>${UI.r.goalOf.replace('{a}', d.done).replace('{b}', d.goal)}</b></div><div class="dm__bar"><i style="width:${(d.done / d.goal) * 100}%"></i></div>`;
  return row(UI.r.goalTalks, g.talks) + row(UI.r.goalArticles, g.articles);
}

/** "Tirame abajo": se cae, registra el incidente y se levanta (y simula la caída de la home si está). */
function fall() {
  const r = UI.r;
  V.falls++;
  saveV();
  if (!RM) hold(86);
  root.classList.add('surprised');
  face('o');
  const log = document.createElement('div');
  log.className = 'dm__log';
  body.appendChild(log);
  body.scrollTop = body.scrollHeight;
  [0, 600, 1200, 1900].forEach((t, i) =>
    setTimeout(() => {
      log.innerHTML += r.fallLog[i] + '<br>';
      body.scrollTop = body.scrollHeight;
    }, t)
  );
  (document.querySelector('.pulse__btn') as HTMLButtonElement | null)?.click();
  setTimeout(() => {
    release(-4);
    root.classList.remove('surprised');
    face('big', 1800);
    flash('beat', 1150);
  }, 1800);
  setTimeout(() => {
    msg(r.fallAfter.replace('{f}', String(V.falls)).replace('{u}', String(V.falls + 1)));
    chips([{ t: r.fallSee, href: 'p-failover', go: 1 }, { t: r.fallAgain, fn: fall }, { t: UI.home.menu, fn: home }]);
  }, 2900);
}

/* ───────── proyectos: salen del índice generado en el build ───────── */
const ATTR_KEY: Record<string, string> = { problema: 'problem', idea: 'idea', resultado: 'change', rol: 'role' };
function attrOf(q: string): string | null {
  for (const k in P.attr) if (any(q, P.attr[k])) return k;
  return null;
}
function projAnswer(p: Proj, attr: string | null) {
  const c = UI.chat;
  const T = esc(p.title);
  if (attr === 'stack') return p.stack.length ? c.stackFor.replace('{t}', T).replace('{list}', esc(p.stack.join(', ')).replace(/, ([^,]*)$/, c.and + '$1')) : c.stackNone.replace('{t}', T);
  const x = attr && p.sec[ATTR_KEY[attr]];
  if (attr && x) return attr === 'rol' ? c.roleOf.replace('{t}', T).replace('{x}', esc(x)) : `<b>${T}</b>. ${esc(x)}`;
  return `<b>${T}</b>: ${esc(p.lead)}` + (p.kpis.length ? ` <span class="dm__src">${p.kpis.map(esc).join(' · ')}</span>` : '');
}
function projChips(p: Proj, except?: string | null): Chip[] {
  const c = UI.chat;
  const o: Chip[] = [];
  ([['stack', c.chipStack], ['problema', c.chipProblem], ['resultado', c.chipChange], ['rol', c.chipRole]] as const).forEach(([k, t]) => {
    if (k !== except) o.push({ t, fn: () => void reply(t) });
  });
  o.push({ t: c.viewProject, href: p.id, go: 1 });
  return o;
}

/** Sección del artículo donde se desarrolla un término. */
function artSection(id: string, term: string): string | null {
  const a = IDX!.articles.find((x) => x.id === id);
  if (!a) return null;
  const n = norm(term);
  return a.sections.find((s) => norm(s.h + ' ' + s.text).indexOf(n) > -1)?.h ?? null;
}

/* ───────── respuesta ───────── */
/** Responde por tema y pregunta. Devuelve false si no tiene respuesta. */
function base(q: string): boolean {
  const c = UI.chat;
  if (re('hello').test(q) && q.split(' ').length <= 3) {
    msg(c.hello);
    suggest();
    return true;
  }
  if (re('thanks').test(q) && q.split(' ').length <= 3) {
    msg(c.thanks);
    chips([{ t: c.subscribe, href: 'newsletter' }]);
    return true;
  }
  let pid: string | null = null;
  for (const id in P.projAlias) {
    if (KB[id] && any(q, P.projAlias[id].concat([KB[id].title]))) {
      pid = id;
      break;
    }
  }
  const attr = attrOf(q);
  const ov = curOverlay();
  let g: Json = null;
  for (const e of G.entries) {
    if (any(q, e.k)) {
      g = e;
      break;
    }
  }
  const conceptual = re('conceptual').test(q);

  // Artículo: de qué trata
  for (const aid in G.articles) {
    if (any(q, G.articles[aid].k) && !g) {
      const a = IDX!.articles.find((x) => x.id === aid);
      msg(c.articleOf.replace('{t}', esc(G.articles[aid].t)).replace('{lead}', esc(a ? a.lead : '')));
      chips([{ t: c.readArticle, href: aid, go: 1 }]);
      return true;
    }
  }
  // Concepto del glosario
  if (g && (conceptual || !pid)) {
    let extra = '';
    const o: Chip[] = [];
    const inArt = ov && ov.indexOf('art-') === 0 ? ov : g.art;
    const sec = inArt ? artSection(inArt, g.k[0]) : null;
    if (sec) extra = `<span class="dm__src">${c.inSection.replace('{s}', esc(sec))}</span>`;
    if (g.art && ov !== g.art) o.push({ t: c.readArticle, href: g.art, go: 1 });
    if (g.proj && KB[g.proj]) {
      const pj = KB[g.proj];
      o.push({
        t: c.howApplied.replace('{t}', pj.title),
        fn: () => {
          ctx = pj.id;
          msg(projAnswer(pj, null));
          chips(projChips(pj));
        },
      });
    }
    if (g.href) o.push({ t: g.ht, href: g.href, go: o.length ? undefined : 1 });
    msg(g.a + extra);
    if (o.length) chips(o);
    return true;
  }
  // Perfil con nombre propio: gana sobre el contexto del proyecto
  if (!pid) {
    for (const e of P.entries) {
      if (any(q, e.k) && (!attr || e.s)) {
        profileAnswer(e);
        return true;
      }
    }
  }
  // Seguimiento: "¿y qué stack usó?" / "¿y su rol?"
  if (!pid && attr && (ctx || (ov && KB[ov]))) pid = ov && KB[ov] ? ov : ctx;
  if (pid) {
    ctx = pid;
    msg(projAnswer(KB[pid], attr));
    chips(projChips(KB[pid], attr));
    return true;
  }
  for (const e of P.entries) {
    if (any(q, e.k)) {
      profileAnswer(e);
      return true;
    }
  }
  if (attr === 'stack') {
    msg(c.stackGeneral);
    chips(['p-portal', 'p-failover', 'p-gobernanza'].filter((x) => KB[x]).map((x) => ({ t: KB[x].title, fn: () => void reply(c.stackQ.replace('{t}', KB[x].title)) })));
    return true;
  }
  return false;
}

type Entry = { a: string; c?: Array<{ t: string; href?: string; dl?: 1; go?: 1; act?: string }> };
function profileAnswer(e: Entry) {
  msg(e.a);
  if (e.c)
    chips(
      e.c.map((x) => ({
        t: x.t,
        href: x.href,
        dl: x.dl,
        go: x.go,
        fn: x.act === 'tour' ? () => { close(); void startTour(); } : undefined,
      }))
    );
}

async function answer(q: string, raw: string) {
  if (!q) return;
  const c = UI.chat;
  const r = raw.trim();

  // Suscripción
  if (re('subscribe').test(q)) {
    (await contact()).subscribeForm();
    return;
  }
  // Búsqueda explícita: "¿escribiste algo sobre X?"
  const m = q.match(re('search'));
  if (m) {
    const rs = search(m[3]);
    emit('daruma_search', { q: clean(raw), hits: rs.length });
    if (rs.length) {
      showResults(rs, m[3]);
      return feedback(raw);
    }
  }
  // Comandos
  if (r[0] === '/') {
    const parts = norm(r.slice(1)).split(' ');
    const cmd = parts.shift() as string;
    const arg = parts.join(' ');
    const is = (k: string) => P.intents.cmd[k].split(' ').indexOf(cmd) > -1;
    emit('daruma_question', { q: clean(raw) });
    if (is('kql')) return void (await tools()).kql(arg);
    if (is('cost')) return void (await tools()).calcCost();
    if (is('rpo')) return void (await tools()).calcRpo();
    if (is('chaos')) return void (await chaosMod()).chaos();
    if (is('interview')) return void (await interviewMod()).interview();
    if (is('tour')) {
      close();
      return void startTour();
    }
    msg(c.cmds);
    return;
  }
  // Intenciones en lenguaje natural
  const nat = async () => {
    if (re('interview').test(q)) return (await interviewMod()).interview(), true;
    if (re('kql').test(q) && !re('kqlNot').test(q)) {
      const t = q.replace(re('kqlStrip'), '').trim();
      if (t || !re('kqlNot').test(q)) return (await tools()).kql(t), true;
    }
    if (re('cost').test(q)) return (await tools()).calcCost(), true;
    if (re('rpo').test(q)) return (await tools()).calcRpo(), true;
    if (re('chaos').test(q)) return (await chaosMod()).chaos(), true;
    if (re('help').test(q)) {
      msg(c.help);
      chips([{ t: c.helpTools, fn: R.tools }, { t: c.helpHow, href: 'daruma' }]);
      return true;
    }
    if (re('mail').test(q) && re('mailVerb').test(q)) {
      (await contact()).mailto(re('mailEvent').test(q) ? 'evento' : re('mailTech').test(q) ? 'tecnica' : 'recruiter');
      return true;
    }
    return false;
  };
  let done = await nat();
  if (!done) done = base(q);
  if (!done) {
    // Antes de rendirse, buscar en todo el contenido
    const rs = search(q);
    if (rs.length) {
      showResults(rs, raw);
      emit('daruma_search', { q: clean(raw), hits: rs.length });
    } else {
      miss.push(clean(raw));
      emit('daruma_miss', { q: clean(raw) });
      msg(c.miss);
      chips([...c.missChips.map((t: string) => ({ t, fn: () => void reply(t) })), { t: c.writeHim, href: 'contacto' }]);
    }
  }
  emit('daruma_question', { q: clean(raw) });
  const last = body.lastElementChild;
  if (last && !last.classList.contains('dm__form') && !last.classList.contains('dm__sub')) feedback(raw);
}
export const miss: string[] = [];

export async function reply(raw: string) {
  const t = typing();
  face('o');
  try {
    await ready();
    await sleep(450 + Math.min(raw.length * 12, 500));
    t.remove();
    face('smile');
    await answer(norm(raw), raw);
  } catch {
    // Índice sin red o un chunk viejo tras un deploy: se avisa en vez de quedar en silencio
    t.remove();
    face('smile');
    msg(UI.errors.data);
  }
}

/* ───────── búsqueda en todo el contenido ───────── */
function buildSearch() {
  const idx = IDX!;
  const add = (t: string, k: string, h: string, extra = '', ext = false, kt = '') => SEARCH.push({ t: t.trim(), k, h, n: norm(t + ' ' + extra), ext, kt });
  idx.articles.forEach((a) => {
    add(a.title, 'article', a.href, a.lead);
    a.sections.forEach((s) => add(s.h, 'section', a.href, '', false, a.title));
  });
  idx.posts.forEach((p) => add(p.t, 'post', p.href, p.tag + ' ' + p.summary, true));
  idx.talks.forEach((t) => add(t.t, 'talk', t.url, t.text + ' ' + t.tags.join(' ')));
  idx.kql.forEach((q) => add(q.t, 'kql', href('guia-kql'), q.desc + ' ' + q.code));
  idx.projects.forEach((p) => add(p.title, 'project', href(p.id), p.lead + ' ' + p.stack.join(' ')));
}
function search(q: string): Item[] {
  const stop = P.intents.stop as string;
  const toks = norm(q).split(' ').filter((w) => w.length > 2 && stop.indexOf(' ' + w + ' ') < 0);
  if (!toks.length) return [];
  const res = SEARCH.map((it) => {
    let sc = 0;
    const tn = ' ' + norm(it.t);
    const an = ' ' + it.n;
    toks.forEach((w) => {
      // Palabra al inicio de una palabra del título = 3; en el resto del texto = 1; con un error de tipeo = 1
      if (an.indexOf(' ' + w) > -1) sc += tn.indexOf(' ' + w) > -1 ? 3 : 1;
      else if (w.length >= 5 && it.n.split(' ').some((x) => lev(x, w) <= 1)) sc += 1;
    });
    return { it, sc };
  })
    .filter((r) => r.sc > 0)
    .sort((a, b) => b.sc - a.sc);
  if (!res.length) return [];
  const top = res[0].sc;
  return res.filter((r) => r.sc >= Math.max(1, top * 0.6)).slice(0, 3).map((r) => r.it);
}
function showResults(rs: Item[], q: string) {
  const kinds = UI.chat.kinds;
  msg(UI.chat.found.replace('{q}', esc(q)));
  const w = document.createElement('div');
  w.className = 'dm__results';
  rs.forEach((r) => {
    const a = document.createElement('a');
    a.href = r.h;
    if (r.ext) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    const label = r.k === 'section' ? kinds.section.replace('{t}', esc(r.kt || '')) : kinds[r.k];
    a.innerHTML = `<small>${label}</small>${esc(r.t)}`;
    a.addEventListener('click', () => {
      emit('daruma_result_click', { kind: r.k });
      if (!r.ext) close();
    });
    w.appendChild(a);
  });
  body.appendChild(w);
  body.scrollTop = body.scrollHeight;
}

/* ───────── ¿te sirvió? ───────── */
function feedback(q: string) {
  const c = UI.chat;
  const d = document.createElement('div');
  d.className = 'dm__fb';
  d.innerHTML = `<span>${c.fb}</span><button type="button" data-v="1" aria-label="${c.yes}">👍</button><button type="button" data-v="0" aria-label="${c.no}">👎</button>`;
  d.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    d.classList.add('done');
    const ok = b.dataset.v === '1';
    emit('daruma_feedback', { q: clean(q), ok });
    (d.querySelector('span') as HTMLElement).textContent = ok ? c.fbYes : c.fbNo;
    if (!ok) chips([{ t: c.fbAsk, fn: () => void contact().then((m) => m.mailto('tecnica')) }, { t: c.fbBlog, href: 'blog' }]);
  });
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
}

/* ───────── sugerencias de preguntas ───────── */
export function suggest() {
  const ov = curOverlay();
  const s = UI.chat.suggest;
  const list: string[] = ov === 'art-rto' ? s.rto : ov === 'art-archivo' ? s.archivo : ov && KB[ov] ? s.project : s.default;
  if (ov && KB[ov]) ctx = ov;
  chips(list.map((t) => ({ t, fn: () => void reply(t) })));
}
function buildSuggestions() {
  const S = UI.sug;
  SUG = [];
  Object.values(KB).forEach((p) => {
    SUG.push([S.projTech.replace('{t}', p.title), 'proyecto'], [S.projProblem.replace('{t}', p.title), 'proyecto'], [S.projRole.replace('{t}', p.title), 'proyecto']);
  });
  G.entries.forEach((g: Json) => {
    const k = g.k[0];
    SUG.push([/diferencia|vs|y rto|and rto/.test(k) ? S.diff : S.what.replace('{x}', k.length < 5 ? k.toUpperCase() : k), 'concepto']);
  });
  S.extra.forEach((x: string[]) => SUG.push(x));
}
let bound = false;
function bindSuggestions() {
  if (bound) return;
  bound = true;
  const input = askForm.querySelector('input') as HTMLInputElement;
  const sug = document.getElementById('dmSug') as HTMLDivElement;
  let sel = -1;
  let cur: string[][] = [];
  const hide = () => sug.classList.remove('on');
  const pick = (i: number) => {
    input.value = cur[i][0];
    hide();
    askForm.requestSubmit();
  };
  input.addEventListener('input', () => {
    const v = norm(input.value);
    if (v.length < 2) {
      cur = [];
      return hide();
    }
    const toks = v.split(' ');
    cur = SUG.filter((s) => {
      const n = norm(s[0]);
      return toks.every((t) => n.indexOf(t) > -1);
    }).slice(0, 4);
    sel = -1;
    if (!cur.length) return hide();
    sug.innerHTML = cur.map((s, i) => `<button type="button" role="option" data-i="${i}">${esc(s[0])}<small>${UI.sug.kinds[s[1]] || s[1]}</small></button>`).join('');
    sug.classList.add('on');
  });
  input.addEventListener('keydown', (e) => {
    if (!sug.classList.contains('on')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + cur.length) % cur.length;
      [].forEach.call(sug.children, (b: HTMLElement, i: number) => b.classList.toggle('sel', i === sel));
    } else if (e.key === 'Enter' && sel > -1) {
      e.preventDefault();
      pick(sel);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      hide();
    }
  });
  sug.addEventListener('mousedown', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) {
      e.preventDefault();
      pick(+(b.dataset.i as string));
    }
  });
  askForm.addEventListener('submit', hide);
}

