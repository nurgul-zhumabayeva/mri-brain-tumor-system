import { TUMOR_LABELS } from "@/lib/types";
import type { TumorType } from "@/lib/types";

const STYLES: Record<TumorType, string> = {
  glioma: "bg-[#e3eef9] text-[#0b4f82]",
  meningioma: "bg-[#dff3f2] text-[#0a6b6b]",
  pituitary: "bg-[#ece9fb] text-[#4b3fa8]",
  no_tumor: "bg-[#e9eef2] text-[#44586a]",
};

export function TumorChip({ type }: { type: TumorType }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${STYLES[type]}`}
    >
      {TUMOR_LABELS[type]}
    </span>
  );
}
