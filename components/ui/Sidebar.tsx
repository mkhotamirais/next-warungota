"use client";

import { useState, createContext, useContext, ReactNode, isValidElement, cloneElement } from "react";
import clsx from "clsx";
import { FaXmark } from "react-icons/fa6";

// Context untuk Sidebar
const SidebarContext = createContext<{ close: () => void } | undefined>(undefined);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("SidebarClose must be used inside Sidebar");
  return ctx;
}

// Tambahkan prop 'side' dan 'classSide' ke interface
interface SidebarProps {
  children: ReactNode;
  trigger: ReactNode;
  bg?: string;
  title?: ReactNode;
  close?: boolean;
  className?: string;
  ariaLabel?: string;
  side?: "left" | "right";
  classSide?: string; // Props baru
}

export default function Sidebar({
  className,
  children,
  trigger,
  bg = "",
  title,
  close,
  ariaLabel = "menu",
  side = "right",
  classSide, // Tambahkan prop baru di sini
}: SidebarProps) {
  const [open, setOpen] = useState(false);

  // Tentukan kelas CSS untuk posisi dan transisi
  const sideClasses = {
    "right-0": side === "right",
    "left-0": side === "left",
    "translate-x-full": side === "right" && !open,
    "translate-x-0": open,
    "translate-x-[-100%]": side === "left" && !open,
  };

  return (
    <div className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen(!open)} aria-label={ariaLabel} className="flex items-center">
        {trigger}
      </button>
      <div
        className={clsx("fixed inset-0 z-50 transition-all", open ? "visible opacity-100" : "invisible opacity-0", bg)}
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "absolute w-64 h-full bg-white border border-gray-200 rounded shadow-lg transition-transform",
            sideClasses,
            classSide // Tambahkan props baru di sini
          )}
        >
          <SidebarContext.Provider value={{ close: () => setOpen(false) }}>
            <div className="p-3">
              <div className="flex items-center justify-between">
                {title}
                {close ? (
                  <SidebarClose>
                    <FaXmark />
                  </SidebarClose>
                ) : null}
              </div>
              {children}
            </div>
          </SidebarContext.Provider>
        </div>
      </div>
    </div>
  );
}

interface SidebarCloseProps {
  children: ReactNode;
  asChild?: boolean;
}

// Komponen khusus untuk menutup sidebar
export function SidebarClose({ children, asChild }: SidebarCloseProps) {
  const { close } = useSidebar();

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<React.DOMAttributes<HTMLElement>>;
    const originalOnClick = child.props.onClick as React.MouseEventHandler<HTMLElement> | undefined;

    const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
      if (typeof originalOnClick === "function") originalOnClick(e);
      close();
    };

    return cloneElement(child, {
      onClick: handleClick,
    });
  }

  return (
    <button type="button" aria-label="Close Sidebar" onClick={close} className="text-gray-500 hover:text-gray-700">
      {children}
    </button>
  );
}
