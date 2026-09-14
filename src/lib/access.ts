export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function normalizedHash(value: string): string {
  return /^[a-f0-9]{64}$/i.test(value.trim()) ? value.trim().toLowerCase() : '';
}
