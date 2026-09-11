const DEFAULT_WORKER = 'http://127.0.0.1:8787';

export function workerBase(): string {
  const raw = import.meta.env.VITE_WORKER_URL || DEFAULT_WORKER;
  return raw.replace(/\/$/, '');
}

export interface CreatePaymentRequest {
  amount: number;
  description?: string;
  currency?: string;
  crypto?: string;
  customer_email?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CreatePaymentResponse {
  success?: boolean;
  mock?: boolean;
  status?: string;
  message?: string;
  checkout_url?: string;
  order_id?: string;
  payment_id?: string;
  amount?: number | string;
  currency?: string;
  error?: string;
}

export async function createPayment(
  body: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const payload = {
    ...body,
    success_url: body.success_url || `${origin}/success`,
    cancel_url: body.cancel_url || `${origin}/cancel`,
  };

  const res = await fetch(`${workerBase()}/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as CreatePaymentResponse;
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }
  if (!data.checkout_url) {
    throw new Error(data.message || data.error || 'No checkout_url returned');
  }
  return data;
}

export async function fetchHealth(): Promise<{ ok: boolean; configured: boolean }> {
  const res = await fetch(`${workerBase()}/health`);
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return (await res.json()) as { ok: boolean; configured: boolean };
}
