# Portfolio de Santiago Da Ros

Sitio personal en Astro 4 + MDX + Tailwind, desplegado en Vercel. El rediseño en curso se guía por `docs/REDISENO.md` y el prototipo `design/prototype/index.html`.

## Reglas

- **Idioma:** textos de UI y commits en español rioplatense; el sitio tiene versión en inglés en `/en`.
- **Sin datos sensibles:** nunca nombres de clientes, IDs de tenant o suscripción, ni secretos en el repo. Los proyectos de Readymind se describen sin código ni datos de clientes.
- **Sin backend propio:** el sitio es estático. El newsletter usa Kit vía su endpoint público de formularios; `PUBLIC_KIT_FORM_ID` es la única variable.
- **Sin dependencias de más:** solo las necesarias (Geist, Vercel Analytics). Nada de UI kits ni state managers.
- **Contenido real:** no inventes artículos, métricas, charlas ni proyectos. Si falta un dato, preguntá.
- **Accesibilidad y movimiento:** foco visible, navegación por teclado y `prefers-reduced-motion` en toda animación.

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
