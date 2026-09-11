import { Link } from 'react-router-dom';

export function CancelPage() {
  return (
    <section className="panel center-state" aria-labelledby="cancel-title">
      <div className="icon" aria-hidden="true">
        –
      </div>
      <h1 id="cancel-title">Checkout canceled</h1>
      <p className="lead" style={{ marginInline: 'auto' }}>
        No charge was made. The buyer left checkout before completing payment.
      </p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <Link className="btn btn--primary" to="/pay">
          Try again
        </Link>
        <Link className="btn btn--ghost" to="/">
          Back home
        </Link>
      </div>
    </section>
  );
}
