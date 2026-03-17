export async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<{ status: number; data: T }> {
  const response = await fetch(url, init);
  const payload = await response.text();
  const data = payload ? (JSON.parse(payload) as T) : ({} as T);
  return {
    status: response.status,
    data
  };
}
