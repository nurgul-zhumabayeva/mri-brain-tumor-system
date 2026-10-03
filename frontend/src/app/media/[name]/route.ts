import { API_URL } from "@/lib/api";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const res = await fetch(`${API_URL}/media/${encodeURIComponent(name)}`, { cache: "no-store" });
  if (!res.ok || !res.body) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(res.body, {
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg" },
  });
}
