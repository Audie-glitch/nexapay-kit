import type { Env } from './types';

export function corsHeaders(env: Env, request: Request): HeadersInit {
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGIN || '*';

  let allowOrigin = '*';
  if (allowed !== '*') {
    const list = allowed.split(',').map((s) => s.trim()).filter(Boolean);
    if (origin && list.includes(origin)) {
      allowOrigin = origin;
    } else if (list.length === 1) {
      allowOrigin = list[0];
    } else {
      allowOrigin = list[0] || '*';
    }
  } else if (origin) {
    allowOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function json(
  data: unknown,
  status: number,
  env: Env,
  request: Request,
  extra?: HeadersInit
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(env, request),
      ...extra,
    },
  });
}

export function handleOptions(env: Env, request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(env, request) });
}
