import { Link } from 'react-router-dom';

function CheckIcon() {
  return (
    <span className="check-icon" aria-hidden="true">
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
      </svg>
    </span>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="hero-badge">
            <CheckIcon />
            Lowest fees from 16+ providers
          </p>
          <h1 id="hero-title">
            Accept <span className="grad-text">cards</span>. Settle in{' '}
            <span className="grad-text">crypto</span>.
          </h1>
          <p className="lead">
            Drop NexaPay checkout into any site. Cards in, USDC out — Worker stub, React
            button, and a polished demo that mirrors nexapay.one.
          </p>
          <ul className="feature-checks">
            <li>
              <CheckIcon />
              Instant card → USDC settlement
            </li>
            <li>
              <CheckIcon />
              API keys stay on the Worker
            </li>
            <li>
              <CheckIcon />
              Mock checkout when no key set
            </li>
            <li>
              <CheckIcon />
              Webhook HMAC ready
            </li>
          </ul>
          <div className="btn-row">
            <Link className="btn btn--primary" to="/pay">
              Try checkout
            </Link>
            <Link className="btn btn--ghost" to="/embed">
              Embed button
            </Link>
          </div>
          <p className="trust-line">Trusted pattern for 195+ countries · Instant delivery</p>
        </div>

        <aside className="buy-widget" aria-label="Live-looking checkout preview">
          <div className="buy-widget__methods" aria-hidden="true">
            <span className="method-pill">Apple Pay</span>
            <span className="method-pill">Google Pay</span>
            <span className="method-pill">Visa</span>
            <span className="method-pill">Mastercard</span>
          </div>
          <div className="buy-field">
            <div>
              <span className="buy-field__label">You spend</span>
              <div className="buy-field__value">25.00</div>
            </div>
            <div className="buy-field__meta">
              <div className="buy-field__currency">USD ▾</div>
              <div className="buy-field__sub">Card</div>
            </div>
          </div>
          <div className="buy-field">
            <div>
              <span className="buy-field__label">You receive</span>
              <div className="buy-field__value">25.00</div>
            </div>
            <div className="buy-field__meta">
              <div className="buy-field__currency">USDC</div>
              <div className="buy-field__sub">USD Coin</div>
            </div>
          </div>
          <div className="buy-widget__rate">
            <span>1 USDC ≈ $1.00</span>
            <span>Fees included</span>
          </div>
          <Link className="btn btn--primary btn--block btn--lg" to="/pay" style={{ marginTop: '0.85rem' }}>
            Buy USDC
          </Link>
          <div className="buy-widget__secure">
            <LockIcon />
            Secured by NexaPay · Demo kit
          </div>
        </aside>
      </section>

      <section className="grid-cards" aria-label="Kit contents">
        <article className="panel card-mini">
          <div className="card-mini__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <h3>Demo app</h3>
          <p>Marketing-grade Pay and Embed flows you can walk through without charging anyone.</p>
        </article>
        <article className="panel card-mini">
          <div className="card-mini__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </div>
          <h3>React package</h3>
          <p>
            <code>NexaPayButton</code> and <code>useNexaPayCheckout</code> — redirect or popup
            mode.
          </p>
        </article>
        <article className="panel card-mini">
          <div className="card-mini__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
            </svg>
          </div>
          <h3>Worker stub</h3>
          <p>
            Health, create-payment, webhooks, and a simulated <code>/demo/checkout</code> when
            no API key is set.
          </p>
        </article>
      </section>
    </>
  );
}
