export const TUMOR_TYPES = ["glioma", "meningioma", "pituitary", "no_tumor"] as const;
export type TumorType = (typeof TUMOR_TYPES)[number];

export const TUMOR_LABELS: Record<TumorType, string> = {
  glioma: "Глиома",
  meningioma: "Менингиома",
  pituitary: "Опухоль гипофиза",
  no_tumor: "Без опухоли",
};

export const PLANES = ["axial", "sagittal", "coronal"] as const;
export type Plane = (typeof PLANES)[number];

export const PLANE_LABELS: Record<Plane, string> = {
  axial: "Аксиальная",
  sagittal: "Сагиттальная",
  coronal: "Корональная",
};

export type Scan = {
  id: number;
  title: string;
  dataset: string;
  tumor_type: TumorType;
  plane: Plane | null;
  description: string | null;
  file_name: string | null;
  created_at: string;
};

export type ScanInput = Omit<Scan, "id" | "created_at">;

export type FormState = { error?: string };
