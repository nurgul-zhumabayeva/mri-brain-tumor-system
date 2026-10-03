import Link from "next/link";
import { TumorChip } from "@/components/TumorChip";
import { api } from "@/lib/api";
import { formatPercent } from "@/lib/model";
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
  const filtered = Boolean(q || tumor_type);

  const link = (p: number) =>
    `/scans?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(tumor_type ? { tumor_type } : {}),
      page: String(p),
    })}`;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Каталог снимков</h1>
        <Link href="/scans/new" className="btn btn-secondary">
          Добавить запись вручную
        </Link>
      </div>

      <form className="panel flex flex-col gap-3 p-3 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          aria-label="Поиск по названию или датасету"
          placeholder="Поиск по названию или датасету"
          className="field mt-0 flex-1"
        />
        <select
          name="tumor_type"
          aria-label="Тип опухоли"
          defaultValue={tumor_type ?? ""}
          className="field mt-0 sm:w-56"
        >
          <option value="">Все типы</option>
          {TUMOR_TYPES.map((t) => (
            <option key={t} value={t}>
              {TUMOR_LABELS[t]}
            </option>
          ))}
        </select>
        <button className="btn btn-primary">Найти</button>
      </form>

      {items.length === 0 ? (
        <div className="panel space-y-3 p-8 text-center">
          <p className="text-lg font-semibold">
            {filtered ? "По этому запросу ничего не найдено" : "В каталоге пока нет снимков"}
          </p>
          <p className="text-muted">
            {filtered
              ? "Измените запрос или сбросьте фильтр."
              : "Загрузите первый снимок, и он появится здесь."}
          </p>
          <Link href={filtered ? "/scans" : "/"} className="btn btn-secondary">
            {filtered ? "Сбросить фильтр" : "Распознать снимок"}
          </Link>
        </div>
      ) : (
        <ul className="panel divide-y divide-line overflow-hidden">
          {items.map((s) => (
            <li key={s.id}>
              <Link
                href={`/scans/${s.id}`}
                className="grid items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-canvas sm:grid-cols-[1fr_auto_10rem]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{s.title}</span>
                  <span className="block truncate text-sm text-muted">{s.dataset}</span>
                </span>
                <span>
                  <TumorChip type={s.tumor_type} />
                </span>
                <span className="text-sm text-muted sm:text-right">
                  {s.confidence !== null
                    ? `ответ модели, ${formatPercent(s.confidence)}`
                    : "метка из датасета"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        {current > 1 ? (
          <Link href={link(current - 1)} className="btn btn-secondary">
            Назад
          </Link>
        ) : (
          <span />
        )}
        <span className="text-sm text-muted">Страница {current}</span>
        {items.length === PAGE_SIZE ? (
          <Link href={link(current + 1)} className="btn btn-secondary">
            Далее
          </Link>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
