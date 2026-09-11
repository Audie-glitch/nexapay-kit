import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

function LogoMark() {
  return (
    <span className="logo__mark" aria-hidden="true">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="16" height="14" rx="4" fill="#2563eb" opacity="0.85" />
        <rect x="6" y="6" width="16" height="14" rx="4" fill="#4f46e5" opacity="0.95" />
        <rect x="8" y="2" width="16" height="14" rx="4" fill="#635bff" />
      </svg>
    </span>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isCheckout = pathname === '/pay';
  const current = (path: string) => (pathname === path ? 'page' : undefined);

  if (isCheckout) {
    return (
      <div className="is-checkout">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="checkout-chrome">
          <div className="checkout-chrome__inner">
            <Link to="/" className="checkout-chrome__logo" aria-label="NexaPay Kit home">
              <LogoMark />
              <span>NexaPay</span>
              <span className="checkout-chrome__demo" aria-hidden="true">
                Demo
              </span>
            </Link>
            <Link to="/" className="checkout-chrome__back">
              Overview
            </Link>
          </div>
        </header>
        <main id="main" className="checkout-main">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="logo" aria-label="NexaPay Kit home">
            <LogoMark />
            NexaPay Kit
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link to="/" aria-current={current('/')}>
              Overview
            </Link>
            <Link to="/pay" aria-current={current('/pay')}>
              Pay
            </Link>
            <Link to="/embed" aria-current={current('/embed')}>
              Embed
            </Link>
          </nav>
          <a
            className="header-cta"
            href="https://nexapay.one/docs"
            target="_blank"
            rel="noreferrer"
          >
            Docs →
          </a>
        </div>
      </header>
      <main id="main" className="page">
        {children}
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          NexaPay Kit · drop-in checkout for any site ·{' '}
          <a href="https://nexapay.one/docs" rel="noreferrer" target="_blank">
            nexapay.one/docs
          </a>
        </div>
      </footer>
    </>
  );
}
