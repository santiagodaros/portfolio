import type { APIRoute } from 'astro';
import { buildIndex } from '../lib/daruma-index';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildIndex('en')), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
