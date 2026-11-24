import type { APIRoute } from 'astro';
import { buildCsv, getContributions } from '@/lib/contributions';
import { areaLabels } from '@/lib/areas';

// CSV de todas las contribuciones (se genera en el build).
export const GET: APIRoute = async () => {
  const items = await getContributions('en');
  return new Response(buildCsv(items, 'en', (a) => areaLabels['en'][a]), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
};
