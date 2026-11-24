# Datos de Daruma

Los textos de Daruma salen de acá, un archivo por tema e idioma (`<tema>.es.json` y `<tema>.en.json`). El motor está en `src/components/daruma/`. La especificación completa es `docs/DARUMA.md`.

| Archivo | Qué tiene | Cuándo se carga |
| --- | --- | --- |
| `ui` | frases, saludos, avisos, menú, textos del chat | al iniciar |
| `facts` | avisos por sección, frases al pasar por un proyecto, datos al frenar el scroll | solo en la home |
| `tour` | recorrido completo, mini recorridos, bienvenida | al usarlos |
| `glossary` | glosario de DR y Azure | al abrir el chat |
| `profile` | perfil, alias de proyectos, palabras de cada pregunta, intenciones | al abrir el chat |
| `tools` | costo de una caída, RPO real, KQL | al usar `/costo`, `/rpo`, `/kql` |
| `interview` | modo entrevista. **Apagado** (`interview: false` en `live.json`) hasta que Santiago reescriba las 5 respuestas; con `true` se enciende en el chat, la ayuda, las sugerencias y `/daruma` | al usar `/entrevista` |
| `mails` | mails armados con campos para completar | al usarlos |
| `page` | texto de `/daruma` y `/en/daruma` | en el build |
| `live.json` | metas del año y próxima charla | en el build |

- Las claves de enlace (`art-rto`, `p-failover`, `speaker`, `charlas`…) las resuelve `src/lib/daruma-index.ts`; no son URLs.
- Proyectos, artículos, posts, charlas y consultas KQL no se copian acá: se generan en el build (`/daruma-index.<lang>.json`).
- El objetivo del año sale de la colección `src/content/contributions/`: sumá un archivo por charla o artículo que publiques.
- Para una pregunta nueva sin respuesta, revisá el evento `daruma_miss` en Vercel Analytics y agregá la entrada en `glossary` o `profile`.
- Cada dato, el glosario y las 5 respuestas de la entrevista los valida Santiago antes de publicar.
