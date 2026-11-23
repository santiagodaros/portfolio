// Textos del newsletter y de las páginas de gracias (ES/EN).
// Fuente: design/prototype/index.html (#newsletter y el script de suscripción).
// Marcados con "mío": textos que no estaban en el prototipo o que cambié (ver el PR).

import type { Lang } from './index';

const es = {
  eyebrow: 'Newsletter',
  // mío: el prototipo decía "Una decisión de Azure por semana"; sin frecuencia, según lo definido
  title: 'Un caso real de Azure por mail',
  text: 'Un caso real y la consulta o el script que lo resolvió.',
  label: 'Tu email de trabajo',
  placeholder: 'nombre@empresa.com',
  submit: 'Suscribirme',
  hint: 'Gratis. Te das de baja con un clic.',
  // mío
  sending: 'Enviando…',
  ok: 'Listo. Revisá tu correo para confirmar.',
  invalid: 'Revisá el email: parece incompleto.',
  error: 'No se pudo suscribir. Probá de nuevo en un minuto.',
  disabled: 'La suscripción se habilita cuando el sitio esté publicado.',
};

const en: typeof es = {
  eyebrow: 'Newsletter',
  // mío
  title: 'One real Azure case per email',
  text: 'A real case and the query or script that solved it.',
  label: 'Your work email',
  placeholder: 'name@company.com',
  submit: 'Subscribe',
  hint: 'Free. Unsubscribe in one click.',
  // mío
  sending: 'Sending…',
  ok: 'Done. Check your inbox to confirm.',
  invalid: 'Check the email: it looks incomplete.',
  error: 'Could not subscribe. Try again in a minute.',
  disabled: 'Sign-ups open when the site launches.',
};

export const newsletterText = { es, en };

// Página a la que Kit redirige cuando el suscriptor confirma desde el mail.
// Todo mío: la guía pide "mensaje corto, link al último artículo y al blog".
const thanksEs = {
  title: 'Listo, ya estás suscripto',
  text: 'Gracias por confirmar. Mientras tanto, podés leer el último artículo o recorrer el blog.',
  latest: 'Leer el último artículo',
  blog: 'Ver el blog',
  home: 'Volver al inicio',
};
const thanksEn: typeof thanksEs = {
  title: "Done, you're subscribed",
  text: "Thanks for confirming. In the meantime, you can read the latest article or browse the blog.",
  latest: 'Read the latest article',
  blog: 'See the blog',
  home: 'Back home',
};
export const thanksText: Record<Lang, typeof thanksEs> = { es: thanksEs, en: thanksEn };
