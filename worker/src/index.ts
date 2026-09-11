import { corsHeaders, handleOptions, json } from './cors';
import { renderDemoCheckout } from './demoCheckout';
import { verifyNexaPaySignature } from './hmac';
import type { CreatePaymentBody, Env, NexaPayCreateResponse } from './types';

const NEXAPAY_API = 'https://nexapay.one/api/v1';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return handleOptions(env, request);
    }

    try {
      if (request.method === 'GET' && url.pathname === '/health') {
        return json(
          { ok: true, configured: Boolean(env.NEXAPAY_API_KEY) },
          200,
          env,
          request
        );
      }

      if (request.method === 'GET' && url.pathname === '/demo/checkout') {
        return renderDemoCheckout(url.searchParams);
      }

      if (request.method === 'POST' && url.pathname === '/create-payment') {
        return createPayment(request, env, url);
      }

      if (request.method === 'POST' && url.pathname === '/webhooks/nexapay') {
        return handleWebhook(request, env);
      }

      return json({ error: 'not_found', path: url.pathname }, 404, env, request);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return json({ error: 'internal_error', message }, 500, env, request);
    }
  },
};

async function createPayment(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  let body: CreatePaymentBody;
  try {
    body = (await request.json()) as CreatePaymentBody;
  } catch {
    return json({ error: 'invalid_json' }, 400, env, request);
  }

  const amountNum = Number(body.amount);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return json(
      { error: 'invalid_amount', message: 'amount must be a positive number' },
      400,
      env,
      request
    );
  }

  const currency = (body.currency || 'USD').toUpperCase();
  const crypto = (body.crypto || 'USDC').toUpperCase();
  const description = body.description || 'Payment';
  const successUrl =
    body.success_url || env.SUCCESS_URL || 'http://127.0.0.1:5173/success';
  const cancelUrl =
    body.cancel_url || env.CANCEL_URL || 'http://127.0.0.1:5173/cancel';
  const callbackUrl =
    body.callback_url ||
    `${publicBase(env, url)}/webhooks/nexapay`;

  if (!env.NEXAPAY_API_KEY) {
    const orderId = `mock_${cryptoRandomId()}`;
    const checkout = new URL('/demo/checkout', publicBase(env, url));
    checkout.searchParams.set('order', orderId);
    checkout.searchParams.set('amount', amountNum.toFixed(2));
    checkout.searchParams.set('currency', currency);
    checkout.searchParams.set('crypto', crypto);
    checkout.searchParams.set('description', description);
    checkout.searchParams.set('success_url', successUrl);
    checkout.searchParams.set('cancel_url', cancelUrl);

    return json(
      {
        success: true,
        mock: true,
        status: 'not_configured',
        message:
          'NEXAPAY_API_KEY not set — returning simulated checkout. Set the secret for live payments.',
        checkout_url: checkout.toString(),
        order_id: orderId,
        payment_id: orderId,
        amount: amountNum,
        currency,
        crypto,
      },
      200,
      env,
      request
    );
  }

  const payload = {
    amount: amountNum,
    currency,
    crypto,
    description,
    customer_email: body.customer_email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    callback_url: callbackUrl,
  };

  const upstream = await fetch(`${NEXAPAY_API}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-API-Key': env.NEXAPAY_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const text = await upstream.text();
  let data: NexaPayCreateResponse;
  try {
    data = JSON.parse(text) as NexaPayCreateResponse;
  } catch {
    return json(
      {
        error: 'upstream_invalid_json',
        status: upstream.status,
        body: text.slice(0, 500),
      },
      502,
      env,
      request
    );
  }

  if (!upstream.ok || !data.success || !data.payment?.checkout_url) {
    return json(
      {
        error: 'nexapay_error',
        status: upstream.status,
        message: data.message || data.error || 'NexaPay create payment failed',
        details: data,
      },
      upstream.status >= 400 ? upstream.status : 502,
      env,
      request
    );
  }

  const p = data.payment;
  return json(
    {
      success: true,
      mock: false,
      checkout_url: p.checkout_url,
      order_id: p.order_id,
      payment_id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
    },
    200,
    env,
    request
  );
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get('X-NexaPay-Signature');
  const timestamp = request.headers.get('X-NexaPay-Timestamp');

  if (env.NEXAPAY_WEBHOOK_SECRET) {
    const ok = await verifyNexaPaySignature(
      rawBody,
      signature,
      timestamp,
      env.NEXAPAY_WEBHOOK_SECRET
    );
    if (!ok) {
      return json(
        { error: 'invalid_signature' },
        401,
        env,
        request
      );
    }
  } else {
    console.log(
      '[nexapay-kit] webhook received (mock — no NEXAPAY_WEBHOOK_SECRET)',
      { signature, timestamp, bodyPreview: rawBody.slice(0, 200) }
    );
  }

  let event: unknown = null;
  try {
    event = JSON.parse(rawBody);
  } catch {
    /* keep null */
  }

  console.log('[nexapay-kit] webhook ok', event);
  return json({ received: true }, 200, env, request);
}

function publicBase(env: Env, url: URL): string {
  if (env.PUBLIC_BASE_URL) return env.PUBLIC_BASE_URL.replace(/\/$/, '');
  return url.origin;
}

function cryptoRandomId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}
