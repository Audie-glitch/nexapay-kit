import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const current = (path: string) => (pathname === path ? 'page' : undefined);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="logo" aria-label="NexaPay Kit home">
            <span className="logo__mark" aria-hidden="true" />
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
        </div>
      </header>
      <main id="main" className="page">
        {children}
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          Generic NexaPay integration kit ·{' '}
          <a href="https://nexapay.one/docs" rel="noreferrer" target="_blank">
            nexapay.one/docs
          </a>
        </div>
      </footer>
    </>
  );
}
