import type { APIRoute } from 'astro';
import { kqlFileText } from '../../data/kql';

// Versión en inglés del archivo descargable (alias de las consultas traducidos).
export const GET: APIRoute = () =>
  new Response(kqlFileText('en'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
