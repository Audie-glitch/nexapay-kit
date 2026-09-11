/**
 * Pretty mock NexaPay-style checkout page for local demos (no API key).
 * Never charges real money.
 */
export function renderDemoCheckout(params: URLSearchParams): Response {
  const order = escapeHtml(params.get('order') || 'demo_order');
  const amount = escapeHtml(params.get('amount') || '0.00');
  const currency = escapeHtml(params.get('currency') || 'USD');
  const crypto = escapeHtml(params.get('crypto') || 'USDC');
  const description = escapeHtml(params.get('description') || 'Demo payment');
  const successUrl = safeUrl(params.get('success_url') || '/');
  const cancelUrl = safeUrl(params.get('cancel_url') || '/');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NexaPay Checkout (DEMO)</title>
  <style>
    :root {
      --bg: #0b0d10;
      --panel: #14181f;
      --border: #2a3140;
      --text: #e8ecf1;
      --muted: #9aa3b2;
      --accent: #5b8cff;
      --accent-hover: #7aa3ff;
      --warn: #f0b429;
      --danger: #e85d5d;
      --ok: #3ecf8e;
      --radius: 14px;
      --font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100dvh; font-family: var(--font);
      background: radial-gradient(1200px 600px at 50% -10%, #1a2333 0%, var(--bg) 55%);
      color: var(--text); display: flex; align-items: center; justify-content: center;
      padding: 1.25rem;
    }
    .card {
      width: 100%; max-width: 420px; background: var(--panel);
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.5rem; box-shadow: 0 24px 60px rgba(0,0,0,.45);
    }
    .badge {
      display: inline-flex; align-items: center; gap: .4rem;
      font-size: .75rem; font-weight: 700; letter-spacing: .04em;
      text-transform: uppercase; color: #1a1400; background: var(--warn);
      padding: .35rem .65rem; border-radius: 999px; margin-bottom: 1rem;
    }
    h1 { font-size: 1.25rem; margin: 0 0 .35rem; font-weight: 650; }
    .sub { color: var(--muted); font-size: .9rem; margin: 0 0 1.25rem; line-height: 1.45; }
    .row {
      display: flex; justify-content: space-between; gap: 1rem;
      padding: .7rem 0; border-bottom: 1px solid var(--border); font-size: .95rem;
    }
    .row:last-of-type { border-bottom: none; }
    .label { color: var(--muted); }
    .value { font-weight: 600; text-align: right; word-break: break-all; }
    .amount { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 1.25rem; letter-spacing: -0.02em; }
    .amount span { font-size: .95rem; color: var(--muted); font-weight: 500; margin-left: .35rem; }
    .actions { display: flex; flex-direction: column; gap: .65rem; margin-top: 1.25rem; }
    button, a.btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 100%; min-height: 48px; border-radius: 10px; font-size: 1rem;
      font-weight: 600; text-decoration: none; cursor: pointer; border: none;
      font-family: inherit;
    }
    .primary { background: var(--accent); color: #fff; }
    .primary:hover, .primary:focus-visible { background: var(--accent-hover); outline: 2px solid #fff; outline-offset: 2px; }
    .ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
    .ghost:hover, .ghost:focus-visible { color: var(--text); border-color: #3d4658; outline: 2px solid var(--accent); outline-offset: 2px; }
    .note { margin-top: 1rem; font-size: .8rem; color: var(--muted); line-height: 1.4; text-align: center; }
    .brand { display: flex; align-items: center; gap: .5rem; margin-bottom: .75rem; color: var(--muted); font-size: .85rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 3px rgba(62,207,142,.2); }
  </style>
</head>
<body>
  <main class="card" role="main">
    <div class="brand"><span class="dot" aria-hidden="true"></span> NexaPay · secure checkout</div>
    <div class="badge" role="status">DEMO · no charge</div>
    <h1>Complete payment</h1>
    <p class="sub">This is a simulated checkout for local demos. No funds move. Your worker has no <code>NEXAPAY_API_KEY</code> configured.</p>
    <div class="amount" aria-label="Amount">${amount}<span>${currency} · ${crypto}</span></div>
    <div class="row"><span class="label">Order</span><span class="value">${order}</span></div>
    <div class="row"><span class="label">Description</span><span class="value">${description}</span></div>
    <div class="actions">
      <a class="btn primary" href="${successUrl}" id="continue">Continue (success)</a>
      <a class="btn ghost" href="${cancelUrl}" id="cancel">Cancel</a>
    </div>
    <p class="note">When you set <strong>NEXAPAY_API_KEY</strong> on the worker, create-payment calls the live NexaPay API instead of this page.</p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(raw: string): string {
  try {
    const u = new URL(raw, 'http://localhost');
    if (u.protocol === 'http:' || u.protocol === 'https:') {
      return escapeHtml(raw);
    }
  } catch {
    /* fall through */
  }
  return '#';
}
