"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Распознать" },
  { href: "/scans", label: "Каталог" },
  { href: "/guide", label: "Справочник" },
  { href: "/model", label: "О модели" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap gap-0.5 sm:gap-1">
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-lg px-2.5 py-2 text-sm sm:px-3 font-medium transition-colors ${
                active ? "bg-primary-soft text-primary" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
