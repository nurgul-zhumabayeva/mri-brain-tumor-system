import Link from "next/link";
import { PredictForm } from "@/components/PredictForm";
import { TumorChip } from "@/components/TumorChip";
import { CLASS_METRICS, CLASS_ORDER, MODEL, formatPercent } from "@/lib/model";
import { predictScan } from "./scans/actions";

const STEPS = [
  {
    title: "Загрузка",
    text: "Снимок приводится к размеру 224×224 пикселя, как при обучении модели.",
  },
  {
    title: "Классификация",
    text: "Нейросеть ResNet-18 оценивает вероятность каждого из четырёх классов.",
  },
  {
    title: "Результат",
    text: "Класс и уверенность сохраняются в каталоге. Запись можно проверить и исправить.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid items-start gap-x-10 gap-y-8 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-4 lg:pt-6">
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            Определите тип опухоли по МРТ-снимку головного мозга
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Загрузите снимок, и нейросеть отнесёт его к одному из четырёх классов: глиома,
            менингиома, опухоль гипофиза или отсутствие опухоли.
          </p>
        </div>

        <div className="panel p-4 shadow-[0_18px_40px_-24px_rgba(15,42,61,0.45)] sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <PredictForm action={predictScan} />
        </div>

        <ol className="max-w-xl space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-soft text-sm font-semibold text-teal">
                {index + 1}
              </span>
              <p>
                <span className="font-semibold">{step.title}.</span>{" "}
                <span className="text-muted">{step.text}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Насколько точна модель</h2>
            <p className="mt-1 text-muted">
              Проверка на {MODEL.testSize} снимках, которых модель не видела при обучении. Общая
              точность {formatPercent(MODEL.accuracy)}.
            </p>
          </div>
          <Link href="/model" className="font-semibold text-primary hover:underline">
            Подробнее о модели
          </Link>
        </div>

        <dl className="panel divide-y divide-line">
          {CLASS_ORDER.map((type) => {
            const recall = CLASS_METRICS[type].recall;
            return (
              <div
                key={type}
                className="grid items-center gap-x-4 gap-y-2 p-4 sm:grid-cols-[11rem_1fr_9rem]"
              >
                <dt>
                  <TumorChip type={type} />
                </dt>
                <dd className="h-2.5 overflow-hidden rounded-full bg-canvas">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${recall * 100}%` }}
                  />
                </dd>
                <dd className="text-sm text-muted sm:text-right">
                  найдено{" "}
                  <span className="font-semibold text-ink">
                    {Math.round(recall * MODEL.perClass)} из {MODEL.perClass}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>
    </div>
  );
}
