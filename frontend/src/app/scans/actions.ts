"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { PLANES, TUMOR_TYPES } from "@/lib/types";
import type { FormState, Plane, ScanInput, TumorType } from "@/lib/types";

const INVALID = "Проверьте поля: название, датасет и тип опухоли обязательны.";

function parseForm(formData: FormData): ScanInput | null {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const title = text("title");
  const dataset = text("dataset");
  const tumorType = text("tumor_type");
  const plane = text("plane");
  if (title.length < 3 || dataset.length < 2) return null;
  if (!TUMOR_TYPES.includes(tumorType as TumorType)) return null;
  if (plane && !PLANES.includes(plane as Plane)) return null;
  return {
    title,
    dataset,
    tumor_type: tumorType as TumorType,
    plane: (plane as Plane) || null,
    description: text("description") || null,
    file_name: text("file_name") || null,
  };
}

export async function createScan(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) return { error: INVALID };

  let id: number;
  try {
    id = (await api.create(data)).id;
  } catch {
    return { error: "Не удалось сохранить. Возможно, снимок с таким именем файла уже есть." };
  }
  revalidatePath("/scans");
  redirect(`/scans/${id}`);
}

export async function updateScan(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) return { error: INVALID };

  try {
    await api.update(id, data);
  } catch {
    return { error: "Не удалось сохранить изменения." };
  }
  revalidatePath("/scans");
  redirect(`/scans/${id}`);
}

export async function deleteScan(id: number) {
  await api.remove(id);
  revalidatePath("/scans");
  redirect("/scans");
}
