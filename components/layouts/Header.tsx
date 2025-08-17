import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { menu as m } from "@/lib/content";
import AuthBtn from "./AuthBtn";

export default function Header() {
  return (
    <header className="h-16 bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Logo />
        {/* nav desktop */}
        <div>
          <div className="flex gap-1">
            {m.mainMenu.map((item) => (
              <Link href={item.url} key={item.label} className="px-3 py-2">
                {item.label}
              </Link>
            ))}
            <AuthBtn />
            <p>halo</p>
          </div>
        </div>
      </div>
    </header>
  );
}
