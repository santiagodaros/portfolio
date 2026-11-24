// Contacto armado (mailto con campos para completar) y suscripción dentro del chat (Kit).
import { IDX, body, chips, dataFor, emit, esc, loadIdx, msg, root, UI, type Json } from './core';

let M: Json;
const contactLinks = 'https://www.linkedin.com/in/santiagodaros/';

/** El email no está en el HTML estático: el sitio lo arma en el cliente en los enlaces data-link="email". */
function emailAddress(): string {
  const a = document.querySelector<HTMLAnchorElement>('a[data-link="email"]');
  return a ? a.href.replace(/^mailto:/, '') : '';
}

export async function mailto(k: 'evento' | 'recruiter' | 'tecnica') {
  M ??= await dataFor('mails');
  const m = M[k];
  const to = emailAddress();
  const link = to ? `mailto:${to}?subject=${encodeURIComponent(m.s)}&body=${encodeURIComponent(m.b)}` : 'contacto';
  msg(UI.contact.ready);
  chips([{ t: UI.contact.open, href: link, go: 1 }, { t: UI.contact.linkedin, href: contactLinks }]);
}

/** Campo de email + "Suscribirme" dentro del chat. POST al formulario de Kit, con doble confirmación. */
export async function subscribeForm(lead?: string, source = 'chat') {
  const s = UI.sub;
  msg(lead || s.lead);
  const f = document.createElement('form');
  f.className = 'dm__sub';
  f.noValidate = true;
  f.innerHTML = `<input type="email" name="email_address" required placeholder="${esc(s.ph)}" aria-label="${esc(s.label)}" autocomplete="email"><button class="dm__chip go" type="submit">${s.btn}</button>`;
  body.appendChild(f);
  body.scrollTop = body.scrollHeight;
  const input = f.querySelector('input') as HTMLInputElement;
  const button = f.querySelector('button') as HTMLButtonElement;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.value || !input.checkValidity()) {
      msg(s.invalid);
      input.focus();
      return;
    }
    const endpoint = root.dataset.kit;
    if (!endpoint) {
      msg(s.disabled);
      return;
    }
    button.disabled = true;
    try {
      // Kit responde JSON con CORS abierto: { status: 'failed', errors: { fields: [...] } } si falla.
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.status !== 'failed') {
        f.remove();
        emit('daruma_subscribe', { source });
        await loadIdx().catch(() => null);
        const art = IDX?.articles.find((a) => a.id === 'art-rto');
        msg(s.ok);
        chips([{ t: art ? art.title.split(':')[0] : s.mostRead, href: 'art-rto', go: 1 }, { t: s.guide, href: 'guia-kql' }]);
      } else if (data?.errors?.fields?.includes('email_address')) {
        msg(s.invalid);
        input.focus();
        button.disabled = false;
      } else {
        msg(s.error);
        button.disabled = false;
      }
    } catch {
      msg(s.error);
      button.disabled = false;
    }
  });
}
