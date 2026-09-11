import type { NexaPayButtonProps } from './types';
import { useNexaPayCheckout } from './useNexaPayCheckout';

/**
 * Drop-in checkout button. Wire createPayment to your Cloudflare Worker
 * (or any backend) that holds the NexaPay API key.
 */
export function NexaPayButton({
  createPayment,
  mode = 'redirect',
  onError,
  onStart,
  popupFeatures,
  children = 'Pay with NexaPay',
  className,
  disabled,
  'aria-label': ariaLabel,
}: NexaPayButtonProps) {
  const { startCheckout, loading, error } = useNexaPayCheckout({
    createPayment,
    mode,
    onError,
    onStart,
    popupFeatures,
  });

  return (
    <span className={className ? `nexapay-btn-wrap ${className}` : 'nexapay-btn-wrap'}>
      <button
        type="button"
        className="nexapay-btn"
        onClick={() => void startCheckout()}
        disabled={disabled || loading}
        aria-label={ariaLabel ?? (typeof children === 'string' ? children : 'Pay with NexaPay')}
        aria-busy={loading}
      >
        {loading ? 'Starting checkout…' : children}
      </button>
      {error ? (
        <span className="nexapay-btn-error" role="alert">
          {error.message}
        </span>
      ) : null}
    </span>
  );
}
