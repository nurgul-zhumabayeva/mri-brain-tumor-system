import type { TumorType } from "./types";

export const MODEL = {
  name: "ResNet-18",
  accuracy: 0.9444,
  testSize: 1600,
  perClass: 400,
};

export const CLASS_ORDER: TumorType[] = ["glioma", "meningioma", "no_tumor", "pituitary"];

export const CLASS_METRICS: Record<TumorType, { precision: number; recall: number; f1: number }> = {
  glioma: { precision: 0.9877, recall: 0.8, f1: 0.884 },
  meningioma: { precision: 0.8912, recall: 0.9825, f1: 0.9346 },
  no_tumor: { precision: 0.9259, recall: 1, f1: 0.9615 },
  pituitary: { precision: 0.9876, recall: 0.995, f1: 0.9913 },
};

// Строки: настоящий класс, столбцы: ответ модели. Порядок как в CLASS_ORDER.
export const CONFUSION: number[][] = [
  [320, 47, 32, 1],
  [3, 393, 0, 4],
  [0, 0, 400, 0],
  [1, 1, 0, 398],
];

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits).replace(".", ",")}%`;
}
