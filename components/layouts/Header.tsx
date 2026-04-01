"use client";

import React from "react";
import Logo from "../Logo";
import NavDesktop from "./NavDesktop";
// import NavMobile from "./NavMobile";
import { menu as m } from "@/lib/constants";
import AuthBtn from "./AuthBtn";
import NavMobilePushBtn from "./NavMobilePushBtn";
import NavMobilePush from "./NavMobilePushContent";
import { useMenuBar } from "@/hooks/zustand/useMenuBar";
// import CartBtn from "../CartBtn";

export default function Header() {
  const { openGlobalBar, setOpenGlobalBar } = useMenuBar();
  const menu = m.main;

  return (
    <header className="sticky top-0 bg-white z-30">
      <div className="container flex gap-8 items-center justify-between h-full min-h-16">
        <Logo />
        <div className="flex-1 flex gap-2 items-cente justify-end md:justify-between">
          <NavDesktop menu={m.main} />
          <div className="flex gap-2 items-center">
            {/* <CartBtn /> */}
            <AuthBtn />
            <NavMobilePushBtn open={openGlobalBar} setOpen={setOpenGlobalBar} />
          </div>
        </div>
      </div>
      <NavMobilePush open={openGlobalBar} setOpen={setOpenGlobalBar} menu={menu} />
    </header>
  );
}
