import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="status-pill">Drop-in kit · any site</p>
          <h1 id="hero-title">NexaPay Kit</h1>
          <p className="lead">
            A clean integration pack for accepting NexaPay checkouts from any website:
            polished demo UI, a Cloudflare Worker backend stub, and a React button/hook
            you can copy into your product. API keys stay on the server — never in the
            browser.
          </p>
          <div className="btn-row">
            <Link className="btn btn--primary" to="/pay">
              Try Pay page
            </Link>
            <Link className="btn btn--ghost" to="/embed">
              See embed button
            </Link>
            <a
              className="btn btn--ghost"
              href="https://nexapay.one/docs"
              target="_blank"
              rel="noreferrer"
            >
              API docs
            </a>
          </div>
        </div>
        <aside className="panel panel--soft" aria-label="How it works">
          <h2>How to drop into any site</h2>
          <ol className="steps">
            <li>
              <span className="step-num">1</span>
              <span>Deploy the Worker; set <code>NEXAPAY_API_KEY</code> (optional for mock).</span>
            </li>
            <li>
              <span className="step-num">2</span>
              <span>POST from your frontend to Worker <code>/create-payment</code>.</span>
            </li>
            <li>
              <span className="step-num">3</span>
              <span>Redirect the buyer to <code>checkout_url</code>.</span>
            </li>
            <li>
              <span className="step-num">4</span>
              <span>Handle success/cancel pages + webhook HMAC verification.</span>
            </li>
          </ol>
        </aside>
      </section>

      <section className="grid-cards" aria-label="Kit contents">
        <article className="panel card-mini">
          <h3>Demo app</h3>
          <p>Mobile-first checkout pages you can walk through without charging anyone.</p>
        </article>
        <article className="panel card-mini">
          <h3>React package</h3>
          <p>
            <code>NexaPayButton</code> and <code>useNexaPayCheckout</code> — redirect or
            popup mode.
          </p>
        </article>
        <article className="panel card-mini">
          <h3>Worker stub</h3>
          <p>
            Health, create-payment, webhooks, and a simulated <code>/demo/checkout</code>{' '}
            when no API key is set.
          </p>
        </article>
      </section>
    </>
  );
}
