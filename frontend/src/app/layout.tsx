import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MRI Brain Tumor Scans",
  description: "Каталог МРТ-снимков головного мозга для исследования распознавания опухолей",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-2 p-4">
            <Link href="/" className="font-semibold">
              MRI Brain Tumor Scans
            </Link>
            <Link href="/scans">Снимки</Link>
            <Link href="/scans/predict">Распознать</Link>
            <Link href="/scans/new">Добавить</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
      </body>
    </html>
  );
}
