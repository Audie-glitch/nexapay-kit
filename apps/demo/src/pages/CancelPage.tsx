import { Link } from 'react-router-dom';

export function CancelPage() {
  return (
    <section className="panel center-state panel--lift" aria-labelledby="cancel-title">
      <div className="icon icon--cancel" aria-hidden="true">
        –
      </div>
      <h1 id="cancel-title">Checkout canceled</h1>
      <p className="lead">
        No charge was made. The buyer left checkout before completing payment.
      </p>
      <div className="btn-row">
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
