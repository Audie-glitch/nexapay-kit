import { Link } from 'react-router-dom';

export function SuccessPage() {
  return (
    <section className="panel center-state" aria-labelledby="success-title">
      <div className="icon" aria-hidden="true">
        ✓
      </div>
      <h1 id="success-title">Payment complete</h1>
      <p className="lead" style={{ marginInline: 'auto' }}>
        This is your success return URL. In production, confirm payment status via the
        NexaPay webhook before fulfilling the order.
      </p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <Link className="btn btn--primary" to="/pay">
          Make another payment
        </Link>
        <Link className="btn btn--ghost" to="/">
          Back home
        </Link>
      </div>
    </section>
  );
}
