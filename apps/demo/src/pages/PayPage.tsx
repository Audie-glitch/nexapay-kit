import { useState } from 'react';
import type { FormEvent } from 'react';
import { createPayment } from '../lib/worker';

export function PayPage() {
  const [amount, setAmount] = useState('9.99');
  const [description, setDescription] = useState('Demo product');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter a valid amount greater than zero.');
      return;
    }

    setLoading(true);
    try {
      const result = await createPayment({
        amount: value,
        description: description.trim() || 'Payment',
        currency: 'USD',
        crypto: 'USDC',
        customer_email: email.trim() || undefined,
      });
      window.location.assign(result.checkout_url!);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="pay-title">
      <h1 id="pay-title">Pay</h1>
      <p className="lead">
        Generic checkout form. Submits to your Worker&apos;s{' '}
        <code>/create-payment</code> endpoint, then redirects to NexaPay (or the local
        demo checkout when no API key is configured).
      </p>

      <div className="panel" style={{ maxWidth: '28rem' }}>
        <form className="form" onSubmit={onSubmit} noValidate>
          <label htmlFor="amount">
            Amount (USD)
            <span className="hint">Charged as USDC via NexaPay when live</span>
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoComplete="off"
            />
          </label>

          <label htmlFor="description">
            Description
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
          </label>

          <label htmlFor="email">
            Customer email <span className="hint">(optional)</span>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          {error ? (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          ) : null}

          <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
            {loading ? 'Starting checkout…' : 'Pay with card'}
          </button>
        </form>
      </div>
    </section>
  );
}
