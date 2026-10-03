import { PredictForm } from "@/components/PredictForm";
import { predictScan } from "../actions";

export default function PredictPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Распознавание опухоли</h1>
      <p className="text-gray-600">
        Загрузите МРТ-снимок головного мозга. Нейросеть ResNet-18 определит один из четырёх классов:
        глиома, менингиома, опухоль гипофиза или отсутствие опухоли. Результат сохранится в каталоге.
      </p>
      <PredictForm action={predictScan} />
      <p className="text-sm text-gray-600">
        Это исследовательский прототип. Результат не является медицинским диагнозом.
      </p>
    </section>
  );
}
