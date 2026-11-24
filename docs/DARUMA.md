# Daruma · guía del portfolio (sin IA)

Especificación para implementar Daruma en `santiagodaros/portfolio` (Astro). La referencia visual y de comportamiento es el prototipo: `design/prototype/daruma/index.html` (copiar el `index.html` del artifact "Portfolio · prototipo Daruma"). El bloque entre `<!-- ===== Prototipo Daruma` y `<!-- ===== /Daruma ===== -->` es todo el código de Daruma; el `<section id="daruma">` es su página.

**Fuente de verdad.** Este documento explica qué hace Daruma y por qué; el prototipo define **cómo se ve y qué dice exactamente**. Ante cualquier diferencia, manda el prototipo. Se portan tal cual, sin reescribir:
- todos los textos (saludos, avisos, datos, glosario, entrevista, recorrido, mails, frases al empujar);
- el SVG (coordenadas, colores, accesorios);
- tiempos, umbrales y límites (los valores reales están en el código; el "modo demo" del prototipo los divide por 4 y **no** va a producción);
- estilos (CSS del bloque Daruma).

Reglas que no se negocian:
- **Sin IA y sin costo.** Todo determinístico, en el cliente, sin servidor ni tokens.
- **Formal.** Comentarios cortos, sin chistes, sin jerga de chat. Nunca inventa: si no sabe, lo dice.
- **Cero datos de clientes.** Ninguna respuesta nombra clientes, tenants ni datos internos.
- **No molesta.** Nunca tapa un botón de acción, nunca habla con un artículo o modal abierto (salvo el aviso de contexto), y respeta `prefers-reduced-motion`.
- El panel de prueba ("Prototipo Daruma", abajo a la izquierda) **no va a producción**.

---

## 1. Identidad

- **Forma:** Daruma cobalto (gradiente `#4451ff → #1a24c9`) con brillo, cara blanca, cejas rectas y sombra en el piso que se mueve con la inclinación.
- **Ojos = logo.** Izquierdo: círculo (nube). Derecho: cuadrado cobalto relleno (producto), que es el ojo "pintado" del objetivo.
- **Pulso** en la panza (el mismo motivo del hero), que late cada ~9 s.
- **Expresiones:** boca `smile | big | o | flat | wry`, cejas que suben (sorpresa), parpadeo aleatorio (2,4–6 s, a veces doble).
- **Modos con accesorio** según dónde está el visitante (SVG, sin imágenes):

| Modo | Accesorio | Cuándo |
| --- | --- | --- |
| Builder | laptop con el logo | Proyectos, Experiencias, modales de proyecto |
| Guardia | auriculares con micrófono | de 20 a 7 h por defecto; modales de proyectos de DR |
| Speaker | micrófono de mano | Charlas, speaker kit |
| Lectura | anteojos | Blog, newsletter, artículos, guía KQL |

El nombre del modo aparece en el encabezado del panel ("● Modo builder").

## 2. Movimiento y física

- **Tentempié:** física de resorte con amortiguación (`vel = vel*.9 + (goal-ang)*.055`), con `requestAnimationFrame` solo mientras se mueve.
- **Se puede empujar:** arrastrar más de 5 px lo inclina (±80°). Al soltar, oscila y vuelve. Click sin arrastre abre el panel.
- Frases al empujar: 1 "¡Epa! Siempre vuelvo." · 3 "Podés seguir. Me levanto siempre." · 7 "Siete caídas, ocho levantadas. Lo dice el refrán."
- **Mira y se inclina** hacia el cursor (pupila y brillo; inclinación de hasta 7° si el cursor está a menos de 320 px).
- **Inactividad:** a los 30 s corre "una prueba de failover" (se balancea y avisa ✓); a los 70 s se duerme (ojos cerrados, "z"); con cualquier actividad se despierta: "¡Estoy! Era una ventana de mantenimiento."

## 3. Bienvenida y recorrido

- **Primera visita** (`localStorage dmSeen`): entra rebotando y ofrece "Mostrame el sitio", "Busco algo puntual" o "Ahora no".
- **Recorrido de 10 pasos** con spotlight: quién es, el año en tres números, el portal, la prueba de recuperación, experiencias, certificaciones, blog, charlas, newsletter y contacto.
  - Daruma mira y se inclina hacia lo que señala.
  - Se maneja con flechas y Esc.
  - "Abrir el detalle" pausa el recorrido y lo retoma al cerrar el modal.
- **Atajos:** tecla `?` fuera de un input, el comando `/tour` y la entrada "Recorrido guiado con Daruma" en el buscador ⌘K.
- **Mini recorridos por perfil:**
  - "Organizo un evento" → Charlas + speaker kit.
  - "Me interesa DR" → 3 pasos: proyecto, artículo y webinar.
  - "Solo quiero leer" → blog + newsletter.

## 4. Comentarios espontáneos (con freno)

- Máximo **7 por visita**, separados al menos 16 s. Si el visitante cierra 2 avisos, se calla ("Ok, me callo. Si me necesitás, tocame."). El botón "Silenciar" del panel hace lo mismo.
- **Disparadores:**
  - Saludo según la hora.
  - Sección Proyectos ("Pasá el mouse por un proyecto…").
  - Hover de 0,9 s sobre cada proyecto: una frase por proyecto.
  - Blog → newsletter; Charlas → speaker kit; final de la página ("Llegaste al final sin caídas. Buen RTO.").
  - Cambio de tema claro/oscuro; volver a la pestaña después de más de 20 s.
- **Datos vivos** (una vez por visita): próxima charla con cuenta regresiva, o "fecha a confirmar".

## 5. Datos al frenar el scroll

- Si el visitante deja de scrollear 1,3 s, Daruma toma el proyecto o la sección más cercana al centro de la pantalla, la mira y tira un **dato técnico** con un botón para entrar.
- Máximo 4 por visita, separados al menos 20 s. Después del primero, se saltea ~40% de las paradas. Nunca repite sección.
- 11 datos en el prototipo (uno por proyecto, más certificaciones, blog, experiencias y charlas).
- **Santiago valida cada dato antes de publicar** (en especial CSP y snapshots de Backup).
- En producción: 2 o 3 datos por sección, con rotación.

## 6. Chat sin IA

### 6.1 Cómo entiende
- `norm()`: minúsculas, sin acentos ni signos. Tolera errores de una letra (Levenshtein ≤ 1 en palabras de 5 letras o más).
- **Tema:**
  - proyecto (alias por proyecto);
  - concepto (glosario);
  - artículo;
  - perfil (certificaciones, trabajo, estudios, contacto, CV, charlas, newsletter, idiomas, hackatón, tarifas, quién es Daruma).
- **Pregunta:** `stack | problema | idea | resultado | rol`.
- **Contexto:** recuerda el último proyecto ("¿y su rol?"). Dentro de un modal o artículo, ese es el contexto por defecto.
- Las entradas de perfil con nombre propio (hackatón, certificaciones, CV…) ganan sobre el contexto.

### 6.2 De dónde salen las respuestas
- **Proyectos:** se leen en tiempo real de las tarjetas (`.tag` = stack) y de los modales (`El problema`, `La idea`, `Qué cambió`, `Mi rol`). No hay datos duplicados.
  - En Astro: generar el índice en build desde la colección `projects`.
- **Glosario** (19 entradas, formal): RPO, RTO, RPO vs RTO, test failover, failover, Site Recovery, backup vs continuidad, alta disponibilidad, KQL, Resource Graph, Lighthouse, EPAC, Azure Policy, PIM, acceso condicional, FinOps, Archive, MCP, CSP.
  - Cada entrada lleva el artículo o proyecto relacionado.
  - Dentro de un artículo, indica la sección donde se desarrolla el concepto.
- **Fuente visible:** "Fuente: artículo «…», fecha" o el proyecto.
- **Sin respuesta:** lo dice y sugiere preguntas que sí puede responder.
  - Se registra en `miss[]`; en producción, evento de Vercel Analytics `daruma_miss` con el texto normalizado.
- **Tarifas/sueldo:** "No publica tarifas en el sitio…" → contacto.

### 6.3 Comandos
| Comando | Qué hace |
| --- | --- |
| `/entrevista` | Modo entrevista |
| `/costo` | Calculadora de costo de una caída |
| `/rpo` | Estimador de RPO real |
| `/kql <tema>` | Consulta de la guía con botón Copiar |
| `/caos` | Chaos engineering de la página |
| `/tour` | Recorrido |
| `ayuda` | Lista de comandos |

También entiende lenguaje natural: "¿cuánto cuesta una caída?", "consulta kql de backups", "armá un mail para un evento".

### 6.4 Modo entrevista
- 5 preguntas: ¿Por qué Azure? · ¿Mayor desafío técnico? · ¿Cómo trabajás con IA? · ¿Cómo explicás lo técnico a negocio? · ¿Hacia dónde querés ir?
- **Las respuestas del prototipo son borradores.** Santiago las reescribe con sus palabras antes de producción, y entonces se quita la etiqueta "Borrador".

### 6.5 Herramientas de DR
- **Costo de una caída:** ingreso por hora × RTO, más el ahorro si se baja el RTO a la mitad. Se aclara que es una estimación lineal.
- **RPO real:** 3 preguntas (frecuencia del backup, última restauración de prueba, verificación).
  - RPO = frecuencia, o el doble si no se verifica.
  - RTO: desconocido / desactualizado / medido.
- Ambas terminan en el artículo de RPO/RTO y el newsletter.

### 6.6 Contacto armado
- `mailto:` con asunto y cuerpo según la intención (evento, recruiter, consulta técnica), con campos entre corchetes para completar.
- Alternativa: LinkedIn.

### 6.7 Idioma
- UI, saludo y menú en ES/EN según `html[lang]`.
- **Pendiente para producción:** glosario, datos, recorrido y entrevista en inglés. Mientras tanto, si el sitio está en EN responde en español con aviso.

## 7. Dentro de los artículos

- **Retomar:** guarda el progreso de lectura por artículo (`localStorage dmRead-<slug>`). Al volver, si quedó entre 12% y 90%: "La última vez llegaste al 40%. ¿Seguís donde dejaste?".
- **Al terminar** (`.reader__end` visible): "¿Te quedó alguna duda? Preguntame…" con el siguiente artículo recomendado.
- **Aviso de contexto** la primera vez que se abre cada artículo o proyecto: "¿Alguna duda sobre el artículo? Preguntame por un concepto."

## 8. Visitante que vuelve

- `localStorage dmLast` guarda la fecha de la última visita.
- Si hay contenido más nuevo, avisa: "Desde tu última visita hay algo nuevo: …".
- En producción, la lista sale de las colecciones (artículos, posts, charlas, contribuciones).

## 9. Objetivo 2027 (el segundo ojo)

- El círculo se llena como arco de progreso: (charlas + artículos hechos) / (12 + 12).
- **En producción se calcula en build desde la colección `contributions`.**
- Se explica en el chat ("¿Por qué tenés esos ojos?") y en la página `/daruma`.

## 10. Chaos engineering

- Disparadores: `/caos`, escribir "caos" (o "chaos") fuera de un input, o el panel de prueba.
- Las tarjetas visibles se caen y Daruma narra el incidente en la burbuja, una línea cada ~3 s, con la página caída: caída detectada, incidente declarado (un solo canal, una persona coordinando) y failover a la región secundaria.
- Después levanta las tarjetas en 3 grupos con el orden de un plan real: identidad, bases de datos, aplicaciones (el mismo del proyecto de la prueba automatizada). Todo el texto sale de `chaos` en `ui.<lang>.json`.
- Cierra con "De pie en N s." (el tiempo real que tardó) y un link a la prueba real. **Esc** la saltea y deja todo en pie al instante.
- El botón "Simular una caída" de la home corre este mismo incidente: la barra de incidente sigue a Daruma (detección, failover y recuperación) y muestra el tiempo real. Sin Daruma cargado, o cuando lo dispara el panel ("Tirame abajo"), usa la versión corta de 1,8 s. El gancho es `window.darumaChaos`; `Pulse.astro` no importa nada de Daruma.
- Mientras dura, Daruma no dice nada más (ni saludos ni avisos).
- Con `prefers-reduced-motion`, solo la narración, sin animación.

## 11. Página `/daruma`

- **No va en el menú.** Se abre desde el pie del panel ("¿Cómo funciono?"), el buscador ⌘K y el footer.
- **Secciones:**
  1. Por qué un Daruma (resiliencia + ojos = logo).
  2. Los dos ojos (progreso en vivo).
  3. Cómo funciona sin IA.
  4. Sus modos (4 ilustraciones).
  5. Qué le podés pedir (comandos).
  6. Dónde más aparece (stickers, slides, newsletter).
  7. Código abierto.
- ES y EN (`/en/daruma`).

## 12. Fuera del sitio

- **Stickers:** Daruma sobre círculo cobalto con borde blanco, para repartir en charlas.
- **Slides:** Daruma en modo speaker en la esquina de la plantilla de charlas.
- **Newsletter:** Daruma en modo lectura en la firma.
- **Las preguntas sin respuesta como motor de contenido:** revisar `daruma_miss` cada mes. Las más repetidas se convierten en una respuesta nueva y en un post ("Lo que más le preguntan a Daruma sobre DR").

## 13. Open source (versión 3)

- Repo público con el motor genérico: guía por perfil, recorrido con spotlight, chat sin IA alimentado por JSON (entidades, atributos, glosario, comandos) y física del tentempié.
- Sin los datos del portfolio.
- Cuenta como contribución técnica para el MVP.

---

## 14. Mejoras de la revisión final (1 a 9)

Están todas en el prototipo. Se prueban con el panel de prueba: "Simular celular" y "Llegar por un artículo".

### 14.1 Modo celular
- **Cuándo se activa:** `(max-width: 720px), (hover: none) and (pointer: coarse)`. Sin mouse no hay mirada que siga el cursor ni comentarios al pasar por un proyecto.
- **Daruma:** 58×66 px, a 12 px del borde.
- **Avisos:** se apoyan abajo, a lo ancho, sin tapar contenido.
- **Panel:** casi a pantalla completa; sin la barra de datos vivos.
- **Bienvenida:** hoja que sube desde abajo, a todo el ancho.
- **Recorrido corto, 6 pasos:** quién es, el portal, la prueba de recuperación, blog, charlas y contacto.
- **Datos al frenar:** máximo 2 por visita (4 en escritorio).

### 14.2 Quien llega por un link directo
- Si la URL de entrada abre un artículo, un proyecto, el speaker kit o la guía KQL, **no hay bienvenida ni saludo**. Solo aparece el aviso de contexto del artículo o proyecto.
- La bienvenida se muestra cuando vuelve a la home, 1,2 s después de cerrar el modal o el artículo.
- **Detalle técnico:** la detección se hace con `location.hash` + `getElementById`, no con `:target`, porque `:target` todavía no aplica cuando corre el script.

### 14.3 Privacidad de las preguntas
- Antes de registrar cualquier texto, `sanitize()` reemplaza:
  - mails por `[mail]`;
  - links por `[link]`;
  - teléfonos y números de 4 dígitos o más por `[número]`.
- Además corta el texto a 120 caracteres.
- Debajo del campo de texto: "Las preguntas se guardan de forma anónima para mejorar las respuestas."
- No se guarda nada en el navegador más allá de las claves de §Implementación.

### 14.4 Alcance de la versión 1
Reemplaza la tabla de fases de arriba:

| Fase | Qué entra |
| --- | --- |
| **v1** | Identidad, física y modos · bienvenida y recorrido (con 14.1 y 14.2) · chat con glosario, búsqueda (14.6), sugerencias (14.7) y "¿Te sirvió?" (14.9) · datos al frenar · privacidad (14.3) · analítica · página `/daruma` |
| **v1.1** (cuando la analítica muestre uso real) | Herramientas `/costo`, `/rpo`, `/kql` · modo entrevista con respuestas reales · suscripción dentro del chat (14.8) · contacto armado · artículos (retomar y cierre) · visitante que vuelve · objetivo 2027 |
| **v2** | Inglés completo · datos rotativos · `/caos` · `/en/daruma` |
| **v3** | Repo open source del motor · stickers y plantilla de slides |

### 14.5 Peso y carga
- Se carga con `client:idle`, después de que el sitio está visible. No afecta el LCP ni el SEO.
- **Límite: ~25 KB de JS comprimido.** Si se pasa, separar en partes que se cargan recién cuando hacen falta: herramientas, entrevista y caos se cargan al usarlos por primera vez.
- Sin dependencias nuevas.

### 14.6 Búsqueda en todo el contenido
- **Índice:** posts (los de la home y los de LinkedIn), artículos y sus secciones, charlas, las 10 consultas KQL y los proyectos.
  - En el prototipo se arma desde la página, más 4 posts cargados a mano.
  - En producción se genera en build desde las colecciones.
- **Cuándo se usa:**
  - de forma explícita: "¿escribiste algo sobre X?", "¿tenés algo de X?", "¿hablaste de X?";
  - automáticamente, **antes de decir "no sé"**.
- **Puntaje:** palabra al inicio de una palabra del título = 3; en el resto del texto = 1; con un error de tipeo = 1. Se descartan stopwords.
- **Resultado:** hasta 3, solo los que tienen al menos el 60% del mejor puntaje. Se muestran como tarjetas con su tipo (Artículo, Post en LinkedIn, Charla, Consulta KQL, Proyecto o Sección de un artículo).
- Si la búsqueda encuentra algo, no se registra como "sin respuesta".

### 14.7 Sugerencias mientras escribís
- Desde 2 caracteres, hasta 4 sugerencias que contengan todas las palabras tipeadas.
- **Salen de lo que Daruma sí sabe responder:**
  - 3 preguntas por proyecto (tecnología, problema, rol);
  - "¿Qué es…?" por cada entrada del glosario;
  - perfil;
  - búsquedas de ejemplo;
  - comandos;
  - suscripción y contacto.
- Cada una lleva su tipo al costado: proyecto, concepto, perfil, búsqueda, comando.
- Se maneja con flechas y Enter; Esc cierra. Elegir una la envía.

### 14.8 Suscripción dentro del chat
- Campo de email + "Suscribirme" dentro del chat.
- **En producción:** POST al formulario de Kit (`https://app.kit.com/forms/10232631/subscriptions`, campo `email_address`), con doble confirmación.
- **Cuándo aparece:**
  - al decir "suscribirme", "newsletter" o "avisame";
  - después de la calculadora de costo y del estimador de RPO ("Recibir casos por mail");
  - en el aviso de fin de artículo.
- **Al terminar:** "Listo. Te llega un mail para confirmar (revisá spam por las dudas)" + lo más leído.

### 14.9 "¿Te sirvió?"
- 👍/👎 debajo de cada respuesta a una pregunta escrita. No aparece en menús, comandos ni formularios.
- 👍: "Gracias."
- 👎: "Gracias, lo voy a mejorar." + "Preguntarle a Santiago" (mail armado de consulta técnica) y "Buscar en el blog".

### 14.10 Analítica (completa)
`daruma_open`, `daruma_tour_start`, `daruma_tour_complete`, `daruma_intent`, `daruma_question`, `daruma_search` (con cantidad de resultados), `daruma_result_click`, `daruma_miss`, `daruma_feedback` (ok true/false), `daruma_tool`, `daruma_subscribe` (source), `daruma_mute`. **Todo texto pasa por `sanitize()` antes de enviarse.** En el prototipo, los eventos salen por consola como `[daruma:analytics]`.

## Implementación en Astro

- `src/components/daruma/Daruma.astro`: markup + SVG (un solo `<symbol>` reutilizado con `<use>`; los ids del SVG deben ser únicos, ojo con colisiones como `dmBody`).
- `src/components/daruma/daruma.ts`: lógica, con módulos `physics`, `tour`, `chat`, `facts`, `modes` y `tools`. Cargar con `client:idle`.
- `src/data/daruma/*.json`: glosario, datos al frenar, entrevista, recorrido, mails y frases. ES y EN.
- Índice de proyectos, contenido y objetivo **generados en build** desde las colecciones (`projects`, `blog`, `contributions`).
- **Analítica** (Vercel): `daruma_open`, `daruma_tour_start/complete`, `daruma_intent` (perfil elegido), `daruma_question` (normalizada), `daruma_miss`, `daruma_tool` (costo/rpo/kql), `daruma_mute`.
- **Accesibilidad:**
  - el botón tiene `aria-label`, el panel `aria-label`, los avisos `aria-live="polite"`;
  - todo se puede usar con teclado; Esc cierra;
  - foco visible.
- **Rendimiento:** física y seguimiento solo con `requestAnimationFrame` cuando hace falta; observers pasivos; sin dependencias nuevas.
- **Ojo con el CSS global:** el panel es un `<section>` y heredaba el padding de `section` del sitio. Usar `padding:0` explícito o un `<div role="dialog">`.
- **Persistencia:** `localStorage` envuelto en `try/catch` (`dmSeen`, `dmLast`, `dmRead-*`). **Nuevo respecto del prototipo:** persistir el silencio en `dmMuted` para que no vuelva a hablar en la próxima visita.

## Fases

Ver **§14.4** (reemplaza a la tabla anterior).

## Prueba de paridad con el prototipo

Correr el prototipo y la implementación lado a lado (Playwright o a mano) con estos escenarios; el resultado tiene que ser el mismo:

1. Primera visita: entra rebotando y muestra la tarjeta de bienvenida con las 3 opciones.
2. "Mostrame el sitio": 10 pasos, spotlight en cada uno, flechas y Esc funcionan; "Abrir el detalle" pausa y retoma.
3. Frenar el scroll sobre un proyecto: aparece el dato de ese proyecto con "Ver el proyecto".
4. Chat: "¿qué tecnología usó en el portal?", "¿y su rol?", "¿qué es el RPO?", "qué certificaciones tiene", "cuánto cobra", "que hizo en la hackaton", "asdf" (sin respuesta).
5. Comandos: `/entrevista`, `/costo`, `/rpo`, `/kql backups`, `/caos`, `/tour`, `ayuda`.
6. Abrir el artículo de RPO/RTO: aviso de contexto; leer hasta el final: aviso de cierre; volver a abrirlo a mitad: "¿Seguís donde dejaste?".
7. Arrastrar a Daruma: se inclina y vuelve; a la 1.ª, 3.ª y 7.ª empujada dice su frase.
8. 30 s sin actividad: prueba de failover; 70 s: se duerme; mover el mouse: se despierta.
9. Modos: laptop en Proyectos, anteojos en Blog, micrófono en Charlas, auriculares de noche.
10. Cerrar dos avisos seguidos: se calla.
11. Modo oscuro, `prefers-reduced-motion`, celular y teclado.
12. Celular: bienvenida como hoja desde abajo; recorrido de 6 pasos; máximo 2 datos.
13. Entrar directo a `#art-rto`: sin bienvenida; al volver a la home, aparece.
14. "¿Escribiste algo sobre Entra?" → el post de identidades en Entra; "tenés algo de finops" → el post del 99,99%.
15. Escribir "rpo": aparecen sugerencias (concepto y comando).
16. Escribir un mail o teléfono en una pregunta: en la consola, la analítica lo muestra como `[mail]` / `[número]`.
17. `/costo` → "Recibir casos por mail" → formulario de suscripción en el chat.
18. 👎 en una respuesta: aparecen "Preguntarle a Santiago" y "Buscar en el blog".

## Checklist antes de publicar

- [ ] Santiago reescribió las 5 respuestas de la entrevista.
- [ ] Santiago validó los 11 datos y el glosario.
- [ ] Ninguna respuesta nombra clientes ni datos internos.
- [ ] Probado en celular: panel, recorrido y bienvenida no tapan el CTA ni el menú.
- [ ] `prefers-reduced-motion` probado.
- [ ] Teclado: Tab, Enter, flechas y Esc en panel y recorrido.
- [ ] El panel de prueba no está en el build.
- [ ] JS de Daruma ≤ ~25 KB comprimido; Lighthouse sin cambios en LCP.
- [ ] Ningún evento de analítica lleva mails, links ni números sin sanitizar.
