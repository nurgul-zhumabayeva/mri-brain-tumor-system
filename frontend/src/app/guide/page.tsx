import type { Metadata } from "next";
import { CLASS_METRICS, MODEL } from "@/lib/model";
import { TUMOR_LABELS } from "@/lib/types";
import type { TumorType } from "@/lib/types";

export const metadata: Metadata = { title: "Справочник | MRI Brain Tumor Scans" };

const ENTRIES: { type: TumorType; what: string; where?: string; mri: string }[] = [
  {
    type: "glioma",
    what: "Опухоль из глиальных клеток, опорной ткани мозга. К глиомам относятся астроцитомы, олигодендроглиомы и глиобластома.",
    where: "Внутри вещества мозга, чаще в больших полушариях.",
    mri: "Обычно без чёткой границы с окружающей тканью, часто с отёком вокруг. Структура неоднородная. При высокой степени злокачественности возможны участки некроза и кольцевидное накопление контраста.",
  },
  {
    type: "meningioma",
    what: "Опухоль из клеток паутинной оболочки мозга. В большинстве случаев доброкачественная и растёт медленно.",
    where:
      "Снаружи от вещества мозга, у твёрдой мозговой оболочки: под сводом черепа, у серпа мозга, на основании черепа.",
    mri: "Чётко очерченное образование на широком основании у оболочки. Обычно равномерно и ярко накапливает контраст. Характерен «дуральный хвост», утолщение оболочки рядом с опухолью.",
  },
  {
    type: "pituitary",
    what: "Чаще всего это аденома гипофиза, доброкачественная опухоль железы в основании мозга. Образования меньше 10 мм называют микроаденомами, от 10 мм и больше макроаденомами.",
    where: "В области турецкого седла, по средней линии основания черепа.",
    mri: "Образование в области турецкого седла. Крупные аденомы выходят за его пределы вверх и могут сдавливать перекрёст зрительных нервов.",
  },
  {
    type: "no_tumor",
    what: "Снимки без признаков опухоли. Класс нужен, чтобы модель могла ответить «опухоли нет», а не выбирала только между тремя диагнозами.",
    mri: "Структуры мозга симметричны, объёмных образований нет. Класс не означает отсутствия других заболеваний: модель их не оценивает.",
  },
];

export default function GuidePage() {
  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <h1 className="page-title">Справочник по классам</h1>
        <p className="text-lg text-muted">
          Четыре класса, которые различает модель: что они означают, где возникает опухоль и как она
          обычно выглядит на МРТ.
        </p>
      </header>

      <div className="panel divide-y divide-line">
        {ENTRIES.map((entry) => {
          const found = Math.round(CLASS_METRICS[entry.type].recall * MODEL.perClass);
          return (
            <article
              key={entry.type}
              className="grid gap-x-10 gap-y-4 p-5 sm:p-7 lg:grid-cols-[16rem_1fr]"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {TUMOR_LABELS[entry.type]}
                </h2>
                <p className="text-sm text-muted">
                  Модель верно определила {found} из {MODEL.perClass} тестовых снимков этого класса.
                </p>
              </div>
              <dl className="max-w-2xl space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-muted">Что это</dt>
                  <dd>{entry.what}</dd>
                </div>
                {entry.where && (
                  <div>
                    <dt className="text-sm font-semibold text-muted">Где возникает</dt>
                    <dd>{entry.where}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-semibold text-muted">Как выглядит на МРТ</dt>
                  <dd>{entry.mri}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      <p className="max-w-3xl text-sm text-muted">
        Описания даны в общем виде, чтобы объяснить классы модели. Это справочная информация, а не
        медицинская консультация. Диагноз ставит врач по полному исследованию.
      </p>
    </section>
  );
}
