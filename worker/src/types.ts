export interface Env {
  NEXAPAY_API_KEY?: string;
  NEXAPAY_WEBHOOK_SECRET?: string;
  PUBLIC_BASE_URL?: string;
  SUCCESS_URL?: string;
  CANCEL_URL?: string;
  ALLOWED_ORIGIN?: string;
}

export interface CreatePaymentBody {
  amount: number | string;
  description?: string;
  currency?: string;
  crypto?: string;
  customer_email?: string;
  success_url?: string;
  cancel_url?: string;
  callback_url?: string;
}

export interface NexaPayPayment {
  id: string;
  order_id: string;
  amount: number | string;
  currency: string;
  status: string;
  checkout_url: string;
}

export interface NexaPayCreateResponse {
  success: boolean;
  payment?: NexaPayPayment;
  error?: string;
  message?: string;
}
