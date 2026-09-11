/**
 * Pretty mock NexaPay-style checkout page for local demos (no API key).
 * Purple stage + white provider widget. Never charges real money.
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
  <meta name="theme-color" content="#635BFF" />
  <title>NexaPay Checkout (DEMO)</title>
  <style>
    :root {
      --navy: #0A2540;
      --accent: #635BFF;
      --ok: #10b981;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --radius: 0.75rem;
      --shadow-lg: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3);
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      --font: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
    body {
      margin: 0; min-height: 100dvh; font-family: var(--font);
      color: var(--text);
      background: linear-gradient(145deg, var(--navy) 0%, #1e1b4b 42%, var(--accent) 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 1.5rem 1rem 2rem;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      width: 100%; max-width: 400px;
      background: #fff;
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    .head {
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.75rem; padding: 0.9rem 1.1rem;
      background: var(--accent); color: #fff;
    }
    .brand { display: flex; align-items: center; gap: 0.55rem; font-weight: 700; letter-spacing: -0.02em; }
    .mark { width: 1.5rem; height: 1.5rem; display: grid; place-items: center; }
    .mark svg { width: 100%; height: 100%; display: block; }
    .badge {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; opacity: 0.85;
      border: 1px solid rgba(255,255,255,0.45);
      padding: 0.2rem 0.45rem; border-radius: 999px;
    }
    .amount {
      font-size: 1.35rem; font-weight: 800; letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }
    .body { padding: 1.1rem 1.15rem 1.15rem; }
    .select-label {
      display: block; font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted);
      margin-bottom: 0.65rem;
    }
    .meta {
      font-size: 0.8125rem; color: var(--muted); margin: 0 0 0.85rem; line-height: 1.45;
    }
    .meta strong { color: var(--text); font-weight: 650; }
    .providers { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
    .provider {
      display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.7rem;
      width: 100%; text-align: left; padding: 0.7rem 0.8rem;
      border: 1.5px solid var(--border); border-radius: var(--radius);
      background: #fff; cursor: pointer; font: inherit; color: inherit;
      transition: border-color 160ms var(--ease), box-shadow 160ms var(--ease);
    }
    .provider:hover { border-color: #cbd5e1; }
    .provider:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .provider.is-selected {
      border-color: var(--ok);
      box-shadow: 0 0 0 1px var(--ok);
    }
    .icon {
      width: 2rem; height: 2rem; border-radius: 0.45rem;
      display: grid; place-items: center; color: #fff; font-weight: 800; font-size: 0.85rem;
    }
    .icon--stripe { background: #635bff; }
    .icon--banxa { background: #10b981; }
    .icon--binance { background: #f0b90b; color: #0a2540; }
    .copy { display: grid; gap: 0.1rem; min-width: 0; }
    .name { font-weight: 650; font-size: 0.9375rem; color: var(--text); }
    .sub { font-size: 0.75rem; color: var(--muted); }
    .tag {
      font-size: 0.65rem; font-weight: 700; color: var(--accent);
      background: rgba(99,91,255,0.1); padding: 0.2rem 0.45rem; border-radius: 999px;
    }
    .check { width: 1.25rem; height: 1.25rem; }
    .check svg { width: 100%; height: 100%; display: block; }
    .actions { display: grid; gap: 0.55rem; }
    a.btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 100%; min-height: 3rem; border-radius: var(--radius);
      font-size: 1rem; font-weight: 650; text-decoration: none; font-family: inherit;
      transition: transform 150ms var(--ease), box-shadow 150ms var(--ease);
    }
    a.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .primary {
      background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%);
      color: #fff; box-shadow: 0 4px 14px rgba(99, 91, 255, 0.35);
    }
    .primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99, 91, 255, 0.42); }
    .ghost {
      background: transparent; color: var(--muted); border: 1px solid var(--border);
      min-height: 2.75rem; font-size: 0.9rem;
    }
    .ghost:hover { color: var(--text); border-color: #cbd5e1; }
    .secure {
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      margin-top: 0.95rem; font-size: 0.75rem; color: var(--muted);
    }
    .secure svg { width: 0.85rem; height: 0.85rem; color: var(--accent); }
    .specs {
      width: 100%; max-width: 400px; margin-top: 1.35rem;
      color: rgba(255,255,255,0.78); font-size: 0.78rem;
    }
    .specs h2 {
      margin: 0 0 0.55rem; font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55);
    }
    .specs dl { margin: 0; display: grid; gap: 0.45rem; }
    .spec { display: grid; grid-template-columns: 5.5rem 1fr; gap: 0.5rem; }
    .spec dt {
      font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
      font-size: 0.65rem; color: rgba(255,255,255,0.5); padding-top: 0.1rem;
    }
    .spec dd { margin: 0; line-height: 1.4; color: rgba(255,255,255,0.82); }
  </style>
</head>
<body>
  <main class="card" role="main">
    <header class="head">
      <div class="brand">
        <span class="mark" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="10" width="16" height="14" rx="4" fill="#93c5fd" opacity="0.9"/>
            <rect x="6" y="6" width="16" height="14" rx="4" fill="#c4b5fd" opacity="0.95"/>
            <rect x="8" y="2" width="16" height="14" rx="4" fill="#fff"/>
          </svg>
        </span>
        NexaPay
        <span class="badge" role="status">DEMO</span>
      </div>
      <div class="amount" aria-label="Amount">${amount} ${currency}</div>
    </header>
    <div class="body">
      <span class="select-label" id="provider-label">Select provider</span>
      <p class="meta"><strong>${description}</strong> · ${crypto} settlement · order <code style="font-size:0.75em">${order}</code></p>
      <div class="providers" role="radiogroup" aria-labelledby="provider-label" id="providers">
        <button type="button" class="provider" role="radio" aria-checked="false" aria-pressed="false" data-id="stripe" tabindex="-1">
          <span class="icon icon--stripe" aria-hidden="true">S</span>
          <span class="copy"><span class="name">Stripe</span><span class="sub">Secure card payment</span></span>
          <span class="tag">Popular</span>
        </button>
        <button type="button" class="provider is-selected" role="radio" aria-checked="true" aria-pressed="true" data-id="banxa" tabindex="0">
          <span class="icon icon--banxa" aria-hidden="true">B</span>
          <span class="copy"><span class="name">Banxa</span><span class="sub">Global coverage</span></span>
          <span class="check" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#10b981"/><path d="M6.2 10.2l2.4 2.4 5.2-5.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </button>
        <button type="button" class="provider" role="radio" aria-checked="false" aria-pressed="false" data-id="binance" tabindex="-1">
          <span class="icon icon--binance" aria-hidden="true">B</span>
          <span class="copy"><span class="name">Binance Pay</span><span class="sub">Crypto-native</span></span>
          <span class="tag">Low cost</span>
        </button>
      </div>
      <div class="actions">
        <a class="btn primary" href="${successUrl}" id="continue">Continue · $${amount}</a>
        <a class="btn ghost" href="${cancelUrl}" id="cancel">Cancel</a>
      </div>
      <div class="secure">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>
        </svg>
        Secured by NexaPay · DEMO no charge
      </div>
    </div>
  </main>
  <section class="specs" aria-label="Specifications">
    <h2>Specs</h2>
    <dl>
      <div class="spec"><dt>Motion</dt><dd>Border 160ms · cubic-bezier(0.22, 1, 0.36, 1). Reduced: color only.</dd></div>
      <div class="spec"><dt>Keys</dt><dd>Arrow / Home / End. Escape blurs. Decorative providers.</dd></div>
      <div class="spec"><dt>Settlement</dt><dd>Continue → success_url. Cancel → cancel_url. No live charge.</dd></div>
    </dl>
  </section>
  <script>
    (function () {
      var root = document.getElementById('providers');
      if (!root) return;
      var items = Array.prototype.slice.call(root.querySelectorAll('[role="radio"]'));
      var checkSvg = '<span class="check" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#10b981"/><path d="M6.2 10.2l2.4 2.4 5.2-5.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
      var tags = { stripe: 'Popular', binance: 'Low cost' };
      function select(id) {
        items.forEach(function (btn) {
          var on = btn.getAttribute('data-id') === id;
          btn.classList.toggle('is-selected', on);
          btn.setAttribute('aria-checked', on ? 'true' : 'false');
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          btn.tabIndex = on ? 0 : -1;
          var trailing = btn.querySelector('.tag, .check');
          if (trailing) trailing.remove();
          if (on) {
            btn.insertAdjacentHTML('beforeend', checkSvg);
          } else if (tags[btn.getAttribute('data-id')]) {
            var t = document.createElement('span');
            t.className = 'tag';
            t.textContent = tags[btn.getAttribute('data-id')];
            btn.appendChild(t);
          }
        });
      }
      items.forEach(function (btn) {
        btn.addEventListener('click', function () { select(btn.getAttribute('data-id')); });
      });
      root.addEventListener('keydown', function (e) {
        var idx = items.findIndex(function (b) { return b.getAttribute('aria-checked') === 'true'; });
        if (idx < 0) idx = 0;
        var next = idx;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); next = (idx + 1) % items.length; }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); next = (idx - 1 + items.length) % items.length; }
        else if (e.key === 'Home') { e.preventDefault(); next = 0; }
        else if (e.key === 'End') { e.preventDefault(); next = items.length - 1; }
        else return;
        select(items[next].getAttribute('data-id'));
        items[next].focus();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      });
    })();
  </script>
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
