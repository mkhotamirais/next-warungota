"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  variant?: "success" | "error" | null | undefined;
  children?: React.ReactNode;
  className?: string;
}

export default function Alert({ variant = "success", children = "Message", className }: Props) {
  return (
    <div
      className={cn(
        "border rounded-md px-3 py-2 text-sm mb-4",
        variant === "success" ? "border-green-400 text-green-600 bg-green-50" : "border-red-400 text-red-600 bg-red-50",
        className,
      )}
    >
      {children}
    </div>
  );
}
