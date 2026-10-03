"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
      <p className="text-gray-600">
        Не удалось получить данные. Проверьте, что сервер API запущен, и попробуйте ещё раз.
      </p>
      <button onClick={reset} className="rounded border bg-white px-4 py-2">
        Повторить
      </button>
    </section>
  );
}
