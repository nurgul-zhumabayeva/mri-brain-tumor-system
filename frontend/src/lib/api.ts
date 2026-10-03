import type { Scan, ScanInput } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  list(q?: string, tumorType?: string, page = 1, pageSize = 20) {
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String((page - 1) * pageSize),
    });
    if (q) params.set("q", q);
    if (tumorType) params.set("tumor_type", tumorType);
    return request<Scan[]>(`/scans?${params}`);
  },

  async get(id: number): Promise<Scan | null> {
    const res = await fetch(`${API_URL}/scans/${id}`, { cache: "no-store" });
    if (res.status === 404 || res.status === 422) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  },

  create(data: ScanInput) {
    return request<Scan>("/scans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: Partial<ScanInput>) {
    return request<Scan>(`/scans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  remove(id: number) {
    return request<void>(`/scans/${id}`, { method: "DELETE" });
  },
};
