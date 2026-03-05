import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import { menu as m } from "@/lib/constants";

const menu3 = m.footer.menu_3;

export default function Footer() {
  return (
    <footer className="">
      <div className="bg-gray-800 text-white">
        <div className="container pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Logo />
            <div>
              <Link href="/baas/appwrite">Appwrite</Link>
            </div>
            <div>menu2</div>
            <div>
              <p>Client Side</p>
              <div className="">
                {menu3.map((item, i) => (
                  <Link key={i} href={item.url} className="block">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 py-4">
          <div className="container">footer bottom</div>
        </div>
      </div>
    </footer>
  );
}
