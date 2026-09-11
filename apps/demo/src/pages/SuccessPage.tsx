import { Link } from 'react-router-dom';

export function SuccessPage() {
  return (
    <section className="panel center-state panel--lift" aria-labelledby="success-title">
      <div className="icon icon--ok" aria-hidden="true">
        ✓
      </div>
      <h1 id="success-title">Payment complete</h1>
      <p className="lead">
        This is your success return URL. In production, confirm payment status via the
        NexaPay webhook before fulfilling the order.
      </p>
      <div className="btn-row">
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
