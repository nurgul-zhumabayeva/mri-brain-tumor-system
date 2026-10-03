import Link from "next/link";
import { ScanForm } from "@/components/ScanForm";
import { createScan } from "../actions";

export default function NewScanPage() {
  return (
    <section className="max-w-2xl space-y-6">
      <header className="space-y-3">
        <Link href="/scans" className="text-sm font-semibold text-primary hover:underline">
          Каталог снимков
        </Link>
        <h1 className="page-title">Новая запись</h1>
        <p className="text-muted">
          Для снимков, у которых тип опухоли уже известен, например из размеченного датасета. Чтобы
          тип определила модель, загрузите снимок на странице «Распознать».
        </p>
      </header>
      <div className="panel p-5">
        <ScanForm action={createScan} />
      </div>
    </section>
  );
}
