import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Страница не найдена</h1>
      <p className="text-gray-600">Такой записи или страницы не существует.</p>
      <Link href="/scans" className="text-blue-700 underline">
        Вернуться к списку снимков
      </Link>
    </section>
  );
}
