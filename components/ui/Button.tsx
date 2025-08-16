"use client";

import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type Variant = "primary" | "outline" | "gray" | "danger";

type ButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: Variant;
  icon?: ReactNode; // icon di kiri
} & ComponentPropsWithoutRef<T>;

export default function Button<T extends ElementType = "button">({
  as,
  children,
  className,
  variant = "primary",
  icon,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";

  const variantClasses: Record<Variant, string> = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline: "ring-1 hover:ring-2 ring-inset ring-primary text-primary",
    gray: "bg-gray-100 ring-1 ring-inset ring-gray-200 text-gray-600 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <Component
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center px-4 py-2 rounded text-sm transition-colors disabled:opacity-50",
          variantClasses[variant],
          className
        )
      )}
      {...props}
    >
      {icon && <div className="mr-2 pt-[1px]">{icon}</div>}
      {children}
    </Component>
  );
}
