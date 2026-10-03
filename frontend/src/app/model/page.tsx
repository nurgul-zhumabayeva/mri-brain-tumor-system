import type { Metadata } from "next";
import { CLASS_METRICS, CLASS_ORDER, CONFUSION, MODEL, formatPercent } from "@/lib/model";
import { TUMOR_LABELS } from "@/lib/types";

export const metadata: Metadata = { title: "О модели | MRI Brain Tumor Scans" };

const PARAMS = [
  ["Архитектура", "ResNet-18, предобученная на ImageNet, дообучены все слои"],
  ["Данные", "Brain Tumor MRI Dataset (Kaggle), открытый датасет"],
  ["Вход", "Изображение 224×224, нормализация ImageNet"],
  ["Обучение", "5 эпох, оптимизатор Adam, шаг обучения 0,0001, размер батча 32"],
  ["Аугментация", "Горизонтальное отражение, поворот до 10°"],
  ["Среда", "Google Colab, GPU T4"],
  ["В приложении", "Формат ONNX, запуск через ONNX Runtime на процессоре"],
];

const LIMITS = [
  "Каждая пятая глиома распознана неверно: 47 из 400 отнесены к менингиоме, 32 к классу «без опухоли». Ответ «без опухоли» при настоящей опухоли самая серьёзная ошибка для этой задачи.",
  "Модель всегда выбирает один из четырёх классов. Изображение, которое не является МРТ головного мозга, она тоже отнесёт к одному из них.",
  "Плоскость снимка модель не определяет, это поле заполняется вручную.",
  "Модель не дообучается на загруженных снимках. Чтобы её улучшить, нужно провести обучение заново и заменить файл модели.",
];

export default function ModelPage() {
  return (
    <section className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <h1 className="page-title">О модели</h1>
        <p className="text-lg text-muted">
          Классификатор {MODEL.name} на четыре класса. На тестовой выборке из {MODEL.testSize}{" "}
          снимков верно распознано {formatPercent(MODEL.accuracy)}.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Как обучалась</h2>
        <dl className="panel divide-y divide-line">
          {PARAMS.map(([name, value]) => (
            <div key={name} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[12rem_1fr]">
              <dt className="text-sm font-semibold text-muted">{name}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Качество по классам</h2>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left">
            <thead className="text-sm text-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3 font-semibold">Класс</th>
                <th className="px-5 py-3 font-semibold">Точность (precision)</th>
                <th className="px-5 py-3 font-semibold">Полнота (recall)</th>
                <th className="px-5 py-3 font-semibold">F1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CLASS_ORDER.map((type) => (
                <tr key={type}>
                  <th scope="row" className="px-5 py-3 font-semibold">
                    {TUMOR_LABELS[type]}
                  </th>
                  <td className="px-5 py-3">{formatPercent(CLASS_METRICS[type].precision)}</td>
                  <td className="px-5 py-3">{formatPercent(CLASS_METRICS[type].recall)}</td>
                  <td className="px-5 py-3">{formatPercent(CLASS_METRICS[type].f1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Матрица ошибок</h2>
          <p className="mt-1 text-muted">
            Строка показывает настоящий класс, столбец показывает ответ модели. По диагонали стоят
            верные ответы, по {MODEL.perClass} снимков в каждой строке.
          </p>
        </div>
        <div className="panel overflow-x-auto p-5">
          <table className="w-full min-w-[34rem] table-fixed border-separate border-spacing-1.5 text-center">
            <thead>
              <tr className="text-sm text-muted">
                <td className="w-36" />
                {CLASS_ORDER.map((type) => (
                  <th key={type} scope="col" className="px-2 pb-1 font-semibold">
                    {TUMOR_LABELS[type]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONFUSION.map((row, i) => (
                <tr key={CLASS_ORDER[i]}>
                  <th scope="row" className="pr-3 text-right text-sm font-semibold text-muted">
                    {TUMOR_LABELS[CLASS_ORDER[i]]}
                  </th>
                  {row.map((value, j) => {
                    const share = value / MODEL.perClass;
                    const wrong = i !== j && value > 0;
                    return (
                      <td
                        key={CLASS_ORDER[j]}
                        className={`rounded-lg px-2 py-4 text-lg font-semibold ${
                          share > 0.5 ? "text-white" : wrong ? "text-danger" : "text-muted"
                        }`}
                        style={{
                          backgroundColor:
                            i === j
                              ? `rgba(11, 138, 138, ${0.15 + share * 0.85})`
                              : wrong
                                ? `rgba(179, 38, 30, ${0.06 + share * 1.2})`
                                : "#f2f6f9",
                        }}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ограничения</h2>
        <ul className="panel max-w-3xl divide-y divide-line">
          {LIMITS.map((text) => (
            <li key={text} className="px-5 py-3.5">
              {text}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
