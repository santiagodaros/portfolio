# CV (PDF)

Fuente de `public/cv-es.pdf` y `public/cv-en.pdf`, los que descarga el sitio. El contenido se edita en `build.mjs` (un objeto por idioma); los `cv-es.html` y `cv-en.html` se generan de ahí.

```powershell
node design/cv/build.mjs
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
foreach ($l in "es", "en") {
  & $chrome --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$PWD\public\cv-$l.pdf" "file:///$($PWD -replace '\\','/')/design/cv/cv-$l.html"
}
```

- Debe quedar en **2 páginas A4**: la primera termina con la experiencia en Readymind y la segunda empieza con el programa de formación.
- Sin cifras exactas de clientes ni de países: "más de 200 clientes en más de 5 países" (ver las reglas del proyecto sobre datos anonimizados). Tampoco cantidades de servidores ni de cuentas ("decenas de servidores", "varias cuentas corporativas"); sí se dejan los porcentajes de resultado (62% y 98%).
- La reducción de tiempo de la prueba de recuperación es **62%** (de 2 h a 45 min), igual que en el sitio.
- La fuente es Georgia (si no está, cae en Cambria o una serif): con esas el texto del PDF se copia y se indexa bien. Cambria sola deja las tildes descompuestas al copiar.
