"use client";

import React, { useState } from "react";
import { acc } from "./acc";
import { ChevronDown } from "lucide-react";

export default function Acc1() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <h1>Accordion With Autoclose</h1>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {acc.map((item, i) => {
          const isOpen = open === i;

          return (
            <div key={i} className="group border-b last:border-none">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-all hover:bg-gray-50 cursor-pointer"
              >
                <span className={`font-semibold transition-colors ${isOpen ? "text-blue-600" : "text-gray-700"}`}>
                  {item.title}
                </span>
                <ChevronDown
                  className={`size-5 text-gray-400 transition-transform duration-300 ease-out ${isOpen ? "rotate-180 text-blue-600" : ""}`}
                />
              </button>

              {/* KONTAINER GRID (The Magic Part) */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 text-sm text-gray-500 leading-relaxed">{item.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
