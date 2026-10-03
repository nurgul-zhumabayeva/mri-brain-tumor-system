"use client";

import { useActionState } from "react";
import { PLANE_LABELS, PLANES, TUMOR_LABELS, TUMOR_TYPES } from "@/lib/types";
import type { FormState, Scan } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Scan;
};

export function ScanForm({ action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <label className="block text-sm font-medium">
        Название *
        <input
          name="title"
          required
          minLength={3}
          defaultValue={initial?.title}
          className="field text-base font-normal"
        />
      </label>
      <label className="block text-sm font-medium">
        Датасет *
        <input
          name="dataset"
          required
          minLength={2}
          defaultValue={initial?.dataset}
          className="field text-base font-normal"
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Тип опухоли *
          <select
            name="tumor_type"
            required
            defaultValue={initial?.tumor_type ?? ""}
            className="field text-base font-normal"
          >
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
        <label className="block text-sm font-medium">
          Плоскость
          <select
            name="plane"
            defaultValue={initial?.plane ?? ""}
            className="field text-base font-normal"
          >
            <option value="">Не указана</option>
            {PLANES.map((p) => (
              <option key={p} value={p}>
                {PLANE_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Имя файла
        <input
          name="file_name"
          defaultValue={initial?.file_name ?? ""}
          className="field text-base font-normal"
        />
      </label>
      <label className="block text-sm font-medium">
        Описание
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          className="field text-base font-normal"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-[10px] bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button disabled={pending} className="btn btn-primary">
        {pending ? "Сохранение…" : "Сохранить запись"}
      </button>
    </form>
  );
}
