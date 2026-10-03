import { ScanForm } from "@/components/ScanForm";
import { createScan } from "../actions";

export default function NewScanPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Новый снимок</h1>
      <ScanForm action={createScan} />
    </section>
  );
}
