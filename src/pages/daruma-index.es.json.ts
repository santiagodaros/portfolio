import type { APIRoute } from 'astro';
import { buildIndex } from '../lib/daruma-index';

// Índice de contenido que lee Daruma (sin IA: respuestas a partir de lo publicado).
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildIndex('es')), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
