"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menu as m } from "@/lib/content";

export default function NavDesktop() {
  const pathname = usePathname();
  return (
    <div>
      {m.mainMenu.map((item) => (
        <Link
          key={item.label}
          href={item.url}
          className={clsx("py-2 px-3 hover:bg-gray-100 text-sm text-gray-600 rounded", {
            "bg-gray-200": pathname === item.url,
          })}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
