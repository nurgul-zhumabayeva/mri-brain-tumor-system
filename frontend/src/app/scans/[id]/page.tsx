import { notFound } from "next/navigation";
import { ScanForm } from "@/components/ScanForm";
import { api } from "@/lib/api";
import { PLANE_LABELS, TUMOR_LABELS } from "@/lib/types";
import { deleteScan, updateScan } from "../actions";

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scanId = Number(id);
  if (!Number.isInteger(scanId)) notFound();
  const scan = await api.get(scanId);
  if (!scan) notFound();

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold break-all">{scan.title}</h1>
        <p className="text-gray-600">
          {TUMOR_LABELS[scan.tumor_type]} · {scan.dataset}
        </p>
      </header>

      {scan.predicted_label && scan.confidence !== null && (
        <section className="rounded border border-blue-200 bg-blue-50 p-4">
          <h2 className="font-semibold">Результат распознавания</h2>
          <p className="text-lg">
            {TUMOR_LABELS[scan.predicted_label]}, уверенность модели{" "}
            {(scan.confidence * 100).toFixed(1)}%
          </p>
          {scan.predicted_label !== scan.tumor_type && (
            <p className="text-sm text-gray-600">
              Тип опухоли в записи изменён вручную и отличается от предсказания модели.
            </p>
          )}
        </section>
      )}

      {scan.image_path && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/media/${scan.image_path}`}
          alt={`МРТ-снимок ${scan.title}`}
          className="max-h-96 max-w-full rounded border bg-black"
        />
      )}

      <dl className="grid gap-2 rounded border bg-white p-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-gray-600">Плоскость</dt>
          <dd>{scan.plane ? PLANE_LABELS[scan.plane] : "Не указана"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Имя файла</dt>
          <dd className="break-all">{scan.file_name ?? "Не указано"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Добавлен</dt>
          <dd>{new Date(scan.created_at).toLocaleDateString("ru-RU")}</dd>
        </div>
      </dl>

      {scan.description && <p className="whitespace-pre-line">{scan.description}</p>}

      <details className="rounded border bg-white p-4">
        <summary className="cursor-pointer font-semibold">Редактировать</summary>
        <div className="mt-4">
          <ScanForm action={updateScan.bind(null, scan.id)} initial={scan} />
        </div>
      </details>

      <form action={deleteScan.bind(null, scan.id)}>
        <button className="rounded border border-red-700 px-4 py-2 text-red-700">Удалить</button>
      </form>
    </article>
  );
}
