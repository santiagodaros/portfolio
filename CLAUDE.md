# Portfolio de Santiago Da Ros

Sitio personal en Astro 4 + MDX, desplegado en Vercel. El rediseño (terminado) se guió por `docs/REDISENO.md` y el prototipo `design/prototype/index.html`; Daruma, la guía del sitio, se especifica en `docs/DARUMA.md`.

## Reglas

- **Idioma:** textos de UI y commits en español rioplatense; el sitio tiene versión en inglés en `/en`.
- **Sin datos sensibles:** nunca nombres de clientes, IDs de tenant o suscripción, ni secretos en el repo. Los proyectos de Readymind se describen sin código ni datos de clientes.
- **Sin backend propio:** el sitio es estático. El newsletter usa Kit vía su endpoint público de formularios; `PUBLIC_KIT_FORM_ID` es la única variable.
- **Sin dependencias de más:** solo las necesarias (Geist, Vercel Analytics). Nada de UI kits ni state managers.
- **Contenido real:** no inventes artículos, métricas, charlas ni proyectos. Si falta un dato, preguntá.
- **Accesibilidad y movimiento:** foco visible, navegación por teclado y `prefers-reduced-motion` en toda animación.

## Estructura

- **Idioma por la URL:** `/` es español y `/en/` inglés. Los componentes reciben `lang` por props y leen los textos de `src/i18n/` (`home.ts`, `blog.ts`, `pages.ts`, `newsletter.ts`, `palette.ts`, `community.ts`). No hay toggle en el cliente.
- **Una página nueva con traducción:** crear las dos rutas, pasar `alternates={{ es, en }}` al `Layout` (da el `hreflang` y el botón de idioma) y sumar el par en `translated` de `astro.config.mjs` (sitemap). El `<main>` de cada página lleva `id="main" tabindex="-1"`: es el destino del enlace "Saltar al contenido" que pone el `Layout`.
- **Contenido:** `src/content/` (`blog`, `projects`, `linkedin`, `series`, `talks`, `contributions`). Los proyectos, los posts de LinkedIn y las charlas son un JSON por entrada (los proyectos y las charlas, uno por idioma); los artículos son MDX con `lang`, `translationKey` y `area`.
- **Comunidad:** el hub `/comunidad` (EN `/en/community`), los contadores de 12 meses, el CSV, la home, `/estado` y `/ahora` salen de `src/lib/contributions.ts`, que suma charlas (`talks`), artículos (`blog`), posts (`linkedin`) y lo cargado a mano en `contributions` (repos, recursos, foros, newsletter). Una contribución nueva es una entrada en la colección que corresponde (con su `area`); no hay que tocar ningún conteo. Las pestañas sin entradas no se muestran.
- **Charlas:** `src/content/talks/<id>.<lang>.json`. `status: upcoming` alimenta el hero, la home, `/ahora` y `/estado`. Si falta un dato (fecha, abstract), no se inventa: `datePrecision`/`dateNote` y el campo `todo`.
- **Perfiles y newsletter:** `src/data/profiles.ts` (un perfil con `url: null` no se muestra en ningún lado) y `src/data/newsletter.ts` (frecuencia; las ediciones públicas se cargan como contribuciones `newsletter`).
- **Daruma:** la guía del sitio. Sin IA, sin servidor y sin costo: todo corre en el navegador con lo ya publicado. El motor está en `src/components/daruma/` (el JS se carga en idle; chat, herramientas, entrevista, contacto y caos, recién al usarlos) y los textos en `src/data/daruma/<tema>.<lang>.json` (ver su `README.md`). El índice de proyectos, artículos, charlas y KQL se genera en el build (`/daruma-index.<lang>.json`, `src/lib/daruma-index.ts`); el objetivo del año sale de `getContributions()` y las metas, de `src/data/daruma/live.json`. Páginas: `/daruma` y `/en/daruma`.
- **Reglas de Daruma:** no tapa botones de acción; no le saca el foco al teclado (la bienvenida solo lo toma si nadie lo tiene); respeta `prefers-reduced-motion`; solo dice lo que el sitio ya publica (cada dato nuevo tiene que ser verificable). Lo que registra en la analítica pasa por `sanitize` (sin mails, links, teléfonos ni números largos). Las respuestas del modo entrevista son borradores hasta que Santiago las reescriba.
- **Estilos:** tokens y primitivas en `src/styles/global.css` (claro y `[data-theme="dark"]`); el resto es CSS dentro de cada componente. El reset está en `src/styles/reset.css` (no hay Tailwind). No envolver reglas en `@layer`: una capa nativa pierde contra el reset.
- **Colores:** `--accent` es para texto y gráficos; `--accent-fill` para rellenos con texto blanco encima (en oscuro son distintos para cumplir contraste AA).
- **Variables:** `PUBLIC_KIT_FORM_ID` (ver `.env.example`; copiarlo a `.env`). Sin ella el formulario del newsletter queda deshabilitado.

## Despliegue

- Vercel despliega `main`; cada PR genera un preview protegido por login. `vercel.json` tiene los redirects (`/articulos` pasa a la pestaña Artículos del hub) y el `Content-Type` de los `.kql`.
- Los contadores de "últimos 12 meses" (`/comunidad`, `/estado`, Daruma) se calculan **al construir**. Por eso hay una reconstrucción semanal: `.github/workflows/rebuild-semanal.yml` dispara un Deploy Hook de Vercel los lunes (también se puede correr a mano desde Actions).
- Configuración única del rebuild: en Vercel, Settings > Git > Deploy Hooks, crear un hook para `main`; en GitHub, Settings > Secrets and variables > Actions, guardar su URL como `VERCEL_DEPLOY_HOOK_URL`. Sin ese secreto el workflow avisa y termina sin error. GitHub pausa los workflows programados tras 60 días sin actividad en el repositorio.

## Comandos

| Para | Comando |
|---|---|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |

Antes de cada PR: `npm run build` sin errores y revisar el diff en busca de datos sensibles.

## Flujo

- Una rama por cambio (`feat/<tema>`, `fix/<tema>`, `chore/<tema>`) y un PR a `main`; no se pushea directo a `main`.
- Cada PR: `npm run build` sin errores, el diff revisado en busca de datos sensibles y, si cambia algo visible, capturas en claro y oscuro, escritorio y celular. Probar también a distintos anchos (de 320 a 2560 px) y con el teclado.
- Se mergea cuando Santiago lo aprueba.
