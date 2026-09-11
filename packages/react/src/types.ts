export type CheckoutMode = 'redirect' | 'popup';

export interface CreatePaymentResult {
  checkout_url: string;
  order_id?: string;
  payment_id?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  mock?: boolean;
}

export type CreatePaymentFn = () => Promise<CreatePaymentResult>;

export interface UseNexaPayCheckoutOptions {
  createPayment: CreatePaymentFn;
  mode?: CheckoutMode;
  onError?: (error: Error) => void;
  onStart?: () => void;
  popupFeatures?: string;
}

export interface UseNexaPayCheckoutReturn {
  startCheckout: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export interface NexaPayButtonProps extends UseNexaPayCheckoutOptions {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}
