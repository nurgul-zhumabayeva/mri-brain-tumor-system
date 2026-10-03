import Link from "next/link";
import { api } from "@/lib/api";
import { TUMOR_LABELS, TUMOR_TYPES } from "@/lib/types";

const PAGE_SIZE = 20;

export default async function ScansPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tumor_type?: string; page?: string }>;
}) {
  const { q, tumor_type, page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const items = await api.list(q, tumor_type, current, PAGE_SIZE);

  const link = (p: number) =>
    `/scans?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(tumor_type ? { tumor_type } : {}),
      page: String(p),
    })}`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">МРТ-снимки</h1>
        <Link href="/scans/new" className="rounded bg-blue-700 px-4 py-2 text-white">
          Добавить
        </Link>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск по названию или датасету"
          className="flex-1 rounded border bg-white px-3 py-2"
        />
        <select
          name="tumor_type"
          defaultValue={tumor_type ?? ""}
          className="rounded border bg-white px-3 py-2"
        >
          <option value="">Все типы</option>
          {TUMOR_TYPES.map((t) => (
            <option key={t} value={t}>
              {TUMOR_LABELS[t]}
            </option>
          ))}
        </select>
        <button className="rounded border bg-white px-4 py-2">Найти</button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600">Ничего не найдено.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((s) => (
            <li key={s.id} className="rounded border bg-white p-4">
              <Link href={`/scans/${s.id}`} className="font-semibold hover:underline">
                {s.title}
              </Link>
              <p className="text-sm text-gray-600">
                {TUMOR_LABELS[s.tumor_type]} · {s.dataset}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between">
        {current > 1 ? <Link href={link(current - 1)}>← Назад</Link> : <span />}
        {items.length === PAGE_SIZE && <Link href={link(current + 1)}>Далее →</Link>}
      </div>
    </section>
  );
}
