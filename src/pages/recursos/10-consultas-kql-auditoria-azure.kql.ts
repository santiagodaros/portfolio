import type { APIRoute } from 'astro';
import { kqlFileText } from '../../data/kql';

// Archivo descargable de la guía; se genera con los mismos datos que la página.
export const GET: APIRoute = () =>
  new Response(kqlFileText('es'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
