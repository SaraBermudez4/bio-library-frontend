import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8090/api';

// Strip these from the forwarded request so Spring Boot never sees an Origin
// and therefore never applies its CORS filter.
const DROP_REQ = new Set(['host', 'origin', 'referer', 'connection', 'transfer-encoding']);
const DROP_RES = new Set(['connection', 'transfer-encoding', 'keep-alive']);

async function proxy(request, context) {
  const { path } = await context.params;
  const { search } = new URL(request.url);
  const target = `${BACKEND}/${path.join('/')}${search}`;

  const headers = {};
  for (const [k, v] of request.headers.entries()) {
    if (!DROP_REQ.has(k.toLowerCase())) headers[k] = v;
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let upstream;
  try {
    upstream = await fetch(target, { method: request.method, headers, body });
  } catch {
    return NextResponse.json(
      { message: 'No se pudo conectar con el servidor.' },
      { status: 503 },
    );
  }

  const resHeaders = new Headers();
  for (const [k, v] of upstream.headers.entries()) {
    if (!DROP_RES.has(k.toLowerCase())) resHeaders.set(k, v);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
