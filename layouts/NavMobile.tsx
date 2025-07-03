"use client";

import Logo from "@/components/Logo";
import Sheet2 from "@/components/Sheet2";
import React from "react";
import c from "@/lib/content.json";
import NavMobileAuthBtn from "./NavMobileAuthBtn";

export default function NavMobile() {
  return (
    <div className="flex sm:hidden">
      <Sheet2 title={<Logo />} menu={c.main_menu}>
        <NavMobileAuthBtn />\{" "}
      </Sheet2>
    </div>
  );
}
