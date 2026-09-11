import { useCallback, useMemo } from 'react';
import { NexaPayButton } from '@nexapay-kit/react';
import { createPayment, workerBase } from '../lib/worker';

const SNIPPET = `import { NexaPayButton } from '@nexapay-kit/react';

async function createPayment() {
  const res = await fetch('https://YOUR_WORKER/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 19.0,
      description: 'Pro plan',
      currency: 'USD',
      crypto: 'USDC',
    }),
  });
  const data = await res.json();
  if (!data.checkout_url) throw new Error(data.message || 'No checkout_url');
  return { checkout_url: data.checkout_url, order_id: data.order_id };
}

export function Checkout() {
  return (
    <NexaPayButton createPayment={createPayment} mode="redirect">
      Pay with NexaPay
    </NexaPayButton>
  );
}`;

export function EmbedPage() {
  const create = useCallback(async () => {
    const data = await createPayment({
      amount: 19,
      description: 'Embed demo — Pro plan',
      currency: 'USD',
      crypto: 'USDC',
    });
    return {
      checkout_url: data.checkout_url!,
      order_id: data.order_id,
      payment_id: data.payment_id,
      amount: data.amount,
      currency: data.currency,
      mock: data.mock,
    };
  }, []);

  const workerHint = useMemo(() => workerBase(), []);

  return (
    <section aria-labelledby="embed-title">
      <p className="status-pill">React drop-in</p>
      <h1 id="embed-title">Embed</h1>
      <p className="lead">
        Drop-in <code>NexaPayButton</code> wired to the local worker at{' '}
        <code>{workerHint}</code>. Keys never leave the Worker.
      </p>

      <div className="embed-live">
        <div className="panel panel--lift">
          <h2>Live button</h2>
          <p className="hint" style={{ marginTop: 0, marginBottom: '1rem' }}>
            Starts checkout via <code>POST /create-payment</code>. In mock mode you get
            the Worker&apos;s demo checkout page.
          </p>
          <NexaPayButton createPayment={create} mode="redirect" onError={console.error}>
            Pay $19 with NexaPay
          </NexaPayButton>
        </div>

        <div className="panel panel--soft">
          <h2>Usage snippet</h2>
          <pre className="pre" tabIndex={0}>
            <code>{SNIPPET}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
