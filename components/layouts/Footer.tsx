import Link from "next/link";
import React from "react";
import { menu } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="py-4 border-t text-center">
      <div className="container flex justify-center">
        <div className="flex flex-wrap mx-auto gap-4">
          {menu.footerMenu.map((item, i) => (
            <Link href={item.url} key={i} className="text-gray-600 text-sm">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
