"use client";

import React, { useState } from "react";
import { acc } from "./acc";
import { ChevronDown } from "lucide-react";

export default function Acc2() {
  // Menggunakan Array untuk menyimpan index yang sedang terbuka
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (i: number) => {
    setOpenIndexes((prev) =>
      // Jika index sudah ada, hapus (tutup). Jika belum, tambahkan (buka).
      prev.includes(i) ? prev.filter((index) => index !== i) : [...prev, i],
    );
  };

  return (
    <>
      <h2>Accordion Without Autoclose</h2>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {acc.map((item, i) => {
          const isOpen = openIndexes.includes(i);

          return (
            <div key={i} className="border-b last:border-none">
              <button
                type="button"
                onClick={() => toggleOpen(i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <span className={`font-semibold transition-colors ${isOpen ? "text-blue-600" : "text-gray-700"}`}>
                  {item.title}
                </span>
                <ChevronDown
                  className={`size-5 text-gray-400 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180 text-blue-600" : ""}`}
                />
              </button>

              {/* Tetap menggunakan trik Grid untuk animasi yang aman */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 mt-2 pt-4">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
