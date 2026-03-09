import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import { menu as m } from "@/lib/constants";

const footerMenu = m.footer;

export default function Footer() {
  return (
    <footer className="">
      <div className="bg-gray-800 text-white">
        <div className="container pt-12 pb-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full sm:w-1/4">
              <Logo />
            </div>
            <div className="w-full sm:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {footerMenu.map((item, i) => (
                <div key={i}>
                  <p className="h3 mb-3">{item.title}</p>
                  <nav>
                    {item.menu.map((link) => (
                      <Link
                        href={link.url}
                        key={link.label}
                        className="block text-sm py-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
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
