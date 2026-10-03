"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

export function PredictForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        МРТ-снимок (JPG или PNG, до 10 МБ) *
        <input
          type="file"
          name="file"
          required
          accept="image/jpeg,image/png"
          className="mt-1 block w-full rounded border bg-white px-3 py-2"
        />
      </label>

      {state.error && <p className="text-red-700">{state.error}</p>}

      <button
        disabled={pending}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Распознавание…" : "Распознать"}
      </button>
    </form>
  );
}
