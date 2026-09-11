import { useCallback, useRef, useState } from 'react';
import type {
  UseNexaPayCheckoutOptions,
  UseNexaPayCheckoutReturn,
} from './types';

const DEFAULT_POPUP =
  'width=480,height=720,menubar=no,toolbar=no,location=yes,status=yes,resizable=yes,scrollbars=yes';

/**
 * Hook that starts a NexaPay checkout via your backend create-payment endpoint.
 * Never pass API keys here — createPayment must call YOUR worker/server.
 */
export function useNexaPayCheckout(
  options: UseNexaPayCheckoutOptions
): UseNexaPayCheckoutReturn {
  const {
    createPayment,
    mode = 'redirect',
    onError,
    onStart,
    popupFeatures = DEFAULT_POPUP,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const popupRef = useRef<Window | null>(null);

  const startCheckout = useCallback(async () => {
    setError(null);
    setLoading(true);
    onStart?.();

    try {
      const result = await createPayment();
      if (!result?.checkout_url) {
        throw new Error('createPayment did not return a checkout_url');
      }

      if (mode === 'popup') {
        popupRef.current = window.open(
          result.checkout_url,
          'nexapay_checkout',
          popupFeatures
        );
        if (!popupRef.current) {
          // Popup blocked — fall back to redirect
          window.location.assign(result.checkout_url);
        }
      } else {
        window.location.assign(result.checkout_url);
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      onError?.(e);
    } finally {
      setLoading(false);
    }
  }, [createPayment, mode, onError, onStart, popupFeatures]);

  return { startCheckout, loading, error };
}
