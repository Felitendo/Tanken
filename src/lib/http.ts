export async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<{ status: number; data: T }> {
  const response = await fetch(url, init);
  const payload = await response.text();

  if (!response.ok) {
    // Extract useful info from HTML error pages (Cloudflare, rate-limit, etc.)
    const hint = payload.length > 0 && !payload.startsWith('{')
      ? payload.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)
      : payload.slice(0, 120);
    throw new Error(`HTTP ${response.status}: ${hint || response.statusText}`);
  }

  const data = payload ? (JSON.parse(payload) as T) : ({} as T);
  return { status: response.status, data };
}
