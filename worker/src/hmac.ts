/**
 * Verify NexaPay webhook signature.
 * X-NexaPay-Signature = "sha256=" + HMAC-SHA256(timestamp + "." + rawBody, secret)
 */
export async function verifyNexaPaySignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader || !timestampHeader) return false;

  const expectedPrefix = 'sha256=';
  const provided = signatureHeader.startsWith(expectedPrefix)
    ? signatureHeader.slice(expectedPrefix.length)
    : signatureHeader;

  const payload = `${timestampHeader}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');

  return timingSafeEqual(hex, provided.toLowerCase());
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}
