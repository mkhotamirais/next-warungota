import React from "react";
import { menu as m } from "@/lib/content";
import Link from "next/link";

export default function NavDesktop() {
  return (
    <div className="flex gap-1">
      {m.mainMenu.map((item) => (
        <Link href={item.url} key={item.label} className="px-3 py-2">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
