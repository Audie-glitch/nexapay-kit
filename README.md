# NexaPay Kit

Generic, brand-agnostic integration kit for [NexaPay](https://nexapay.one/docs): a Vite + React demo site, a drop-in React button/hook package, and a Cloudflare Worker backend stub.

Use this to accept NexaPay checkouts from **any** website. API keys stay on the Worker — never in the frontend.

## What’s included

| Path | Purpose |
|------|---------|
| `apps/demo` | Mobile-first demo UI (`/`, `/pay`, `/success`, `/cancel`, `/embed`) |
| `packages/react` | `NexaPayButton` + `useNexaPayCheckout` |
| `worker` | Cloudflare Worker: health, create-payment, webhooks, mock checkout |

## Quick start (local)

```bash
cd nexapay-kit
npm install

# Terminal 1 — Worker (mock mode when no API key)
npm run dev:worker
# → http://127.0.0.1:8787

# Terminal 2 — Demo UI
npm run dev
# → http://127.0.0.1:5173
```

Optional: copy `worker/.dev.vars.example` → `worker/.dev.vars` and set secrets for live mode.

```bash
npm run build   # builds react package + demo
```

## Integrate into any site

### 1. Deploy the Worker

```bash
cd worker
npx wrangler deploy
npx wrangler secret put NEXAPAY_API_KEY          # cg_live_…
npx wrangler secret put NEXAPAY_WEBHOOK_SECRET   # for HMAC verification
```

Set vars in `wrangler.toml` or the Cloudflare dashboard:

- `PUBLIC_BASE_URL` — your worker’s public origin
- `SUCCESS_URL` / `CANCEL_URL` — defaults if the client omits them
- `ALLOWED_ORIGIN` — `*` for demos, or your site origin(s), comma-separated

### 2. Point create-payment at the Worker

From your backend **or** browser (the Worker holds the key):

```http
POST https://YOUR_WORKER/create-payment
Content-Type: application/json

{
  "amount": 19.0,
  "description": "Pro plan",
  "currency": "USD",
  "crypto": "USDC",
  "customer_email": "buyer@example.com",
  "success_url": "https://yoursite.example/success",
  "cancel_url": "https://yoursite.example/cancel"
}
```

Response (live or mock):

```json
{
  "success": true,
  "checkout_url": "https://…",
  "order_id": "…",
  "payment_id": "…",
  "amount": 19,
  "currency": "USD"
}
```

Redirect the buyer to `checkout_url`.

### 3. Use `NexaPayButton` or raw `fetch`

```tsx
import { NexaPayButton } from '@nexapay-kit/react';

<NexaPayButton
  mode="redirect" // or "popup"
  createPayment={async () => {
    const res = await fetch('https://YOUR_WORKER/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 19, description: 'Pro plan' }),
    });
    const data = await res.json();
    if (!data.checkout_url) throw new Error(data.message || 'No checkout_url');
    return { checkout_url: data.checkout_url, order_id: data.order_id };
  }}
>
  Pay with NexaPay
</NexaPayButton>
```

Or call `useNexaPayCheckout` for custom UI.

In this monorepo the demo imports the package via workspace/alias. In your app, either:

- add a path dependency / publish `@nexapay-kit/react`, or
- copy `packages/react/src` into your project.

### 4. Success, cancel, and webhooks

- **Success / cancel** — static pages on your site (see demo `/success` and `/cancel`).
- **Webhook** — `POST /webhooks/nexapay` on the Worker.

NexaPay signs webhooks with HMAC-SHA256:

- Header `X-NexaPay-Timestamp`
- Header `X-NexaPay-Signature` = `sha256=` + HMAC(`timestamp + '.' + rawBody`, secret)

When `NEXAPAY_WEBHOOK_SECRET` is set, the Worker **fails closed** (401 on bad/missing signature). When unset (mock), it logs and returns 200.

Always fulfill orders from verified webhooks, not from the success URL alone.

### 5. Mock vs live

| Mode | When | Behavior |
|------|------|----------|
| **Mock** | `NEXAPAY_API_KEY` missing | `POST /create-payment` returns `mock: true` and a `checkout_url` pointing at Worker `/demo/checkout?…` — pretty DEMO UI, Continue → success, Cancel → cancel. **No real charges.** |
| **Live** | `NEXAPAY_API_KEY` set | Worker calls `https://nexapay.one/api/v1/payments` with `X-API-Key`. |

`GET /health` → `{ ok: true, configured: boolean }`.

## NexaPay API (reference)

- Base: `https://nexapay.one/api/v1`
- Auth: `X-API-Key: cg_live_…` (**server only**)
- `POST /payments` body: `amount`, `currency` (USD), `crypto` (USDC), `description`, `customer_email?`, `success_url`, `cancel_url`, `callback_url`
- Docs: [https://nexapay.one/docs](https://nexapay.one/docs)

## Worker endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness + `configured` |
| `POST` | `/create-payment` | Create checkout (live or mock) |
| `GET` | `/demo/checkout` | Simulated checkout HTML (mock) |
| `POST` | `/webhooks/nexapay` | Webhook receiver (HMAC when secret set) |
| `OPTIONS` | `*` | CORS preflight |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Demo Vite app on **5173** |
| `npm run dev:worker` | Wrangler dev on **8787** |
| `npm run build` | Build React package + demo |
| `npm run build:worker` | Wrangler dry-run bundle |

## Env vars

**Demo (`apps/demo`)**

- `VITE_WORKER_URL` — default `http://127.0.0.1:8787`

**Worker**

- `NEXAPAY_API_KEY` — live API key (secret)
- `NEXAPAY_WEBHOOK_SECRET` — webhook HMAC secret (secret)
- `PUBLIC_BASE_URL` — worker public URL (for mock checkout links & callback default)
- `SUCCESS_URL` / `CANCEL_URL` — defaults
- `ALLOWED_ORIGIN` — CORS (`*` or comma-separated origins)

## Security notes

- Never expose `NEXAPAY_API_KEY` or webhook secrets to the browser.
- Verify webhooks with HMAC; fail closed in production.
- Restrict `ALLOWED_ORIGIN` in production.

## License

MIT
