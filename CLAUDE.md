# Portfolio de Santiago Da Ros

Sitio personal en Astro 4 + MDX, desplegado en Vercel. El rediseño se guía por `docs/REDISENO.md` y el prototipo `design/prototype/index.html`.

## Reglas

- **Idioma:** textos de UI y commits en español rioplatense; el sitio tiene versión en inglés en `/en`.
- **Sin datos sensibles:** nunca nombres de clientes, IDs de tenant o suscripción, ni secretos en el repo. Los proyectos de Readymind se describen sin código ni datos de clientes.
- **Sin backend propio:** el sitio es estático. El newsletter usa Kit vía su endpoint público de formularios; `PUBLIC_KIT_FORM_ID` es la única variable.
- **Sin dependencias de más:** solo las necesarias (Geist, Vercel Analytics). Nada de UI kits ni state managers.
- **Contenido real:** no inventes artículos, métricas, charlas ni proyectos. Si falta un dato, preguntá.
- **Accesibilidad y movimiento:** foco visible, navegación por teclado y `prefers-reduced-motion` en toda animación.

## Estructura

- **Idioma por la URL:** `/` es español y `/en/` inglés. Los componentes reciben `lang` por props y leen los textos de `src/i18n/` (`home.ts`, `blog.ts`, `pages.ts`, `newsletter.ts`, `palette.ts`). No hay toggle en el cliente.
- **Una página nueva con traducción:** crear las dos rutas, pasar `alternates={{ es, en }}` al `Layout` (da el `hreflang` y el botón de idioma) y sumar el par en `translated` de `astro.config.mjs` (sitemap). El `<main>` de cada página lleva `id="main" tabindex="-1"`: es el destino del enlace "Saltar al contenido" que pone el `Layout`.
- **Contenido:** `src/content/` (`blog`, `projects`, `linkedin`, `series`, `talks`, `contributions`). Los proyectos, los posts de LinkedIn y las charlas son un JSON por entrada (los proyectos y las charlas, uno por idioma); los artículos son MDX con `lang`, `translationKey` y `area`.
- **Comunidad:** el hub `/comunidad` (EN `/en/community`), los contadores de 12 meses, el CSV, la home, `/estado` y `/ahora` salen de `src/lib/contributions.ts`, que suma charlas (`talks`), artículos (`blog`), posts (`linkedin`) y lo cargado a mano en `contributions` (repos, recursos, foros, newsletter). Una contribución nueva es una entrada en la colección que corresponde (con su `area`); no hay que tocar ningún conteo. Las pestañas sin entradas no se muestran.
- **Charlas:** `src/content/talks/<id>.<lang>.json`. `status: upcoming` alimenta el hero, la home, `/ahora` y `/estado`. Si falta un dato (fecha, abstract), no se inventa: `datePrecision`/`dateNote` y el campo `todo`.
- **Perfiles y newsletter:** `src/data/profiles.ts` (un perfil con `url: null` no se muestra en ningún lado) y `src/data/newsletter.ts` (frecuencia; las ediciones públicas se cargan como contribuciones `newsletter`).
- **Estilos:** tokens y primitivas en `src/styles/global.css` (claro y `[data-theme="dark"]`); el resto es CSS dentro de cada componente. El reset está en `src/styles/reset.css` (no hay Tailwind). No envolver reglas en `@layer`: una capa nativa pierde contra el reset.
- **Colores:** `--accent` es para texto y gráficos; `--accent-fill` para rellenos con texto blanco encima (en oscuro son distintos para cumplir contraste AA).
- **Variables:** `PUBLIC_KIT_FORM_ID` (ver `.env.example`; copiarlo a `.env`). Sin ella el formulario del newsletter queda deshabilitado.

## Comandos

| Para | Comando |
|---|---|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |

Antes de cada PR: `npm run build` sin errores y revisar el diff en busca de datos sensibles.

## Flujo

- Una rama por fase: `feat/rediseno-<fase>`.
- Un PR por fase, con capturas en claro y oscuro, escritorio y celular.
