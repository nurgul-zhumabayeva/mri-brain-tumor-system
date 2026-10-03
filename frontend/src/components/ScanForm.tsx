"use client";

import { useActionState } from "react";
import { PLANE_LABELS, PLANES, TUMOR_LABELS, TUMOR_TYPES } from "@/lib/types";
import type { FormState, Scan } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Scan;
};

const field = "w-full rounded border bg-white px-3 py-2";

export function ScanForm({ action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        Название *
        <input name="title" required minLength={3} defaultValue={initial?.title} className={field} />
      </label>
      <label className="block">
        Датасет *
        <input
          name="dataset"
          required
          minLength={2}
          defaultValue={initial?.dataset}
          className={field}
        />
      </label>
      <label className="block">
        Тип опухоли *
        <select name="tumor_type" required defaultValue={initial?.tumor_type ?? ""} className={field}>
          <option value="" disabled>
            Выберите тип
          </option>
          {TUMOR_TYPES.map((t) => (
            <option key={t} value={t}>
              {TUMOR_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        Плоскость
        <select name="plane" defaultValue={initial?.plane ?? ""} className={field}>
          <option value="">Не указана</option>
          {PLANES.map((p) => (
            <option key={p} value={p}>
              {PLANE_LABELS[p]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        Имя файла
        <input name="file_name" defaultValue={initial?.file_name ?? ""} className={field} />
      </label>
      <label className="block">
        Описание
        <textarea
          name="description"
          rows={5}
          defaultValue={initial?.description ?? ""}
          className={field}
        />
      </label>

      {state.error && <p className="text-red-700">{state.error}</p>}

      <button
        disabled={pending}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Сохранение…" : "Сохранить"}
      </button>
    </form>
  );
}
