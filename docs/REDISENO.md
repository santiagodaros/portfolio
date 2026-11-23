# Rediseño del portfolio — guía de migración

Esta guía lleva el prototipo de `design/prototype/` al sitio Astro existente. El prototipo es la **fuente de verdad visual y de contenido**. La infraestructura actual del repo (Astro 4, content collections, MDX, RSS, sitemap, OG y rutas `/en`) se mantiene.

## 1. Cómo usar el prototipo

- Abrí `design/prototype/index.html` en el navegador: es una sola página con todo el CSS y el JS inline.
- Tokens, componentes, textos en español, traducciones al inglés (objeto `EN` dentro del `<script>`) y comportamientos salen de ahí.
- No copies el HTML tal cual a una sola página Astro. Partilo en componentes (sección 4) y pasá los "readers" con hash (`#ahora`, `#speaker`, `#estado-carrera`, `#articulos`, `#art-*`) a rutas reales.

## 2. Identidad visual

| Token | Claro | Oscuro |
|---|---|---|
| `--bg` | `#eef0f3` | `#0b0c0e` |
| `--surface` | `#e2e5ea` | `#141518` |
| `--card` | `#ffffff` | `#1a1c20` |
| `--ink` | `#0b0c0e` | `#eef0f3` |
| `--muted` | `#5d6470` | `#9aa0a8` |
| `--accent` (cobalto) | `#1f2de6` | `#5b67ff` |
| `--tonal` | `#dfe2fb` | `rgb(255 255 255 / .08)` |

- **Tipografía:** Geist para display y texto, Geist Mono para etiquetas y datos. Paquetes: `@fontsource-variable/geist` y `@fontsource-variable/geist-mono`. Reemplazan a Newsreader y JetBrains Mono.
- **Escala tipográfica:** 68 / 48 / 28 / 21 px (variables `--t1`…`--t4`, con reducción en tablet y celular).
- **Logo:** círculo abierto (cloud) + cuadrado sólido (producto). Es el `<symbol id="sdr">` del prototipo. Hay que generar `favicon.svg` y `favicon.png` nuevos con el mismo dibujo (el favicon del prototipo está como data URI en el `<head>`).
- **Frase:** "De cloud al producto" / "From cloud to product".
- **Fotos:** radio de 24 px y degradé cobalto en el tercio inferior.

## 3. Estrategia de estilos

El repo usa Tailwind. Para no perder fidelidad:

1. Pasá los tokens a `src/styles/global.css` como variables CSS (claro y `[data-theme="dark"]`).
2. Mapealos en `tailwind.config.mjs` (`colors.accent = 'var(--accent)'`, etc.).
3. Los componentes con mucho CSS propio (flow del portal, modales, pulse, paleta de comandos) pueden quedar con su CSS del prototipo en un `<style>` del componente.

## 4. Componentes y rutas

| Prototipo | Destino en Astro |
|---|---|
| Nav (4 links, buscar, EN/ES, tema, "Escribime", menú móvil) | `src/components/Nav.astro` (reemplazar) |
| Hero + foto + leyenda | `Hero.astro` |
| Banda de latido + "Simular una caída" + barra de incidente | `Pulse.astro` (nuevo, isla JS) |
| Proyectos: tarjeta destacada con esquema animado + mosaico | `Projects.astro` + `ProjectCard.astro` + `PortalFlow.astro` |
| Modal centrado de cada proyecto | `ProjectModal.astro` (`<dialog>` nativo, sin scroll, conserva la posición al cerrar) |
| Cómo trabajo (3 pilares) | `HowIWork.astro` |
| Experiencias (Belo Business) | `Experience.astro` (reemplazar el actual) |
| Stack + certificaciones con insignias y links de Learn | `Skills.astro` (reemplazar) |
| Blog en la home | `Articles.astro` (adaptar: destacado + lista) |
| Charlas (2, con portada y link a YouTube) | `Talks.astro` |
| Newsletter (Kit) | `NewsletterCTA.astro` (conectar, sección 6) |
| Sobre mí + línea de tiempo + CV | `About.astro` (reemplazar) |
| Cierre "¿Hablamos?" + footer | `Contact.astro` + `Footer.astro` |
| Paleta ⌘K | `CommandPalette.astro` (isla JS) |
| `#ahora`, `#speaker`, `#estado-carrera` | `/ahora`, `/speaker`, `/estado` (+ `/en/...`) |
| 404 "Esta página no tiene réplica" | `src/pages/404.astro` (reemplazar) |

### Datos de proyectos

Creá una collection `projects` (`src/content/projects/*.json`) con: `id`, `order`, `size` (`lg` | `md` | `wide`), `kind`, `status`, `title`, `summary`, `metric`, `tags`, `lead`, `kpis[]`, `problem`, `idea`, `change`, `role`, `links[]`, `lang`. El contenido en español está en las tarjetas y en los `<section class="drawer">` del prototipo; el inglés, en el objeto `EN`.

Proyectos: Portal CSP (destacado), Prueba automatizada de recuperación, Auditoría de Azure y M365, DR Live, Gobernanza como código, Backups por nivel y **ai-env** (propio, open source: https://github.com/santiagodaros/ai-env). **Llavi no se muestra.**

## 5. Blog

- **Destacado:** el artículo que ya está en el repo, `backup-no-es-continuidad-rpo-rto.mdx` (y su versión en inglés). Es real y reemplaza al borrador RTO/RPO del prototipo. Usá como portada `img/blog-rto.webp`.
- **Artículo nuevo:** "Almacenamiento inteligente: bajar costos archivando datos viejos" (publicado en LinkedIn el 20/04/2026). El texto adaptado está en el prototipo (`#art-archivo`). Agregalo como MDX con `canonical` al artículo de LinkedIn: https://www.linkedin.com/pulse/almacenamiento-inteligente-bajar-costos-archivando-datos-da-ros-xciuf/
- **Posts de LinkedIn:** collection de datos `linkedin` (`src/content/linkedin/posts.json`) con `title`, `date`, `tag`, `summary`, `url`. Son los 8 posts listados en el índice del blog del prototipo. Se muestran como "Post en LinkedIn ↗" en el índice y los 3 más recientes en la home.
- **No migrar:** los artículos de Resource Graph y Azure Policy.
- **Guía de KQL (se queda):** "Las 10 consultas de KQL que corro en toda auditoría". Ruta `/recursos/kql` (+ `/en/resources/kql`), con botón de copiar en cada consulta y descarga del archivo `.kql` (servir `public/recursos/10-consultas-kql-auditoria-azure.kql` como archivo estático). El contenido está en `#guia-kql` del prototipo y en la constante `KQL` del `<script>`. Mantener el bloque destacado en la sección Blog de la home.

## 6. Newsletter con Kit

- Cuenta creada. Formulario "Newsletter portfolio", **Form ID `10232631`**.
- Endpoint (sacado del HTML de Kit): `https://app.kit.com/forms/10232631/subscriptions`, campo `email_address`.
- Variable pública: `PUBLIC_KIT_FORM_ID=10232631` en `.env` y en Vercel. No es un secreto.
- `NewsletterCTA.astro` hace un `POST` con `FormData` (`email_address`) a ese endpoint, sin backend propio.
- Mensajes de estado en ES/EN: enviando, "Revisá tu correo para confirmar", error. Kit pide doble confirmación.
- Crear las páginas `/gracias` y `/en/thanks`: Kit redirige ahí cuando el suscriptor confirma desde el mail. Mensaje corto ("Listo, ya estás suscripto"), link al último artículo y al blog.
- Sin reCAPTCHA de Kit (no funciona con un formulario propio). Si aparece spam, sumar un campo honeypot oculto.
- Probarlo una vez publicado, con un email propio, y verificar que el suscriptor aparezca en Kit.

## 7. Analíticas

- `@vercel/analytics` (componente `Analytics` para Astro) en `Layout.astro`.
- Activar Web Analytics en el proyecto de Vercel.

## 8. Imágenes y archivos

- Copiá `design/prototype/img/*.webp`, `img/badges/*.png` y `img/og.png` a `public/` (o a `src/assets/` si usás `<Image>`).
- CV: ya existen `public/cv-es.pdf` y `public/cv-en.pdf`. Reemplazalos por `design/prototype/cv/CV_Santiago_Da_Ros_{ES,EN}.pdf`.
- OG: actualizá `src/pages/og/[...slug].ts` (astro-og-canvas) con Geist, cobalto y el logo nuevo. Para la home, `og.png`.
- Contacto: santiagolucasdaros@gmail.com · https://www.linkedin.com/in/santiagodaros/ · https://github.com/santiagodaros

## 9. Comportamientos a respetar

- Respetar `prefers-reduced-motion`: sin animaciones, contenido visible.
- Sin JS, todo el contenido tiene que verse (las animaciones de aparición son una mejora, no un requisito).
- Los modales de proyecto no tienen scroll en 1366×768 y, al cerrarlos, la página queda donde estaba.
- El simulacro de caída mide el RTO real del navegador y lo muestra.
- Accesible por teclado: foco visible, `Esc` cierra modales y paleta, `⌘K` / `Ctrl+K` abre la paleta.

## 10. Fases sugeridas (un PR por fase)

1. Tokens, fuentes, `Layout`, `Nav`, `Footer`, favicon y logo.
2. Hero, banda de latido, Cómo trabajo, Experiencias, Stack y certificaciones, Sobre mí, cierre.
3. Collection `projects`, mosaico, esquema del portal y modales.
4. Blog: destacado, artículo de almacenamiento, posts de LinkedIn, índice.
5. Charlas, guía de KQL, `/ahora`, `/speaker`, `/estado`, 404.
6. Inglés completo en `/en`.
7. Kit y Vercel Analytics.
8. Paleta ⌘K y simulacro de caída.
9. QA: Lighthouse, accesibilidad, celular, tema oscuro, `astro build` sin errores.

## 11. Pendientes antes de publicar

- OK de la empresa para mostrar "204 clientes en 6 países" y la foto con el cartel de Readymind.
- Santiago revisa los textos de "Mi rol", `/ahora`, `/estado` y el speaker kit.
- Santiago revisa y prueba las 10 consultas de la guía de KQL en un entorno propio antes de publicarla.
- Logos de tecnologías: solo si Santiago provee los SVG.
