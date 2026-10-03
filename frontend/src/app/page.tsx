import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Каталог МРТ-снимков головного мозга</h1>
      <p>
        Приложение хранит записи об МРТ-снимках из открытых датасетов с указанием типа опухоли.
        Оно создано в рамках диссертации «Разработка системы распознавания опухолей головного мозга
        по МРТ-снимкам на основе глубокого обучения» и помогает готовить и анализировать данные для
        обучения модели.
      </p>
      <p>
        Встроенная нейросеть ResNet-18 распознаёт по загруженному снимку глиому, менингиому, опухоль
        гипофиза или отсутствие опухоли.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/scans/predict" className="rounded bg-blue-700 px-4 py-2 text-white">
          Распознать снимок
        </Link>
        <Link href="/scans" className="rounded border bg-white px-4 py-2">
          Перейти к снимкам
        </Link>
      </div>
    </section>
  );
}
