# Portadas de la sección Comunidad

Fuente de `public/img/feed/*.webp`: las portadas ilustradas de los posts, los recursos, el código y la charla que no tenían imagen. Cada escena de `scenes.html` se abre con `?s=<escena>` y `build.mjs` la exporta (necesita Chrome; con `CHROME=<ruta>` se cambia el ejecutable).

```powershell
node design/feed-covers/build.mjs                  # todas
node design/feed-covers/build.mjs mito-del-99-99   # una sola
```

- Tamaño: 1600×560 (como las portadas de los artículos); la charla va en 1280×720 (16:9, como las demás charlas).
- Dónde se enchufan: `cover` (nombre del archivo, sin extensión) en `src/content/linkedin/*.json` y `src/content/contributions/*.json`; `image: "feed/<nombre>"` en las charlas; `cover` con la ruta completa en el artículo. Un post con artículo extendido y sin `cover` propio usa la portada del artículo.
- Sin cifras inventadas: solo lo que ya dice el post, el artículo o la charla. Una portada nueva se dibuja en el mismo estilo (fondo oscuro, mono en mayúsculas, el azul del sitio y rojo/verde para caída/recuperación).
- La charla tiene texto importante en el centro: en la tarjeta destacada la imagen se recorta a los costados.
