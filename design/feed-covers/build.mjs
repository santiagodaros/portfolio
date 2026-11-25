// Exporta las portadas de design/feed-covers/scenes.html a public/img/feed/<escena>.webp.
// Uso: node design/feed-covers/build.mjs  (necesita Chrome; con CHROME=<ruta> se cambia el ejecutable)
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const chrome = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const page = pathToFileURL(resolve('design/feed-covers/scenes.html')).href;
const out = resolve('public/img/feed');
mkdirSync(out, { recursive: true });

// [escena, ancho, alto]: las charlas van en 16:9 (como el resto de las charlas); lo demás, en 1600×560 (como los artículos)
const scenes = [
  ['iceberg', 1280, 720],
  ['mito-del-99-99', 1600, 560],
  ['dr-rto-no-alcanza', 1600, 560],
  ['harness-engineering', 1600, 560],
  ['presentar-un-relevamiento', 1600, 560],
  ['recovery-nativo-entra', 1600, 560],
  ['riesgo-tecnico-al-negocio', 1600, 560],
  ['tres-entornos', 1600, 560],
  ['kql-guia', 1600, 560],
  ['ai-env', 1600, 560],
  ['almacenamiento-inteligente', 1600, 560],
];
const only = process.argv[2];
for (const [name, w, h] of scenes) {
  if (only && only !== name) continue;
  const png = join(tmpdir(), `cover-${name}.png`);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`, `--screenshot=${png}`, `${page}?s=${name}`], { stdio: 'ignore' });
  await sharp(png).resize(w, h).webp({ quality: 88 }).toFile(join(out, `${name}.webp`));
  rmSync(png);
  console.log(`${name}.webp ${w}x${h}`);
}
