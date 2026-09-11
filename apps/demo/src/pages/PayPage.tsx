import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { createPayment } from '../lib/worker';

type ProviderId = 'stripe' | 'banxa' | 'binance';

const PROVIDERS: {
  id: ProviderId;
  name: string;
  sub: string;
  tag?: string;
  tone: 'stripe' | 'banxa' | 'binance';
  mark: string;
}[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    sub: 'Secure card payment',
    tag: 'Popular',
    tone: 'stripe',
    mark: 'S',
  },
  {
    id: 'banxa',
    name: 'Banxa',
    sub: 'Global coverage',
    tone: 'banxa',
    mark: 'B',
  },
  {
    id: 'binance',
    name: 'Binance Pay',
    sub: 'Crypto-native',
    tag: 'Low cost',
    tone: 'binance',
    mark: 'B',
  },
];

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#10b981" />
      <path
        d="M6.2 10.2l2.4 2.4 5.2-5.2"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CubeMark() {
  return (
    <span className="nx-card__mark" aria-hidden="true">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="16" height="14" rx="4" fill="#93c5fd" opacity="0.9" />
        <rect x="6" y="6" width="16" height="14" rx="4" fill="#c4b5fd" opacity="0.95" />
        <rect x="8" y="2" width="16" height="14" rx="4" fill="#fff" />
      </svg>
    </span>
  );
}

export function PayPage() {
  const [amount, setAmount] = useState('25.00');
  const [description, setDescription] = useState('Demo product');
  const [provider, setProvider] = useState<ProviderId>('banxa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const groupId = useId();

  const displayAmount = (() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0 ? n.toFixed(2) : '0.00';
  })();

  const selectProvider = useCallback((id: ProviderId) => {
    setProvider(id);
  }, []);

  const onProviderKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = PROVIDERS.findIndex((p) => p.id === provider);
    if (idx < 0) return;
    let next = idx;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      next = (idx + 1) % PROVIDERS.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      next = (idx - 1 + PROVIDERS.length) % PROVIDERS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      next = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      next = PROVIDERS.length - 1;
    } else {
      return;
    }
    selectProvider(PROVIDERS[next].id);
    const btn = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next];
    btn?.focus();
  };

  useEffect(() => {
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || loading) return;
      const active = document.activeElement as HTMLElement | null;
      if (active && active !== document.body && typeof active.blur === 'function') {
        active.blur();
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [loading]);

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
      });
      window.location.assign(result.checkout_url!);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <section className="checkout-stage" aria-labelledby="pay-title">
      <h1 id="pay-title" className="visually-hidden">
        NexaPay checkout
      </h1>

      <div className="nx-card">
        <header className="nx-card__head">
          <div className="nx-card__brand">
            <CubeMark />
            <span className="nx-card__name">NexaPay</span>
            <span className="nx-card__badge" role="status">
              DEMO
            </span>
          </div>
          <div className="nx-card__amount" aria-live="polite">
            ${displayAmount}
          </div>
        </header>

        <div className="nx-card__body">
          <div className="nx-card__select-row">
            <span className="nx-card__select-label" id={`${groupId}-label`}>
              Select provider
            </span>
          </div>

          <div
            ref={groupRef}
            className="nx-providers"
            role="radiogroup"
            aria-labelledby={`${groupId}-label`}
            onKeyDown={onProviderKey}
          >
            {PROVIDERS.map((p) => {
              const selected = provider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  className={`nx-provider nx-provider--${p.tone}${selected ? ' is-selected' : ''}`}
                  aria-checked={selected}
                  aria-pressed={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectProvider(p.id)}
                >
                  <span className={`nx-provider__icon nx-provider__icon--${p.tone}`} aria-hidden="true">
                    {p.mark}
                  </span>
                  <span className="nx-provider__copy">
                    <span className="nx-provider__name">{p.name}</span>
                    <span className="nx-provider__sub">{p.sub}</span>
                  </span>
                  {p.tag && !selected ? <span className="nx-provider__tag">{p.tag}</span> : null}
                  {selected ? (
                    <span className="nx-provider__check" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <form className="nx-form" onSubmit={onSubmit} noValidate>
            <div className="nx-fields">
              <label className="nx-field" htmlFor="amount">
                <span className="nx-field__label">Amount (USD)</span>
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
                  disabled={loading}
                />
              </label>
              <label className="nx-field" htmlFor="description">
                <span className="nx-field__label">Description</span>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoComplete="off"
                  disabled={loading}
                />
              </label>
            </div>

            {error ? (
              <div className="alert alert--error" role="alert">
                {error}
              </div>
            ) : null}

            <button
              className="nx-pay"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Starting…' : `Pay $${displayAmount}`}
            </button>
          </form>

          <div className="nx-secure">
            <LockIcon />
            Secured by NexaPay · DEMO no charge until live key
          </div>
        </div>
      </div>

      <section className="checkout-specs" aria-label="Specifications">
        <h2 className="checkout-specs__title">Specs</h2>
        <dl>
          <div className="checkout-spec">
            <dt>Motion</dt>
            <dd>Provider border 160ms · --ease cubic-bezier(0.22, 1, 0.36, 1). Reduced: color only.</dd>
          </div>
          <div className="checkout-spec">
            <dt>Keys</dt>
            <dd>Arrow / Home / End in radiogroup. Escape blurs. aria-pressed on each row.</dd>
          </div>
          <div className="checkout-spec">
            <dt>Settlement</dt>
            <dd>createPayment → worker → checkout_url. Providers decorative until live key.</dd>
          </div>
        </dl>
      </section>
    </section>
  );
}
