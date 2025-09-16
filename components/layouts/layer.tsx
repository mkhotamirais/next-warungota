"use client";

import { useGlobal } from "@/hooks/useGlobal";
import React from "react";

export default function Layer() {
  const {
    openLayer,
    setOpenLayer,
    openMoreBlogOption,
    setOpenMoreBlogOption,
    openMoreProductOption,
    setOpenMoreProductOption,
  } = useGlobal();
  return (
    <div
      onClick={() => {
        setOpenLayer(false);
        if (openMoreBlogOption) {
          setOpenMoreBlogOption(null);
        }
        if (openMoreProductOption) {
          setOpenMoreProductOption(null);
        }
      }}
      className={`${openLayer ? "visible oacity-100" : "invisible opacity-0"} fixed inset-0 z-40`}
    ></div>
  );
}
