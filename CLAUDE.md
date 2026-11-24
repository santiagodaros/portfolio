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
- **Contenido:** `src/content/` (`blog`, `projects`, `linkedin`, `series`). Los proyectos y los posts de LinkedIn son un JSON por entrada; los artículos son MDX con `lang` y `translationKey`.
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
