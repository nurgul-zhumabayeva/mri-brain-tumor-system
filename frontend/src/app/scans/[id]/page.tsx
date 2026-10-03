import Link from "next/link";
import { notFound } from "next/navigation";
import { ScanForm } from "@/components/ScanForm";
import { TumorChip } from "@/components/TumorChip";
import { api } from "@/lib/api";
import { formatPercent } from "@/lib/model";
import { PLANE_LABELS, TUMOR_LABELS } from "@/lib/types";
import { deleteScan, updateScan } from "../actions";

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scanId = Number(id);
  if (!Number.isInteger(scanId)) notFound();
  const scan = await api.get(scanId);
  if (!scan) notFound();

  const predicted = scan.predicted_label !== null && scan.confidence !== null;

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <Link href="/scans" className="text-sm font-semibold text-primary hover:underline">
          Каталог снимков
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="page-title break-all">{scan.title}</h1>
          <TumorChip type={scan.tumor_type} />
        </div>
      </header>

      <div className={`grid gap-6 ${scan.image_path ? "lg:grid-cols-[24rem_1fr]" : ""}`}>
        {scan.image_path && (
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-film">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/media/${scan.image_path}`}
              alt={`МРТ-снимок ${scan.title}`}
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <div className="space-y-6">
          {predicted && (
            <section className="panel space-y-3 p-5">
              <h2 className="text-sm font-semibold text-muted">Ответ модели</h2>
              <p className="text-3xl font-semibold tracking-tight">
                {TUMOR_LABELS[scan.predicted_label!]}
              </p>
              <div>
                <div className="h-2.5 overflow-hidden rounded-full bg-canvas">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${scan.confidence! * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted">
                  Уверенность модели{" "}
                  <span className="font-semibold text-ink">{formatPercent(scan.confidence!)}</span>
                </p>
              </div>
              {scan.predicted_label !== scan.tumor_type && (
                <p className="rounded-[10px] bg-primary-soft px-3 py-2 text-sm">
                  Тип в записи исправлен вручную на «{TUMOR_LABELS[scan.tumor_type]}» и отличается
                  от ответа модели.
                </p>
              )}
            </section>
          )}

          <dl className="panel grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted">Источник</dt>
              <dd>{scan.dataset}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Плоскость</dt>
              <dd>{scan.plane ? PLANE_LABELS[scan.plane] : "Не указана"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Имя файла</dt>
              <dd className="break-all">{scan.file_name ?? "Не указано"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Добавлен</dt>
              <dd>{new Date(scan.created_at).toLocaleDateString("ru-RU")}</dd>
            </div>
            {scan.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Описание</dt>
                <dd className="whitespace-pre-line">{scan.description}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <details className="panel p-5">
        <summary className="cursor-pointer font-semibold">Изменить запись</summary>
        <div className="mt-5 max-w-2xl">
          <ScanForm action={updateScan.bind(null, scan.id)} initial={scan} />
        </div>
      </details>

      <form action={deleteScan.bind(null, scan.id)}>
        <button className="btn btn-danger">Удалить запись</button>
      </form>
    </article>
  );
}
