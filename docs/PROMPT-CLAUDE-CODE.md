Copiá este texto en Claude Code, parado en la raíz del repo `portfolio`, después de copiar las carpetas `design/` y `docs/` y el archivo `CLAUDE.md`.

---

Vamos a rediseñar el portfolio. Leé `CLAUDE.md`, `docs/REDISENO.md` y abrí `design/prototype/index.html`, que es la fuente de verdad visual y de contenido.

1. Antes de tocar código, recorré el repo actual (componentes, content collections, rutas `/en`, OG, RSS) y devolveme un plan por fases basado en la sección 10 de `docs/REDISENO.md`. Marcá qué reutilizás, qué reemplazás y qué borrás.
2. Cuando lo apruebe, implementá una fase por vez, cada una en su rama `feat/rediseno-<fase>` y con su PR.
3. En cada PR incluí capturas en claro y oscuro, en escritorio (1366×768) y en celular (390 px), y confirmá que `npm run build` pasa.
4. No inventes contenido. Si algo del prototipo es un borrador o le falta un dato, preguntame.
5. Para el newsletter con Kit, verificá en la documentación actual de Kit la URL y los campos del endpoint de formularios antes de implementarlo.
